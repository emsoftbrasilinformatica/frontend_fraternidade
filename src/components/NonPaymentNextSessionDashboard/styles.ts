import styled, { css } from 'styled-components';

interface ContainerProps {
  totalNonPayments: number;
}

export const Container = styled.div<ContainerProps>`
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 10px 10px 18px -9px rgba(0, 0, 0, 0.75);

  ${props =>
    props.totalNonPayments === 0
      ? css`
          border: 2px solid #12a454;
        `
      : css`
          border: 2px solid #c53030;
        `}

  .title {
    font-size: 24px;
    font-weight: 500;
  }

  .value {
    margin-top: 16px;
    padding: 24px;
    border-radius: 50%;
    color: #fff;
    font-weight: 500;

    ${props =>
      props.totalNonPayments === 0
        ? css`
            background-color: #12a454;
          `
        : css`
            background-color: #c53030;
          `}
  }
`;

export const SessionItem = styled.div`
  display: flex;
  background: #6b9ec7;
  padding: 8px;
  border-radius: 10px;
  color: #fff;
  flex-direction: column;
  margin-bottom: 16px;
  box-shadow: 10px 10px 18px -9px rgba(0, 0, 0, 0.75);
  height: 100%;

  .titleCard {
    text-align: center;
    padding: 6px;
    font-weight: 500;
    font-size: 24px;
  }

  .titleSession {
    font-size: 16px;
    margin-bottom: 8px;
    text-align: center;

    span {
      vertical-align: text-bottom;
    }
  }
`;
