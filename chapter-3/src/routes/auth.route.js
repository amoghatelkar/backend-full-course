import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);
    try {
        const inserUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?,?) `);
        const result = inserUser.run(username, hashPassword);   
        const defaultTodo = `Hello here is your first todo`;
        const insretTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?) `);
            
        insretTodo.run(result.lastInsertRowid, defaultTodo);

        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, { expiresIn:'24h'});
        return res.status(201).json({
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(503);
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = getUser.get(username);

        if(!user) {
            return res.status(404).send({message: 'User not found'});
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        
        if(!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,  {expiresIn:'24h'});

        res.send({
            token
        });

    } catch (error) {
        console.error(error);
        return res.send(503);
    }
});

export default router;