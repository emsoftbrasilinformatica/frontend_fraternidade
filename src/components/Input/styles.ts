import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  isReadOnly: boolean;
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

export const Container = styled.div<ContainerProps>`
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

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #0f5e9e;
      border-color: #0f5e9e;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #0f5e9e;
    `}

  ${props =>
    props.isReadOnly &&
    css`
      background-color: #f2f2f2;
    `}



  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #0f5e9e;

    &::placeholder {
      color: #6b9ec7;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }
  }

  textarea {
    flex: 1;
    background: transparent;
    border: 0;
    color: #0f5e9e;

    &::placeholder {
      color: #6b9ec7;
    }
  }

  input[type=number] {
    -moz-appearance:textfield; /* Firefox */
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;
    text-align: center;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
