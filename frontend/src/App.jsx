import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './landingPage/page';
import PeminjamPage from './peminjaman/page';
import PengurusPage from './pengurus/page'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/peminjam" element={<PeminjamPage />} />
        <Route path="/pengurus" element={<PengurusPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;