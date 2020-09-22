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
  color: #631925;

  svg {
    margin-right: 8px;
  }
`;

export const Container = styled(ReactSelect)<ContainerProps>`
  margin-bottom: 8px;
  .react-select__control {
    border-radius: 10px;
    border: 3px solid #63192575;
    padding: 8px;

    ${props =>
      props.isErrored &&
      css`
        border-color: #c53030;
      `}

    &:hover {
      border: 3px solid #63192575;
    }
  }

  .react-select__control--is-focused {
    border: 3px solid #631925;
    box-shadow: none;

    &:hover {
      border: 3px solid #631925;
    }
  }

  .react-select__placeholder {
    color: #63192575;
  }

  .react-select__single-value {
    color: #631925;
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
