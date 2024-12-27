const express = require('express'); 
const connectDB = require('./config/db'); // MongoDB config file
const User = require("./models/Users")

const app = express(); 

// Connects to MongoDB Database-
connectDB();

// Init Middleware
app.use(express.json({ extended:true }));
app.set('view engine', 'pug');

app.get('/', (req,res) => {
    res.send('API Running')
}); 

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

app.get('/signup', (req,res)=>{
    res.render('sign-up')
});

app.get('/login', (req,res)=>{
    res.render('login')
});

app.post('/signup', (req, res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    user.save(function(err){ 
        if(err)console.log(err) 
    });

    res.redirect('/login')
});

app.post('/login', (req,res)=>{

})

const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));