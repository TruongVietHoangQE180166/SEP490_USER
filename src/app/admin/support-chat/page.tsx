'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MessageCircle, 
  User, 
  Send, 
  Mic, 
  MoreVertical, 
  Clock,
  ArrowLeft,
  Loader2,
  Inbox
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SupportChatService } from '@/modules/support-chat/services';
import { SupportMessage } from '@/modules/support-chat/types';
import { cn } from '@/lib/utils';
import { authState$ } from '@/modules/auth/store';
import { observer } from '@legendapp/state/react';

interface ChatRoom {
  user_id: string;
  last_message: string;
  created_at: string;
  sender_name?: string;
  unread_count: number;
  last_sender_role: 'user' | 'admin' | 'teacher';
  client_role: 'user' | 'teacher';
}

// --- Helper Component for Course Inquiry Cards ---
const CourseInquiryCard = ({ content, isMe }: { content: string, isMe: boolean }) => {
  try {
    const data = JSON.parse(content.replace('[COURSE_INQUIRY]', ''));
    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
    
    return (
      <div className={cn(
        "flex flex-col w-56 sm:w-64 overflow-hidden rounded-2xl border shadow-md bg-background transition-transform hover:scale-[1.02]",
        isMe ? "border-primary/30" : "border-border"
      )}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img src={data.thumbnail} alt={data.title} className="h-full w-full object-cover" />
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary/90 text-white border-0 text-[10px] font-bold">KHÓA HỌC</Badge>
          </div>
        </div>
        <div className="p-3 space-y-2">
          <h4 className="text-xs font-bold line-clamp-2 leading-tight text-foreground">{data.title}</h4>
          <p className="text-sm font-black text-primary">{formatPrice(data.price)}</p>
          <Link href={`/course/${data.slug}`} target="_blank">
            <Button size="sm" className="w-full h-8 text-[11px] font-bold rounded-lg mt-1">Xem chi tiết</Button>
          </Link>
        </div>
      </div>
    );
  } catch (e) {
    return <div className="p-3 bg-muted rounded-xl text-xs italic">Thông tin khóa học không hợp lệ</div>;
  }
};

