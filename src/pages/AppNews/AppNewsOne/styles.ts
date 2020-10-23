import styled, { css } from 'styled-components';

import { shade } from 'polished';
import { Grid } from '@material-ui/core';

interface ImageProps {
  imageURL?: string;
}

export const ContainerButtons = styled(Grid)`
  display: flex;
  padding: 16px;
`;

export const AddImages = styled.button`
  background: #6b9ec7;
  color: #0f5e9e;
  font-weight: bold;
  border: 1px solid #0f5e9e;
  border-radius: 10px;
  padding: 16px;
  flex: 1;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#6b9ec7')};
  }

  svg {
    margin-right: 16px;
  }
`;

export const RemoveAllImages = styled.button`
  background: #c76b6b;
  color: #9e0f0f;
  font-weight: bold;
  border: 1px solid #9e0f0f;
  border-radius: 10px;
  padding: 16px;
  flex: 1;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#c76b6b')};
  }

  svg {
    margin-right: 16px;
  }
`;

export const ContainerListImage = styled(Grid)`
  display: flex;
  align-items: center;
`;

export const ItemImage = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 4px solid #6b9ec7;
  padding: 8px;
  flex: 1;
`;

export const Image = styled.div<ImageProps>`
  ${props =>
    props.imageURL &&
    css`
      background-image: url('${props.imageURL}');
      width: 100%;
      height: 120px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      padding: 8px;
    `}
`;

export const ButtonUpdateImage = styled.button`
  border-radius: 5px;
  padding: 8px;
  font-weight: bold;
  color: #43a047;
  border: 1px solid #43a047;
  flex: 1;
  background: #bcf1c7;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#bcf1c7')};
  }
`;

export const ButtonRemoveImage = styled.button`
  border-radius: 5px;
  padding: 8px;
  font-weight: bold;
  color: #9e0f0f;
  border: 1px solid #9e0f0f;
  flex: 1;
  background: #c76b6b;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#c76b6b')};
  }
`;
