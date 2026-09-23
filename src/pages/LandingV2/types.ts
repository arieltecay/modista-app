import type { LandingPageData, CourseData, TestimonialItem } from '../LandingPage/types';

/** Reusa los contratos de datos de la landing v1 (misma API). */
export type { LandingPageData, CourseData, TestimonialItem };

export interface CtaContext {
  section: 'hero' | 'sticky' | 'form';
  courseId?: string;
  courseTitle?: string;
  coursePrice?: number;
}

export interface PriceInfo {
  formatted: string | null;
  raw: number | undefined;
}

export interface LandingV2Data {
  landing: LandingPageData;
  course: CourseData;
  testimonials: TestimonialItem[];
  /** Texto del CTA configurable desde el CMS de landings */
  ctaText: string;
  title: string;
  description: string | undefined;
  price: PriceInfo;
}
