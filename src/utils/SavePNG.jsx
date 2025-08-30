 const savePNG = async () => {
        try {
            const element = document.getElementById('report-content');
            const canvas = await html2canvas(element, { scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const fileName = `Bao_cao_${currentTime.toLocaleDateString('vi-VN')}.png`;

            // Detect iOS Safari
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isIOS) {
                // Trên iOS Safari không hỗ trợ download -> mở tab mới
                window.open(dataUrl, '_blank');
                toast.success('Đang mở ảnh trong tab mới, bạn hãy nhấn giữ để lưu về máy');
            } else {
                // Browser bình thường: tải trực tiếp
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Xuất PNG thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xuất PNG:', error);
            toast.error('Xuất PNG thất bại:' + error);
        }
    };