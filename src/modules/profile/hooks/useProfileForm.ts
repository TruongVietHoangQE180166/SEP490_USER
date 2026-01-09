import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import { UserProfile, UpdateProfileRequest } from '../types';
import { profileService } from '../services';

interface UseProfileFormProps {
  profile: UserProfile;
  onUpdate: (updates: UpdateProfileRequest) => void;
  onToggleEdit: () => void;
}

export const useProfileForm = ({ profile, onUpdate, onToggleEdit }: UseProfileFormProps) => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: profile.fullName || '',
    nickName: profile.nickName || '',
    phoneNumber: profile.phoneNumber || '',
    dateOfBirth: formatDateForInput(profile.dateOfBirth),
    gender: profile.gender || 'MALE',
    avatar: profile.avatar || '',
    addresses: profile.addresses ? profile.addresses.map(addr => ({
      id: addr.id,
      address: addr.address,
      other: addr.other,
      default: addr.default || false
    })) : [],
  });
  
  // Also keep track of local address UI state if needed, but managing directly in formData is fine 
  // provided the structure matches UpdateProfileRequest. 
  // Note: UpdateProfileRequest addresses might need to be compliant with the API type.
  // In ProfileCard current implementation:
  // addresses: profile.addresses || [] (which creates a deep object structure).
  // updateProfile expects UpdateProfileRequest.
  
  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    setIsUploading(true);

    try {
      const imageUrl = await profileService.uploadImage(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
      
      toast.dismiss(toastId);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const newAddresses = [...(formData.addresses || [])];
    
    // If address doesn't exist at index (shouldn't happen if initialized correctly)
    if (!newAddresses[index]) {
         const newAddr = {
             address: '', 
             other: '', 
             default: index === 0, 
             id: crypto.randomUUID() // Frontend temp ID
         };
         // @ts-ignore - fixing type complexity for now, Assuming simpler structure for address updates
         newAddresses[index] = newAddr;
    }
    
    // @ts-ignore
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const confirmSave = () => {
    onUpdate({
      ...formData,
    });
    setShowSaveConfirmation(false);
  };

  const cancelSave = () => {
    setShowSaveConfirmation(false);
  };

  const handleReset = () => {
    setFormData({
      fullName: profile.fullName || '',
      nickName: profile.nickName || '',
      phoneNumber: profile.phoneNumber || '',
      dateOfBirth: formatDateForInput(profile.dateOfBirth),
      gender: profile.gender || 'MALE',
      avatar: profile.avatar || '',
      // @ts-ignore - mapping existing addresses to update structure
      addresses: profile.addresses || [], 
    });
    onToggleEdit();
  };

  return {
    formData,
    showSaveConfirmation,
    setShowSaveConfirmation,
    isUploading,
    handleFileChange,
    handleInputChange,
    handleAddressChange,
    confirmSave,
    cancelSave,
    handleReset,
    setFormData 
  };
};
