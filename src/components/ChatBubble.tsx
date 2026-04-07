'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  User, 
  Mic, 
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  SideSheet, 
  SideSheetContent, 
  SideSheetHeader, 
  SideSheetTitle, 
  SideSheetTrigger,
  SideSheetDescription
} from '@/components/ui/side-sheet';
import { cn } from '@/lib/utils';
import { AUTH_ROUTES, ROUTES } from '@/constants/routes';
import { motion } from 'framer-motion';
import { authState$ } from '@/modules/auth/store';
import { chatState$ } from '@/modules/support-chat/store';
import { SupportChatService } from '@/modules/support-chat/services';
import { SupportMessage } from '@/modules/support-chat/types';
import { observer } from '@legendapp/state/react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- Helper Component for Course Inquiry Cards ---
const CourseInquiryCard = ({ content, isMe }: { content: string, isMe: boolean }) => {
  try {
    const data = JSON.parse(content.replace('[COURSE_INQUIRY]', ''));
    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
    
    return (
      <div className={cn(
        "flex flex-col w-56 sm:w-64 overflow-hidden rounded-2xl border shadow-md bg-background transition-all hover:scale-[1.02]",
        isMe ? "border-primary/30" : "border-border"
      )}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img src={data.thumbnail} alt={data.title} className="h-full w-full object-cover" />
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary/90 text-white border-0 text-[10px] font-bold shadow-sm">KHÓA HỌC</Badge>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <h4 className="text-xs font-bold line-clamp-2 leading-tight text-foreground">{data.title}</h4>
          <p className="text-sm font-black text-primary">{formatPrice(data.price)}</p>
          <Link href={`/course/${data.slug}`} target="_blank">
            <button className="w-full bg-primary text-primary-foreground h-8 text-[11px] font-bold rounded-lg mt-1 hover:bg-primary/90 transition-colors">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    );
  } catch (e) {
    return <div className="p-3 bg-muted rounded-xl text-xs italic">Thông tin khóa học không hợp lệ</div>;
  }
};

