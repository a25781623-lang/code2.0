import { ethers } from "ethers";
import CONTRACT_ABI from "../abis/CertificateRegistry.json";
import { CONTRACT_ADDRESS, PROVIDER_URL } from "../constants";

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return new ethers.providers.JsonRpcProvider(PROVIDER_URL);
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const connectWallet = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return { success: true, address, signer, provider };
    } else {
      return { success: false, error: "MetaMask not installed" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkNetwork = async () => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const expectedChainId = parseInt(process.env.REACT_APP_NETWORK_ID);
    
    if (network.chainId !== expectedChainId) {
      return {
        success: false,
        error: `Wrong network. Please switch to ${process.env.REACT_APP_NETWORK_NAME}`,
        currentChainId: network.chainId,
        expectedChainId
      };
    }
    return { success: true, network };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
