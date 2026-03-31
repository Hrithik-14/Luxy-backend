const router = require('express').Router();

const productRoutes = require('./product');
const categoryRoutes = require('./category');

const bannerRoutes = require('./banner');

// auth routes
// router.use('/auth', authRoutes);

// // user routes
// router.use('/user', userRoutes);

// // address routes
// router.use('/address', addressRoutes);

// newsletter routes
// router.use('/newsletter', newsletterRoutes);

// product routes
router.use('/product', productRoutes);

// category routes
router.use('/category', categoryRoutes);

// brand routes
// router.use('/brand', brandRoutes);

// // contact routes
// router.use('/contact', contactRoutes);

// // merchant routes
// router.use('/merchant', merchantRoutes);

// // cart routes
// router.use('/cart', cartRoutes);

// order routes
// router.use('/order', orderRoutes);

// // Review routes
// router.use('/review', reviewRoutes);

// // Wishlist routes
// router.use('/wishlist', wishlistRoutes);

// Banner routes
router.use('/banner', bannerRoutes);

module.exports = router;
