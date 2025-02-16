const mongoose = require("mongoose");
const express = require("express");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true, unique: true,
            trim: true
        },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category