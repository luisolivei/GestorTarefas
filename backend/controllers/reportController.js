const Task = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');


// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/export/tasks
// @access  Private (admin only)
const exportTasksReport = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error exporting tasks report', error: error.message });
    }
};

// @desc    Export user-task report as an Excel file
// @route   GET /api/reports/export/users
// @access  Private (admin only)
const exportUsersReport = async (req, res) => {
    try {

    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error exporting users report', error: error.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport
};