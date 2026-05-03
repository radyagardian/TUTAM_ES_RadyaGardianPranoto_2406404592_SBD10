import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function PeminjamPage() {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [barangDipinjam, setBarangDipinjam] = useState([]);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/barang');
        const data = await response.json();
        setDaftarBarang(data);
      } catch (error) {
        console.error('Gagal mengambil data barang:', error);
      }
    };
    fetchBarang();
  }, []);

  const bukaModal = (barang) => {
    setSelectedBarang(barang);
    setIsModalOpen(true);
  };

  const tutupModal = () => {
    setIsModalOpen(false);
    setNamaPeminjam('');
    setSelectedBarang(null);
  };

  const handlePinjam = async (e) => {
    e.preventDefault();
    
    try {
      const hariIni = new Date().toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/peminjaman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaPeminjam: namaPeminjam,
          namaBarang: selectedBarang.nama,
          tanggal: hariIni
        })
      });

      if (response.ok) {
        setBarangDipinjam([...barangDipinjam, selectedBarang._id]);
        
        tutupModal();
        Swal.fire({
          icon: 'success',
          title: 'Peminjaman Berhasil!',
          text: `Silakan ambil ${selectedBarang.nama}.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Gagal meminjam barang');
      }
    } catch (error) {
      Swal.fire('Terjadi Kesalahan', 'Gagal memproses peminjaman.', 'error');
    }
  };

  const handleKembalikan = (barang) => {
    Swal.fire({
      title: 'Return Item?',
      text: `Are you sure you want to return ${barang.nama}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#eab308',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Return',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setBarangDipinjam(barangDipinjam.filter(id => id !== barang._id));
        Swal.fire('Item Returned!','Thank You for Your Compliance', 'success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1930] font-sans text-white p-8">
      <div className="flex items-center mb-10">
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          ← Exit
        </button>
        <h1 className="text-3xl font-bold ml-6">Inventory @ Kestari IME FTUI</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {daftarBarang.length === 0 ? (
          <p className="col-span-full text-center text-xl text-gray-400 mt-10">
            No Items Available.
          </p>
        ) : (
          daftarBarang.map((barang) => {
            const isDipinjam = barangDipinjam.includes(barang._id);

            return (
              <div key={barang._id} className="bg-white text-black rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col justify-between h-full">
                <img src={barang.gambar} alt={barang.nama} className="w-full h-48 object-cover" />
                <div className="p-5 flex flex-col items-center grow">
                  <h2 className="text-xl font-bold mb-4 text-center">{barang.nama}</h2>
                  
                  <div className="mt-auto w-full">
                    {isDipinjam ? (
                      <button 
                        onClick={() => handleKembalikan(barang)}
                        className="bg-yellow-500 text-white w-full py-2 rounded-full font-bold hover:bg-yellow-600 transition-colors cursor-pointer"
                      >
                        Return
                      </button>
                    ) : (
                      <button 
                        onClick={() => bukaModal(barang)}
                        className="bg-blue-600 text-white w-full py-2 rounded-full font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Borrow Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-2">Confirmation</h2>
            <p className="text-gray-600 mb-6">Item: <span className="font-bold text-black">{selectedBarang?.nama}</span></p>
            
            <form onSubmit={handlePinjam}>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Name - Organization</label>
                <input 
                  type="text" 
                  value={namaPeminjam}
                  onChange={(e) => setNamaPeminjam(e.target.value)}
                  placeholder="Fildzah - IME"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={tutupModal}
                  className="w-1/2 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}