const {Notifications} = require('../models/notifications');
const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
router.get(`/`, async (req, res) =>{
    const notificationsList = await Notifications.find();
    if(!notificationsList){res.status(500).json({succsess: false})}
    res.status(200).send(notificationsList);
})

router.get(`/:id`, async (req, res) =>{
    const notifications = await Notifications.findById(req.params.id);
    if(!notifications){return res.status(500).send('The notification with that given ID was not found!')}
    res.status(200).send(notifications);
})

router.put(`/:id`,async (req, res) =>{
    const notifications = await Notifications.findByIdAndUpdate(
        req.params.id,{
        pair: req.body.pair,
        sub: req.body.sub,
        signal: req.body.signal,
        timeFrame: req.body.timeFrame,
        },{new : true}
    )


    if(!notifications){return res.status(400).send('the notifications could not be edited')}

        res.send(notifications);
})

router.post(`/`,async (req, res) =>{
    let notifications = new Notifications({
        pair: req.body.pair,
        sub: req.body.sub,
        signal: req.body.signal,
        timeFrame: req.body.timeFrame,
    })
    notifications = await notifications.save();
   if(!notifications){return res.status(404).send('That notifications cannot be created!')}
   res.send(notifications);

})


router.delete(`/:id`,(req, res) =>{
    Notifications.findByIdAndDelete(req.params.id).then(notifications => {
        if(notifications){
            return res.status(200).json({succsess:true, message: 'the notifications is deleted'})
        } else {
            return res.status(404).json({succsess:false, message: 'notifications was not found'})
        }
    }).catch(err=>{
        return res.status(400).json({succsess: false, error: err})
    })
})
module.exports = router;