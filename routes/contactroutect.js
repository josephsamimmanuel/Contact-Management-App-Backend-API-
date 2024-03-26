// //CONTATCTROUTE
const asyncHandler=require("express-async-handler")

const express=require("express")

const router=express.Router()
const Contact=require("../models/contactmodel")
const validateToken = require("../middleware/validateTokenHandler")

//  <<----------Make The all contact routes as private----------->>

router.use(validateToken)

//  <<------------------------------------------------->>

// 1. ** GET **

//@desc get the contact
//@route GET /api/contacts/
//@access private
router.get("/",asyncHandler(async (req, res) => {
    const contacts=await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
}))

//  <<------------------------------------------------->>

// 2. ** POST ** // Contact.create // Create new Contact

//@desc create a contact
//@route POST /api/contacts/
//@access private
router.post("/",asyncHandler(async (req, res) => {
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
        user_id:req.user.id
    })
    res.status(200).json(contact)
}))

//  <<------------------------------------------------->>

// 3. ** GETID ** // Contact.findById  // GET contact by using ID

//@desc get contact by Id
//@route GET /api/contacts/:id
//@access private
router.get("/:id",asyncHandler(async (req, res) => {

    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
}))

//  <<------------------------------------------------->>

// 4. ** PUTID ** // findByIdAndUpdate // Update Contact using Id

//@desc update a contact
//@route PUT /api/contacts/:id
//@access private
router.put("/:id",asyncHandler(async (req, res) => {
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
      }

    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedContact)
}))

//  <<------------------------------------------------->>

// 5. ** DELETEID **  // deleteOne(), deleteMany() //Delete contact by ID

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
router.delete("/:id", asyncHandler(async (req, res) => {
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
      }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact)
}))

module.exports=router

