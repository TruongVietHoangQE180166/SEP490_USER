import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { PaymentState } from './types';

const initialPaymentState: PaymentState = {
  paymentInfo: null,
  currentOrder: null,
  userPoints: null,
  isLoading: false,
  isPaymentCompleted: false,
  error: null,
};

export const paymentState$ = observable<PaymentState>(initialPaymentState);

// Persist payment state to local storage
persistObservable(paymentState$, {
  local: 'payment-state',
  pluginLocal: ObservablePersistLocalStorage
});

export const paymentActions = {
  setPaymentInfo: (info: PaymentState['paymentInfo']) => {
    paymentState$.paymentInfo.set(info);
    paymentState$.currentOrder.set(null); // Reset order/QR code when setting new info
    paymentState$.isPaymentCompleted.set(false);
  },
  setCurrentOrder: (order: PaymentState['currentOrder']) => {
    paymentState$.currentOrder.set(order);
    paymentState$.isPaymentCompleted.set(false);
  },
  setPaymentCompleted: (isCompleted: boolean) => {
    paymentState$.isPaymentCompleted.set(isCompleted);
  },
  setLoading: (isLoading: boolean) => {
    paymentState$.isLoading.set(isLoading);
  },
  setError: (error: string | null) => {
    paymentState$.error.set(error);
  },
  resetOrder: () => {
    paymentState$.currentOrder.set(null);
    paymentState$.isPaymentCompleted.set(false);
  },
  setUserPoints: (points: PaymentState['userPoints']) => {
    paymentState$.userPoints.set(points);
  }
};
