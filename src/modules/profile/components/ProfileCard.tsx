'use client';

import { observer } from '@legendapp/state/react';
import { motion, useReducedMotion } from 'framer-motion';
import { UploadCloud, User as UserIcon, Phone, Calendar, CheckCircle, Hash, MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FormEvent, useState, useRef } from 'react';
import { UserProfile, UpdateProfileRequest } from '../types';
import { cn } from '@/lib/utils';
import { useProfileForm } from '../hooks/useProfileForm';

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (updates: UpdateProfileRequest) => void;
  className?: string;
}

export const ProfileCard = observer(
  ({ profile, isEditing, onToggleEdit, onUpdate, className }: ProfileCardProps) => {
    const shouldReduceMotion = useReducedMotion();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const {
        formData,
        showSaveConfirmation,
        setShowSaveConfirmation,
        handleFileChange,
        handleInputChange,
        handleAddressChange,
        confirmSave,
        cancelSave,
        handleReset,
        setFormData 
    } = useProfileForm({ profile, onUpdate, onToggleEdit });

    const handleAvatarClick = () => {
      fileInputRef.current?.click();
    };

    const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        await handleFileChange(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setShowSaveConfirmation(true);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
        className={cn("w-full max-w-8xl rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative", className)}
        aria-labelledby="glass-profile-settings-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        />
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Profile
            </div>
            <h1
              id="glass-profile-settings-title"
              className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Profile settings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isEditing ? "Update your personal details." : "View and manage your profile information."}
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={onToggleEdit}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <UploadCloud className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <Badge className="group gap-2 rounded-full border border-border/60 bg-white/5 px-4 py-2 text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:bg-primary/15 hover:text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Editing
            </Badge>
          )}
        </div>

        {isEditing ? (
          <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
              <div className="relative group">
                <Avatar 
                  className="h-24 w-24 border border-border/60 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={formData.avatar || profile.avatar || ''} alt={formData.fullName || 'User Avatar'} className="object-cover" />
                  <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                    {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{formData.fullName}</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileSelect} 
                className="hidden" 
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border/60 bg-white/5 px-4 py-2 text-sm text-foreground"
                onClick={handleAvatarClick}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Update avatar
              </Button>
            </div>
          </div>

          <div className="space-y-6 sm:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-fullname">Full Name</Label>
                </div>
                <Input
                  id="profile-fullname"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-nickname">Nick Name</Label>
                </div>
                <Input
                  id="profile-nickname"
                  value={formData.nickName || ''}
                  onChange={(e) => handleInputChange('nickName', e.target.value)}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-phone">Phone number</Label>
                </div>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-dob">Date of Birth</Label>
                </div>
                <Input
                  id="profile-dob"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                />
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="profile-gender">Gender</Label>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    {['MALE', 'FEMALE', 'OTHER'].map((gender) => (
                        <div key={gender} className="flex items-center gap-2 cursor-pointer group" onClick={() => handleInputChange('gender', gender)}>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            formData.gender === gender ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                          )}>
                             {formData.gender === gender && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                          </div>
                          <span className={cn("text-sm", formData.gender === gender ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                              {gender.charAt(0) + gender.slice(1).toLowerCase()}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-base font-medium">Address Information</Label>
                 </div>
                 
                 <div className="grid gap-6 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
                    <div className="space-y-3">
                       <Label htmlFor="address-val" className="text-sm font-medium">Physical Address <span className="text-red-500">*</span></Label>
                       <Input
                         id="address-val"
                         // Check if addresses array is populated, else use default or empty
                         value={formData.addresses && formData.addresses[0] ? formData.addresses[0].address : ''}
                         onChange={(e) => handleAddressChange(0, 'address', e.target.value)}
                         placeholder="e.g. 123 Main St, New York, NY 10001"
                         className="h-11 rounded-xl border-border/60 bg-background/60 px-4"
                       />
                       <p className="text-[0.8rem] text-muted-foreground">
                         Enter your primary physical address where you can receive mail.
                       </p>
                    </div>
                    
                    <div className="space-y-3">
                       <Label htmlFor="address-other" className="text-sm font-medium">Address Description / Note</Label>
                       <Input
                         id="address-other"
                         value={formData.addresses && formData.addresses[0] ? (formData.addresses[0].other || '') : ''}
                         onChange={(e) => handleAddressChange(0, 'other', e.target.value)}
                         placeholder="e.g. Apartment complex, near the central park, gate code 1234"
                         className="h-11 rounded-xl border-border/60 bg-background/60 px-4"
                       />
                       <p className="text-[0.8rem] text-muted-foreground">
                         Add any extra details, landmarks, or delivery instructions for this address.
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border/60 bg-white/5 px-6 py-3 text-sm text-muted-foreground hover:text-primary"
                onClick={handleReset}
              >
                Cancel
              </Button>
              <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Confirm Changes
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to save these changes to your profile?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancelSave}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmSave}>Save changes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-[0_20px_60px_-30px_rgba(79,70,229,0.75)] transition-transform duration-300 hover:-translate-y-1"
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
        ) : (
          // View mode - display profile information
          <div className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-5">
              <div className="sm:col-span-2">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
                  <div className="relative group">
                    <Avatar 
                      className="h-24 w-24 border border-border/60 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    >
                      <AvatarImage src={profile.avatar || ''} alt={profile.fullName || 'User Avatar'} className="object-cover" />
                      <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                        {profile.fullName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{profile.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      @{profile.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:col-span-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                    </div>
                    <p className="text-foreground">{profile.fullName || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Nick Name</span>
                    </div>
                    <p className="text-foreground">{profile.nickName || 'Not provided'}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Phone number</span>
                    </div>
                    <p className="text-foreground">{profile.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Date of Birth</span>
                    </div>
                    <p className="text-foreground">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Gender</span>
                  </div>
                  <p className="text-foreground">{profile.gender || 'Not provided'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Address</span>
                  </div>
                  {profile.addresses && profile.addresses.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        <div className="rounded-lg border border-border/40 bg-background/40 p-3 text-sm flex flex-col gap-1">
                             <div className="font-medium">{profile.addresses[0].address}</div>
                             {profile.addresses[0].other && (
                               <div className="text-xs text-muted-foreground">{profile.addresses[0].other}</div>
                             )}
                        </div>
                    </div>
                  ) : (
                    <p className="text-foreground">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);