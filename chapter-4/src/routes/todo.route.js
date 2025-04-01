import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {

    // Check if user exists
const userExists = await prisma.user.findUnique({
    where: { id: req.userId }
  });
  
  if (!userExists) {
    return res.status(400).json({ error: "User not found" });
  }

    const todos = await prisma.todo.findMany({
        where : {
            userId: req.userId
        }
    });
    res.json(todos);
});
 
// Create a new todo
router.post('/', async (req, res) => {
    const { task }  = req.body;

    // Check if user exists
const userExists = await prisma.user.findUnique({
    where: { id: req.userId }
  });
  
  if (!userExists) {
    return res.status(400).json({ error: "User not found" });
  }

    const todo = await prisma.todo.create({
        data:{
            task, 
            userId: req.userId
        }
    });
    res.json(todo);
}); 

// Update a todo
router.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    });

    res.json(updatedTodo);
})

// Delete a todo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req;
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    });
    res.json({
        message: 'Todo Deleted'
    })
})

export default router;