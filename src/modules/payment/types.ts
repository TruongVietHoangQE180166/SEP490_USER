export interface PaymentInfo {
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  courseDescription?: string;
  price: number;
  salePrice: number;
  discountPercent: number;
}

export interface PaymentRequest {
  courseId: string;
  paymentMethod: string;
}

export interface PaymentData {
  id: string;
  amount: number;
  courseId: string;
  courseTitle: string;
  thumbnailUrl: string;
  voucherCode: string | null;
  discountValue: number | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'COMPLETED';
  qrCode: string | null;
  createdDate: string | null;
}

export interface PaymentResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any | null;
  data: PaymentData;
  success: boolean;
}

export interface PaymentState {
  paymentInfo: PaymentInfo | null;
  currentOrder: PaymentData | null;
  isLoading: boolean;
  isPaymentCompleted: boolean;
  error: string | null;
}
