const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const multer=require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path');

require("dotenv").config()

const imagesPath=path.join(path.join(path.join(__dirname,'..'),'..'),'frontend/src/images');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, imagesPath)
  },
  filename: (req, file, cb) => {
      // console.log(Math.round(Math.random() * 1E9));
      // console.log(path.extname(file.originalname));
      // const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      const uniqueName=file.originalname
      console.log(uniqueName)
      cb(null, uniqueName)
  } ,
});

let upload = multer({ 
  storage, 
  limits:{ fileSize: 1000000 * 100 }, 
});
authController.post('/register',upload.single('image'), async (req, res) => {
    try {
        const isExisting = await User.findOne({ email: req.body.email })
    
        if (isExisting) {
          throw new Error("Email is already taken by another user")
        }
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // const image=req.file.filename
        const image = null;
        const newUser = await User.create({ ...req.body, password: hashedPassword,profileImg:image})
    
        const { password, ...others } = newUser._doc
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '8d' })
    
        return res.status(201).json({ others, token })
      } catch (error) {
            console.log("pp")
            return res.status(500).json(error.message)
      }
})

authController.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
          throw new Error('Wrong credentials. Try again!')
        }
    
    
        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if (!comparePass) {
          throw new Error('Wrong credentials. Try again!')
        }
    
        const { password, ...others } = user._doc
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8d' })
    
        return res.status(200).json({ others, token })
      } catch (error) {
            return res.status(500).json(error.message)
      }
})

module.exports=authController