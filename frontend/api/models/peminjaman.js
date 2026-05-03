import mongoose from 'mongoose';

const peminjamanSchema = new mongoose.Schema({
  namaPeminjam: {
    type: String,
    required: true,
  },
  namaBarang: {
    type: String,
    required: true,
  },
  tanggal: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Dipinjam', 'Dikembalikan'], 
    default: 'Dipinjam',
  }
}, { timestamps: true });

export default mongoose.model('Peminjaman', peminjamanSchema);