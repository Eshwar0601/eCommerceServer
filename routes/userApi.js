const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("../config/keys");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
    // console.log(req.body);
    res.send("Users route.");
});

router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "please enter a valid email").isEmail(),
        check(
            "password",
            "please password should have at least 5 characters"
        ).isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, email, password } = req.body;
            let user = await User.findOne({ email: email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }
            user = new User({
                name,
                email,
                password,
            });
            // HASH THE PASSWORD
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            // save to DB
            user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.jwtSecret,
                { expiresIn: 3600 * 24 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            // res.send("Users created.");
        } catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
