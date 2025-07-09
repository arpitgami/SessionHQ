
import { v4 as uuidv4 } from 'uuid';

export default async function uploadImage(expertImage, CLOUDINARY_API_KEY) {
  try {
    const public_id = uuidv4();
    // console.log("publicid : ", public_id);
    // console.log("image", expertImage, CLOUDINARY_API_KEY);
    const response = await fetch("api/expert/getsignature",
      {
        method: "POST",
        body: JSON.stringify(
          {
            public_id: public_id,
          }
        ),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const data = await response.json();
    // console.log("getsignature respnse data: ", data);

    if (!data.status) {
      console.errror("error while getting signature", data);
    }
    const { signature, timestamp, cloudName } = data;

    const formData = new FormData();
    formData.append("file", expertImage);
    formData.append("public_id", public_id);
    formData.append("upload_preset", "sessionhq_image_upload");
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    console.log("Key: ", CLOUDINARY_API_KEY);
    formData.append("api_key", CLOUDINARY_API_KEY);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const cloudinaryData = await cloudinaryResponse.json();
    // console.log("cloudinary data:", cloudinaryData);


    const imageURL = cloudinaryData.secure_url
    // console.log("cloudinary URL from uploadImage :", imageURL);  
    return { imageURL, public_id };


  } catch (error) {

    console.error("error while uploading to cloudinary", error);
  }

}

