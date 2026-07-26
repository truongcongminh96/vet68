import { SimpleResourcePage } from "@/components/admin/simple-resource-page";
import { getAdminTaxonomy } from "@/lib/admin/queries";
export default async function AdminBrandsPage() { const { brands } = await getAdminTaxonomy(); return <SimpleResourcePage title="Thương hiệu" description="Quản lý thương hiệu, logo và thông tin giới thiệu." resource="brands" rows={brands} />; }
