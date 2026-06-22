# Glossary - Fashion RecSys Presentation

Tài liệu này cung cấp định nghĩa và giải thích ngắn gọn cho các thuật ngữ chuyên ngành, kiến trúc mô hình, và các chỉ số đánh giá được sử dụng trong slide thuyết trình đề tài **"Tích hợp biểu diễn đa phương thức vào hệ thống gợi ý thời trang dựa trên đồ thị"** (Integrating Multimodal Representations into Graph-based Fashion Recommender Systems).

---

## 1. Khái niệm cơ bản & Bài toán (Core Concepts)

| Thuật ngữ (English) | Giải thích ngắn gọn |
| :--- | :--- |
| **Multimodal Representation** | Biểu diễn đa phương thức: Kết hợp nhiều dạng dữ liệu khác nhau (như hình ảnh sản phẩm và văn bản mô tả) để mô tả sản phẩm toàn diện hơn thay vì chỉ dùng một phương thức đơn lẻ. |
| **Graph-based RecSys** | Hệ thống gợi ý dựa trên đồ thị: Hệ thống đề xuất sử dụng cấu trúc đồ thị (User-Item, Item-Item) để truyền dẫn tín hiệu sở thích và học các biểu diễn đặc trưng. |
| **Data Sparsity** | Sự thưa thớt dữ liệu: Tình trạng ma trận tương tác giữa người dùng và sản phẩm chứa rất ít dữ liệu thực tế (trong đề tài này độ thưa là **99.22%**), gây khó khăn cho việc huấn luyện. |
| **ID-bound CF** | Lọc cộng tác phụ thuộc ID (ID-bound Collaborative Filtering): Phương pháp gợi ý truyền thống chỉ học dựa trên mã định danh (ID) người dùng và sản phẩm, bỏ qua các yếu tố trực quan (hình ảnh) và ngữ nghĩa (văn bản) của sản phẩm. |
| **Cold Start Problem** | Bài toán khởi đầu lạnh: Thách thức khi hệ thống không thể gợi ý chính xác cho người dùng mới hoặc sản phẩm mới do chưa có hoặc có quá ít lịch sử tương tác. |

---

## 2. Kiến trúc mô hình & Thuật toán (Model Architectures & Algorithms)

| Thuật ngữ (English) | Giải thích ngắn gọn |
| :--- | :--- |
| **GNN (Graph Neural Network)** | Mạng thần kinh đồ thị: Lớp mô hình học sâu được thiết kế chuyên biệt để hoạt động và học biểu diễn trực tiếp trên dữ liệu có cấu trúc đồ thị. |
| **LightGCN** | Kiến trúc GNN tối giản dành riêng cho hệ thống gợi ý, lược bỏ các phép biến đổi phi tuyến và ma trận trọng số phức tạp để tăng tốc độ huấn luyện và giảm hiện tượng quá khớp (overfitting). |
| **CombiGCN** | Mô hình GNN đại diện cho hợp nhất mức dữ liệu (Data-level fusion), lan truyền tín hiệu sở thích đồng thời trên cả đồ thị tương tác user-item (tín hiệu cộng tác) và đồ thị tương đồng item-item (tín hiệu ngữ nghĩa). |
| **BM3** | Bootstrap Multimodal Contrastive Learning for Recommendation: Mô hình gợi ý đa phương thức sử dụng học tương phản tự giám sát dạng bootstrap (tự căn chỉnh giữa các view mà không cần tạo mẫu âm), giúp điều chuẩn tốt trên dữ liệu thưa. |
| **FREEDOM** | Mô hình gợi ý đa phương thức duy trì hai view độc lập (nhánh tương tác và nhánh ngữ nghĩa kNN tương đồng sản phẩm) và liên kết biểu diễn của chúng bằng hàm mất mát InfoNCE truyền thống. |
| **kNN Graph** | Đồ thị k-Hàng xóm gần nhất (k-Nearest Neighbors Graph): Đồ thị tĩnh kết nối mỗi sản phẩm với $k$ sản phẩm lân cận có độ tương đồng cao nhất về mặt hình ảnh hoặc văn bản để dẫn đường truyền tín hiệu. |
| **Contrastive Learning** | Học tương phản: Kỹ thuật huấn luyện bằng cách kéo gần các biểu diễn của cùng một thực thể ở các góc nhìn khác nhau (ví dụ: đặc trưng ảnh và chữ của cùng một chiếc áo) và đẩy xa các thực thể khác nhau. |
| **InfoNCE Loss** | Hàm mất mát tương phản truyền thống sử dụng cả mẫu dương (cặp biểu diễn đúng) và các mẫu âm (các thực thể khác nhau) để tối ưu biểu diễn cho mô hình. |
| **Self-Supervised Learning** | Học tự giám sát: Phương pháp học máy tự sinh ra nhãn giám sát từ chính dữ liệu gốc (ví dụ: tự căn chỉnh đặc trưng đa phương thức) mà không cần con người gắn nhãn thủ công. |

