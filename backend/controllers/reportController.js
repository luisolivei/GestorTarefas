const Task = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');


// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/export/tasks
// @access  Private (admin only)
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
            { header: 'Task ID', key: '_id', width: 5 },
            { header: 'Title', key: 'title', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Priority', key: 'priority', width: 10 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Due Date', key: 'dueDate', width: 15 },
            { header: 'Assigned To', key: 'assignedTo', width: 15 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(', ');
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="tasks_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });

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