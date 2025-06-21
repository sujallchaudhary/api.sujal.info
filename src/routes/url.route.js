const express = require('express');
const router = express.Router();
const { createUrl, getUrls, openUrlByShortCode, updateUrl, deleteUrl } = require('../controllers/url.controller');
const {verifyToken} = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createUrl);
router.get('/', verifyToken, getUrls);
router.get('/:shortCode', openUrlByShortCode);
router.put('/:id', verifyToken, updateUrl);
router.delete('/:id', verifyToken, deleteUrl);

module.exports = router;