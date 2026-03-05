import { BlogPost, BlogCategory } from '../blog/types';

export interface BlogManagementState {
  blogs: BlogPost[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  selectedBlog: BlogPost | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  // Pagination
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Filters
  filterCategory: string;
  searchQuery: string;
  // Categories for selection
  categories: BlogCategory[];
  isCategoriesLoading: boolean;
}

// ─── List API ───────────────────────────────────────────────────────────────
export interface BlogApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: {
    content: BlogPost[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// ─── Image Upload ─────────────────────────────────────────────────────────
/** POST /api/images/upload  (body: binary file as octet-stream) */
export interface ImageUploadApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  /** Cloudinary URL of the uploaded image */
  data: string;
  success: boolean;
}

// ─── Create / Update Blog ─────────────────────────────────────────────────
/** POST /api/blogs  request body */
export interface CreateBlogRequest {
  title: string;
  content: string;
  /** Cloudinary URL obtained from uploadImage() */
  image: string;
  view: boolean;
  userId: string;
  categoryId: string;
}

/** PUT /api/blogs/blog-id/{blogId}  request body */
export interface UpdateBlogRequest {
  title: string;
  content: string;
  /** Cloudinary URL — bắt buộc khi edit, dùng URL cũ nếu không thay ảnh */
  image: string;
  categoryId: string;
}

/** Single-blog API wrapper (create / update response) */
export interface SingleBlogApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: BlogPost;
  success: boolean;
}

// ─── Toggle Visibility ────────────────────────────────────────────────────────
/** PUT /api/blogs/show/{slugName}  request body */
export interface ToggleVisibilityRequest {
  show: boolean;
}
