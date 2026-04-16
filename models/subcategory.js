const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

Mongoose.plugin(slug, { separator: '-', lang: 'en', truncate: 120 });

const SubcategorySchema = new Schema({
  name: { type: String, trim: true, required: true },
  slug: { type: String, slug: 'name', unique: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  updated: Date,
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Subcategory', SubcategorySchema);
