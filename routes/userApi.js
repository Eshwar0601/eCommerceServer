const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");

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
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array()})
        }
        res.send("Users route.");
});


module.exports = router;