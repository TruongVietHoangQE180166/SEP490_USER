import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import { tradingActions } from '../store';

export function useAddMargin() {
  const [addMarginPosId, setAddMarginPosId] = useState<string | null>(null);
  const [addMarginAmount, setAddMarginAmount] = useState<string>('');
  const [isAddingMargin, setIsAddingMargin] = useState(false);

  const handleAddMarginSubmit = async (posId: string) => {
    const amount = parseFloat(addMarginAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Số tiền không hợp lệ');
      return;
    }
    setIsAddingMargin(true);
    try {
      const res = await tradingActions.addPositionMargin(posId, amount);
      if (res.success) {
        toast.success(res.message);
        setAddMarginPosId(null);
        setAddMarginAmount('');
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi thêm ký quỹ');
    } finally {
      setIsAddingMargin(false);
    }
  };

  const toggleAddMargin = (posId: string) => {
    if (addMarginPosId === posId) {
      setAddMarginPosId(null);
    } else {
      setAddMarginPosId(posId);
      setAddMarginAmount('');
    }
  };

  return {
    addMarginPosId,
    setAddMarginPosId,
    addMarginAmount,
    setAddMarginAmount,
    isAddingMargin,
    handleAddMarginSubmit,
    toggleAddMargin
  };
}
