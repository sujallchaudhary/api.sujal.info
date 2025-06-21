const Branch = require('../models/branch.model.js');

const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        if (!branches || branches.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No branches found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Branches retrieved successfully',
            data: branches
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    getBranches
};