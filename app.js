const express = require("express");
const app = express();
const cors = require("cors");
const Config = require("./src/config/server.config");
const mongoose = require("mongoose");

// Configuration
var port = Config.port;
var host = Config.host;
const url = Config.dbUrl;

//Connect to the db
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;

//checking the db connection
db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Db connected......");
});

//Import Routes
const product = require("./src/route/product.route");
const category = require("./src/route/category.route");
const gallery = require("./src/route/gallery.route");
const seo = require("./src/route/seo.route");

//MiddleWare
const whitelist = ['http://localhost:3000','https://leafedindia.web.app', 'https://app.tooljet.com/applications/cf62da44-7932-4ead-b7b6-0664a8fe18fa'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/product", product);
app.use("/category", category);
app.use("/gallery", gallery);
app.use("/seo", seo);


app.get("/", function (req, res) {
  res.send("<p>hello welcome to LeafedIndia backend</p>");
});

//Listening to the server
app.listen(port, host, function () {
  console.log(`Server is running on Host: ${host}:${port}`);
});
