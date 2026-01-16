import { BlogPost, BlogAuthor, BlogCategory } from './types';

export const mockAuthors: BlogAuthor[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1',
    bio: 'Chuyên gia về quản lý khủng hoảng và an toàn cộng đồng',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2',
    bio: 'Nhà nghiên cứu về ứng phó thiên tai',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author3',
    bio: 'Chuyên gia về y tế công cộng',
  },
];

export const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Thiên tai', slug: 'thien-tai' },
  { id: '2', name: 'Y tế', slug: 'y-te' },
  { id: '3', name: 'An toàn', slug: 'an-toan' },
  { id: '4', name: 'Hướng dẫn', slug: 'huong-dan' },
  { id: '5', name: 'Tin tức', slug: 'tin-tuc' },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Hướng dẫn ứng phó khi xảy ra động đất',
    slug: 'huong-dan-ung-pho-khi-xay-ra-dong-dat',
    excerpt: 'Động đất là hiện tượng thiên nhiên nguy hiểm có thể xảy ra bất cứ lúc nào. Bài viết này sẽ hướng dẫn bạn các bước cần thiết để bảo vệ bản thân và gia đình.',
    content: `
# Hướng dẫn ứng phó khi xảy ra động đất

Động đất là một trong những thảm họa thiên nhiên nguy hiểm nhất, có thể gây ra thiệt hại lớn về người và tài sản. Việc chuẩn bị và biết cách ứng phó đúng đắn có thể cứu sống bạn và những người thân yêu.

## Trước khi động đất xảy ra

1. **Chuẩn bị túi cứu hộ khẩn cấp** bao gồm:
   - Nước uống và thực phẩm khô
   - Đèn pin và pin dự phòng
   - Radio pin
   - Thuốc men cần thiết
   - Giấy tờ quan trọng

2. **Lập kế hoạch sơ tán** cho gia đình
3. **Cố định các vật dụng nặng** trong nhà
4. **Tìm hiểu các điểm tập trung an toàn** trong khu vực

## Trong khi động đất xảy ra

- **Nếu ở trong nhà**: Núp dưới bàn chắc chắn, tránh xa cửa sổ
- **Nếu ở ngoài trời**: Di chuyển ra xa các tòa nhà, cột điện
- **Nếu đang lái xe**: Dừng xe ở nơi an toàn, tránh cầu và đường cao tốc

## Sau khi động đất

1. Kiểm tra thương tích và sơ cứu nếu cần
2. Tắt gas, điện nếu có mùi lạ
3. Lắng nghe thông tin từ các cơ quan chức năng
4. Chuẩn bị cho các dư chấn

*Hãy luôn giữ bình tĩnh và tuân theo hướng dẫn của các cơ quan chức năng.*
    `,
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    author: mockAuthors[0],
    category: mockCategories[0],
    tags: ['động đất', 'thiên tai', 'an toàn', 'hướng dẫn'],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 5,
    views: 1234,
    featured: true,
  },
  {
    id: '2',
    title: 'Phòng chống dịch bệnh trong cộng đồng',
    slug: 'phong-chong-dich-benh-trong-cong-dong',
    excerpt: 'Các biện pháp phòng ngừa và kiểm soát dịch bệnh hiệu quả giúp bảo vệ sức khỏe cộng đồng.',
    content: `
# Phòng chống dịch bệnh trong cộng đồng

Dịch bệnh có thể lây lan nhanh chóng trong cộng đồng nếu không có các biện pháp phòng ngừa phù hợp.

## Các biện pháp phòng ngừa cơ bản

1. **Vệ sinh cá nhân**
   - Rửa tay thường xuyên với xà phòng
   - Đeo khẩu trang khi cần thiết
   - Che miệng khi ho hoặc hắt hơi

2. **Vệ sinh môi trường**
   - Giữ gìn vệ sinh nhà cửa
   - Xử lý rác thải đúng cách
   - Diệt côn trùng gây bệnh

3. **Tăng cường sức đề kháng**
   - Ăn uống đầy đủ dinh dưỡng
   - Tập thể dục thường xuyên
   - Ngủ đủ giấc

## Khi có dấu hiệu bệnh

- Cách ly tại nhà
- Liên hệ cơ sở y tế
- Theo dõi triệu chứng
- Tuân thủ hướng dẫn điều trị
    `,
    coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    author: mockAuthors[2],
    category: mockCategories[1],
    tags: ['y tế', 'dịch bệnh', 'phòng ngừa', 'sức khỏe'],
    publishedAt: '2024-01-20T14:30:00Z',
    readTime: 4,
    views: 856,
    featured: true,
  },
  {
    id: '3',
    title: 'An toàn giao thông trong mùa mưa bão',
    slug: 'an-toan-giao-thong-trong-mua-mua-bao',
    excerpt: 'Những lưu ý quan trọng khi tham gia giao thông trong điều kiện thời tiết xấu.',
    content: `
# An toàn giao thông trong mùa mưa bão

Mùa mưa bão đặt ra nhiều thách thức cho người tham gia giao thông.

## Chuẩn bị trước khi di chuyển

1. Kiểm tra phương tiện
2. Theo dõi dự báo thời tiết
3. Lên kế hoạch lộ trình
4. Chuẩn bị đồ dùng cần thiết

## Khi di chuyển

- Giảm tốc độ
- Tăng khoảng cách an toàn
- Bật đèn chiếu sáng
- Tránh các vùng ngập nước sâu

## Xử lý tình huống khẩn cấp

- Xe bị chết máy trong nước
- Mất tầm nhìn do mưa lớn
- Gặp đường ngập
    `,
    coverImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800',
    author: mockAuthors[1],
    category: mockCategories[2],
    tags: ['giao thông', 'mưa bão', 'an toàn', 'lái xe'],
    publishedAt: '2024-01-25T09:15:00Z',
    readTime: 3,
    views: 642,
    featured: false,
  },
  {
    id: '4',
    title: 'Cách sơ cứu ban đầu khi bị thương',
    slug: 'cach-so-cuu-ban-dau-khi-bi-thuong',
    excerpt: 'Kiến thức sơ cứu cơ bản có thể cứu sống người bị nạn trong những tình huống khẩn cấp.',
    content: `
# Cách sơ cứu ban đầu khi bị thương

Sơ cứu đúng cách có thể cứu sống người bị nạn và giảm thiểu biến chứng.

## Nguyên tắc sơ cứu

1. Đảm bảo an toàn cho người sơ cứu
2. Đánh giá tình trạng nạn nhân
3. Gọi cấp cứu 115
4. Thực hiện sơ cứu phù hợp

## Các trường hợp thường gặp

### Vết thương chảy máu
- Ấn trực tiếp vào vết thương
- Băng ép cầm máu
- Nâng cao vùng bị thương

### Bỏng
- Làm mát vết bỏng bằng nước sạch
- Không chọc vỡ phồng nước
- Băng vô trùng

### Gãy xương
- Cố định vùng bị thương
- Không di chuyển nạn nhân
- Chờ cấp cứu chuyên nghiệp
    `,
    coverImage: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800',
    author: mockAuthors[2],
    category: mockCategories[1],
    tags: ['sơ cứu', 'y tế', 'khẩn cấp', 'hướng dẫn'],
    publishedAt: '2024-02-01T11:00:00Z',
    readTime: 6,
    views: 1089,
    featured: false,
  },
  {
    id: '5',
    title: 'Ứng phó với lũ lụt: Những điều cần biết',
    slug: 'ung-pho-voi-lu-lut-nhung-dieu-can-biet',
    excerpt: 'Lũ lụt là thiên tai phổ biến ở Việt Nam. Hiểu rõ cách ứng phó sẽ giúp bạn bảo vệ gia đình và tài sản.',
    content: `
# Ứng phó với lũ lụt: Những điều cần biết

Lũ lụt gây ra nhiều thiệt hại về người và tài sản hàng năm.

## Chuẩn bị trước mùa lũ

1. Theo dõi cảnh báo thời tiết
2. Chuẩn bị vật dụng cần thiết
3. Lập kế hoạch sơ tán
4. Bảo vệ tài sản

## Khi lũ đến

- Di chuyển đến nơi cao
- Tắt điện, gas
- Mang theo đồ dùng cần thiết
- Không đi qua vùng nước chảy xiết

## Sau lũ

- Kiểm tra nhà cửa
- Vệ sinh môi trường
- Phòng bệnh dịch
- Khắc phục hậu quả
    `,
    coverImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
    author: mockAuthors[0],
    category: mockCategories[0],
    tags: ['lũ lụt', 'thiên tai', 'ứng phó', 'an toàn'],
    publishedAt: '2024-02-05T08:30:00Z',
    readTime: 5,
    views: 923,
    featured: true,
  },
  {
    id: '6',
    title: 'Xây dựng kế hoạch ứng phó khủng hoảng gia đình',
    slug: 'xay-dung-ke-hoach-ung-pho-khung-hoang-gia-dinh',
    excerpt: 'Một kế hoạch ứng phó khủng hoảng tốt sẽ giúp gia đình bạn sẵn sàng đối phó với mọi tình huống.',
    content: `
# Xây dựng kế hoạch ứng phó khủng hoảng gia đình

Mỗi gia đình cần có một kế hoạch ứng phó khủng hoảng cụ thể.

## Các bước xây dựng kế hoạch

1. **Đánh giá rủi ro**
   - Xác định các nguy cơ có thể xảy ra
   - Đánh giá mức độ ảnh hưởng

2. **Lập kế hoạch hành động**
   - Xác định điểm tập trung
   - Phân công nhiệm vụ
   - Chuẩn bị vật dụng

3. **Thực hành định kỳ**
   - Diễn tập sơ tán
   - Kiểm tra trang thiết bị
   - Cập nhật kế hoạch

## Danh sách kiểm tra

- [ ] Túi cứu hộ khẩn cấp
- [ ] Danh bạ liên lạc
- [ ] Bản đồ sơ tán
- [ ] Giấy tờ quan trọng
- [ ] Nguồn nước và thực phẩm dự trữ
    `,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    author: mockAuthors[1],
    category: mockCategories[3],
    tags: ['kế hoạch', 'gia đình', 'chuẩn bị', 'an toàn'],
    publishedAt: '2024-02-10T15:45:00Z',
    readTime: 7,
    views: 756,
    featured: false,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return mockBlogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (categorySlug: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.category.slug === categorySlug);
};
