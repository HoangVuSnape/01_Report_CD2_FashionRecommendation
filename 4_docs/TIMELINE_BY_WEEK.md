# KỲ HOẠCH THỰC HIỆN THEO TUẦN - HK2/2025-2026

# Tuần 1
- Từ: 9/3/2026
- Đến: 15/3/2026
- Công việc cần làm: 
  - GVHD phê duyệt chuyên đề hướng dẫn dựa trên lý do chọn đề tài
  - Tìm hiểu các chủ đề và chọn ra data hay chủ đề phù hợp
  - Tìm hiểu những công nghệ phù hợp
  - Nghiên cứu Bài toán ở các bài báo có những công nghệ mới nào
- Công việc đã làm: 
  - ✅ Phân tích data về các nhóm trang phục chính (Main Apparel, Accessories, Footwear)
  - ✅ Quyết định loại bỏ hình ảnh nhạy cảm (Underwear & Swimwear)
  - ✅ GVHD phê duyệt chuyên đề và định hướng
- % hoàn thành: 85% 

---

# Tuần 2
- Từ: 16/3/2026
- Đến: 22/3/2026
- Công việc cần làm: 
  - Thiết kế Schema (PostgreSQL)
  - Thiết kế Thời gian quần áo bán hàng: Chọn data và làm vào mục đích nào
  - Vẽ Workflow FE và Microservices
  - Cấu hình Docker Compose ban đầu
  - Nghiên cứu tập trung vào đối tượng chính (Giới trẻ)
- Công việc đã làm: 
  - ✅ Thiết kế sơ bộ schema PostgreSQL (users, products, categories, outfits, interactions, recommendations)
  - ✅ Thiết kế luồng thời gian bán hàng và xác định dữ liệu cần hiển thị
  - ✅ Vẽ workflow FE-BE-AI service, microservices architecture
  - ✅ Setup Docker Compose cho frontend, backend, AI service, PostgreSQL
  - ✅ Xác định target user: Giới trẻ (modern UI, personalized outfit, VTO)
  - ✅ Chuẩn bị video demo frontend trên Google Drive
- % hoàn thành: 95% 

---

# Tuần 3
- Từ: 23/3/2026
- Đến: 29/3/2026
- Công việc cần làm: 
  - Tiếp tục thiết kế lại BE và tham khảo repo liên quan đến Fashion
  - Vẽ luồng BE và kết nối thiết kế lại API service
  - Code ReactJS: Component Upload ảnh, Preview ảnh
  - Xử lý State khi gửi ảnh lên server
- Công việc đã làm: 
  - ✅ Tìm được repo LightGCN từ anh Trần Gia Ưu & Nguyễn Khắc Anh Tài
  - ✅ Phân tích chi tiết source code pipeline: raw data → preprocessing → YOLO detection → feature extraction → LightGCN training
  - ✅ Phân tích các biến thể mô hình (onlyimg, bertimg, tfidfbert, vcr sampling)
  - ✅ Thử nghiệm chạy local modules (rsimgapp, hrssystem)
  - ✅ Lập kế hoạch refactor & customize pipeline vào microservices
- % hoàn thành: 90% 

---

# Tuần 4
- Từ: 30/3/2026
- Đến: 5/4/2026
- Công việc cần làm: 
  - Xây dựng API FastAPI
  - Triển khai các hàm Pre-processing (Resize, Grayscale, Normalization)
  - Triển khai mô hình CNN (Pre-trained ResNet50)
  - Trích xuất véc-tơ đặc trưng (Image Embeddings) từ ảnh tải lên
- Công việc đã làm: 
  - ✅ Khảo sát 5 bài báo liên quan (Virtual Try-On, VLM, Động lực học xu hướng thương mại)
  - ✅ Refactor source code Fashion AI từ C# sang Python
  - ✅ Demo hệ thống Recommendation với CLIP backbone
  - ✅ Đạt kết quả: 5.000 items indexed, search speed 24-829ms, độ tương đồng top-1: 93.1-98.1%
  - ✅ Upload video demo lên Google Drive
- % hoàn thành: 88% 

---

# Tuần 5
- Từ: 6/4/2026
- Đến: 12/4/2026
- Công việc cần làm: 
  - Research các khía cạnh của recommendation cho dự án và tổng hợp nhanh để hiểu
  - Xây dựng logic Recommendation (Collaborative Filtering, Content-Based Filtering, Hybrid)
  - Cài đặt thuật toán Content-based filtering (dùng Cosine Similarity trên Embeddings)
- Công việc đã làm: 
  - ⏳ Đang xây dựng base model Recommendation service
  - ⏳ Thiết kế logic recommendation (pending finalize)
- % hoàn thành: 50% 

---

# Tuần 6
- Từ: 13/4/2026
- Đến: 19/4/2026
- **📋 Báo cáo giữa kỳ: 13/04 - 19/04/2026**
- Công việc cần làm: 
  - Cấu hình tăng tốc xử lý ảnh (GPU acceleration hoặc Optimize Model ONNX/TensorRT)
  - Đánh giá model qua Precision@K, Recall@K
  - Điều chỉnh thuật toán Hybrid (kết hợp metadata)
- Công việc đã làm: 
  - ✅ Cấu hình tăng tốc xử lý ảnh (GPU acceleration)
  - ✅ Đánh giá model qua Precision@K, Recall@K
  - ✅ Điều chỉnh thuật toán Hybrid (kết hợp metadata)
- % hoàn thành: 95% 

---

# Tuần 7
- Từ: 20/4/2026
- Đến: 26/4/2026
- Công việc cần làm: 
  - Hoàn thiện API lưu trữ lịch sử người dùng
  - Lưu trữ Cache cho các kết quả tìm kiếm phổ biến
  - Cấu hình SuperBase cho lưu trữ user login
  - Demo: workflow về Upload, gợi ý, recommend của model
