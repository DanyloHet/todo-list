import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodos = todoList.filter((todo) => !todo.isCompleted);
  return (
    <>
      {!filteredTodos.length ? (
        <p>Add a todo above to get started</p>
      ) : (
        <ul>
          {filteredTodos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
