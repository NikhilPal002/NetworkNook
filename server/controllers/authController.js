import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName,
            email, password,
            picturePath, friends,
            location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


/* Login */
export const login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "Invalid Credentials"));
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token).status(200).json(rest);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
