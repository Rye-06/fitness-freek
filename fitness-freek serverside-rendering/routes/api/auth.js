const express = require('express');
const router = express.Router();
const auth =  require('../../middleware/auth');
const User = require('../../models/Users');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @route  GET api/auth
// @desc   TEST ROUTE
// @access Public 
router.get('/', auth, async (req,res) => {
    try{
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/auth
// @desc   AUTHENTICATE USER AND GET TOKEN 
// @access Public  
router.post('/', [
    check('email','Enter a Valid Email').isEmail(),
    check('password','Password is Required').exists()
] ,
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body; // Deconstructs the Request Body // Extracts Certain Elements Only

    try {
    
      let user = await User.findOne({ email });

      if(!user){
        return res.status(400).json({ errors: [ { msg:'Invalid Credentials!' } ] });
      } // if the user doesn't exist

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400).json({ errors: [ { msg:'Invalid Credentials!' } ] });
      } // if the user enters an invalid password

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
