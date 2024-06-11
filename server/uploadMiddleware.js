const multer = require("multer")

const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the destination directory for storing uploaded images
      cb(null, 'uploads/posts/');
    },
    filename: (req, file, cb) => {
      // Use a unique filename or keep the original filename
      const uniqueFilename = Date.now() + '-' + file.originalname;
      console.log(uniqueFilename)
      cb(null, uniqueFilename);
    },
  });

const profilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
      const uniqueFilename = Date.now() + '-' + file.originalname;
      console.log(uniqueFilename)
      cb(null, uniqueFilename);
    },
});
  
const uploadPostMedia = multer({ storage: postStorage });
const uploadProfileMedia = multer({storage: profilesStorage});

module.exports = {uploadPostMedia, uploadProfileMedia}