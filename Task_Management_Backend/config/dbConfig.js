require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");

// Get MongoDB credentials from .env
const MONGO_URI = process.env.MONGO_DB_URL.replace("yourDatabaseName", process.env.MONGO_DB_DATABASE_NAME);

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("-----MONGO DB CONNECTED-----");
    } catch (err) {
        console.error("-----MONGO_DB NOT CONNECTED-----");
        console.error(err.message);
    }
};

connectToDb();
