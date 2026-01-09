'use client';

import { useVerifyOTP } from '../hooks/useVerifyOTP';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const VerifyOTPForm = () => {
  const {
    email,
    otp,
    countdown,
    isLoading: isVerifying,
    isSending,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    verifyOTP,
    handleResendOTP
  } = useVerifyOTP();

  return (
    <form
      onSubmit={verifyOTP}
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div>
          <Link href="/" aria-label="go home">
            <LogoIcon />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">Xác thực OTP</h1>
          <p className="text-sm text-muted-foreground">
            Nhập mã OTP gồm 6 chữ số đã được gửi đến email <strong>{email}</strong>
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp-0" className="block text-sm">
              Mã OTP
            </Label>
            <div className="flex gap-2 justify-between">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-bold p-0"
                />
              ))}
            </div>
          </div>


          <Button type="submit" className="w-full" disabled={isVerifying || otp.join('').length !== 6}>
            {isVerifying ? 'Đang xác thực...' : 'Xác thực'}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Bạn chưa nhận được mã?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isSending}
                className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
              </button>
            </p>
          </div>
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
