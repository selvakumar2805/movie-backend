const express = require("express")

let  {deleteUser,getAllUsers,getBookingsOfUser,getUserById,login,singup,updateUser } = require("../controllers/user-controller")

const userRouter = express.Router();


userRouter.post("/signup", singup); // call - 2
userRouter.post("/login", login); // call - 2
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById); // call - 7
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/bookings/:id", getBookingsOfUser); // call - 8

module.exports = userRouter;