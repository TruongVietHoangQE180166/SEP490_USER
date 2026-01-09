'use client';

import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const ForgotPasswordForm = () => {
  const { email, setEmail, handleSubmit, isLoading } = useForgotPassword();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md"
    >
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
        <div>
          <Link href="/" aria-label="go home">
            <LogoIcon />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">Khôi phục mật khẩu</h1>
          <p className="text-sm text-muted-foreground">
            Nhập email để nhận mã OTP đặt lại mật khẩu
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email
            </Label>
            <Input
              type="email"
              required
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Chúng tôi sẽ gửi mã OTP gồm 6 chữ số đến email của bạn.
          </p>
        </div>
      </div>

      <div className="p-3">
        <p className="text-accent-foreground text-center text-sm">
          Đã nhớ mật khẩu?
          <Button asChild variant="link" className="px-2">
            <Link href={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>
          </Button>
        </p>
      </div>
    </form>
  );
};
