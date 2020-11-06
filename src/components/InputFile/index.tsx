import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FaUpload } from 'react-icons/fa';
import { useField } from '@unform/core';

// import Tooltip from '../Tooltip';

import { Container, Button } from './styles';

interface Props<T> {
  name: string;
  label?: string;
  icon?: React.ComponentType<IconBaseProps>;
  filesAccept?: string;
}

type InputProps = JSX.IntrinsicElements['input'] & Props<false>;

const InputFile: React.FC<InputProps> = ({
  name,
  label,
  icon: Icon,
  filesAccept,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, registerField } = useField(name);
  const [file, setFile] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      clearValue(ref: HTMLInputElement) {
        ref.value = '';
      },
      setValue: (ref: any, value: any) => {
        const data = new DataTransfer();
        data.items.add(value);
        ref.files = data.files;
        setFile(ref.files[0].name);
      },
    });
  }, [fieldName, registerField]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChangeFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = e.target.files?.[0];

    if (!fileUploaded) {
      setFile('');
      return;
    }

    setFile(fileUploaded.name ? fileUploaded.name : '');
  }, []);

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <Button type="button" onClick={handleClick}>
        <FaUpload />
        {file || 'Selecione o arquivo'}
      </Button>
      <Container
        type="file"
        ref={inputRef}
        onChange={handleChangeFile}
        accept={filesAccept}
      />
    </div>
  );
};

export default InputFile;
