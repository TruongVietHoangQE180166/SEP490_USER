'use client';

import React, { useEffect } from 'react';
import { useManageUser } from '../hooks/useManageUser';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { SlidersHorizontal, ChevronDown, Check, Users, Shield, Target } from "lucide-react";

export const ManageUserModule = () => {
  const {
    users,
    isLoading,
    isModalOpen,
    modalMode,
    selectedUser,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    userToToggleStatus,
    currentPage,
    totalPages,
    totalElements,
    filterStatus,
    filterRole,
    searchQuery,
    fetchUsers,
    handleSave,
    handleDeleteConfirm,
    deleteUser,
    toggleUserStatus,
    handleStatusConfirm,
    openModal,
    closeModal,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
  } = useManageUser();




  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    fetchUsers();
    toast.info('Đã làm mới dữ liệu hệ thống');
  };

  const roleOptions = [
    { label: 'Tất cả vai trò', value: 'ALL' },
    { label: 'Giáo viên', value: 'TEACHER' },
    { label: 'Người dùng', value: 'USER' },
  ];

  const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Hoạt động', value: 'ACTIVE' },
    { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  ];

  const currentRoleLabel = roleOptions.find(opt => opt.value === filterRole)?.label || 'Tất cả vai trò';
  const currentStatusLabel = statusOptions.find(opt => opt.value === filterStatus)?.label || 'Tất cả trạng thái';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-10 border border-primary/10 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Users className="h-8 w-8" />
               </div>
               <div>
                  <h1 className="text-5xl font-[1000] tracking-tight text-foreground leading-none">
                     Hội viên <span className="text-primary">VIC</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="h-1 w-8 bg-primary rounded-full"></span>
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Quản trị cộng đồng</p>
                  </div>
               </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
               Theo dõi, phân quyền và tối ưu hóa trải nghiệm cho <span className="text-foreground font-bold">{totalElements}</span> thành viên trong hệ thống VIC Teach. 
            </p>
          </div>
          
          <Button 
            onClick={() => openModal('create')}
            className="h-20 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-95 gap-4 group"
          >
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-500">
               <Plus size={24} /> 
            </div>
            Thêm hội viên mới
          </Button>
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
              placeholder="Tìm kiếm danh tính hội viên..." 
              className="h-16 pl-16 pr-8 bg-card border-none rounded-[2rem] shadow-xl shadow-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg placeholder:font-medium transition-all"
            />
          </div>
        </div>
        
        {/* Actions Area: Filters + Refresh + Counter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 flex-1 sm:flex-none">
            {/* Role Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-14 px-5 rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all shrink-0 min-w-[140px] justify-start">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex flex-col items-start gap-0 overflow-hidden text-left">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none truncate w-full">Vai trò</span>
                      <span className="text-sm font-bold text-foreground leading-tight truncate w-full">{currentRoleLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                {roleOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => handleFilterChange({ role: option.value })}
                    className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/10 focus:text-primary"
                  >
                    <span className={`font-bold text-sm ${filterRole === option.value ? 'text-primary' : 'text-foreground'}`}>{option.label}</span>
                    {filterRole === option.value && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-14 px-5 rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all shrink-0 min-w-[140px] justify-start">
                  <Target className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex flex-col items-start gap-0 overflow-hidden text-left">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none truncate w-full">Trạng thái</span>
                      <span className="text-sm font-bold text-foreground leading-tight truncate w-full">{currentStatusLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
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
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Tổng số</span>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">
                  <b>{totalElements}</b> người dùng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
         
          <UserTable 
           users={users} 
           isLoading={isLoading} 
           onToggleStatus={toggleUserStatus}
         />


      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
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

      {/* User Modal */}
      <UserModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              Hành động này không thể hoàn tác. Người dùng sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-black uppercase tracking-widest"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">
              {userToToggleStatus?.currentStatus === 'INACTIVE' ? 'Mở khóa người dùng?' : 'Khóa người dùng?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              {userToToggleStatus?.currentStatus === 'INACTIVE' 
                ? 'Người dùng này sẽ có thể truy cập lại hệ thống sau khi được mở khóa.' 
                : 'Người dùng bị khóa sẽ không thể đăng nhập hoặc thực hiện bất kỳ hành động nào trên hệ thống.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStatusConfirm}
              className={`${userToToggleStatus?.currentStatus === 'INACTIVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'} text-white rounded-xl font-black uppercase tracking-widest`}
            >
              Xác nhận {userToToggleStatus?.currentStatus === 'INACTIVE' ? 'mở khóa' : 'khóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>

  );
};
