const express = require("express");
const cors = require("cors");

const UserRouter = require("../routes/user");


class Server {

  
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userRouter = new UserRouter();
    this.usersPath = '/api/users';
    
    // Middlewares
    this.middlewares();

    // Rutas de la aplicación
    this.routes();

  }

  middlewares() {
    
    // CORS
    this.app.use(cors());
    
    // Parseo y lectura body
    this.app.use(express.json());

    // Directorio Publico
    this.app.use(express.static('public'));

  }

  routes() {
    this.app.use(this.usersPath, this.userRouter.getRouter());
  }

  start() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;