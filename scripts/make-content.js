const fs = require('fs');
const path = require('path');

// lib/data/store-info.ts
const storeInfo = `export const STORE_INFO = {
  name: "Amigos Fashionstop",
  legalName: "Amigo's Fashion Stop",
  tagline: "Our Passion, Your Fashion",
  positioning: "Design • Wholesale • Retail",
  ethos: "The word Amigos means 'friends'. We believe shopping for ethnic wear should feel like shopping with a trusted friend, guided by care, warmth, and contemporary Indian flair.",
  address: {
    line1: "C-04 Mayuresh Nagar CHS, Ganesh Mandir Road",
    area: "Manda Titwala (East)",
    city: "Titwala",
    state: "Maharashtra",
    pincode: "421605",
    country: "India",
    alternateAddress: "D-002, Ravindra Arcade, Vajpai Nagar, Manda Titwala (E), Maharashtra 421605"
  },
  contacts: [
    { name: "Samruddhi Shedage", phone: "+919820140138", displayPhone: "+91 9820140138", role: "Store & Design Lead" },
    { name: "Juily Joshi", phone: "+919892880586", displayPhone: "+91 9892880586", role: "Customer & Orders" },
    { name: "Vaidehi Dharse", phone: "+919324767743", displayPhone: "+91 9324767743", role: "Wholesale & Inquiries" }
  ],
  primaryPhone: "+91 9820140138",
  primaryWhatsApp: "919820140138",
  secondaryWhatsApp: "919892880586",
  email: "amigosfashionstop@gmail.com",
  instagram: {
    handle: "@amigosfashionstop",
    url: "https://www.instagram.com/amigosfashionstop/"
  },
  timings: {
    weekdays: "Monday – Saturday: 9:00 AM – 9:00 PM",
    sunday: "Sunday: 9:00 AM – 5:00 PM"
  },
  announcements: [
    "FREE SHIPPING ACROSS INDIA ON PREPAID ORDERS",
    "OUR PASSION, YOUR FASHION • VISIT OUR TITWALA STORE",
    "WHOLESALE & BULK ORDERS AVAILABLE • CHAT ON WHATSAPP"
  ]
};
`;
fs.writeFileSync(path.join(__dirname, '../lib/data/store-info.ts'), storeInfo);

// lib/data/faqs.ts
const faqs = `export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'ordering' | 'shipping' | 'sizing' | 'wholesale' | 'store';
}

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'Do you offer pan-India shipping?',
    answer: 'Yes! We ship across all serviceable pincodes in India. Orders are packed with utmost care and dispatched within 24 to 48 business hours from our Titwala boutique.'
  },
  {
    id: 'faq-2',
    category: 'ordering',
    question: 'Can I order directly through WhatsApp?',
    answer: 'Absolutely! Click the \"Chat on WhatsApp\" button on any product page or in your cart. A pre-filled message with your selected item and size will be sent directly to our boutique team at +91 9820140138 or +91 9892880586.'
  },
  {
    id: 'faq-3',
    category: 'sizing',
    question: 'How do I choose the correct size for kurtis and sets?',
    answer: 'Our garments are tailored to comfortable Indian standard sizing (S: 36\", M: 38\", L: 40\", XL: 42\", 2XL: 44\", 3XL: 46\"). Check our interactive Size Guide page for exact bust, waist, and hip measurements.'
  },
  {
    id: 'faq-4',
    category: 'wholesale',
    question: 'Do you accept wholesale or bulk retail orders?',
    answer: 'Yes, we cater to boutique owners, resellers, and corporate gifting. Please visit our Wholesale page or reach out to Vaidehi at +91 9324767743 for tiered B2B pricing and catalog batches.'
  },
  {
    id: 'faq-5',
    category: 'store',
    question: 'Where is your physical store located and what are the timings?',
    answer: 'We are located at C-04 Mayuresh Nagar CHS, Ganesh Mandir Road, Titwala (East), Maharashtra 421605. We are open Monday to Saturday from 9:00 AM to 9:00 PM, and Sunday from 9:00 AM to 5:00 PM. We love meeting our customers in person!'
  },
  {
    id: 'faq-6',
    category: 'ordering',
    question: 'What payment methods do you accept?',
    answer: 'We support all major payment modes via Razorpay including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay), and NetBanking. You can also pay via direct UPI on WhatsApp.'
  }
];
`;
fs.writeFileSync(path.join(__dirname, '../lib/data/faqs.ts'), faqs);

