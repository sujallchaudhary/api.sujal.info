//createUrl, getUrls, openUrlByShortCode, updateUrl, deleteUrl
const Url = require('../models/url.model');

const createUrl = async (req, res) => {
    const { fullUrl} = req.body;
    const userId = req.user._id;
    if (!fullUrl) {
        return res.status(400).json({
            success: false,
            message: 'Full URL is required'
        });
    }
    try {
        const { nanoid } = await import('nanoid');
        const shortenUrl = nanoid(5);
        const newUrl = await Url.create({
            shortenUrl,
            fullUrl,
            userId,
            isDeleted: false
        });
        if (!newUrl) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create URL'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'URL created successfully',
            data: newUrl
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getUrls = async (req, res) => {
    const userId = req.user._id;
    try {
        const urls = await Url.find({ userId, isDeleted: false });
        if( !urls || urls.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No URLs found'
            });
        }
        return res.status(200).json({
            success: true,
            data: urls
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const openUrlByShortCode = async (req, res) => {
    const { shortCode } = req.params;
    try {
        const url = await Url.findOne({ shortenUrl: shortCode, isDeleted: false });
        if (!url) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }
        url.clicks++;
        await url.save();
        return res.redirect(url.fullUrl);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateUrl = async (req, res) => {
    const { id } = req.params;
    const { fullUrl, shortCode } = req.body;
    try {
        const updatedUrl = await Url.findByIdAndUpdate(id, {
            fullUrl,
            shortCode
        }, { new: true });
        if (!updatedUrl) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'URL updated successfully',
            data: updatedUrl
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const deleteUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUrl = await Url.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedUrl) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'URL deleted successfully',
            data: deletedUrl
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
    createUrl,
    getUrls,
    openUrlByShortCode,
    updateUrl,
    deleteUrl
};