import { observable } from '@legendapp/state';
import { AttendanceRecord } from './types';


export const chatState$ = observable({
  isOpen: false,
  unreadCount: 0,
  toggle: () => {
    chatState$.isOpen.set(!chatState$.isOpen.peek());
  },
  open: () => {
    chatState$.isOpen.set(true);
  },
  close: () => {
    chatState$.isOpen.set(false);
  }
});

export const attendanceState$ = observable({
  history: [] as AttendanceRecord[],
  isOpen: false,
  isLoading: false,
  toggleOpen: () => {
    attendanceState$.isOpen.set(!attendanceState$.isOpen.peek());
  },
  open: () => {
    attendanceState$.isOpen.set(true);
  },
  close: () => {
    attendanceState$.isOpen.set(false);
  }
});
