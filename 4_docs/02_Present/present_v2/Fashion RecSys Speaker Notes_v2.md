# Speaker Notes - Fashion RecSys Deck (20 slides)

Tài liệu kịch bản thuyết trình cập nhật theo cấu trúc [Fashion RecSys Deck](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/4_docs/02_Present/present_v2/Fashion%20RecSys%20Deck.dc.html) — tổng cộng **20 slides**.

---

## 01 · Cover

> - Kính thưa quý thầy cô trong Hội đồng và các bạn sinh viên.
> - Em tên là Hoàng Đình Quý Vũ, MSSV 252805008, sinh viên Khoa Công nghệ Thông tin, Trường Đại học Tôn Đức Thắng.
> - Hôm nay, em xin trình bày đề tài Capstone 3 với tiêu đề: **"Tích hợp biểu diễn đa phương thức vào hệ thống gợi ý thời trang dựa trên đồ thị"**.
> - Đề tài được thực hiện dưới sự hướng dẫn của Tiến sĩ Trần Trung Tín.
> - Mục tiêu cốt lõi là đánh giá hiệu năng của **24 cấu hình mạng đồ thị đa phương thức** trên tập dữ liệu thuê quần áo thực tế VCR.
> - Em xin phép bắt đầu.

---

## 02 · Table of Contents

> - Để quý thầy cô tiện theo dõi, bài thuyết trình gồm **5 phần chính**:
>   - **Phần 1 — Đặt vấn đề**: làm rõ hai nút thắt cổ chai lớn trong gợi ý thời trang.
>   - **Phần 2 — Câu hỏi nghiên cứu**: 4 RQs và 5 mục tiêu định hướng toàn bộ thực nghiệm.
>   - **Phần 3 — Phương pháp**: pipeline xử lý dữ liệu và kiến trúc 3 mô hình GNN.
>   - **Phần 4 — Cấu hình & Dữ liệu**: không gian 24 cấu hình và tập VCR.
>   - **Phần 5 — Kết quả & Thảo luận**: trả lời từng RQ và rút ra kết luận.
> - Trước khi vào phần 1, em xin dành một slide ngắn để nhắc lại 3 nền tảng lý thuyết quan trọng nhất.

---

## 03 · CF / CB / Hybrid

> - Để dễ theo dõi phần sau, em xin tóm tắt nhanh **3 triết lý gợi ý** nền tảng — được minh hoạ trực tiếp trong ảnh trên slide.
> - **① Collaborative Filtering (CF) — Lọc cộng tác** *(cột trái)*:
>   - Gợi ý dựa hoàn toàn vào hành vi tương tác: User A và B cùng mua SP1 → hệ thống gợi ý SP2 cho A.
>   - Dữ liệu lấy từ `train.txt`, đầu ra là `item_interaction`.
>   - **Điểm yếu chí mạng**: sản phẩm mới chưa có tương tác nào bị cô lập hoàn toàn — đây chính là **bài toán Cold-Start**.
> - **② Content-Based (CB) — Lọc nội dung** *(cột giữa)*:
>   - Đo độ tương đồng giữa sản phẩm dựa trên đặc trưng nội dung (màu sắc, chất liệu, kiểu dáng) lấy từ `items_features.csv`.
>   - Đầu ra là đồ thị tương đồng `item_similar`.
>   - **Ưu điểm**: sản phẩm mới vẫn có kết nối qua nội dung → giải quyết được Cold-Start.
> - **③ Hybrid trong GCN** *(cột phải)*:
>   - Kết hợp cả hai: `item_next = item_interaction + item_similar` tại mỗi lớp GCN.
>   - CB bù đắp điểm yếu Cold-Start của CF; CF mang tín hiệu hành vi thực tế của người dùng.
>   - Đây chính là triết lý thiết kế cốt lõi của **CombiGCN** mà em sẽ trình bày ở phần sau.

---

## 04 · Problem

> - Bây giờ em đi vào **Phần 1 — Đặt vấn đề và Động lực nghiên cứu**.
> - Trong gợi ý thời trang, có hai nút thắt cổ chai lớn luôn song hành:
>   - **① Data Sparsity — Dữ liệu cực thưa**: ma trận tương tác user-item thường có hơn 99% ô trống, khiến CF truyền thống thiếu tín hiệu nghiêm trọng để học.
>   - **② ID-bound CF — Bị trói vào ID**: mô hình chỉ học từ ID, bỏ qua hoàn toàn hình ảnh, màu sắc, chất liệu — những yếu tố quyết định cảm nhận thời trang.
> - **Ý tưởng cốt lõi của đề tài**: tích hợp đặc trưng đa phương thức *(ảnh + văn bản)* vào mạng đồ thị để lan truyền tín hiệu sở thích qua các cạnh tương đồng giữa sản phẩm — từ đó giải quyết đồng thời cả hai vấn đề trên.

---

## 05 · Research Questions

