import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ChipProps {
  backgroundColor: string;
  color: string;
}

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

export const ArroundButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

export const TotalValueContainer = styled.div`
  padding: 16px;
  background-color: #fff;
  border-radius: 10px;
  border: 2px solid #0f5e9e;
  font-weight: 500;

  display: flex;
  justify-content: flex-end;
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
