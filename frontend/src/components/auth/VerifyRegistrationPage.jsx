import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import api from '../../api/api';
import Loader from '../common/Loader';

const VerifyRegistrationPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        // Check if email exists in localStorage
        const email = localStorage.getItem('registrationEmail');
        if (!email) {
            navigate('/register');
            return;
        }

        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('registrationEmail');
            await api.post('/resend-registration-otp', { email });
            setTimer(300); // Reset timer to 5 minutes
            toast.success('New OTP sent successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            toast.error('Please enter all 6 digits');
            setLoading(false);
            return;
        }

        try {
            const email = localStorage.getItem('registrationEmail');
            if (!email) {
                throw new Error('Email not found. Please try the registration process again.');
            }

            const response = await api.post('/verify-registration-otp', { email, otp: otpString });
            
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Clear registration email
            localStorage.removeItem('registrationEmail');
            
            toast.success('Registration successful!');
            
            // Add artificial delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to verify OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="verify-wrapper">
            <Loader loading={loading} message="Verifying OTP..." />
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="verify-container">
                <form className="verify-form" onSubmit={handleSubmit}>
                    <h2>Verify Email</h2>
                    {error && <p className="error-message">{error}</p>}
                    <p className="otp-instruction">
                        Enter the 6-digit code sent to your email
                        {timer > 0 && (
                            <span className="timer"> (expires in {formatTime(timer)})</span>
                        )}
                    </p>
                    
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    
                    <button type="submit" disabled={loading}>Verify Email</button>
                    
                    <div className="link-container">
                        {timer === 0 ? (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="resend-link"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="resend-timer">
                                Resend OTP in {formatTime(timer)}
                            </p>
                        )}
                        <a href="/register">Back to Registration</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyRegistrationPage; 