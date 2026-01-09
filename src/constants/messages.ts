export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Tên đăng nhập hoặc mật khẩu không đúng',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    REGISTER_SUCCESS: 'Đăng ký thành công!',
    REGISTER_FAILED: 'Tên đăng nhập đã tồn tại',
    UNAUTHORIZED: 'Bạn cần đăng nhập để tiếp tục',
  },
  ERROR: {
    NETWORK: 'Lỗi kết nối mạng',
    UNKNOWN: 'Đã có lỗi xảy ra',
    REQUIRED_FIELD: 'Vui lòng điền đầy đủ thông tin',
  },
} as const;