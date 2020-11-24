'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const Product = require('./models/product');
//const product = require('./models/product');
// const product = require('./models/product')

const app = express()
const port = process.env.PORT || 3002

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Listener
app.get('/api/product', (req, res) => {
    //res.status(200).send({ products: [] })
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({ message: `Error. No se pudo realizar la petición: ${err}` })
        if (!products) return res.status(404).send({ message: `No existen productos` })

        res.send(200, { products })
    })
})

//Listener por ID de producto
app.get('/api/product/:productId', (req, res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        //message handler
        if (err) return res.status(500).send({ message: `Error. no se pudo realizar la petición: ${err}` })
        if (!product) return res.status(404).send({ message: `El producto no existe` })

        res.status(200).send({ product })
    })
})

app.post('/api/product', (req, res) => {
    console.log('POST /api/product')
    console.log(req.body)

    let product = new Product()
    product.Id = req.body.Id,
        product.sku = req.body.sku,
        product.name = req.body.name,
        product.price = req.body.price,
        product.salePrice = req.body.salePrice,
        product.discount = req.body.discount

    product.save((err, productStored) => {
        if (err) res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })

        res.status(200).send({ product: productStored })

    })

    // console.log(req.body)
    // res.status(200).send({ message = 'Producto registrado' })
})

app.put('/api/product/:productId', (req, res) => {
    let productId = req.params.productId
    let update = req.body

    Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
        if (err) res.status(500).send({ message: `Error. El producto no fué actualizado: ${err}` })

        res.status(200).send({ product: productUpdated })
    })
})

app.delete('/api/product/:productId', (req, res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if (err) res.status(500).send({ message: `Error. El producto no fué eliminado: ${err}` })

        product.remove(err => {
            if (err) res.status(500).send({ message: `Error. El producto no fué eliminado: ${err}` })
            res.status(200).send({ message: `El producto fué eliminado.` })
        })
    })
})

//mongodb://localhost:27018/tienda
//mongodb+srv://omnix-db-user:3rniMaI37F4qS4hk@cluster0.fmsqw.mongodb.net/database?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://omnix-db-user:3rniMaI37F4qS4hk@cluster0.fmsqw.mongodb.net/database?retryWrites=true&w=majority', (err, res) => {
    if (err) {
        return console.log(`Error al conectar con base de datos: ${err}`)
    }
    console.log('Conectado a la base de datos...')

    app.listen(port, () => {
        console.log(`API coorriendo en http://localhost:${port}`)
    })
})