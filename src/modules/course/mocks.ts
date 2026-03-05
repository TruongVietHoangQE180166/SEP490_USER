import { Course } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    slug: 'lap-trinh-react-professional-2024',
    title: 'Lập trình React Professional 2024',
    description: 'Khóa học từ cơ bản đến nâng cao, tập trung vào thực hành xây dựng các ứng dụng thực tế với React, Next.js và TailwindCSS.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    price: 1500000,
    salePrice: 990000,
    discountPercent: 34,
    averageRate: 4.8,
    rating: 4.8,
    totalRate: 120,
    totalStudents: 1250,
    totalLessons: 45,
    totalDuration: '25 giờ',
    status: 'PUBLISHED',
    createdDate: '2024-01-15T00:00:00',
    isEnrolled: false,
    assets: ['GOLD', 'REACT'],
    author: {
      id: 'auth-1',
      name: 'Trường Việt Hoàng',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang',
      role: 'Senior Frontend Engineer',
    },
    moocs: [
      {
        id: 'sec-1',
        title: 'Chương 1: Giới thiệu & Cài đặt',
        description: 'Bắt đầu với React',
        orderIndex: 1,
        isPreview: true,
        createdDate: '2024-01-15T00:00:00',
        courseId: 'course-1',
        videos: [
          {
            id: 'les-1-1',
            title: 'Tổng quan về hệ sinh thái React',
            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            duration: '10:15',
            orderIndex: 1,
            isPreview: true,
            fileName: 'react-overview.mp4',
            videoStatus: 'SUCCESS',
            createdDate: '2024-01-15T00:00:00',
            moocId: 'sec-1'
          }
        ],
        quizzes: [],
        documents: [
          {
            id: 'les-1-2',
            title: 'Tài liệu hướng dẫn cài đặt môi trường',
            viewUrl: '#',
            downloadUrl: '#',
            fileType: 'DOCX',
            orderIndex: 2,
            moocId: 'sec-1',
            createdDate: '2024-01-15T00:00:00'
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'thiet-ke-giao-dien-ui-ux-dinh-cao',
    title: 'Thiết kế giao diện UI/UX đỉnh cao',
    description: 'Học cách tư duy và sử dụng Figma để tạo ra những bản thiết kế web/app hiện đại, thu hút người dùng.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541462608141-ad65516e3226?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad65516e3226?w=800',
    price: 750000,
    salePrice: 675000,
    discountPercent: 10,
    averageRate: 4.9,
    rating: 4.9,
    totalRate: 85,
    totalStudents: 850,
    totalLessons: 32,
    totalDuration: '18 giờ',
    status: 'PUBLISHED',
    createdDate: '2024-01-10T00:00:00',
    isEnrolled: false,
    assets: ['UI/UX', 'FIGMA'],
    author: {
      id: 'auth-2',
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
      role: 'UI/UX Designer',
    },
    moocs: []
  }
];
