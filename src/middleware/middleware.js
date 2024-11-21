const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Booking = require("../models/Bookings")




const authentication = function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(401).send({ status: false, message: "Token is required" })
        }
        jwt.verify(token, "aman222", function (error, decodedToken) {
            if (error && error.message === 'jwt expired') return res.status(401).send({ status: false, message: 'token expired, please login again' })
            if (error) return res.status(401).send({ status: false, message: 'Invalid token' })
            else {
                req.decodedToken = decodedToken.userId
                next()
            }
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}




const authorisation = async function (req, res, next) {
    try {
        const id = req.params.id
        if (!objectId(id)) return res.status(400).send({ status: false, message: "Id is invalid" })

        let savedData = await Booking.findOne({ _id: id })
        if (!savedData) return res.status(404).send({ status: false, message: 'No such existing books' })
        let userToBeModified = savedData.user.toString()
        let decodedToken = req.decodedToken
        if (decodedToken !== userToBeModified) {
            return res.status(403).send({ status: false, message: "You do not have access rights" })
        }
        req.id = id
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// const authorisation = async function (req, res, next) {
//     try {
//         let tokenUserId = req.tokenUserId
//         let id = req.params.id

//         // console.log(tokenAuthorId)
//         if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ Status: false, msg: "Invalid Blog Id." })

//         let blogData = await Booking.findById(id)

//         if (!blogData) return res.status(400).send({ status: false, msg: "Id is not exist in DB." })

//         // console.log(blogData)

//         let authorInBlog = blogData.authorId

//         // console.log(authorInBlog, blogData.authorId)

//         if (authorInBlog.toString() !== tokenUserId.toString()) return res.status(403).send({ status: false, msg: "Unauthorize person , forbidden" })

//         next()
//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send({ status: false, msg: err.message })
//     }
// }


module.exports = { authentication, authorisation }