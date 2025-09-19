import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
const defaultDiv = css`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledView = styled.form`
  display: flex;
  gap: 1.5rem;
  flex-direction:column;
  gap: 1rem;
  padding:16px 0px;
`;
const StyledSearch = styled.div`
  ${defaultDiv}
`;
const StyledSortBy = styled.div`
  ${defaultDiv}
`;
const StyledSelect = styled.select`
  border-radius: 4px;
  color: #1c1e21;
  font-size: 14px;
  font-weight: 400;
  height: 30px;
  line-height: 20px;
`;

function TodoViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
  const preventRefresh = (event) => {
    event.preventDefault();
  };
  return (
    <StyledView onSubmit={(e) => preventRefresh(e)}>
      <StyledSearch className="defaultDiv">
        <label>Search Todos</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        ></input>
        <button
          type="button"
          onClick={() => {
            setLocalQueryString('');
          }}
        >
          Clear
        </button>
      </StyledSearch>
      <StyledSortBy className="defaultDiv">
        <label htmlFor="sortField">SortBy</label>
        <StyledSelect
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>
        <label htmlFor="sortDirection">Direction</label>
        <StyledSelect
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
        {/* <button type="submit" disabled={!workingTodoTitle.length || isSaving}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </button> */}
      </StyledSortBy>
    </StyledView>
  );
}

export default TodoViewForm;
