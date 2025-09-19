import TodoListItem from './TodoListItem';
import styles from '../../TodoList.module.css';

function TodoList({ isLoading, todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodos = todoList.filter((todo) => !todo.isCompleted);

  return (
    <>
      {isLoading ? (
        <p className={styles.staticText}>Todo list is loading...</p>
      ) : !filteredTodos.length ? (
        <p className={styles.staticText}>Add a todo above to get started</p>
      ) : (
        <ul className={styles.todoList}>
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
