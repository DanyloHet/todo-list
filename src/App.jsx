import './App.css';
import styles from './App.module.css';
import {useReducer, useEffect, useCallback } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodosViewForm';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { todoList, isLoading, isSaving, errorMessage, sortField, sortDirection, queryString } = todoState;

  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const headers = {
    Authorization: token,
    'Content-Type': 'application/json',
  };
  const customErrors = {
    get: 'Failed to Fetch TodoList',
    add: 'Failed to add TODO',
    complete: 'Reverting todo completion',
    delete: 'Failed to delete TODO',
    update: 'Reverting todo...',
  };

  const encodeUrl = useCallback(() => {
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}&${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      try {
        const data = await sendRequest({ method: 'GET' });
        const fetchedTodos = data.records.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted ?? false,
        }));
        dispatch({ type: todoActions.loadTodos, records: fetchedTodos });
      } catch (error) {
        handleError(error, customErrors.get);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (title) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          fields: {
            title: title,
            isCompleted: false,
          },
        },
      ],
    };

    try {
      const { records } = await sendRequest({ method: 'POST', payload });
      const { id, fields } = records[0];
      const savedTodo = { id, ...fields };
      dispatch({ type: todoActions.addTodo, savedTodo });
    } catch (error) {
      handleError(error, customErrors.add);
    }
  };

  const completeTodo = async (id) => {
    const completeTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );

    dispatch({ type: todoActions.updateTodo, editedTodo: updatedTodos.find((todo) => todo.id === id) });
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          id: completeTodo.id,
          fields: {
            title: completeTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    try {
      await sendRequest({ method: 'PATCH', payload });
    } catch (error) {
      handleError(error, customErrors.complete);
      const revertedTodos = todoList.map((todo) =>
        todo.id === completeTodo.id ? completeTodo : todo
      );
      dispatch({ type: todoActions.revertTodo, revertedTodos });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    dispatch({ type: todoActions.updateTodo, editedTodo });

    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    try {
      await sendRequest({ method: 'PATCH', payload });
    } catch (error) {
      handleError(error, customErrors.update);
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      dispatch({ type: todoActions.revertTodo, revertedTodos });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const sendRequest = async ({ method, payload = null }) => {
    const options = {
      method,
      headers,
      ...(payload && method !== 'GET' && { body: JSON.stringify(payload) }),
    };
    const resp = await fetch(encodeUrl(), options);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    const contentType = resp.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await resp.json();
    }
    return null;
  };

  const handleError = (error, customsg) => {
    dispatch({ type: todoActions.setLoadError, error: { message: `${error.message}. ${customsg}` } });
    console.error(error.message);
  };

  return (
    <div>
      <h1 className={styles.homeTitle}>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        isLoading={isLoading}
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      <hr />
      <TodoViewForm
        sortDirection={sortDirection}
        setSortDirection={(value) => dispatch({ type: todoActions.setSortDirection, value })}
        sortField={sortField}
        setSortField={(value) => dispatch({ type: todoActions.setSortField, value })}
        queryString={queryString}
        setQueryString={(value) => dispatch({ type: todoActions.setQueryString, value })}
      />
      {errorMessage && (
        <div className={styles.errorContainer}>
          <p>{errorMessage}</p>
          <button
            className={styles.dismissButton}
            onClick={() => dispatch({ type: todoActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
