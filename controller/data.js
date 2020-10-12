const Company = require('../model/companies');

exports.getCompanyList = (req, res, next) => {
    Company.find()
      .sort({ _id: -1 })
      .then((result) => {
        res.status(200).json({
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          error: err,
        });
      });
  };