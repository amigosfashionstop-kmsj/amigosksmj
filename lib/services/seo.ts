import { STORE_INFO } from '../data/store-info';
import { Product } from '../data/products';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: STORE_INFO.legalName,
    alternateName: STORE_INFO.name,
    description: STORE_INFO.ethos,
    url: 'https://amigosfashionstop.com',
    telephone: STORE_INFO.primaryPhone,
    email: STORE_INFO.email,
    priceRange: '₹₹',
    image: 'https://amigosfashionstop.com/images/brand/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE_INFO.address.line1,
      addressLocality: STORE_INFO.address.city,
      addressRegion: STORE_INFO.address.state,
      postalCode: STORE_INFO.address.pincode,
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.3006,
      longitude: 73.2089
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '17:00'
      }
    ],
    sameAs: [
      STORE_INFO.instagram.url,
      'https://sites.google.com/view/amigos-fashionstop'
    ]
  };
}

export function getProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: ['https://amigosfashionstop.com' + product.images[0]],
    description: product.description,
    sku: product.sku,
    mpn: product.code,
    brand: {
      '@type': 'Brand',
      name: 'Amigos Fashionstop'
    },
    offers: {
      '@type': 'Offer',
      url: `https://amigosfashionstop.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.isClearance ? product.salePrice : product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Amigos Fashionstop'
      }
    }
  };
}
