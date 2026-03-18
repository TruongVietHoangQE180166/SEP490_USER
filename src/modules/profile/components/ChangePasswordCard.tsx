'use client';

import { observer } from '@legendapp/state/react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ChangePasswordData } from '@/modules/profile/types';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';

interface ChangePasswordCardProps {
  onPasswordChange: (passwordData: ChangePasswordData) => void;
  className?: string;
  isLoading?: boolean;
}

export const ChangePasswordCard = observer(
  ({ onPasswordChange, className, isLoading = false }: ChangePasswordCardProps) => {
    const shouldReduceMotion = useReducedMotion();
    
    // Use the custom hook for form logic
    const {
        formData,
        setFormData,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        showPasswordConfirmation,
        setShowPasswordConfirmation,
        passwordStrength,
        handleSubmit,
        confirmPasswordChange,
        cancelPasswordChange
    } = useChangePasswordForm({ onPasswordChange });



    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
          delay: 0.1,
        }}
        className={cn("w-full max-w-8xl rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative", className)}
        aria-labelledby="change-password-settings-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        />
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Bảo mật
            </div>
            <h1
              id="change-password-settings-title"
              className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Đổi mật khẩu
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cập nhật mật khẩu để giữ tài khoản của bạn luôn an toàn.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Mật khẩu</span>
          </div>
        </div>

        <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
              <div className="p-4 rounded-full bg-primary/10">
                <Lock className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Bảo mật mật khẩu</p>
                <p className="text-xs text-muted-foreground">
                  Giữ tài khoản của bạn luôn an toàn
                </p>
                <div className="mt-4 text-xs text-muted-foreground space-y-1 text-left">
                  <p className="font-bold underline mb-2">Mật khẩu phải bao gồm:</p>
                  <p>• Ít nhất 8 ký tự</p>
                  <p>• Một chữ cái viết hoa</p>
                  <p>• Một chữ cái viết thường</p>
                  <p>• Một con số</p>
                  <p>• Một ký tự đặc biệt</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:col-span-3">
            <div className="space-y-2">
              <Label htmlFor="current-password">
                Mật khẩu hiện tại <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4 pr-12"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">
                Mật khẩu mới <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4 pr-12"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Xác nhận mật khẩu mới <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4 pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-bold">Độ mạnh mật khẩu</span>
                  <span className={`${passwordStrength.strengthColor.replace('bg-', 'text-')}`}>
                    {passwordStrength.strengthLabel}
                  </span>
                </div>
                <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passwordStrength.strengthColor}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className={`h-1 flex-1 rounded-full ${level <= passwordStrength.strength ? passwordStrength.strengthColor : 'bg-border/60'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <AlertDialog open={showPasswordConfirmation} onOpenChange={setShowPasswordConfirmation}>
                <AlertDialogContent className="rounded-[32px] border border-border/40 bg-background/80 backdrop-blur-2xl p-8">
                  <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Xác nhận đổi mật khẩu
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-bold text-foreground/50">
                      Bạn có chắc chắn muốn cập nhật mật khẩu mới không? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8 gap-4 sm:gap-0">
                    <AlertDialogCancel onClick={cancelPasswordChange} disabled={isLoading} className="h-12 rounded-2xl border-border/40 bg-background/40 font-black">Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmPasswordChange} disabled={isLoading} className="h-12 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20">
                      {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-[0_20px_60px_-30px_rgba(var(--primary-rgb),0.75)] transition-transform duration-300 hover:-translate-y-1 font-black text-base"
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    );
  }
);