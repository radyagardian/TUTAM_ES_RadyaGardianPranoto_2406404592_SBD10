import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');

  const handleMasukPengurus = (e) => {
    e.preventDefault();
    if (password === '123') {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome, Mr. Stark!',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/pengurus');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Incorrect Password.',
      });
      setPassword(''); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1930] flex flex-col items-center justify-center font-sans text-white p-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
        Inventory Kestari
      </h1>
      <p className="text-lg md:text-xl mb-10 text-center font-light">
        Pick a Role
      </p>

      <div className="flex gap-5">
        <button 
          onClick={() => navigate('/peminjam')}
          className="px-8 py-3 text-lg cursor-pointer bg-black text-white rounded-full font-bold transition-transform duration-200 hover:scale-105"
        >
         Applicant
        </button>

        <button 
          onClick={() => setShowPasswordInput(!showPasswordInput)}
          className="px-8 py-3 text-lg cursor-pointer bg-black text-white rounded-full font-bold transition-transform duration-200 hover:scale-105"
        >
          Executive
        </button>
      </div>

      {showPasswordInput && (
        <form onSubmit={handleMasukPengurus} className="mt-8 flex gap-3">
          <input 
            type="password" 
            placeholder="Input Password (123)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-3 text-base bg-white rounded-full outline-none text-black w-64"
            required
          />
          <button 
            type="submit" 
            className="px-8 py-3 text-lg cursor-pointer bg-black text-white rounded-full font-bold transition-transform duration-200 hover:scale-105"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}