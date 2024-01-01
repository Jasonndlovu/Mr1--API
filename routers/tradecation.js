const {Tradecation} = require('../models/tradecation');
const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
router.get(`/`, async (req, res) =>{
    const tradecationList = await Tradecation.find();
    if(!tradecationList){res.status(500).json({succsess: false})}
    res.status(200).send(tradecationList);
})

router.get(`/:id`, async (req, res) =>{
    const tradecation = await Tradecation.findById(req.params.id);
    if(!tradecation){return res.status(500).send('The Tradecation with that given ID was not found!')}
    res.status(200).send(tradecation);
})

router.put(`/:id`,async (req, res) =>{
    const tradecation = await Tradecation.findByIdAndUpdate(
        req.params.id,{
            location: req.body.location,
            period: req.body.period,
            avaibleSlots: req.body.avaibleSlots,
            price: req.body.price,
        },{new : true}
    )


    if(!tradecation){return res.status(400).send('the Tradecation could not be edited')}

        res.send(tradecation);
})

router.post(`/`,async (req, res) =>{
    let tradecation = new Tradecation({
        location: req.body.location,
        period: req.body.period,
        avaibleSlots: req.body.avaibleSlots,
        price: req.body.price,
    })
    tradecation = await tradecation.save();
   if(!tradecation){return res.status(404).send('That Tradecation cannot be created!')}
   res.send(tradecation);

})


router.delete(`/:id`,(req, res) =>{
    Tradecation.findByIdAndDelete(req.params.id).then(tradecation => {
        if(tradecation){
            return res.status(200).json({succsess:true, message: 'the Tradecation is deleted'})
        } else {
            return res.status(404).json({succsess:false, message: 'Tradecation was not found'})
        }
    }).catch(err=>{
        return res.status(400).json({succsess: false, error: err})
    })
})
module.exports = router;