const AdminChatPage = observer(() => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentAdmin = authState$.user.get();

  // Load initial rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      const data = await SupportChatService.getAllConversations();
      setRooms(data);
      setIsLoadingRooms(false);
    };
    fetchRooms();

    // Subscribe to all messages to update room list in real-time
    const channel = SupportChatService.subscribeToAllMessages((newMsg) => {
      setRooms(prev => {
        const existingRoomIdx = prev.findIndex(r => r.user_id === newMsg.user_id);
        const currentRoom = prev[existingRoomIdx];
        const currentUnread = currentRoom?.unread_count || 0;
        const currentClientRole = currentRoom?.client_role || (newMsg.sender_role !== 'admin' ? newMsg.sender_role : 'user');
        
        // If we are currently looking at this room, don't increment unread count
        const isCurrentlySelected = selectedRoom?.user_id === newMsg.user_id;

        const roomTitle = newMsg.sender_role !== 'admin' 
          ? (newMsg.sender_name || 'Khách') 
          : (currentRoom?.sender_name || 'Khách');

        const updatedRoom: ChatRoom = {
          user_id: newMsg.user_id,
          last_message: newMsg.content,
          created_at: newMsg.created_at,
          sender_name: roomTitle,
          unread_count: (!isCurrentlySelected && (newMsg.sender_role === 'user' || newMsg.sender_role === 'teacher')) 
            ? currentUnread + 1 
            : (isCurrentlySelected ? 0 : currentUnread),
          last_sender_role: newMsg.sender_role,
          client_role: (newMsg.sender_role === 'user' || newMsg.sender_role === 'teacher') ? newMsg.sender_role : currentClientRole as any
        };

        if (existingRoomIdx > -1) {
          const newRooms = [...prev];
          newRooms.splice(existingRoomIdx, 1);
          return [updatedRoom, ...newRooms];
        }
        return [updatedRoom, ...prev];
      });

      // If current selected room is the one receiving message, add or update messages
      if (selectedRoom?.user_id === newMsg.user_id) {
        setMessages(prev => {
          const msgIdx = prev.findIndex(m => m.id === newMsg.id);
          if (msgIdx > -1) {
            const updated = [...prev];
            updated[msgIdx] = newMsg;
            return updated;
          }
          return [...prev, newMsg];
        });
        
        // If message is from user/teacher and it's a NEW message (!is_read), mark as read
        if ((newMsg.sender_role === 'user' || newMsg.sender_role === 'teacher') && !newMsg.is_read) {
          SupportChatService.markAsRead(newMsg.user_id, newMsg.sender_role);
          // Update room unread count locally
          setRooms(rooms => rooms.map(r => 
            r.user_id === newMsg.user_id ? { ...r, unread_count: 0 } : r
          ));
        }
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [selectedRoom]);

  // Load messages when room selected
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      const data = await SupportChatService.getHistory(selectedRoom.user_id);
      setMessages(data);
      setIsLoadingMessages(false);
      
      // Mark as read when selected
      if (selectedRoom.unread_count > 0) {
        SupportChatService.markAsRead(selectedRoom.user_id, 'user');
        SupportChatService.markAsRead(selectedRoom.user_id, 'teacher');
        setRooms(rooms => rooms.map(r => 
          r.user_id === selectedRoom.user_id ? { ...r, unread_count: 0 } : r
        ));
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedRoom || !currentAdmin) return;
    
    const content = chatInput.trim();
    setChatInput('');

    try {
      const senderRole: 'user' | 'admin' | 'teacher' = 'admin';

      await SupportChatService.sendMessage({
        userId: selectedRoom.user_id,
        senderId: currentAdmin.userId || 'admin',
        senderRole,
        senderName: currentAdmin.username || 'Admin',
        content,
      });

      // After replying, ensure all messages from this client are marked as read
      SupportChatService.markAsRead(selectedRoom.user_id, 'user');
      SupportChatService.markAsRead(selectedRoom.user_id, 'teacher');
      setRooms(prev => prev.map(r => 
        r.user_id === selectedRoom.user_id ? { ...r, unread_count: 0 } : r
      ));
    } catch (err) {
      console.error('Failed to send admin message:', err);
    }
  };

  const filteredRooms = rooms.filter(r => 
    (r.sender_name || 'Khách').toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'teacher': return 'Giảng viên';
      case 'user': return 'Học viên';
      default: return 'Khách';
    }
  };

  return (
    <div className="flex bg-background h-full overflow-hidden">
      {/* Sidebar - Room List */}
      <div className={cn(
        "w-full md:w-80 border-r border-border flex flex-col bg-muted/5",
        selectedRoom ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Inbox size={20} className="text-primary" />
              Hội thoại
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
              {rooms.length}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {isLoadingRooms ? (
            <div className="flex flex-col items-center justify-center p-8 gap-3 text-muted-foreground">
              <Loader2 className="animate-spin text-primary" />
              <p className="text-xs">Đang tải danh sách...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
              <MessageCircle size={40} className="text-muted/20" />
              <p className="text-sm text-muted-foreground">Không tìm thấy hội thoại nào</p>
            </div>
          ) : (
            filteredRooms.map(room => (
              <button
                key={room.user_id}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "w-full p-4 flex gap-3 hover:bg-primary/5 transition-colors text-left relative group",
                  selectedRoom?.user_id === room.user_id && "bg-primary/[0.08]"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <User size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className={cn(
                        "text-sm truncate font-semibold",
                        room.unread_count > 0 ? "text-foreground font-bold" : "text-muted-foreground"
                      )}>
                        {room.sender_name || 'Khách'}
                      </h3>
                      <span className={cn(
                        "text-[8px] font-bold px-1 py-0.5 rounded border leading-none shrink-0",
                        room.client_role === 'teacher' 
                          ? "border-orange-500/50 text-orange-500 bg-orange-500/5" 
                          : "border-blue-500/50 text-blue-500 bg-blue-500/5"
                      )}>
                        {room.client_role === 'teacher' ? 'GV' : 'HV'}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(room.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-xs truncate transition-colors",
                      room.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {(room.last_sender_role === 'admin' || room.last_sender_role === 'teacher') && (
                        <span className="text-primary font-bold mr-1">
                          {room.last_sender_role === 'admin' ? 'Bạn (Admin):' : 'Bạn (GV):'}
                        </span>
                      )}
                      {room.last_message}
                    </p>
                    {room.unread_count > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shrink-0 animate-in zoom-in">
                        {room.unread_count}
                      </span>
                    )}
                  </div>
                </div>
                {selectedRoom?.user_id === room.user_id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Chat window */}
      <div className={cn(
        "flex-1 flex flex-col bg-background relative",
        !selectedRoom ? "hidden md:flex items-center justify-center" : "flex"
      )}>
        {!selectedRoom ? (
          <div className="text-center space-y-4 max-w-sm px-6">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={48} className="text-muted/40" />
            </div>
            <h2 className="text-2xl font-bold">Chọn khách hàng cần hỗ trợ</h2>
            <p className="text-muted-foreground text-sm">
              Chọn bất kỳ hội thoại nào từ danh sách bên trái để bắt đầu trả lời thắc mắc của người dùng.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{selectedRoom?.sender_name || 'Khách'}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Đang trực tuyến
                    <span className="mx-1">•</span>
                    ID: {selectedRoom?.user_id.slice(0, 8)}...
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
              {isLoadingMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="animate-spin" />
                  <p className="text-xs">Đang tải lịch sử...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào trong cuộc hội thoại này.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const showTime = index === 0 || 
                    new Date(msg.created_at).getTime() - new Date(messages[index-1].created_at).getTime() > 1000 * 60 * 10;
                  const isMe = msg.sender_id === currentAdmin?.userId;

                  return (
                    <React.Fragment key={msg.id}>
                      {showTime && (
                        <div className="flex justify-center my-2">
                          <span className="text-[10px] font-medium bg-muted/50 px-2 py-1 rounded-full text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "flex flex-col gap-1 max-w-[70%]",
                        isMe ? "self-end items-end" : "self-start items-start"
                      )}>
                        <div className="flex items-center gap-2 px-1">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                            isMe 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {getRoleLabel(msg.sender_role)}
                          </span>
                        </div>
                        <div className={cn(
                          "relative text-sm break-words whitespace-pre-wrap transition-all shadow-sm",
                          msg.content.startsWith('[COURSE_INQUIRY]') 
                            ? "bg-transparent p-0 ring-0 shadow-none" 
                            : isMe 
                              ? "bg-primary text-primary-foreground rounded-tr-sm p-3 rounded-2xl" 
                              : "bg-muted rounded-tl-sm p-3 rounded-2xl"
                        )}>
                          {msg.content.startsWith('[COURSE_INQUIRY]') ? (
                            <CourseInquiryCard content={msg.content} isMe={isMe} />
                          ) : (
                            msg.content
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && msg.is_read && (
                            <span className="text-[10px] font-bold text-primary animate-in fade-in slide-in-from-right-1">
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

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-md">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
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
                    className="w-full bg-muted/20 border border-border rounded-xl pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[52px] max-h-32 overflow-y-auto block"
                    placeholder="Nhập tin nhắn trả lời..."
                    style={{ height: 'auto' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || !selectedRoom}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl h-[52px] w-[52px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default AdminChatPage;
