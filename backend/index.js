import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Barang from './models/Barang.js';
import Peminjaman from './models/Peminjaman.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Database!'))
  .catch((err) => console.log('❌ Gagal connect ke database:', err));

// Get: daftar barang
app.get('/api/barang', async (req, res) => {
  try {
    const barang = await Barang.find();
    res.json(barang);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post: Tambah barang 
app.post('/api/barang', async (req, res) => {
  try {
    const barangBaru = new Barang(req.body);
    await barangBaru.save();
    res.status(201).json(barangBaru);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete: Hapus barang
app.delete('/api/barang/:id', async (req, res) => {
  try {
    await Barang.findByIdAndDelete(req.params.id);
    res.json({ message: 'Barang berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get: History peminjaman
app.get('/api/peminjaman', async (req, res) => {
  try {
    const riwayat = await Peminjaman.find().sort({ createdAt: -1 });
    res.json(riwayat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post: peminjaman baru
app.post('/api/peminjaman', async (req, res) => {
  try {
    const peminjamanBaru = new Peminjaman(req.body);
    await peminjamanBaru.save();
    res.status(201).json(peminjamanBaru);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update: status peminjaman
app.put('/api/peminjaman/:id', async (req, res) => {
  try {
    const updatedPeminjaman = await Peminjaman.findByIdAndUpdate(
      req.params.id, 
      { status: 'Dikembalikan' }, 
      { new: true } 
    );
    res.json(updatedPeminjaman);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});