const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const sequelize = require("./config")
const studentRoutes = require("./routes/studentsRoute")
const marksRoutes = require("./routes/marksRoute")
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/students',studentRoutes)
app.use('/marks',marksRoutes)

sequelize.sync().then(()=>{
    console.log('Database synced')
    app.listen(5000,()=>console.log("Server active on port 5000"))
})

