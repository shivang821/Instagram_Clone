const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const express = require("express");
const app = express();
const User = require("./models/userSchema");
const schedule = require("node-schedule");
const os = require("os");
const cluster = require("cluster");
const status = require("express-status-monitor");

const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoute");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
require("./database/conn");
var j = schedule.scheduleJob("0 0 * * * ",scheduleFunction);
async function scheduleFunction(){
  await User.updateMany({screenTime:{$ne:0}},{screenTime:0})
  console.log('schedule');
}
app.use(status());
// const totalCpus = os.cpus().length;
// if (cluster.isPrimary) {
//   for (let i = 0; i < totalCpus; i++) {
//     cluster.fork();
//   }
// } else {
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
const cookieParser = require("cookie-parser");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
app.use(cors());
app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use(userRoute);
app.use(postRoute);

// app.use(express.static("dist"));
app.listen(4000, (req, res) => {
  console.log("server running on port 4000");
});
// }
