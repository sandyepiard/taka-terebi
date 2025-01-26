import express from "express";
import cors, { CorsRequest } from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import digimonRouter from "./src/features/digimon-fandom/routers/digimon.router.js";
import imageRouter from "./src/shared/image/routers/image.router.js";
import khinsiderRouter from "./src/features/khinsider/routers/khinsider.router.js";

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

// const corsOptions = {
//   origin: "http://localhost:4200/",
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// const whitelist = ["http://localhost:4200"];

// const corsOptionsDelegate = (req: CorsRequest, callback: Function) => {
//   console.log(1);
//   const origin = req.headers.origin ?? "";
//   const isOriginInWhiteList = whitelist.indexOf(origin) !== -1;

//   const corsOptions = isOriginInWhiteList
//     ? { origin: true }
//     : { origin: false };

//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

// app.use(cors(corsOptionsDelegate));

// app.use(
//   cors({
//     origin: "http://localhost:4200",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Origin",
//       "x-access-token",
//       "XSRF-TOKEN",
//     ],
//     preflightContinue: false,
//   })
// );

const router = express.Router();

router.use(digimonRouter);
router.use(khinsiderRouter);
router.use(imageRouter);

app.use("/api", jsonParser, router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
