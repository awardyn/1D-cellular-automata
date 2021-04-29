import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BorderContainer = styled.div`
  border: 1px solid black;
  border-radius: 16px;
  width: 72.5%;
  margin-bottom: 1rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

export const ButtonContainer = styled.div`
  margin: 1rem;
`;

export const ColorsContainer = styled.div`
  background-color: ${({ backgroundColor }) => backgroundColor};
  user-select: none;
  text-align: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-bottom: 0px;
  border: ${({ border }) => `2px solid ${border}`};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;
