export interface Course {
  price: string;
  imageUrl: string;
  title: string;
}

export interface CourseImageProps {
  course: Course;
  className?: string;
}
