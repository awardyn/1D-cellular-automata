import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
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
