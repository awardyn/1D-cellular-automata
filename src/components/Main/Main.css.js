import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 2rem;
`;

export const TopContainer = styled.div`
  margin: auto;
  padding-bottom: 1rem;
  width: 70%;
  border: 1px solid black;
  border-radius: 16px;
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
