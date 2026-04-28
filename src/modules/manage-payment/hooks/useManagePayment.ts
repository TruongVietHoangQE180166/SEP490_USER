'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { paymentState$, paymentActions } from '../store';
import { paymentService } from '../services';
import { toast } from '@/components/ui/toast';

export const useManagePayment = () => {
  const allPayments = useSelector(paymentState$.payments);
  const isLoading = useSelector(paymentState$.isLoading);
  const isModalOpen = useSelector(paymentState$.isModalOpen);
  const modalMode = useSelector(paymentState$.modalMode);
  const selectedPayment = useSelector(paymentState$.selectedPayment);
  
  const filterStatus = useSelector(paymentState$.filterStatus);
  const currentPage = useSelector(paymentState$.currentPage);
  const pageSize = useSelector(paymentState$.pageSize);
  const totalElementsFromState = useSelector(paymentState$.totalElements);

  const totalRevenue = useSelector(paymentState$.totalRevenue);

  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerFakeLoading = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 600);
  }, []);

  const fetchPayments = useCallback(async () => {
    paymentActions.setLoading(true);
    try {
      // Fetch trang hiện tại để hiển thị bảng
      const response = await paymentService.getPayments(currentPage, pageSize);
      paymentActions.setPayments(response.data.content);
      paymentActions.setPagination({
        totalElement: response.data.totalElement,
        totalPages: Math.ceil(response.data.totalElement / pageSize),
      });

      // Fetch toàn bộ giao dịch để tính tổng dòng tiền COMPLETED
      const allResponse = await paymentService.getPayments(1, 99999);
      const revenue = allResponse.data.content
        .filter((p: any) => p?.status === 'COMPLETED')
        .reduce((acc: number, curr: any) => acc + (curr?.amount || 0), 0);
      paymentActions.setTotalRevenue(revenue);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách thanh toán');
    } finally {
      paymentActions.setLoading(false);
    }
  }, [currentPage, pageSize]);

  const filteredPayments = useMemo(() => {
    if (!allPayments) return [];
    
    return allPayments.filter(payment => {
      if (!payment) return false;
      
      // Filter by Status
      if (filterStatus !== 'ALL' && payment.status !== filterStatus) return false;
      
      // Search logic (Course Title)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          payment.courseTitle.toLowerCase().includes(q)
        );
      }
      
      return true;
    });
  }, [allPayments, filterStatus, searchQuery]);

  const handlePageChange = (page: number) => {
    triggerFakeLoading();
    paymentActions.setCurrentPage(page);
  };

  const handleFilterChange = (filters: { status?: string }) => {
    triggerFakeLoading();
    paymentActions.setFilters(filters);
  };

  const handleSearchChange = (query: string) => {
    triggerFakeLoading();
    setSearchQuery(query);
    paymentActions.setCurrentPage(1);
  };

  return {
    payments: filteredPayments,
    allPayments,
    isLoading: isLoading || isProcessing,
    isModalOpen,
    modalMode,
    selectedPayment,
    currentPage,
    totalPages: Math.ceil(totalElementsFromState / pageSize),
    totalElements: totalElementsFromState,
    totalRevenue,
    filterStatus,
    searchQuery,
    fetchPayments,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    openModal: paymentActions.openModal,
    closeModal: paymentActions.closeModal,
  };
};
