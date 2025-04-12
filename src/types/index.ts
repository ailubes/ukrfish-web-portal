
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
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}
