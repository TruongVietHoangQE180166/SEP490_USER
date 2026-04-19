'use client';

import React, { useEffect, useState } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from '@legendapp/state/react';
import { authState$ } from '@/modules/auth/store';
import { onboardingService } from '@/modules/onboarding/services';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';
import { toast } from '@/components/ui/toast';
import { getNormalizedRole } from '@/modules/auth/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const NewbieRewardBubble = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isAuthenticated = useSelector(() => authState$.isAuthenticated.get());
  const user = useSelector(() => authState$.user.get());
  
  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));
  const isLearnPage = pathname?.startsWith('/learn');
  const isAdminPage = pathname?.startsWith('/admin');
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isTradingPage = pathname?.startsWith('/trading');

  // Check role
  const userRoleRaw = user?.role || (user?.roles && user?.roles[0]);
  const userRole = getNormalizedRole(userRoleRaw);
  const isUserRole = userRole === 'USER';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isAuthenticated || !user?.userId || !isUserRole) {
      setShowBubble(false);
      return;
    }

    const checkRewardStatus = async () => {
      try {
        const { hasSeen, hasClaimed } = await onboardingService.checkOnboardingStatus(user.userId);
        
        // Chỉ hiện hộp quà khi ĐÃ xem onboard và CHƯA nhận quà
        if (hasSeen && !hasClaimed) {
          setShowBubble(true);
        } else {
          setShowBubble(false);
        }
      } catch (err) {
        console.error("Failed to check newbie reward status", err);
      }
    };

    checkRewardStatus();
  }, [isMounted, isAuthenticated, user?.userId, isUserRole]);

  // Handle claim reward
  const handleClaim = async () => {
    if (!user?.userId) return;
    
    setIsClaiming(true);
    try {
      const response = await onboardingService.claimNewbieReward(user.userId, 100000);
      
      if (response.success) {
        await onboardingService.markRewardAsClaimed(user.userId);
        setIsModalOpen(false);
        setShowBubble(false);
        setShowSuccessModal(true); // Open success modal instead of just toast
      } else {
        toast.error('Nhận quà thất bại: ' + (response.message?.messageDetail || 'Đã có lỗi xảy ra'));
      }
    } catch (err: any) {
      console.error("Claim reward error:", err);
      toast.error('Lỗi khi nhận quà. Vui lòng thử lại sau.');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isMounted || isAuthPage || isLearnPage || isAdminPage || isTeacherPage || isTradingPage) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {showBubble && (
          <motion.button
            id="newbie-reward-bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              scale: { type: "spring", stiffness: 260, damping: 20 },
              y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } 
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(true)}
            className="group fixed bottom-48 right-4 md:right-8 z-[9999] flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-yellow-300 text-white shadow-[0_0_30px_rgba(245,158,11,0.6)] border-2 border-yellow-200 cursor-pointer pointer-events-auto"
          >
            {/* Hiệu ứng sóng lan tỏa (Ping effect) */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-50 animate-ping" style={{ animationDuration: '1.5s' }}></span>
            
            <motion.div
              animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
              className="relative z-10 flex items-center justify-center drop-shadow-lg"
            >
              <Gift size={30} className="group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
            
            {/* Attention dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 z-30 h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold border-2 border-background shadow-lg"
            >
              1
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="w-[90vw] max-w-[425px]">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
              <Gift size={32} />
            </div>
            <AlertDialogTitle className="text-2xl text-amber-500 font-bold">Quà Tân Thủ</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Chào mừng bạn đến với VICTEACH! Hệ thống gửi tặng bạn <strong className="text-foreground">100,000 USDT</strong> làm quà khởi nghiệp. Bạn có thể dùng USDT này để giao dịch thử nghiệm (Simulate Trade) hoặc đổi lấy điểm để mua khóa học từ chuyên gia!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isClaiming}>
              Để sau
            </AlertDialogCancel>
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-transparent relative overflow-hidden" 
              onClick={handleClaim}
              disabled={isClaiming}
            >
              {isClaiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang nhận...
                </>
              ) : (
                "Nhận Ngay 100,000 USDT"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal */}
      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent className="w-[90vw] max-w-[425px]">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 15, 0] }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500 relative"
            >
              {/* Confetti simulation (simple dots) */}
              <span className="absolute w-2 h-2 rounded-full bg-red-400 -top-2 left-2 animate-ping"></span>
              <span className="absolute w-2 h-2 rounded-full bg-blue-400 top-2 -right-2 animate-ping" style={{ animationDelay: '0.2s' }}></span>
              <span className="absolute w-2 h-2 rounded-full bg-yellow-400 bottom-0 -left-4 animate-ping" style={{ animationDelay: '0.4s' }}></span>
              
              <Gift size={40} />
            </motion.div>
            <AlertDialogTitle className="text-3xl text-green-500 font-extrabold pb-2">Chúc Mừng!</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Bạn đã nhận thành công <strong className="text-foreground text-lg text-amber-500 font-bold">100,000 USDT</strong> phần thưởng tân thủ.
              <br /><br />
              <span className="text-sm">Hãy dùng tài khoản này để mua khóa học hoặc trải nghiệm thử tính năng giao dịch của hệ thống nhé!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <Button 
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-xl px-8" 
              onClick={() => setShowSuccessModal(false)}
            >
              Cảm ơn VICTEACH!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
