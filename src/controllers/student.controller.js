//getDetailsByRollNo,getStudents
const Student = require('../models/students.model');

const getStudents = async (req, res) => {
    try {
        const {
            branch = '',
            year = '',
            section = '',
            page = 1,
            sort = '',
            search = ''
        } = req.query;
        const filter = {};
        if (branch && branch.trim() !== '') {
            filter.branch = branch;
        }

        if (year && year.trim() !== '') {
            filter.year = year.trim();
        }

        if (section && section.trim() !== '') {
            filter.section = { $regex: section.trim(), $options: 'i' };
        }
        if (search && search.trim() !== '') {
            filter.$or = [
                { rollNo: { $regex: search.trim(), $options: 'i' } },
                { name: { $regex: search.trim(), $options: 'i' } }
            ];
        }
        const limit = 20;
        const skip = (parseInt(page) - 1) * limit;

        let sortObj = { createdAt: -1 };
        if (sort && sort.trim() !== '') {
            const sortField = sort.trim();
            if (sortField === 'rollNo' || sortField === 'name') {
                sortObj = { [sortField]: 1 };
            } else if (sortField === '-rollNo' || sortField === '-name') {
                sortObj = { [sortField.substring(1)]: -1 };
            }
        }
        const students = await Student.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate('branch')
            .lean();

        const totalStudents = await Student.countDocuments(filter);
        const totalPages = Math.ceil(totalStudents / limit);

        return res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: {
                students,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalStudents,
                    limit,
                    hasNext: parseInt(page) < totalPages,
                    hasPrev: parseInt(page) > 1
                },
                filters: {
                    branch: branch || null,
                    year: year || null,
                    section: section || null,
                    search: search || null,
                    sort: sort || null
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getDetailsByRollNo = async (req, res) => {
    try {
        const { rollNo } = req.params;
        if (!rollNo) {
            return res.status(400).json({
                success: false,
                message: 'Roll number is required'
            });
        }
        const student = await Student.findOne({ rollNo });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Student details retrieved successfully',
            data: student
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
    getStudents,
    getDetailsByRollNo
};