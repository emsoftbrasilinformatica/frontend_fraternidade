import styled from 'styled-components';
import { shade } from 'polished';

export const ArroundButton = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: #fff;
    border: 2px solid #631925;
    font-weight: 500;
    flex: 1;
    margin-bottom: 16px;

    svg {
      margin-left: 8px;
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
    background: #6d1e2bb8;
    border-radius: 10px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-NavButton {
    color: #6d1e2bb8 !important;
  }

  .DayPicker-NavButton--prev {
    right: auto;
    left: 1.5em;
    margin-right: 0;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px 0 0 0;
    padding: 8px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    border: 3px solid #6d1e2bb8;
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
    background: #6d1e2bb8;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#6d1e2bb8')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #6d1e2bb8 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #631925 !important;
    border-radius: 10px;
    color: #fff !important;
  }
`;
