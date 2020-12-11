import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  background: #6b9ec7;
  padding: 16px;
  border-radius: 10px;
  color: #fff;
  flex-direction: column;
  margin-bottom: 16px;
  box-shadow: 10px 10px 18px -9px rgba(0, 0, 0, 0.75);

  .titleSession {
    font-size: 18px;
    margin-bottom: 8px;

    span {
      vertical-align: text-bottom;
    }
  }

  .contentIcon {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;

    a {
      text-decoration: none;
      color: #fff;

      svg {
        font-weight: bold;
        cursor: pointer;

        &:hover {
          color: ${shade(0.2, '#fff')};
        }
      }
    }
  }
`;
