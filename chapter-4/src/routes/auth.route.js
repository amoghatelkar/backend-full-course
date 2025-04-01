import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);

    const existingUser = await prisma.user.findUnique({
        where: { username: req.body.username }
    });

    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    try {

        const user = await prisma.user.create({
            data: {
                username,
                password: hashPassword
            }
        })
        const defaultTodo = `Hello here is your first todo`;

        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id,
                completed: !!0
            }
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(201).json({
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(503);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.send({
            token
        });

    } catch (error) {
        console.error(error);
        return res.send(503);
    }
});

export default router;