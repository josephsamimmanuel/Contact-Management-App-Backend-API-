//SERVER JS
const express = require("express")
const errorHandler = require("./middleware/errorHandler")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config()
const app = express()
const port = process.env.PORT || 5000

//MONGOOSE
const Contact=require("./models/contactmodel")

const dbConnect=require("./config/dbConnection")
dbConnect();
app.use(express.json())


// 1. ** GET **

app.get("/api/contacts", asyncHandler(async (req, res) => {
    const contacts=await Contact.find()
    res.status(200).json(contacts)
}))


// 2. ** POST ** // Contact.create // Create new Contact

app.post("/api/contacts", asyncHandler(async (req, res) => {
    console.log("The Request body is", req.body)
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        res.status(400)
        throw new Error("All feilds are mandatory")
    }

    const contact=await Contact.create({
        name,
        email,
        phone,
    })
    res.status(200).json(contact)
}))
app.use(errorHandler)                                              //MiddleWare placement is important


// 3. ** GETID ** // Contact.findById  // GET contact by using ID

app.get("/api/contacts/:id", asyncHandler(async (req, res) => {

    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
})
)

// 4. ** PUTID ** // findByIdAndUpdate // Update Contact using Id

app.put("/api/contacts/:id", asyncHandler(async (req, res) => {
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedContact)
}))


// 5. ** DELETEID **  // deleteOne(), deleteMany() //Delete contact by ID

app.delete("/api/contacts/:id", asyncHandler(async (req, res) => {
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    await Contact.deleteOne();
    res.status(200).json(contact)
}))

app.listen(port, () => {
    console.log(`Server Started on ${port}...`)
})

