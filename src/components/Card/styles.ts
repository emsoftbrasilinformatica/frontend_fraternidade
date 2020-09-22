import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  display: flex;
  flex: 1;
  width: 100%;
  border-radius: 5px;
  margin-top: 32px;
  box-shadow: 4px 6px 19px -6px rgba(0, 0, 0, 0.75);
  flex-direction: column;
  border: 2px solid #631925;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: #631925;
    letter-spacing: 2px;

    .title {
      font-size: 24px;
    }
  }

  .card-body {
    padding: 32px;
  }

  hr {
    border: 2px solid #631925;
  }
`;
