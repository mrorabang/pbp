import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const FinalPage = () => {
    const [startName, setStartName] = useState('');
    const [startMoney, setStartMoney] = useState('');
    const [iceCost, setIceCost] = useState('');
    const [materialCost, setMaterialCost] = useState('');
    const [fruitCost, setFruitCost] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [revenue, setRevenue] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const savedName = localStorage.getItem('startName') || '';
        const savedMoney = localStorage.getItem('startMoney') || '';

        setStartName(savedName);
        setStartMoney(savedMoney);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatMoney = (value) => {
        if (!value) return '';
        return Number(value).toLocaleString('vi-VN');
    };

    const totalCost =
        Number(iceCost.replace(/\D/g, '')) +
        Number(materialCost.replace(/\D/g, '')) +
        Number(fruitCost.replace(/\D/g, ''));

    const matchedShift =
        Number(startMoney) +
        Number(revenue.replace(/\D/g, '')) -
        totalCost -
        Number(transferAmount.replace(/\D/g, ''));

    const savePDF = () => {
        const input = document.getElementById('report-content');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Bao_cao_doanh_thu_${currentTime.toLocaleDateString('vi-VN')}.pdf`);
        });
    };

    const savePNG = () => {
        const input = document.getElementById('report-content');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `Bao_cao_doanh_thu_${currentTime.toLocaleDateString('vi-VN')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div
            className="d-flex min-vh-100 justify-content-center align-items-center p-3"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
        >
            <div
                className="card shadow w-100 position-relative"
                style={{
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    background: 'linear-gradient(145deg, #ffffff 0%, #e6f0ff 100%)'
                }}
            >
                {/* Nút Back góc trái */}
                <button
                    className="btn btn-outline-secondary fs-6 position-absolute"
                    style={{ top: '10px', left: '10px' }}
                    onClick={() => window.history.back()}
                >
                    Back
                </button>

                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Báo cáo doanh thu trong ca</h2>

                    <div id="report-content">
                        <div className="mb-4 text-center">
                            <p className="text-secondary fs-6 mb-1 fw-bold">
                                Ngày:<span className='text-danger'> {currentTime.toLocaleDateString('vi-VN')}</span>
                            </p>
                            <p className="fw-bold text-primary fs-1 mb-0">{currentTime.toLocaleTimeString('vi-VN')}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Nhân viên</label>
                            <input type="text" value={startName} readOnly className="form-control text-center" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Két (Tiền đầu ca):</label>
                            <input
                                type="text"
                                value={formatMoney(startMoney)}
                                readOnly
                                className="form-control text-danger fw-bold text-center"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Đá:</label>
                            <input
                                type="text"
                                value={formatMoney(iceCost)}
                                onChange={(e) => setIceCost(e.target.value.replace(/\D/g, ''))}
                                className="form-control text-center"
                                placeholder="Nhập chi phí đá"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Nguyên liệu:</label>
                            <input
                                type="text"
                                value={formatMoney(materialCost)}
                                onChange={(e) => setMaterialCost(e.target.value.replace(/\D/g, ''))}
                                className="form-control text-center"
                                placeholder="Nhập chi phí nguyên liệu"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Trái cây:</label>
                            <input
                                type="text"
                                value={formatMoney(fruitCost)}
                                onChange={(e) => setFruitCost(e.target.value.replace(/\D/g, ''))}
                                className="form-control text-center"
                                placeholder="Nhập chi phí trái cây"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Chuyển khoản:</label>
                            <input
                                type="text"
                                value={formatMoney(transferAmount)}
                                onChange={(e) => setTransferAmount(e.target.value.replace(/\D/g, ''))}
                                className="form-control text-center"
                                placeholder="Nhập số tiền chuyển khoản"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Tổng chi: (là các mục có dấu *)</label>
                            <input type="text" value={formatMoney(totalCost)} readOnly className="form-control text-center" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Doanh thu:</label>
                            <input
                                type="text"
                                value={formatMoney(revenue)}
                                onChange={(e) => setRevenue(e.target.value.replace(/\D/g, ''))}
                                className="form-control text-center"
                                placeholder="Nhập doanh thu"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Giao ca</label>
                            (Tiền đầu ca + Doanh thu - Tổng chi - Chuyển khoản)
                            <input
                                type="text"
                                value={formatMoney(matchedShift) + " VND"}
                                readOnly
                                className="form-control text-center fw-bold text-danger fs-5"
                            />
                        </div>
                    </div>

                    <div className="d-grid mt-4 gap-2">
                        <button className="btn btn-success btn-lg" onClick={savePDF}>
                            Xuất PDF
                        </button>
                        <button className="btn btn-primary btn-lg" onClick={savePNG}>
                            Xuất PNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalPage;
