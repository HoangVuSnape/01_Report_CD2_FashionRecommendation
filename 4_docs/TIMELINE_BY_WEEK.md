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
  - Cấu hình tăng tốc xử lý ảnh (GPU acceleration)
  - Đánh giá model qua Precision@K, Recall@K
  - Xây dựng, tích hợp logic CF/CBF/hybrid và API recommendation
  - Refactor frontend Next.js v2 & backend FastAPI/.NET
- Công việc đã làm: 
  - ✅ Tích hợp logic CF/CBF/hybrid và API recommendation (nhánh `se_recomendation`)
  - ✅ Viết script export checkpoint LightGCN phục vụ pipeline offline
  - ✅ Cập nhật frontend Next.js v2, dashboard admin và backend FastAPI/.NET (nhánh `refact_code_v2`)
  - ✅ Đánh giá model qua Precision@K, Recall@K và tối ưu tăng tốc GPU
  - ⚠️ Hạn chế: Dữ liệu đầu vào cần điều chỉnh theo schema mới, cần chuẩn hóa code Python theo mô hình Domain/Service/Repository
- % hoàn thành: 90% 

---

# Tuần 7
- Từ: 20/4/2026
- Đến: 26/4/2026
- Công việc cần làm: 
  - Hoàn thiện API lưu trữ lịch sử người dùng và cache kết quả tìm kiếm phổ biến
  - Cấu hình Supabase lưu trữ user login
  - Chỉnh sửa schema, data mapping & thiết kế pipeline agentic fashion
  - Demo workflow upload, gợi ý, recommend của model
- Công việc đã làm: 
  - ✅ Hoàn thiện API lưu trữ lịch sử và cơ chế cache kết quả tìm kiếm
  - ✅ Cấu hình Supabase cho xác thực người dùng (login)
  - ✅ Chỉnh sửa schema, data mapping và phác thảo pipeline agentic fashion
  - ✅ Demo thành công workflow upload và recommendation
- % hoàn thành: 90% 

---

# Tuần 8
- Từ: 27/4/2026
- Đến: 3/5/2026
- Công việc cần làm: 
  - Viết tài liệu thiết kế API và tài liệu định hướng luồng Offline/Online Recommendation
  - Thiết lập API Gateway (Nginx) và cấu hình phân quyền JWT (CUSTOMER, ADMIN)
  - Cập nhật DB (Complaint, Request Withdraw, Voucher) và tối ưu Dockerfile/docker-compose
  - 🔴 **ĐIỂM QUAY**: Đánh giá hướng đi theo ý kiến GVHD (tập trung đào sâu recommendation thực nghiệm thay vì ứng dụng)
- Công việc đã làm: 
  - ✅ Hoàn thành bộ tài liệu: API Design, API Gap Analysis, Router Refactoring Guide, Implementation Plan
  - ✅ Phân tích luồng Offline (tính toán trước embeddings, FAISS index, LightGCN weights) & Online (giảm độ trễ)
  - ✅ Cấu hình phân quyền JWT và tinh chỉnh Docker/docker-compose
  - ⏳ Đang cập nhật DB theo schema mới và debug lỗi API gateway
- % hoàn thành: 75%
- **Ghi chú**: Sau ngày 5/5, GVHD đề nghị tập trung vào "recommendation đào sâu thực nghiệm" thay vì ứng dụng 

---

# Tuần 9
- Từ: 4/5/2026
- Đến: 10/5/2026
- Công việc cần làm: 
  - Xây dựng và hoàn thiện pipeline xử lý dữ liệu mẫu 10k (User-Centric Sampling)
  - Trích xuất đặc trưng hình ảnh (MobileNetV2, CLIP) và tiền xử lý dữ liệu chuẩn hóa
  - Thiết kế các cơ chế fusion (Mean, Max, Weight Attention) kết hợp đặc trưng hình ảnh và văn bản trên LightGCN
