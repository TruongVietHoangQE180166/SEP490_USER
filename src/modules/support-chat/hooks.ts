import { useEffect } from 'react';
import { SupportChatService } from './services';
import { attendanceState$ } from './store';
import { authState$ } from '@/modules/auth/store';
import { useObservable } from '@legendapp/state/react';

export const useAttendanceHistory = () => {
  // Use reactive value
  const isAuthenticated = authState$.isAuthenticated.get();
  
  const fetchHistory = async () => {
    if (!isAuthenticated) return;
    attendanceState$.isLoading.set(true);
    const res = await SupportChatService.getAttendanceHistory();
    if (res?.data) {
      attendanceState$.history.set(res.data);
    }
    attendanceState$.isLoading.set(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [isAuthenticated]);

  return {
    fetchHistory,
    history: attendanceState$.history.get(),
    isLoading: attendanceState$.isLoading.get(),
    isOpen: attendanceState$.isOpen.get(),
    toggleOpen: attendanceState$.toggleOpen,
  };
};
