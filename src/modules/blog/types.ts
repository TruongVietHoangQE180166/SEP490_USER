export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  createdDate: string;
  isActive: boolean;
  slug?: string; // Keep slug as optional for compatibility with existing code
}

export interface ApiMessage {
  messageCode: string;
  messageDetail: string;
}

export interface BlogCategoryApiResponse {
  message: ApiMessage;
  errors: any;
  data: BlogCategory[];
  success: boolean;
}

export interface BlogPost {
  id: string;
  createdDate: string;
  title: string;
  content: string;
  image: string;
  emojis: number;
  view: boolean;
  userName: string;
  fullname: string;
  categoryName: string;
  slugName: string;
  // For UI compatibility, we might keep some optional fields or map them
  readTime?: number;
}

export interface BlogPaginationResponse {
  message: ApiMessage;
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

export interface BlogDetailApiResponse {
  message: ApiMessage;
  errors: any;
  data: BlogPost;
  success: boolean;
}

export interface BlogState {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: BlogCategory[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  isCategoriesLoading: boolean;
  error: string | null;
}
