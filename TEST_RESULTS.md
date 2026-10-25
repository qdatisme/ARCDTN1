# Kiểm tra bản 04 — 25/10/2026

Đã kiểm tra trong phiên phát triển:
- 5 mô hình hiển thị được trong trình duyệt; đã xem trực quan màu/texture của mèo, chó, voi, sư tử và hươu.
- Xoay ngang và dọc bằng kéo chuột: mô hình xoay quanh tâm, không xoay quanh chân ở chế độ 360°.
- Các góc Từ trên/Từ dưới, xoay 180° và reset. Đã bỏ mặt đế hươu che phía dưới.
- Zoom bằng nút +/−, thanh zoom, bánh xe chuột; phần trăm thay đổi (thử 120% và 149%); reset về 100%.
- Kiểm thử logic Pointer Events với THREE thật: kéo hai chiều, pinch hai con trỏ, giới hạn 40%–300%, kết thúc/cancel pointer, reset, chuyển mô hình và mất marker. Đây là thử phần mềm, không phải thử cảm ứng iPhone thật.
- Nguồn ảnh tĩnh chạy cùng mã AR: nhận thẻ mèo, zoom lên 120%, reset về 100%, liên kết Xem 360° mở đúng thẻ 1 và có đường quay lại camera.
- 5 GLB có header/chiều dài/chunk và bufferView hợp lệ; các ảnh texture được nhúng, không cần file ảnh bên ngoài. Không yêu cầu decoder Draco/Meshopt.
- JavaScript đã qua kiểm tra cú pháp; Vercel config giữ nguyên bản trước.

Chưa thực hiện: camera webcam vật lý của bản 04; camera Safari/iPhone; pinch thực tế trên điện thoại; URL Vercel Production mới. Cần bổ sung vào nhật ký thiết bị sau khi triển khai.
