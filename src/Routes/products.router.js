const express = require("express");
const router = express.Router();
const ProductManager = require("../Controllers/product-manager.js");
const productManager = new ProductManager();

// Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productsList = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: "success",
            payload: productsList.docs,
            totalPages: productsList.totalPages,
            prevPage: productsList.prevPage,
            nextPage: productsList.nextPage,
            page: productsList.page,
            hasPrevPage: productsList.hasPrevPage,
            hasNextPage: productsList.hasNextPage,
            prevLink: productsList.prevLink,
            nextLink: productsList.nextLink,
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Traer solo un producto por id
router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.json({ error: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Agregar nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            status: "success",
            message: "Producto creado correctamente!"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Actualizar por ID
router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const productUpdated = req.body;

        await productManager.updateProduct(id, productUpdated);
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        await productManager.deleteProduct(id);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;
