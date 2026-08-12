alter table public.products
add column if not exists storage_information text;

comment on column public.products.storage_information is
  'Verified product storage instructions. Leave null until the business confirms the label or manufacturer guidance.';
