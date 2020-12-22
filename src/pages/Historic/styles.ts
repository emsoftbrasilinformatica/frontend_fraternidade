import styled from 'styled-components';
import ReactSelect from 'react-select';
import { shade } from 'polished';

export const Button = styled.button`
  background: #0f5e9e;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  font-weight: 500;
  margin-top: 24px;
  margin-left: 16px;
  transition: background-color 0.2s;

  display: flex;
  align-items: center;

  svg {
    margin-left: 16px;
  }

  &:hover {
    background: ${shade(0.2, '#0f5e9e')};
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  margin: 0 0 5px 8px;
  color: #0f5e9e;
  font-weight: bold;

  svg {
    margin-right: 8px;
  }
`;

export const SelectContainer = styled(ReactSelect)`
  margin-bottom: 8px;
  .react-select__control {
    border-radius: 10px;
    border: 3px solid #6b9ec7;
    padding: 8px;

    &:hover {
      border: 3px solid #6b9ec7;
    }
  }

  .react-select__control--is-focused {
    border: 3px solid #0f5e9e;
    box-shadow: none;

    &:hover {
      border: 3px solid #0f5e9e;
    }
  }

  .react-select__placeholder {
    color: #6b9ec7;
  }

  .react-select__single-value {
    color: #0f5e9e;
  }
`;

export const DatesContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 16px;
  box-shadow: 10px 10px 18px -9px rgba(0, 0, 0, 0.75);
  border: 3px solid #0f5e9e;
  margin-bottom: 16px;

  .title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    padding: 8px;
  }
`;

export const DatesInfo = styled.div`
  background-color: #6b9ec7;
  border-radius: 10px;
  padding: 16px;
  color: #fff;

  .title {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }

  .subtitle {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }

  .info {
    text-align: center;
    font-size: 16px;
    padding: 8px;
  }
`;