export const ChatBubble = observer(() => {
  const pathname = usePathname();
  const user = authState$.user.get();
  const isAuthenticated = authState$.isAuthenticated.get();
  const userId = user?.userId || (typeof window !== 'undefined' ? (localStorage.getItem('guest_id') || (() => {
    const gid = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guest_id', gid);
    return gid;
  })()) : 'guest');

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Visibility logic matching SearchDock
  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));
  const isLearnPage = pathname?.startsWith('/learn');
  const isAdminPage = pathname?.startsWith('/admin');
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isTradingPage = pathname?.startsWith('/trading');

  // Load chat history & subscribe to realtime
  useEffect(() => {
    if (!userId) return;

    const loadHistory = async () => {
      setIsLoading(true);
      const history = await SupportChatService.getHistory(userId);
      setMessages(history);
      setIsLoading(false);
    };

    loadHistory();

    // Realtime subscription
    const channel = SupportChatService.subscribeToMessages(userId, (newMsg) => {
      setMessages(prev => {
        // If message already exists, replace it (handles UPDATES like is_read)
        const msgIdx = prev.findIndex(m => m.id === newMsg.id);
        if (msgIdx > -1) {
          const updated = [...prev];
          updated[msgIdx] = newMsg;
          return updated;
        }
        return [...prev, newMsg];
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const unreadCount = useMemo(() => {
    return messages.filter(m => m.sender_id !== userId && !m.is_read).length;
  }, [messages, userId]);

  // Mark messages from admin as read ONLY when chat window is OPEN
  useEffect(() => {
    if (chatState$.isOpen.get() && messages.length > 0 && userId) {
      SupportChatService.markAsRead(userId, 'admin');
    }
  }, [chatState$.isOpen.get(), messages.length, userId]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !userId) return;

    const content = chatInput.trim();
    setChatInput('');

    try {
      // Get role directly from the reactive authState$ (which is loaded from user_data)
      const userRoleFull = authState$.user.role.peek() || 'user';
      let senderRole: 'user' | 'admin' | 'teacher' = 'user';
      
      const roleUpper = String(userRoleFull).toUpperCase();
      if (roleUpper.includes('ADMIN')) senderRole = 'admin';
      else if (roleUpper.includes('TEACHER')) senderRole = 'teacher';

      await SupportChatService.sendMessage({
        userId,
        senderId: userId,
        senderRole,
        senderName: user?.username || 'Khách',
        content,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const userRole = user?.role;

  if (isAuthPage || isLearnPage || isAdminPage || isTeacherPage || isTradingPage || userRole === 'ADMIN') return null;

  return (
    <SideSheet 
      side="left" 
      width="500px"
      open={chatState$.isOpen.get()}
      onOpenChange={(open) => chatState$.isOpen.set(open)}
    >
      <SideSheetTrigger>
        <motion.button 
          id="global-chat-bubble" 
          initial={{ y: 0 }}
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1, y: 0 }}
          whileTap={{ scale: 0.9 }}
          className="group fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] shadow-primary/40 ring-4 ring-primary/20 cursor-pointer pointer-events-auto"
        >
          <MessageCircle size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <Sparkles size={16} className="absolute top-2 right-2 text-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          
          {unreadCount > 0 && !chatState$.isOpen.get() && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 z-30 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold border-2 border-background shadow-lg animate-bounce"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </motion.button>
      </SideSheetTrigger>
      
      <SideSheetContent className="flex flex-col h-full bg-background border-r border-border p-0 sm:p-0 rounded-none!">
        <SideSheetHeader className="p-6 border-b border-border flex flex-col space-y-1 shrink-0">
          <SideSheetTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="text-primary" />
            Hỗ trợ trực tuyến
          </SideSheetTitle>
          <SideSheetDescription>
            Kết nối với Giảng viên hoặc Quản trị viên để được hỗ trợ.
          </SideSheetDescription>
        </SideSheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-full gap-3 text-muted-foreground">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm">Đang tải lịch sử trò chuyện...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle size={32} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Chưa có tin nhắn</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Bắt đầu cuộc trò chuyện với Admin bên dưới.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const showDate = index === 0 || 
                new Date(msg.created_at).toDateString() !== new Date(messages[index-1].created_at).toDateString();
              const isMe = msg.sender_id === userId;

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-[10px] bg-muted/50 px-2 py-1 rounded-full text-muted-foreground uppercase tracking-widest font-bold">
                        {new Date(msg.created_at).toLocaleDateString([], { weekday: 'long', day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <div className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}>
                    {!isMe && (
                      <span className="text-[10px] font-bold text-primary px-1 capitalize">
                        {msg.sender_role === 'admin' ? 'Hỗ trợ' : 'Giảng viên'}
                      </span>
                    )}
                    <div className={cn(
                      "relative text-sm break-words whitespace-pre-wrap transition-all shadow-sm",
                      msg.content.startsWith('[COURSE_INQUIRY]') 
                        ? "bg-transparent p-0 ring-0 shadow-none" 
                        : isMe 
                          ? "bg-primary text-primary-foreground rounded-tr-none ring-1 ring-primary/20 p-3 rounded-2xl" 
                          : "bg-muted rounded-tl-none ring-1 ring-border p-3 rounded-2xl"
                    )}>
                      {msg.content.startsWith('[COURSE_INQUIRY]') ? (
                        <CourseInquiryCard content={msg.content} isMe={isMe} />
                      ) : (
                        msg.content
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[9px] text-muted-foreground tabular-nums">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && msg.is_read && (
                        <span className="text-[9px] font-bold text-primary animate-in fade-in slide-in-from-right-1">
                          • Đã xem
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {isAuthenticated ? (
          <div className="p-4 border-t border-border bg-background/80 backdrop-blur-md shrink-0">
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[52px] max-h-32 overflow-y-auto block"
                  placeholder="Nhập tin nhắn..."
                  style={{ height: 'auto' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl h-[52px] w-[52px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground text-center">
              Nhấn Enter để gửi, Shift + Enter để xuống dòng
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-border bg-muted/30 text-center space-y-4 shrink-0">
            <div className="flex flex-col items-center gap-2">
              <User size={32} className="text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">Bạn cần đăng nhập để được hỗ trợ</p>
              <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                Vui lòng đăng nhập tài khoản của bạn để có thể gửi thắc mắc cho đội ngũ hỗ trợ.
              </p>
            </div>
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        )}
      </SideSheetContent>
    </SideSheet>
  );
});
