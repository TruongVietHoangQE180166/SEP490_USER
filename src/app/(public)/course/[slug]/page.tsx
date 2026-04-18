import { Metadata } from 'next';
import { courseService } from '@/modules/course/services';
import { CourseDetailWrapper } from './CourseDetailWrapper';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await courseService.getCourseBySlugName(slug);

    if (!course) {
      console.warn(`[SEO] Course not found for slugName: ${slug}`);
      return {
        title: 'Khóa học - VICTEACH',
        description: 'Thông tin chi tiết về khóa học tại VICTEACH.',
      };
    }

    return {
      title: course.title,
      description: course.description?.substring(0, 160) || '',
      openGraph: {
        title: course.title,
        description: course.description?.substring(0, 160) || '',
        images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
      },
    };
  } catch (error) {
    console.error(`[SEO] Failed to fetch metadata for slug: ${slug}`, error);
    return {
      title: 'Course Detail',
    };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  return <CourseDetailWrapper slug={slug} />;
}
