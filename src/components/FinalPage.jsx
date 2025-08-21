import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StartPage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [name, setName] = useState('');
    const [initialMoney, setInitialMoney] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="d-flex vh-100 justify-content-center align-items-center p-3"
            style={{
                // Gradient pastel nhẹ
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <div
                className="card shadow w-100"
                style={{
                    maxWidth: '480px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #e6f0ff 100%)',
                }}
            >
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Kết ca cùng tôi nhé </h2>

                    {/* Đồng hồ nổi bật */}
                    <div className="mb-4 text-center">
                        {/* Ngày */}
                        <p className="text-secondary fs-6 mb-1">
                            {currentTime.toLocaleDateString('vi-VN')}
                        </p>
                        {/* Giờ */}
                        <p className="fw-bold text-primary fs-3 mb-0">
                            {currentTime.toLocaleTimeString('vi-VN')}
                        </p>
                    </div>

                    {/* Họ tên */}
                    <div className="mb-4">
                        <label className="form-label fw-bold fs-5">Họ tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control form-control-lg"
                            placeholder="Nhập họ tên"
                        />
                    </div>

                    {/* Tiền đầu ca */}
                    <div className="mb-4">
                        <label className="form-label fw-bold fs-5">Tiền đầu ca (VND)</label>
                        <input
                            type="number"
                            value={initialMoney}
                            onChange={(e) => setInitialMoney(e.target.value)}
                            className="form-control form-control-lg"
                            placeholder="Nhập số tiền"
                        />
                    </div>

                    <div className="d-grid mt-4">
                        <button className="btn btn-primary btn-lg">Bắt đầu ca</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
