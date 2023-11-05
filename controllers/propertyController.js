const propertyController = require('express').Router()
const User=require("../models/User")
const Property=require("../models/Property")
const verifyToken=require("../middlewares/verifyToken")
const path=require('path')
const multer=require('multer')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const imagesPath=path.join(path.join(path.join(__dirname,'..'),'..'),'frontend/src/images');

//get all properties which is available in our db
propertyController.get('/getAll' ,async (req,res) => {
    try {
        const properties =await Property.find({}).populate("currentOwner",'-password')
        console.log(properties)

        return res.status(200).json(properties);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

//get all properties from featured properties (discussed in meeting to manuplate vishaka:) )
propertyController.get('/find/featured',async (req,res) => {
    try {
        const featuredProperties= await Property.find({featured: true}).populate("currentOwner",'-password')
        console.log(featuredProperties)

        return res.status(200).json(featuredProperties)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

// get all properties from type(vaishali nagar,harshvardhan nagar,nehru nagar)
propertyController.get('/find', async (req, res) => {
    const type = req.query
    let properties = []
    try {
        if (type) {
            properties = await Property.find(type).populate("currentOwner", '-password')
        } else {
            properties = await Property.find({})
        }

        return res.status(200).json(properties)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

//get individual property
propertyController.get('/find/:id',async (req,res)=>{
    try {
        const property=await Property.findById(req.params.id).populate("currentOwner",'-password')
        if(!property){
            throw new Error('No such property found with that id...')
        }
        return res.status(200).json(property)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})



//<------These below routes require login credintals that's why we use verifytoken(middleware)------>



//get all my properties which I'm added in website(person whose added his/her property)
propertyController.get('/my',verifyToken,async(req,res)=>{
    try {
        // console.log(req.user.id);
        const properties=await Property.find({currentOwner: req.user.id}) 
        return res.status(200).json(properties)       
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

// create property
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

propertyController.post('/',verifyToken,upload.single('image'),async(req,res)=>{
    try {
        console.log(req.file)
        console.log(req.body)
        // const {currentOwner,title,type,desc,price,beds}= req.body;
        const imageName=req.file.filename;
        const newProperty=await Property.create({...req.body,currentOwner:req.user.id,img: imageName});

        return res.status(200).json(newProperty)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

//update property 
// propertyController.put('/:id', verifyToken, async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id)
//         if (property.currentOwner.toString() !== req.user.id) {
//             throw new Error("You are not allowed to update this properties")
//         }

//         // const updatedProperty = await Property.findByIdAndUpdate(
//         //     req.params.id,
//         //     { $set: req.body },
//         //     { new: true }
//         // )

//         let updateData = { ...req.body };

//         if (req.file) {
//             updateData.img = req.file.filename;
//         }

//         const updatedProperty = await Property.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true }
//         )


//         return res.status(200).json(updatedProperty)
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })

//update property 
propertyController.put('/:id', verifyToken,upload.single('image'),async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        if (property.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to update this properties")
        }
        
        let updateData = { ...req.body };

        if (req.file) {
            updateData.img = req.file.filename;
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        return res.status(200).json(updatedProperty)
    } catch (error) {
        return res.status(500).json(error)
    }
})


//delete property
propertyController.delete('/:id', verifyToken, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        if (property.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to delete other people properties")
        }
        
        console.log("aa pa raha hai")
        await property.deleteOne()

        return res.status(200).json({ msg: "Successfully deleted property" })
    } catch (error) {
        return res.status(500).json(error)
    }
})

propertyController.get('/recommendation/:id',async(req,res)=>{
    try {
        const properties =await Property.find({}).populate("currentOwner",'-password')
       // console.log(properties)

        // properties.toArray(function(err, docs) {
        //     if (err) {
        //       throw err;
        //     }
        
        //     console.log(docs);
        //   });
        const property2=await Property.findById(req.params.id).populate("currentOwner",'-password')
       let formatteddocs =[]
      //console.log("property2")
       //console.log(property2)
       const txt1=property2.preference+' '+property2.address+' '+property2.desc
        properties.forEach(element => { 

            // console.log("exec")
            // let tempodj={
            //     id: element._id,
            //     s:
            // }
            if(element._id==property2._id){return;}
            let tmpobj={}
            const txt2=element.preference+' '+element.address+' '+element.desc;
            const set1 = new Set(tokenizer.tokenize(txt1));
            const set2 = new Set(tokenizer.tokenize(txt2));
            const intersection = new Set([...set1].filter(x => set2.has(x)));
            const union = new Set([...set1, ...set2]);
            const similarity = intersection.size / union.size;
            tmpobj={
                id:element._id,
                score:similarity
            }
            console.log(element.ownerName)
            console.log(similarity)
            formatteddocs.push(tmpobj)
            
        }); 
        formatteddocs.sort((x,y)=>y.score-x.score)
        let ans=[];
        const n =Math.min(formatteddocs.length,5)
        console.log("orderes")
        for(let i=1;i<n;i++){

            const property3=await Property.findById(formatteddocs[i].id).populate("currentOwner",'-password')
        // console.log(property3)
        console.log(property3.ownerName)
        console.log(formatteddocs[i].score)
            ans.push(property3)
        }
        return res.status(200).json(ans);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }        
})

module.exports = propertyController