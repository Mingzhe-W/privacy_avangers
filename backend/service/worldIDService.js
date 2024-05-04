import { verifyCloudProof } from '@worldcoin/idkit'

const verifyWorldID = async function (proof) {
  const app_id = "app_staging_63f91c3fd5c7f9c8651ed30c4a6ce321"
  const action = "chatbot-login"
  const verifyRes = await verifyCloudProof(proof, app_id, action)

  return verifyRes
}

export default {
  verifyWorldID
}