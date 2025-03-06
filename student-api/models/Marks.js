const {DataTypes} = require('sequelize');
const sequelize = require("../config")
const Student = require("./Students")

const Marks = sequelize.define("marks",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

    student_id: {
        type:DataTypes.INTEGER,
        references:{model: Student, key:'id'},
        allowNull:false
    },
    subject: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    score: {
        type:DataTypes.STRING,
        allowNull:false
    }

})
Marks.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Marks, { foreignKey: 'student_id' });

module.exports = Marks;