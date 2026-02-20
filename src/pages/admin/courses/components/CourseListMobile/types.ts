export interface CourseMobileItem {
  _id?: string;
  id?: string;
  uuid?: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  image?: string;
  category?: string;
  categoria?: string;
  price?: number;
  isPresencial?: boolean;
  isWorkshop?: boolean;
  createdAt?: string | Date;
  deeplink?: string;
  videoUrl?: string;
  coursePaid?: string;
}

export interface CourseListMobileProps {
  courses: CourseMobileItem[];
  loading: boolean;
  handleEdit: (courseId: string) => void;
  handleDelete: (courseId: string) => void;
}
