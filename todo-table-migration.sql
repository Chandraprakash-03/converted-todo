-- PostgreSQL migration for todo table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for better performance on text field
CREATE INDEX IF NOT EXISTS idx_todo_text ON todos(text);

-- Create an index for filtering by completion status
CREATE INDEX IF NOT EXISTS idx_todo_completed ON todos(completed);