const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.admin.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

// Auth routes
router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected admin routes
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', adminController.showDashboard);

// Projects management
router.get('/projects', adminController.showProjects);
router.get('/projects/create', adminController.showCreateProject);
router.post('/projects/create', uploadImage, adminController.createProject);
router.get('/projects/edit/:id', adminController.showEditProject);
router.post('/projects/edit/:id', uploadImage, adminController.updateProject);
router.post('/projects/delete/:id', adminController.deleteProject);

// Skills management
router.get('/skills', adminController.showSkills);
router.get('/skills/create', adminController.showCreateSkill);
router.post('/skills/create', uploadImage, adminController.createSkill);
router.post('/skills/delete/:id', adminController.deleteSkill);

module.exports = router;
