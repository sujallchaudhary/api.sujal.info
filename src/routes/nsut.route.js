const express = require('express');

const router = express.Router();

const { getBranches} = require('../controllers/branch.controller');
const { getDetailsByRollNo,getStudents,getStudentByEmail} = require('../controllers/student.controller');

router.get('/branches', getBranches);
router.get('/students', getStudents);
router.get('/students/:rollNo', getDetailsByRollNo);
router.get('/students/email/:email', getStudentByEmail);

module.exports = router;