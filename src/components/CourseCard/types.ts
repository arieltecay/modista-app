export interface Course {
  id: string;
  price: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
  // Add other course properties if they are used or expected by the component
}

export interface CourseCardProps {
  course: Course;
}
