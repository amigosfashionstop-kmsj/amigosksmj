export interface PincodeCheckResult {
  serviceable: boolean;
  city: string;
  state: string;
  estimatedDays: string;
  isExpressAvailable: boolean;
  freeShippingQualified: boolean;
}

export function checkPincode(pincode: string): PincodeCheckResult {
  const clean = pincode.replace(/\D/g, '').slice(0, 6);
  if (clean.length !== 6) {
    return {
      serviceable: false,
      city: '',
      state: '',
      estimatedDays: '',
      isExpressAvailable: false,
      freeShippingQualified: false
    };
  }

  // Priority delivery for Titwala, Kalyan, Thane, Mumbai (421xxx, 400xxx, 401xxx)
  if (clean.startsWith('421') || clean.startsWith('400') || clean.startsWith('401')) {
    const isTitwala = clean === '421605';
    return {
      serviceable: true,
      city: isTitwala ? 'Titwala' : clean.startsWith('421') ? 'Kalyan / Thane Dist' : 'Mumbai Metro',
      state: 'Maharashtra',
      estimatedDays: isTitwala ? 'Same day / Next day' : '1 - 2 Business Days',
      isExpressAvailable: true,
      freeShippingQualified: true
    };
  }

  // Maharashtra general
  if (clean.startsWith('41') || clean.startsWith('42') || clean.startsWith('43') || clean.startsWith('44')) {
    return {
      serviceable: true,
      city: 'Maharashtra Region',
      state: 'Maharashtra',
      estimatedDays: '2 - 3 Business Days',
      isExpressAvailable: true,
      freeShippingQualified: true
    };
  }

  // Pan-India coverage
  return {
    serviceable: true,
    city: 'All India Serviceable',
    state: 'Pan-India',
    estimatedDays: '3 - 5 Business Days',
    isExpressAvailable: false,
    freeShippingQualified: true
  };
}