- Công việc đã làm: 
  - ✅ Hoàn thành pipeline trích xuất đặc trưng ảnh (1280-D bằng MobileNetV2 và CLIP) và chuẩn hóa ảnh trực diện
  - ✅ Tối ưu hóa dữ liệu: chuyển đổi ID sang số nguyên và Datetime sang UNIX timestamp
  - ✅ Tích hợp kiến trúc LightGCN cốt lõi và thiết lập các chiến lược fusion đa phương thức
- % hoàn thành: 90%

---

# Tuần 10
- Từ: 11/5/2026
- Đến: 17/5/2026
- Công việc cần làm: 
  - Thực thi huấn luyện và đánh giá thực nghiệm các mô hình
  - So sánh 24 cấu hình thử nghiệm khác nhau
  - Phân tích các câu hỏi nghiên cứu (RQ1 - RQ4) để tìm ra mô hình tối ưu
- Công việc đã làm: 
  - ✅ Đánh giá thực nghiệm 3 mô hình (BM3, CombiGCN, FREEDOM) và 2 encoder (MobileNetV2, CLIP) với 4 cơ chế fusion trên tập dữ liệu (553 users, 2.194 items)
  - ✅ Xác định MobileNetV2 trích xuất đặc trưng thời trang tốt hơn CLIP
  - ✅ Xác định cơ chế Multimodal (Late Fusion) là tốt nhất; attention gây nhiễu trên tập dữ liệu nhỏ
  - ✅ Kết luận BM3 là mô hình hiệu quả nhất (vượt CombiGCN +18% ở K=5, gấp đôi FREEDOM)
  - ✅ Chọn cấu hình tối ưu: BM3 + MobileNetV2 + Multimodal (Late Fusion)
- % hoàn thành: 95%

---

# Tuần 11
- Từ: 18/5/2026
- Đến: 24/5/2026
- Công việc cần làm: 
  - Viết các chương cốt lõi của báo cáo (Chương 2, 3, 4)
  - Thiết kế sơ đồ quy trình hệ thống (workflow diagrams) cho Chương 3
  - Tổng hợp, lọc dữ liệu thực nghiệm cho Chương 4
- Công việc đã làm: 
  - ✅ Hoàn thành bản nháp Chương 2 (Cơ sở lý thuyết)
  - ✅ Vẽ sơ đồ quy trình hệ thống và pipeline dữ liệu cho Chương 3
  - ✅ Lọc và chuẩn bị dữ liệu thực nghiệm để đưa vào Chương 4
  - ✅ Chuyển repository báo cáo sang GitHub cục bộ do giới hạn biên dịch của Overleaf
- % hoàn thành: 90%

---

# Tuần 12
- Từ: 25/5/2026
- Đến: 31/5/2026
- Công việc cần làm: 
  - Hoàn thiện nội dung chi tiết của cả 5 chương trong báo cáo nghiên cứu
  - Tối ưu hóa cấu trúc tài liệu và rà soát kỹ thuật
- Công việc đã làm: 
  - ✅ Hoàn thành Chương 1 (Thách thức, mục tiêu & phạm vi nghiên cứu)
  - ✅ Hoàn thành Chương 3 (Pipeline tiền xử lý với bộ lọc N-core N=5, Temporal Split và lý thuyết 3 mô hình)
  - ✅ Hoàn thành Chương 4 (Cấu hình thực nghiệm, bảng kết quả, biểu đồ radar K=1,5,10,20 và Ablation study)
  - ✅ Hoàn thành Chương 5 (Tổng hợp kết luận: MobileNetV2 > CLIP, Late Fusion ổn định và các hạn chế)
- % hoàn thành: 95%

---

# Tuần 13
- Từ: 1/6/2026
- Đến: 7/6/2026
- Công việc cần làm: 
  - Rà soát toán học, lỗi chính tả và định dạng báo cáo
  - Chuẩn bị chương trình chạy thử nghiệm (Demo)
  - Xây dựng slide thuyết trình thử nghiệm
- Công việc đã làm: 
  - ✅ Rà soát toàn diện công thức toán học, lỗi chính tả, định dạng báo cáo 5 chương
  - ✅ Hoàn thiện chương trình Demo chạy thử nghiệm hệ thống
  - ✅ Thiết kế slide thuyết trình phục vụ báo cáo
- % hoàn thành: 95%

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
