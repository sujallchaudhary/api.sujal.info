const Project = require('../models/projects.model');
const Skill = require('../models/skills.model');

const showDashboard = async (req, res) => {
    try {
        const projectsCount = await Project.countDocuments({ isDeleted: false });
        const skillsCount = await Skill.countDocuments();
        
        res.render('admin/dashboard', {
            user: req.user,
            projectsCount,
            skillsCount
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { message: 'Failed to load dashboard' });
    }
};

// Projects Management
const showProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isDeleted: false }).lean();
        res.render('admin/projects/list', {
            user: req.user,
            projects,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Projects list error:', error);
        res.status(500).render('error', { message: 'Failed to load projects' });
    }
};

const showCreateProject = (req, res) => {
    res.render('admin/projects/create', {
        user: req.user,
        error: null,
        formData: {}
    });
};

const createProject = async (req, res) => {
    try {
        const { title, description, githubLink, liveLink } = req.body;
        const image = req.body.image; // This will be set by upload middleware

        if (!title || !description || !image || !githubLink || !liveLink) {
            return res.render('admin/projects/create', {
                user: req.user,
                error: 'All fields are required',
                formData: req.body
            });
        }

        await Project.create({
            title,
            description,
            image,
            githubLink,
            liveLink
        });

        res.redirect('/admin/projects?success=Project created successfully');
    } catch (error) {
        console.error('Create project error:', error);
        res.render('admin/projects/create', {
            user: req.user,
            error: 'Failed to create project',
            formData: req.body
        });
    }
};

const showEditProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project || project.isDeleted) {
            return res.redirect('/admin/projects?error=Project not found');
        }

        res.render('admin/projects/edit', {
            user: req.user,
            project,
            error: null
        });
    } catch (error) {
        console.error('Show edit project error:', error);
        res.redirect('/admin/projects?error=Failed to load project');
    }
};

const updateProject = async (req, res) => {
    try {
        const { title, description, githubLink, liveLink } = req.body;
        const image = req.body.image || req.body.existingImage;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, image, githubLink, liveLink },
            { new: true }
        );

        if (!updatedProject) {
            return res.redirect('/admin/projects?error=Project not found');
        }

        res.redirect('/admin/projects?success=Project updated successfully');
    } catch (error) {
        console.error('Update project error:', error);
        res.redirect(`/admin/projects/edit/${req.params.id}?error=Failed to update project`);
    }
};

const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedProject) {
            return res.redirect('/admin/projects?error=Project not found');
        }

        res.redirect('/admin/projects?success=Project deleted successfully');
    } catch (error) {
        console.error('Delete project error:', error);
        res.redirect('/admin/projects?error=Failed to delete project');
    }
};

// Skills Management
const showSkills = async (req, res) => {
    try {
        const skills = await Skill.find().lean();
        res.render('admin/skills/list', {
            user: req.user,
            skills,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Skills list error:', error);
        res.status(500).render('error', { message: 'Failed to load skills' });
    }
};

const showCreateSkill = (req, res) => {
    res.render('admin/skills/create', {
        user: req.user,
        error: null,
        formData: {}
    });
};

const createSkill = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.body.image; // This will be set by upload middleware

        if (!name || !image) {
            return res.render('admin/skills/create', {
                user: req.user,
                error: 'Name and image are required',
                formData: req.body
            });
        }

        await Skill.create({ name, image });
        res.redirect('/admin/skills?success=Skill created successfully');
    } catch (error) {
        console.error('Create skill error:', error);
        res.render('admin/skills/create', {
            user: req.user,
            error: 'Failed to create skill',
            formData: req.body
        });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
        
        if (!deletedSkill) {
            return res.redirect('/admin/skills?error=Skill not found');
        }

        res.redirect('/admin/skills?success=Skill deleted successfully');
    } catch (error) {
        console.error('Delete skill error:', error);
        res.redirect('/admin/skills?error=Failed to delete skill');
    }
};

module.exports = {
    showDashboard,
    showProjects,
    showCreateProject,
    createProject,
    showEditProject,
    updateProject,
    deleteProject,
    showSkills,
    showCreateSkill,
    createSkill,
    deleteSkill
};
