import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';
import { Label, Container, Error } from './styles';

registerLocale('pt-BR', ptBR);

interface Props extends Omit<ReactDatePickerProps, 'onChange'> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  label: string;
}
const DatePicker: React.FC<Props> = ({ name, label, icon: Icon, ...rest }) => {
  const datepickerRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [date, setDate] = useState(defaultValue || null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!date);
  }, [date]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      path: 'props.selected',
      clearValue: (ref: any) => {
        ref.clear();
      },
      setValue: (e, v: any) => {
        setDate(new Date(v));
      },
    });
  }, [fieldName, registerField]);
  return (
    <>
      <Label htmlFor={name}>
        {Icon && <Icon size={20} />}
        {label}
      </Label>
      <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
        <ReactDatePicker
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={datepickerRef}
          selected={date}
          onChange={setDate}
          onCalendarClose={handleInputBlur}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          showYearDropdown
          {...rest}
        />

        {error && (
          <Error title={error}>
            <FiAlertCircle color="#c53030" size={20} />
          </Error>
        )}
      </Container>
    </>
  );
};
export default DatePicker;
