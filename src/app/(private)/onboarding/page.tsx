import React from 'react';
import { Metadata } from 'next';
import { OnboardingPageWrapper } from '@/modules/onboarding/components/OnboardingPageWrapper';

export const metadata: Metadata = {
  title: 'Giới thiệu VICTEACH',
  description: 'Chào mừng bạn đến với hệ thống khóa học tài chính chuyên sâu.',
};

export default function OnboardingPage() {
  return <OnboardingPageWrapper />;
}
