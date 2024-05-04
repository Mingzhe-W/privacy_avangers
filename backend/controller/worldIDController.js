import worldIDService from '../service/worldIDService.js';


export const verifyWorldID = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    let proof = JSON.parse(req.body.proof);
    //console.log('proof', proof)
    let ret = await worldIDService.verifyWorldID(proof,res);

  //   console.log('controller', ret);
  //   ret.then((response) => {
  //     console.log('response', response);
  //     response.then((wldResponse) => {
  //     console.log('wldresponse', wldResponse);
  //     if (response.status == 200) {
  //       res.status(response.status).send({
  //         code: "success",
  //         detail: "This action verified correctly!",
  //       });
  //     }else {
  //       res
  //         .status(response.status)
  //         .send({ code: wldResponse.code, detail: wldResponse.detail });
  //     }
  //     });
  //   });
  

  // //   if (ret.success) {
  // //     // let result = {
  // //     //   data: ret,
  // //     // }
  // //     // res.status(200).send(result);
  // //     res.status(200).send(ret);
  // //   } else {
  // //     res.status(400).send(ret);
  // //   }
  } catch (err) {
    next(err)
  }
}

