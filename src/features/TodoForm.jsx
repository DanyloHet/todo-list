import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        ref={todoTitleInput}
        value={workingTodoTitle}
      ></TextInputWithLabel>
      <button type="submit" disabled={!workingTodoTitle.length}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
