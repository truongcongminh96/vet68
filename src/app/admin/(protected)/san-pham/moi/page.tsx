import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { saveProductAction } from "@/app/admin/(protected)/san-pham/actions";
import { getAdminTaxonomy } from "@/lib/admin/queries";
import type { ProductFormValues } from "@/lib/validation/product";

const defaults: ProductFormValues = {
  name: "", slug: "", sku: "", shortDescription: "", description: "", companyId: "", brandId: "", categoryId: "",
  animalTypeIds: [], treatmentCategoryIds: [],
  referencePrice: "", priceDisplayMode: "contact", priceNote: "", unit: "", dosageForm: "",
  activeIngredients: "", packaging: "", indications: "", usageInformation: "", storageInformation: "", safetyInformation: "",
  requiresConsultation: true, isFeatured: false, isNew: false, isActive: false, seoTitle: "", seoDescription: "",
};

export default async function NewProductPage() {
  const { companies, brands, categories, animalTypes } = await getAdminTaxonomy();
  return <div><h1 className="text-3xl font-extrabold">Tạo sản phẩm</h1><p className="mt-2 text-muted-foreground">Sản phẩm mới mặc định ở trạng thái chưa công khai.</p><div className="mt-6"><ProductEditorForm defaultValues={defaults} companies={companies} brands={brands} categories={categories.filter((item) => item.kind === "product_type")} treatmentCategories={categories.filter((item) => item.kind === "treatment_need")} animalTypes={animalTypes} action={saveProductAction} /></div></div>;
}
