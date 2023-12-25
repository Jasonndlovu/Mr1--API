const {Membership} = require('../models/membership');
const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
router.get(`/`, async (req, res) =>{
    const membershipList = await Membership.find();
    if(!membershipList){res.status(500).json({succsess: false})}
    res.status(200).send(membershipList);
})

router.get(`/:id`, async (req, res) =>{
    const membership = await Membership.findById(req.params.id);
    if(!membership){return res.status(500).send('The Membership with that given ID was not found!')}
    res.status(200).send(membership);
})

router.put(`/:id`,async (req, res) =>{
    const membership = await Membership.findByIdAndUpdate(
        req.params.id,{
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
        },{new : true}
    )


    if(!membership){return res.status(400).send('the Membership could not be edited')}

        res.send(membership);
})

router.post(`/`,async (req, res) =>{
    let membership = new Membership({
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
    })
    membership = await membership.save();
   if(!membership){return res.status(404).send('That Membership cannot be created!')}
   res.send(membership);

})


router.delete(`/:id`,(req, res) =>{
    Membership.findByIdAndDelete(req.params.id).then(membership => {
        if(Membership){
            return res.status(200).json({succsess:true, message: 'the Membership is deleted'})
        } else {
            return res.status(404).json({succsess:false, message: 'Membership was not found'})
        }
    }).catch(err=>{
        return res.status(400).json({succsess: false, error: err})
    })
})
module.exports = router;