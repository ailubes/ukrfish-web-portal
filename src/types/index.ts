
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  publishDate: Date;
  category: string;
  author: string;
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  logo: string;
  description: string;
  membershipType: 'Free' | 'Standard' | 'Premium';
  joinDate: Date;
  website?: string;
  email?: string;
  phone?: string;
  username?: string;
  productionAmount?: number;
  productionType?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface MembershipPayment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: Date;
  payment_type: string;
  payment_status: 'paid' | 'pending';
  notes?: string;
  created_at: Date;
}
