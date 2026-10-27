const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false }
];

// GET All - Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// BONUS: GET /todos/active - filter !completed
// MUST BE BEFORE /:id or Express thinks "active" is an id
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active);
});

// Existing: GET completed (you already had this)
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

// TASK 1: GET /todos/:id - single read
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// TASK 2: POST New - Create with Validation
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: POST requires "task" field
  if (!task || task.toString().trim() === '') {
    return res.status(400).json({ error: '"task" field is required' });
  }

  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task: task.trim(),
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update - Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(204).send();
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
