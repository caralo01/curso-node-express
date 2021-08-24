const { response, request } = require('express');

const validPageAndLimit = (req = request, res = response, next) => {
  
  const { limit = 5, page = 0 } = req.query;

  const errors = [];

  if(isNaN(limit)){
    errors.push({msg: "Limit must be a number"});
  } 
  
  if(isNaN(page)) {
    errors.push({msg: "Page must be a number"});
  }
  
  if(errors.length) {
    return res.status(400).json(errors);
  }
  
  next();

}

module.exports = {
  validPageAndLimit
}