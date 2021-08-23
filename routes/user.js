const { Router } = require("express");
const UserController = require('../controllers/user');

class UserRoutes {

  constructor() {

    this.router = Router();
    this.userController = new UserController();

    this.initRouter();
  }

  initRouter() {

    this.router.get('/', this.userController.getUsers);
    
    this.router.post('/', this.userController.postUser);
    
    this.router.put('/:id', this.userController.putUser);
    
    this.router.patch('/:id', this.userController.patchUser);
    
    this.router.delete('/:id', this.userController.deleteUser);

  }

  getRouter() {
    return this.router;
  }
  
}
module.exports = UserRoutes;
