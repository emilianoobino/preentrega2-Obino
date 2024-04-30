const express = require("express");
const router = express.Router();
const ProductManager = require("../Controllers/product-manager.js");

// Crear una instancia de ProductManager
const productManager = new ProductManager();

router.get("/home", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", {productos: productos});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

router.get("/chat", async (req, res) => {
    res.render("chat");
})

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });
        const newArray = products.docs.map((producto) => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });
        res.render("products", {
            productos: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });
    } catch (error) {
        console.error("Error al obtener productos en views router", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor en views",
        });
    }
});

module.exports = router;
