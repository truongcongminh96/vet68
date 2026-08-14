import { SimpleResourcePage } from "@/components/admin/simple-resource-page";
import { getAdminCompanies } from "@/lib/admin/queries";

export default async function AdminCompaniesPage() {
  const companies = await getAdminCompanies();

  return (
    <SimpleResourcePage
      title="Công ty phân phối"
      description="Quản lý công ty phân phối bắt buộc gắn với từng sản phẩm. Chỉ có thể xóa công ty chưa được sử dụng."
      resource="companies"
      rows={companies}
    />
  );
}
