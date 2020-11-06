import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

// import Tooltip from '../Tooltip';

import { Container, Label, Error } from './styles';

interface Props<T> {
  name: string;
  label: string;
  icon?: React.ComponentType<IconBaseProps>;
  multiline?: T;
  heigth?: number;
  justRead?: boolean;
}

type InputProps = JSX.IntrinsicElements['input'] & Props<false>;
type TextAreaProps = JSX.IntrinsicElements['textarea'] & Props<true>;

const Input: React.FC<InputProps | TextAreaProps> = ({
  name,
  label,
  icon: Icon,
  multiline = false,
  heigth,
  justRead = false,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!ref.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const props = {
    ...rest,
    ref,
    id: fieldName,
    name: fieldName,
    'aria-label': fieldName,
    defaultValue,
  };

  const heightSelected = heigth || 50;

  return (
    <>
      <Label htmlFor={name}>
        {Icon && <Icon size={20} />}
        {label}
      </Label>
      <Container
        isErrored={!!error}
        isFilled={isFilled}
        isFocused={isFocused}
        isReadOnly={justRead}
      >
        {multiline ? (
          <textarea
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            readOnly={justRead}
            {...(props as TextAreaProps)}
            style={{ height: heightSelected }}
          />
        ) : (
          <input
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            readOnly={justRead}
            {...(props as InputProps)}
          />
        )}

        {error && (
          <Error title={error}>
            <FiAlertCircle color="#c53030" size={20} />
          </Error>
        )}
      </Container>
    </>
  );
};

export default Input;
