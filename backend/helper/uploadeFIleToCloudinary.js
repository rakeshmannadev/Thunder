import cloudinary from "../services/cloudinary.js";

export const uploadeFiles = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return response.secure_url;
  } catch (error) {
    console.log("Error in cloudinary upload", error);
    throw new Error("Error uploading to cloudinary");
  }
};
