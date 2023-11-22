const { Module } = require('../models/module');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');

const FILE_TYPE_MAP = {
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid file type');

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

router.get(`/`, async (req, res) => {
    const moduleList = await Module.find();
    if (!moduleList) {
        return res.status(500).json({ success: false });
    }
    res.send(moduleList);
});

router.get(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Module ID');
    }
    const module = await Module.findById(req.params.id);
    console.log(module)
    if (!module) {
        return res.status(500).json({ success: false });
    }
    res.send(module);
});

router.post(`/`, uploadOptions.fields([
    { name: 'video', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), async (req, res) => {
    try {
      // Check if both files were provided
      if (!req.files || !req.files['video'] || !req.files['document']) {
        return res.status(400).send('Both video and document files are required.');
      }
  
      const videoFile = req.files['video'][0];
      const documentFile = req.files['document'][0];
  
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  
      // Create a new module with file paths
      let module = new Module({
        module: req.body.module,
        video: `${basePath}${videoFile.filename}`,
        document: `${basePath}${documentFile.filename}`,
        description: req.body.description
      });
  
      module = await module.save();
  
      if (!module) {
        return res.status(500).send('The module cannot be created');
      }
  
      res.send(module);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });



// Update
//edit item - Done
router.put(`/:id`, uploadOptions.fields([
    { name: 'video', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Strategy ID');
      }
  
      const strategy = await Strategy.findById(req.params.id);
      if (!strategy) return res.status(400).send('Invalid Strategy!');
  
      const videoFile = req.files['video'][0];
      const documentFile = req.files['document'][0];
      let videopath, documentpath;
  
      if (videoFile && documentFile) {
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        videopath = `${basePath}${videoFile.filename}`;
        documentpath = `${basePath}${documentFile.filename}`;
      } else {
        videopath = strategy.video;
        documentpath = strategy.document;
      }
  
      const updatedStrategy = await Strategy.findByIdAndUpdate(
        req.params.id, {
          module: req.body.module,
          description: req.body.description,
          video: videopath,
          document: documentpath
        }, { new: true }
      );
  
      if (!updatedStrategy) return res.status(500).send('The strategy cannot be updated!');
  
      res.send(updatedStrategy);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const module = await Module.findByIdAndRemove(req.params.id);

        if (module) {
            // Assuming video and document fields store file paths
            // You may need to handle file deletion if needed
            return res.status(200).json({ success: true, message: 'The module has been deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'The module has not been deleted' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/modulecount', async (req, res) => {
    try {
        const moduleCount = await Module.count();
        if (!moduleCount) {
            res.status(500).json({ success: false });
        }
        res.send({ moduleCount: moduleCount });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;