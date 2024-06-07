const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const registrationRouter = require("./router/registration");
const suraqJauapRouter = require("./router/suraqjauap");
const userProgressRouter = require("./router/userProgress");
const newsRouter = require("./router/news");
const maqalDropRouter = require("./router/maqalDrop");
const profileRouter = require("./router/profile");
const taldaRouter = require("./router/talda");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", registrationRouter);
app.use("/", userProgressRouter);
app.use("/api/maqal", maqalDropRouter);
app.use("/api/post", newsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/talda", taldaRouter);
app.use("/api/sj", suraqJauapRouter);

app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect("mongodb+srv://soilsesay:soilsay123@soilesay.qtvrxci.mongodb.net/SoileSay",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Start server
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
