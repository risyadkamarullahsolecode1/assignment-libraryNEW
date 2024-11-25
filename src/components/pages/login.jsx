import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../../slices/authSlice';
import { Button, Card, Container } from 'react-bootstrap';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
    const { username, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
      );
    
      useEffect(() => {    
        if (isError) {
          alert(message);
        }
    
        if (isSuccess || user) {      
          navigate('/profile'); 
        }
        
        dispatch(reset());
      }, [user, isError, isSuccess, message, navigate, dispatch]);
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };
    
    if (isLoading) {
        return (
          <div> <span>Loading...</span> </div>
        );
    }

    return (
        <Container>     
          <Card.Title className="text-center text-white">Login</Card.Title>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" name="username"
                 value={username} onChange={onChange} required placeholder="Enter username"/>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password"
                 value={password} onChange={onChange} required placeholder="Enter password" />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={isLoading} >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>         
            {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )} 
        </Container>
      );     
};

export default Login