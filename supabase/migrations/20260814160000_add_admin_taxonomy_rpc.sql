create or replace function public.get_admin_taxonomy()
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Staff access is required.' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'categories', coalesce((select jsonb_agg(to_jsonb(category) order by category.sort_order) from public.categories category), '[]'::jsonb),
    'animal_types', coalesce((select jsonb_agg(to_jsonb(animal) order by animal.sort_order) from public.animal_types animal), '[]'::jsonb),
    'brands', coalesce((select jsonb_agg(to_jsonb(brand) order by brand.sort_order) from public.brands brand), '[]'::jsonb),
    'companies', coalesce((select jsonb_agg(to_jsonb(company) order by company.sort_order) from public.companies company), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_admin_taxonomy() from public;
grant execute on function public.get_admin_taxonomy() to authenticated;