// lib/data/blogs.ts
const blogs = `export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  relatedCategory: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-to-style-a-kurti-for-everyday-wear',
    title: 'How to Style a Kurti for Everyday Wear: From Desk to Dinner',
    excerpt: 'Simple styling secrets to transition your favorite cotton kurti from a comfortable work outfit to an effortless evening look.',
    author: 'Samruddhi Shedage',
    date: 'August 24, 2026',
    readTime: '4 min read',
    coverImage: '/images/catalog/afs-001-main.jpg',
    relatedCategory: 'long-kurtis',
    content: \`A classic Indian kurti is unmatched when it comes to versatility and breathable grace. Whether you are heading to office, stepping out for a grocery run, or meeting childhood friends for tea, here are 4 effortless ways to style your kurtis:

1. **Denim & Short Kurti Pairing**: Swap traditional bottoms with straight-cut ankle-length jeans for a chic Indo-western fusion that is college and desk ready.
2. **Layer with a Minimalist Dupatta**: Drape a lightweight chanderi or mal-cotton dupatta over a straight kurti to instantly elevate its formal charm.
3. **Statement Oxidised Jhumkas**: A pair of antique silver earrings frames your face and makes even a simple pastel kurti look thoughtfully put together.
4. **Comfort Footwear**: Pair with leather kolhapuris, juttis, or clean block heels for all-day comfort without sacrificing style.\`
  },
  {
    id: 'blog-2',
    slug: 'cotton-vs-rayon-kurtis-which-is-right-for-you',
    title: 'Cotton vs Rayon Kurtis: Which Fabric Best Suits the Indian Climate?',
    excerpt: 'Discover the differences in drape, breathability, care, and occasions between pure cotton and soft rayon ethnic wear.',
    author: 'Juily Joshi',
    date: 'August 10, 2026',
    readTime: '5 min read',
    coverImage: '/images/catalog/afs-002-main.jpg',
    relatedCategory: 'kurti-sets',
    content: \`When selecting your everyday wardrobe, fabric composition makes all the difference in comfort and silhouette.

### Pure Cotton: The Timeless All-Weather Champion
- **Breathability**: 100% natural fibers allow your skin to breathe even in peak Maharashtra humidity.
- **Structure**: Crisp fall that holds its shape beautifully for office wear and daytime gatherings.
- **Durability**: Softens with every wash while retaining thread integrity.

### Rayon: Fluid Drape and Silk-Like Softness
- **Drape**: Cascades gracefully over curves, creating a flattering, slimming contour.
- **Soft Touch**: Incredibly smooth against sensitive skin with a subtle, luxurious sheen.
- **Occasion**: Wonderful for festive evenings, breezy outings, and relaxed home celebrations.\`
  },
  {
    id: 'blog-3',
    slug: 'the-ultimate-indian-ethnic-wear-size-guide',
    title: 'The Ultimate Kurti Sizing Guide: Getting the Flawless Fit',
    excerpt: 'How to accurately measure your bust, waist, and hip to choose the ideal kurti size that flatters your silhouette with room to move.',
    author: 'Vaidehi Dharse',
    date: 'July 28, 2026',
    readTime: '3 min read',
    coverImage: '/images/catalog/afs-014-main.jpg',
    relatedCategory: 'kurti-sets',
    content: \`Finding the right fit in Indian ethnic wear is all about combining ease of movement with a tailored silhouette.

### How to Measure Accurately:
1. **Bust Measurement**: Measure around the fullest part of your chest with measuring tape held level and comfortable.
2. **Garment Ease**: A well-fitting kurti typically has 2 to 3 inches of ease over your actual body measurement for effortless sitting and movement.
3. **Shoulder Span**: Check that shoulder seams rest right at the curve of your shoulder rather than drooping down.

If you are ever unsure between two sizes, feel free to WhatsApp our team with your measurements. We will guide you to the perfect piece!\`
  }
];
`;
fs.writeFileSync(path.join(__dirname, '../lib/data/blogs.ts'), blogs);

console.log('store-info.ts, faqs.ts, blogs.ts created successfully!');
