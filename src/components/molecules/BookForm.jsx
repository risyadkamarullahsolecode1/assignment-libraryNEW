import React, { useState, useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';
import CustomButton from '../atoms/Button';
import InputField from '../atoms/InputField';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookForm = ({ onSubmit, initialData = {} }) => {
    const [isbn, setIsbn] = useState(initialData.isbn || '');
    const [title, setTitle] = useState(initialData.title || '');
    const [author, setAuthor] = useState(initialData.author || '');
    const [purchaseDate, setPurchaseDate] = useState(initialData.purchaseDate || '');
    const [category, setCategory] = useState(initialData.category || "");
    const [language, setLanguage] = useState(initialData.language || "");
    const [location, setLocation] = useState(initialData.location || "");
    const [price, setPrice] = useState(initialData.price || "");
    const [totalBook, setTotalBook] = useState(initialData.totalBook || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [deleteStamp, setDeleteStamp] = useState(initialData.deleteStamp || false);
    const [subject, setSubject] = useState(initialData.subject || "");  
    const [publisher, setPublisher] = useState(initialData.publisher || '');
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB dalam bytes
    const ALLOWED_FILE_TYPES = [
        'application/pdf',                                                         // PDF
        'application/msword',                                                      // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
    ];

    useEffect(() => {
        if (initialData.id) {
            setIsbn(initialData.isbn || '');
            setTitle(initialData.title || '');
            setAuthor(initialData.author || '');
            setPurchaseDate(initialData.purchaseDate || '');
            setCategory(initialData.category || "");
            setLanguage(initialData.language || "");
            setLocation(initialData.location || "");
            setPrice(initialData.price || "");
            setTotalBook(initialData.totalBook || "");
            setDescription(initialData.description || "");
            setDeleteStamp(initialData.deleteStamp || false);
            setSubject(initialData.subject || "");
            setPublisher(initialData.publisher || "");
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!isbn) newErrors.isbn = 'ISBN is required.';
        if (!title || title.length < 3) newErrors.title = 'Title must be at least 3 characters.';
        if (!author) newErrors.author = 'Author is required.';
        if (!purchaseDate || purchaseDate > new Date().getFullYear()) {
            newErrors.purchaseDate = 'Invalid purchase date.';
        }
        if (!category) newErrors.category = "Category is required.";
        if (!language) newErrors.language = "Language is required.";
        if (!location) newErrors.location = "Location is required.";
        if (!price || isNaN(price) || price <= 0) newErrors.price = "Price must be a positive number.";
        if (!totalBook || isNaN(totalBook) || totalBook <= 0) newErrors.totalBook = "Total book count must be a positive number.";
        return newErrors;
    };

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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const bookData = { 
            isbn, 
            title, 
            author, 
            purchaseDate,
            category,
            language,
            location,
            price,
            totalBook,
            description,
            deleteStamp,
            subject,
            publisher, };

        onSubmit(bookData); // Trigger the onSubmit function passed from the parent
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
            const response = await axios.post('http://localhost:7064/api/BookRequest/upload', formData, {
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
        <Container>
        <ToastContainer 
            position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop 
            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
        <Form onSubmit={handleSubmit}>
            <InputField label="ISBN" type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} error={errors.isbn} />
            <InputField label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
            <InputField label="Author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} error={errors.author} />
            <InputField label="Publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} error={errors.publisher} />
            <Form.Group controlId="purchaseDate">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                isInvalid={!!errors.purchaseDate}
                />
                <Form.Control.Feedback type="invalid">{errors.purchaseDate}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                isInvalid={!!errors.category}
                >
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                as="select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                isInvalid={!!errors.language}
                >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.language}</Form.Control.Feedback>
            </Form.Group>

            <InputField label="Location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} error={errors.location} />
            <InputField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
            <InputField label="Total Books" type="number" value={totalBook} onChange={(e) => setTotalBook(e.target.value)} error={errors.totalBook} />
            <InputField label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
            <InputField label="Subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject} />

            <Form.Group controlId="deleteStamp">
                <Form.Check
                type="checkbox"
                label="Delete Stamp"
                checked={deleteStamp}
                onChange={(e) => setDeleteStamp(e.target.checked)}
                />
            </Form.Group>
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

                <button onClick={handleUpload} disabled={!selectedFile || isLoading}
                 className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'}`}>
                    {isLoading ? (<>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                    </>
                    ) : ('Upload File')}
                </button>
            </div>

            <CustomButton type="submit" variant="primary">
                {initialData.id ? "Update Book" : "Save Book"}
            </CustomButton>
        </Form>
        </Container>
    );
};

export default BookForm;