import { ConfigModule, ConfigService } from '@nestjs/config';
// import Cloudinary from 'cloudinary'
// let  cloudinary = Cloudinary.v2;
const cloudinary = require('cloudinary').v2
 


cloudinary.config({
    cloud_name: 'saadelfadil',
    api_key: '869834899531156',
    api_secret: 'S9aVR4CvN3yUypQF_sshzaO8ppU'
});

export default cloudinary;
// module.exports = { Cloudinary };

// export default Cloudinary;