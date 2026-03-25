const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. IMPORT YOUR MODELS (Crucial for the createAdmin function)
const User = require('./models/User'); 

// Middleware
app.use(cors());
app.use(express.json());

// 2. CONNECT TO DATABASE
mongoose.connect('mongodb://127.0.0.1:27017/KarlRental')
  .then(async () => {
    console.log('✅ Connected to KarlRental MongoDB');
    // 3. RUN THE ADMIN SEEDER IMMEDIATELY AFTER CONNECTION
    await createAdmin();
  })
  .catch(err => console.error('❌ Connection Error:', err));

// 4. ADMIN SEEDER LOGIC
const createAdmin = async () => {
  try {
    const adminEmail = 'admin@karlrental.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: 'admin123', // Note: If your auth.js uses bcrypt, this should be hashed!
        role: 'admin',
        name: 'System Admin',
        balance: 0,
        phone: '09123456789' // 👈 ADD THIS LINE
      });
    } else {
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};

// 5. ROUTES
const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const completedRoutes = require('./routes/completed_bookings');

app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/completed_bookings', completedRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});