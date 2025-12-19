import React from 'react';
import Home from './Home/index.tsx';
import Courses from './Courses/index.jsx';
import About from './About/index.jsx';
import Footer from './Footer/index.jsx';

const HomePage = () => {
  return (
    <>
      <Home />
      <Courses limit={6} />
      <About />
    </>
  );
};

export default HomePage;
