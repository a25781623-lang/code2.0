import axios from "axios";
import { PINATA_JWT } from "../constants";

const PINATA_API_URL = "https://api.pinata.cloud";

export const uploadJsonToPinata = async (jsonObject) => {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      jsonObject,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Pinata JSON upload error:", error);
    throw new Error(`Pinata upload failed: ${error.response?.data?.error || error.message}`);
  }
};

export const uploadFileToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Pinata file upload error:", error);
    throw new Error(`Pinata file upload failed: ${error.response?.data?.error || error.message}`);
  }
};

export const checkPinataConnection = async () => {
  try {
    const response = await axios.get(`${PINATA_API_URL}/data/testAuthentication`, {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPinataGatewayUrl = (cid) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};
