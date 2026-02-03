const User = require('../models/User');

// @desc    Is diwaangeli (Register user)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Samee macmiil cusub
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        // U gudbi khalaadka middleware-ka (Error Handler)
        next(err);
    }
};

// @desc    Soo gal (Login user)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Hubi in email iyo password la soo diray
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Fadlan geli email-kaaga iyo password-kaaga',
            });
        }

        // Raadi macmiilka adiga oo soo saaraya password-ka xifdisan
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Macluumaadkan waa khalad (Invalid credentials)',
            });
        }

        // Hubi in password-ku uu sax yahay
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Macluumaadkan waa khalad (Invalid credentials)',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// Function loogu talagalay in Token-ka lagu diwaangeliyo (Cookie & JSON)
const sendTokenResponse = (user, statusCode, res) => {
    // Samee JWT Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Amniga cookies-ka
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};

// @desc    Hel xogta macmiilka hadda jooga
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};
