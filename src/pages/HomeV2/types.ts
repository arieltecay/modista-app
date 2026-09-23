import type { Course } from '../../services/courses/types';

export interface HomeV2Course extends Course {
  isTopSeller?: boolean;
}

export interface CourseCardV2Props {
  course: HomeV2Course;
}
