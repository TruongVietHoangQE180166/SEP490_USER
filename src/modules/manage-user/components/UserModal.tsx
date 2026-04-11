import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  CircleUser, 
  Shield, 
  Venus, 
  Mars,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users
} from 'lucide-react';
import { User } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'create' | 'edit' | 'view';
  onSave: (userData: Partial<User>) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, mode, onSave }) => {
  const [formData, setFormData] = React.useState<Partial<User>>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    role: 'USER',
    gender: 'MALE',
  });

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          ...user,
          password: '', // Don't populate password on edit
        });
      } else {
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: '',
          phoneNumber: '',
          role: 'USER',
          gender: 'MALE',
        });
      }
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isView = mode === 'view';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
          >
            {/* Close Button - Moved outside header for absolute reliability */}
            <div className="absolute top-4 right-4 z-[110]">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="rounded-full bg-background/50 hover:bg-background text-foreground backdrop-blur-md transition-all border border-border/40 shadow-sm"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Glossy Header */}
            <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background flex items-center px-8 border-b border-border/10">
              <div className="z-10 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg backdrop-blur-md border border-primary/20 shadow-sm">
                    <Sparkles className="text-primary h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Hệ thống</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {mode === 'create' ? 'Tạo tài khoản mới' : mode === 'edit' ? 'Cập nhật tài khoản' : mode === 'view' ? 'Chi tiết người dùng' : ''}
                </h2>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div className="group space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <CircleUser size={12} className="text-primary" /> Username
                    </Label>
                    <Input
                      disabled={isView || mode === 'edit'}
                      value={formData.username || ''}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="h-12 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-base transition-all group-hover:bg-muted/60"
                      placeholder="hoangvcxxx123"
                      required
                    />
                  </div>

                  <div className="group space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <UserIcon size={12} className="text-primary" /> Họ và tên
                    </Label>
                    <Input
                      disabled={isView}
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-12 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-base transition-all"
                      placeholder="Nguyễn Văn Hoàng"
                      required
                    />
                  </div>

                  <div className="group space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Mail size={12} className="text-primary" /> Email liên hệ
                    </Label>
                    <Input
                      type="email"
                      disabled={isView}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-base transition-all"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="group space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Lock size={12} className="text-primary" /> Mật khẩu truy cập
                    </Label>
                    <Input
                      type="password"
                      disabled={isView}
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-base transition-all"
                      placeholder="••••••••"
                      required={mode === 'create'}
                    />
                  </div>

                  <div className="group space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Phone size={12} className="text-primary" /> Số điện thoại
                    </Label>
                    <Input
                      disabled={isView}
                      value={formData.phoneNumber || ''}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="h-12 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-base transition-all"
                      placeholder="09xx xxx xxx"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                         <Shield size={12} className="text-primary" /> Vai trò hệ thống
                      </Label>
                      <div className="flex gap-2 p-1 bg-muted/40 rounded-xl h-12">
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setFormData({...formData, role: 'USER'})}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${formData.role === 'USER' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <Users size={14} /> <span className="text-[10px] font-bold uppercase">Người dùng</span>
                        </button>
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setFormData({...formData, role: 'TEACHER'})}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${formData.role === 'TEACHER' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <GraduationCap size={14} /> <span className="text-[10px] font-bold uppercase">Giáo viên</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                         <Venus size={12} className="text-primary" /> Giới tính
                      </Label>
                      <div className="flex gap-2 p-1 bg-muted/40 rounded-xl h-12">
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setFormData({...formData, gender: 'MALE'})}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${formData.gender === 'MALE' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <Mars size={14} /> <span className="text-[10px] font-bold uppercase">Nam</span>
                        </button>
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setFormData({...formData, gender: 'FEMALE'})}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${formData.gender === 'FEMALE' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <Venus size={14} /> <span className="text-[10px] font-bold uppercase">Nữ</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                         <Sparkles size={12} className="text-primary" /> Cấp độ (Level)
                      </Label>
                      <div className="p-1 bg-primary/5 border border-primary/20 rounded-xl h-12 flex items-center px-4">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                          {formData.level === 'NHAP_MON' ? 'Nhập môn' : formData.level || 'Người mới'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isView && (
                <div className="mt-10 flex gap-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onClose}
                    className="flex-1 h-14 rounded-xl font-black uppercase tracking-widest hover:bg-muted text-muted-foreground border border-transparent hover:border-border/40 transition-all"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex gap-3 group"
                  >
                    {mode === 'create' ? 'Xác nhận tạo mới' : 'Cập nhật ngay'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
