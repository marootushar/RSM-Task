import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import PasswordStrength from '../layout/PasswordStrength';
import { lcc, ucc, num, sc, ws } from '../../utils/RegExp';

const Register = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { register, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/');
        }

        if (error === 'User already exists') {
            setAlert(error, 'danger');
            clearErrors();
        }
        // eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = user;

    const getStrength = (password) => {
        let cnt=0;
        if (lcc.test(password)) cnt++;
        if (ucc.test(password)) cnt++;
        if (num.test(password)) cnt++;
        if (sc.test(password)) cnt++;
        return cnt;
    };

    const onChange = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            setAlert('Please Enter All Fields.', 'danger');
        } else if (ws.test(password))
            setAlert('Password should not contain spaces.', 'danger');
        else if (getStrength(password) < 3)
            setAlert('Please choose a strong password.', 'danger');
        else if (password !== password2) {
            setAlert('Passwords Do Not Match.', 'danger');
        } else {
            register({
                name,
                email,
                password,
            });
        }
    };

    return (
        <div className='form-container'>
            <h1>
                Account <span className='text-highlight'>Register</span>
            </h1>
            <form action='' onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='text'
                        name='name'
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email Address</label>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={onChange}
                        required
                        minLength='6'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password2'>Confirm Password</label>
                    <input
                        type='password'
                        name='password2'
                        value={password2}
                        onChange={onChange}
                        required
                        minLength='6'
                    />
                </div>
                <PasswordStrength password={password} />
                <input type='submit' value='Register' />
            </form>
        </div>
    );
};

export default Register;
