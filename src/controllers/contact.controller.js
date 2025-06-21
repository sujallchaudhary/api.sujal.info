const Contact = require('../models/contact.model');

const getContactMessages = async (req, res) => {
    try{
        const messages = await Contact.find();
        if(!messages || messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No contact messages found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Contact messages retrieved successfully',
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const createContactMessage = async (req, res) => {
    try {
        const { name, email,phoneNo, subject, message } = req.body;
        if (!name || !email || !message || !phoneNo || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone number, subject, and message are required'
            });
        }
        const newMessage = await Contact.create({
            name,
            email,
            phoneNo,
            subject,
            message
        });
        if (!newMessage) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create contact message'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Contact message created successfully',
            data: newMessage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getContactMessages,
    createContactMessage
};