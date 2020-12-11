import styled from 'styled-components';
import { shade } from 'polished';

export const ContainerGridList = styled.div`
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
`;

export const ArroundButton = styled.div`
  width: 100%;
  position: relative;
`;

export const Button = styled.button`
  position: absolute;
  right: 0;
  top: -16px;
  border-radius: 10px;
  padding: 8px;
  background: #0f5e9e;
  color: #fff;
  border: 0;
  font-weight: 500;

  &:hover {
    background: ${shade(0.2, '#0f5e9e')};
  }
`;

export const BirthdaysContent = styled.div`
  background-color: #fff;
  border: 2px solid #0f5e9e;
  border-radius: 10px;
  width: 100%;
  padding: 16px;
  box-shadow: 0px 7px 21px -5px rgba(0, 0, 0, 0.75);

  .header {
    display: flex;
    align-items: center;
    padding: 16px;

    .title {
      font-weight: bold;
      font-size: 20px;
    }
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

export const DateRangePickerContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

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

export const Calendar = styled.aside`
  /* width: 380px; */

  .DayPicker {
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
    background: #6b9ec7;
    border-radius: 10px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-NavButton {
    color: #6b9ec7 !important;
  }

  .DayPicker-NavButton--prev {
    right: auto;
    left: 1.5em;
    margin-right: 0;
    background-color: #fff;
    border-radius: 5px;
  }

  .DayPicker-NavButton--next {
    background-color: #fff;
    border-radius: 5px;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px 0 0 0;
    padding: 8px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    border: 3px solid #6b9ec7;
  }

  .DayPicker-Caption {
    margin-bottom: 1em;
    padding: 0 1em;
    color: #fff;

    > div {
      text-align: center;
    }
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #6b9ec7;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker-Day--haveSession:not(.DayPicker-Day--outside) {
    background: #5a9f55;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#6b9ec7')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #6b9ec7 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #0f5e9e !important;
    border-radius: 10px;
    color: #fff !important;
  }
`;
