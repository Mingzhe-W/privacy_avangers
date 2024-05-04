import { verifyCloudProof } from '@worldcoin/idkit'
import e from 'express'

async function verifyWorldID(proof, res){
  //return new Promise((resolve, reject) => {
  //console.log("Received request to verify credential:\n", req.body);
  const reqBody = {
    nullifier_hash: proof.nullifier_hash,
    merkle_root: proof.merkle_root,
    proof: proof.proof,
    verification_level: proof.verification_level,
    action: "chatbot-login"
    //signal: proof.signal
  };
  console.log('reqBody', reqBody);
  const app_id = "app_staging_63f91c3fd5c7f9c8651ed30c4a6ce321"
  const verifyEndpoint = "https://developer.worldcoin.org/api/v1/verify/" + app_id;
  fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  }).then((verifyRes) => {
    verifyRes.json().then((wldResponse) => {
      console.log(
        `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
        wldResponse
      );
      if (verifyRes.status == 200) {
        // This is where you should perform backend actions based on the verified credential, such as setting a user as "verified" in a database
        // For this example, we'll just return a 200 response and console.log the verified credential
        console.log(
          "Credential verified! This user's nullifier hash is: ",
          wldResponse.nullifier_hash
        );
        res.status(verifyRes.status).send({
          code: 200,
          detail: "This action verified correctly!",
        });
        //   resolve(void 0);
      } else {
        // This is where you should handle errors from the World ID /verify endpoint. Usually these errors are due to an invalid credential or a credential that has already been used.
        // For this example, we'll just return the error code and detail from the World ID /verify endpoint.
        res
          .status(verifyRes.status)
          .send({ code: wldResponse.code, detail: wldResponse.detail });
      }
    });
  });
  //   });
}


export default {
  verifyWorldID
}