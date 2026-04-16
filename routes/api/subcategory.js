const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const Subcategory = require('../../models/subcategory');

// GET all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.status(200).json({ subcategories });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// GET single subcategory
router.get('/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'No subcategory found.' });
    res.status(200).json({ subcategory });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// POST add subcategory (admin only)
router.post('/add', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    const subcategory = new Subcategory({ name, description, isActive: true });
    const saved = await subcategory.save();
    res.status(200).json({ success: true, message: 'Subcategory added successfully!', subcategory: saved });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// PUT update subcategory (admin only)
router.put('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updated = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive, updated: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Subcategory not found.' });
    res.status(200).json({ success: true, message: 'Subcategory updated successfully!', subcategory: updated });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// DELETE subcategory (admin only)
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    await Subcategory.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Subcategory deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

module.exports = router;
