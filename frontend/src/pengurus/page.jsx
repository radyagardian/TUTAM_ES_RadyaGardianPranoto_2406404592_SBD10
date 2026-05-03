import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function PengurusPage() {
  const navigate = useNavigate();

  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaBarangBaru, setNamaBarangBaru] = useState('');

  const fetchData = async () => {
    try {
      const resBarang = await fetch('http://localhost:5000/api/barang');
      const dataBarang = await resBarang.json();
      setDaftarBarang(dataBarang);

      const resRiwayat = await fetch('http://localhost:5000/api/peminjaman');
      const dataRiwayat = await resRiwayat.json();
      setRiwayatPeminjaman(dataRiwayat);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTambahBarang = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/barang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: namaBarangBaru,
          gambar: `https://placehold.co/400x300?text=${namaBarangBaru.replace(/ /g, '+')}`
        })
      });

      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
        setNamaBarangBaru('');
        Swal.fire('Success!', 'Item addded to Inventory.', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Item addition failed.', 'error');
    }
  };

  const handleHapusBarang = (id, nama) => {
    Swal.fire({
      title: 'Delete Item?',
      text: 'Are you sure you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/barang/${id}`, { 
            method: 'DELETE' 
          });
          fetchData();
          Swal.fire('Deleted!', 'Item successfully deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Error deleting item.', 'error');
        }
      }
    });
  };

  const handleUbahStatus = (id) => {
    Swal.fire({
      title: 'Confirm Return',
      text: 'Are you sure this item is returned?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:5000/api/peminjaman/${id}`, {
            method: 'PUT',
          });
          fetchData(); 
          Swal.fire('Success!', 'Status Updated.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Erorr updating status.', 'error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1930] font-sans text-white p-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            ← Exit
          </button>
          <h1 className="text-3xl font-bold ml-6">Executive Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage inventory</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors cursor-pointer"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {daftarBarang.length === 0 ? (
              <p className="text-center text-gray-400 italic py-4">Nothing here...</p>
            ) : (
              daftarBarang.map((barang) => (
                <div key={barang._id} className="flex justify-between items-center bg-white text-black p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={barang.gambar} alt={barang.nama} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="font-bold text-lg">{barang.nama}</span>
                  </div>
                  <button 
                    onClick={() => handleHapusBarang(barang._id, barang.nama)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl text-black overflow-hidden">
          <h2 className="text-2xl font-bold mb-6">History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-3 px-2">Date</th>
                  <th className="pb-3 px-2">Name</th>
                  <th className="pb-3 px-2">Item</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {riwayatPeminjaman.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500 italic">Nothing to show.</td>
                  </tr>
                ) : (
                  riwayatPeminjaman.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-gray-500">{item.tanggal}</td>
                      <td className="py-3 px-2 font-bold">{item.namaPeminjam}</td>
                      <td className="py-3 px-2 text-blue-600 font-semibold">{item.namaBarang}</td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Lent' 
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {item.status === 'Lent' ? (
                          <button 
                            onClick={() => handleUbahStatus(item._id)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            Accept Item
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Finished</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
            
            <form onSubmit={handleTambahBarang}>
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Name</label>
                <input 
                  type="text" 
                  value={namaBarangBaru}
                  onChange={(e) => setNamaBarangBaru(e.target.value)}
                  placeholder="Inflatable Bed..?"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}