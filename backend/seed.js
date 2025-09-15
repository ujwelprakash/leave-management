import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    const users = [
      {
        name: "Alice Employee",
        email: "alice@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "Employee",
        profileImage:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e", // professional female headshot
      },
      {
        name: "Bob Employee",
        email: "bob@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "Employee",
        profileImage:
          "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1", // professional male headshot
      },
      {
        name: "Tom TeamLead",
        email: "tom@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "Team Lead",
        profileImage:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6", // business professional male
      },
      {
        name: "Paul ProjectLead",
        email: "paul@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "Project Lead",
        profileImage:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", // smiling male in shirt
      },
      {
        name: "Helen HR",
        email: "helen@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "HR",
        profileImage:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", // HR-style female portrait
      },
      {
        name: "Victor CEO",
        email: "victor@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "CEO",
        profileImage:
          "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1", // CEO in suit
      },
    ];

    await User.insertMany(users);
    console.log("✅ Seeded users with professional profile images");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
