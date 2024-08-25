import Product from "../models/productModel.js";

// Service for create new Product
export const createNewProduct = async (data) => {
    try {
        let newProduct = new Product({...data})
        await newProduct.save();
        return { status: 201, success: true , message: "Product created", productCreated: newProduct };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for update product 
export const updateProduct = async (id, data) => {
    return await Product.findById(id)
    .then( async(product) => {
        if(!product) return { status: 404, success: false, message: 'Product not found!' };
        else {
            if(data.discount === 0) product = await Product.findByIdAndUpdate(id, {
                image: data.image || product.image || '',
                countInStock: data.countInStock || product.countInStock,
                description: data.description || product.description
            });
            else {
                const priceDiscount = data.price - (( data.price * data.discount ) / 100 );
                product = await Product.findByIdAndUpdate(id, {  
                        image: data.image || product.image || '',
                        countInStock: data.countInStock || product.countInStock,
                        description: data.description || product.description,
                        discount: data.discount,
                        priceDiscount: priceDiscount                
                });
            }; 
            await product.save();
            return { status: 200, success: true, message: 'Product updated' };
        };
    }).catch((err) => {
        return { status: 400, success: false, message: err.message };
    });
};

// Service for display all products withaut filter
export const getAllProducts = async () => {
    return await Product.find().exec()
    .then(async(products) => {
        if(!products) return { status: 404, success: false, message: "There are no products!" };
        else {
            const count = await Product.count();
            return { status: 200, success: true, listProducts: count, products: products };
        }
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};

// Service for display all products with filter
export const getAllProductsFiltered = async (data) => {
    try {
        const minPriceFind = Number(data.minPrice);
        const maxPriceFind = Number(data.maxPrice);
        if (isNaN(minPriceFind) || isNaN(maxPriceFind) || minPriceFind > maxPriceFind) return { status: 400, success: true, message: 'Invalid price range!' };
        if (!data.page) data.page = 1;
        if (!data.limit) data.limit = 30;
        const skipPage = (data.page - 1) * data.limit;
        const productList = await Product.find()
            .sort({ [data.sortBy]: 1 })
            .skip(skipPage)
            .limit(parseInt(data.limit))
            .where('price').gte(minPriceFind).lte(maxPriceFind)
            .exec();
        const count = productList.length;
        if (productList && count === 0) return { status: 404, success: true, message: 'There are no product!' };
        else return { status: 200, success: true, page: data.page, limit: data.limit, totalProducts: count, products: productList };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service to display an article whose identifier is known
export const getProductById = async (id) => {
    return await Product.findById(id)
    .then((products) => {
        if(!products) return { status: 404, success: true, message: 'Products not found!' };
        else return { status: 200, success: true, products: products };
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};

// Service for delete product
export const deleteProduct = async (id) => {
    return await Product.findById(id)
    .then(async (result) => {
        if(!result) return { status: 404, success: false, message: 'Product not found!' };
        await result.remove();
        return { status: 200, success: true, message: 'Product is deleted' };
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};

// Service for add reviews 
export const reviewsProduct = async (id, name, data) => {
    return await Product.findById(id)
    .then( async (product) => {
        if(!product) return { status: 404, success: false, message: 'Product not found!' };
        else {
            if(product.reviews.find((x) => x.name === name)) return { status: 400, success: false, message: "You already submitted review!" };
            const review = {
                name: name,
                comment: data.comment,
                rating: Number(data.rating)                
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((a,c) => c.rating + a, 0) / product.reviews.length;
            const updateProduct = await product.save();
            return { status: 201, success: true, message: "Review created", review: updateProduct.reviews[updateProduct.reviews - 1], numReviews: product.numReviews, rating: product.rating };
        }
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};

// Service for filter products
export const filterProduct = async (data) => {
    try {
        const limit = data.limit || 30;
        const page = data.page || 1;
        const category = data.category || '';
        const minPrice = data.minPrice || '';
        const maxPrice = data.maxPrice || '';
        const rating = data.rating || '';
        const order = data.order || '';

        const categoryFilter = category && category !== 'all' ? { category } : {};
        const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...categoryFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(limit * (page - 1))
      .limit(limit)
      .where('price').gte(minPrice).lte(maxPrice);

    const countProducts = await Product.countDocuments({
      ...categoryFilter,
      ...ratingFilter,
    });
    return { status: 200, success: true,  countProducts: countProducts, page: page, pages: Math.ceil(countProducts / limit), prducts: products};
    } catch (error) {
        return { status: 400, success: false, message: error.message };
    };
};

// Service for filter products with category
export const filterWithCategories = async () => {    
    try {
        const categories = await Product.find().distinct('category');
        return { status: 200, success: true, categories: categories };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    };
};

// Service for display product with slug
export const getSlug = async (slug) => {
    return await Product.findOne({ slug: slug }).exec()
    .then((result) => {
        if(!result) return { status: 404, success: false, message: "Product not found" };
        else return { status: 200, success: true, slug: result };
    }).catch((err) => {
        return { status: 500, success: false, message: err.message };
    });
};