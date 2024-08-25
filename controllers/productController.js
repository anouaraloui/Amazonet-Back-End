import { createNewProduct, deleteProduct, filterProduct, filterWithCategories, getAllProducts, getAllProductsFiltered, getProductById, getSlug, reviewsProduct, updateProduct } from "../services/productServices.js";


// Controller for create new Product
export const createNewProductController = async (req, res) => {
    const createNewProductService = await createNewProduct(req.body);
    return res.status(createNewProductService.status).json({ response: createNewProductService });
};

// Controller for update product
export const updateProductController = async (req, res) => {
    const { id } = req.params;
    const updateProductService = await updateProduct(id, req.body);
    return res.status(updateProductService.status).json({ response: updateProductService });
};

// Controller for display all products without filter
export const getAllProductsController = async (req, res) => {
    const getAllProductsService = await getAllProducts();
    return res.status(getAllProductsService.status).json({ response: getAllProductsService });
};

// Controller for display all products with filter
export const getAllProductsFilteredController = async (req, res) => {
    const getAllProductsFilteredService = await getAllProductsFiltered(req.query);
    return res.status(getAllProductsFilteredService.status).json({ response: getAllProductsFilteredService });
};

// Controller for display an product whose identifier is known
export const getProductByIdController = async (req, res) => {
    const { id } = req.params;
    const getProductByIdService = await getProductById(id);
    return res.status(getProductByIdService.status).json({ response: getProductByIdService });
};

// Controller for delete product
export const deleteProductController = async (req, res) => {
    const { id } = req.params;
    const deleteProductService = await deleteProduct(id);
    return res.status(deleteProductService.status).json({ response: deleteProductService });
};

// Controller for add reviews
export const reviewsProductController = async (req, res) => {
    const { id } = req.params;
    const name = req.user.name;
    const reviewsProductService = await reviewsProduct(id, name, req.body);
    return res.status(reviewsProductService.status).json({ response: reviewsProductService });
};

// Controller for filter products
export const filterProductController = async (req, res) => {
    const filterProductService = await filterProduct(req.query);
    return res.status(filterProductService.status).json({ response:filterProductService });
};

// Controller for filter products with category
export const filterWithCategoriesController = async (req, res) => {
    const filterWithCategoriesService = await filterWithCategories();
    return res.status(filterWithCategoriesService.status).json({ response: filterWithCategoriesService });
};

// Controller for display product with slug
export const getSlugController = async (req, res) => {
    const { slug } = req.params;
    const getSlugService = await getSlug(slug);
    return res.status(getSlugService.status).json({ response: getSlugService });
};