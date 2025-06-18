import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import CasosPage from './pages/cases/CasosPage';
import CrearCasoPage from './pages/cases/CrearCasoPage';
import ReportesPage from './pages/reports/ReportesPage';
import RegisterPage from './pages/auth/RegisterPage';
import FiscaliasPage from './pages/auth/FiscaliasPage';
import CrearFiscaliaPage from './pages/auth/CrearFiscaliaPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/casos" element={<CasosPage />} />
        <Route path="/casos/crear" element={<CrearCasoPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/fiscalias" element={<FiscaliasPage />} />
        <Route path="/fiscalias/crear" element={<CrearFiscaliaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
