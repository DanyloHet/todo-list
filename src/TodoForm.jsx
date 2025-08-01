import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    if (!title.trim()) return;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  };
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" name="title" ref={todoTitleInput} id="todoTitle" />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
