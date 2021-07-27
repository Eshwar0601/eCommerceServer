const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const User = require("../models/User");

router.get("/", (req, res) => {
    // console.log(req.body);
    res.send("Users route.");
});


router.post("/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "please enter a valid email").isEmail(), 
        check("password", "please password should have at least 5 characters").isLength({min: 5})
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array()})
        }
        try {
            const {name, email, password} = req.body;
            let user = await User.findOne({email : email})
            if(user) {
                return res.status(400).json({errors: [{msg: "User already exists"}]});
            }
            user = new User({
                name, email, password
            });
            // user.save();
            res.send("Users created.");
        } catch (error) {
            console.log(error);
        }
        
});


module.exports = router;