export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortField: 'createdTime',
  sortDirection: 'desc',
  queryString: '',
};

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };

    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          ...record,
          isCompleted: record.isCompleted || false,
        })),
        isLoading: false,
      };

    case actions.setLoadError:
      return { ...state, errorMessage: action.error.message, isLoading: false };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo:
      return {
        ...state,
        todoList: [...state.todoList, { ...action.savedTodo, isCompleted: false }],
        isSaving: false,
      };

    case actions.endRequest:
      return { ...state, isSaving: false, isLoading: false };

    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.editedTodo.id ? { ...todo, ...action.editedTodo } : todo
        ),
      };

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id ? { ...todo, isCompleted: true } : todo
        ),
      };

    case actions.revertTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.originalTodo.id ? { ...action.originalTodo } : todo
        ),
      };

    case actions.clearError:
      return { ...state, errorMessage: '' };

    case actions.setSortField:
      return { ...state, sortField: action.value };

    case actions.setSortDirection:
      return { ...state, sortDirection: action.value };

    case actions.setQueryString:
      return { ...state, queryString: action.value };

    default:
      return state;
  }
}
