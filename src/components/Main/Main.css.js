import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
`;

export const SelectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SelectContainer = styled.div`
  margin: 1rem;
  margin-top: ${({ marginTop }) => marginTop};
  margin-left: 0rem;
  width: 200px;
  display: flex;
  flex-direction: column;
`;
