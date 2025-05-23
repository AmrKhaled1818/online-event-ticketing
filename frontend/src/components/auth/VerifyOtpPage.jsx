import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import api from '../../api/api';
import Loader from '../common/Loader';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        // Check if email exists in localStorage
        const email = localStorage.getItem('resetEmail');
        if (!email) {
            navigate('/forgot-password');
        }
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
            const email = localStorage.getItem('resetEmail');
            if (!email) {
                throw new Error('Email not found. Please try the forgot password process again.');
            }

            const response = await api.post('/verifyOtp', { email, otp: otpString });
            toast.success('OTP verified successfully!');
            
            // Store reset token for the next step
            if (response.data?.resetToken) {
                localStorage.setItem('resetToken', response.data.resetToken);
            }
            
            // Add artificial delay
            setTimeout(() => {
                navigate('/reset-password');
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to verify OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
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
                    <h2>Verify OTP</h2>
                    {error && <p className="error-message">{error}</p>}
                    <p className="otp-instruction">Enter the 6-digit code sent to your email</p>
                    
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
                    
                    <button type="submit" disabled={loading}>Verify OTP</button>
                    <div className="link-container">
                        <a href="/forgot-password">Back to Forgot Password</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage; 