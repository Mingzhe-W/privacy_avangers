import dataService from '../service/dataService.js';

export const getData = async (req, res, next) => {
  try {
    let data = await dataService.getData(req);
    res.status(200).send(data);
  } catch (err) {
    next(err)
  }
};

