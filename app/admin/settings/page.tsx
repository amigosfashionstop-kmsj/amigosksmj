import { AdminPortal } from '@/components/admin/AdminPortal';

export const metadata = {
  title: "Admin Settings | Amigos Fashionstop",
  description: "Portal & Store Settings for Amigos Fashionstop"
};

export default function AdminSettingsPage() {
  return <AdminPortal initialTab="settings" />;
}
