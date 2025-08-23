import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';

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

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatMoney = (value) => (value ? Number(value).toLocaleString('vi-VN') : '');

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
        try {
            const element = document.getElementById("report-content");
            if (!element) {
                throw new Error("Không tìm thấy nội dung báo cáo để xuất PDF");
            }

            const opt = {
                margin: 0.5,
                filename: `Bao_cao_${new Date().toLocaleDateString("vi-VN")}.pdf`,
                image: { type: "png", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            };

            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Lỗi khi xuất PDF:", error);
            toast.error("❌ Xuất PDF thất bại: " + error.message);
        }
    };

    const savePNG = async () => {
        try {
            const element = document.getElementById("report-content");
            if (!element) {
                throw new Error("Không tìm thấy nội dung báo cáo để xuất PNG");
            }

            const canvas = await html2canvas(element, { scale: 2 });
            const blob = await new Promise((res, rej) =>
                canvas.toBlob((b) => (b ? res(b) : rej(new Error("Không thể tạo ảnh"))), "image/png")
            );

            const fileName = `Bao_cao_${new Date().toLocaleDateString("vi-VN")}.png`;

            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [new File([blob], fileName, { type: "image/png" })],
                })
            ) {
                await navigator.share({
                    files: [new File([blob], fileName, { type: "image/png" })],
                    title: "Báo cáo doanh thu",
                    text: "Xem báo cáo doanh thu trong ca",
                });
            } else {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Lỗi khi xuất PNG:", error);
            toast.error("❌ Xuất PNG thất bại: " + error.message);
        }
    };


    return (
        <div className="d-flex min-vh-100 justify-content-center align-items-center p-3" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="card shadow w-100 position-relative" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(145deg, #ffffff 0%, #e6f0ff 100%)' }}>
                <div className="p-3 border-bottom d-flex justify-content-start">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => window.history.back()}>Back</button>
                </div>

                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Báo cáo doanh thu trong ca</h2>

                    <div id="report-content">
                        <div className="mb-4 text-center">
                            <p className="text-secondary fs-6 mb-1 fw-bold">
                                Ngày: <span className="text-danger">{currentTime.toLocaleDateString('vi-VN')}</span>
                            </p>
                            <p className="fw-bold text-primary fs-1 mb-0">{currentTime.toLocaleTimeString('vi-VN')}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Nhân viên</label>
                            <input type="text" value={startName} readOnly className="form-control text-center" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Két (Tiền đầu ca)</label>
                            <input type="text" value={formatMoney(startMoney)} readOnly className="form-control text-danger fw-bold text-center" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Đá</label>
                            <input type="text" value={formatMoney(iceCost)} onChange={(e) => setIceCost(e.target.value.replace(/\D/g, ''))} className="form-control text-center" placeholder="Nhập chi phí đá" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Nguyên liệu</label>
                            <input type="text" value={formatMoney(materialCost)} onChange={(e) => setMaterialCost(e.target.value.replace(/\D/g, ''))} className="form-control text-center" placeholder="Nhập chi phí nguyên liệu" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">*Trái cây</label>
                            <input type="text" value={formatMoney(fruitCost)} onChange={(e) => setFruitCost(e.target.value.replace(/\D/g, ''))} className="form-control text-center" placeholder="Nhập chi phí trái cây" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Chuyển khoản</label>
                            <input type="text" value={formatMoney(transferAmount)} onChange={(e) => setTransferAmount(e.target.value.replace(/\D/g, ''))} className="form-control text-center" placeholder="Nhập số tiền chuyển khoản" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Tổng chi (các mục có dấu *)</label>
                            <input type="text" value={formatMoney(totalCost)} readOnly className="form-control text-center" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Doanh thu</label>
                            <input type="text" value={formatMoney(revenue)} onChange={(e) => setRevenue(e.target.value.replace(/\D/g, ''))} className="form-control text-center" placeholder="Nhập doanh thu" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Giao ca</label>
                            <input type="text" value={formatMoney(matchedShift) + ' VND'} readOnly className="form-control text-center fw-bold text-danger fs-5" />
                        </div>
                    </div>

                    <div className="d-grid mt-4 gap-2">
                        <button className="btn btn-success btn-lg" onClick={savePDF}>Xuất PDF</button>
                        <button className="btn btn-primary btn-lg" onClick={savePNG}>Xuất PNG</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalPage;
