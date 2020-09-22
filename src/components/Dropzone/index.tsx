import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { Container } from './styles';

interface Props {
  onFileUploaded: (file: File) => void;
  initialFile?: File;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded, initialFile }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);
      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded],
  );

  useEffect(() => {
    if (initialFile) {
      const fileUrl = URL.createObjectURL(initialFile);
      setSelectedFileUrl(fileUrl);
    }
  }, [initialFile]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Noticia Thumbnail" />
      ) : (
        <p>
          <FiUpload />
          Imagem da Notícia
        </p>
      )}
    </Container>
  );
};

export default Dropzone;
