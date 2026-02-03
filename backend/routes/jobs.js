const express = require('express');
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
} = require('../controllers/jobs');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');


router.route('/').get(getJobs);
router.route('/:id').get(getJob);


router.route('/').post(protect, authorize('employer', 'admin'), createJob);
router.route('/:id')
    .put(protect, authorize('employer', 'admin'), updateJob)
    .delete(protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
