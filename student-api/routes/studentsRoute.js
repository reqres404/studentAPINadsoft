const express = require('express');
const router = express.Router();
const Student = require('../models/Students')
const Marks = require('../models/Marks')

router.post('/',async(req,res)=>{
    try {
        const student = await Student.create(req.body)
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get('/',async(req,res)=>{
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; //maximum record on a page
    const offset = (page - 1)*limit;

    try {
        const {count,rows} = await Student.findAndCountAll({limit,offset})
        res.json({
            totalRecords: count,
            totalPages: Math.ceil(count/limit),
            students:rows,
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
    
})

router.put('/:id',async(req,res)=>{
    try {
        const studentId = req.params.id
        const [updated] = await Student.update(req.body,{
            where:{id:req.params.id}
        })
        if(updated){
            const updatedStudent = await Student.findByPk(studentId)
            res.status(200).json({message:`Student with ${studentId} information updated!`})
        }
        else{
            res.status(404).json({message:`Student with ${studentId} does not exists`})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        console.log(req.params.id)
        await Student.destroy({where:{id:req.params.id}});
        res.status(200).json({message:`Student with id: ${req.params.id} deleted!`})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// Get a single student by ID with marks
router.get('/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findByPk(studentId, {
            include: [{ model: Marks }]
        });

        if (!student) {
            return res.status(404).json({ message: `Student with ID ${studentId} not found` });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;