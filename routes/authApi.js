const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("../config/keys");
const jwt = require("jsonwebtoken");

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
    }
});

router.post(
    "/",
    [
        check("email", "email is required").isEmail(),
        check("password", "password is required.").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email: email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid username or password" }],
                });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid username or password" }],
                });
            }

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
