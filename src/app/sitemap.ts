import { MetadataRoute } from 'next';
import { courseService } from '@/modules/course/services';
import { blogService } from '@/modules/blog/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://victeach.io.vn';

  // Base persistent routes
  const staticRoutes = [
    '',
    '/course',
    '/trading',
    '/blog',
    '/about',
    '/documentation',
    '/speech-to-text',
    '/certificate',
    '/login',
    '/register',
    '/forgot-password',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' || route === '/blog' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // 1. Fetch dynamic Courses
    const courses = await courseService.getAllCourses(1, 1000).catch((err) => {
      console.error('[Sitemap] Course fetch error:', err);
      return [];
    });
    
    const courseRoutes = courses.map((course) => ({
      url: `${baseUrl}/course/${course.slug}`,
      lastModified: new Date(course.createdDate || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 2. Fetch dynamic Blog posts
    const blogs = await blogService.getAllPosts(1, 1000).catch((err) => {
      console.error('[Sitemap] Blog fetch error:', err);
      return [];
    });
    
    const blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slugName}`,
      lastModified: new Date(blog.createdDate || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Combine all routes
    return [...staticRoutes, ...courseRoutes, ...blogRoutes];
  } catch (error) {
    console.error('[Sitemap] Critical error generating dynamic sitemap:', error);
    return staticRoutes;
  }
}
