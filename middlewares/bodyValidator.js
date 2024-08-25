import { body, validationResult } from 'express-validator';

// Register new user
export const registerUserValidator = [
    body('name').notEmpty().isLength({min:1}).isString().withMessage('Name is required!'),
    body('email').notEmpty().normalizeEmail().isEmail().withMessage('Check the e-mail adress!'),
    body('password').notEmpty().isStrongPassword().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/).withMessage("Password must include one lowercase character, one uppercase character, a number, a special character, and at least 8 chars.").withMessage("Password is required!"),
    body('role').notEmpty().isIn(['Admin', 'Deliveryman', 'Customer']).withMessage('Role is required!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        else return next();
    }
];

// Create new Product
export const createProductValidator = [
    body('name').notEmpty().withMessage('Name of product is required!').isLength({min:1}).isString(),
    body('slug').notEmpty().isLength({min:1}).isString().trim().withMessage('Slug is required!'),
    body('category').notEmpty().isLength({min:1}).isString().isIn(["Electronics", "Computers", "Women's Fashion", "Men's Fashion", "Video Games", "Books"]).withMessage('Category is required!'),
    body('image').optional(),
    body('price').notEmpty().isDecimal().withMessage('Price is required!'),
    body('countInStock').notEmpty().withMessage('Stock is required!'),
    body('brand').notEmpty().withMessage('Brand is required!'),
    body('numReviews').notEmpty().withMessage('Number Reviews is required!'),
    body('rating').notEmpty().isFloat({min: 0, max: 5}).withMessage('Rating is required!'),
    body('description').notEmpty().withMessage('Description is required!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        else return next();
    }
];

// Create new Order
export const createOrderValidator = [
    body('shippingAddress.fullName').notEmpty().withMessage('Your Full Name is required!').isLength({min:1}).isString(),
    body('shippingAddress.address').notEmpty().withMessage('Your Adress is required!'),
    body('shippingAddress.phone').notEmpty().isMobilePhone('ar-TN').withMessage('Phone is required!'),
    body('shippingAddress.city').notEmpty().withMessage('Your City is required!'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Your postalCode Name is required!'),
    body('shippingAddress.country').notEmpty().withMessage('Your country is required!'),
    body('paymentMethod').notEmpty().withMessage('Payment Method is required!'),
    body('itemsPrice').notEmpty().isDecimal().withMessage('Item Price is required!'),
    body('numberOfPieces').notEmpty().isNumeric().withMessage('Number of Pieces is required!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        else return next();
    }
];