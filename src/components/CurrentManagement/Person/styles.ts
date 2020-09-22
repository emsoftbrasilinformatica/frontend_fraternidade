import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Card = styled.div`
  background: #6d1e2bb8;
  max-width: 200px;
  min-width: 200px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  color: #fff;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
`;
