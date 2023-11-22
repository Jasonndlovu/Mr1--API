const {Strategy} = require('../models/strategy');
const express = require('express');
// const { Category } = require('../models/category');
const router = express.Router();
//const { get } = require('mongoose');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });
// get all items
router.get(`/`, async (req, res) =>{
    let filter = {};
    //show all the data
    const strategyList = await Strategy.find(filter);
    //show specific details
    //const productList = await Product.find().select('name image -_id');
    if(!strategyList){res.status(500).json({succsess: false})}
    res.send(strategyList);
})

//get specific item
router.get(`/:id`, async (req, res) =>{
    const strategy = await Strategy.findById(req.params.id);//creating reationships .populate('category')
    if(!strategy){return res.status(500).json({succsess: false})}
    res.send(strategy);
})

//add item - Done
router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let strategy = new Strategy({
        name: req.body.name,
        strategyDetails: req.body.strategyDetails,
        image:`${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-2323232"
        subText: req.body.subText,
    })
    strategy = await strategy.save();
    if(!strategy) 
    return res.status(500).send('The strategy cannot be created')
    res.send(strategy);
    
})

//edit item - Done
router.put(`/:id`, uploadOptions.single('image'),async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Strategy ID')
    }


    const strategy = await Strategy.findById(req.params.id);
    if (!strategy) return res.status(400).send('Invalid Strategy!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = strategy.image;
    }

    const updatedStrategy = await Strategy.findByIdAndUpdate(
        req.params.id,{
        name: req.body.name,
        strategyDetails: req.body.strategyDetails,
        image: imagepath,
        subText: req.body.subText,
        },{new : true}
    )


    if (!updatedStrategy) return res.status(500).send('the strategy cannot be updated!');

    res.send(updatedStrategy);
})



router.delete(`/:id`, (req, res) =>{
    Strategy.findByIdAndRemove(req.params.id).then(strategy =>{
        if(Strategy){return res.status(200).json({succsess: true, message: 'The strategy has been deleted'})}
        else{return res.status(404).json({succsess: false, message: 'The strategy has been not deleted'})}
    }).catch(err=>{return res.status(500).json({succsess: false, error: err})})
})

router.get(`/get/count`, async (req, res) =>{
    const strategyCount = await Strategy.count();
    if(!strategyCount){res.status(500).json({succsess: false})}
    res.send({strategyCount: strategyCount});
})



router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/products?categories=3497,2954
    let filter = {};

    const strategy = await Strategy.find({filter});
    if(!strategy){return res.status(500).json({succsess: false})}
    res.status(200).send(strategy);
})

router.put(`/gallery-images/:id`, uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {return res.status(400).send('Invalid Strategy Id');}
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (files) {files.map((file) => {imagesPaths.push(`${basePath}${file.filename}`);});}
    const strategy = await Strategy.findByIdAndUpdate(req.params.id,{ images: imagesPaths},{ new: true });
    if (!strategy) return res.status(500).send('the gallery cannot be updated!');
    res.send(strategy);
});


module.exports = router;