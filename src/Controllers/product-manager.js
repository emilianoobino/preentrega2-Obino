const ProductModel = require("../Models/product.model.js");

class ProductManager {
    async addProduct({ title, description, price, img, thumbnail, code, category, stock }) {
        try {
            if (!title || !description || !price || !img || !thumbnail || !code || !category || !stock) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExist = await ProductModel.findOne({ code: code });
            if (productExist) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                category,
                stock,
                status: true,
                thumbnail: thumbnails || []

            });

            await newProduct.save();
        } catch (error) {
            console.error("Error al agregar un producto", error);
            throw error;
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                }
            }

            const products = await ProductModel.find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.error("Error al recuperar productos en product manager", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado!");
                return product;
            }
        } catch (error) {
            console.error("Error al leer el archivo ", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!updateProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado correctamente");
            return updateProduct;
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }
}

module.exports = ProductManager;
