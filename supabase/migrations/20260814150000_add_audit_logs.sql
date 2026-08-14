create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null check (entity_type in ('profiles', 'products', 'product_images', 'posts', 'banners', 'categories', 'animal_types', 'brands', 'companies')),
  entity_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  changed_fields text[] not null default '{}',
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_idx on public.audit_logs(created_at desc);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);

alter table public.audit_logs enable row level security;
grant select on table public.audit_logs to authenticated;
create policy audit_logs_staff_read on public.audit_logs for select to authenticated using (public.is_staff());

create or replace function public.capture_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_data jsonb;
  new_data jsonb;
  record_id uuid;
  fields text[];
begin
  if tg_op = 'INSERT' then
    old_data := null;
    new_data := to_jsonb(new);
    record_id := new.id;
    select coalesce(array_agg(key order by key), '{}') into fields
    from jsonb_object_keys(new_data) as field_names(key)
    where key not in ('created_at', 'updated_at');
  elsif tg_op = 'UPDATE' then
    old_data := to_jsonb(old);
    new_data := to_jsonb(new);
    record_id := new.id;
    select coalesce(array_agg(key order by key), '{}') into fields
    from (
      select key from jsonb_object_keys(old_data) as old_fields(key)
      union
      select key from jsonb_object_keys(new_data) as new_fields(key)
    ) keys
    where old_data -> key is distinct from new_data -> key
      and key <> 'updated_at';
    if cardinality(fields) = 0 then return new; end if;
  else
    old_data := to_jsonb(old);
    new_data := null;
    record_id := old.id;
    select coalesce(array_agg(key order by key), '{}') into fields
    from jsonb_object_keys(old_data) as field_names(key)
    where key not in ('created_at', 'updated_at');
  end if;

  insert into public.audit_logs (actor_id, entity_type, entity_id, action, changed_fields, before_data, after_data)
  values (auth.uid(), tg_table_name, record_id, lower(tg_op), fields, old_data, new_data);

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger products_capture_audit after insert or update or delete on public.products for each row execute function public.capture_audit_log();
create trigger profiles_capture_audit after update on public.profiles for each row execute function public.capture_audit_log();
create trigger product_images_capture_audit after insert or update or delete on public.product_images for each row execute function public.capture_audit_log();
create trigger posts_capture_audit after insert or update or delete on public.posts for each row execute function public.capture_audit_log();
create trigger banners_capture_audit after insert or update or delete on public.banners for each row execute function public.capture_audit_log();
create trigger categories_capture_audit after insert or update or delete on public.categories for each row execute function public.capture_audit_log();
create trigger animal_types_capture_audit after insert or update or delete on public.animal_types for each row execute function public.capture_audit_log();
create trigger brands_capture_audit after insert or update or delete on public.brands for each row execute function public.capture_audit_log();
create trigger companies_capture_audit after insert or update or delete on public.companies for each row execute function public.capture_audit_log();
