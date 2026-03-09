



// const cloudinary = require('../utils/cloudinaryConfig');
// const fs = require('fs');
// const streamifier = require("streamifier");
// require('dotenv').config({ path: './.env' });

// const uploadFile = async (fileBuffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder },
//       (error, result) => {
//         if (result) {
//           resolve({
//             url: result.secure_url,
//             public_id: result.public_id,
//           });
//         } else {
//           reject(new Error("Cloudinary upload failed: " + error.message));
//         }
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

// const deleteFile = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//     return true;
//   } catch (err) {
//     throw new Error('Delete failed: ' + err.message);
//   }
// };

// const extractPublicId = (url) => {
//   const parts = url.split('/');
//   const fileWithExt = parts.pop(); // Get last part: 'murv0kuiccgc5dhpdg9t.jpg'
//   const fileName = fileWithExt.split('.')[0]; // Remove extension

//   const folder = parts.slice(parts.indexOf('upload') + 1).join('/'); // e.g., 'categories'
  
//   return `${folder}/${fileName}`;
// };
// const listAllFiles = async (folder = '') => {
//   try {
//     console.log("this is called ...")
//     console.log('Cloudinary Config:', cloudinary.config());
//     const result = await cloudinary.api.resources({
//       type: 'upload',
//       prefix: folder + '/', // Use folder name if needed
//       max_results: 100, // Can be adjusted
//     });
//     console.log('Cloudinary Config:', cloudinary.config());
//     const urls = result.resources.map((file) => ({
//       url: file.secure_url,
//       public_id: file.public_id,
//     }));

//     return urls;
//   } catch (err) {
//     throw new Error('Fetching file list failed: ' + err.message);
//   }
// };

// module.exports = { uploadFile, deleteFile,extractPublicId,listAllFiles };



// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// module.exports = cloudinary;


const cloudinary = require('../utils/cloudinaryConfig');
const fs = require('fs');
const streamifier = require("streamifier");
require('dotenv').config({ path: './.env' });
 
const uploadFile = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error("Cloudinary upload failed: " + error.message));
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
 
const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    throw new Error('Delete failed: ' + err.message);
  }
};
 
const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileWithExt = parts.pop(); // Get last part: 'murv0kuiccgc5dhpdg9t.jpg'
  const fileName = fileWithExt.split('.')[0]; // Remove extension
 
  const folder = parts.slice(parts.indexOf('upload') + 1).join('/'); // e.g., 'categories'
 
  return `${folder}/${fileName}`;
};
const listAllFiles = async (folder = '') => {
  try {
    console.log("this is called ...")
    console.log('Cloudinary Config:', cloudinary.config());
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder + '/', // Use folder name if needed
      max_results: 100, // Can be adjusted
    });
    console.log('Cloudinary Config:', cloudinary.config());
    const urls = result.resources.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id,
    }));
 
    return urls;
  } catch (err) {
    throw new Error('Fetching file list failed: ' + err.message);
  }
};
 
module.exports = { uploadFile, deleteFile,extractPublicId,listAllFiles };
 


