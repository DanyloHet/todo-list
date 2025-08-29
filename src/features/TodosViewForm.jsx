function TodoViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const preventRefresh = (event) => {
    event.preventDefault();
  };
  return (
    <form onSubmit={(e) => preventRefresh(e)}>
      <div>
        <label>Search Todos</label>
        <input
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        ></input>
        <button
          type="button"
          onClick={() => {
            setQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sortField">SortBy</label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
        <label htmlFor="sortDirection">Direction</label>
        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {/* <button type="submit" disabled={!workingTodoTitle.length || isSaving}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </button> */}
      </div>
    </form>
  );
}

export default TodoViewForm;
