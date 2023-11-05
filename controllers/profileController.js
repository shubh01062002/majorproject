const profileController=require('express').Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const verifyToken=require('../middlewares/verifyToken')
const multer=require('multer')
const path=require('path');

profileController.get('/prof/:id',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id).select('-password')
        if(!user){
            throw new Error("user not exist")
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

const imageFolderPath=path.join(path.join(path.join(__dirname,'..'),'..'),'/frontend/src/images');
// console.log(imageFolderPath);

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageFolderPath)
    },
    filename: (req, file, cb) => {
        // console.log(Math.round(Math.random() * 1E9));
        // console.log(path.extname(file.originalname));
        // const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        const uniqueName=file.originalname
        // console.log(uniqueName)
        cb(null, uniqueName)
    } ,
});

let upload = multer({ 
    storage, 
    limits:{ fileSize: 1000000 * 100 }, 
});

profileController.put('/:id',verifyToken,upload.single('image'),async(req,res)=>{
    try {
        if(req.params.id!== req.user.id.toString()){
            console.log(req.params.id+",  "+req.user.id.toString());
            return res.json({msg:'u are not allowed to modify others profile'})
        }

        if(req.body.password){
            const newPassword=await bcrypt.hash(req.body.password,10)
            req.body.password=newPassword
        }
        

        let updateData = { ...req.body };

        updateData.email=req.body.email
        updateData.password=req.body.password
        if (req.file) {
            updateData.profileImg = req.file.filename;
        }

        const updateProfile= await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        )
        
        return res.status(200).json(updateProfile)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
module.exports=profileController

