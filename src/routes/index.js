const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");

const router = express.Router();


// ==========================================
// STUDENT REGISTER
// ==========================================

router.post("/student/register", async (req, res) => {

    try {

        const {
            name,
            registerNumber,
            email,
            password
        } = req.body;


        if (
            !name ||
            !registerNumber ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }


        const normalizedEmail =
            email.trim().toLowerCase();

        const normalizedRegister =
            registerNumber.trim();


        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(409).json({
                message: "Email already registered."
            });

        }


        const existingStudent =
            await Student.findOne({
                registerNumber: normalizedRegister
            });


        if (existingStudent) {

            return res.status(409).json({
                message:
                    "Register number already registered."
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user =
            await User.create({

                email: normalizedEmail,

                password: hashedPassword,

                role: "student",

                isApproved: true

            });


        await Student.create({

            user: user._id,

            name: name.trim(),

            registerNumber:
                normalizedRegister

        });


        res.status(201).json({

            message:
                "Registration successful!"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Registration failed."

        });

    }

});


// ==========================================
// STUDENT LOGIN
// ==========================================

router.post("/student/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({

                email:
                    email.trim().toLowerCase()

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        if (user.role !== "student") {

            return res.status(403).json({

                message:
                    "This account is not a student account."

            });

        }


        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!validPassword) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        const student =
            await Student.findOne({

                user:
                    user._id

            });


        if (!student) {

            return res.status(404).json({

                message:
                    "Student profile not found."

            });

        }


        res.json({

            message:
                "Login successful!",

            studentId:
                student._id

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            message:
                "Login failed."

        });

    }

});


// ==========================================
// MENTOR LOGIN
// ==========================================

router.post("/mentor/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Please enter email and password."

            });

        }


        const user =
            await User.findOne({

                email:
                    email.trim().toLowerCase()

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        if (user.role !== "mentor") {

            return res.status(403).json({

                message:
                    "This account is not a mentor account."

            });

        }


        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!validPassword) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        const mentor =
            await Mentor.findOne({

                user:
                    user._id

            });


        if (!mentor) {

            return res.status(404).json({

                message:
                    "Mentor profile not found."

            });

        }


        // Mentor is only for CSE

        if (
            mentor.department !== "CSE"
        ) {

            return res.status(403).json({

                message:
                    "This mentor is not assigned to CSE."

            });

        }


        res.json({

            message:
                "Login successful!",

            mentorId:
                mentor._id

        });

    } catch (error) {

        console.error(
            "Mentor login error:",
            error
        );


        res.status(500).json({

            message:
                "Mentor login failed."

        });

    }

});


// ==========================================
// GET CSE STUDENTS FOR MENTOR
// ==========================================

router.get("/mentor/students", async (req, res) => {

    try {

        // Mentor can see ONLY CSE students

        const students =
            await Student.find({
                department: "CSE"
            })
                .select(
                    "name registerNumber department section year skills interests careerGoal academics"
                )
                .sort({
                    name: 1
                });


        res.json(students);

    } catch (error) {

        console.error(
            "Loading CSE students error:",
            error
        );


        res.status(500).json({

            message:
                "Could not load CSE students."

        });

    }

});


// ==========================================
// GET STUDENT PROFILE
// ==========================================

router.get("/student/me/:id", async (req, res) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            ).select("-__v");


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        res.json(student);

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        res.status(500).json({

            message:
                "Could not load profile."

        });

    }

});


// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================

router.put("/student/me/:id", async (req, res) => {

    try {

        const studentId =
            req.params.id;


        const {
            phone,
            personalEmail,
            gender,
            address,
            studentCategory,
            hostelName,
            distanceFromCollege,

            department,
            section,
            year,

            skills,
            interests,

            careerGoal,
            strengths,
            areasForImprovement,

            academics

        } = req.body;


        const student =
            await Student.findById(
                studentId
            );


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        if (phone !== undefined) {
            student.phone = phone || "";
        }


        if (personalEmail !== undefined) {
            student.personalEmail =
                personalEmail || "";
        }


        if (gender !== undefined) {
            student.gender = gender || "";
        }


        if (address !== undefined) {
            student.address = address || "";
        }


        if (studentCategory !== undefined) {
            student.studentCategory =
                studentCategory || "";
        }


        if (hostelName !== undefined) {
            student.hostelName =
                hostelName || "";
        }


        if (distanceFromCollege !== undefined) {

            student.distanceFromCollege =
                distanceFromCollege === null ||
                distanceFromCollege === ""
                    ? null
                    : Number(
                        distanceFromCollege
                    );

        }


        if (department !== undefined) {
            student.department =
                department || "";
        }


        if (section !== undefined) {
            student.section =
                section || "";
        }


        if (year !== undefined) {
            student.year =
                year || "";
        }


        if (skills !== undefined) {

            student.skills =
                Array.isArray(skills)
                    ? skills
                    : [];

        }


        if (interests !== undefined) {

            student.interests =
                Array.isArray(interests)
                    ? interests
                    : [];

        }


        if (careerGoal !== undefined) {
            student.careerGoal =
                careerGoal || "";
        }


        if (strengths !== undefined) {

            student.strengths =
                Array.isArray(strengths)
                    ? strengths
                    : [];

        }


        if (areasForImprovement !== undefined) {

            student.areasForImprovement =
                Array.isArray(
                    areasForImprovement
                )
                    ? areasForImprovement
                    : [];

        }


        if (academics !== undefined) {

            if (!Array.isArray(academics)) {

                return res.status(400).json({

                    message:
                        "Academic details must be an array."

                });

            }


            student.academics =
                academics.map(
                    academic => ({

                        semester:
                            academic.semester || "",

                        cgpa:
                            academic.cgpa === null ||
                            academic.cgpa === "" ||
                            academic.cgpa === undefined
                                ? null
                                : Number(
                                    academic.cgpa
                                ),

                        attendance:
                            academic.attendance === null ||
                            academic.attendance === "" ||
                            academic.attendance === undefined
                                ? null
                                : Number(
                                    academic.attendance
                                ),

                        arrears:
                            academic.arrears === null ||
                            academic.arrears === "" ||
                            academic.arrears === undefined
                                ? 0
                                : Number(
                                    academic.arrears
                                ),

                        performance:
                            academic.performance || ""

                    })
                );

        }


        await student.save();


        res.json({

            message:
                "Profile updated successfully!",

            student:
                student

        });

    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );


        res.status(500).json({

            message:
                "Could not update profile."

        });

    }

});


// ==========================================
// STUDENT LOGOUT
// ==========================================

router.post("/student/logout", (req, res) => {

    res.json({

        message:
            "Logged out successfully."

    });

});


// ==========================================
// MENTOR LOGOUT
// ==========================================

router.post("/mentor/logout", (req, res) => {

    res.json({

        message:
            "Mentor logged out successfully."

    });

});


module.exports = router;