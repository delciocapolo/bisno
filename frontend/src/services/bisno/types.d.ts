export interface IBisno {
  customerName: string;
  customerMobile: string;
  customerMobileHasWhatsapp: boolean;
  serviceId: string;
  zoneId: string;
  description: string;
}

export interface IBisnoList {
  id: string;
  status: string;
  createdAt: string;
  zone: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
}
