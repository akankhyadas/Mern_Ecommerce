require('dotenv').config();

const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { type } = require('os');
const { error, log } = require('console');

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('Error connecting to MongoDB:', error));

// API creation
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Product = mongoose.model("Product", productSchema);

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

    const newProduct = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await newProduct.save();
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Creating API for deleting products
app.post('/removeproduct', async (req, res) => {
    const removedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (removedProduct) {
        res.json({
            success: true,
            name: req.body.name
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

// Schema creating for user model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        cartData: cart,
    })
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token })
})

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
})
//creating endpoint for new collection data
app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})
//creating end point for popular in women sec

app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
})
//middleware
const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please Authenticate using valid token"})
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please Authenticate using valid token"})
        }
    }
}

// Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req, res) => {
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart")
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error:" + error);
    }
});
