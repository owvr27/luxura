import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: '1',
        name: req.body.name,
        email: req.body.email,
        role: 'user'
      },
      token: 'mock-jwt-token'
    }
  });
});

app.post('/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: req.body.email,
        role: 'user'
      },
      token: 'mock-jwt-token'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
