export interface Course {
  price: number;
  imageUrl?: string;
  title: string;
}

export interface CourseImageProps {
  course: Course;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  crop?: 'fill' | 'limit' | 'fit';
}
