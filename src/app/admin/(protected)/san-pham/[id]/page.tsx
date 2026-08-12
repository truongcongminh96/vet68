import { notFound } from "next/navigation";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { saveProductAction } from "@/app/admin/(protected)/san-pham/actions";
import { getAdminProduct, getAdminTaxonomy } from "@/lib/admin/queries";
import type { ProductFormValues } from "@/lib/validation/product";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [record, taxonomy] = await Promise.all([getAdminProduct(id), getAdminTaxonomy()]);
  if (!record) notFound();
  const product = record.product;
  const defaults: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.short_description ?? "",
    description: product.description ?? "",
    companyId: product.company_id ?? "",
    brandId: product.brand_id ?? "",
    categoryId: product.category_id ?? "",
    animalTypeIds: record.animalTypeIds,
    treatmentCategoryIds: record.treatmentCategoryIds,
    referencePrice: product.reference_price === null ? "" : Number(product.reference_price),
    priceDisplayMode: product.price_display_mode ?? "contact",
    priceNote: product.price_note ?? "",
    unit: product.unit ?? "",
    dosageForm: product.dosage_form ?? "",
    activeIngredients: product.active_ingredients ?? "",
    packaging: product.packaging ?? "",
    indications: product.indications ?? "",
    usageInformation: product.usage_information ?? "",
    storageInformation: product.storage_information ?? "",
    safetyInformation: product.safety_information ?? "",
    requiresConsultation: product.requires_consultation,
    isFeatured: product.is_featured,
    isNew: product.is_new,
    isActive: product.is_active,
    seoTitle: product.seo_title ?? "",
    seoDescription: product.seo_description ?? "",
  };
  return <div><h1 className="text-3xl font-extrabold">Chỉnh sửa sản phẩm</h1><p className="mt-2 text-muted-foreground">{product.name} | {product.sku}</p><div className="mt-6"><ProductEditorForm defaultValues={defaults} companies={taxonomy.companies} brands={taxonomy.brands} categories={taxonomy.categories.filter((item) => item.kind === "product_type")} treatmentCategories={taxonomy.categories.filter((item) => item.kind === "treatment_need")} animalTypes={taxonomy.animalTypes} action={saveProductAction} initialImages={record.images} /></div></div>;
}
