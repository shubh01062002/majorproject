const mongoose=require("mongoose")
const express=require("express")
const dotenv=require("dotenv").config();
const app =express();
const Connection =require("./config/db.js")
const authController=require("./controllers/authController.js")
const propertyController=require("./controllers/propertyController.js");
const reviewController = require("./controllers/reviewController.js")
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const profileController = require("./controllers/profileController.js");

const imagesPath=path.join(path.join(__dirname,'..'),'frontend/src/images');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//db connection
Connection();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(imagesPath))

//routes
app.use("/auth",authController)
app.use("/property",propertyController)
app.use("/review", reviewController)
app.use("/profile",profileController)

// starting server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server has been started"));