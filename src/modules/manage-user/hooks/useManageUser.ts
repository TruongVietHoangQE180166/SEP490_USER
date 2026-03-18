import { useState, useCallback, useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { UserState, User } from '../types';
import { userState$, userActions } from '../store';
import { userService } from '../services';
import { toast } from '@/components/ui/toast';

export const useManageUser = () => {
  const allUsers = useSelector(userState$.users) as User[] | undefined;
  const isLoading = useSelector(userState$.isLoading) as boolean;
  const isModalOpen = useSelector(userState$.isModalOpen) as boolean;
  const modalMode = useSelector(userState$.modalMode) as 'create' | 'edit' | 'view';
  const selectedUser = useSelector(userState$.selectedUser) as User | null;
  
  const filterStatus = useSelector(userState$.filterStatus) as string;
  const filterRole = useSelector(userState$.filterRole) as string;
  const currentPage = useSelector(userState$.currentPage) as number;
  const pageSize = useSelector(userState$.pageSize) as number;

  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<{id: string, currentStatus: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Helper to trigger fake loading for smoother UX
  const triggerFakeLoading = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 600);
  }, []);

  // 1. Fetch 1000 users once
  const fetchUsers = useCallback(async () => {
    userActions.setLoading(true);
    try {
      // Get 1000 users at once as requested
      const response = await userService.getUsers(1, 1000, 'createdDate', 'desc', 'ALL', 'ALL');
      userActions.setUsers(response.data.content);
      userActions.setError(null);
    } catch (err: any) {
      userActions.setError(err.message);
      toast.error(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      userActions.setLoading(false);
    }
  }, []);

  // 2. Client-side filtering logic
  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    
    return allUsers.filter(user => {
      // Exclude ADMINS
      if (user.role === 'ADMIN') return false;
      
      // Filter by Role
      if (filterRole !== 'ALL' && user.role !== filterRole) return false;
      
      // Filter by Status
      if (filterStatus !== 'ALL' && user.status !== filterStatus) return false;
      
      // Search logic (Username, Email, FullName)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.fullName && user.fullName.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [allUsers, filterRole, filterStatus, searchQuery]);

  // 3. Client-side pagination logic
  const totalElements = filteredUsers.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const displayUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    triggerFakeLoading();
    userActions.setCurrentPage(page);
  };

  const handleFilterChange = (filters: { status?: string, role?: string }) => {
    triggerFakeLoading();
    userActions.setFilters(filters);
    userActions.setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (query: string) => {
    triggerFakeLoading();
    setSearchQuery(query);
    userActions.setCurrentPage(1); // Reset to first page on search change
  };

  const handleSave = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    const toastId = toast.loading(modalMode === 'create' ? 'Đang tạo người dùng...' : 'Đang cập nhật...');
    
    try {
      if (modalMode === 'create') {
        await userService.createUser(userData);
        toast.success('Thành công! Người dùng mới đã được thêm.');
      } else if (modalMode === 'edit' && selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        toast.success('Thành công! Thông tin đã được cập nhật.');
      }
      userActions.closeModal();
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    const toastId = toast.loading('Đang xử lý xóa...');
    try {
      await userService.deleteUser(userToDelete);
      toast.success('Đã xóa người dùng khỏi hệ thống');
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể thực hiện yêu cầu');
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.dismiss(toastId);
    }
  };

  const deleteUser = (id: string) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const toggleUserStatus = (id: string, currentStatus: string) => {
    setUserToToggleStatus({ id, currentStatus });
    setIsStatusDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!userToToggleStatus) return;
    
    // Toggle between ACTIVE and INACTIVE
    const newStatus = userToToggleStatus.currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const toastId = toast.loading('Đang cập nhật trạng thái...');
    
    try {
      await userService.updateUserStatus(userToToggleStatus.id, newStatus);
      toast.success(`Đã ${newStatus === 'INACTIVE' ? 'ngừng hoạt động' : 'kích hoạt'} người dùng thành công`);

      
      // Update local state for immediate feedback
      userActions.updateUserInList(userToToggleStatus.id, { 
        status: newStatus as any
      });
      
      // Also refetch to ensure sync with server
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsStatusDialogOpen(false);
      setUserToToggleStatus(null);
      toast.dismiss(toastId);
    }
  };



  return {
    users: displayUsers,
    isLoading: isLoading || isProcessing,
    isModalOpen,
    modalMode,
    selectedUser,
    currentPage,
    totalPages,
    totalElements,
    filterStatus,
    filterRole,
    searchQuery,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    userToToggleStatus,
    isSubmitting,
    fetchUsers,
    handleSave,
    handleDeleteConfirm,
    deleteUser,
    toggleUserStatus,
    handleStatusConfirm,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    openModal: userActions.openModal,
    closeModal: userActions.closeModal,
  };
};

