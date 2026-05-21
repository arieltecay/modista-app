import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course } from '../services/courses/types';

interface CourseContextType {
  activeCourse: Course | null;
  setActiveCourse: (course: Course | null) => void;
  activeCourseTitle: string | null; // Mantener por compatibilidad si es necesario, o derivar
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const activeCourseTitle = activeCourse?.title || null;

  return (
    <CourseContext.Provider value={{ activeCourse, setActiveCourse, activeCourseTitle }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
