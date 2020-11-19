import styled, { css } from 'styled-components';

interface ChipProps {
  backgroundColor: string;
  color: string;
}

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

export const ContainerDatePicker = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 3px solid #6b9ec7;
  padding: 16px;
  width: 100%;
  color: #6b9ec7;

  display: flex;
  align-items: center;
  margin-bottom: 8px;

  & + div {
    margin-top: 8px;
  }

  .react-datepicker-wrapper {
    width: 100%;

    input {
      flex: 1;
      background: transparent;
      border: 0;
      color: #0f5e9e;
      width: 100%;

      &::placeholder {
        color: #6b9ec7;
      }
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const StartDemonstrationValue = styled.div`
  border: 2px solid #0f5e9e;
  border-radius: 10px;
  background-color: #6b9ec7;
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 16px;
  color: #fff;

  span {
    font-weight: bold;
    margin-left: 8px;
  }
`;

export const EndDemonstrationValue = styled.div`
  border: 2px solid #0f5e9e;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 16px;

  span {
    font-weight: bold;
    margin-left: 8px;
  }
`;

export const Chip = styled.div<ChipProps>`
  border-radius: 16px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  font-weight: bold;

  ${props =>
    props.backgroundColor &&
    css`
      background-color: ${props.backgroundColor};
    `}

  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}
`;

export const CardInfo = styled.div`
  border: 2px solid #0f5e9e;
  border-radius: 10px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 7px 21px -5px rgba(0, 0, 0, 0.75);
  padding: 16px;
  text-align: right;

  .item {
    padding: 4px;
    display: grid;

    span {
      margin-left: 8px;
    }
  }

  .divider {
    border-top: 5px solid #0f5e9e;
    border-radius: 5px;
  }
`;
