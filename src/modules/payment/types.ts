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
  amount: number;
  courseId: string;
  courseTitle: string;
  thumbnailUrl: string;
  voucherCode: string | null;
  discountValue: number | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  qrCode: string | null;
  createDate: string | null;
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
  error: string | null;
}
