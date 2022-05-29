import { ConfigModule, ConfigService } from '@nestjs/config';
const cloudinary = require('cloudinary').v2

// ////console.log(process.env.CLOUDINARY_API_KEY);
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config({
    cloud_name: "saadelfadil",
    api_key: "869834899531156",
    api_secret: "S9aVR4CvN3yUypQF_sshzaO8ppU"
});

export default cloudinary;