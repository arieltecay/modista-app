// ============================================
// LOCAL TYPES (Project Architecture Standards)
// ============================================

export interface LandingPageData {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  courseId: string;
  status: 'active' | 'inactive';
  customTitle?: string;
  customDescription?: string;
  buttonText?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseData {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  shortDescription?: string;
  imageUrl?: string;
  category?: string;
  status?: string;
}

export interface BenefitItem {
  emoji: string;
  title: string;
  desc: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}
