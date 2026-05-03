import mongoose from 'mongoose';

const barangSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  gambar: {
    type: String,
    required: true,
  }
}, { timestamps: true }); 

export default mongoose.model('Barang', barangSchema);