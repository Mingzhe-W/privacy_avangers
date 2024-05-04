import worldIDService from '../service/worldIDService.js';

export const verifyWorldID = async (req, res, next) => {
  try {
    let proof = req.body.proof
    let ret = await worldIDService.verifyWorldID(proof)

    console.log('controller', ret)

    if (ret.success) {
      // let result = {
      //   data: ret,
      // }
      // res.status(200).send(result);
      res.status(200).send(ret);
    } else {
      res.status(400).send(ret);
    }
  } catch (err) {
    next(err)
  }
};

