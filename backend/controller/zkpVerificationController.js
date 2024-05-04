import zkpService from '../service/zkpVerificationService.js';

export const verifyZkp= async (req, res, next) => {
  try {
    let proof = req.body.proof;
    //console.log('proof', proof)
    let ret = await zkpService.verifyZkp(proof);

    if (ret) {
      // res.status(200).send(result);
      res.status(200).send(ret);
    } else {
      let result = {
        message: 'Verificaiton failed'
      }

      res.status(400).send(result);
    }
  } catch (err) {
    next(err)
  }
}

