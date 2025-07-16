const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dovl80avx',
  api_key: '829236697439362',
  api_secret: 'U7slZlngFg6-DBxEqHC8WoTqd1I',
});

module.exports = cloudinary;
