const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware loogu talagalay ilaalinta waddooyinka (Protect Routes)
exports.protect = async (req, res, next) => {
    let token;

    // Hubi haddii uu jiro Bearer token header-ka ku jira
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Ama haddii uu jiro token cookies-ka ku jira
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Haddii uusan jirin wax token ah
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Looma oggola inaad gasho waddadan (Not authorized)',
        });
    }

    try {
        // Xaqiiji token-ka (Verify JWT)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ku dar xogta macmiilka request-ka
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Looma oggola inaad gasho waddadan (Not authorized)',
        });
    }
};

// Function loogu talagalay in lagu xaddido qofka galaya waddada (Roles)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Qofka leh doorkan (${req.user.role}) looma oggola waddadan`,
            });
        }
        next();
    };
};
