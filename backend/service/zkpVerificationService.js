// interact.js
import { ethers } from 'ethers';
import contract from "../abi/contractAbi.json" assert { type: "json" };

// Provider
const alchemyProvider = new ethers.getDefaultProvider('sepolia', {
  alchemy: process.env.API_URL,
});

const verifyZkp = async function (proof) {
  const instances = [2,2,3,4,4,2,0,4,0,1,5,2,0,4,0,0,5,2,2,4,4,4,5,4,3,4,5,3,2,0,3,2,2,0,0,0,1]

  try {
    // Signer
    // const contract = require("../abi/contractAbi.json");
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, alchemyProvider);

    // Contract
    const contractInstance = new ethers.Contract(process.env.CONTRACT_ADDRESS, contract, signer);

    let success = await contractInstance.verify(instances, proof);

    let result = {
      verificationResult: success,
      contractAddress: process.env.CONTRACT_ADDRESS
    }

    console.log('verify zkp result', result)

    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

export default {
  verifyZkp
}