> - Đề tài được định hướng bởi **4 câu hỏi nghiên cứu (RQ)**:
>   - **RQ1**: CLIP hay MobileNetV2 phù hợp hơn cho thời trang?
>   - **RQ2**: Late Fusion hay Attention Gating cho kết quả xếp hạng tốt hơn?
>   - **RQ3**: Trong 3 kiến trúc GNN — CombiGCN, BM3, FREEDOM — mô hình nào hiệu quả nhất trên cùng một dữ liệu?
>   - **RQ4**: Kết hợp đa phương thức có thực sự tốt hơn dùng một phương thức đơn lẻ không?
> - Để trả lời, đề tài đặt ra **5 mục tiêu O1→O5**: từ tiền xử lý dữ liệu, trích xuất đặc trưng, huấn luyện mô hình đến đánh giá xếp hạng ở các ngưỡng K = {1, 5, 10, 20}.

---

## 06 · Dataset

> - Dữ liệu thực nghiệm là **Vibrent Clothes Rental (VCR)** — tập dữ liệu thuê quần áo thực tế.
> - Ảnh bên trái mô tả toàn bộ pipeline từ dữ liệu thô đến mô hình. Em sẽ đi vào chi tiết ở slide Pipeline.
> - Các con số quan trọng:
>   - **553 users · 2,194 items · 9,455 tương tác** → độ thưa **99.22%**.
>   - Đây là một trong những tập dữ liệu thưa nhất trong nghiên cứu gợi ý — môi trường lý tưởng để kiểm tra khả năng chịu đựng Cold-Start.
> - **Chiến lược phân chia**: temporal split 80/20 theo từng user — 80% tương tác đầu để train, 20% cuối để test, tránh rò rỉ thông tin tương lai.
> - **Lý do chọn K=5 làm chỉ số chính**: trung bình mỗi user chỉ có 3.81 items trong tập test, nên K lớn hơn 5 gây bão hòa Recall — không phân biệt được sự khác biệt giữa các mô hình.

---

## 07 · Pipeline

> - **Quy trình xử lý dữ liệu** gồm 5 giai đoạn liên tiếp:
>   - **Giai đoạn 1 — Lọc 5-core (Initial Filtering)**: lọc lặp để loại bỏ user và item có ít hơn 5 tương tác — giảm nhiễu cực đoan.
>   - **Giai đoạn 2 — Ánh xạ ID (ID Remapping)**: chuyển ID dạng chuỗi thô thành số nguyên liên tục để xây dựng ma trận kề.
>   - **Giai đoạn 3 — Phân chia theo thời gian (Temporal Split)**: chia tương tác theo thời gian từng user theo tỷ lệ 80% train / 20% test.
>   - **Giai đoạn 4 — Trích xuất đặc trưng (Feature Extraction)**:
>     - Ảnh: **CLIP** (512-d) và **MobileNetV2** (giảm chiều PCA → 768-d).
>     - Văn bản: **BERT** (768-d).
>   - **Giai đoạn 5 — Huấn luyện & Đánh giá GNN (GNN Training & Evaluation)**: 24 cấu hình, dùng chung siêu tham số — embedding 512-d, 4 lớp GCN, lr = 0.001, early stopping patience = 40.

---

## 08 · Config Space

> - **Không gian thực nghiệm** gồm **24 cấu hình** — là tích chéo của:
>   - **3 mô hình**: CombiGCN · BM3 · FREEDOM.
>   - **2 bộ mã hóa ảnh**: CLIP · MobileNetV2.
>   - **4 chiến lược hợp nhất**: `img_only` · `txt_only` · `late fusion` · `attention gating`.
> - Mỗi cấu hình được huấn luyện tối đa **1,000 epochs**, early stopping theo Recall@20 trên tập validation.
> - Dùng chung siêu tham số đảm bảo **so sánh công bằng** giữa tất cả 24 phiên bản.

---

## 09 · Three Models

> - Ba kiến trúc đều dùng chung backbone **LightGCN** và cùng một bộ siêu tham số, nhưng triết lý tích hợp đa phương thức hoàn toàn khác nhau:
> - **CombiGCN — Data-level fusion** *(hợp nhất trước khi huấn luyện)*:
>   - Xây dựng offline ma trận tương đồng **W** từ đặc trưng thô, sau đó đưa vào như một đồ thị item-item tĩnh song song với đồ thị tương tác CF.
>   - Hai nhánh (CF + Similarity) được cộng trực tiếp tại mỗi lớp GCN → không có tham số học thêm.
> - **BM3 — Model-level fusion** *(hợp nhất trong quá trình huấn luyện)*:
>   - Chiếu đặc trưng thô qua **Linear Projectors** vào không gian embedding chung, rồi căn chỉnh với nhánh CF bằng **Bootstrap Contrastive Loss** — không cần mẫu âm.
>   - Dùng **EMA target encoder** (momentum = 0.995) để tạo mục tiêu ổn định cho quá trình tự giám sát.
> - **FREEDOM — Decoupled model-level fusion** *(hai nhánh hoàn toàn độc lập)*:
>   - Nhánh CF chạy LightGCN trên đồ thị tương tác; nhánh Content chạy GCN trên đồ thị **kNN bị đóng băng** (frozen — không gradient).
>   - Hai nhánh được liên kết bằng **InfoNCE Contrastive Loss** và cuối cùng cộng lại để ra embedding sản phẩm cuối.

