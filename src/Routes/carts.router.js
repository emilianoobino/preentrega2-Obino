const express = require("express");
const router = express.Router();
const CartManager = require("../Controllers/cart-manager.js");
const cartManager = new CartManager();
const CartModel = require("../Models/cart.model.js");


//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.createCart(); 
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId);
        if (!carrito) {
            console.log("No existe el carrito con ese id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productsInCart = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
        }));
        res.render("carts", { productos: productsInCart });
    } catch (error) {
        console.error("Error al obtener carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//3) Agregar productos a distintos carritos.

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;
        const actualizarCarrito = await cartManager.deleteProductFromCart(cartId, productId); 
        res.json({
            status: "success",
            message: "Producto eliminado del carrito correctamente",
            actualizarCarrito
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito en cart.router', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

//actualizamos el carrito con arreglo de productos
router.put("/:cid", async (req, res) => {
    let cartId = req.params.cid;
    let updatedProducts = req.body;
    //mandar array de productos en el body

    try {
        let actualizarCarrito = await cartManager.updateCart(cartId, updatedProducts);
        res.json(actualizarCarrito);
    } catch (error) {
        console.error('Error al actualizar el carrito en cart.router', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//actualizamos cantidad de ejemplares de producto por catidad pasada por body
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;
        const newQuantity = req.body.quantity;

        let updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
        res.json({
            status: "success",
            message: "Cantidad del producto actualizada correctamente",
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito desde cart.router', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        let cartId = req.params.cid;
        let updatedCart = await cartManager.emptyCart(cartId);
        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito desde cart router', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

module.exports = router;



 


