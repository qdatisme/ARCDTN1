# Animal AR — bản 04: mô hình có texture, 360° và zoom

## Dùng ngay trên laptop
Giải nén toàn bộ. Tắt máy chủ cũ bằng Ctrl+C rồi nhấp đúp Start_AR.cmd, hoặc chạy py run.py. Trình duyệt mở http://127.0.0.1:8080/. Giữ cửa sổ máy chủ mở. Nếu còn giao diện cũ, Ctrl+F5.

## Xem 360°
Từ trang chủ chọn Xem 360° + Zoom, hoặc trong Camera AR chọn Xem 360° ở bảng thông tin. Con vật đang quét sẽ được chọn sẵn.
- Kéo chuột hoặc vuốt một ngón NGANG và DỌC để xoay tự do quanh tâm con vật.
- Lăn chuột hoặc chụm/tách hai ngón trong vùng mô hình để zoom.
- Có nút +/−, thanh thu phóng và hiển thị phần trăm. Giới hạn 40%–300%.
- Các nút Góc mặc định, Xoay 180°, Từ trên, Từ dưới giúp xem nhanh.
- Đặt lại đưa góc và zoom về mặc định 100%.
- Không có mặt sàn che góc nhìn dưới; mô hình hươu đã bỏ mặt đế của mẫu gốc.
- Chế độ 360° không dùng camera và không yêu cầu giữ marker. Không dùng nó thay cho demo nhận diện AR trực tiếp.

## Khi đang dùng camera AR
AR vẫn hiển thị mô hình trên thẻ. Kéo ngang để xoay quanh trục đứng; chụm hai ngón, lăn chuột hoặc dùng nút +/− để đổi kích thước. Muốn xem cả mặt trên/dưới, nhấn Xem 360°.
Giữ nguyên bộ 5 thẻ từ bản 03. Khi đổi thẻ, đưa thẻ cũ ra khỏi hình khoảng 1 giây rồi đưa thẻ mới vào. Mất hoặc đổi thẻ sẽ dừng âm và đặt lại góc/zoom.

## Mô hình
- Mèo: giữ Bicolor Cat của kenchoo, có texture lông.
- Chó: thay mẫu hình học bằng dog :] gltf của Godrex.
- Voi: thay bằng Elephant in the Rotunda của Abby Gancz, có texture da.
- Sư tử: thay bằng Lion của kenchoo, có chất liệu da/bờm.
- Hươu: thay bằng Giraffe của BlueMesh, có texture đốm da.
Các mẫu dùng tư thế tĩnh. Giảm ảnh texture tối đa 1536 px, bỏ clip hoạt ảnh không dùng và dữ liệu không tham chiếu. Mô hình được nạp khi chọn/nhận ra con vật, không tải đồng loạt cả 5 ngay lúc mở trang.
Mẫu chó dùng vật liệu specular-glossiness cũ; bản này đổi gần đúng sang metallic-roughness để chạy với trình duyệt hiện tại. Hươu đã sửa vật liệu da/lông sang phi kim và bỏ mặt đế. Đây là các mẫu minh họa 3D; không cam kết ảnh thật hoặc giải phẫu chính xác.

## Giấy phép cần giữ
Xem dist/credits.html và dist/assets/model-sources.json.
- Mèo © kenchoo, chó © Godrex, voi © Abby Gancz, hươu © BlueMesh: CC BY 4.0, cần ghi công.
- Sư tử © kenchoo: CC BY-NC-SA 4.0. Chỉ dùng phi thương mại và bản chỉnh sửa giữ cùng giấy phép. Gói này dành cho đồ án học tập. Không dùng mẫu sư tử này trong sản phẩm thương mại nếu chưa có quyền khác.
- Bản ghi âm và các thư viện giữ giấy phép ở bản trước. Nguồn và thay đổi bản WAV được ghi trong trang credits.
Không bỏ các file nguồn/giấy phép khi chia sẻ hoặc nộp bài.

## Vercel và iPhone
Cấu hình Vercel giữ nguyên: vercel.json tại gốc, Framework Other, Output Directory dist, không cần install/build. Xem DEPLOY_VERCEL.md.
Để cập nhật website, thay NỘI DUNG repository bằng nội dung gói mới (gồm vercel.json và dist), rồi Deploy/Redeploy. Không chỉ đưa file ZIP lên repository. Sau triển khai, mở URL Production HTTPS bằng Safari iPhone, cho phép camera. Mở bộ thẻ trên laptop hoặc dùng thẻ in.
Không có deployment Vercel mới được thực hiện trong phiên sửa này. Chưa kiểm thử bản 04 trên Safari iPhone thật.

## Các điểm còn cần kiểm thử thực tế
Kiểm tra camera iPhone 15 Pro Max, quyền camera, khoảng cách 25/50 cm, ánh sáng, mất/nhận lại thẻ, xoay dọc/ngang, chụm hai ngón và tải mô hình trên mạng di động. TEST_RESULTS.md chỉ liệt kê các phép thử thật đã làm; không coi kiểm thử ảnh tĩnh hay thao tác chạm giả lập là kiểm thử camera iPhone.
Âm voi hiện là bản ghi voi châu Á, minh họa họ voi; mô hình là voi châu Phi. Cần thay nếu báo cáo đòi khớp chính xác loài.
Báo cáo, slide và nhật ký nghiệm thu thiết bị chưa nằm trong gói này.
