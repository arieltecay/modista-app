
import Navbar from './components/Navbar/index.jsx';
import HomePage from './pages/HomePage';
import About from './pages/About/index.jsx';
import Courses from './pages/Courses/index.jsx';
import Footer from './pages/Footer/index.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/sobre-mi" element={<About />} />
          <Route path="/contacto" element={<Footer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
