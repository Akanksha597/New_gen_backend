const express = require('express');
const router = express.Router();
const courseBatchController = require('../controllers/CourseController');
const upload = require('../middleware/upload');

// ---------------- CREATE BATCH ----------------
// Accept multiple images and one syllabus PDF
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'syllabus', maxCount: 1 }
  ]),
  courseBatchController.createBatch
);

// ---------------- GET ALL BATCHES ----------------
router.get('/', courseBatchController.getAllBatches);

// ---------------- GET BATCH BY ID ----------------
router.get('/:id', courseBatchController.getBatchById);

// ---------------- UPDATE BATCH ----------------
// Accept new images and/or syllabus
router.put(
  '/:id',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'syllabus', maxCount: 1 }
  ]),
  courseBatchController.updateBatch
);

// ---------------- DELETE BATCH ----------------
router.delete('/:id', courseBatchController.deleteBatch);

module.exports = router;
