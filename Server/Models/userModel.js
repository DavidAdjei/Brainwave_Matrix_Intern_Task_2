import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        select: false,
    },
    image: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastSignIn: {
        type: Date,
        default: null
    },
    savedBlogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog',
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    preferences: {
        comments : {
            type: Boolean,
            default: true
        },
        likes : {
            type: Boolean,
            default: true
        },
        newBlogs : {
            type: Boolean,
            default: true
        },
        follower : {
            type: Boolean,
            default: true
        },
        emails:{
            type: Boolean,
            default: false,
        },
        newsletter: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (err) {
        throw err;
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password);
};


export default model('User', UserSchema);
