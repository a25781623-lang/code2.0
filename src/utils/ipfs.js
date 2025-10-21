import axios from "axios";
import { IPFS_GATEWAY } from "../constants";

export const fetchFromIpfs = async (cid) => {
  const gateways = [
    `${IPFS_GATEWAY}${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.apillon.io/ipfs/${cid}`
  ];

  for (let gateway of gateways) {
    try {
      console.log(`Trying gateway: ${gateway}`);
      const response = await axios.get(gateway, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error.message);
    }
  }
  
  throw new Error(`All IPFS gateways failed for CID: ${cid}`);
};

export const fetchFileFromIpfs = async (cid) => {
  const gateways = [
    `${IPFS_GATEWAY}${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.apillon.io/ipfs/${cid}`
  ];

  for (let gateway of gateways) {
    try {
      console.log(`Trying file gateway: ${gateway}`);
      const response = await axios.get(gateway, { 
        timeout: 15000,
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      console.warn(`File gateway ${gateway} failed:`, error.message);
    }
  }
  
  throw new Error(`All IPFS gateways failed for file CID: ${cid}`);
};

export const validateCid = (cid) => {
  // Basic CID validation
  if (!cid || typeof cid !== 'string') return false;
  
  // CIDv1 starts with 'b' or CIDv0 starts with 'Qm'
  return cid.startsWith('Qm') || cid.startsWith('b');
};

export const getMultipleGatewayUrls = (cid) => {
  return [
    { name: "Primary", url: `${IPFS_GATEWAY}${cid}` },
    { name: "IPFS.io", url: `https://ipfs.io/ipfs/${cid}` },
    { name: "Cloudflare", url: `https://cloudflare-ipfs.com/ipfs/${cid}` },
    { name: "Pinata", url: `https://gateway.pinata.cloud/ipfs/${cid}` },
    { name: "Apillon", url: `https://ipfs.apillon.io/ipfs/${cid}` }
  ];
};
