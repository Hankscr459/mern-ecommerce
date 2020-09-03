exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 3 to 32 charactors')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 charactors')
        .matches(/\d/)
        .withMessage('Password must contain a number')
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next();
};

exports.couponCodeValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('name','Name must be between 3 to 32 charactors')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('code', 'Code is required').notEmpty()
    req.check('code','Code must be between 3 to 32 charactors')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('amount', 'Amount is required').notEmpty()
    req.check('amount')
        .isLength({
            min: 2,
            max: 2
        })
        .withMessage('Amount must be 2 charactors')
        .matches(/[0-9]{2}/)
        .withMessage('Amount must be number')
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next();
}

exports.reviewValidator = (req, res, next) => {
    req.check('headline', 'Headline is required').notEmpty()
    req.check('headline','Headline must be between 3 to 32 charactors')
        .isLength({
            min: 4,
            max: 50
        });
    req.check('body', 'Content is required').notEmpty()
    req.check('body','Content maxlength  999 charactors')
        .isLength({
            max: 999
        });
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next();
}