---

## 10 · CombiGCN

> - **[Phần 1 — Giải thích thông tin chữ trên slide]**:
>   - Tiếp theo, em xin đi vào kiến trúc chi tiết của mô hình đầu tiên: **CombiGCN**.
>   - Triết lý cốt lõi của CombiGCN là **Dual-Graph Propagation (Lan truyền trên đồ thị kép)**: Mô hình thực hiện truyền thông điệp song song trên cả 2 đồ thị:
>     - **① Đồ thị tương tác User-Item (nhánh CF)** để học hành vi tương tác lịch sử.
>     - **② Đồ thị tương đồng sản phẩm Item-Item (nhánh Semantic)** được tính toán sẵn từ trước để kết nối các sản phẩm có đặc trưng tương đồng.
>   - Phương pháp này sử dụng **Layer-wise fusion (Hợp nhất theo từng lớp)**: Nghĩa là tại mỗi lớp GCN, biểu diễn từ 2 nhánh này sẽ được cộng hợp trực tiếp để bổ trợ lẫn nhau, trước khi chuyển tiếp sang lớp tiếp theo.
> - **[Phần 2 — Mô tả sơ đồ kiến trúc & Ý nghĩa các khối]**:
>   - **① Phía dưới — Precomputed Data & Similarity** *(khối màu vàng nhạt)*:
>     - *Cấu trúc:* Ma trận tương đồng $W$ được chuẩn bị trước *offline* ở tầng dữ liệu từ đặc trưng ảnh/chữ thô (Cosine Similarity > 0.5) và chuẩn hóa đối xứng thành ma trận $S$ ($S = D_s^{-1/2} W D_s^{-1/2}$).
>     - *Ý nghĩa:* **Kiến tạo tiên nghiệm cấu trúc nội dung tĩnh**. Tính offline giúp tiết kiệm tài nguyên khi train, đồng thời chuẩn hóa đối xứng giúp ngăn bùng nổ gradient khi lan truyền, kết nối các sản phẩm tương đồng từ sớm để hỗ trợ giải quyết dữ liệu thưa.
>   - **② Bên trái — User-Item CF Branch** *(khối màu xanh lam)*:
>     - *Cấu trúc:* Khối `Graph Convolution (User-Item)` thực hiện tổng hợp lân cận trên đồ thị tương tác bipartite. Đầu vào là `User ID Emb` và `Item ID Emb` khởi tạo ngẫu nhiên để phá vỡ tính đối xứng (Symmetry Breaking) và được tối ưu hóa qua từng epoch.
>     - *Ý nghĩa:* **Học hành vi tương tác thực tế**. Giúp mô hình khai thác lịch sử mua sắm của người dùng thông qua truyền tin GCN để nắm bắt thị hiếu thực tế của người dùng đối với từng sản phẩm.
>   - **③ Bên phải — Item-Item Sim Branch** *(khối màu vàng)*:
>     - *Cấu trúc:* Khối `Matrix Mult (S @ Item Emb)` thực hiện phép nhân ma trận đối xứng tĩnh $S$ với vector embedding sản phẩm hiện tại của GCN.
>     - *Ý nghĩa:* **Lan truyền đặc trưng thẩm mỹ và giải quyết Cold-Start**. Ép các sản phẩm giống nhau về ngoại hình học hỏi đặc trưng của nhau, giúp sản phẩm mới chưa có tương tác vẫn được gợi ý qua liên kết tương đồng.
>   - **④ Tâm sơ đồ — Item Fusion (Sum) ⊕**:
>     - *Cấu trúc:* Cộng trực tiếp biểu diễn từ 2 nhánh tại mỗi tầng tạo ra `Layer Output` $\to$ qua `Mean Aggregation` ra `Final User/Item Emb`.
>     - *Ý nghĩa:* **Hợp nhất đa phương thức ở cấp độ cấu trúc**. Phép cộng hợp tại mỗi layer giúp biểu diễn sản phẩm luôn song hành cả tín hiệu hành vi mua sắm lẫn thuộc tính thời trang.
>   - **⑤ Khối Loss trên cùng — BPR Loss**:
>     - *Cấu trúc:* Tính toán sai số xếp hạng cặp (Bayesian Personalized Ranking Loss) dựa trên điểm số dự đoán $\hat{y} = h_u^T \cdot h_i$.
>     - *Ý nghĩa:* **Tối ưu hóa khả năng xếp hạng cá nhân hóa**. Hàm loss đóng vai trò động cơ huấn luyện, bắt buộc mô hình phải cho điểm sản phẩm người dùng thích cao hơn sản phẩm chưa tương tác để cập nhật các ID embeddings.

