const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const Student = require('../models/Students');


router.post('/', async (req, res) => {
    try {
        const { student_id, subject, score } = req.body;
        
        
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ message: `Student with ID ${student_id} not found` });
        }

        const mark = await Marks.create({ student_id, subject, score });
        res.status(201).json(mark);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Marks.findAndCountAll({ limit, offset });
        res.json({
            totalRecords: count,
            totalPages: Math.ceil(count / limit),
            marks: rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/student/:student_id', async (req, res) => {
    try {
        const student_id = req.params.student_id;
        
        const marks = await Marks.findAll({ where: { student_id } });
        if (!marks.length) {
            return res.status(404).json({ message: `No marks found for student ID ${student_id}` });
        }

        res.json(marks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const markId = req.params.id;
        const [updated] = await Marks.update(req.body, { where: { id: markId } });

        if (updated) {
            const updatedMark = await Marks.findByPk(markId);
            return res.status(200).json(updatedMark);
        }
        res.status(404).json({ message: `Mark with ID ${markId} not found` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Marks.destroy({ where: { id: req.params.id } });

        if (deleted) {
            return res.status(200).json({ message: `Mark with ID ${req.params.id} deleted` });
        }

        res.status(404).json({ message: `Mark with ID ${req.params.id} not found` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
