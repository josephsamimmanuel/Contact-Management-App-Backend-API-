// <<-------- @@ ServerJs @@ ----------->>
const express = require("express")
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000

// <<-------- @@ MONGOOSE @@ ----------->>

const Contact=require("./models/contactmodel")

const dbConnect=require("./config/dbConnection")
dbConnect();
app.use(express.json())

// <<-------- @@ CONTACTS @@ ----------->>

app.use("/api/contacts", require("./routes/contactroutect"))

// <<-------- @@ USERS @@ ----------->>

    app.use("/api/users", require("./routes/userroutes"))
    app.use(errorHandler)//MiddleWare placement is important

app.listen(port, () => {
    console.log(`Server Started on ${port}...`)
})

