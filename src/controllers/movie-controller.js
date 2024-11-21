const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Admin = require("../models/Admin")
const Movie = require("../models/Movie")

const addMovie = async (req, res) => {
  try {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if (!extractedToken) return res.status(404).json({ message: "Token Not Found" });

    let adminId;

    // verify token
    jwt.verify(extractedToken, "aman222", (err, decrypted) => {
      if (err) {
        return res.status(400).json({ message: `${err.message}` });
      } else {
        adminId = decrypted.id;
        return;
      }
    });

    //create new movie
    const { title, description, releaseDate, posterUrl, featured, actors } = req.body;
    if (!title && title.trim() === "" && !description && description.trim() == "" && !posterUrl && posterUrl.trim() === "") return res.status(422).json({ message: "Invalid Inputs" });


    let movie = new Movie({ description, releaseDate: new Date(`${releaseDate}`), featured, actors, admin: adminId, posterUrl, title, });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();


    if (!movie) return res.status(500).json({ message: "Request Failed" });

    return res.status(201).json({ movie });
  } catch (err) {
    return console.log(err);
  }
};



const getAllMovies = async (req, res) => {

  try {
    let movies = await Movie.find();

    if (!movies) return res.status(404).json({ message: "Request Failed" });

    return res.status(200).json({ movies });
  }
  catch (err) {
    return console.log(err);
  }
};



const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Id not valid" })
    let isIdExist = await Movie.findById(id)
    if (!isIdExist) return res.status(404).json({ message: "Id not Exist" })

    let movie = await Movie.findById(id);

    if (!movie) return res.status(404).json({ message: "Invalid Movie ID" });

    return res.status(200).json({ movie });
  } catch (err) {
    return console.log(err);
  }
};


module.exports = { addMovie, getAllMovies, getMovieById, }