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
            toast.success('Xuất PDF thành công');

        } catch (error) {
            console.error("Lỗi khi xuất PDF:", error);
            toast.error("Xuất PDF thất bại: " + error.message);
        }
    };