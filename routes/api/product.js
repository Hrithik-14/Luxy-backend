const express = require('express');
const router = express.Router();

const Product = require('../../models/product');
const Category = require('../../models/category');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// GET all products (admin)
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find({}).populate('category', 'name');
//     res.status(200).json({ products });
//   } catch (error) {
//     res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
//   }
// });
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find({})
      .populate('category', 'name')
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching products' });
  }
});
// GET product by slug (public storefront) - MUST come before /:id
router.get('/item/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'No product found.' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// POST add product with variants
router.post('/add', auth, role.check(ROLES.Admin, ROLES.Merchant, ROLES.Member), async (req, res) => {
  try {
    const { name, description, category, variants } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ error: 'At least one variant is required.' });
    }

    // Validate variants
    const colors = variants.map(v => v.color?.toLowerCase());
    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== colors.length) {
      return res.status(400).json({ error: 'Each variant must have a unique color.' });
    }

    for (const v of variants) {
      if (!v.color) return res.status(400).json({ error: 'Each variant must have a color.' });
      if (!v.price || Number(v.price) <= 0) return res.status(400).json({ error: 'Each variant price must be greater than 0.' });
    }

    // Ensure exactly one default variant
    const defaultCount = variants.filter(v => v.isDefault).length;
    if (defaultCount === 0) variants[0].isDefault = true;
    if (defaultCount > 1) variants.forEach((v, i) => { v.isDefault = i === 0; });

    const product = new Product({ name, description, category: category || null, variants });
    const saved = await product.save();

    // Link product to category
    if (category) {
      await Category.findByIdAndUpdate(category, { $push: { products: saved._id } });
    }

    res.status(200).json({ success: true, message: 'Product added successfully!', product: saved });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// PUT update product
router.put('/update/:id', auth, role.check(ROLES.Admin, ROLES.Merchant, ROLES.Member), async (req, res) => {
  try {
    const { name, description, category, variants, isActive } = req.body;

    if (variants) {
      const colors = variants.map(v => v.color?.toLowerCase());
      if (new Set(colors).size !== colors.length) {
        return res.status(400).json({ error: 'Each variant must have a unique color.' });
      }
      const defaultCount = variants.filter(v => v.isDefault).length;
      if (defaultCount === 0) variants[0].isDefault = true;
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category || null;
    if (isActive !== undefined) product.isActive = isActive;
    if (variants !== undefined) product.variants = variants;
    product.updated = new Date();

    const updated = await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully!', product: updated });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// DELETE product
router.delete('/delete/:id', auth, role.check(ROLES.Admin, ROLES.Merchant, ROLES.Member), async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// GET single product by id (admin) - MUST be last to avoid shadowing other /:id routes
router.get('/:id',async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'No product found.' });
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

module.exports = router;
