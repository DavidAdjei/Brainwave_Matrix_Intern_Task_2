import { Schema, model } from 'mongoose';

const blacklistedTokenSchema = new Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const BlacklistedToken = model('BlacklistedToken', blacklistedTokenSchema);

export default BlacklistedToken;
