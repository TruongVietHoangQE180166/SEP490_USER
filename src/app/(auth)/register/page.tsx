'use client';

import Link from 'next/link';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { withGuestGuard } from '@/guards/guestGuard';
import { ROUTES } from '@/constants/routes';
import { GridBackground } from '@/components/ui/grid-background';

const RegisterPage = () => {
  return (
    <GridBackground
      gridSize="12:12"
      colors={{
        background: 'bg-background',
        borderColor: 'border-border',
        borderSize: '1px',
        borderStyle: 'solid',
      }}
      beams={{
        count: 8,
        colors: [
          'bg-primary/60',
          'bg-primary/40',
          'bg-chart-1/60',
          'bg-chart-2/60',
          'bg-accent/60',
        ],
        shadow: 'shadow-lg shadow-primary/30 rounded-full',
        speed: 5,
      }}
      className="fixed inset-0"
    >
      <div className="h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <RegisterForm />
        </div>
      </div>
    </GridBackground>
  );
};

export default withGuestGuard(RegisterPage);