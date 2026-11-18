
const express = require('express');

const {
    body,
    validationResult,
    matchedData
} = require('express-validator');

const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
    res.render('register', {
        errors: [],
        old: {}
    });
});

// Registration route with server-side validation
app.post(
    '/register',

    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required.')
            .isLength({ min: 3, max: 30 })
            .withMessage('Name must contain 3 to 30 characters.'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Enter a valid email address.'),

        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Mobile number is required.')
            .matches(/^[0-9]{10}$/)
            .withMessage('Mobile number must contain exactly 10 digits.'),

        body('course')
            .notEmpty()
            .withMessage('Please select a course.')
            .isIn(['Computer Engineering', 'IT', 'Mechanical Engineering', 'Electronics'])
            .withMessage('Please select a valid course.'),

        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must contain at least 8 characters.'),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match.');
                }
                return true;
            })
    ],

    (req, res) => {

        // Check validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render('register', {
                errors: errors.array(),
                old: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    course: req.body.course
                }
            });
        }

        // Get validated information
        const student = matchedData(req);

        // Display successful registration
        res.status(200).render('success', {
            student: student
        });
    }
);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});