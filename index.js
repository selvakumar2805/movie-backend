const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./src/routes/user-routes")
const adminRouter = require("./src/routes/admin-routes")
const movieRouter = require("./src/routes/movie-routes")
const bookingsRouter = require("./src/routes/booking-routes")
const cors = require("cors")
const app = express();



// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/movie", movieRouter);
app.use("/api/booking", bookingsRouter);

mongoose.connect(`mongodb+srv://Selva2805:selva28N@details.jt2r7.mongodb.net/`)
    .then(() => app.listen(3400))
    .then(() => console.log("Connected TO Database and Listening TO Localhost 3400"))
    .catch((err) => console.log(err));
   