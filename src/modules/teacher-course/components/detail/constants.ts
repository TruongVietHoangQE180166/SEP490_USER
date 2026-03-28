export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Không xác định';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const LEVEL_MAP: Record<string, string> = {
  LEVEL_1: 'Nhập môn',
  LEVEL_2: 'Nền tảng',
  LEVEL_3: 'Trung cấp',
  LEVEL_4: 'Thực hành',
  LEVEL_5: 'Nâng cao',
};

export const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  PUBLISHED: {
    label: 'Đã duyệt',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  DRAFT: {
    label: 'Chờ duyệt',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  REJECT: {
    label: 'Từ chối',
    className: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
    dot: 'bg-rose-500',
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
