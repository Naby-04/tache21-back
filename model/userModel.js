const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = new mongoose.Schema(
  {
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // role: {
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user",
    // },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg", // Tu peux aussi mettre une URL par défaut ici
    },
     
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// generer le token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );
};
// refresh

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// hasher le mot de passe 
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
