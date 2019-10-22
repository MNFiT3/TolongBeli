require('dotenv').config({});
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import * as path from "path";

const PORT = process.env.PORT || 3001;
const webURL = "web";

createConnection()
  .then(async connection => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.status(301).redirect(fullUrl + webURL)
    })

    if(process.env.NODE_ENV.trim() === "production"){
      app.use('/' + webURL, express.static(path.join(__dirname, '../', 'src', 'public')));
    }else{
      app.use('/' + webURL, express.static(path.join(__dirname, 'public')));
    }

    app.use("/api", routes);

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  })
  .catch(error => console.log(error));
