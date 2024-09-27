import moment from "moment";
// import crypto from "crypto";

const fileFormate = (url) => {
  // to check the extention if a file
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";

  if (
    fileExt === "jpg" ||
    fileExt === "png" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

const tranformImage = (url = "", width = 100) => {
  if (typeof url !== "string") {
    console.error("Invalid URL provided", url);
    return url; // Return the original url unchanged
  }
  // const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

// const tranformImage = (url = "", width = 100) => {
//   // Check if url is a string
//   if (typeof url !== "string") {
//     console.error("Provided URL is not a string");
//     return "";
//   }

//   const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
//   return newUrl;
// };

const getLast7Days = () => {
  const currentDate = moment();

  const last7days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7days.unshift(dayName);
  }
  return last7days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

// /**
//  * Encrypts a message using the recipient's public key.
//  * @param {string} message - The plaintext message to encrypt.
//  * @param {string} publicKey - The recipient's public key in PEM format.
//  * @returns {string} - The encrypted message encoded in base64.
//  */
// const encryptMessage = (message, publicKey) => {
//   // Convert the message to a buffer
//   const bufferMessage = Buffer.from(message, "utf-8");

//   // Encrypt the message using the public key
//   const encrypted = crypto.publicEncrypt(publicKey, bufferMessage);

//   // Encode the encrypted message as a base64 string
//   return encrypted.toString("base64");
// };

// const getPublicKey = async (userId) => {
//   try {
//     const { data } = await axios.get(`${server}/api/v1/users/${userId}`);
//     return data.publicKey;
//   } catch (error) {
//     console.error("Error fetching public key:", error);
//     return null;
//   }
// };
export {
  fileFormate,
  tranformImage,
  getLast7Days,
  getOrSaveFromStorage,
  // encryptMessage,
  // getPublicKey,
};
