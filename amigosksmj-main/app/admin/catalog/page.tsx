import { AdminPortal } from '@/components/admin/AdminPortal';

export const metadata = {
  title: "Admin Catalog | Amigos Fashionstop",
  description: "Catalog Management & Inventory Controls for Amigos Fashionstop"
};

export default function AdminCatalogPage() {
  return <AdminPortal initialTab="products" />;
}
