const Project = require('../models/projects.model');

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isDeleted: false }).select('-isDeleted').lean();
        if (!projects || projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No projects found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Projects retrieved successfully',
            data: projects
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project || project.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Project retrieved successfully',
            data: project
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
const createProject = async (req, res) => {
    try {
        const { title, description, image, githubLink, liveLink } = req.body;
        if (!title || !description || !image) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const newProject = await Project.create({
            title,
            description,
            image,
            githubLink,
            liveLink
        });
        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: newProject
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, githubLink, liveLink } = req.body;
        const updatedProject = await Project.findByIdAndUpdate(id, {
            title,
            description,
            image,
            githubLink,
            liveLink
        }, { new: true });
        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: updatedProject
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
            data: deletedProject
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
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};