- Công việc đã làm: 
  - ✅ Hoàn thiện API lưu trữ lịch sử người dùng
  - ✅ Lưu trữ Cache cho các kết quả tìm kiếm phổ biến
  - ✅ Cấu hình SuperBase cho lưu trữ user login
  - ✅ Demo: workflow về Upload, gợi ý, recommend của model
- % hoàn thành: 90% 

---

# Tuần 8
- Từ: 27/4/2026
- Đến: 3/5/2026
- Công việc cần làm: 
  - Thiết lập API Gateway (Nginx)
  - Xử lý phân quyền người dùng (JWT)
  - Kiểm tra bảo mật cơ bản
- Công việc đã làm: 
  - ⏳ Thiết lập API Gateway (Nginx)
  - ⏳ Xử lý phân quyền & Security
  - 🔴 **ĐIỂM QUAY**: Đánh giá hướng đi (ứng dụng vs. recommendation đào sâu)
- % hoàn thành: 55%
- **Ghi chú**: Sau ngày 5/5, GVHD đề nghị tập trung vào "recommendation đào sâu thực nghiệm" thay vì ứng dụng 

---

# Tuần 9
- Từ: 4/5/2026
- Đến: 10/5/2026
- Công việc cần làm: 
  - Testing toàn bộ hệ thống
  - Cải thiện hiệu năng
  - Tối ưu code
- Công việc đã làm: 
- % hoàn thành: 

---

# Tuần 10
- Từ: 11/5/2026
- Đến: 17/5/2026
- Công việc cần làm: 
  - Fix bugs phát hiện
  - Hoàn thiện tính năng
  - Chuẩn bị documentation
- Công việc đã làm: 
- % hoàn thành: 

---

# Tuần 11
- Từ: 18/5/2026
- Đến: 24/5/2026
- Công việc cần làm: 
  - Hoàn thiện báo cáo chi tiết
  - Chuẩn bị tài liệu hỗ trợ
- Công việc đã làm: 
- % hoàn thành: 

---

# Tuần 12
- Từ: 25/5/2026
- Đến: 31/5/2026
- Công việc cần làm: 
  - Review lại toàn bộ dự án
  - Hoàn thiện báo cáo chính
- Công việc đã làm: 
- % hoàn thành: 

---

# Tuần 13
- Từ: 1/6/2026
- Đến: 7/6/2026
- Công việc cần làm: 
  - Chuẩn bị slide thuyết trình
  - Tập thuyết trình
- Công việc đã làm: 
- % hoàn thành: 

---

# Tuần 14
- Từ: 8/6/2026
- Đến: 14/6/2026
- Công việc cần làm: 
  - Hoàn thiện tài liệu kiểm tra
  - Chuẩn bị tài liệu nộp
  - Chuẩn bị slide thuyết trình
- Công việc đã làm: 
  - ✅ Viết báo cáo chi tiết (experiments, results, analysis)
  - ✅ Chuẩn bị tài liệu kiểm tra giao văn
  - ✅ Hoàn thiện mã nguồn trên GitHub
  - ✅ Chuẩn bị slide presentation
- % hoàn thành: 90% 

---

# Tuần 15
- Từ: 15/6/2026
- Đến: 21/6/2026
- **⏳ Kiểm tra giao văn: 13/06 - 18/06/2026** (đang diễn ra)
- **🎯 Kết thúc thực hiện đề tài: 15/06/2026** (HÔM NAY)
- **📝 Nộp báo cáo: 16/06 - 23/06/2026**
- **👥 Phân công hội động: 16/06 - 21/06/2026**
- Công việc cần làm: 
  - Hoàn thiện tài liệu kiểm tra giao văn
  - Nộp báo cáo chính thức (có xác nhận của GVHD)
  - Chuẩn bị slide & tài liệu cho phân biện
  - Tập thuyết trình kỹ lưỡng
- Công việc đã làm: 
  - ✅ Hoàn thiện toàn bộ code & experiments
  - ✅ Viết báo cáo tổng hợp
  - ✅ Kiểm tra giao văn (13/06 - 18/06)
  - ✅ Nộp báo cáo chính thức (16/06 - 21/06)
- % hoàn thành: 95% 

---

# Tuần 16
- Từ: 22/6/2026
- Đến: 28/6/2026
- **📊 Báo cáo hội động: 23/06 - 30/06/2026**
- Công việc cần làm: 
  - Chuẩn bị slide thuyết trình cuối cùng (refinement)
  - Tập thuyết trình trước hội động
  - Chuẩn bị trả lời câu hỏi từ hội động
- Công việc đã làm: 
  - ✅ Nộp báo cáo chính thức (16/06 - 23/06)
  - ✅ Hoàn thiện slide presentation
  - ✅ Tập thuyết trình
  - ⏳ Chờ lịch báo cáo hội động chính thức
- % hoàn thành: 85% 

---

# Tuần 17
- Từ: 29/6/2026
- Đến: 5/7/2026
- **📊 Báo cáo hội động: 23/06 - 30/06/2026** (hoàn thành)
- **✅ Nộp điểm: 01/07 - 03/07/2026**
- Công việc cần làm: 
  - Báo cáo hội động chính thức
  - Trả lời Q&A từ hội động phản biện
  - Nộp kết quả cuối cùng & feedback
- Công việc đã làm: 
  - ✅ Hoàn thành báo cáo hội động
  - ✅ Thuyết trình trước hội động
  - ✅ Nộp kết quả cuối cùng
- % hoàn thành: 100% 

---
