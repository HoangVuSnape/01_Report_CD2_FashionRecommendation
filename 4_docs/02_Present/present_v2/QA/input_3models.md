Edited Fashion%20RecSys%20Speaker%20Notes_v2.md
Viewed 03_models_pseudocode.md:10-30

Dựa vào cây thư mục dữ liệu `output_10k_sample` của bạn, dưới đây là phân loại chi tiết các tập tin mà mỗi mô hình sẽ thực hiện nạp (load) trong quá trình khởi tạo và huấn luyện:

---

### I. Các file dùng chung (Mô hình nào cũng bắt buộc load)
Đây là các file dữ liệu tương tác gốc và đồ thị tương tác dùng chung cho cả 3 mô hình [CombiGCN](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/combigcn.py#L18), [FREEDOM](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/freedom.py#L99), và [BM3](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/bm3.py#L33):

1.  **`train.txt`:** Dữ liệu tương tác User-Item tập train (dùng để đếm số lượng node, lấy mẫu cặp tích cực/tiêu cực).
2.  **`test.txt`:** Dữ liệu tương tác tập test (dùng để chạy đánh giá mô hình định kỳ).
3.  **`s_interaction_adj_mat.npz`:** Ma trận kề tương tác chuẩn hóa đối xứng (đồ thị tương tác User-Item dùng chung để lan truyền CF).

---

### II. Các file nạp riêng cho từng mô hình

#### 1. Mô hình [CombiGCN](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/combigcn.py#L18)
CombiGCN sử dụng ma trận tương đồng nội dung được tính sẵn từ trước (dưới dạng đồ thị thưa kề) và **không nạp vector đặc trưng gốc**. Tùy thuộc vào tham số chọn `--sim_type`, mô hình sẽ nạp **1 trong các file sau**:

*   Nếu chạy **`--sim_type tfidf`**: Nạp file **`s_tfidf_item_similarity_adj_mat.npz`**
*   Nếu chạy **`--sim_type img_only`**: Nạp file **`s_img_similarity_adj_mat.npz`**
*   Nếu chạy **`--sim_type multimodal`**:
    *   Với fusion Late (mặc định): Nạp file **`s_multimodal_late_fusion_similarity_adj_mat.npz`**
    *   Với fusion Attention: Nạp file **`s_multimodal_attention_similarity_adj_mat.npz`**
*   Nếu chạy **`--sim_type none`** (chạy LightGCN thuần): **Không nạp thêm file nào** ngoài 3 file dùng chung ở mục I.

---

#### 2. Mô hình [FREEDOM](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/freedom.py#L99)
FREEDOM tự dựng đồ thị kNN nội dung trực tiếp khi khởi tạo và tự chiếu tuyến tính đặc trưng, do đó nó **bắt buộc nạp trực tiếp các file vector thô dạng `.npy`**:

*   **`image_embeddings.npy`** (Vector đặc trưng ảnh thô của Items - CLIP/MobileNetV2).
*   **`text_embeddings.npy`** (Vector đặc trưng văn bản thô của Items - BERT/TF-IDF).

*(Lưu ý: Nếu cấu hình chạy `--sim_type img_only` thì chỉ load `image_embeddings.npy`; nếu chọn `tfidf` thì chỉ load `text_embeddings.npy`; nếu chọn `multimodal` hoặc `multimodal_attention` thì load cả 2 file).*

---

#### 3. Mô hình [BM3](file:///e:/DoCode/CD2/source/Source/get_hrs_rs/rs/lightgcn_pyg/models/bm3.py#L33)
BM3 không dựng đồ thị nội dung nhưng vẫn cần các vector thô để đưa qua lớp Linear Projector để thực hiện học đối lập Bootstrap, do đó nó nạp các file **y hệt mô hình FREEDOM**:

*   **`image_embeddings.npy`** (Vector đặc trưng ảnh thô).
*   **`text_embeddings.npy`** (Vector đặc trưng văn bản thô).

*(Quy tắc nạp file theo `--sim_type` tương tự mô hình FREEDOM).*