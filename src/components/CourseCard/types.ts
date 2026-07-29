export interface Course {
  id: string;
  price: number;
  imageUrl?: string;
  title: string;
  shortDescription?: string;
}

export interface CourseCardProps {
  course: Course;
}
