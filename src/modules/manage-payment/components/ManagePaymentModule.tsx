'use client';

import React, { useEffect, useState } from 'react';
import { useManagePayment } from '../hooks/useManagePayment';
import { PaymentTable } from './PaymentTable';
import { PaymentDetail } from './PaymentDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, CreditCard, ChevronDown, Check, Target, DollarSign, Wallet } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Payment } from '../types';

export const ManagePaymentModule = () => {
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const {
    payments,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    filterStatus,
    searchQuery,
    fetchPayments,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
  } = useManagePayment();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRefresh = () => {
    fetchPayments();
    toast.info('Đã cập nhật dữ liệu thanh toán mới nhất');
  };

  const handleViewPayment = (payment: Payment) => {
    setViewingPayment(payment);
    setIsDetailView(true);
  };

  const handleBackFromDetail = () => {
    setIsDetailView(false);
    setViewingPayment(null);
  };

  const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Thành công', value: 'COMPLETED' },
    { label: 'Chờ thanh toán', value: 'PENDING' },
    { label: 'Đã hủy', value: 'CANCELLED' },
  ];

  const currentStatusLabel = statusOptions.find(opt => opt.value === filterStatus)?.label || 'Tất cả trạng thái';

  // Detail View Mode
  if (isDetailView && viewingPayment) {
    return (
      <PaymentDetail 
        payment={viewingPayment}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-10 border border-primary/10 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <DollarSign className="h-8 w-8" />
               </div>
               <div>
                  <h1 className="text-5xl font-[1000] tracking-tight text-foreground leading-none">
                     Giao dịch <span className="text-primary">VIC</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="h-1 w-8 bg-primary rounded-full"></span>
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Quản trị tài chính</p>
                  </div>
               </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
               Giám sát dòng tiền, học phí và lịch sử mua khóa học của cộng đồng VIC Teach. Hệ thống hiện ghi nhận <span className="text-foreground font-bold">{totalElements}</span> bản ghi giao dịch.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Tổng dòng tiền</span>
                <p className="text-4xl font-[1000] text-primary tabular-nums tracking-tighter">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
                     payments.filter(p => p?.status === 'COMPLETED').reduce((acc, curr) => acc + (curr?.amount || 0), 0)
                   )}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 px-2">
        {/* Search Bar */}
        <div className="relative flex-1 group min-w-0">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-6 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" size={24} />
            <Input 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề khóa học..." 
              className="h-16 pl-16 pr-8 bg-card border-none rounded-[2rem] shadow-xl shadow-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg placeholder:font-medium transition-all"
            />
          </div>
        </div>
        
        {/* Actions Area */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 flex-1 sm:flex-none">
            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-14 px-5 rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all shrink-0 min-w-[200px] justify-start shadow-sm active:scale-95">
                  <Target className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex flex-col items-start gap-0 overflow-hidden text-left">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none truncate w-full">Trạng thái</span>
                      <span className="text-sm font-bold text-foreground leading-tight truncate w-full">{currentStatusLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                {statusOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => handleFilterChange({ status: option.value })}
                    className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/10 focus:text-primary"
                  >
                    <span className={`font-bold text-sm ${filterStatus === option.value ? 'text-primary' : 'text-foreground'}`}>{option.label}</span>
                    {filterStatus === option.value && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className={`h-14 w-14 p-0 rounded-2xl border-border/40 bg-background hover:bg-muted transition-all active:scale-95 shadow-sm border-none bg-muted/40 shrink-0 ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} />
            </Button>

            <div className="hidden sm:flex flex-col items-end border-l border-border/40 pl-4 h-10 justify-center shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Cơ sở dữ liệu</span>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">
                  <b>{totalElements}</b> giao dịch
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <PaymentTable 
          payments={payments as any[]}
          isLoading={isLoading}
          onView={handleViewPayment}
        />
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination>
            <PaginationContent className="bg-muted/40 p-1.5 rounded-2xl border-none shadow-inner">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink
                  isActive={true}
                  className="cursor-default pointer-events-none"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
