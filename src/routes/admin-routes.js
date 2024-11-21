const express = require("express")
let {addAdmin,adminLogin,getAdminById,getAdmins,} = require("../controllers/admin-controller")

const adminRouter = express.Router();


adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);// call - 3
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById); // call - 9

module.exports = adminRouter;