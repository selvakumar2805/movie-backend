const mongoose = require("mongoose")
const Bookings = require("../models/Bookings")
const Movie = require("../models/Movie")
const User = require("../models/User")



const newBooking = async (req, res) => {
  try {

    const data = req.body
    const { movie, date, seatNumber, user } = data

    if (!mongoose.Types.ObjectId.isValid(user)) return res.status(404).json({ message: "User Id not valid" })
    if (!mongoose.Types.ObjectId.isValid(movie)) return res.status(404).json({ message: "Movie Id not valid" })

    let existingMovie = await Movie.findById(movie);
    let existingUser = await User.findById(user);

    if (!existingMovie) return res.status(404).json({ message: "Movie Not Found With Given ID" });

    if (!existingUser) return res.status(404).json({ message: "User not found with given ID " });

    let booking = new Bookings({ movie, date: new Date(`${date}`), seatNumber, user, });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();

    if (!booking) return res.status(500).json({ message: "Unable to create a booking" })

    return res.status(201).json({ booking });
  }

  catch (err) {
    return res.status(500).json({ message: err.message })
  }
};


const getBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    let booking = await Bookings.findById(id);

    if (!booking) {
      return res.status(500).json({ message: "Unexpected Error" });
    }
    return res.status(200).json({ booking });
  } catch (err) {
    return console.log(err);
  }
};



const deleteBooking = async (req, res) => {
  try {

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Booking Id not valid" })
    let isIdExist = await Bookings.findById(id)
    if(!isIdExist) return res.status(404).json({message : "Id not Exist"})

    let booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    console.log(booking);

    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();

    if (!booking) return res.status(500).json({ message: "Unable to Delete" });

    return res.status(200).json({ message: "Successfully Deleted" });
  }
  catch (err) {
    return res.status(500).json({ message: err.message })
  }
};

module.exports = { deleteBooking, getBookingById, newBooking, }