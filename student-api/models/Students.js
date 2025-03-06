const {DataTypes} = require('sequelize');
const sequelize = require("../config")

const Student = sequelize.define("students",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    name: {
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    email: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    phone: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    }

})

module.exports = Student;