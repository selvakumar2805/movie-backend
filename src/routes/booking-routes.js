// import express from "express";
const express = require("express")
const middleware = require("../middleware/middleware")
let {
  deleteBooking,
  getBookingById,
  newBooking,
} = require("../controllers/booking-controller")

const bookingsRouter = express.Router();

bookingsRouter.get("/:id",middleware.authentication, getBookingById); // authentication
bookingsRouter.post("/",  middleware.authentication, newBooking); // call - 5 // authentication 
bookingsRouter.delete("/:id", middleware.authentication,  deleteBooking); //call - 6 authentication authorization


module.exports = bookingsRouter;