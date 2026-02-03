const Job = require('../models/Job');

// @desc    Soo saar dhamaan shaqooyinka (Get all jobs)
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Soo saar hal shaqo (Get single job)
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Shaqadaas lama helin',
            });
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Abuur shaqo cusub (Create job)
// @route   POST /api/v1/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
    try {
        // Ku dar ID-ga macmiilka shaqada abuuraya
        req.body.user = req.user.id;

        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            data: job,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cusboonaysii shaqo (Update job)
// @route   PUT /api/v1/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Shaqadaas lama helin',
            });
        }

        // Hubi in qofka shaqada leh uu yahay kan wax badalaya
        if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Ma lihid oggolaansho aad ku badasho shaqadan',
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Tirtir shaqo (Delete job)
// @route   DELETE /api/v1/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Shaqadaas lama helin',
            });
        }

        // Hubi oggolaanshaha
        if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Ma lihid oggolaansho aad u tirtirto shaqadan',
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
