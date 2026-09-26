export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
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
    content: `A classic Indian kurti is unmatched when it comes to versatility and breathable grace. Whether you are heading to office, stepping out for a grocery run, or meeting childhood friends for tea, here are 4 effortless ways to style your kurtis:

1. **Denim & Short Kurti Pairing**: Swap traditional bottoms with straight-cut ankle-length jeans for a chic Indo-western fusion that is college and desk ready.
2. **Layer with a Minimalist Dupatta**: Drape a lightweight chanderi or mal-cotton dupatta over a straight kurti to instantly elevate its formal charm.
3. **Statement Oxidised Jhumkas**: A pair of antique silver earrings frames your face and makes even a simple pastel kurti look thoughtfully put together.
4. **Comfort Footwear**: Pair with leather kolhapuris, juttis, or clean block heels for all-day comfort without sacrificing style.`
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
    content: `When selecting your everyday wardrobe, fabric composition makes all the difference in comfort and silhouette.

### Pure Cotton: The Timeless All-Weather Champion
- **Breathability**: 100% natural fibers allow your skin to breathe even in peak Maharashtra humidity.
- **Structure**: Crisp fall that holds its shape beautifully for office wear and daytime gatherings.
- **Durability**: Softens with every wash while retaining thread integrity.

### Rayon: Fluid Drape and Silk-Like Softness
- **Drape**: Cascades gracefully over curves, creating a flattering, slimming contour.
- **Soft Touch**: Incredibly smooth against sensitive skin with a subtle, luxurious sheen.
- **Occasion**: Wonderful for festive evenings, breezy outings, and relaxed home celebrations.`
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
    content: `Finding the right fit in Indian ethnic wear is all about combining ease of movement with a tailored silhouette.

### How to Measure Accurately:
1. **Bust Measurement**: Measure around the fullest part of your chest with measuring tape held level and comfortable.
2. **Garment Ease**: A well-fitting kurti typically has 2 to 3 inches of ease over your actual body measurement for effortless sitting and movement.
3. **Shoulder Span**: Check that shoulder seams rest right at the curve of your shoulder rather than drooping down.

If you are ever unsure between two sizes, feel free to WhatsApp our team with your measurements. We will guide you to the perfect piece!`
  }
];
