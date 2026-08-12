insert into public.product_animal_types (product_id, animal_type_id)
select p.id, a.id
from public.products p
join public.animal_types a on a.slug in ('gia-suc', 'gia-cam')
where p.slug in ('amoxicillin-50-demo', 'vaccine-newcastle-demo')
on conflict do nothing;

insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p
join public.categories c on c.slug = 'ho-tro-ho-hap'
where p.slug = 'amoxicillin-50-demo'
on conflict do nothing;
