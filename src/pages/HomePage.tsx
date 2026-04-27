import React from 'react';
import Home from './Home/index.tsx';
import Courses from './Courses/index.tsx';
import About from './About/index.tsx';
import FaqSection from '../components/FaqSection/FaqSection.tsx';

const HomePage: React.FC = () => {
  return (
    <>
      <Home />
      <Courses limit={6} />
      <FaqSection />
      <About />
    </>
  );
};

export default HomePage;
