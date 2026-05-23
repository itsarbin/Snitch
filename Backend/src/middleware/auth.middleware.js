import jwt from 'jsonwebtoken';
import Config from '../config/config.js';

import userModel from '../model/user.model.js';

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, Config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'please login again' })
        }
        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Forbidden' })
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'unauthorized' })
    }
}

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, Config.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ message: 'please login again' })
    }
    req.user = user;
    next();
}