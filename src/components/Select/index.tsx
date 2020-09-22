import React, { useRef, useEffect, /* useState, */ useCallback } from 'react';
import { OptionTypeBase, Props as SelectProps } from 'react-select';
import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons';
// import { FiAlertCircle } from 'react-icons/fi';
import { Label, Container } from './styles';

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  label: string;
}

const Select: React.FC<Props> = ({ name, label, icon: Icon, ...rest }) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);
  // const [isFocused, setIsFocused] = useState(false);
  // const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    // setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // setIsFocused(false);
    // setIsFilled(!!selectRef.current);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }
        if (!ref.state.value) {
          return '';
        }
        return ref.state.value.value;
      },
      setValue: (ref: any, value: any) => {
        ref.select.setValue(value);
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <>
      <Label htmlFor={name}>
        {Icon && <Icon size={20} />}
        {label}
      </Label>
      <Container
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        isErrored={error}
        {...rest}
      />
    </>
  );
};

export default Select;
