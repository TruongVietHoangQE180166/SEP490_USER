'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Menu, 
  Search, 
  Book, 
  Settings, 
  Users, 
  Zap, 
  Shield, 
  MessageCircle, 
  HelpCircle, 
  Cpu, 
  Globe,
  FileText,
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { DocumentationTopic } from '../types';

// Dynamic imports for doc components
const DocumentationContents: Record<string, React.ComponentType> = {
  'introduction': dynamic(() => import('../contents/Introduction'), { loading: () => <LoadingPlaceholder /> }),
  'trading-basics': dynamic(() => import('../contents/TradingBasics'), { loading: () => <LoadingPlaceholder /> }),
  'doc-3': dynamic(() => import('../contents/Doc3'), { loading: () => <LoadingPlaceholder /> }),
  'doc-4': dynamic(() => import('../contents/Doc4'), { loading: () => <LoadingPlaceholder /> }),
  'doc-5': dynamic(() => import('../contents/Doc5'), { loading: () => <LoadingPlaceholder /> }),
  'doc-6': dynamic(() => import('../contents/Doc6'), { loading: () => <LoadingPlaceholder /> }),
  'doc-7': dynamic(() => import('../contents/Doc7'), { loading: () => <LoadingPlaceholder /> }),
  'doc-8': dynamic(() => import('../contents/Doc8'), { loading: () => <LoadingPlaceholder /> }),
  'doc-9': dynamic(() => import('../contents/Doc9'), { loading: () => <LoadingPlaceholder /> }),
  'doc-10': dynamic(() => import('../contents/Doc10'), { loading: () => <LoadingPlaceholder /> }),
};

const LoadingPlaceholder = () => (
  <div className="w-full h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
    <div className="w-16 h-16 bg-muted rounded-2xl" />
    <div className="h-4 w-48 bg-muted rounded-full" />
  </div>
);

const topics: DocumentationTopic[] = [
  { 
    id: 'introduction', 
    title: 'Giới thiệu dự án', 
    icon: 'Globe',
    sections: [
      { id: 'welcome', title: 'Chào mừng' },
      { id: 'mission', title: 'Sứ mệnh' },
      { id: 'how-it-works', title: 'Cách hoạt động' },
      { id: 'video-intro', title: 'Video giới thiệu' }
    ]
  },
  { 
    id: 'trading-basics', 
    title: 'Giao dịch cơ bản', 
    icon: 'Zap',
    sections: [
      { id: 'basics', title: 'Khái niệm cơ bản' },
      { id: 'terms', title: 'Thuật ngữ cốt lõi' },
      { id: 'analysis', title: 'Phương pháp phân tích' },
      { id: 'order-types', title: 'Các loại lệnh' },
      { id: 'demo-trading', title: 'Hệ thống Demo' },
      { id: 'safety', title: 'An toàn & Rủi ro' }
    ]
  },
  { id: 'doc-3', title: 'Quản lý tài khoản', icon: 'Shield', sections: [] },
  { id: 'doc-4', title: 'Công nghệ hệ thống', icon: 'Cpu', sections: [] },
  { id: 'doc-5', title: 'Cộng đồng VIC', icon: 'Users', sections: [] },
  { id: 'doc-6', title: 'Công cụ phái sinh', icon: 'Settings', sections: [] },
  { id: 'doc-7', title: 'Hỗ trợ trực tuyến', icon: 'MessageCircle', sections: [] },
  { id: 'doc-8', title: 'Câu hỏi thường gặp', icon: 'HelpCircle', sections: [] },
  { id: 'doc-9', title: 'Quy chuẩn nội dung', icon: 'FileText', sections: [] },
  { id: 'doc-10', title: 'Lộ trình phát triển', icon: 'Book', sections: [] },
];

