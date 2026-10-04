export interface FAQItem {
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
    answer: 'Absolutely! Click the "Chat on WhatsApp" button on any product page or in your cart. A pre-filled message with your selected item and size will be sent directly to our boutique team at +91 9820140138 or +91 9892880586.'
  },
  {
    id: 'faq-3',
    category: 'sizing',
    question: 'How do I choose the correct size for kurtis and sets?',
    answer: 'Our garments are tailored to comfortable Indian standard sizing (S: 36", M: 38", L: 40", XL: 42", 2XL: 44", 3XL: 46"). Check our interactive Size Guide page for exact bust, waist, and hip measurements.'
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
