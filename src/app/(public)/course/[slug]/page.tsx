import { Metadata } from 'next';
import { courseService } from '@/modules/course/services';
import { CourseDetailWrapper } from './CourseDetailWrapper';

const BASE_URL = 'https://victeach.io.vn';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await courseService.getCourseBySlugName(slug);

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

  // Server-side fetch for JSON-LD only
  let courseSchema = null;
  try {
    const course = await courseService.getCourseBySlugName(slug);
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
  } catch (_) {}

  return (
    <>
      {courseSchema && (
        <script
          key="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <CourseDetailWrapper key={slug} slug={slug} />
    </>
  );
}
