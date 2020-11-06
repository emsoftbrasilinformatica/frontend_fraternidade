import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import MaskedInput, { MaskedInputProps as InputProps } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Label, Error } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement>, InputProps {
  name: string;
  label: string;
  icon?: React.ComponentType<IconBaseProps>;
  justRead?: boolean;
}

const defaultMaskOptions = {
  prefix: 'R$',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

const InputCurrency: React.FC<Props> = ({
  name,
  label,
  icon: Icon,
  justRead = false,
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const currencyMask = createNumberMask(defaultMaskOptions);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
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
      <Container
        isErrored={!!error}
        isFocused={isFocused}
        isReadOnly={justRead}
      >
        <MaskedInput
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={inputRef}
          defaultValue={defaultValue}
          readOnly={justRead}
          mask={currencyMask}
          inputMode="numeric"
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
export default InputCurrency;
