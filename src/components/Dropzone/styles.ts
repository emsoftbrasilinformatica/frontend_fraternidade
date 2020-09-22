import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  max-height: 600px;
  height: 100%;
  background: #6d1e2bb8;
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  flex: 1;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
  }

  p {
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    border-radius: 10px;
    border: 1px dashed #631925;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #631925;
    font-weight: bold;
    margin: 48px;
    padding: 32px;

    svg {
      color: #631925;
      width: 24px;
      height: 24px;
      margin-bottom: 8px;
    }
  }
`;