---

## 3. Các bộ mã hóa đặc trưng (Feature Encoders)

| Thuật ngữ (English) | Giải thích ngắn gọn |
| :--- | :--- |
| **Visual Encoder** | Bộ mã hóa hình ảnh: Mô hình học máy (như CNN hay Vision Transformer) dùng để chuyển đổi hình ảnh sản phẩm thành các vector đặc trưng (embeddings) dạng số. |
| **CLIP** | Contrastive Language-Image Pre-training: Bộ mã hóa đa phương thức của OpenAI học biểu diễn liên kết giữa ảnh và chữ, giúp trích xuất các đặc trưng ngữ nghĩa mức cao (khái niệm thời trang trừu tượng). |
| **MobileNetV2** | Mạng tích chập (CNN) tối ưu hóa cao, trích xuất tốt các đặc trưng không gian cục bộ (local spatial features) của thời trang như họa tiết, đường may, hoa văn. |
| **BERT** | Bidirectional Encoder Representations from Transformers: Bộ mã hóa văn bản mạnh mẽ dựa trên Transformer để trích xuất đặc trưng ngữ nghĩa từ mô tả chi tiết của sản phẩm. |

---

## 4. Chiến lược hợp nhất đa phương thức (Multimodal Fusion Strategies)

| Thuật ngữ (English) | Giải thích ngắn gọn |
| :--- | :--- |
| **Late Fusion** | Hợp nhất muộn: Chiến lược kết hợp đơn giản bằng cách cộng hoặc tính trung bình cộng biểu diễn của các phương thức (ảnh, chữ) sau khi đã xử lý độc lập. |
| **Attention Gating** | Cổng chú ý: Cơ chế hợp nhất sử dụng trọng số có thể học để điều chỉnh mức độ đóng góp (tầm quan trọng) của từng phương thức trong từng tình huống cụ thể. |
| **Data-level Fusion** | Hợp nhất mức dữ liệu: Hợp nhất các đặc trưng đa phương thức trước khi huấn luyện để xây dựng ma trận tương đồng tĩnh hướng dẫn quá trình lan truyền tín hiệu. |
| **Model-level Fusion** | Hợp nhất mức mô hình: Chiếu trực tiếp các đặc trưng vào không gian embedding chung và tối ưu hóa chúng đồng thời (end-to-end) trong quá trình huấn luyện. |

---

## 5. Tiền xử lý dữ liệu & Đánh giá hiệu năng (Data & Evaluation)

| Thuật ngữ (English) | Giải thích ngắn gọn |
| :--- | :--- |
| **VCR Dataset** | Tập dữ liệu Vibrent Clothes Rental: Tập dữ liệu thực tế về hành vi thuê quần áo thời trang, có độ thưa cực kỳ cao (99.22%), dùng làm dữ liệu thực nghiệm trong đề tài. |
| **N-core Filtering** | Lọc N-core: Bước tiền xử lý dữ liệu lặp đi lặp lại để loại bỏ những người dùng hoặc sản phẩm có ít hơn N tương tác (ở đây dùng N=5) nhằm lọc nhiễu và các điểm dữ liệu quá thưa. |
| **PCA** | Phân tích thành phần chính (Principal Component Analysis): Kỹ thuật giảm chiều dữ liệu tuyến tính, dùng để nén vector đặc trưng ảnh về 768 chiều để giảm tải tính toán. |
| **Temporal Split** | Phân chia theo thời gian: Cách phân chia tập Train/Test theo trình tự thời gian tương tác thực tế của từng user (ví dụ: 80% đầu để train, 20% cuối để test), tránh rò rỉ dữ liệu tương lai. |
| **Recall@K** | Tỷ lệ bao phủ tại K: Chỉ số đo lường tỷ lệ các sản phẩm người dùng thực sự tương tác xuất hiện trong danh sách gợi ý top K của hệ thống. |
| **NDCG@K** | Normalized Discounted Cumulative Gain tại K: Chỉ số đánh giá chất lượng xếp hạng gợi ý, ưu tiên việc đặt sản phẩm đúng ở vị trí xếp hạng cao hơn (gần top 1 hơn). |
| **Overfitting** | Quá khớp: Hiện tượng mô hình học quá mức các chi tiết và nhiễu trong tập huấn luyện, dẫn đến việc không thể dự đoán chính xác trên dữ liệu mới (tập kiểm thử). |
| **Early Stopping** | Dừng sớm: Kỹ thuật dừng huấn luyện khi hiệu năng trên tập validation ngừng cải thiện sau một số lượng epoch nhất định (patience) để tránh overfitting. |
