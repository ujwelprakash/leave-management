import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // bcrypt hashed
    role: {
      type: String,
      enum: ["Employee", "Team Lead", "Project Lead", "HR", "CEO"],
      default: "Employee",
    },
    profileImage: { type: String }, // avatar / profile picture
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;