export const DocumentationModule = () => {
  const [activeTopicId, setActiveTopicId] = useState('introduction');
  const [activeSection, setActiveSection] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const ContentComponent = DocumentationContents[activeTopicId];

  const currentIndex = topics.findIndex(t => t.id === activeTopicId);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const handleNextPrev = (id: string) => {
    setActiveTopicId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const sections = activeTopic.sections;
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTopic]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Sidebar - Navigation stack */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[99999] w-full lg:w-auto lg:relative lg:inset-auto lg:z-0 lg:border-r border-border/40 bg-background lg:bg-muted/2 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shrink-0",
        isSidebarCollapsed 
          ? "-translate-x-full lg:translate-x-0 lg:w-20" 
          : "translate-x-0 lg:w-80"
      )}>
        <div className={cn(
            "sticky top-0 lg:top-32 space-y-12 pt-10 lg:pt-6 pb-10 h-full lg:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar transition-all duration-300 bg-background lg:bg-transparent",
            isSidebarCollapsed ? "px-4 items-center" : "px-6 lg:px-8"
        )}>
          {/* Header Title with Icon & Toggle inside */}
          <div className={cn("flex items-center justify-between gap-3 mb-8 lg:mb-6", isSidebarCollapsed && "flex-col-reverse")}>
             <div className={cn("flex items-center gap-3", isSidebarCollapsed && "flex-col")}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 leading-none">
                    <Book size={20} />
                </div>
                {!isSidebarCollapsed && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <h2 className="text-lg font-black tracking-tight text-foreground leading-tight">Thư viện VIC</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-nowrap">Hướng dẫn chuyên sâu</p>
                    </div>
                )}
             </div>
             <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={cn(
                    "p-2.5 rounded-xl bg-muted/30 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-background transition-all",
                    isSidebarCollapsed ? "mt-2" : "ml-auto"
                )}
                title={isSidebarCollapsed ? "Mở danh mục" : "Thu gọn"}
             >
                {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : (
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-wider">
                    <span className="lg:hidden text-primary">Đóng menu</span>
                    <PanelLeftClose size={18} />
                  </div>
                )}
             </button>
          </div>

            <div className="space-y-6">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-left-2">
                 <span className="w-1 h-3 bg-primary rounded-full" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Danh mục bài viết</h3>
              </div>
            )}
            <div className="space-y-2.5">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopicId(topic.id);
                    if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "w-full flex items-center gap-3.5 px-3 py-3 rounded-lg text-[13px] font-bold transition-all duration-300 text-left relative group/item",
                    activeTopicId === topic.id 
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 translate-x-1" 
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-1",
                    isSidebarCollapsed && "justify-center px-0 translate-x-0"
                  )}
                  title={isSidebarCollapsed ? topic.title : ""}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 shrink-0",
                    activeTopicId === topic.id ? "bg-white/20 rotate-0" : "bg-muted/80 group-hover/item:bg-muted group-hover/item:rotate-12"
                  )}>
                    {getIcon(topic.icon, activeTopicId === topic.id)}
                  </div>
                  {!isSidebarCollapsed && (
                    <>
                        <span className="flex-1 truncate tracking-tight animate-in fade-in slide-in-from-left-2">{topic.title}</span>
                        {activeTopicId === topic.id && <ChevronRight size={14} className="opacity-60" />}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-background pt-6 px-4 md:px-10 pb-10 lg:pt-10 lg:px-8 lg:pl-12 transition-all duration-300">
        <div className="max-w-[1850px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopicId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:pl-0"
            >
              {/* Mobile Hamburger Toggle */}
              <div className="lg:hidden flex items-center gap-4 mb-8 pb-4 border-b border-border/10">
                <button 
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/40 flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-all shadow-md active:scale-95"
                >
                  <Menu size={24} />
                </button>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[16px] font-black uppercase tracking-[0.1em] text-foreground leading-none">Danh mục</span>
                  <p className="text-[13px] text-primary font-black tracking-tight leading-normal">Tài liệu dự án VICTEACH</p>
                </div>
              </div>

              <div className="mb-12 space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Book size={12} /> Tài liệu hướng dẫn
                 </div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    {activeTopic.title}
                 </h1>
                 <div className="h-1.5 w-20 bg-primary rounded-full shadow-lg shadow-primary/20" />
              </div>
              
              <div>
                 {ContentComponent && <ContentComponent />}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-border/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prevTopic ? (
                  <button 
                    onClick={() => handleNextPrev(prevTopic.id)}
                    className="flex items-center gap-4 p-5 rounded-md bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-md bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all">
                       <ArrowLeft size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Quay lại bài trước</span>
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{prevTopic.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextTopic ? (
                  <button 
                    onClick={() => handleNextPrev(nextTopic.id)}
                    className="flex items-center justify-between gap-4 p-5 rounded-md bg-muted/30 border border-border/40 hover:border-primary/40 hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 transition-all group text-right"
                  >
                    <div className="flex flex-col min-w-0 order-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Tiếp tục chủ đề</span>
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{nextTopic.title}</span>
                    </div>
                    <div className="w-10 h-10 rounded-md bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all order-2">
                       <ArrowRight size={18} />
                    </div>
                  </button>
                ) : <div />}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="mt-10 py-10 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border/40">
                   <Shield size={20} className="text-muted-foreground/60" />
                </div>
                <div className="flex flex-col">
                   <p className="text-sm font-bold text-foreground">VIC Teach Ecosystem</p>
                   <p className="text-xs font-medium text-muted-foreground">© 2026 Toàn bộ bản quyền được bảo lưu.</p>
                </div>
             </div>
             <Button variant="outline" className="h-12 px-6 rounded-md font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-none shadow-lg shadow-primary/20 flex items-center gap-2">
                <HelpCircle size={18} />
                Bạn cần hỗ trợ?
             </Button>
          </div>
        </div>
      </main>
      {/* Right Sidebar - On This Page */}
      <aside className="hidden xl:block w-72 shrink-0 py-10 px-8">
        <div className="sticky top-32 pt-6 space-y-6 border-l border-border/40 pl-6 text-right">
          <AnimatePresence mode="wait">
            {activeTopic.sections.length > 0 ? (
              <motion.div 
                key={activeTopicId + '-right-sections'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Trên trang này
                </h3>
                <div className="space-y-4">
                  {activeTopic.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-start gap-3 text-[11px] font-bold transition-all text-left group/toc",
                        activeSection === section.id 
                          ? "text-primary translate-x-1" 
                          : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                      )}
                    >
                      <span className="line-clamp-2 leading-relaxed">{section.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
                <div className="space-y-4 opacity-50">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-border" /> Trên trang này
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium italic">Không có mục phụ cho tài liệu này.</p>
                </div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
};

const getIcon = (iconName: string, active: boolean) => {
  const props = { size: 16, className: active ? 'text-white' : 'text-primary' };
  switch (iconName) {
    case 'Globe': return <Globe {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Settings': return <Settings {...props} />;
    case 'MessageCircle': return <MessageCircle {...props} />;
    case 'HelpCircle': return <HelpCircle {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'Book': return <Book {...props} />;
    default: return <Book {...props} />;
  }
};
