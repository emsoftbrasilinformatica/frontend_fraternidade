import styled, { css } from 'styled-components';

import { shade } from 'polished';

interface ImgDialogProps {
  image: string;
}

export const ContainerDropzone = styled.div`
  max-width: 100%;
  min-width: 100%;
  min-height: 300px;
  height: 100%;
  background: #6b9ec7;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;

  p {
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    border-radius: 10px;
    border: 1px dashed #0f5e9e;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #0f5e9e;
    font-weight: bold;
    margin: 32px;
    padding: 32px;

    svg {
      color: #0f5e9e;
      width: 24px;
      height: 24px;
      margin-bottom: 8px;
    }
  }
`;

export const ButtonRemoveAll = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 8px;
  background-color: #c53030;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 24px !important;

  &:hover {
    background: ${shade(0.2, '#c53030')};
  }
`;

export const ThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const Thumb = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 2px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 150px;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
`;

export const ThumbInner = styled.div`
  display: flex;
  justify-content: center;
  min-width: 0px;
  overflow: hidden;
  padding: 8px;
`;

export const Img = styled.img`
  display: block;
  width: auto;
  height: 100%;
  cursor: pointer;
`;

export const ButtonRemove = styled.button`
  border-radius: 10px;
  padding: 8px;
  border: 0;
  background-color: #c53030;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#c53030')};
  }
`;

export const ContainerImgDialog = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 2px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 400px;
  height: 400px;
  padding: 8px;
  box-sizing: border-box;
`;

export const ImgDialog = styled.div<ImgDialogProps>`
  display: block;
  width: auto;
  height: 100%;
  ${props =>
    props.image &&
    css`
      background-image: url('${props.image}');
      width: 100%;
      height: 500px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    `}
`;
