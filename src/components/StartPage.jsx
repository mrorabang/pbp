import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useNavigate } from "react-router-dom";
import logo from "../components/homelander.png";


const StartPage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [name, setName] = useState('');
    const [initialMoney, setInitialMoney] = useState('');
    const nav = useNavigate();
    const [errors, setErrors] = useState({ name: '', money: '' });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format tiền VND với dấu chấm
    const formatMoney = (value) => {
        if (!value) return '';
        return Number(value).toLocaleString('vi-VN');
    };

    const handleClick = () => {
        let valid = true;
        const newErrors = { name: '', money: '' };

        if (!name.trim()) {
            newErrors.name = 'Vui lòng nhập tên!';
            valid = false;
        }

        if (!initialMoney || Number(initialMoney) <= 0) {
            newErrors.money = 'Vui lòng nhập số tiền hợp lệ!';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            // Lưu vào localStorage
            localStorage.setItem('startName', name);
            localStorage.setItem('startMoney', initialMoney); // lưu số nguyên
            nav('/export-pdf');
            // alert(`Đã lưu:\nHọ tên: ${name}\nTiền đầu ca: ${formatMoney(initialMoney)} VND\nThời gian: ${currentTime.toLocaleString('vi-VN')}`);
        }
    };

    return (
        <div
            className="d-flex vh-100 justify-content-center align-items-center p-3"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
        >
            <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>

                {/* Ảnh đầu */}
                 <div style={{ width: "100%", height: "200px",marginLeft:'100px', overflow: "hidden" }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: "50%",
                            objectFit: "cover",
                        }}
                    />
                </div> 

                {/* Card đè lên ảnh */}
                <div
                    className="card shadow w-100 animated-gradient led-border"
                    style={{
                        position: "relative",
                        top: "-60px", // đẩy card lên chồng vào ảnh
                        borderRadius: "15px",
                    }}
                >
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Kết Ca</h2>

                        {/* Đồng hồ */}
                        <div className="mb-4 text-center">
                            <p className="text-secondary fs-6 mb-1">{currentTime.toLocaleDateString('vi-VN')}</p>
                            <p className="fw-bold text-primary fs-3 mb-0">{currentTime.toLocaleTimeString('vi-VN')}</p>
                        </div>

                        {/* Họ tên */}
                        <div className="mb-4">
                            <label className="form-label fw-bold fs-5">Nhân viên</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="Nhập tên nhân viên..."
                            />
                            {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                        </div>

                        {/* Tiền đầu ca */}
                        <div className="mb-4">
                            <label className="form-label fw-bold fs-5">Tiền đầu ca (VND)</label>
                            <input
                                type="text"
                                value={formatMoney(initialMoney)}
                                onChange={(e) => setInitialMoney(e.target.value.replace(/\D/g, ''))}
                                className={`form-control form-control-lg ${errors.money ? 'is-invalid' : ''}`}
                                placeholder="Nhập đầu ca..."
                            />
                            {errors.money && <div className="text-danger mt-1">{errors.money}</div>}
                        </div>

                        <div className="d-grid mt-4">
                            <button className="btn btn-primary btn-lg" onClick={handleClick}>
                                Zô Nà
                            </button>

                            <button
                                className="btn btn-outline-danger btn-lg mt-3"
                                onClick={() => {
                                    // Không cần validate, chỉ lưu tên và tiền nếu muốn
                                    if (name.trim()) {
                                        localStorage.setItem("startName", name);
                                    }
                                    if (initialMoney) {
                                        localStorage.setItem("startMoney", initialMoney);
                                    }
                                    nav("/group-call"); // 👉 chuyển sang màn hình VideoCall
                                }}
                            >
                                Video Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default StartPage;
