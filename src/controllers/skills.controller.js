const Skill = require('../models/skills.model');

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        if(!skills || skills.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No skills found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Skills retrieved successfully',
            data: skills
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const createSKills = async (req, res) => {
    try {
        const {name,image} = req.body;
        if (!name || !image) {
            return res.status(400).json({
                success: false,
                message: 'Name and image are required'
            });
        }
        const newSkill = await Skill.create({
            name,
            image
        });
        if(!newSkill) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create skill'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: newSkill
        });
    } catch (error) {        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const updateData = { name };
        if (image) {
            updateData.image = image;
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSkill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            data: updatedSkill
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSkill = await Skill.findByIdAndDelete(id);

        if (!deletedSkill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Skill deleted successfully',
            data: deletedSkill
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
    getSkills,
    createSKills,
    updateSkill,
    deleteSkill
};