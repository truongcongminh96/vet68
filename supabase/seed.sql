insert into public.categories (name, slug, kind, description, sort_order) values
  ('Thuốc thú y', 'thuoc-thu-y', 'product_type', 'Dữ liệu taxonomy demo.', 10),
  ('Vaccine và sinh phẩm', 'vaccine-sinh-pham', 'product_type', 'Dữ liệu taxonomy demo.', 20),
  ('Vitamin và dinh dưỡng', 'vitamin-dinh-duong', 'product_type', 'Dữ liệu taxonomy demo.', 30),
  ('Sát trùng và vệ sinh', 'sat-trung-ve-sinh', 'product_type', 'Dữ liệu taxonomy demo.', 40),
  ('Dụng cụ thú y', 'dung-cu-thu-y', 'product_type', 'Dữ liệu taxonomy demo.', 50),
  ('Kháng sinh', 'khang-sinh', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 60),
  ('Vitamin và khoáng', 'vitamin-khoang-chat', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 70),
  ('Hỗ trợ tiêu hóa', 'ho-tro-tieu-hoa', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 80),
  ('Hỗ trợ hô hấp', 'ho-tro-ho-hap', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 90),
  ('Sát trùng', 'sat-trung', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 100),
  ('Vaccine', 'vaccine', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 110),
  ('Kiểm soát ký sinh trùng', 'kiem-soat-ky-sinh-trung', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 120),
  ('Dụng cụ thú y', 'dung-cu', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 130),
  ('Điện giải và phục hồi', 'dien-giai-phuc-hoi', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 140)
on conflict (slug) do nothing;

insert into public.animal_types (name, slug, description, sort_order) values
  ('Chó', 'cho', 'Dữ liệu demo.', 10),
  ('Mèo', 'meo', 'Dữ liệu demo.', 20),
  ('Gia súc', 'gia-suc', 'Dữ liệu demo.', 30),
  ('Gia cầm', 'gia-cam', 'Dữ liệu demo.', 40),
  ('Thuỷ sản', 'thuy-san', 'Dữ liệu demo.', 50),
  ('Thiết bị thú y', 'thiet-bi-thu-y', 'Dữ liệu demo.', 60)
on conflict (slug) do nothing;

insert into public.brands (name, slug, description, sort_order) values
  ('Vet68 Demo', 'vet68-demo', 'Thương hiệu minh họa, không đại diện quan hệ phân phối.', 10),
  ('AniVita Demo', 'anivita-demo', 'Thương hiệu minh họa.', 20),
  ('BioVet Demo', 'biovet-demo', 'Thương hiệu minh họa.', 30),
  ('FarmCare Demo', 'farmcare-demo', 'Thương hiệu minh họa.', 40)
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Amoxicillin 50% Demo', 'amoxicillin-50-demo', 'VET68-001',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, 125000, 'fixed', 'Giá demo.', 'Gói', 'Bột',
  'Thông tin minh họa: Amoxicillin 50%.', 'Gói 100 g',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Không có liều dùng trong dữ liệu demo.',
  'Đọc nhãn và tham khảo người có chuyên môn.', true, true, false, true, now()
from public.brands b cross join public.categories c
where b.slug = 'vet68-demo' and c.slug = 'thuoc-thu-y'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Vaccine Newcastle Demo', 'vaccine-newcastle-demo', 'VET68-003',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, null, 'contact', 'Liên hệ báo giá.', 'Lọ', 'Sinh phẩm',
  'Thông tin đang chờ xác minh.', 'Theo nhà sản xuất',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Không có lịch vaccine trong dữ liệu demo.',
  'Sử dụng theo hướng dẫn chuyên môn đã xác minh.', true, true, true, true, now()
from public.brands b cross join public.categories c
where b.slug = 'biovet-demo' and c.slug = 'vaccine-sinh-pham'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Vitamin ADE Plus Demo', 'vitamin-ade-plus-demo', 'VET68-002',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, 98000, 'approximate', 'Giá khoảng demo.', 'Chai', 'Dung dịch',
  'Thông tin thành phần đang chờ xác minh.', 'Chai 100 ml',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Liên hệ Vet68 để kiểm tra đúng quy cách.',
  'Đọc nhãn và tham khảo người có chuyên môn.', false, true, true, true, now()
from public.brands b cross join public.categories c
where b.slug = 'anivita-demo' and c.slug = 'vitamin-dinh-duong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Iodine Disinfectant Demo', 'iodine-disinfectant-demo', 'VET68-004',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, 165000, 'fixed', 'Giá demo.', 'Chai', 'Dung dịch sát trùng',
  'Thông tin nồng độ đang chờ xác minh.', 'Chai 1 lít',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Tỷ lệ pha phải lấy từ nhãn sản phẩm.',
  'Không trộn hóa chất khi chưa có hướng dẫn phù hợp.', false, true, true, true, now()
from public.brands b cross join public.categories c
where b.slug = 'farmcare-demo' and c.slug = 'sat-trung-ve-sinh'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Calcium Mineral Mix Demo', 'calcium-mineral-mix-demo', 'VET68-005',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, 210000, 'approximate', 'Giá khoảng demo.', 'Túi', 'Bột trộn',
  'Danh sách khoáng chất đang chờ xác minh.', 'Túi 1 kg',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Khẩu phần phải lấy từ nguồn chuyên môn.',
  'Không thay đổi khẩu phần chỉ dựa trên nội dung demo.', false, false, true, true, now()
from public.brands b cross join public.categories c
where b.slug = 'anivita-demo' and c.slug = 'vitamin-dinh-duong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Bơm tiêm thú y 20 ml Demo', 'bom-tiem-thu-y-20ml-demo', 'VET68-006',
  'Dữ liệu dụng cụ minh họa.', 'Thông số kỹ thuật đang chờ Vet Medicine 68 xác minh.',
  b.id, c.id, 45000, 'fixed', 'Giá demo.', 'Cái', 'Dụng cụ',
  'Không áp dụng.', '1 cái',
  'Dụng cụ minh họa.', 'Sử dụng theo hướng dẫn của nhà sản xuất.',
  'Bảo đảm vệ sinh và xử lý dụng cụ đúng quy trình.', false, false, false, true, now()
from public.brands b cross join public.categories c
where b.slug = 'farmcare-demo' and c.slug = 'dung-cu-thu-y'
on conflict (slug) do nothing;
