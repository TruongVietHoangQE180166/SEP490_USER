'use client';

import { useParams } from 'next/navigation';
import { BlogDetail } from '@/modules/blog/components/BlogDetail';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <BlogDetail slug={slug} />;
}
