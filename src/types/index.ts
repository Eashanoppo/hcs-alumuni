export type Batch = string;

export interface Registrant {
  id: string;
  full_name_en: string;
  full_name_bn: string;
  father_name: string;
  mother_name: string;
  dob: string;
  present_address: string;
  permanent_address: string;
  photo_url?: string;
  occupation: string;
  alumni_number?: string;
  blood_group?: string;
  blood_donation_interest?: boolean;
  
  // Academic (Revised)
  admission_year: string;
  admission_class: string;
  leaving_year: string;
  leaving_class: string;
  certificate: 'PESC' | 'JSC' | 'SSC';
  ssc_batch?: string;
  school_photo_url?: string;
  
  last_class?: string; // Kept for legacy if needed, or can remove
  batch: Batch;
  house?: string;
  certificate_url?: string; // This is the SSC transcript/cert from Step 5
  
  // Contact
  mobile: string;
  email: string;
  whatsapp?: string;
  
  // Participation
  attending: string;
  volunteer_status?: boolean;
  spouse_attending?: boolean;
  children_count?: number;
  guests_count?: number;
  tshirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  facebook_url?: string;
  instagram_url?: string;
  workplace?: string;
  current_institution?: string;
  
  // Status
  registration_status: 'PENDING' | 'PAID' | 'APPROVED' | 'REJECTED';
  payment_status: 'UNPAID' | 'VERIFYING' | 'PAID';
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  registrant_id: string;
  amount: number;
  method: 'BKASH' | 'NAGAD' | 'CASH';
  transaction_id: string;
  sender_number: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  created_at: string;
}
