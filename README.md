# FlashUp - Flashcard Learning Application

**[Live Demo](https://flashcard.duongle.site/)**

FlashUp là ứng dụng hỗ trợ học từ vựng tiếng Anh hiệu quả thông qua phương pháp Flashcard, tích hợp Spaced Repetition System (Lặp lại ngắt quãng) và AI để tối ưu hóa quá trình ghi nhớ.

## Tính năng nổi bật

- **Quản lý Flashcard**: Tạo và quản lý các bộ từ vựng (Folders) và Flashcard dễ dàng.
- **Học thông minh (Smart Learn)**: Ứng dụng thuật toán SRS (SuperMemo-2/Anki) để nhắc nhở ôn tập đúng thời điểm.
- **Chế độ Luyện tập đa dạng**:
    - **Multiple Choice**: Trắc nghiệm nhanh.
    - **Fill in the Blank**: Điền từ vào chỗ trống (nghe audio/gợi ý).
    - **Write Sentence**: Luyện viết câu với từ vựng.
- **Thống kê chi tiết**: Theo dõi tiến độ học tập, số từ đã thuộc, và streak hàng ngày.
- **Bảo mật & Tiện ích**:
    - Đăng nhập bằng Google hoặc Email/Password.
    - Xác thực Email và Quên mật khẩu an toàn.
- **AI Support**: Tự động tạo ví dụ và giải nghĩa từ vựng (tích hợp Gemini AI).
- **Giao diện hiện đại**: Responsive cho cả Mobile và Desktop.

---

## Yêu cầu hệ thống

- **Docker & Docker Compose** (Khuyến nghị)
- **Node.js**: v18+ (nếu muốn phát triển sâu)

## Cấu hình biến môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án. Có thể copy từ `.env.example` trong thư mục gốc của dự án.

---

## Hướng dẫn chạy Development (Docker)

```bash
docker compose up -d
```

- **Web**: http://localhost:3000
- **API**: http://localhost:8000
- **Database**: Port 5432 (được expose ra ngoài host)

---

## Hướng dẫn chạy Production

Sử dụng `docker-compose.prod.yml` để deploy môi trường Production. File này cấu hình Nginx, tối ưu hóa build, và sử dụng biến môi trường cho Prod.

1.  **Cập nhật .env**:
    Đảm bảo các biến môi trường Production đã được điền đầy đủ.

2.  **Cấu hình Tên miền (Optional but Recommended)**:

    Để deploy lên tên miền riêng (ví dụ: `yourdomain.com`), cần thực hiện 2 bước sau:

    **Bước 1: Sửa file `nginx/nginx.conf`**
    Tìm và thay thế `server_name` theo tên miền cần trỏ:
    ```nginx
    # API Server Block
    server {
        server_name api.yourdomain.com; # Thay đổi dòng này
        # ...
    }

    # Web Server Block
    server {
        server_name yourdomain.com; # Thay đổi dòng này
        # ...
    }
    ```

    **Bước 2: Sửa file `docker-compose.prod.yml`**
    Tìm và thay thế các biến môi trường sau theo tên miền cần trỏ:
    - `FRONTEND_URL`: `https://yourdomain.com`
    - `API_URL`: `https://api.yourdomain.com`
    - `GOOGLE_CALLBACK_URL`: `https://api.yourdomain.com/auth/google/callback`
    - `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com`

3.  **Build và Run**:
    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```
