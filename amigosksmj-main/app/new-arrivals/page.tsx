import { redirect } from 'next/navigation';

export const metadata = {
  title: "New Arrivals | Amigos Fashionstop",
  description: "Explore the latest ethnic wear arrivals, designer kurti sets, and fresh festive fashion at Amigos Fashionstop."
};

export default function NewArrivalsPage() {
  redirect('/shop?filter=new-arrivals');
}
