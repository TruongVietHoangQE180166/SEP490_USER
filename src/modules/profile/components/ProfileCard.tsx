'use client';

import { observer } from '@legendapp/state/react';
import { motion, useReducedMotion } from 'framer-motion';
import { UploadCloud, User, Mail, Phone, MapPin, Quote, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FormEvent, useState } from 'react';
import { UserProfile } from '../types';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (updates: Partial<UserProfile>) => void;
  className?: string;
}

export const ProfileCard = observer(
  ({ profile, isEditing, onToggleEdit, onUpdate, className }: ProfileCardProps) => {
    const shouldReduceMotion = useReducedMotion();
    
    const [formData, setFormData] = useState({
      name: profile.name,
      bio: profile.bio || '',
      phone: profile.phone || '',
      address: profile.address || '',
    });
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setShowSaveConfirmation(true);
    };
    
    const confirmSave = () => {
      onUpdate(formData);
      onToggleEdit();
      setShowSaveConfirmation(false);
    };
    
    const cancelSave = () => {
      setShowSaveConfirmation(false);
    };

    const handleReset = () => {
      setFormData({
        name: profile.name,
        bio: profile.bio || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      onToggleEdit();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
        }}
        className={cn("w-full max-w-6xl rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative", className)}
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
              {isEditing ? "Update your avatar, personal details, and notification preferences." : "View and manage your profile information."}
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
                  onClick={() => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur z-[99999] flex items-center justify-center p-4';
                    modal.onclick = (e) => {
                      if (e.target === modal) modal.remove();
                    };
                    
                    const img = document.createElement('img');
                    img.src = profile.avatar || '';
                    img.alt = profile.name || 'User Avatar';
                    img.className = 'max-w-full max-h-full rounded-full object-cover';
                    
                    modal.appendChild(img);
                    document.body.appendChild(modal);
                  }}
                >
                  <AvatarImage src={profile.avatar || ''} alt={profile.name || 'User Avatar'} className="object-cover" />
                  <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                    {profile.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur z-[99999] flex items-center justify-center p-4';
                    modal.onclick = (e) => {
                      if (e.target === modal) modal.remove();
                    };
                    
                    const img = document.createElement('img');
                    img.src = profile.avatar || '';
                    img.alt = profile.name || 'User Avatar';
                    img.className = 'max-w-full max-h-full rounded-full object-cover';
                    
                    modal.appendChild(img);
                    document.body.appendChild(modal);
                  }}
                >
                  <span className="text-white text-xs font-medium bg-black/50 rounded-full px-2 py-1">Click to view</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{profile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border/60 bg-white/5 px-4 py-2 text-sm text-foreground"
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
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-first-name">First name</Label>
                </div>
                <Input
                  id="profile-first-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-last-name">Last name</Label>
                </div>
                <Input
                  id="profile-last-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-email">Email address</Label>
                </div>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="profile-phone">Phone number</Label>
                </div>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="profile-address">Address</Label>
              </div>
              <Input
                id="profile-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your address"
                className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="profile-bio">Bio</Label>
              </div>
              <Textarea
                id="profile-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="rounded-2xl border-border/60 bg-background/60 px-4 py-3 text-sm"
                placeholder="Tell us about your role, interests, or current focus."
              />
              <p className="text-right text-xs text-muted-foreground">
                {formData.bio.length}/160 characters
              </p>
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
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur z-[99999] flex items-center justify-center p-4';
                        modal.onclick = (e) => {
                          if (e.target === modal) modal.remove();
                        };
                        
                        const img = document.createElement('img');
                        img.src = profile.avatar || '';
                        img.alt = profile.name || 'User Avatar';
                        img.className = 'max-w-full max-h-full rounded-full object-cover';
                        
                        modal.appendChild(img);
                        document.body.appendChild(modal);
                      }}
                    >
                      <AvatarImage src={profile.avatar || ''} alt={profile.name || 'User Avatar'} className="object-cover" />
                      <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                        {profile.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur z-[99999] flex items-center justify-center p-4';
                        modal.onclick = (e) => {
                          if (e.target === modal) modal.remove();
                        };
                        
                        const img = document.createElement('img');
                        img.src = profile.avatar || '';
                        img.alt = profile.name || 'User Avatar';
                        img.className = 'max-w-full max-h-full rounded-full object-cover';
                        
                        modal.appendChild(img);
                        document.body.appendChild(modal);
                      }}
                    >
                      <span className="text-white text-xs font-medium bg-black/50 rounded-full px-2 py-1">Click to view</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:col-span-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">First name</span>
                    </div>
                    <p className="text-foreground">{profile.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Last name</span>
                    </div>
                    <p className="text-foreground">{profile.name}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Email address</span>
                    </div>
                    <p className="text-foreground">{profile.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Phone number</span>
                    </div>
                    <p className="text-foreground">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Address</span>
                  </div>
                  <p className="text-foreground">{profile.address || 'Not provided'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Bio</span>
                  </div>
                  <p className="text-foreground">{profile.bio || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);