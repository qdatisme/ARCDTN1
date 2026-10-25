# Đưa Animal AR lên Vercel

## Cấu trúc cần giữ
Thư mục gốc chứa vercel.json, README.md, DEPLOY_VERCEL.md, run.py và thư mục dist. Bên trong dist có index.html, scan.html, assets, vendor và các file JS/CSS.
Vercel sẽ đưa NỘI DUNG dist lên gốc website. Đường dẫn chạy là https://ten-project.vercel.app/, không thêm /dist/.

## Cách 1: GitHub và giao diện Vercel
1. Giải nén toàn bộ gói này vào một thư mục riêng.
2. Tạo repository GitHub, đưa toàn bộ NỘI DUNG thư mục này lên repository. Phải nhìn thấy vercel.json và dist ở cùng một cấp tại gốc repository. Không tải riêng file ZIP lên repository.
3. Trong Vercel, chọn Add New -> Project và import repository đó.
4. Framework Preset: Other. Root Directory: thư mục có vercel.json (mặc định . nếu bạn tải đúng cấu trúc).
5. Output Directory: dist. Build Command: để trống / không chạy. Install Command: để trống / không chạy. vercel.json đã khai báo các giá trị này.
6. Nhấn Deploy, chờ trạng thái Ready. Mở URL Production được Vercel trả về, ví dụ https://ten-project.vercel.app/.
7. Trên iPhone, mở URL đó bằng Safari trực tiếp, chọn Mở camera AR, cho phép camera. Dùng laptop mở Bộ 5 thẻ hoặc dùng thẻ in để quét.

Không đổi Root Directory thành dist nếu đang dùng cấu hình vercel.json ở cấp trên. Không đặt Output Directory thành public, build hoặc ./dist/dist.

## Cách 2: Vercel CLI từ Windows
Cần Node.js LTS và tài khoản Vercel. Mở Terminal tại chính thư mục có vercel.json và chạy:

    npx vercel@latest --prod

Đăng nhập khi CLI yêu cầu; tạo hoặc chọn project phù hợp. Deploy thư mục hiện tại (./), không chọn riêng dist. Cấu hình static đã được khai báo trong vercel.json. Không cần cài Unity hoặc Xcode.

Nếu muốn thử Preview trước: dùng npx vercel@latest. Để dùng trên điện thoại, nên kiểm tra URL Production; Preview có thể yêu cầu đăng nhập tùy tài khoản/cấu hình dự án.

## Kiểm tra sau triển khai
- / -> giao diện Animal AR, không phải 404.
- /marker.html -> đủ 5 thẻ.
- /preview.html -> đổi và xoay được 5 mô hình.
- /scan.html -> Safari hỏi quyền camera và mở camera sau khi được cho phép.
- /assets/models/cat.glb -> trả file mô hình, không trả HTML.
- /assets/markers/1.patt -> trả dữ liệu pattern.
- Thử quét 1..5, nghe tiếng kêu, mất thẻ/nhận lại. Khi đổi thẻ, đưa thẻ cũ ra ngoài hình khoảng 1 giây.

Nếu trang gốc 404, kiểm tra Root Directory có vercel.json và Output Directory là dist. Nếu mô hình không tải, đảm bảo assets và vendor đã được đưa đầy đủ lên repository; không sửa tên thư mục hoặc chữ hoa/thường.

Đưa lên web thành công không thay thế kiểm thử trên iPhone. Chưa có kết quả camera iPhone thực tế trong gói này. Xem TEST_RESULTS.md để phân biệt các bước đã thử và chưa thử.

## Cấu hình đã thêm
- framework: null (Other), outputDirectory: dist.
- buildCommand và installCommand rỗng vì đây là website tĩnh đã có đủ file.
- Không có server Python trên Vercel: run.py chỉ phục vụ kiểm tra laptop.
- Giữ URL .html và đường dẫn tương đối hiện có; không dùng rewrite gom mọi đường dẫn về index.html, tránh che lỗi thiếu mô hình.
- Khai báo kiểu nội dung GLB, pattern và calibration; camera được dùng trên chính origin website.
- Các thư viện, mô hình, âm thanh và font có sẵn trong dist.

## Tài liệu chính thức
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/deployments/overview