---
Graph Conv: 
Cơ chế truyền tin: Graph Conv thực hiện truyền thông điệp đan chéo — User sẽ gom thông tin từ các sản phẩm đã mua, và ngược lại, Item gom thông tin từ những User đã mua nó.
Đầu ra & Ý nghĩa: Đầu ra của khối là biểu diễn hành vi đã được chuẩn hóa của người dùng và sản phẩm, giúp mô hình nắm bắt chính xác gu tiêu dùng thực tế.


## 11 · BM3

> - **[Phần 1 — Giải thích thông tin chữ trên slide]**:
>   - Mô hình thứ hai là **BM3** — một giải pháp tự giám sát đa phương thức nổi bật với cơ chế **Bootstrap Contrastive Learning**.
>   - Triết lý chính của BM3 bao gồm:
>     - Căn chỉnh nhánh CF với nhánh chiếu đa phương thức (Modal Projectors) thông qua hàm **Bootstrap Contrastive Loss** tự giám sát.
>     - Sử dụng bộ mã hóa mục tiêu **EMA (Exponential Moving Average)** để tạo ra các "mỏ neo" mục tiêu ổn định và đóng băng gradient trên nhánh này, ngăn chặn hiện tượng sụp đổ biểu diễn (Mode Collapse).
>     - Mô hình **không cần mẫu âm (no negative samples)**, từ đó loại bỏ hoàn toàn sự phụ thuộc vào kích thước batch lớn (batch-size).
>     - Nhờ cơ chế bootstrap này hoạt động như một **bộ điều chuẩn mạnh mẽ (strong regularizer)**, BM3 có khả năng kháng overfitting vượt trội trên tập dữ liệu VCR cực thưa.
> - **[Phần 2 — Mô tả sơ đồ kiến trúc & Ý nghĩa các khối]**:
>   - **① Phía dưới trái — Item / User ID Embeddings & EMA Target Encoder**:
>     - *Cấu trúc:* Khởi tạo ID Embeddings. Nhánh Target CF duy trì một bản sao của Item Embedding qua bộ mã hóa mục tiêu EMA (Exponential Moving Average) với momentum = 0.995 và khóa gradient (`detach`).
>     - *Ý nghĩa:* **Kiến thiết mỏ neo tự giám sát và chống sụp đổ biểu diễn**. Bản sao EMA target di chuyển chậm, đóng vai trò làm mục tiêu ổn định cho nhánh Online bám đuổi mà không bị lỗi mọi vector biến thành hằng số (mode collapse).
>   - **② Phía dưới giữa-trái — CF Branch** *(khối màu xanh lam)*:
>     - *Cấu trúc:* Đầu vào `ego = concat(h_i^0, h_u^0)` đi qua GCN 4 lớp trên đồ thị tương tác ra `user_cf` and `item_cf`.
>     - *Ý nghĩa:* **Học biểu diễn hành vi tương tác**. Trích xuất đặc trưng tương tác lịch sử giữa người dùng và sản phẩm trên đồ thị bipartite để làm nền tảng cho lọc cộng tác.
>   - **③ Phía dưới phải — Modal Branch** *(khối màu đỏ nhạt)*:
>     - *Cấu trúc:* Đặc trưng thô (ảnh từ CLIP/MobileNetV2, chữ từ BERT) được đưa qua các Linear Projectors (single-layer, không phi tuyến) để ra `modal_emb`. Nhánh này không thực hiện lan truyền qua đồ thị.
>     - *Ý nghĩa:* **Đồng bộ hóa không gian đa phương thức**. Projector chiếu các đặc trưng ảnh/chữ thô về cùng không gian nhúng 512 chiều của nhánh CF để so sánh trực tiếp.
>   - **④ Tâm sơ đồ — Bootstrap Contrastive Learning** *(khối màu vàng)*:
>     - *Cấu trúc:* Luồng dự đoán một chiều bất đối xứng: Nhánh online CF đi qua predictor $q(\cdot)$ để dự đoán target modal (đã khóa gradient bằng detach), đồng thời nhánh online modal đi qua predictor để dự đoán target CF (đã khóa gradient).
>     - *Ý nghĩa:* **Căn chỉnh tự giám sát bất đối xứng**. Sử dụng predictor kết hợp stop-gradient (detach) ở target để ép hai nhánh (CF và Modal) tự đồng bộ hóa biểu diễn mà không bị sụp đổ.
>   - **⑤ Đầu ra và Loss — BPR + Bootstrap CL Loss**:
>     - *Cấu trúc:* Biểu diễn sản phẩm cuối là phép cộng hợp `Final Item Emb = item_cf + modal_emb`. Mô hình được tối ưu hóa đồng thời bởi BPR Loss và Bootstrap CL Loss.
>     - *Ý nghĩa:* **Hợp nhất cấp độ biểu diễn cuối và điều chuẩn**. Kết hợp hành vi và thuộc tính ở lớp cuối. Hàm Bootstrap loss đóng vai trò bộ điều chuẩn ngầm mạnh mẽ giúp kháng overfitting cực tốt trên dữ liệu thưa VCR.

