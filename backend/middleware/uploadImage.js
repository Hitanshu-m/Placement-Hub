const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const isExtMatch = filetypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeMatch = filetypes.test(file.mimetype);

  if (isMimeMatch || isExtMatch) {
    return cb(null, true);
  } else {
    cb(new Error('Only standard images (JPEG/PNG/WEBP) are allowed for profile photos!'));
  }
}

// Upload Middleware
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = uploadImage;
