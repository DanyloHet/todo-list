import TodoListItem from './TodoListItem';

function TodoList({ isLoading, todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodos = todoList.filter((todo) => !todo.isCompleted);

  return (
    <>
      {isLoading ? (
        <p>Todo list is loading...</p>
      ) : !filteredTodos.length ? (
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