---

## 12 · FREEDOM

> - **[Phần 1 — Giải thích thông tin chữ trên slide]**:
>   - Mô hình thứ ba trong nghiên cứu là **FREEDOM**, nổi bật với triết lý **Decoupled GNN Architecture (Kiến trúc đồ thị tách biệt)**.
>   - Điểm cốt lõi của mô hình là:
>     - Duy trì **hai nhánh độc lập hoàn toàn** trong quá trình huấn luyện: Nhánh **CF (Interactive View)** chạy trên đồ thị tương tác user-item và Nhánh **Semantic View** chạy lan truyền nội dung trên đồ thị kNN tương đồng sản phẩm.
>     - Sử dụng hàm lỗi **InfoNCE alignment** để căn chỉnh biểu diễn giữa hai view này. Khác với BM3, InfoNCE bắt buộc phải sử dụng các **mẫu âm trong batch (in-batch negatives)** để kéo gần các biểu diễn cùng item và đẩy xa các item khác.
> - **[Phần 2 — Mô tả sơ đồ kiến trúc & Ý nghĩa các khối]**:
>   - **① Khối dưới cùng và Khởi tạo**:
>     - *Cấu trúc:* Bên trái khởi tạo ID Embeddings có thể học ban đầu. Bên phải nạp đặc trưng ảnh/chữ thô (Frozen Raw Features) đưa qua Linear Projector để sinh ra `modal_emb` ban đầu.
>     - *Ý nghĩa:* **Kiến tạo biểu diễn đa phương thức ban đầu**. Ánh xạ đặc trưng ảnh và chữ thô về không gian nhúng chung 512 chiều để chuẩn bị cho việc xây dựng đồ thị tương đồng.
>   - **② Khối Frozen kNN Graph Construction**:
>     - *Cấu trúc:* Tính Cosine Similarity của các `modal_emb` tại thời điểm khởi tạo ($t=0$) để xây đồ thị kNN (k=10) chuẩn hóa đối xứng, sau đó **đóng băng đồ thị này hoàn toàn (No Gradient)** suốt quá trình train.
>     - *Ý nghĩa:* **Thiết lập tiên nghiệm cấu trúc ngữ nghĩa tĩnh**. Xây đồ thị tương đồng một lần duy nhất lúc khởi tạo. Do đồ thị bị đóng băng hoàn toàn, các liên kết nhiễu từ ảnh thô sẽ bị khóa chặt vĩnh viễn và liên tục lan truyền sai lệch thông tin thẩm mỹ.
>   - **③ Hai nhánh lan truyền song song**:
>     - *Cấu trúc:* Nhánh CF thực hiện lan truyền LightGCN 4 lớp trên đồ thị tương tác; Nhánh Content thực hiện lan truyền GCN 4 lớp của `modal_emb` trên đồ thị kNN đã bị đóng băng.
>     - *Ý nghĩa:* **Lan truyền đặc trưng tách biệt hoàn toàn**. CF branch học hành vi mua sắm, Content branch lan truyền thuộc tính thẩm mỹ, tránh việc tín hiệu nhiễu từ ảnh/chữ làm ảnh hưởng chéo đến ID embeddings.
>   - **④ Dung hợp và Huấn luyện**:
>     - *Cấu trúc:* Đầu ra của 2 nhánh cộng trực tiếp thành `Fused Item Emb`. Huấn luyện bằng BPR Loss, InfoNCE Contrastive Loss và L2 Regularization.
>     - *Ý nghĩa:* **Dung hợp cấp độ biểu diễn cuối và căn chỉnh thông tin**. Cộng hợp biểu diễn ở lớp cuối cùng và dùng InfoNCE loss để kéo gần biểu diễn cùng sản phẩm, đẩy xa sản phẩm khác trong batch.
>   - **⑤ Vấn đề cốt lõi trên VCR**:
>     - *Cấu trúc:* Phân tích nguyên nhân hiệu năng FREEDOM giảm sâu trên VCR.
>     - *Ý nghĩa:* **Hạn chế của đồ thị nội dung tĩnh chứa nhiễu**. Đồ thị kNN thô chứa nhiều nhiễu bị khóa chặt, liên tục lan truyền thông tin sai lệch mà không thể tự điều chỉnh bằng gradient, làm hiệu năng FREEDOM kém BM3 tới 53% NDCG@10.

---

## 13 · Multimodal Integration

