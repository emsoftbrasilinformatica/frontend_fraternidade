import styled, { css } from 'styled-components';
import ReactSelect from 'react-select';

interface CardProps {
  color: string;
  fontColor?: string;
  colorIcon?: string;
}

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
  flex: 1;

  svg {
    margin-left: 8px;
  }
`;

export const ArroundButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FormContent = styled.div`
  padding: 16px;
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

export const DateRangePickerContent = styled.div`
  display: flex;
  flex-direction: column;

  .react-datepicker-wrapper {
    width: 100%;

    .react-datepicker__input-container {
      display: flex;

      input {
        flex: 1;
        padding: 16px;
        border-radius: 10px;
        color: #0f5e9e;
        border-color: #0f5e9e;
        border: 3px solid;
      }
    }
  }
`;

export const CardTotals = styled.div<CardProps>`
  ${props =>
    props.color &&
    css`
      background-color: ${props.color};
    `}

  ${props =>
    props.fontColor &&
    css`
      color: ${props.fontColor};
    `}

  border-radius: 10px;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-weight: bold;

  box-shadow: 0px 7px 21px -5px rgba(0, 0, 0, 0.75);
  ${props =>
    props.colorIcon &&
    css`
      border: 2px solid ${props.colorIcon};
    `};

  .icon {
    font-size: 60px;
    display: flex;
    ${props =>
      props.colorIcon &&
      css`
        color: ${props.colorIcon};
      `}
  }

  .content {
    display: flex;
    flex-direction: column;

    .header {
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      padding: 8px;
    }

    .total {
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 20px;
    }
  }
`;
