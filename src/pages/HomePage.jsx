import React from 'react';
import Hero from './Hero/index.jsx';
import Courses from './Courses/index.jsx';
import About from './About/index.jsx';
import Footer from './Footer/index.jsx';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Courses />
      <About />
      <Footer />
    </>
  );
};

export default HomePage;
