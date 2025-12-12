'use client';

import { observer } from '@legendapp/state/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '../types';
import { useState } from 'react';

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export const ProfileCard = observer(
  ({ profile, isEditing, onToggleEdit, onUpdate }: ProfileCardProps) => {
    const [formData, setFormData] = useState({
      name: profile.name,
      bio: profile.bio || '',
      phone: profile.phone || '',
      address: profile.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdate(formData);
    };

    if (isEditing) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Họ và tên</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giới thiệu</label>
                <Input
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Địa chỉ</label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Lưu</Button>
                <Button type="button" variant="outline" onClick={onToggleEdit}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Thông tin cá nhân</CardTitle>
            <Button variant="outline" size="sm" onClick={onToggleEdit}>
              Chỉnh sửa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          {profile.bio && (
            <div>
              <p className="text-sm font-medium">Giới thiệu</p>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}
          {profile.phone && (
            <div>
              <p className="text-sm font-medium">Số điện thoại</p>
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
            </div>
          )}
          {profile.address && (
            <div>
              <p className="text-sm font-medium">Địa chỉ</p>
              <p className="text-sm text-muted-foreground">{profile.address}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);