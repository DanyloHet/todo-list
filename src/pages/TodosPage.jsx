import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  isLoading,
  isSaving,
  todoList,
  addTodo,
  completeTodo,
  updateTodo,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  todoActions,
  errorMessage
}) {
  return (
    <div>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        isLoading={isLoading}
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={(value) => dispatch({ type: todoActions.setSortDirection, value })}
        sortField={sortField}
        setSortField={(value) => dispatch({ type: todoActions.setSortField, value })}
        queryString={queryString}
        setQueryString={(value) => dispatch({ type: todoActions.setQueryString, value })}
      />
      {errorMessage && (
        <div className="error">
          <p>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;
