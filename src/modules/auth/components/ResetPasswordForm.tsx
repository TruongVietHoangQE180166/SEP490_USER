'use client';

import { useResetPassword } from '../hooks/useResetPassword';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Eye, EyeOff } from 'lucide-react'; // Assuming lucide-react is available, or use a text toggle

export const ResetPasswordForm = () => {
  const {
    email,
    otp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    countdown,
    isLoading: isResetting,
    isSending,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResendOTP,
    resetPassword
  } = useResetPassword();

  return (
    <form
      onSubmit={resetPassword}
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div>
          <Link href="/" aria-label="go home">
            <LogoIcon className="h-16 w-16" variant="auth" />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">Đặt lại mật khẩu</h1>
          <p className="text-sm text-muted-foreground">
            Nhập mã OTP và mật khẩu mới cho tài khoản <strong>{email}</strong>
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* OTP Section */}
          <div className="space-y-2">
            <Label className="block text-sm">Mã OTP</Label>
            <div className="flex gap-2 justify-between">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold p-0"
                />
              ))}
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isSending}
                className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã OTP'}
              </button>
            </div>
          </div>

          {/* New Password Section */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Section */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isResetting || otp.join('').length !== 6 || !newPassword || !confirmPassword}
          >
            {isResetting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </Button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-accent-foreground text-center text-sm">
          Quay lại?{' '}
          <Button asChild variant="link" className="px-2">
            <Link href={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>
          </Button>
        </p>
      </div>
    </form>
  );
};
