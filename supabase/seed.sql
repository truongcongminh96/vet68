insert into public.categories (name, slug, kind, description, sort_order) values
  ('Thuốc thú y', 'thuoc-thu-y', 'product_type', 'Dữ liệu taxonomy demo.', 10),
  ('Vaccine và sinh phẩm', 'vaccine-sinh-pham', 'product_type', 'Dữ liệu taxonomy demo.', 20),
  ('Vitamin và dinh dưỡng', 'vitamin-dinh-duong', 'product_type', 'Dữ liệu taxonomy demo.', 30),
  ('Sát trùng và vệ sinh', 'sat-trung-ve-sinh', 'product_type', 'Dữ liệu taxonomy demo.', 40),
  ('Dụng cụ thú y', 'dung-cu-thu-y', 'product_type', 'Dữ liệu taxonomy demo.', 50),
  ('Hỗ trợ hô hấp', 'ho-tro-ho-hap', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 60),
  ('Điện giải và phục hồi', 'dien-giai-phuc-hoi', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 70)
on conflict (slug) do nothing;

insert into public.animal_types (name, slug, description, sort_order) values
  ('Chó', 'cho', 'Dữ liệu demo.', 10),
  ('Mèo', 'meo', 'Dữ liệu demo.', 20),
  ('Gia súc', 'gia-suc', 'Dữ liệu demo.', 30),
  ('Gia cầm', 'gia-cam', 'Dữ liệu demo.', 40)
on conflict (slug) do nothing;

insert into public.brands (name, slug, description, sort_order) values
  ('Vet68 Demo', 'vet68-demo', 'Thương hiệu minh họa, không đại diện quan hệ phân phối.', 10),
  ('AniVita Demo', 'anivita-demo', 'Thương hiệu minh họa.', 20),
  ('BioVet Demo', 'biovet-demo', 'Thương hiệu minh họa.', 30)
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
