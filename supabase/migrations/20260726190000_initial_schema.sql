create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

create type public.staff_role as enum ('staff', 'admin');
create type public.category_kind as enum ('product_type', 'treatment_need');
create type public.price_display_mode as enum ('fixed', 'approximate', 'contact');
create type public.post_status as enum ('draft', 'published');
create type public.banner_placement as enum ('home_hero', 'home_promotion', 'promotions_page');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.staff_role not null default 'staff',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  kind public.category_kind not null default 'product_type',
  description text,
  image_path text,
  image_alt text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is null or parent_id <> id)
);

create table public.animal_types (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  image_path text,
  image_alt text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  logo_path text,
  logo_alt text,
  website_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 220),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text not null unique check (char_length(sku) between 2 and 80),
  short_description text,
  description text,
  brand_id uuid references public.brands(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  reference_price numeric(14,2),
  price_display_mode public.price_display_mode,
  price_note text,
  unit text,
  dosage_form text,
  active_ingredients text,
  packaging text,
  indications text,
  usage_information text,
  safety_information text,
  requires_consultation boolean not null default false,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (reference_price is null or reference_price > 0),
  check (
    not is_active or (
      price_display_mode is not null and
      (
        (price_display_mode in ('fixed', 'approximate') and reference_price is not null and reference_price > 0) or
        (price_display_mode = 'contact' and reference_price is null)
      )
    )
  )
);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, category_id)
);

create table public.product_animal_types (
  product_id uuid not null references public.products(id) on delete cascade,
  animal_type_id uuid not null references public.animal_types(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, animal_type_id)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null check (char_length(alt_text) between 3 and 240),
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index product_images_one_primary_idx on public.product_images(product_id) where is_primary;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 3 and 220),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text,
  content_markdown text not null default '',
  cover_path text,
  cover_alt text,
  status public.post_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status = 'draft' or published_at is not null)
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  placement public.banner_placement not null,
  desktop_image_path text not null,
  mobile_image_path text,
  image_alt text not null,
  link_url text,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger animal_types_set_updated_at before update on public.animal_types for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts for each row execute function public.set_updated_at();
create trigger banners_set_updated_at before update on public.banners for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'staff', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create or replace function public.current_staff_role()
returns public.staff_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_staff_role() in ('staff', 'admin'), false);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_staff_role() = 'admin', false);
$$;

revoke all on function public.current_staff_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_staff() to anon;
grant execute on function public.is_admin() to authenticated;

create index categories_parent_idx on public.categories(parent_id);
create index categories_active_sort_idx on public.categories(is_active, sort_order);
create index animal_types_active_sort_idx on public.animal_types(is_active, sort_order);
create index brands_active_sort_idx on public.brands(is_active, sort_order);
create index products_active_updated_idx on public.products(is_active, updated_at desc);
create index products_category_active_idx on public.products(category_id, is_active);
create index products_brand_active_idx on public.products(brand_id, is_active);
create index products_price_idx on public.products(reference_price) where is_active and reference_price is not null;
create index products_name_trgm_idx on public.products using gin (name extensions.gin_trgm_ops);
create index products_sku_trgm_idx on public.products using gin (sku extensions.gin_trgm_ops);
create index products_active_ingredients_trgm_idx on public.products using gin (active_ingredients extensions.gin_trgm_ops);
create index product_animal_types_animal_idx on public.product_animal_types(animal_type_id, product_id);
create index product_categories_category_idx on public.product_categories(category_id, product_id);
create index posts_published_idx on public.posts(published_at desc) where status = 'published';
create index banners_active_schedule_idx on public.banners(placement, starts_at, ends_at) where is_active;

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
  left join public.brands b on b.id = p.brand_id
  left join public.categories c on c.id = p.category_id
  left join public.product_animal_types pat on pat.product_id = p.id
  left join public.animal_types a on a.id = pat.animal_type_id
  where p.is_active = true and (
    p.name ilike '%' || search_query || '%' or
    p.sku ilike '%' || search_query || '%' or
    p.active_ingredients ilike '%' || search_query || '%' or
    b.name ilike '%' || search_query || '%' or
    c.name ilike '%' || search_query || '%' or
    a.name ilike '%' || search_query || '%'
  )
  order by search_rank desc, p.id;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.animal_types enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_animal_types enable row level security;
alter table public.product_images enable row level security;
alter table public.posts enable row level security;
alter table public.banners enable row level security;
alter table public.site_settings enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table
  public.categories,
  public.animal_types,
  public.brands,
  public.products,
  public.product_categories,
  public.product_animal_types,
  public.product_images,
  public.posts,
  public.banners,
  public.site_settings
to anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert, update on table
  public.categories,
  public.animal_types,
  public.brands,
  public.products,
  public.posts,
  public.banners
to authenticated;
grant insert, update, delete on table
  public.product_categories,
  public.product_animal_types,
  public.product_images
to authenticated;
grant insert, update, delete on table public.site_settings to authenticated;
grant update on table public.profiles to authenticated;
grant delete on table
  public.categories,
  public.animal_types,
  public.brands,
  public.products,
  public.posts,
  public.banners
