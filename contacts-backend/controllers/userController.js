const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
// bcrypt library
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    // grab details from the request body
    const { username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    // check for existing user, if user is already there we throw error
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered :(");
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password is: ", hashPassword);
    const user = await User.create({
        username,
        email,
        password: hashPassword,
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({ _id: user.id, email: user.email}); // password isnt returned
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the User"})
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    // get email and password from request body
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are madnatory");
    }

    const user = await User.findOne({ email });
    // compare password with the hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
        // create access token
        const accessToken = jwt.sign({
            // payload for jwt
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m"}
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    res.json({ message: "Login the User"})
});

//@desc Current user
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports = { registerUser, loginUser, currentUser };