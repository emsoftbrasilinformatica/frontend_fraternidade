import styled, { css } from 'styled-components';
import ReactSelect from 'react-select';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isErrored: boolean;
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

export const Container = styled(ReactSelect)<ContainerProps>`
  margin-bottom: 8px;
  .react-select__control {
    border-radius: 10px;
    border: 3px solid #6b9ec7;
    padding: 8px;

    ${props =>
      props.isErrored &&
      css`
        border-color: #c53030;
      `}

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

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
