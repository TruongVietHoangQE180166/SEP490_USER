import { Metadata } from 'next';
import { blogService } from '@/modules/blog/services';
import { BlogDetailWrapper } from './BlogDetailWrapper';

const BASE_URL = 'https://victeach.io.vn';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post) {
    return { title: 'Bài viết không tồn tại | VICTEACH' };
  }

  const desc = post.content.substring(0, 160).replace(/<[^>]*>/g, '');
  const imageUrl = post.image || `${BASE_URL}/og-image.png`;
  const postUrl = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: desc,
    alternates: { canonical: postUrl },
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: desc,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: desc,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  // Server-side fetch for JSON-LD only
  let articleSchema = null;
  try {
    const post = await blogService.getPostBySlug(slug);
    if (post) {
      const postUrl = `${BASE_URL}/blog/${slug}`;
      articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.content.substring(0, 200).replace(/<[^>]*>/g, ''),
        image: post.image || `${BASE_URL}/og-image.png`,
        url: postUrl,
        datePublished: post.createdDate,
        publisher: {
          '@type': 'Organization',
          name: 'VICTEACH',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
          ],
        },
      };
    }
  } catch (_) {}

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <BlogDetailWrapper slug={slug} />
    </>
  );
}
