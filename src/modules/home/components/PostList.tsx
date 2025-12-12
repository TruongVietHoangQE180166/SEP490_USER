'use client';

import { observer } from '@legendapp/state/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Post } from '../types';
import { Heart } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  onLike: (postId: string) => void;
}

export const PostList = observer(({ posts, onLike }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bởi {post.author} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{post.content}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="gap-2"
            >
              <Heart className="h-4 w-4" />
              {post.likes}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});