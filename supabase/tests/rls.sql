begin;
select plan(26);

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.categories'::regclass), 'categories RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.animal_types'::regclass), 'animal_types RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.brands'::regclass), 'brands RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.products'::regclass), 'products RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.product_categories'::regclass), 'product_categories RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.product_animal_types'::regclass), 'product_animal_types RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.product_images'::regclass), 'product_images RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.posts'::regclass), 'posts RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.banners'::regclass), 'banners RLS is active');
select ok((select relrowsecurity from pg_class where oid = 'public.site_settings'::regclass), 'site_settings RLS is active');

select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'products'), array['products_admin_delete','products_public_read','products_staff_insert','products_staff_update']::text[], 'products policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'categories'), array['categories_admin_delete','categories_public_read','categories_staff_insert','categories_staff_update']::text[], 'categories policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'animal_types'), array['animal_types_admin_delete','animal_types_public_read','animal_types_staff_insert','animal_types_staff_update']::text[], 'animal type policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'brands'), array['brands_admin_delete','brands_public_read','brands_staff_insert','brands_staff_update']::text[], 'brand policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'posts'), array['posts_admin_delete','posts_public_read','posts_staff_insert','posts_staff_update']::text[], 'post policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'banners'), array['banners_admin_delete','banners_public_read','banners_staff_insert','banners_staff_update']::text[], 'banner policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'site_settings'), array['site_settings_admin_delete','site_settings_admin_insert','site_settings_admin_update','site_settings_public_read']::text[], 'settings policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'public' and tablename = 'product_images'), array['product_images_public_read','product_images_staff_delete','product_images_staff_insert','product_images_staff_update']::text[], 'product image policies are complete');
select is((select array_agg(policyname order by policyname)::text[] from pg_policies where schemaname = 'storage' and tablename = 'objects'), array['storage_public_read','storage_staff_delete','storage_staff_insert','storage_staff_update']::text[], 'storage policies are complete');

select ok(exists (select 1 from pg_constraint where conrelid = 'public.products'::regclass and contype = 'u' and pg_get_constraintdef(oid) = 'UNIQUE (sku)'), 'SKU is unique');
select ok(exists (select 1 from pg_constraint where conrelid = 'public.products'::regclass and contype = 'u' and pg_get_constraintdef(oid) = 'UNIQUE (slug)'), 'product slug is unique');
select ok(to_regprocedure('public.is_staff()') is not null, 'is_staff helper exists');
select ok(to_regprocedure('public.is_admin()') is not null, 'is_admin helper exists');
select ok(has_table_privilege('anon', 'public.products', 'SELECT'), 'anon has catalogue SELECT grant');
select ok(has_table_privilege('authenticated', 'public.products', 'INSERT,UPDATE,DELETE'), 'authenticated has catalogue mutation grants');

select * from finish();
rollback;
