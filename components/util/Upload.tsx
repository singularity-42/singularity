import React, { useRef, useState } from 'react';
import styles from './Upload.module.scss';

type UploadProps = {
    onFileUpload: (file: File) => void;
    uploading: boolean;
    acceptedTypes: string; // Comma-separated list of accepted file types, e.g., '.mp3,.wav'
};

const Upload: React.FC<UploadProps> = ({ onFileUpload, uploading, acceptedTypes }) => {
    const [dragActive, setDragActive] = useState(false);
    const [hoverText, setHoverText] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave' || e.type === 'drop') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        } else {
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        } else {
        }
    };

    const onButtonClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent page reload
        e.stopPropagation();
        inputRef.current?.click();
    };

    const handleFileUpload = (file: File) => {
        onFileUpload(file);
    };

    const handleButtonHover = () => {
        setHoverText(true);
    };

    const handleButtonLeave = () => {
        setHoverText(false);
    };

    return (
        <div className={styles.uploadContainer}>
            <form
                className={`${styles.uploadForm} ${dragActive ? styles.dragActive : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                {uploading ? (
                    ''
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            padding: '0.42rem',
                        }}

                    >
                        <br />
                        <p>Drag and drop your audio here or</p>
                    </div>
                )}

                <button
                    className={`${styles.uploadButton} ${uploading ? styles.loading : ''}`}
                    onClick={onButtonClick}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                >
                    {uploading ? (
                        hoverText ? 'Upload other' : 'Loading...'
                    ) : (
                        'Upload a audio'
                    )}
                </button>

                <input
                    id="fileInput"
                    ref={inputRef}
                    type="file"
                    accept={acceptedTypes}
                    className={styles.fileInput}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </form>
        </div>
    );
};

export default Upload;
