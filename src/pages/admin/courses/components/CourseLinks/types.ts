export interface CourseLinkItem {
  deeplink?: string;
  videoUrl?: string;
  coursePaid?: string;
}

export interface CourseLinksProps {
  course: CourseLinkItem;
  variant?: 'mobile' | 'desktop';
}
