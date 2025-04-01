import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.route.js';
import todoRoutes from './routes/todo.route.js';
import authMiddleware from './middleware/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 5003;

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// Middlewear
app.use(express.json());
// Serves the index.html from public directory
app.use(express.static(path.join(__dirname, '../public')))

// To serve html file from public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
})

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, () => {
    console.log(`Sever has started on port: ${PORT}`);
});


