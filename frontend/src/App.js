import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CasosPage from './pages/CasosPage';
import CrearCasoPage from './pages/CrearCasoPage';
import ReportesPage from './pages/ReportesPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/casos" element={<CasosPage />} />
        <Route path="/casos/crear" element={<CrearCasoPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
