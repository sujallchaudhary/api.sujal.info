const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;        if (!email || !password) {
            return res.status(400).render('auth/login', {
                error: 'Email and password are required',
                email: email || '',
                layout: false
            });
        }        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            logger.warn('Failed login attempt - user not found', { email });
            return res.status(401).render('auth/login', {
                error: 'Invalid email or password',
                email,
                layout: false
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            logger.warn('Failed login attempt - invalid password', { email });
            return res.status(401).render('auth/login', {
                error: 'Invalid email or password',
                email,
                layout: false
            });
        }

        // Generate token and set cookie
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect('/admin/dashboard');
        
        // Log successful login
        logger.info('Successful login', { 
            userId: user._id, 
            email: user.email,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });

    } catch (error) {
        console.error('Login error:', error);        res.status(500).render('auth/login', {
            error: 'Internal server error',
            email: req.body.email || '',
            layout: false
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

const showLoginForm = (req, res) => {
    res.render('auth/login', { 
        error: null, 
        email: '',
        layout: false // Don't use layout for login page
    });
};

module.exports = {
    login,
    logout,
    showLoginForm
};
