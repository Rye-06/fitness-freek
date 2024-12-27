const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users');

// @route  POST api/users
// @desc   Register User
// @access Public 
router.post('/', [
    check('name','Name is Required').not().isEmpty(),
    check('email','Enter a Valid Email').isEmail(),
    check('password','Please Enter a Password of Length Greater than 6').isLength({ min:6 })
] ,
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body; // Deconstructs the Request Body // Extracts Certain Elements Only

    // Try's to See if User Already Exists
    try {
    
      let user = await User.findOne({ email });

      if(user){
        return res.status(400).json({ errors: [ { msg:'User Already Exists!' } ] });
      } // if the user is seen to exist already

    // Gets User's Gravatar
    const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    });

    user = new User({
        name,
        email,
        avatar,
        password
    });

    // Encrypt Password(Bcrypt)
    const salt = await bcrypt.genSalt(10); // amount to hash the password by (MORE IS SLOWER BUT MORE SECURE)
    user.password = await bcrypt.hash(password, salt); // hashes the password

    await user.save(); // saves user to the database

    // Return jsonwebtoken

    const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload, 
        config.get('jwtToken'),
        { expiresIn: 3600 },
        (err, token) => {
            if(err) throw err;
            res.json( { token } );
        }
    );

    } catch(err){
      console.error(err.message);
      res.status(500).send('Server Error');
    }
 }
); 

module.exports = router;
