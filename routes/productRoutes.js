import express from "express";
import expressAsyncHandler from "express-async-handler";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/checkRole.js";
import validatorID from "../middlewares/validatorID.js";
import { createNewProductController, deleteProductController, filterProductController, filterWithCategoriesController, getAllProductsController, getAllProductsFilteredController, getProductByIdController, getSlugController, reviewsProductController, updateProductController } from "../controllers/productController.js";
import { createProductValidator } from "../middlewares/bodyValidator.js";


const router = express.Router();

// Route for create new product
router.post('', isAuth, (req, res, next) => checkRole(['Admin'], req, res, next),
createProductValidator, expressAsyncHandler(createNewProductController));

// Route for update product
router.put('/:id', isAuth, validatorID, isAuth, (req, res, next) => checkRole(['Admin'], req, res, next),
expressAsyncHandler(updateProductController));

// Route for display all products without filter
router.get('', isAuth, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(getAllProductsController));

// Route for display all products with filter
router.get('/filter', isAuth, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(getAllProductsFilteredController));

// Route for display an product whose identifier is known
router.get('/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(getProductByIdController));

// Route for filter products
router.get('/filter/search', isAuth, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(filterProductController));

// Route for filter products with category
router.get('/department/categories', isAuth, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(filterWithCategoriesController));

// Route for display products with slug
router.get('/slug/:slug', isAuth, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(getSlugController));

// Route for delete product
router.delete('/:id', isAuth, validatorID, (req, res, next) => checkRole(['Admin'], req, res, next),
expressAsyncHandler(deleteProductController));

// Route for add reviews
router.post('/:id/reviews', isAuth, validatorID, (req, res, next) => checkRole(['Admin', 'Customer'], req, res, next),
expressAsyncHandler(reviewsProductController));

export default router;