# Vet Medicine 68

Website catalogue thuốc thú y bằng Next.js App Router và Supabase. Website tập trung vào tra cứu sản phẩm, nội dung kiến thức và liên hệ Zalo hoặc điện thoại. Không có giỏ hàng, checkout, thanh toán, tài khoản khách hàng hoặc quản lý đơn hàng.

## Công nghệ

- Next.js 16, React 19, TypeScript strict
- Tailwind CSS v4, shadcn/ui, Lucide React
- Supabase Postgres, Auth, Storage và Row Level Security
- Zod, React Hook Form
- Vercel Analytics và Speed Insights
- Vitest, Playwright và axe-core

## Chạy local

Yêu cầu Node.js phiên bản LTS và pnpm 11.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Mở `http://localhost:3000`.

Khi chưa có biến môi trường Supabase, các trang public sử dụng dữ liệu minh họa đã được gắn nhãn rõ. Khu vực `/admin` không thể truy cập cho đến khi Supabase được cấu hình.

## Biến môi trường

```env
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Cấu hình liên hệ dự phòng khi site_settings chưa có dữ liệu
NEXT_PUBLIC_VET68_PHONE=0900000068
NEXT_PUBLIC_VET68_PHONE_DISPLAY="0900 000 068"
NEXT_PUBLIC_VET68_ZALO_URL=https://zalo.me/0900000068
NEXT_PUBLIC_VET68_EMAIL=lienhe@vetmedicine68.vn
NEXT_PUBLIC_VET68_ADDRESS="Địa chỉ cần cập nhật"
```

Không thêm Supabase service-role key vào biến `NEXT_PUBLIC_*` hoặc mã chạy trên trình duyệt. Ứng dụng không cần service-role key cho luồng thông thường.

## Thiết lập Supabase

Đăng nhập Supabase CLI, liên kết project rồi áp dụng migration:

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
pnpm exec supabase db push
```

Migration chính nằm tại `supabase/migrations/20260726190000_initial_schema.sql`. File này tạo schema, index, constraint, trigger `updated_at`, RLS và policy Storage. Dữ liệu minh họa tùy chọn nằm tại `supabase/seed.sql`.

Để chạy Supabase local, Docker hoặc OrbStack cần hoạt động:

```bash
pnpm exec supabase start
pnpm exec supabase db reset
pnpm exec supabase test db
```

### Tạo admin đầu tiên

1. Tạo hoặc mời người dùng trong Supabase Auth.
2. Profile mới luôn ở trạng thái chưa kích hoạt để ngăn tự đăng ký trở thành staff.
3. Chạy câu lệnh sau trong SQL Editor bằng quyền chủ project:

```sql
update public.profiles
set role = 'admin', is_active = true
where id = 'AUTH_USER_UUID';
```

Admin có thể xóa dữ liệu và cập nhật site settings. Staff có thể tạo, chỉnh sửa catalogue, ảnh, bài viết và banner nhưng không thể xóa các tài nguyên cấp cao hoặc sửa site settings.

## Nội dung và hình ảnh

Các bucket Storage:

- `product-images`
- `category-images`
- `animal-images`
- `brand-logos`
- `banners`
- `article-covers`

Ảnh sản phẩm có thể tải lên, đặt ảnh đại diện, sắp xếp và xóa trong trang chỉnh sửa sản phẩm. Alt text là bắt buộc. Nội dung liều dùng, chống chỉ định, thời gian ngưng thuốc và tuyên bố điều trị chỉ được nhập từ thông tin đã xác minh.

## Kiểm tra chất lượng

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Playwright chạy cả desktop và mobile, kiểm tra luồng public chính, quyền truy cập admin, lỗi runtime và lỗi accessibility nghiêm trọng.

## Triển khai Vercel

1. Import repository vào Vercel.
2. Khai báo toàn bộ biến môi trường ở trên cho Production và Preview.
3. Đặt `NEXT_PUBLIC_SITE_URL` thành canonical production URL.
4. Áp dụng migration Supabase trước khi mở admin cho người dùng.
5. Cập nhật thông tin liên hệ trong `/admin/cai-dat`.
6. Thay dữ liệu, ảnh và nội dung demo bằng dữ liệu đã được Vet Medicine 68 xác minh.

Vercel Analytics và Speed Insights đã được gắn tại root layout.

## Định hướng thiết kế

Thiết kế public theo hướng trust-first cho ngành thú y, dùng navy, medical red và yellow có kiểm soát. Các mức thiết kế: Variance 4, Motion 2, Density 5. Giao diện ưu tiên khả năng đọc, tìm kiếm và liên hệ, không dùng hiệu ứng gây mất tập trung.