> - Slide này so sánh hai triết lý hợp nhất đa phương thức ở cấp độ kiến trúc:
>   - **Data-level (CombiGCN)**: hợp nhất offline → ma trận S tĩnh hướng dẫn lan truyền → dễ giải thích, tách biệt khỏi số chiều đặc trưng.
>   - **Model-level (BM3, FREEDOM)**: chiếu và hợp nhất end-to-end trong lúc huấn luyện → linh hoạt hơn nhưng phụ thuộc vào chất lượng tín hiệu gradient.
> - Ở model-level, em còn ablate thêm **cơ chế hợp nhất**:
>   - **Late Fusion**: trung bình cộng đơn giản `e = (hv + ht) / 2` — không tham số thêm.
>   - **Attention Gating**: trọng số α có thể học → tăng tính linh hoạt, nhưng dễ overfit khi dữ liệu tương tác quá ít.

---

## 14 · RQ1 — Visual Encoder

> - **Trả lời RQ1**: bộ mã hóa ảnh nào phù hợp hơn?
> - **MobileNetV2 thắng** trong cấu hình tốt nhất của mỗi mô hình:
>   - BM3: MBNv2 đạt NDCG@10 = **0.0186** so với CLIP = 0.0142 → MBNv2 cao hơn ~31%.
>   - CombiGCN: MBNv2 = **0.0175** vs CLIP = 0.0174.
> - **Lý do**: MobileNetV2 (CNN) giữ lại đặc trưng không gian cục bộ — hoa văn, đường may, chất liệu vải — những yếu tố thẩm mỹ trực tiếp quyết định sở thích thời trang.
> - **Trường hợp CLIP thắng**: chỉ khi dùng đơn lẻ ảnh (`img_only`) — ngữ nghĩa mức cao của CLIP hữu ích hơn khi không có thêm thông tin văn bản.
> - **Kết luận RQ1**: không có bộ mã hóa nào vượt trội hoàn toàn — sự lựa chọn phụ thuộc vào cấu hình và chiến lược hợp nhất.

---

## 15 · RQ2 & RQ4 — Fusion & Ablation

> - **Trả lời RQ2 & RQ4**: chiến lược hợp nhất nào tốt nhất và đa phương thức có thực sự vượt trội đơn phương thức không?
> - **Bảng Ablation Study ở góc dưới bên trái trả lời trực tiếp cho RQ4**:
>   - Việc kết hợp đa phương thức (multimodal late fusion) mang lại hiệu năng vượt trội hơn hẳn việc chỉ sử dụng đơn phương thức (`img_only` hay `text_only`).
>   - Ví dụ với BM3, multimodal đạt **0.0186** (vượt trội so với `img_only` = 0.0150 và `text_only` = 0.0149). Xu hướng này đồng nhất ở cả CombiGCN và FREEDOM.
> - **Trả lời RQ2: Late Fusion (trung bình cộng) là tốt nhất và ổn định nhất**.
> - Attention Gating **làm giảm hiệu năng nghiêm trọng**:
>   - BM3 giảm **46%** NDCG@10 khi dùng attention (từ 0.0186 xuống 0.0101).
>   - CombiGCN giảm **14%** (từ 0.0175 xuống 0.0151).
> - **Lý do**: với chỉ 9,455 tương tác, các tham số attention không đủ tín hiệu để học → overfitting ngay từ những epoch đầu.
> - **Ngoại lệ duy nhất**: FREEDOM tăng nhẹ 9% với attention (từ 0.0081 lên 0.0088) — nhờ kiến trúc decoupled đã có sẵn cơ chế tách biệt, giảm bớt nguy cơ — nhưng hiệu năng tuyệt đối vẫn thấp nhất.
> - **Kết luận**: Trên dữ liệu thưa, *đơn giản là tốt hơn* — late fusion không tham số vượt trội attention có học, đồng thời đa phương thức đem lại cải thiện rõ rệt so với đơn phương thức.

---

## 16 · RQ3 — Model Comparison

> - **Trả lời RQ3**: thứ hạng mô hình là **BM3 > CombiGCN > FREEDOM** — nhất quán trên tất cả ngưỡng K.
> - **Chi tiết quan trọng**:
>   - Tại **K=1**: BM3 và CombiGCN **hoà nhau** (NDCG@1 = 0.0127) — hai mô hình ngang ngửa ở vị trí top-1.
>   - Từ **K ≥ 5**: BM3 bứt phá rõ rệt — đạt NDCG@5 = **0.0162** so với CombiGCN = **0.0137** (vượt trội 18.4%) — nhờ hiệu ứng điều chuẩn bootstrap tích lũy dần theo vị trí xếp hạng.
>   - **FREEDOM** luôn đứng cuối bảng — đạt NDCG@10 = **0.0088** (kém BM3 tới 53%) — do nhiễu từ đồ thị kNN tĩnh.
> - **Kết luận RQ3**: cơ chế tự giám sát bootstrap của BM3 là phương pháp căn chỉnh và điều chuẩn hiệu quả nhất trên dữ liệu gợi ý thưa.

