const Product = require('../models/Product')

const getProducts = async (req, res) => {
    const sortValue = {
        'cheap': 'price',
        'expensive': '-price',
        'popular': '-isPopular'
    }
    const sort = req.query.sort || '';
    const rarity = req.query.rarity || [1, 2, 3, 4, 5, 6];

    let skinWear;
    let category;
    let popular;

    let minPrice;
    let maxPrice;

    if (req.query.min !== undefined) {
        minPrice = req.query.min
        if (isNaN(req.query.min)) {
            minPrice = 0
        }
        
    } else {
        minPrice = 0
    }

    if (req.query.max !== undefined) {
        maxPrice = req.query.max
        if (isNaN(req.query.min)) {
            maxPrice = 99999999
        }
    } else {
        maxPrice = 99999999
    }

    if (req.query.skinWear !== undefined) {
        skinWear = req.query.skinWear
    } else {
        skinWear = ['Factory new', 'Field-tested', 'Minimal wear', 'Well-worn', 'Battle-scarred']
    }

    if (req.query.type !== undefined) {
        category = req.query.type
    } else {
        category = ['Knive', 'Glove', 'Pistol', 'SMG', 'Rifle', 'Shotgun', 'machine-gun', 'key']
    }

    if (req.query.popular !== undefined) {
        popular = req.query.popular
    } else {
        popular = [true, false]
    }
    
    const query = {'rang': { $in: rarity }, 'tag': { $in: skinWear }, 'category': { $in: category }, 'isPopular': {$in: popular}, 'price':  { $gte: minPrice, $lte: maxPrice }} 
    const products = await Product.find(query).sort(sortValue[sort]);
    res.send(products)
}

const createProduct = async (req, res) => {
    try {
        const { seo_title, seo_description, name, slug, price, description, rang, type, tag, date_create, img, category, isPopular } = req.body
        const candidate = await Product.findOne({name})
        if (candidate) {
            return res.status(400).json({message: 'This product alredy exist'})
        }
        const product = new Product({seo_title, seo_description, name, slug, price, description, rang, type, tag, date_create, img, category, isPopular})
        await product.save()
        return res.json({status: 'ok'})
    } catch(e) {
        console.log(e)
    }
}

const updateProduct = async (req, res) => {
    try {
        const { seo_title, seo_description, name, slug, price, description, rang, type, category, tag, date_create, img, isPopular } = req.body
        const candidate = await Product.findOne({name})
        if (!candidate) {
            return res.status(404).json({message: 'Product not found'})
        }
        await Product.updateOne(candidate, {seo_title, seo_description, name, slug, price, description, rang, type, category, tag, date_create, img, isPopular})
        return res.json({status: 'ok'})
    } catch(e) {
        console.log(e)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { slug } = req.body
        const candidate = await Product.findOne({slug})
        if (!candidate) {
            return res.status(404).json({message: 'Product not found'})
        }
        const product = await Product.deleteOne(candidate)
        return res.json({status: 'ok', product})
    } catch(e) {
        console.log(e)
    }
}

const getProductById = async (req, res) => {
    try{
        const slug = req.params.productId
        const prodyct = await Product.findOne({slug})
        if (!prodyct) {
            return res.status(404).json({message: 'Product not fount'})
        }
        return res.json(prodyct)
    } catch (e) {
        console.log(e)
    }
    res.send(`Get Product By Id ${req.params.productId}`)
}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}