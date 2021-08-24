const moongose = require('mongoose');

class Config {
  constructor() {
    this.dbConnection();
  }

  async dbConnection() {
    try {
      await moongose.connect(process.env.MONGO_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });

      console.log("Base de datos conectada");
    } catch(error) {
      console.log(error);
      throw new Error("Error a la hora de iniciar la BD")
    }
  }
}

module.exports = Config;