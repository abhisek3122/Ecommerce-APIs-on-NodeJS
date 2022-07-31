let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mongoConnection = "mongodb+srv://dbUser:mayonData@cluster0.ghnyx.mongodb.net/dbUser?retryWrites=true&w=majority"; //MongoAtlas Connect String
                      //"mongodb://localhost:27017/loyalty-app"; - Use this statement when you host mongodb on localhost

mongoose.connect(
  mongoConnection,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    if (err) console.log(err);
    else console.log("Db Connected");
  }
);
module.exports = { mongoose };
