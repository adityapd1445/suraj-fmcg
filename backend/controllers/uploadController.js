const cloudinary = require("../config/cloudinary");

const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image."
            });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "my-shop/products",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message
        });
    }
};

module.exports = {
    uploadProductImage
};
