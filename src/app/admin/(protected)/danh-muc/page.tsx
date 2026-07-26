import { SimpleResourcePage } from "@/components/admin/simple-resource-page";
import { getAdminTaxonomy } from "@/lib/admin/queries";
export default async function AdminCategoriesPage() { const { categories } = await getAdminTaxonomy(); return <SimpleResourcePage title="Danh mục" description="Quản lý nhóm sản phẩm và nhu cầu sử dụng." resource="categories" rows={categories} categoryKinds />; }