to authenticated;

create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_admin_select on public.profiles for select to authenticated using (public.is_admin());
create policy profiles_admin_update on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy categories_public_read on public.categories for select to anon, authenticated using (is_active or public.is_staff());
create policy categories_staff_insert on public.categories for insert to authenticated with check (public.is_staff());
create policy categories_staff_update on public.categories for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy categories_admin_delete on public.categories for delete to authenticated using (public.is_admin());

create policy animal_types_public_read on public.animal_types for select to anon, authenticated using (is_active or public.is_staff());
create policy animal_types_staff_insert on public.animal_types for insert to authenticated with check (public.is_staff());
create policy animal_types_staff_update on public.animal_types for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy animal_types_admin_delete on public.animal_types for delete to authenticated using (public.is_admin());

create policy brands_public_read on public.brands for select to anon, authenticated using (is_active or public.is_staff());
create policy brands_staff_insert on public.brands for insert to authenticated with check (public.is_staff());
create policy brands_staff_update on public.brands for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy brands_admin_delete on public.brands for delete to authenticated using (public.is_admin());

create policy products_public_read on public.products for select to anon, authenticated using (is_active or public.is_staff());
create policy products_staff_insert on public.products for insert to authenticated with check (public.is_staff());
create policy products_staff_update on public.products for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy products_admin_delete on public.products for delete to authenticated using (public.is_admin());

create policy product_categories_public_read on public.product_categories for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.is_active or public.is_staff())));
create policy product_categories_staff_insert on public.product_categories for insert to authenticated with check (public.is_staff());
create policy product_categories_staff_update on public.product_categories for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy product_categories_staff_delete on public.product_categories for delete to authenticated using (public.is_staff());

create policy product_animal_types_public_read on public.product_animal_types for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.is_active or public.is_staff())));
create policy product_animal_types_staff_insert on public.product_animal_types for insert to authenticated with check (public.is_staff());
create policy product_animal_types_staff_update on public.product_animal_types for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy product_animal_types_staff_delete on public.product_animal_types for delete to authenticated using (public.is_staff());

create policy product_images_public_read on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.is_active or public.is_staff())));
create policy product_images_staff_insert on public.product_images for insert to authenticated with check (public.is_staff());
create policy product_images_staff_update on public.product_images for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy product_images_staff_delete on public.product_images for delete to authenticated using (public.is_staff());

create policy posts_public_read on public.posts for select to anon, authenticated using ((status = 'published' and published_at <= now()) or public.is_staff());
create policy posts_staff_insert on public.posts for insert to authenticated with check (public.is_staff());
create policy posts_staff_update on public.posts for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy posts_admin_delete on public.posts for delete to authenticated using (public.is_admin());

create policy banners_public_read on public.banners for select to anon, authenticated using ((is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())) or public.is_staff());
create policy banners_staff_insert on public.banners for insert to authenticated with check (public.is_staff());
create policy banners_staff_update on public.banners for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy banners_admin_delete on public.banners for delete to authenticated using (public.is_admin());

create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (is_public or public.is_staff());
create policy site_settings_admin_insert on public.site_settings for insert to authenticated with check (public.is_admin());
create policy site_settings_admin_update on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy site_settings_admin_delete on public.site_settings for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('product-images', 'product-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif']),
  ('category-images', 'category-images', true, 6291456, array['image/jpeg','image/png','image/webp','image/avif']),
  ('animal-images', 'animal-images', true, 6291456, array['image/jpeg','image/png','image/webp','image/avif']),
  ('brand-logos', 'brand-logos', true, 4194304, array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('banners', 'banners', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('article-covers', 'article-covers', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy storage_public_read on storage.objects for select to anon, authenticated using (bucket_id in ('product-images','category-images','animal-images','brand-logos','banners','article-covers'));
create policy storage_staff_insert on storage.objects for insert to authenticated with check (bucket_id in ('product-images','category-images','animal-images','brand-logos','banners','article-covers') and public.is_staff());
create policy storage_staff_update on storage.objects for update to authenticated using (bucket_id in ('product-images','category-images','animal-images','brand-logos','banners','article-covers') and public.is_staff()) with check (bucket_id in ('product-images','category-images','animal-images','brand-logos','banners','article-covers') and public.is_staff());
create policy storage_staff_delete on storage.objects for delete to authenticated using (bucket_id in ('product-images','category-images','animal-images','brand-logos','banners','article-covers') and public.is_staff());

insert into public.site_settings (key, value, is_public) values
  ('contact', '{"phone":"0900000068","phone_display":"0900 000 068","zalo_url":"https://zalo.me/0900000068","email":"lienhe@vetmedicine68.vn","address":"Địa chỉ demo, cần cập nhật"}'::jsonb, true),
  ('price_disclaimer', '{"text":"Giá hiển thị chỉ mang tính tham khảo và có thể thay đổi."}'::jsonb, true),
  ('veterinary_notice', '{"text":"Thông tin website không thay thế tư vấn của bác sĩ thú y hoặc hướng dẫn từ nhà sản xuất."}'::jsonb, true)
on conflict (key) do nothing;
