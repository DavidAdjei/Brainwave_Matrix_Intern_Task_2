import User from '../Models/userModel.js';
import { generateToken } from '../Utils/auth.js';

const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!password) throw new Error("Password is required");
        const user = await User.create({ firstName, lastName, username, email, password });
        if (!user) throw new Error("User creation error");
        res.status(201).json({ message: "User created successfully, login" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { identity, password } = req.body;
        const user = await User.findOne({ email: identity }).select('+password');
        if (!user) throw new Error('User not found');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error('Invalid credentials');

        const now = new Date();
        user.lastSignIn = now;
        await user.save();


        const token = generateToken(user);
        user.password = undefined;
        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
};


const googleAuth = async (req, res) => {
    try {
        const { googleUser } = req.body;
        if (!googleUser || !googleUser.email) throw new Error('Invalid Google user data');

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = await User.create({
                email: googleUser.email,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                image: googleUser.picture
            });
        }

        const now = new Date();

        user.lastSignIn = now;
        await user.save();

        user.password = undefined;
        user.secret = undefined;

        const token = generateToken(user);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const isAuth = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) throw new Error("Unauthorized");

        const user = await User.findById(userId).populate({
            path: "savedBlogs",
            populate: {
                path: "author",
                select: 'firstName lastName email image _id username'
            }
        }).populate({
            path: "followers",
            select: "firstName lastName email image _id username"
        }).populate({
            path: "following",
            select: "firstName lastName email image _id username"
        });

        if (!user) throw new Error("User not found");

        const now = new Date();

        user.lastSignIn = now;
        await user.save();

        user.password = undefined;
        user.secret = undefined;

        return res.json({ message: "Authenticated", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) throw new Error("Unauthorized");

        const user = await User.findById(userId).populate({
            path: "followers",
            select: "firstName lastName email image _id username"
        }).populate({
            path: "following",
            select: "firstName lastName email image _id username"
        });;

        if (!user) throw new Error("User not found");

        user.password = undefined;
        user.secret = undefined;

        return res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

const followUser = async (req, res) => {
    try {
        const { userId } = req;
        const userToFollowId = req.params.id;

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        const userToFollow = await User.findById(userToFollowId);

        if (!userToFollow) throw new Error("User to follow not found");

        if (user.following.includes(userToFollowId)) {
            console.log("Already following");
            user.following = user.following.filter(id => id.toString() !== userToFollowId.toString());
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== userId.toString());
            await user.save();
            await userToFollow.save();
        } else {
            console.log("Following")
            user.following.unshift(userToFollowId);
            userToFollow.followers.unshift(userId);
            await user.save();
            await userToFollow.save();
        }
        return res.json({ message: "Followed" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

const editUser = async (req, res) => {
    try {
        const { userId } = req;
        const { changes } = req.body;
        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");
        
        Object.keys(changes).forEach(key => {
            if (user[key] !== undefined) {
                user[key] = changes[key];
            }
        });
        await user.save();

        return res.status(200).json({ message: "User updated" });
    } catch (er) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const changePassword = async (req, res) => {
    try{
        const {userId} = req;
        const {details} = req.body;

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        const match = user.comparePassword(details.currentPassword);

        if(!match) throw new Error("Password incorrect");

        user.password = details.newPassword;

        await user.save();

        return res.status(200).json({message: "Password Changed"});
    }catch(err){
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export { register, login, googleAuth, isAuth, getUser, followUser, editUser, changePassword };
