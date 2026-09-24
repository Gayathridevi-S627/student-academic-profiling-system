const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        registerNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        department: {
            type: String,
            default: ""
        },

        section: {
            type: String,
            default: ""
        },

        year: {
            type: String,
            default: ""
        },

        gender: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        personalEmail: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        studentCategory: {
            type: String,
            default: ""
        },

        hostelName: {
            type: String,
            default: ""
        },

        distanceFromCollege: {
            type: Number,
            default: null
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        strengths: {
            type: [String],
            default: []
        },

        areasForImprovement: {
            type: [String],
            default: []
        },

        careerGoal: {
            type: String,
            default: ""
        },

        academics: {
            type: [
                {
                    semester: {
                        type: String,
                        default: ""
                    },

                    cgpa: {
                        type: Number,
                        default: null
                    },

                    attendance: {
                        type: Number,
                        default: null
                    },

                    arrears: {
                        type: Number,
                        default: 0
                    },

                    performance: {
                        type: String,
                        default: ""
                    }
                }
            ],
            default: []
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Student",
    studentSchema
);