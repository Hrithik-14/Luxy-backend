const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

Mongoose.plugin(slug, { separator: '-', lang: 'en', truncate: 120 });

const VariantSchema = new Schema({
  color: { type: String, trim: true, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  // scalable: add sizes/discounts here later
  sizes: [{ size: String, stock: Number }],
  discount: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const ProductSchema = new Schema({
  name: { type: String, trim: true, required: true },
  slug: { type: String, slug: 'name', unique: true },
  description: { type: String, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', default: null },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
  variants: [VariantSchema],
  isActive: { type: Boolean, default: true },
  updated: Date,
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Product', ProductSchema);
