insert into public.categories (name, slug, kind, description, sort_order) values
  ('Thuốc tiêm', 'thuoc-tiem', 'product_type', 'Thuốc thú y dạng tiêm.', 10),
  ('Thuốc uống', 'thuoc-uong', 'product_type', 'Thuốc thú y dạng uống.', 20),
  ('Thuốc bôi ngoài da/Phun xịt', 'thuoc-boi-ngoai-da-phun-xit', 'product_type', 'Sản phẩm bôi ngoài da hoặc phun xịt.', 30),
  ('Thuốc điều trị nội/ngoại KST', 'thuoc-dieu-tri-noi-ngoai-kst', 'product_type', 'Sản phẩm điều trị ký sinh trùng nội/ngoại.', 40),
  ('Thuốc đặc trị', 'thuoc-dac-tri', 'product_type', 'Sản phẩm đặc trị theo tư vấn chuyên môn.', 50),
  ('Vaccine/Kháng thể', 'vaccine-khang-the', 'product_type', 'Vaccine và kháng thể.', 60),
  ('Môi trường', 'moi-truong', 'product_type', 'Sản phẩm xử lý môi trường chăn nuôi.', 70),
  ('Hướng thần', 'huong-than', 'product_type', 'Sản phẩm hướng thần theo quy định và tư vấn chuyên môn.', 80),
  ('Kháng sinh', 'khang-sinh', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 110),
  ('Vitamin và khoáng', 'vitamin-khoang-chat', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 120),
  ('Hỗ trợ tiêu hóa', 'ho-tro-tieu-hoa', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 130),
  ('Hỗ trợ hô hấp', 'ho-tro-ho-hap', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 140),
  ('Sát trùng', 'sat-trung', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 150),
  ('Vaccine', 'vaccine', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 160),
  ('Kiểm soát ký sinh trùng', 'kiem-soat-ky-sinh-trung', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 170),
  ('Điện giải và phục hồi', 'dien-giai-phuc-hoi', 'treatment_need', 'Dữ liệu taxonomy demo, không phải chỉ định.', 180)
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

insert into public.companies (name, slug, description, sort_order) values
  ('Vet68 Distribution Demo', 'vet68-distribution-demo', 'Công ty phân phối minh họa.', 10),
  ('AniVita Distribution Demo', 'anivita-distribution-demo', 'Công ty phân phối minh họa.', 20),
  ('BioVet Distribution Demo', 'biovet-distribution-demo', 'Công ty phân phối minh họa.', 30),
  ('FarmCare Distribution Demo', 'farmcare-distribution-demo', 'Công ty phân phối minh họa.', 40)
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Amoxicillin 50% Demo', 'amoxicillin-50-demo', 'VET68-001',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, 125000, 'fixed', 'Giá demo.', 'Gói', 'Bột',
  'Thông tin minh họa: Amoxicillin 50%.', 'Gói 100 g',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Không có liều dùng trong dữ liệu demo.',
  'Đọc nhãn và tham khảo người có chuyên môn.', true, true, false, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'vet68-distribution-demo' and b.slug = 'vet68-demo' and c.slug = 'thuoc-uong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Vaccine Newcastle Demo', 'vaccine-newcastle-demo', 'VET68-003',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, null, 'contact', 'Liên hệ báo giá.', 'Lọ', 'Sinh phẩm',
  'Thông tin đang chờ xác minh.', 'Theo nhà sản xuất',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Không có lịch vaccine trong dữ liệu demo.',
  'Sử dụng theo hướng dẫn chuyên môn đã xác minh.', true, true, true, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'biovet-distribution-demo' and b.slug = 'biovet-demo' and c.slug = 'vaccine-khang-the'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Vitamin ADE Plus Demo', 'vitamin-ade-plus-demo', 'VET68-002',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, 98000, 'approximate', 'Giá khoảng demo.', 'Chai', 'Dung dịch',
  'Thông tin thành phần đang chờ xác minh.', 'Chai 100 ml',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Liên hệ Vet68 để kiểm tra đúng quy cách.',
  'Đọc nhãn và tham khảo người có chuyên môn.', false, true, true, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'anivita-distribution-demo' and b.slug = 'anivita-demo' and c.slug = 'thuoc-uong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Iodine Disinfectant Demo', 'iodine-disinfectant-demo', 'VET68-004',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, 165000, 'fixed', 'Giá demo.', 'Chai', 'Dung dịch sát trùng',
  'Thông tin nồng độ đang chờ xác minh.', 'Chai 1 lít',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Tỷ lệ pha phải lấy từ nhãn sản phẩm.',
  'Không trộn hóa chất khi chưa có hướng dẫn phù hợp.', false, true, true, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'farmcare-distribution-demo' and b.slug = 'farmcare-demo' and c.slug = 'moi-truong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Calcium Mineral Mix Demo', 'calcium-mineral-mix-demo', 'VET68-005',
  'Dữ liệu sản phẩm minh họa.', 'Nội dung đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, 210000, 'approximate', 'Giá khoảng demo.', 'Túi', 'Bột trộn',
  'Danh sách khoáng chất đang chờ xác minh.', 'Túi 1 kg',
  'Không sử dụng dữ liệu demo làm chỉ định.', 'Khẩu phần phải lấy từ nguồn chuyên môn.',
  'Không thay đổi khẩu phần chỉ dựa trên nội dung demo.', false, false, true, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'anivita-distribution-demo' and b.slug = 'anivita-demo' and c.slug = 'thuoc-uong'
on conflict (slug) do nothing;

insert into public.products (
  name, slug, sku, short_description, description, company_id, brand_id, category_id,
  reference_price, price_display_mode, price_note, unit, dosage_form,
  active_ingredients, packaging, indications, usage_information, safety_information,
  requires_consultation, is_featured, is_new, is_active, published_at
)
select
  'Bơm tiêm thú y 20 ml Demo', 'bom-tiem-thu-y-20ml-demo', 'VET68-006',
  'Dữ liệu dụng cụ minh họa.', 'Thông số kỹ thuật đang chờ Vet Medicine 68 xác minh.',
  co.id, b.id, c.id, 45000, 'fixed', 'Giá demo.', 'Cái', 'Dụng cụ',
  'Không áp dụng.', '1 cái',
  'Dụng cụ minh họa.', 'Sử dụng theo hướng dẫn của nhà sản xuất.',
  'Bảo đảm vệ sinh và xử lý dụng cụ đúng quy trình.', false, false, false, true, now()
from public.companies co cross join public.brands b cross join public.categories c
where co.slug = 'farmcare-distribution-demo' and b.slug = 'farmcare-demo' and c.slug = 'thuoc-dac-tri'
on conflict (slug) do nothing;

insert into public.product_animal_types (product_id, animal_type_id)
select p.id, a.id
from public.products p
join public.animal_types a on a.slug in ('cho', 'meo')
where p.slug in ('amoxicillin-50-demo', 'vitamin-ade-plus-demo')
on conflict do nothing;

insert into public.product_animal_types (product_id, animal_type_id)
select p.id, a.id
from public.products p
join public.animal_types a on a.slug in ('gia-suc', 'gia-cam')
where p.slug in ('vaccine-newcastle-demo', 'iodine-disinfectant-demo', 'calcium-mineral-mix-demo', 'bom-tiem-thu-y-20ml-demo')
on conflict do nothing;
