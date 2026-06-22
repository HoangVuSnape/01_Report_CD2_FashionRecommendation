Dưới đây là bảng tổng hợp ngắn gọn, súc tích toàn bộ các câu hỏi và câu trả lời trong phiên thảo luận của chúng ta, giúp bạn dễ dàng lưu lại làm tài liệu tham khảo nhanh:

---

### 1. Luồng dự đoán trong sơ đồ BM3 là 1 chiều hay 2 chiều?
*   **Trả lời:** Là **mũi tên một chiều (bất đối xứng)** từ Online sang Target (qua Predictor và ngắt gradient bằng `detach()`). Chiều đi cụ thể: CF $\to$ Predictor $\to$ Modal và Modal $\to$ Predictor $\to$ Target CF.

### 2. Công thức Loss của BM3 và cơ chế cập nhật tham số ra sao?
*   **BPR Loss:** $-\ln \sigma(\hat{y}_{ui} - \hat{y}_{uj})$ với điểm dự đoán $\hat{y}_{ui} = \mathbf{h}_u^{\text{cf}} \cdot (\mathbf{h}_i^{\text{cf}} + \mathbf{h}_i^{\text{modal}})$.
*   **Bootstrap Loss:** $2.0 - 2.0 \cdot \cos(\text{Predictor}(z_{\text{online}}), z_{\text{target}})$.
*   **Cơ chế cập nhật:** Nhánh Online (ID Embeddings, Projectors, Predictor) cập nhật bằng **Gradient Descent**. Nhánh Target CF cập nhật bằng động lượng **EMA** (không có gradient).

### 3. Predictor (khối màu xanh lá ở giữa) là gì?
*   **Trả lời:** Là một **mạng nơ-ron mini phi tuyến** (MLP 2 lớp: Linear $\to$ ReLU $\to$ Linear) có các trọng số tự học, dùng để biến đổi vector đầu vào trước khi so khớp nhằm tạo rào cản thông tin và ngăn ngừa sụp đổ biểu diễn (representation collapse).

### 4. Tại sao cần khởi tạo ID Embeddings ngẫu nhiên khi đã có ma trận tương tác?
*   **Trả lời:** Ma trận tương tác chỉ là "bản đồ kết nối" (chứa các số 0 và 1 tĩnh). ID Embeddings ngẫu nhiên ban đầu đóng vai trò làm "tọa độ xuất phát" của User/Item trong không gian vector đa chiều, làm tiền đề để thuật toán điều chỉnh (xoay/dịch chuyển) nhằm cá nhân hóa gu sở thích qua quá trình huấn luyện.

### 5. Dòng code `all_layers = [ego]` trong CombiGCN/LightGCN nghĩa là gì?
*   **Trả lời:** Là khởi tạo danh sách lưu lại đặc trưng của tất cả các lớp lan truyền (từ Layer 0 đến Layer L) để cuối cùng tính trung bình cộng (Mean pooling). Việc này giúp tích hợp thông tin đa tầng (hàng xóm gần và xa) đồng thời tránh hiện tượng quá mượt (Over-smoothing).

### 6. Ma trận `interaction_adj` được tính toán như thế nào?
*   **Trả lời:** **(Trong 2 câu):** Đầu tiên, ma trận tương tác User-Item thô được ghép với ma trận chuyển vị của nó để tạo thành một ma trận kề lưỡng phân biểu diễn toàn bộ đồ thị. Sau đó, ma trận này được chuẩn hóa đối xứng bằng cách chia mỗi giá trị liên kết cho căn bậc hai của tích bậc kết nối (số lượng tương tác) của User và Item tương ứng.

### 7. Nhánh CF của cả 3 mô hình có phải đều dùng LightGCN không?
*   **Trả lời:** **Đúng.** Cả 3 mô hình đều sử dụng phép nhân ma trận kề tối giản của LightGCN (không có trọng số GCN và hàm phi tuyến) ở nhánh CF để học hành vi tương tác lịch sử ổn định nhất.

### 8. Phân loại các file dữ liệu mà mỗi mô hình nạp vào khi huấn luyện?
*   **Cả 3 mô hình đều load chung:** `train.txt`, `test.txt`, `s_interaction_adj_mat.npz`.
*   **[CombiGCN](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/combigcn.py):** Nạp thêm ma trận tương đồng tĩnh dạng `.npz` tùy cấu hình (ví dụ: `s_multimodal_late_fusion_similarity_adj_mat.npz`).
*   **[FREEDOM](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/freedom.py) và [BM3](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/bm3.py):** Nạp trực tiếp các file vector đặc trưng thô dạng `.npy` (`image_embeddings.npy`, `text_embeddings.npy`).

### 9. Làm sao đặc trưng thô khác chiều (ảnh CLIP 512, chữ BERT 768) dung hợp được với nhau?
*   **Trả lời:** Nhờ các bộ chiếu tuyến tính riêng biệt (`nn.Linear`) chiếu cả hai về cùng một số chiều đích 512 của GNN trước khi thực hiện phép cộng hợp trung bình.

### 10. Lớp `nn.Linear(768, 512)` là phép chiếu hay là một vector?
*   **Trả lời:** Là một **phép chiếu tuyến tính** (thực thi qua phép nhân ma trận $\mathbf{y} = \mathbf{x}\mathbf{W} + \mathbf{b}$ với ma trận trọng số $\mathbf{W}$ kích thước $[768 \times 512]$), đóng vai trò xoay và dịch chuyển hệ tọa độ đặc trưng thô về không gian GNN.

---

*Toàn bộ phần phân tích sâu và mã giả chi tiết của cả 3 mô hình đã được lưu tại file: [pseudo_code_v2.md](file:///E:/DoCode/CD2/source/Source/get_hrs_rs/rs/Docs/data_toModel/pseudo_code_v2.md).*