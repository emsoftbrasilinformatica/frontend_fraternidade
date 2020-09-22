import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import ReactInputMask, { Props as InputProps } from 'react-input-mask';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Label, Error } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement>, InputProps {
  name: string;
  label: string;
  icon?: React.ComponentType<IconBaseProps>;
}
const InputMask: React.FC<Props> = ({ name, label, icon: Icon, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        ref.setInputValue(value);
      },
      clearValue(ref: any) {
        ref.setInputValue('');
      },
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  return (
    <>
      <Label htmlFor={name}>
        {Icon && <Icon size={20} />}
        {label}
      </Label>
      <Container isErrored={!!error} isFocused={isFocused}>
        <ReactInputMask
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={inputRef}
          defaultValue={defaultValue}
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
export default InputMask;
