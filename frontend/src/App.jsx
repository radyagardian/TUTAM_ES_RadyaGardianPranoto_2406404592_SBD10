import { HashRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './landingPage/page';
import PeminjamPage from './peminjaman/page';
import PengurusPage from './pengurus/page'; 

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/peminjam" element={<PeminjamPage />} />
        <Route path="/pengurus" element={<PengurusPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;