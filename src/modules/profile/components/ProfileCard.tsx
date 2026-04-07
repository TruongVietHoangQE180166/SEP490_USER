'use client';

import { observer } from '@legendapp/state/react';
import { motion, useReducedMotion } from 'framer-motion';
import { UploadCloud, User as UserIcon, Phone, Calendar, CheckCircle, Hash, MapPin, Plus, Trash2, Facebook, Instagram, Twitter, MessageCircle, FileText, Globe, Music } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FormEvent, useState, useRef } from 'react';
import { UserProfile, UpdateProfileRequest, UserInformation } from '../types';
import { cn } from '@/lib/utils';
import { useProfileForm } from '../hooks/useProfileForm';

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (updates: UpdateProfileRequest) => void;
  className?: string;
}

export const ProfileCard = observer(
  ({ profile, isEditing, onToggleEdit, onUpdate, className }: ProfileCardProps) => {
    const shouldReduceMotion = useReducedMotion();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const {
        formData,
        showSaveConfirmation,
        setShowSaveConfirmation,
        handleFileChange,
        handleInputChange,
        handleAddressChange,
        confirmSave,
        cancelSave,
        handleReset,
        setFormData 
    } = useProfileForm({ profile, onUpdate, onToggleEdit });

    const handleAvatarClick = () => {
      fileInputRef.current?.click();
    };

    const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        await handleFileChange(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setShowSaveConfirmation(true);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
        className={cn("w-full max-w-8xl mx-auto rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative", className)}
        aria-labelledby="glass-profile-settings-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        />
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Hồ sơ
            </div>
            <h1
              id="glass-profile-settings-title"
              className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Cài đặt hồ sơ
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isEditing ? "Cập nhật thông tin cá nhân của bạn." : "Xem và quản lý thông tin hồ sơ của bạn."}
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={onToggleEdit}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <UploadCloud className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <Badge className="group gap-2 rounded-full border border-border/60 bg-white/5 px-4 py-2 text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:bg-primary/15 hover:text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Đang chỉnh sửa
            </Badge>
          )}
        </div>

        {isEditing ? (
          <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur sticky top-8">
                <div className="relative group">
                  <Avatar 
                    className="h-32 w-32 border-2 border-primary/20 cursor-pointer transition-all duration-500 group-hover:scale-105 group-hover:border-primary/50 shadow-2xl shadow-primary/10"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage src={formData.avatar || profile.avatar || ''} alt={formData.fullName || 'User Avatar'} className="object-cover" />
                    <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                      {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                     <UploadCloud className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{formData.fullName}</p>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileSelect} 
                  className="hidden" 
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-border/60 bg-white/5 px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={handleAvatarClick}
                >
                  Thay đổi ảnh đại diện
                </Button>
              </div>
            </div>

            <div className="space-y-8 sm:col-span-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <Label htmlFor="profile-description" className="text-sm font-bold uppercase tracking-wider">Mô tả bản thân</Label>
                </div>
                <Textarea
                  id="profile-description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Giới thiệu ngắn gọn về bản thân bạn..."
                  className="min-h-[120px] rounded-2xl border-border/60 bg-background/60 px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <Label htmlFor="profile-fullname" className="text-xs font-bold uppercase tracking-wider">Họ và tên</Label>
                  </div>
                  <Input
                    id="profile-fullname"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="h-12 rounded-xl border-border/60 bg-background/60 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <Label htmlFor="profile-nickname" className="text-xs font-bold uppercase tracking-wider">Biệt danh</Label>
                  </div>
                  <Input
                    id="profile-nickname"
                    value={formData.nickName || ''}
                    onChange={(e) => handleInputChange('nickName', e.target.value)}
                    className="h-12 rounded-xl border-border/60 bg-background/60 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <Label htmlFor="profile-phone" className="text-xs font-bold uppercase tracking-wider">Số điện thoại</Label>
                  </div>
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="0xx xxxx xxx"
                    className="h-12 rounded-xl border-border/60 bg-background/60 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <Label htmlFor="profile-dob" className="text-xs font-bold uppercase tracking-wider">Ngày sinh</Label>
                  </div>
                  <Input
                    id="profile-dob"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="h-12 rounded-xl border-border/60 bg-background/60 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <Label className="text-xs font-bold uppercase tracking-wider">Giới tính</Label>
                </div>
                <div className="flex items-center gap-8 bg-background/40 p-4 rounded-xl border border-border/60">
                  {[
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                    { value: 'OTHER', label: 'Khác' }
                  ].map((gender) => (
                      <div key={gender.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleInputChange('gender', gender.value)}>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          formData.gender === gender.value ? "border-primary bg-primary shadow-lg shadow-primary/20" : "border-muted-foreground group-hover:border-primary"
                        )}>
                           {formData.gender === gender.value && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                        </div>
                        <span className={cn("text-sm transition-colors", formData.gender === gender.value ? "font-bold text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                            {gender.label}
                        </span>
                      </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-bold uppercase tracking-wider">Liên kết mạng xã hội</Label>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
                  {[
                    { id: 'facebook', label: 'Facebook', icon: Facebook },
                    { id: 'instagram', label: 'Instagram', icon: Instagram },
                    { id: 'tiktok', label: 'TikTok', icon: Music },
                    { id: 'zalo', label: 'Zalo', icon: MessageCircle },
                    { id: 'twitter', label: 'Twitter', icon: Twitter },
                  ].map((social) => (
                    <div key={social.id} className="space-y-2">
                       <div className="flex items-center gap-2">
                         <social.icon className="w-3.5 h-3.5 text-muted-foreground" />
                         <Label htmlFor={`social-${social.id}`} className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{social.label}</Label>
                       </div>
                       <Input
                         id={`social-${social.id}`}
                         // @ts-ignore
                         value={formData[social.id as keyof UpdateProfileRequest] || ''}
                         onChange={(e) => handleInputChange(social.id as keyof UpdateProfileRequest, e.target.value)}
                         placeholder={`Nhập link ${social.label}`}
                         className="h-10 rounded-xl border-border/60 bg-background/60 px-3 text-sm focus:ring-1 focus:ring-primary/20 transition-all"
                       />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-bold uppercase tracking-wider">Địa chỉ giao hàng</Label>
                 </div>
                 
                 <div className="grid gap-6 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
                    <div className="space-y-3">
                       <Label htmlFor="address-val" className="text-xs font-bold">Địa chỉ cụ thể <span className="text-red-500">*</span></Label>
                       <Input
                         id="address-val"
                         value={formData.addresses && formData.addresses[0] ? formData.addresses[0].address : ''}
                         onChange={(e) => handleAddressChange(0, 'address', e.target.value)}
                         placeholder="Ví dụ: 123 Đường ABC, Quận X, TP. Y"
                         className="h-12 rounded-xl border-border/60 bg-background/60 px-4 font-medium"
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <Label htmlFor="address-other" className="text-xs font-bold">Mô tả chi tiết / Ghi chú</Label>
                       <Input
                         id="address-other"
                         value={formData.addresses && formData.addresses[0] ? (formData.addresses[0].other || '') : ''}
                         onChange={(e) => handleAddressChange(0, 'other', e.target.value)}
                         placeholder="Ví dụ: Chung cư X, gần công viên..."
                         className="h-12 rounded-xl border-border/60 bg-background/60 px-4 font-medium"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-border/60 bg-white/5 px-8 py-6 text-sm font-bold hover:bg-red-500/10 hover:text-red-500 transition-all"
                  onClick={handleReset}
                >
                  Hủy thay đổi
                </Button>
                
                <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
                  <AlertDialogContent className="rounded-[32px] border border-border/40 bg-background/80 backdrop-blur-2xl p-8">
                    <AlertDialogHeader className="space-y-4">
                      <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
                        <CheckCircle className="w-7 h-7 text-green-500" />
                        Xác nhận lưu
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base font-medium text-muted-foreground leading-relaxed">
                        Mọi thay đổi của bạn sẽ được đồng bộ ngay lập tức. Bạn có chắc chắn muốn tiếp tục không?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-4 sm:gap-2">
                      <AlertDialogCancel onClick={cancelSave} className="h-14 rounded-2xl border-border/40 bg-background/40 font-bold px-8">Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmSave} className="h-14 rounded-2xl bg-primary text-primary-foreground font-black px-10 shadow-xl shadow-primary/20">Xác nhận lưu</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="submit"
                  className="rounded-xl bg-primary px-10 py-6 text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/40 font-black text-base"
                >
                  Lưu hồ sơ
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid gap-8 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-background/40 p-8 backdrop-blur sticky top-8">
                <div className="relative group">
                  <Avatar 
                    className="h-40 w-40 border-4 border-background shadow-2xl shadow-primary/10 transition-transform duration-500 group-hover:scale-105"
                  >
                    <AvatarImage src={profile.avatar || ''} alt={profile.fullName || 'User Avatar'} className="object-cover" />
                    <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-4xl font-black text-primary uppercase">
                      {profile.fullName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-foreground">{profile.fullName}</h2>
                  <p className="text-primary font-bold">@{profile.username}</p>
                </div>
                <div className="w-full border-t border-border/60 pt-4 mt-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center mb-4">Ngày gia nhập: {new Date(profile.createdDate || '').toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-10 sm:col-span-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-black uppercase tracking-wider text-muted-foreground">Mô tả bản thân</span>
                </div>
                <div className="relative rounded-2xl border border-border/40 bg-background/40 p-6 backdrop-blur shadow-sm overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                  <p className="text-foreground text-base leading-relaxed font-medium">
                    {profile.description || <span className="italic opacity-50 font-normal">Người dùng này chưa có thông tin giới thiệu bản thân.</span>}
                  </p>
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Họ và tên</span>
                  </div>
                  <p className="text-lg font-bold text-foreground border-b border-border/40 pb-1">{profile.fullName || '---'}</p>
                </div>
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Biệt danh</span>
                  </div>
                  <p className="text-lg font-bold text-foreground border-b border-border/40 pb-1">{profile.nickName || '---'}</p>
                </div>
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Số điện thoại</span>
                  </div>
                  <p className="text-lg font-bold text-foreground border-b border-border/40 pb-1">{profile.phoneNumber || '---'}</p>
                </div>
                <div className="space-y-2 group">
                   <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ngày sinh</span>
                  </div>
                  <p className="text-lg font-bold text-foreground border-b border-border/40 pb-1 uppercase">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-60">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Giới tính</span>
                </div>
                <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 px-6 py-3 rounded-2xl">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                   <span className="text-base font-black text-foreground">
                    {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : profile.gender === 'OTHER' ? 'Khác' : 'Chưa xác định'}
                   </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm font-black uppercase tracking-wider text-muted-foreground">Liên kết mạng xã hội</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
                      { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
                      { id: 'tiktok', icon: Music, label: 'TikTok', color: 'text-foreground' },
                      { id: 'zalo', icon: MessageCircle, label: 'Zalo', color: 'text-blue-400' },
                      { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-sky-400' },
                    ].map((social) => {
                      const link = profile.information?.[social.id as keyof UserInformation];
                      return link ? (
                        <a 
                          key={social.id}
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 px-5 py-3 text-sm font-bold text-foreground/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 hover:bg-white/5 active:scale-95"
                        >
                          <social.icon className={cn("w-5 h-5", social.color)} />
                          <span>{social.label}</span>
                        </a>
                      ) : (
                        <div 
                          key={social.id}
                          className="flex items-center gap-3 rounded-2xl border border-dashed border-border/20 bg-background/10 px-5 py-3 text-sm font-medium text-muted-foreground/30 grayscale"
                        >
                          <social.icon className="w-5 h-5 opacity-40" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{social.label}</span>
                            <span className="text-[11px] italic">Chưa thiết lập</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm font-black uppercase tracking-wider text-muted-foreground">Địa chỉ nhận hàng</span>
                </div>
                {profile.addresses && profile.addresses.length > 0 ? (
                  <div className="rounded-3xl border-2 border-primary/10 bg-primary/[0.02] p-8 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <MapPin className="w-24 h-24" />
                      </div>
                      <div className="space-y-4 relative z-10">
                           <div className="flex items-center gap-2">
                             <Badge className="bg-primary text-primary-foreground font-bold rounded-lg px-3">Mặc định</Badge>
                           </div>
                           <h3 className="text-xl font-black text-foreground leading-tight">{profile.addresses[0].address}</h3>
                           {profile.addresses[0].other && (
                             <div className="flex items-start gap-2 text-muted-foreground bg-background/40 p-4 rounded-xl border border-border/40">
                               <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/60" />
                               <span className="text-sm font-medium italic">{profile.addresses[0].other}</span>
                             </div>
                           )}
                      </div>
                  </div>
                ) : (
                  <div className="w-full rounded-2xl border border-dashed border-border/60 p-8 flex items-center justify-center bg-muted/5">
                     <p className="text-sm text-muted-foreground font-bold opacity-50 uppercase tracking-widest">Chưa thiết lập địa chỉ mặc định</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );

  }
);