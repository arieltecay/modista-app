import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CourseContextType {
  activeCourseTitle: string | null;
  setActiveCourseTitle: (title: string | null) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCourseTitle, setActiveCourseTitle] = useState<string | null>(null);

  return (
    <CourseContext.Provider value={{ activeCourseTitle, setActiveCourseTitle }}>
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
