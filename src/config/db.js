const mongoose =require('mongoose')


function connectDb() {
    mongoose.connect(process.env.MONGO_URI)
    console.log("Mongoose Connected");
}


module.exports =connectDb