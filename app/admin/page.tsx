import { AdminPortal } from '@/components/admin/AdminPortal';

export const metadata = {
  title: "Admin Portal | Amigos Fashionstop",
  description: "CMS & Store Operations for Amigos Fashionstop"
};

export default function AdminPage() {
  return <AdminPortal initialTab="overview" />;
}
