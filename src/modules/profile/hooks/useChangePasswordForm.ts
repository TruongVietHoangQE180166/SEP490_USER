import { useState, FormEvent } from 'react';
import { toast } from '@/components/ui/toast';
import { ChangePasswordData } from '../types';

export const useChangePasswordForm = ({ onPasswordChange }: { onPasswordChange: (data: ChangePasswordData) => void }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;

    let strengthLabel = "Very Weak";
    let strengthColor = "bg-red-500";

    if (strength >= 5) {
      strengthLabel = "Very Strong";
      strengthColor = "bg-green-500";
    } else if (strength >= 4) {
      strengthLabel = "Strong";
      strengthColor = "bg-teal-500";
    } else if (strength >= 3) {
      strengthLabel = "Medium";
      strengthColor = "bg-yellow-500";
    } else if (strength >= 2) {
      strengthLabel = "Weak";
      strengthColor = "bg-orange-500";
    }

    return { strength, strengthLabel, strengthColor, checks };
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate required fields
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    setShowPasswordConfirmation(true);
  };

  const confirmPasswordChange = () => {
    onPasswordChange(formData);
    setShowPasswordConfirmation(false);
    // Clear the form after successful password change
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const cancelPasswordChange = () => {
    setShowPasswordConfirmation(false);
  };

  return {
    formData,
    setFormData,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showPasswordConfirmation,
    setShowPasswordConfirmation,
    passwordStrength,
    handleSubmit,
    confirmPasswordChange,
    cancelPasswordChange
  };
};
