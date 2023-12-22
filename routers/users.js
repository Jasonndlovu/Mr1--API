const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');// select('name email phone'); for specific fields
    if(!userList){res.status(500).json({succsess: false})}
    res.send(userList);
})

router.get(`/:id`, async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user){return res.status(500).json({message: 'The user with the given ID could not be found'})}
    res.send(user);
})

// add user
/// add user
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    try {
        // Check if a user with the same username, email, or phone number already exists
        const existingUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
                { phone: req.body.phone }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with the same username, email, or phone number already exists.' });
        }

        const file = req.file;
        let fileName = null;

        // Check if an image is present in the request
        if (file) {
            fileName = file.filename;
        }

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        let user = new User({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            membership: req.body.membership,
            lessons: req.body.lessons,
            image: fileName ? `${basePath}${fileName}` : null,
            isAdmin: req.body.isAdmin,
        });

        user = await user.save();
        if (!user) {
            return res.status(500).send('The user cannot be created');
        }
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
  

//edit item
// PUT method
router.put(`/:id`, uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid user ID');
    }
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const file = req.file;
    let imagepath;
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = userExist.image;
    }



    let user = await User.findByIdAndUpdate(
      req.params.id, {
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        membership: req.body.membership,
        lessons: req.body.lessons,
        image: imagepath, // Assuming the client sends the image path in the request body
        isAdmin: req.body.isAdmin,
      }, {
        new: true
      }
    );
    if (!user) {
      return res.status(400).send('The user could not be edited');
    }
    res.send(user);
  });

router.delete(`/:id`, (req, res) =>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(User){return res.status(200).json({succsess: true, message: 'The user has been deleted'})}
        else{return res.status(404).json({succsess: false, message: 'The user has been not deleted'})}
    }).catch(err=>{return res.status(500).json({succsess: false, error: err})})
})
 
router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.count();
    if(!userCount){res.status(500).json({succsess: false})}
    res.send({userCount: userCount});
})

router.post(`/login`, async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send('The user could not be found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userID: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send({user : user,token: token});
    }else{res.status(400).send('The user email and password is incorrect!')}

    //return res.status(200).send(user);
})




module.exports = router;
