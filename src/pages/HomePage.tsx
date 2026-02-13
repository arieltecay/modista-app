import React from 'react';
import Home from './Home/index.tsx';
import Courses from './Courses/index.tsx';
import About from './About/index.tsx';

const HomePage: React.FC = () => {
  return (
    <>
      <Home />
      <Courses limit={6} />
      <About />
    </>
  );
};

export default HomePage;
