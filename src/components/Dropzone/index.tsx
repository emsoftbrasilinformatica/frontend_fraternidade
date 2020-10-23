import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Resizer from 'react-image-file-resizer';
import { FiUpload } from 'react-icons/fi';
import { Container } from './styles';

interface Props {
  onFileUploaded: (file: File) => void;
  initialFile?: File;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded, initialFile }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const resizeFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        850,
        850,
        'JPEG',
        90,
        0,
        uri => {
          resolve(uri as string);
        },
        'base64',
      );
    });

  const onDrop = useCallback(
    async acceptedFiles => {
      const file = acceptedFiles[0];

      const resizedFile = await resizeFile(file);

      fetch(resizedFile)
        .then(response => response.blob())
        .then(blob => {
          const fileResized = new File([blob], file.name, {
            type: 'image/jpeg',
          });

          setSelectedFileUrl(resizedFile);
          onFileUploaded(fileResized);
        });
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
