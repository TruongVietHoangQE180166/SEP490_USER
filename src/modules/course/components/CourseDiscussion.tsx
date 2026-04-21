'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from '@legendapp/state/react';
import { useCourseChat } from '../hooks/useCourseChat';
import { courseChatService } from '../courseChatService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Crown, 
  Sparkles, 
  Medal,
  Loader2,
  ChevronDown,
  Lock,
  Edit2,
  Trash2,
  Ban,
  MoreHorizontal,
  GraduationCap,
  User as UserIcon,
  X,
  Clock,
  Plus,
  Minus,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

export const CourseDiscussion = observer(({ courseId, isEnrolled = true }: { courseId: string, isEnrolled?: boolean }) => {
  const { messages, isLoading, sendMessage, user, course, fetchHistory } = useCourseChat(courseId);
  const isAuthorGlobal = course?.authorId === user?.userId || course?.createdBy === user?.userId || course?.createdBy === (user as void | any)?.username;
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN' || user?.roles?.some(r => r.toUpperCase() === 'ADMIN');
  const isModerator = isAuthorGlobal || isAdmin;
  
  const [banStatus, setBanStatus] = useState<{isBanned: boolean, bannedUntil: string | null} | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal states
  const [deleteConfirmMsgId, setDeleteConfirmMsgId] = useState<string | null>(null);
  const [editModState, setEditModState] = useState<{id: string, content: string} | null>(null);
  const [banModState, setBanModState] = useState<{userId: string, userName: string} | null>(null);
  const [banDuration, setBanDuration] = useState<number | null>(null); // Hours, null = permanent
  const [showBannedAlert, setShowBannedAlert] = useState(false);
  const [showBannedUsersModal, setShowBannedUsersModal] = useState(false);
  const [bannedUsersList, setBannedUsersList] = useState<any[]>([]);
  const [unbanConfirmState, setUnbanConfirmState] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    if (user?.userId && courseId) {
      courseChatService.checkIfBanned(courseId, user.userId).then(setBanStatus);
    }
  }, [user?.userId, courseId]);

  // Subscribe to real-time BAN changes (Manual Bans & Unbans)
  useEffect(() => {
    if (!courseId || !user?.userId) return;

    const channel = courseChatService.subscribeToBans(courseId, (payload) => {
      // 1. Nếu có người bị CẤM mới (INSERT)
      if (payload.eventType === 'INSERT') {
        if (payload.new?.user_id === user.userId) {
          setBanStatus({ isBanned: true, bannedUntil: payload.new.banned_until });
        }
      } 
      // 2. Nếu có người được GỠ CẤM (DELETE)
      else if (payload.eventType === 'DELETE') {
        // Vì Supabase DELETE payload mặc định chỉ trả về ID, 
        // ta sẽ re-fetch lại trạng thái cho chắc chắn nếu chính mình đang bị ban
        courseChatService.checkIfBanned(courseId, user.userId).then(setBanStatus);
      }

      // Luôn cập nhật danh sách của Teacher nếu đang mở Modal
      if (showBannedUsersModal) {
        courseChatService.getBannedUsers(courseId).then(setBannedUsersList);
      }
    });

    return () => {
      courseChatService.unsubscribe(channel);
    };
  }, [courseId, user?.userId, showBannedUsersModal]);

  // Handle Automatic Ban Expiry (Timer-based unlock)
  useEffect(() => {
    if (banStatus?.isBanned && banStatus.bannedUntil) {
      const expiry = new Date(banStatus.bannedUntil).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff > 0) {
        const timer = setTimeout(() => {
          setBanStatus(null);
        }, diff);
        return () => clearTimeout(timer);
      } else {
        // Already expired
        setBanStatus(null);
      }
    }
  }, [banStatus]);

  const handleShowBannedUsers = async () => {
    try {
      setShowBannedUsersModal(true);
      const users = await courseChatService.getBannedUsers(courseId);
      setBannedUsersList(users);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng bị cấm");
    }
  };

  const handleUnban = (banId: string, userName: string) => {
    setUnbanConfirmState({ id: banId, name: userName });
  };

  const executeUnban = async () => {
    if (!unbanConfirmState) return;
    const { id: banId, name: userName } = unbanConfirmState;
    
    try {
      const success = await courseChatService.unbanUser(banId);
      
      if (success) {
        // Update local list
        const users = await courseChatService.getBannedUsers(courseId);
        setBannedUsersList(users);

        // Broadcast manual unban
        await sendMessage("🌟 Tài khoản " + userName + " đã được gỡ cấm chat. Chào mừng bạn quay trở lại thảo luận!");
        toast.success(`Đã gỡ cấm cho người dùng ${userName} thành công`);
      } else {
        toast.error("Không thể gỡ cấm người dùng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gỡ cấm người dùng");
    } finally {
      setUnbanConfirmState(null);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmMsgId) return;
    try {
      const success = await courseChatService.deleteMessage(deleteConfirmMsgId);
      if (success) {
        toast.success("Xóa tin nhắn thành công");
      } else {
        toast.error("Không thể xóa tin nhắn");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa tin nhắn");
    } finally {
      setDeleteConfirmMsgId(null);
      if(fetchHistory) fetchHistory();
    }
  };

  const executeEdit = async () => {
    if (!editModState || !editModState.content.trim()) return;
    try {
      const success = await courseChatService.editMessage(editModState.id, editModState.content.trim());
      if (success) {
        toast.success("Cập nhật tin nhắn thành công");
      } else {
        toast.error("Không thể cập nhật tin nhắn");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật tin nhắn");
    } finally {
      setEditModState(null);
      if(fetchHistory) fetchHistory();
    }
  };

  const executeBan = async () => {
    if (!banModState) return;
    const numHours = banDuration;
    
    try {
      // Cập nhật hàm ban có kèm tên người dùng
      const success = await courseChatService.banUser(courseId, banModState.userId, user?.userId || 'system', numHours, banModState.userName);
      
      if (success) {
        // Broadcast system message
        let durationText = "vĩnh viễn";
        if (numHours) {
          if (numHours < 1) durationText = `trong ${numHours * 60} phút`;
          else if (numHours < 24) durationText = `trong ${numHours} giờ`;
          else durationText = `trong ${Math.round(numHours / 24)} ngày`;
        }
        
        const msgText = "⚠️ Người dùng " + banModState.userName + " đã bị cấm chat " + durationText + " do vi phạm tiêu chuẩn cộng đồng.";
        await sendMessage(msgText);
        toast.success(`Đã cấm người dùng ${banModState.userName} thành công`);
      } else {
        toast.error("Không thể thực hiện cấm người dùng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cấm người dùng");
    } finally {
      setBanModState(null);
      setBanDuration(null);
      if(fetchHistory) fetchHistory();
    }
  };
  // Direct ref on the scrollable div — no Radix wrapper to pierce through
  const scrollRef = useRef<HTMLDivElement>(null);
  // Invisible anchor element at the very bottom of the message list
  const bottomRef = useRef<HTMLDivElement>(null);

  const isAtBottomRef = useRef(true);
  const [isAtBottomState, setIsAtBottomState] = useState(true);
  const prevMsgCountRef = useRef(0);
  const initialScrollDoneRef = useRef(false);

  // Scroll listener — attached directly on the div
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop < 80;
      isAtBottomRef.current = atBottom;
      setIsAtBottomState(atBottom);
      if (atBottom) setUnreadCount(0);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll within the container — NOT scrollIntoView (which scrolls the whole page)
    el.scrollTo({ top: el.scrollHeight, behavior });
    setUnreadCount(0);
    isAtBottomRef.current = true;
    setIsAtBottomState(true);
  }, []);

  // React to new messages
  useEffect(() => {
    if (messages.length === 0) return;

    if (!initialScrollDoneRef.current) {
      // Initial history load — jump to bottom immediately, no unread badge
      scrollToBottom('instant');
      initialScrollDoneRef.current = true;
      prevMsgCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMsgCountRef.current) {
      const newMsgs = messages.slice(prevMsgCountRef.current);
      const isMine = newMsgs[newMsgs.length - 1]?.user_id === user?.userId;

      if (isMine) {
        scrollToBottom('instant');
      } else if (isAtBottomRef.current) {
        scrollToBottom('smooth');
      } else {
        setUnreadCount(prev => prev + newMsgs.length);
      }
    }

    prevMsgCountRef.current = messages.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, scrollToBottom]);

  const handleSend = async () => {
    if (!newContent.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (user?.userId && courseId) {
        const liveBanStatus = await courseChatService.checkIfBanned(courseId, user.userId);
        if (liveBanStatus?.isBanned) {
          setBanStatus(liveBanStatus);
          setNewContent('');
          setShowBannedAlert(true);
          return;
        }
      }

      await sendMessage(newContent);
      setNewContent('');
      scrollToBottom('instant');
    } catch (error) {
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelBadge = (level: string, role?: string) => {
    // Admins and Teachers don't need levels
    const r = role?.toUpperCase() || '';
    if (r === 'ADMIN' || r === 'TEACHER' || r === 'INSTRUCTOR') return null;

    const l = level?.toLowerCase() || '';
    if (l.includes('1') || l.includes('nhập') || l.includes('nhap')) {
      return { label: 'Nhập môn', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: <Medal className="w-3 h-3" /> };
    }
    if (l.includes('2') || l.includes('nền') || l.includes('nen')) {
      return { label: 'Nền tảng', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: <Medal className="w-3 h-3" /> };
    }
    if (l.includes('3') || l.includes('trung')) {
      return { label: 'Trung cấp', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <Medal className="w-3 h-3" /> };
    }
    if (l.includes('4') || l.includes('thực') || l.includes('thuc')) {
      return { label: 'Thực hành', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', icon: <Medal className="w-3 h-3" /> };
    }
    if (l.includes('5') || l.includes('nâng') || l.includes('nang')) {
      return { label: 'Nâng cao', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: <Medal className="w-3 h-3" /> };
    }
    return { label: level || 'Học viên', color: 'text-primary bg-primary/10 border-primary/20', icon: <Medal className="w-3 h-3" /> };
  };

  const getRoleInfo = (role: string) => {
    const r = role?.toUpperCase() || 'STUDENT';
    if (r === 'ADMIN') {
      return { 
        label: 'Quản trị viên', 
        color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        bubble: 'bg-rose-500/5 border-rose-500/20 ring-1 ring-rose-500/10',
        icon: <ShieldCheck className="w-3 h-3" />,
        isTeacher: true,
        isAdmin: true
      };
    }
    if (r === 'TEACHER' || r === 'INSTRUCTOR') {
      return { 
        label: 'Giảng viên', 
        color: 'bg-primary/10 text-primary border-primary/20',
        bubble: 'bg-primary/5 border-primary/20 ring-1 ring-primary/10',
        icon: <GraduationCap className="w-3 h-3" />,
        isTeacher: true
      };
    }
    return { 
      label: 'Học viên', 
      color: 'bg-muted/30 text-muted-foreground border-border/50',
      bubble: 'bg-muted/50 border-border/50',
      icon: <UserIcon className="w-3 h-3" />,
      isTeacher: false
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary border border-primary/20 shadow-xl shadow-primary/5">
               <MessageSquare className="h-7 w-7" />
               <div className="absolute inset-0 bg-primary/5 blur-xl animate-pulse" />
             </div>
             <div className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border/50">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Thảo luận khóa học</h2>
            </div>
            <p className="text-sm font-medium text-muted-foreground/80">Kênh trao đổi trực tiếp cùng Giảng viên và cộng đồng học viên.</p>
          </div>
        </div>
        
        {(isAuthorGlobal || isAdmin) && (
           <Button variant="outline" className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-500 font-bold" onClick={handleShowBannedUsers}>
              <Ban className="h-4 w-4 mr-2" />
              Danh sách cấm
           </Button>
        )}
      </div>

      <Card className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/60 shadow-2xl backdrop-blur transition-all hover:border-border/60 relative">
        {isEnrolled ? (
          <>
            {/* Scrollable message area — plain div for reliable ref access */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-2 scrollbar-hide"
        >
          <div className="space-y-10">
            {isLoading && messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                <p className="animate-pulse font-bold text-muted-foreground">Đang kết nối cộng đồng...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="relative">
                   <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 border border-primary/10">
                     <Users className="h-12 w-12 text-primary/20" />
                   </div>
                   <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-amber-500/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground/30">Chưa có ai lên tiếng</h3>
                  <p className="mx-auto max-w-xs text-sm font-medium text-muted-foreground/40">Hãy đặt câu hỏi đầu tiên để bắt đầu hành trình thảo luận nhé!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isAuthor = msg.is_author;
                const isMe = msg.user_id === user?.userId;
                const msgAuthorIsAdmin = msg.user_role === 'ADMIN';
                const roleInfo = getRoleInfo(msg.user_role);
                const levelBadge = getLevelBadge(msg.user_level, msg.user_role);

                // Moderation logic: Admin vs Author protection
                let canModerateMsg = false;
                if (!isMe) {
                    if (isAdmin && !isAuthor) canModerateMsg = true;
                    if (isAuthorGlobal && !msgAuthorIsAdmin) canModerateMsg = true;
                }

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-4",
                      isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                       <Avatar className={cn(
                         "h-12 w-12 border-2 shadow-sm transition-transform hover:scale-105",
                         isAuthor ? "border-amber-500 ring-4 ring-amber-500/10" : roleInfo.isAdmin ? "border-rose-500 ring-4 ring-rose-500/10" : roleInfo.isTeacher ? "border-primary ring-4 ring-primary/10" : "border-border/60"
                       )}>
                         <AvatarImage src={msg.user_avatar} />
                         <AvatarFallback className="font-bold">{msg.user_name[0]}</AvatarFallback>
                       </Avatar>
                       {isMe && <span className="text-[10px] font-black uppercase tracking-tighter text-primary/60">Bạn</span>}
                    </div>

                    <div className={cn(
                      "flex flex-col max-w-[85%] space-y-2",
                      isMe ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "flex flex-wrap items-center gap-1.5 px-0.5",
                        isMe ? "justify-end" : "justify-start"
                      )}>
                        <span className={cn(
                          "text-[13px] font-black tracking-tight",
                          isAuthor ? "text-amber-600" : roleInfo.isAdmin ? "text-rose-600" : roleInfo.isTeacher ? "text-primary" : "text-foreground/80"
                        )}>
                          {msg.user_name}
                        </span>

                        {isAuthor && (
                          <Badge className="h-5 border-none bg-gradient-to-r from-amber-500 to-orange-500 px-2 text-[9px] font-black text-white shadow-lg shadow-amber-500/20">
                            <Crown className="mr-1 h-2.5 w-2.5" />
                            TÁC GIẢ
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className={cn("h-5 border text-[9px] font-black px-1.5 capitalize", roleInfo.color)}>
                          {roleInfo.label}
                        </Badge>

                        {!roleInfo.isTeacher && levelBadge && msg.user_level !== 'N/A' && (
                          <Badge variant="outline" className={cn("h-5 border text-[9px] font-black px-1.5", levelBadge.color)}>
                            {levelBadge.label}
                          </Badge>
                        )}
                        
                        <span className="ml-1 text-[10px] font-bold text-muted-foreground/30">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className={cn(
                        "relative flex items-center group/msg gap-2",
                        isMe ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "relative rounded-[1.75rem] p-4 px-5 text-sm font-medium leading-relaxed shadow-sm transition-all duration-300",
                          isMe 
                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20" 
                            : cn(
                                "rounded-tl-none",
                                roleInfo.bubble,
                                isAuthor && "bg-amber-500/5 border-amber-500/30 text-foreground ring-1 ring-amber-500/20 shadow-amber-500/5 group-hover:bg-amber-500/10"
                              )
                        )}>
                          {msg.content}
                          
                          {isAuthor && !isMe && (
                            <div className="absolute -right-3 -top-3 flex h-8 w-8 scale-110 rotate-12 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl">
                              <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Hover Action Buttons */}
                        <div className={cn(
                          "flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-300",
                          isMe ? "flex-row-reverse -translate-x-2 group-hover/msg:translate-x-0" : "flex-row translate-x-2 group-hover/msg:translate-x-0"
                        )}>
                          {isMe && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-foreground/40 hover:bg-primary/10 hover:text-primary transition-all" title="Chỉnh sửa" onClick={() => setEditModState({ id: msg.id, content: msg.content })}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {(isMe || canModerateMsg) && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-foreground/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all" title="Xóa tin nhắn" onClick={() => setDeleteConfirmMsgId(msg.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {canModerateMsg && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-foreground/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all" title="Cấm chat người này" onClick={() => setBanModState({ userId: msg.user_id, userName: msg.user_name })}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
          {/* Scroll anchor — matches support chat pattern */}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Floating Scroll to Bottom / Unread Indicator */}
        <AnimatePresence>
          {!isAtBottomState && (
            <motion.div 
              key="scroll-to-bottom-btn"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]"
            >
              <Button
                onClick={() => scrollToBottom('smooth')}
                variant={unreadCount > 0 ? "default" : "secondary"}
                className={cn(
                  "rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-2 px-6 py-2 h-10 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all",
                  unreadCount > 0 
                    ? "bg-primary text-white border-background/20 animate-pulse" 
                    : "bg-background/90 text-foreground border-border/50 backdrop-blur-md"
                )}
              >
                <ChevronDown className={cn("w-4 h-4", unreadCount > 0 && "animate-bounce")} />
                {unreadCount > 0 ? `${unreadCount} tin nhắn mới` : 'Về mới nhất'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Input Area */}
        <div className="relative z-10 bg-transparent p-4 md:p-5 w-full shrink-0">
          {banStatus?.isBanned ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-rose-500/5 border border-rose-500/20 p-4 w-full min-h-[60px]">
               <div className="flex items-center gap-4">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                    <Ban className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black tracking-tight text-rose-500">Tài khoản bị hạn chế</h4>
                    <p className="text-[11px] font-medium text-rose-500/80 mt-0.5">
                      Hết hạn: {banStatus.bannedUntil ? new Date(banStatus.bannedUntil).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Vĩnh viễn'}
                    </p>
                 </div>
               </div>
               <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm shrink-0"
                  onClick={() => {
                    if (user?.userId && courseId) {
                      courseChatService.checkIfBanned(courseId, user.userId).then(setBanStatus);
                    }
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Kiểm tra trạng thái
               </Button>
            </div>
          ) : (
            <>
              <div className="relative flex items-end gap-3 rounded-[2rem] bg-muted/40 p-2 pl-5 transition-all duration-300 focus-within:bg-background focus-within:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] focus-within:dark:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.05)] border border-transparent focus-within:border-primary/20 group hover:bg-muted/50">
                <textarea
                  placeholder="Chia sẻ góc nhìn hoặc đặt câu hỏi..."
                  className="flex-1 w-full resize-none bg-transparent py-2.5 font-medium text-[15px] leading-relaxed outline-none border-none min-h-[44px] max-h-[160px] overflow-y-auto text-foreground placeholder:text-muted-foreground/40 scrollbar-hide"
                  rows={1}
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                  <Button
                    onClick={handleSend}
                    disabled={!newContent.trim() || isSubmitting}
                    className={cn(
                      "h-11 w-11 rounded-full transition-all duration-300 relative overflow-hidden group/btn",
                      newContent.trim() 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-0 hover:shadow-xl hover:shadow-primary/30" 
                        : "bg-muted-foreground/10 text-muted-foreground/40 shadow-none border-0"
                    )}
                  >
                    {newContent.trim() && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    )}
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : <Send className="h-5 w-5 ml-0.5 relative z-10" />}
                  </Button>
                </motion.div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                 <span>Nhấn Enter để gửi</span>
                 <span className="h-1 w-1 rounded-full bg-border" />
                 <span>Shift + Enter để xuống dòng</span>
              </div>
            </>
          )}
        </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center space-y-6 relative overflow-hidden bg-background/50">
             <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/20 backdrop-blur-md z-0" />
             <div className="relative z-10 flex flex-col items-center space-y-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 text-primary border-2 border-primary/20 shadow-2xl shadow-primary/20 rotate-12 transition-transform hover:rotate-0">
                   <Lock className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-foreground tracking-tight">Khu vực dành riêng cho học viên</h3>
                   <p className="text-sm font-medium text-foreground/50 max-w-[320px] mx-auto leading-relaxed">Vui lòng đăng ký khóa học này để có thể xem, hỏi đáp và tham gia thảo luận cùng giảng viên và cộng đồng.</p>
                </div>
                <Button 
                   className="mt-6 rounded-full bg-primary text-white font-bold px-8 h-12 text-[15px] shadow-xl shadow-primary/30 active:scale-95 transition-all hover:-translate-y-1" 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                   Đăng ký để mở khóa
                </Button>
             </div>
          </div>
        )}

        {/* Modals Overlay */}
        <AnimatePresence>
           {/* DELETE MODAL */}
           {deleteConfirmMsgId && (
             <motion.div key="delete-msg-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center space-y-5">
                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                      <Trash2 className="h-6 w-6" />
                   </div>
                   <div className="space-y-2">
                       <h3 className="text-xl font-bold text-foreground">Xóa tin nhắn?</h3>
                       <p className="text-sm font-medium text-muted-foreground/80">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa không?</p>
                   </div>
                   <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirmMsgId(null)}>Hủy bỏ</Button>
                      <Button className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white" onClick={executeDelete}>Xóa ngay</Button>
                   </div>
                </motion.div>
             </motion.div>
           )}

           {/* EDIT MODAL */}
           {editModState && (
             <motion.div key="edit-msg-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                   <div className="flex items-center gap-3 text-primary">
                      <Edit2 className="h-5 w-5" />
                      <h3 className="text-lg font-bold text-foreground">Chỉnh sửa tin nhắn</h3>
                   </div>
                   <textarea
                     className="w-full h-32 p-4 rounded-xl bg-muted/40 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 transition-all custom-scrollbar"
                     value={editModState.content}
                     onChange={(e) => setEditModState({ ...editModState, content: e.target.value })}
                     placeholder="Nhập nội dung mới..."
                   />
                   <div className="flex gap-3 justify-end pt-2">
                      <Button variant="outline" className="rounded-xl px-6" onClick={() => setEditModState(null)}>Hủy</Button>
                      <Button className="rounded-xl px-6 bg-primary text-primary-foreground font-bold hover:bg-primary/90" onClick={executeEdit} disabled={!editModState.content.trim()}>Lưu thay đổi</Button>
                   </div>
                </motion.div>
             </motion.div>
           )}

           {/* BAN MODAL */}
           {banModState && (
             <motion.div key="ban-user-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-5">
                   <div className="flex items-center gap-3 text-rose-500">
                      <Ban className="h-6 w-6" />
                      <h3 className="text-lg font-bold text-foreground">Cấm chat người dùng</h3>
                   </div>
                   <div className="space-y-4">
                       <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                          <p className="text-xs font-medium text-rose-500 leading-relaxed text-center">
                             Tài khoản: <strong className="font-black underline">{banModState.userName}</strong>
                          </p>
                       </div>

                       <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                             <Clock className="w-3 h-3" />
                             Chọn thời gian cấm
                           </label>
                           
                           <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: 'Vĩnh viễn', value: null },
                                { label: '15 phút', value: 0.25 },
                                { label: '1 tiếng', value: 1 },
                                { label: '2 tiếng', value: 2 },
                                { label: '5 tiếng', value: 5 },
                                { label: '10 tiếng', value: 10 },
                                { label: '1 ngày', value: 24 },
                                { label: '3 ngày', value: 72 },
                                { label: '10 ngày', value: 240 },
                              ].map((option) => (
                                <button
                                  key={option.label}
                                  type="button"
                                  onClick={() => setBanDuration(option.value)}
                                  className={cn(
                                    "px-2 py-2.5 rounded-xl text-[11px] font-bold transition-all border",
                                    banDuration === option.value 
                                      ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25" 
                                      : "bg-muted/40 text-muted-foreground border-border/50 hover:border-rose-500/50 hover:bg-rose-500/5"
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                           </div>
                           <p className="text-[10px] text-center text-muted-foreground italic font-medium">Bấm để chọn thời gian cấm nhanh</p>
                       </div>
                   </div>
                   <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setBanModState(null)}>Hủy</Button>
                      <Button className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black" onClick={executeBan}>Xác nhận</Button>
                   </div>
                </motion.div>
             </motion.div>
           )}

           {/* BANNED USERS MODAL */}
           {showBannedUsersModal && (
             <motion.div key="banned-users-list-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5 flex flex-col max-h-[80vh]">
                   <div className="flex items-center justify-between pb-4 border-b border-border/40">
                      <div className="flex items-center gap-3 text-rose-500">
                         <Ban className="h-6 w-6" />
                         <h3 className="text-xl font-bold text-foreground">Danh sách cấm chat</h3>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowBannedUsersModal(false)}>
                         <X className="h-4 w-4" />
                      </Button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {bannedUsersList.length === 0 ? (
                         <div className="py-10 text-center text-muted-foreground/50 text-sm font-medium">
                            Chưa có người dùng nào bị cấm chat.
                         </div>
                      ) : (
                         bannedUsersList.map((b: any) => (
                           <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 group hover:border-border/80 transition-all">
                              <div className="space-y-1">
                                 <p className="font-black text-foreground">{b.reason || 'User ID: ' + b.user_id}</p>
                                 <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded-full w-fit border border-rose-500/10">
                                    <Clock className="w-3 h-3" />
                                    <span>Hết hạn: {b.banned_until ? new Date(b.banned_until).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Vĩnh viễn'}</span>
                                 </div>
                                 <div className="text-[10px] text-muted-foreground/60 font-medium">
                                    Cấm bởi: {b.banned_by}
                                 </div>
                              </div>
                              <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 text-xs font-black hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm" onClick={() => handleUnban(b.id, b.reason || 'Người dùng')}>
                                 Gỡ cấm
                              </Button>
                           </div>
                         ))
                      )}
                   </div>
                </motion.div>
             </motion.div>
           )}

           {/* BANNED ALERT MODAL */}
           {showBannedAlert && (
             <motion.div key="banned-alert-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center space-y-5">
                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                      <Ban className="h-6 w-6" />
                   </div>
                   <div className="space-y-2">
                       <h3 className="text-xl font-bold text-foreground">Tài khoản bị hạn chế</h3>
                       <p className="text-sm font-medium text-muted-foreground/80">
                         Tin nhắn bị từ chối: Tài khoản của bạn đã bị cấm tham gia thảo luận khóa học này.
                       </p>
                   </div>
                   <div className="pt-2">
                      <Button className="w-full rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={() => setShowBannedAlert(false)}>Đã hiểu</Button>
                   </div>
                </motion.div>
             </motion.div>
           )}

           {/* UNBAN CONFIRMATION MODAL */}
           {unbanConfirmState && (
             <motion.div key="unban-confirm-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background border border-border/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center space-y-5">
                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <Sparkles className="h-6 w-6" />
                   </div>
                   <div className="space-y-2">
                       <h3 className="text-xl font-bold text-foreground">Gỡ cấm chat?</h3>
                       <p className="text-sm font-medium text-muted-foreground/80">
                         Bạn có chắc chắn muốn gỡ cấm cho <strong className="text-foreground">{unbanConfirmState.name}</strong>?
                         Họ sẽ có thể tham gia thảo luận ngay lập tức.
                       </p>
                   </div>
                   <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setUnbanConfirmState(null)}>Hủy bỏ</Button>
                      <Button className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold" onClick={executeUnban}>Gỡ cấm ngay</Button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>
      </Card>
    </div>
  );
});
