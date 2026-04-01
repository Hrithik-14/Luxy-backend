const express = require('express');
const router = express.Router();
const Banner = require('../../models/banner');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const cloudinary = require('../../config/cloudinary');

// GET all banners (public or admin)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// POST add banner
router.post('/add', auth,  async (req, res) => {
  try {
    const { desktopImage, mobileImage } = req.body;

    if (!desktopImage || !mobileImage) {
      return res.status(400).json({ error: 'You must provide both desktop and mobile images.' });
    }
      const desktopUpload = await cloudinary.uploader.upload(desktopImage, {
      folder: 'banners/desktop'
    });

    // ✅ Upload mobile image
    const mobileUpload = await cloudinary.uploader.upload(mobileImage, {
      folder: 'banners/mobile'
    });


    // const banner = new Banner({ desktopImage, mobileImage });
     const banner = new Banner({
      desktopImage: desktopUpload.secure_url,
      mobileImage: mobileUpload.secure_url
    });
    const savedBanner = await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner has been added successfully!',
      banner: savedBanner
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// DELETE banner
router.delete('/delete/:id', auth,  async (req, res) => {
  try {
    const banner = await Banner.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Banner has been deleted successfully!',
      banner
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// PUT update banner active status or details
router.put('/:id', auth,async (req, res) => {
  try {
    const bannerId = req.params.id;
    const update = req.body.banner;

    await Banner.findOneAndUpdate({ _id: bannerId }, update, { new: true });

    res.status(200).json({
      success: true,
      message: 'Banner has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

module.exports = router;
