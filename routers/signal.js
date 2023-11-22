const {Signal} = require('../models/signal');
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
    const SignalList = await Signal.find(filter);
    //show specific details
    //const productList = await Product.find().select('name image -_id');
    if(!SignalList){res.status(500).json({succsess: false})}
    res.send(SignalList);
})

//get specific item
router.get(`/:id`, async (req, res) =>{
    const signal = await Signal.findById(req.params.id);//creating reationships .populate('category')
    if(!signal){return res.status(500).json({succsess: false})}
    res.send(signal);
})

//add item - Done
router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let signal = new Signal({
        name: req.body.name,
        SignalDetails: req.body.SignalDetails,
        image:`${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-2323232"
        subText: req.body.subText,
    })
    signal = await signal.save();
    if(!signal) 
    return res.status(500).send('The Signal cannot be created')
    res.send(signal);
    
})

//edit item - Done
router.put(`/:id`, uploadOptions.single('image'),async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Signal ID')
    }


    const Signal = await Signal.findById(req.params.id);
    if (!Signal) return res.status(400).send('Invalid Signal!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = Signal.image;
    }

    const updatedSignal = await Signal.findByIdAndUpdate(
        req.params.id,{
        name: req.body.name,
        SignalDetails: req.body.SignalDetails,
        image: imagepath,
        subText: req.body.subText,
        },{new : true}
    )


    if (!updatedSignal) return res.status(500).send('the Signal cannot be updated!');

    res.send(updatedSignal);
})



router.delete(`/:id`, (req, res) =>{
    Signal.findByIdAndRemove(req.params.id).then(Signal =>{
        if(Signal){return res.status(200).json({succsess: true, message: 'The Signal has been deleted'})}
        else{return res.status(404).json({succsess: false, message: 'The Signal has been not deleted'})}
    }).catch(err=>{return res.status(500).json({succsess: false, error: err})})
})

router.get(`/get/count`, async (req, res) =>{
    const SignalCount = await Signal.count();
    if(!SignalCount){res.status(500).json({succsess: false})}
    res.send({SignalCount: SignalCount});
})



router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/products?categories=3497,2954
    let filter = {};

    const Signal = await Signal.find({filter});
    if(!Signal){return res.status(500).json({succsess: false})}
    res.status(200).send(Signal);
})

router.put(`/gallery-images/:id`, uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {return res.status(400).send('Invalid Signal Id');}
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (files) {files.map((file) => {imagesPaths.push(`${basePath}${file.filename}`);});}
    const Signal = await Signal.findByIdAndUpdate(req.params.id,{ images: imagesPaths},{ new: true });
    if (!Signal) return res.status(500).send('the gallery cannot be updated!');
    res.send(Signal);
});


module.exports = router;