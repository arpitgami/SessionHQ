import mongoose from "mongoose";

let isConnected = false;

export default async function connect() {

    try {
        if (isConnected) {
            console.log("Using existing MongoDB connection.");
            return;
        }

        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            console.error("MONGODB_URL not defined");
            throw new Error("MONGODB_URL not defined in env");
        }
        await mongoose.connect(mongoUrl);
        isConnected = true;

        console.log(" MongoDB connected.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
