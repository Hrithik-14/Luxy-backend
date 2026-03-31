const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const BannerSchema = new Schema({
  desktopImage: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('Banner', BannerSchema);
