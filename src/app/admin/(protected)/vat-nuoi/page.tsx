import { SimpleResourcePage } from "@/components/admin/simple-resource-page";
import { getAdminTaxonomy } from "@/lib/admin/queries";
export default async function AdminAnimalsPage() { const { animalTypes } = await getAdminTaxonomy(); return <SimpleResourcePage title="Vật nuôi" description="Quản lý landing page và bộ lọc theo vật nuôi." resource="animal_types" rows={animalTypes} />; }
