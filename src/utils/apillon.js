import axios from "axios";
import { APILLON_API_KEY } from "../constants";

const APILLON_API_URL = "https://api.apillon.io";

export const uploadJsonToApillon = async (jsonObject) => {
  try {
    // Convert JSON to blob for upload
    const jsonBlob = new Blob([JSON.stringify(jsonObject)], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", jsonBlob, "metadata.json");

    const response = await axios.post(
      `${APILLON_API_URL}/storage/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${APILLON_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Extract CID from Apillon response
    return response.data.cid || response.data.ipfsHash;
  } catch (error) {
    console.error("Apillon JSON upload error:", error);
    throw new Error(`Apillon upload failed: ${error.response?.data?.message || error.message}`);
  }
};

export const uploadFileToApillon = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${APILLON_API_URL}/storage/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${APILLON_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return response.data.cid || response.data.ipfsHash;
  } catch (error) {
    console.error("Apillon file upload error:", error);
    throw new Error(`Apillon file upload failed: ${error.response?.data?.message || error.message}`);
  }
};

export const checkApillonConnection = async () => {
  try {
    const response = await axios.get(`${APILLON_API_URL}/storage/info`, {
      headers: {
        Authorization: `Bearer ${APILLON_API_KEY}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getApillonGatewayUrl = (cid) => {
  return `https://ipfs.apillon.io/ipfs/${cid}`;
};
