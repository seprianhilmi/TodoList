import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Menggunakan middleware CORS

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/todo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema dan model
const todoSchema = new mongoose.Schema({
  nama: String,
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/kegiatan', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
    console.log('Data berhasil ditampilkan');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/kegiatan', async (req, res) => {
  try {
    const { nama } = req.body;
    const todo = new Todo({ nama });
    await todo.save(); // Menyimpan data todo baru ke MongoDB
    res.status(201).json(todo); // Mengembalikan data yang berhasil disimpan sebagai respons
    console.log('Data berhasil disimpan');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/kegiatan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id); // Menghapus todo berdasarkan ID dari MongoDB
    res.status(204).end(); // Mengembalikan status tanpa konten yang menunjukkan sukses tanpa respons
    console.log('Data berhasil dihapus');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
