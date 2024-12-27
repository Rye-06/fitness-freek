const express = require('express'); 
const connectDB = require('./config/db'); // MongoDB config file

const app = express(); 

// Connects to MongoDB Database-
connectDB();

// Init Middleware
app.use(express.json({ extended:false }));

app.get('/', (req,res) => {
    res.send('API Running')
}); 

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));