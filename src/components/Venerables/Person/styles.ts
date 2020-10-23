import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Card = styled.div`
  background: #0f5e9e;
  max-width: 200px;
  min-width: 200px;
  min-height: 340px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  position: relative;

  /* img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.75);
  } */
`;

export const Button = styled.button`
  margin-top: 8px;
  border-radius: 10px;
  outline: none;
  border: 3px solid #fff;
  padding: 5px;
  background: none;
  font-weight: bold;
  color: #fff;
  width: 115px;
`;
