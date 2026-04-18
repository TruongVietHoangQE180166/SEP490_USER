'use client';

import { BlogDetail } from '@/modules/blog/components/BlogDetail';

export function BlogDetailWrapper({ slug }: { slug: string }) {
  return <BlogDetail slug={slug} />;
}
