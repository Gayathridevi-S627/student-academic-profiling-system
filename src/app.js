require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Mentor = require("./models/Mentor");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// CHECK ENVIRONMENT VARIABLES
// ==========================================

if (!process.env.MONGODB_URI) {

    console.error("MONGODB_URI is missing");
    process.exit(1);

}

if (!process.env.SESSION_SECRET) {

    console.error("SESSION_SECRET is missing");
    process.exit(1);

}


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    session({

        name: "connect.sid",

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge: 2 * 60 * 60 * 1000

        }

    })
);


// ==========================================
// STATIC FILES
// ==========================================

app.use(
    express.static(
        path.join(__dirname)
    )
);


// ==========================================
// ROUTES
// ==========================================

const routes = require("./routes");

app.use("/api", routes);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});


// ==========================================
// PING
// ==========================================

app.get("/ping", (req, res) => {

    res.send("pong");

});


// ==========================================
// CREATE DEFAULT MENTOR SILENTLY
// ==========================================

async function createDefaultMentor() {

    const mentorEmail =
        "mentor@example.com";

    const mentorPassword =
        "mentor123";


    const existingUser =
        await User.findOne({
            email: mentorEmail
        });


    // Mentor already exists

    if (existingUser) {

        return;

    }


    const hashedPassword =
        await bcrypt.hash(
            mentorPassword,
            10
        );


    const user =
        await User.create({

            email: mentorEmail,

            password: hashedPassword,

            role: "mentor",

            isApproved: true

        });


    await Mentor.create({

        user: user._id,

        name: "Dr. Priya",

        employeeId: "M001",

        department: "CSE"

    });

}


// ==========================================
// CONNECT MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(async () => {

        console.log("MongoDB connected");


        await createDefaultMentor();


        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:"
        );

        console.error(
            error.message
        );

        process.exit(1);

    });