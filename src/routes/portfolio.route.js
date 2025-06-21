const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const { getProjects, getProjectById , createProject, updateProject, deleteProject } = require('../controllers/project.controller');
const { getSkills, createSKills, updateSkill, deleteSkill } = require('../controllers/skills.controller');
const {getContactMessages, createContactMessage} = require('../controllers/contact.controller');

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', verifyToken, uploadImage, createProject);
router.put('/projects/:id', verifyToken, updateProject);
router.delete('/projects/:id', verifyToken, deleteProject);
router.get('/skills', getSkills);
router.post('/skills', verifyToken, uploadImage, createSKills);
router.put('/skills/:id', verifyToken, uploadImage, updateSkill);
router.delete('/skills/:id', verifyToken, deleteSkill);
router.get('/contact', verifyToken, getContactMessages);
router.post('/contact', createContactMessage);

module.exports = router;

