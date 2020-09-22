import styled from 'styled-components';
import MaterialTable from 'material-table';
import { shade } from 'polished';

export const Title = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  color: #631925;
  font-size: 32px;
  margin-bottom: 8px;
  letter-spacing: 2px;
  font-weight: 500;
`;

export const Table = styled(MaterialTable)`
  background-color: red;
`;

export const Button = styled.button`
  border-radius: 5px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #fff;
  border: none;
  font-weight: 500;

  svg {
    margin-left: 8px;
  }
`;

export const ArroundButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AvatarInput = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  display: flex;
  justify-content: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #631925;
    border-radius: 50%;
    left: 54%;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #fff;
    }

    &:hover {
      background: ${shade(0.2, '#631925')};
    }
  }
`;
