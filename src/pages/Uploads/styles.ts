import styled from 'styled-components';

export const Button = styled.button`
  border-radius: 5px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #fff;
  border: 2px solid #0f5e9e;
  font-weight: 500;

  svg {
    margin-left: 8px;
  }
`;

export const ArroundButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;
