import * as express from 'express';
import { createConnection } from 'typeorm';
import { Task } from '../src/app/entities/task.entity';
import * as bodyParser from 'body-parser';

const app: express.Application = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'todo_list',
  entities: [Task],
  synchronize: true,
  logging: true
}).then(async connection => {
  console.log('Database connected successfully');
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Database connection failed', error);
});

// GET /api/tasks - Get all tasks
app.get('/api/tasks', async (req, res) => {
  const taskRepository = connection.getRepository(Task);
  const tasks = await taskRepository.find({
    order: {
      orderIndex: 'ASC'
    }
  });
  res.json(tasks);
});

// POST /api/tasks - Add a new task
app.post('/api/tasks', async (req, res) => {
  const taskRepository = connection.getRepository(Task);
  const newTask = taskRepository.create({
    name: req.body.name,
    orderIndex: await taskRepository.count()
  });
  const result = await taskRepository.save(newTask);
  res.json(result);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskRepository = connection.getRepository(Task);
  await taskRepository.delete(req.params.id);
  res.status(204).send();
});

// PATCH /api/tasks/:id/order - Update task order
app.patch('/api/tasks/:id/order', async (req, res) => {
  const taskRepository = connection.getRepository(Task);
  await taskRepository.update(req.params.id, { orderIndex: req.body.orderIndex });
  const updatedTask = await taskRepository.findOne(req.params.id);
  res.json(updatedTask);
});