import './App.css';
import { useState, useEffect } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodoViewForm from './features/TodosViewForm';

function encodeUrl({ sortField, sortDirection, queryString }) {
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  let searchQuery = '';
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  if (!searchQuery.length) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }
  return encodeURI(`${url}?${sortQuery}&${searchQuery}`);
}

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDircetion] = useState('desc');
  const [queryString, setQueryString] = useState('');
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

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const data = await sendRequest({ method: 'GET' });
        const fetchedTodos = data.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
            isCompleted: record.fields.isCompleted ?? false,
          };
          return todo;
        });
        setTodoList([...fetchedTodos]);
      } catch (error) {
        handleError(error, customErrors.get);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const addTodo = async (title) => {
    setIsSaving(true);
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
      const savedTodo = {
        id,
        ...fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      handleError(error, customErrors.add);
    } finally {
      setIsSaving(false);
    }
  };

  async function completeTodo(id) {
    const completeTodo = todoList.find((todo) => todo.id === id);
    const updateTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodoList(updateTodoList);
    setIsSaving(true);

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
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodoList = todoList.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    setTodoList(updatedTodoList);
    setIsSaving(true);
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
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }

  async function sendRequest({ method, payload = null }) {
    const options = {
      method,
      headers,
      ...(payload && method !== 'GET' && { body: JSON.stringify(payload) }),
    };
    const resp = await fetch(
      encodeUrl({ sortField, sortDirection, queryString }),
      options
    );
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    const contentType = resp.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await resp.json();
    }
    return null;
  }

  function handleError(error, customsg) {
    setErrorMessage(`${error.message}. ${customsg}`);
    console.error(error.message);
  }
  return (
    <div>
      <h1>My Todos</h1>
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
        setSortDirection={setSortDircetion}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </>
      )}
    </div>
  );
}

export default App;
