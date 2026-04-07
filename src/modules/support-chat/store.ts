import { observable } from '@legendapp/state';

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
