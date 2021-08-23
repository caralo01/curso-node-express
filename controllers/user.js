const { response, request } = require('express');

class UserController {

  constructor() {}
  
  getUsers(req = request, res = response) {

    const { q, name, apiKey } = req.query


    res.json({
      msg: 'get Api - Users',
      q, 
      name, 
      apiKey
    })
  }
  
  postUser(req = request, res = response) {
    const { name, age } = req.body;

    res.json({
      msg: 'post Api - Users',
      name,
      age
    })
  }
  
  putUser(req = request, res = response) {

    const id = req.params.id;

    res.json({
      msg: 'put Api - Users',
      id
    })
  }
  
  patchUser(req = request, res = response) {
    res.json({
      msg: 'patch Api - Users'
    })
  }
  
  deleteUser(req = request, res = response) {
    res.json({
      msg: 'delete Api - Users'
    })
  }

}

module.exports = UserController;