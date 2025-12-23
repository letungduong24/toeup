# Docker Setup Guide

## Production Build

Dự án đã được cấu hình để chạy ở production mode với Docker Compose.

### Yêu cầu
- Docker & Docker Compose
- pnpm (được cài tự động trong container)

### Cách sử dụng

#### 1. Build và start tất cả services:
```bash
docker compose up -d --build
```

#### 2. Xem logs:
```bash
# Tất cả services
docker compose logs -f

# Chỉ API
docker compose logs -f api

# Chỉ Web
docker compose logs -f web
```

#### 3. Stop services:
```bash
docker compose down
```

#### 4. Stop và xóa volumes (xóa database):
```bash
docker compose down -v
```

### Tự động Migrations

**Prisma migrations sẽ tự động chạy khi API container start lần đầu.**

Entrypoint script trong `apps/api/Dockerfile` sẽ:
1. Chạy `pnpm prisma migrate deploy` tự động
2. Nếu migrations đã apply, sẽ bỏ qua
3. Sau đó start API server

### Services

- **API**: http://localhost:8000
- **Web**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Environment Variables

Tạo file `.env` trong root (optional):
```env
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
POSTGRES_PASSWORD=your-password
```

### Build trên máy khác

Khi build trên máy khác, chỉ cần:
1. Clone repository
2. Chạy `docker compose up -d --build`
3. Migrations sẽ tự động chạy
4. Tất cả dependencies sẽ được install tự động

**Lưu ý**: 
- Đảm bảo có `pnpm-lock.yaml` trong repo
- Docker sẽ tự động install pnpm latest qua corepack
- Tất cả packages sẽ được build tự động


