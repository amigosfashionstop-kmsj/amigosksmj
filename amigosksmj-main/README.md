# Amigos Fashionstop - Production Ecommerce & CMS Platform

**Brand Tagline**: *OUR PASSION, YOUR FASHION*  
**Positioning**: *DESIGN • WHOLESALE • RETAIL*  
**Flagship Boutique**: *C-04 Mayuresh Nagar CHS, Ganesh Mandir Road, Manda Titwala (East), Maharashtra 421605*  
**Direct Contacts**: 
- Samruddhi Shedage: +91 9820140138 (Store & Design)
- Juily Joshi: +91 9892880586 (Customer & Orders)
- Vaidehi Dharse: +91 9324767743 (Wholesale & B2B)
- Email: [amigosfashionstop@gmail.com](mailto:amigosfashionstop@gmail.com)
- Instagram: [@amigosfashionstop](https://www.instagram.com/amigosfashionstop/)

---

## ?? Overview
Amigos Fashionstop is a modern Indian women's ethnic wear brand that combines online direct-to-consumer ecommerce, boutique WhatsApp commerce, wholesale B2B ordering, and local store presence in Titwala, Maharashtra.

The word **"Amigos"** means *friends*. The platform is built so customers feel like they are shopping with trusted friends rather than a faceless corporation.

---

## ??? Technology Stack
- **Framework**: Next.js 15 (App Router, Server Components, SSR & Static Generation)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Indian boutique color palette (Deep Wine `#6B1F35`, Muted Rose `#B76E79`, Warm Ivory `#FAF7F2`, Subtle Gold `#C9A66B`, Charcoal `#242124`)
- **Typography**: Editorial Serif (`Playfair Display`) + Modern Geometric Sans (`Plus Jakarta Sans`)
- **Icons**: Lucide Icons
- **Payments**: Razorpay Indian Payment Gateway adapter (UPI, Cards, NetBanking, simulated test mode)
- **Shipping**: Indian pincode serviceability engine (Maharashtra priority + Pan-India coverage)
- **Commerce**: Contextual WhatsApp ordering engine & dynamic shopping bag
- **SEO & Schema**: Rich JSON-LD (Product, LocalBusiness, Breadcrumbs, FAQ)

---

## ?? Project Structure
```
amigos-fashionstop/
+-- app/
¦   +-- layout.tsx                # Root layout with fonts, JSON-LD, Navbar, Cart & Footer
¦   +-- page.tsx                  # High-fashion editorial homepage
¦   +-- globals.css               # Global styles & theme extensions
¦   +-- sitemap.ts                # Dynamic SEO sitemap
¦   +-- robots.ts                 # Search crawler rules
¦   +-- shop/
¦   ¦   +-- page.tsx              # Catalog discovery with facet filters (Fabric, Size, Price, Search)
¦   ¦   +-- [category]/page.tsx   # Category views (Kurti Sets, Long Kurtis, Short Kurtis, Clearance)
¦   +-- product/[slug]/page.tsx   # Rich PDP with gallery, size selector, pincode check, accordions
¦   +-- cart/page.tsx             # Full cart view
¦   +-- checkout/page.tsx         # Indian checkout (Address, Pincode verification, Razorpay)
¦   +-- order-success/[orderId]/  # Order confirmation, tracking details, and WhatsApp share
¦   +-- wholesale/page.tsx        # B2B wholesale landing page with lead capture form
¦   +-- visit-us/page.tsx         # Titwala flagship boutique page with Google Maps & timings
¦   +-- about/page.tsx            # "Friends to Friends" brand story
¦   +-- size-guide/page.tsx       # Ethnic wear sizing guide & measurement charts
¦   +-- journal/                  # Fashion styling blog & fabric care guides
¦   +-- policies/page.tsx         # Shipping, Returns, Privacy & Terms
¦   +-- account/page.tsx          # Customer portal (Orders history, Wishlist, Addresses)
¦   +-- admin/page.tsx            # CMS & Store Operations dashboard
¦   +-- api/                      # REST endpoints for Checkout, Wholesale, and Catalog
+-- components/
¦   +-- layout/                   # Navbar, Footer, AnnouncementBar
¦   +-- home/                     # Hero, CollectionTiles, FeaturedSection, ShopByPrice, BrandStory, etc.
¦   +-- ui/                       # Button, Badge, ProductCard, Accordion
¦   +-- product/                  # ProductGallery, ProductActions, SizeGuideModal
¦   +-- cart/                     # CartDrawer (Slide-out shopping bag)
¦   +-- common/                   # WhatsAppButton (Floating & contextual)
+-- lib/
¦   +-- data/                     # 45 genuine catalog products, categories, blogs, faqs, store info
¦   +-- services/                 # Razorpay, Shipping, WhatsApp, and SEO services
¦   +-- store/                    # Cart & Wishlist reactive state
+-- public/
¦   +-- images/
¦       +-- brand/                # Official crest logo and brand graphics
¦       +-- catalog/              # 45 genuine catalog items with multi-angle cropped photography
+-- sample_catalog_import.csv     # Sample CSV spreadsheet for bulk product import
```

---

## ?? Quickstart & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## ?? Razorpay Indian Payment Gateway Setup
In development, the application operates in **Simulated Mode** so you can test end-to-end checkout and order generation without live payment keys.

To enable live Indian payments:
1. Create an account on [Razorpay](https://razorpay.com).
2. Generate your API keys in the Razorpay Dashboard (`Settings > API Keys`).
3. Add the following to your `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

---

## ?? WhatsApp Commerce
WhatsApp buttons across the site dynamically generate pre-filled customer inquiries to **+91 9820140138** or **+91 9892880586**:
- **Product Page**: Generates message containing product SKU, title, fabric, selected size, and price.
- **Cart Drawer**: Generates an itemized order summary with total amount.
- **Wholesale Page**: Generates a business inquiry message with store name, city, and unit quantity.

---

## ????? Admin & CMS Operations Portal
Visit `/admin` to access the boutique management dashboard:
- **Revenue & Orders**: View order counts, totals, and update fulfillment status (New, Processing, Shipped, Delivered).
- **Catalog & Stock**: Live inventory editing for all 45 products, low-stock alerts, and New/Sale badge toggles.
- **Wholesale Leads**: Review B2B buyer inquiries and reply via 1-click WhatsApp.
- **CSV Import / Export**: Download entire catalog to CSV or upload spreadsheets to update products in bulk.
