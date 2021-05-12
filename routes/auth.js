const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn')

const User = require('../models/User');

// route        POST api/users
// desc         Register a user
// access       Public
router.post(
    '/register',
    [
        check('name', 'Please add your name').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please Enter a password with 6 or more characters'
        ).isLength({ min: 8 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            user = new User({
                name,
                email,
                password,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });

            res.json({ token });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({msg: 'Server Error'});
        }
    }
);

// route        GET api/
// desc         Auth User and Get Token
// access       Public
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Server Error'});
    }
});

// route        POST api/login
// desc         Auth User and Get Token
// access       Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'User Not Registered.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Wrong Password.' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });

            res.json({ token });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({msg: 'Server Error'});
        }
    }
);

module.exports = router;
