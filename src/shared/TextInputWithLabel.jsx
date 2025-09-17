import styled, { css } from 'styled-components';
const StyledInput = styled.input`
  border-radius: 6px;
  color: black;
`;
function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <StyledInput
        type="text"
        name="title"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      ></StyledInput>
    </>
  );
}

export default TextInputWithLabel;
