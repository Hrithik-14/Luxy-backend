const express = require('express');
const router = express.Router();
const Banner = require('../../models/banner');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

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
router.post('/add', auth, role.check(ROLES.Admin, ROLES.Merchant), async (req, res) => {
  try {
    const { desktopImage, mobileImage } = req.body;

    if (!desktopImage || !mobileImage) {
      return res.status(400).json({ error: 'You must provide both desktop and mobile images.' });
    }

    const banner = new Banner({ desktopImage, mobileImage });
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
router.delete('/delete/:id', auth, role.check(ROLES.Admin, ROLES.Merchant), async (req, res) => {
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
router.put('/:id', auth, role.check(ROLES.Admin, ROLES.Merchant), async (req, res) => {
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
