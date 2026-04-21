import { Suspense } from 'react';
import { Metadata } from 'next';
import { courseService } from '@/modules/course/services';
import { CourseDetailWrapper } from './CourseDetailWrapper';
import { Skeleton } from '@/components/ui/skeleton';

const BASE_URL = 'https://victeach.io.vn';

type Props = {
  params: Promise<{ slug: string }>;
};

import { cache } from 'react';

// Caching the service call for the current request
const getCourse = cache(async (slug: string) => {
  return await courseService.getCourseBySlugName(slug);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await getCourse(slug);

    if (!course) {
      return {
        title: 'Khóa học - VICTEACH',
        description: 'Thông tin chi tiết về khóa học tại VICTEACH.',
      };
    }

    const desc = course.description?.substring(0, 160).replace(/<[^>]*>/g, '') || '';
    const imageUrl = course.thumbnailUrl || `${BASE_URL}/og-image.png`;
    const courseUrl = `${BASE_URL}/course/${slug}`;

    return {
      title: course.title,
      description: desc,
      alternates: { canonical: courseUrl },
      openGraph: {
        type: 'article',
        url: courseUrl,
        title: course.title,
        description: desc,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: course.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: course.title,
        description: desc,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error(`[SEO] Failed to fetch metadata for slug: ${slug}`, error);
    return { title: 'Course Detail' };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseDetailContent slug={slug} />
    </Suspense>
  );
}

async function CourseDetailContent({ slug }: { slug: string }) {
  // Server-side fetch
  const course = await getCourse(slug);
  
  let courseSchema = null;
  if (course) {
    const courseUrl = `${BASE_URL}/course/${slug}`;
    courseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description?.replace(/<[^>]*>/g, '') || '',
      url: courseUrl,
      image: course.thumbnailUrl || `${BASE_URL}/og-image.png`,
      provider: {
        '@type': 'Organization',
        name: 'VICTEACH',
        sameAs: BASE_URL,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Khóa học', item: `${BASE_URL}/course` },
          { '@type': 'ListItem', position: 3, name: course.title, item: courseUrl },
        ],
      },
    };
  }

  return (
    <>
      {courseSchema && (
        <script
          key="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <CourseDetailWrapper key={slug} slug={slug} initialData={course} />
    </>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-pulse">
      <div className="h-[400px] w-full bg-muted rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 w-2/3 bg-muted rounded-xl" />
          <div className="h-4 w-full bg-muted rounded-lg" />
          <div className="h-4 w-5/6 bg-muted rounded-lg" />
          <div className="h-64 w-full bg-muted rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-64 w-full bg-muted rounded-2xl" />
          <div className="h-32 w-full bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
