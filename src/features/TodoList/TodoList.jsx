import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import TodoListItem from './TodoListItem';
import styles from '../../css-modules/TodoList.module.css';

function TodoList({ isLoading, todoList, onCompleteTodo, onUpdateTodo }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;

  // Get page param from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Filter uncompleted todos
  const filteredTodos = todoList.filter((todo) => !todo.isCompleted);

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  // Redirect if invalid page params
  useEffect(() => {
    if (
      totalPages > 0 &&
      (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
    ) {
      navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  return (
    <>
      {isLoading ? (
        <p className={styles.staticText}>Todo list is loading...</p>
      ) : !filteredTodos.length ? (
        <p className={styles.staticText}>Add a todo above to get started</p>
      ) : (
        <>
          <ul className={styles.todoList}>
            {currentTodos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
          </ul>

          <div className={styles.paginationControls}>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default TodoList;