---

## 17 · Training Dynamics

> - Slide này phân tích **động học hội tụ** — giải thích tại sao hiệu năng lại xếp theo thứ tự BM3 > CombiGCN > FREEDOM.
>   - **CombiGCN**: đỉnh validation ở **epoch 280** — hội tụ nhanh nhất. Tuy nhiên sau đó, training loss tiếp tục giảm sâu **70%** trong khi chất lượng test đi xuống → dấu hiệu overfitting điển hình.
>   - **BM3**: đỉnh ở **epoch 720** — chậm hơn 2.5× nhưng cực kỳ ổn định. Loss sau đỉnh chỉ giảm nhẹ **21%** — bootstrap hoạt động như bộ điều chuẩn ngầm, kháng overfit tốt.
>   - **FREEDOM**: hội tụ muộn nhất, **epoch 960**, với quỹ đạo gần như phẳng hoàn toàn — frozen kNN ngăn destabilize nhưng cũng hạn chế khả năng thích nghi.
> - **Khuyến nghị thực tiễn**:
>   - Cần cập nhật mô hình nhanh hoặc tài nguyên hạn chế → **CombiGCN** + early stopping.
>   - Ưu tiên chất lượng ranking → **BM3** là lựa chọn tối ưu.

---

## 18 · Conclusion

> - Từ 24 cấu hình thực nghiệm, đề tài rút ra **4 kết luận có ý nghĩa khoa học**:
>   - **① Đa phương thức luôn tốt hơn đơn phương thức**: late fusion cải thiện hiệu năng trong mọi kiến trúc được kiểm tra.
>   - **② Lựa chọn bộ mã hóa phụ thuộc cấu hình**: MobileNetV2 tốt hơn CLIP trong late fusion (giữ đặc trưng cục bộ); CLIP thắng trong `img_only`.
>   - **③ Đơn giản hiệu quả hơn trên dữ liệu thưa**: late fusion (không tham số) vượt trội attention gating (có học) khi tương tác ít.
>   - **④ BM3 là kiến trúc tối ưu**: bootstrap tự giám sát vừa căn chỉnh đa phương thức, vừa điều chuẩn hiệu quả — đặc biệt phát huy ưu thế ở K ≥ 5.

---

## 19 · Limitations

> - Đề tài cũng thẳng thắn nhìn nhận **4 hạn chế lớn** để định hướng tương lai:
>   - **Hạn chế 1 — Single-run**: kết quả chỉ từ một lần chạy, chưa kiểm định ý nghĩa thống kê qua nhiều random seed. Khoảng cách hẹp giữa BM3 và CombiGCN có thể thay đổi.
>   - **Hạn chế 2 — Chỉ số tuyệt đối thấp**: độ thưa 99.22% khiến HR@10 chỉ ~7–8%; giá trị nghiên cứu nằm ở **so sánh tương đối**, không phải con số tuyệt đối.
>   - **Hạn chế 3 — Thiếu baseline thuần túy**: chưa benchmark với LightGCN không đa phương thức hay Popularity recommender để xác nhận đóng góp thực sự của phần đa phương thức.
>   - **Hạn chế 4 — Đặc trưng tĩnh**: đặc trưng ảnh trích xuất một lần, không phản ánh xu hướng thời trang thay đổi theo mùa hay thời gian.
> - **Hướng tiếp theo**: đánh giá đa seed, thêm baseline, thử nghiệm trên tập lớn hơn để kiểm chứng giả thuyết FREEDOM.

---

## 20 · Thank You

> - Em xin chân thành cảm ơn quý thầy cô trong Hội đồng đã dành thời gian lắng nghe.
> - Em cũng xin gửi lời cảm ơn đặc biệt đến **Tiến sĩ Trần Trung Tín** vì sự hướng dẫn tận tình và kiên nhẫn trong suốt quá trình thực hiện đề tài.
> - Tóm lại: **kết hợp đặc trưng đa phương thức qua BM3 + MobileNetV2 là giải pháp tối ưu cho bài toán gợi ý thời trang trên dữ liệu thưa** — và đây là kim chỉ nam quan trọng cho các hệ thống gợi ý thực tế quy mô nhỏ.
> - Em rất mong nhận được câu hỏi và góp ý từ quý thầy cô để hoàn thiện đề tài.
> - **Xin chân thành cảm ơn!**

---

## 21 · Appendix: CombiGCN Formulas

