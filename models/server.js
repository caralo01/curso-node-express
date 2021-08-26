const express = require("express");
const cors = require("cors");

const AuthRouter = require("../routes/auth");
const CategoryRouter = require("../routes/category");
const UserRouter = require("../routes/user");

const Config = require("../database/config");
const ProductRouter = require("../routes/product");
const SearchRouter = require("../routes/search");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.authRouter = new AuthRouter();
    this.categoryRouter = new CategoryRouter();
    this.productRouter = new ProductRouter();
    this.searchRouter = new SearchRouter();
    this.userRouter = new UserRouter();
    this.path = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
    };

    // Conectar BD
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicación
    this.routes();
  }

  async conectarDB() {
    this.config = new Config();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Parseo y lectura body
    this.app.use(express.json());

    // Directorio Publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.path.auth, this.authRouter.getRouter());
    this.app.use(this.path.categories, this.categoryRouter.getRouter());
    this.app.use(this.path.products, this.productRouter.getRouter());
    this.app.use(this.path.search, this.searchRouter.getRouter());
    this.app.use(this.path.users, this.userRouter.getRouter());
  }

  start() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
