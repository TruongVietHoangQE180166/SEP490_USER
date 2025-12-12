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
  const { sendResetLink, isLoading } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await sendResetLink(email);
    
    if (result.success) {
      setSuccess(result.message || 'Link đã được gửi!');
      setEmail(''); // Clear form
    } else {
      setError(result.error || 'Gửi link thất bại');
    }
  };

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
            Nhập email để nhận link đặt lại mật khẩu
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

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
              <p className="text-sm text-primary">{success}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.
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
