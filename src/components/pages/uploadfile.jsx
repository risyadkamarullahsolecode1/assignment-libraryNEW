import React, { useState, useEffect } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import CustomButton from '../atoms/Button';
import InputField from '../atoms/InputField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UploadFiles = ()=>{
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB dalam bytes
    const ALLOWED_FILE_TYPES = [
        'application/pdf',                                                         // PDF
        'application/msword',                                                      // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
    ];

    const validateFile = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 2MB limit';
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Only PDF and Word documents are allowed';
        }
        return null;
    };

    const handleFileSelect = (event) => {
    const file = event.target.files[0];
        
    if (file) {
        const validationError = validateFile(file);
        if (validationError) {
            toast.error(validationError);
                setSelectedFile(null);
                event.target.value = ''; // Reset input file
                return;
        }
        setSelectedFile(file);
        toast.info(`File selected: ${file.name}`);
        setUploadProgress(0);
    }
    };

    const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        setIsLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('https://localhost:7064/api/BookRequest/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                },
            });         
            toast.success(response.data);
            setSelectedFile(null);
            document.getElementById('fileInput').value = '';
        } catch (error) {
            let errorMessage = 'Upload failed';
            if (error.response) {
                errorMessage = `Upload failed: ${error.response.data}`;
            } else if (error.request) {
                errorMessage = 'No response from server';
            } else {
                errorMessage = `Error: ${error.message}`;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <ToastContainer 
                position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop 
                closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
            
            <div className="col-md-12">
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Choose File (PDF or Word, max 2MB)</label>
                    <input type="file" onChange={handleFileSelect} className="form-control" accept=".pdf,.doc,.docx"/>
                        {selectedFile && (
                            <div className="mt-2 text-muted">
                                Selected file: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            </div>
                        )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-3">
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }} 
                             aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
                               {uploadProgress}%
                             </div>
                        </div>
                    </div>
                )}

                <Button onClick={handleUpload} disabled={!selectedFile || isLoading}
                 className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'}`}>
                    {isLoading ? (<>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                    </>
                    ) : ('Upload File')}
                </Button>
            </div>
        </Container>        
    );
};

export default UploadFiles;