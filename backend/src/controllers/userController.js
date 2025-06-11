import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        
        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(400).json({message:"Username already exists"})
        }

        const newUser = new User({username,password});
        await  newUser.save();

        res.status(201).json({message:"User succesfully created"});


    } catch (error) {
        console.log("Register error", error);
        res.status(500).json({message:"Server error during registraion"});
    }


};


export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 365 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
