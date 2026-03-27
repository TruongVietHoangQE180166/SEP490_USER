export const STEPS = [
  { id: 'basic', label: 'Thông tin cơ bản' },
  { id: 'curriculum', label: 'Chương trình giảng dạy' }
];

export const COURSE_LEVELS = [
  { value: 'LEVEL_1', label: 'Nhập môn', colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'LEVEL_2', label: 'Nền tảng', colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { value: 'LEVEL_3', label: 'Trung cấp', colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { value: 'LEVEL_4', label: 'Thực hành', colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { value: 'LEVEL_5', label: 'Nâng cao', colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
];

export interface Lesson {
  id: string;
  type: 'video' | 'document' | 'quiz';
  title: string;
  file?: File | null;
  timeLimit?: number;
  passingScore?: number;
  questions?: any[];
}

export interface Mooc {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface BasicInfo {
  title: string;
  description: string;
  level: string;
  isFree: boolean;
  price: string;
  hasDiscount: boolean;
  discountPercent: string;
  thumbnail: File | null;
  thumbnailUrl?: string;
  previewVideo: File | null;
  previewVideoUrl?: string;
  assets: string[];
}

export const COURSE_ASSETS = [
  "CRYPTO", "SPOT", "FUTURES", "OPTIONS", "PERPETUAL", 
  "MARGIN", "LEVERAGE", "DERIVATIVES", "STABLECOIN", "DEFI", 
  "NFT", "STAKING", "YIELD", "LIQUIDITY", "VOLATILITY", 
  "INDEX", "FOREX", "GOLD", "SILVER", "COMMODITIES"
];
