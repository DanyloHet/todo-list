import './App.css';
import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      title: title,
    };
    setTodoList([...todoList, newTodo]);
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
