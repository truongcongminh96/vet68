-- Company distribution is a separate concept from product brand.
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  website_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists companies_active_sort_idx on public.companies(is_active, sort_order);
create index if not exists products_company_active_idx on public.products(company_id, is_active);

create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();

grant select on table public.companies to anon, authenticated;
grant insert, update, delete on table public.companies to authenticated;

alter table public.companies enable row level security;
create policy companies_public_read on public.companies for select to anon, authenticated using (is_active or public.is_staff());
create policy companies_staff_insert on public.companies for insert to authenticated with check (public.is_staff());
create policy companies_staff_update on public.companies for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy companies_admin_delete on public.companies for delete to authenticated using (public.is_admin());

-- Existing demo brands remain brands; create a matching distribution company for old products.
insert into public.companies (name, slug, description, sort_order)
select concat(name, ' Distribution'), concat('company-', slug), coalesce(description, 'Công ty phân phối đang chờ cập nhật.'), sort_order
from public.brands
on conflict (slug) do nothing;

update public.products p
set company_id = c.id
from public.brands b
join public.companies c on c.slug = concat('company-', b.slug)
where p.brand_id = b.id and p.company_id is null;

-- Add the concrete product groups called out in the feedback.
insert into public.categories (name, slug, kind, description, sort_order) values
  ('Thuốc tiêm', 'thuoc-tiem', 'product_type', 'Thuốc thú y dạng tiêm.', 10),
  ('Thuốc uống', 'thuoc-uong', 'product_type', 'Thuốc thú y dạng uống.', 20),
  ('Thuốc bôi ngoài da/Phun xịt', 'thuoc-boi-ngoai-da-phun-xit', 'product_type', 'Sản phẩm bôi ngoài da hoặc phun xịt.', 30),
  ('Thuốc điều trị nội/ngoại KST', 'thuoc-dieu-tri-noi-ngoai-kst', 'product_type', 'Sản phẩm điều trị ký sinh trùng nội/ngoại.', 40),
  ('Thuốc đặc trị', 'thuoc-dac-tri', 'product_type', 'Sản phẩm đặc trị theo tư vấn chuyên môn.', 50),
  ('Vaccine/Kháng thể', 'vaccine-khang-the', 'product_type', 'Vaccine và kháng thể.', 60),
  ('Môi trường', 'moi-truong', 'product_type', 'Sản phẩm xử lý môi trường chăn nuôi.', 70),
  ('Hướng thần', 'huong-than', 'product_type', 'Sản phẩm hướng thần theo quy định và tư vấn chuyên môn.', 80)
on conflict (slug) do nothing;

-- Preserve existing products while moving the two unambiguous demo groups.
update public.products p set category_id = c.id from public.categories c
where p.slug = 'amoxicillin-50-demo' and c.slug = 'thuoc-tiem';
update public.products p set category_id = c.id from public.categories c
where p.slug = 'vaccine-newcastle-demo' and c.slug = 'vaccine-khang-the';
update public.products p set category_id = c.id from public.categories c
where p.slug = 'iodine-disinfectant-demo' and c.slug = 'moi-truong';
update public.products p set category_id = c.id from public.categories c
where p.slug in ('vitamin-ade-plus-demo', 'calcium-mineral-mix-demo') and c.slug = 'thuoc-uong';
update public.products p set category_id = c.id from public.categories c
where p.slug = 'bom-tiem-thu-y-20ml-demo' and c.slug = 'thuoc-dac-tri';

update public.categories
set is_active = false
where slug in ('thuoc-thu-y', 'vaccine-sinh-pham', 'vitamin-dinh-duong', 'sat-trung-ve-sinh', 'dung-cu-thu-y');

create or replace function public.search_catalogue_product_ids(search_query text)
returns table(product_id uuid, search_rank integer)
language sql stable security invoker set search_path = public, extensions as $$
  select distinct p.id,
    case
      when lower(p.sku) = lower(search_query) then 100
      when extensions.unaccent(lower(p.name)) = extensions.unaccent(lower(search_query)) then 80
      when p.name ilike '%' || search_query || '%' then 60
      when p.sku ilike '%' || search_query || '%' then 50
      else 20
    end as search_rank
  from public.products p
  left join public.companies co on co.id = p.company_id
  left join public.brands b on b.id = p.brand_id
  left join public.categories c on c.id = p.category_id
  left join public.product_animal_types pat on pat.product_id = p.id
  left join public.animal_types a on a.id = pat.animal_type_id
  where p.is_active = true and (
    p.name ilike '%' || search_query || '%' or
    p.sku ilike '%' || search_query || '%' or
    p.active_ingredients ilike '%' || search_query || '%' or
    co.name ilike '%' || search_query || '%' or
    b.name ilike '%' || search_query || '%' or
    c.name ilike '%' || search_query || '%' or
    a.name ilike '%' || search_query || '%'
  )
  order by search_rank desc, p.id;
$$;
