const cloudinary = require('cloudinary').v2;

/**
 * Upload buffer ke Cloudinary.
 * Jika env vars tidak tersedia, skip upload dan return null.
 */
const uploadToCloudinary = (buffer, folder, publicId) => {
  // Konfigurasi dilakukan di sini (lazy) agar tidak crash saat startup
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('⚠️  Cloudinary env vars tidak tersedia, foto profil tidak diupload.');
    return Promise.resolve(null);
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };
