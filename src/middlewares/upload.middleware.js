const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp','image/svg+xml'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerName = process.env.AZURE_CONTAINER_NAME || 'images';
const createContainerIfNotExists = async () => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists({
            access: 'blob'
        });
    } catch (error) {
        console.error('Error creating container:', error);
    }
};
createContainerIfNotExists();
const uploadImageToBlob = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const blobName = `uploads/${fileName}`;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadOptions = {
            blobHTTPHeaders: {
                blobContentType: req.file.mimetype
            }
        };

        await blockBlobClient.upload(req.file.buffer, req.file.buffer.length, uploadOptions);
        const imageUrl = blockBlobClient.url;
        req.body.image = imageUrl;
        next();

    } catch (error) {
        console.error('Blob upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
};
const uploadImage = [
    upload.single('image'),
    uploadImageToBlob
];
const uploadMultipleImages = [
    upload.array('images', 5),
    async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No image files provided'
                });
            }
            const uploadPromises = req.files.map(async (file) => {
                const fileExtension = path.extname(file.originalname);
                const fileName = `${uuidv4()}${fileExtension}`;
                const blobName = `uploads/${fileName}`;

                const containerClient = blobServiceClient.getContainerClient(containerName);
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);

                const uploadOptions = {
                    blobHTTPHeaders: {
                        blobContentType: file.mimetype
                    }
                };

                await blockBlobClient.upload(file.buffer, file.buffer.length, uploadOptions);
                return blockBlobClient.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            req.body.images = imageUrls;

            next();

        } catch (error) {
            console.error('Multiple blob upload error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload images',
                error: error.message
            });
        }
    }
];

const deleteImageFromBlob = async (imageUrl) => {
    try {
        // Extract blob name from URL
        const url = new URL(imageUrl);
        const blobName = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);
        
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        await blockBlobClient.deleteIfExists();
        return true;
    } catch (error) {
        console.error('Error deleting blob:', error);
        return false;
    }
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImageFromBlob,
    upload // Export multer instance for custom usage
};