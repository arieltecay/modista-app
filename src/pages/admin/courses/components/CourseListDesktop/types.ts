import { SortConfig } from '../../pages/CourseListPage/types';

export interface CourseDesktopItem {
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
  status?: string;
  estado?: string;
  createdAt?: string | Date;
  deeplink?: string;
  videoUrl?: string;
  coursePaid?: string;
}

export interface CourseListDesktopProps {
  courses: CourseDesktopItem[];
  loading: boolean;
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  handleEdit: (courseId: string) => void;
  handleDelete: (courseId: string) => void;
}