> - **Kịch bản thuyết trình công thức CombiGCN**:
>   - **① Chuẩn hóa đồ thị tương tự Item-Item**:
>     - Ma trận kề chuẩn hóa đối xứng S được tính trước từ độ tương đồng cosine W của đặc trưng ảnh và chữ, lọc các liên kết yếu dưới 0.5 để giảm nhiễu.
>     - Phép chuẩn hóa thực hiện bằng cách nhân ma trận kề W với ma trận bậc đường chéo nghịch đảo căn bậc hai D_s mũ trừ 1 phần 2 về cả hai phía.
>   - **② Nhánh lan truyền User**:
>     - Biểu diễn của người dùng tại lớp k cộng 1 được cập nhật hoàn toàn dựa trên trung bình chuẩn hóa các biểu diễn sản phẩm lân cận ở lớp k trước đó.
>   - **③ Nhánh lan truyền Item (Hợp nhất song song)**:
>     - Biểu diễn sản phẩm tại lớp k cộng 1 được cộng hợp trực tiếp từ hai nhánh tín hiệu:
>     - Nhánh thứ nhất là Lọc cộng tác CF, thu nhận tín hiệu từ các người dùng đã tương tác trong lịch sử.
>     - Nhánh thứ hai là Tương đồng Sim, thu nhận tín hiệu ngữ nghĩa từ các sản phẩm tương tự lân cận trên đồ thị kề S.
>   - **④ Tổng hợp các lớp (Layer Aggregation)**:
>     - Biểu diễn cuối cùng của người dùng và sản phẩm được tính bằng trung bình cộng biểu diễn của tất cả các lớp GCN từ lớp 0 đến lớp N.

---

## 22 · Appendix: BM3 Formulas

> - **Kịch bản thuyết trình công thức BM3**:
>   - **① Chiếu đặc trưng và Hợp nhất đa phương thức**:
>     - Đặc trưng hình ảnh thô x_vis và văn bản thô x_txt được đưa qua các lớp chiếu tuyến tính W_v và W_t tương ứng để đưa về không gian 512 chiều của nhánh lọc cộng tác.
>     - Biểu diễn modal tích hợp e_modal sau đó được tính bằng trung bình cộng đơn giản của đặc trưng ảnh và chữ đã chiếu.
>   - **② Cập nhật tham số Target Encoder (EMA)**:
>     - Các tham số của bộ mã hóa mục tiêu Target Theta_target được cập nhật động bằng trung bình trượt lũy thừa từ mạng Online.
>     - Công thức sử dụng hệ số quán tính m bằng 0.995, đồng thời ngắt gradient để làm mỏ neo ổn định và chống sụp đổ biểu diễn.
>   - **③ Hàm lỗi Bootstrap Loss & Căn chỉnh tự giám sát**:
>     - Hàm Bootstrap loss đo độ lệch tương đồng cosine bất đối xứng giữa hai biểu diễn online và target.
>     - Biểu diễn online được đưa qua một đầu dự đoán q gồm mạng MLP 2 lớp để phá vỡ tính đối xứng, còn biểu diễn target được đóng băng gradient qua toán tử stop-gradient.
>   - **④ Biểu diễn cuối cùng và Hàm tối ưu toàn cục**:
>     - Biểu diễn sản phẩm cuối cùng dùng để chấm điểm gợi ý là phép cộng hợp của nhánh tương tác CF và nhánh modal tích hợp.
>     - Hàm lỗi toàn cục tối ưu hóa đồng thời lỗi xếp hạng BPR Loss, lỗi chuẩn hóa L2 và lỗi tự giám sát CL với trọng số lambda_2 bằng 0.2.

---

## 23 · Appendix: FREEDOM Formulas

> - **Kịch bản thuyết trình công thức FREEDOM**:
>   - **① Xây dựng đồ thị kNN đóng băng**:
>     - Ma trận kề chuẩn hóa A_knn của đồ thị tương đồng kNN được tính từ độ tương đồng đặc trưng đa phương thức tại bước khởi tạo.
>     - Hệ thống chỉ giữ lại 10 sản phẩm tương tự nhất cho mỗi sản phẩm và đóng băng cấu trúc đồ thị này, không cập nhật gradient trong suốt quá trình train.
>   - **② Lan truyền đặc trưng nội dung**:
>     - Tín hiệu nội dung được lan truyền độc lập qua các lớp GCN trên đồ thị kNN tĩnh đóng băng, bắt đầu từ biểu diễn modal ban đầu để tạo ra biểu diễn nội dung e_content.
>   - **③ Căn chỉnh biểu diễn bằng InfoNCE Loss**:
>     - Sử dụng hàm mất mát tương phản InfoNCE với tham số nhiệt độ tau bằng 0.2 để căn chỉnh hai nhánh.
>     - Hàm lỗi này kéo gần biểu diễn cộng tác CF và biểu diễn nội dung của cùng một sản phẩm, đồng thời đẩy xa biểu diễn của các sản phẩm khác nhau trong cùng mini-batch.
>   - **④ Biểu diễn cuối cùng và Hàm tối ưu toàn cục**:
>     - Biểu diễn sản phẩm cuối cùng là tổng của biểu diễn cộng tác CF và biểu diễn nội dung.
>     - Hàm lỗi toàn cục tối ưu hóa đồng thời BPR Loss, chuẩn hóa L2 và lỗi InfoNCE với trọng số lambda_2 bằng 0.1.


