const {OnlineLessons} = require('../models/onlineLessons');
const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
router.get(`/`, async (req, res) =>{
    const onlineLessonsList = await OnlineLessons.find();
    if(!onlineLessonsList){res.status(500).json({succsess: false})}
    res.status(200).send(onlineLessonsList);
})

router.get(`/:id`, async (req, res) =>{
    const onlineLessons = await OnlineLessons.findById(req.params.id);
    if(!onlineLessons){return res.status(500).send('The online lesson with that given ID was not found!')}
    res.status(200).send(onlineLessons);
})

router.put(`/:id`,async (req, res) =>{
    const onlineLessons = await OnlineLessons.findByIdAndUpdate(
        req.params.id,{
            type: req.body.type,
            duration: req.body.duration,
            price: req.body.price,
        },{new : true}
    )


    if(!onlineLessons){return res.status(400).send('the online lesson could not be edited')}

        res.send(onlineLessons);
})

router.post(`/`,async (req, res) =>{
    let onlineLessons = new OnlineLessons({
        type: req.body.type,
        price: req.body.price,
        duration: req.body.duration,
    })
    onlineLessons = await onlineLessons.save();
   if(!onlineLessons){return res.status(404).send('That online lesson cannot be created!')}
   res.send(onlineLessons);

})


router.delete(`/:id`,(req, res) =>{
    OnlineLessons.findByIdAndDelete(req.params.id).then(onlineLessons => {
        if(OnlineLessons){
            return res.status(200).json({succsess:true, message: 'the online lesson is deleted'})
        } else {
            return res.status(404).json({succsess:false, message: 'online lesson was not found'})
        }
    }).catch(err=>{
        return res.status(400).json({succsess: false, error: err})
    })
})
module.exports = router;