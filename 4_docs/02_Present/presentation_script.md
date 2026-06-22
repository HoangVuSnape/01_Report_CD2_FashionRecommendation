# Kịch Bản Thuyết Trình — Bảo Vệ Capstone (~10 phút)
**Tích Hợp Biểu Diễn Đa Phương Tiện vào Hệ Thống Gợi Ý Thời Trang Dựa trên Đồ Thị**
Người thuyết trình: Hoàng Đinh Quý Vũ · Cố vấn: TS. Trần Trung Tín

> Tổng cộng ≈ 10:00. Thời gian mỗi slide là hướng dẫn tích lũy, không bắt buộc. Hãy nói các dòng **in đậm**; phần còn lại có thể diễn giải.

---

## Slide 1 — Tiêu đề (Cover)  ⏱ 0:00–0:30
Kính thưa quý thầy cô trong Hội đồng và các bạn sinh viên. Em tên là **Hoàng Đình Quý Vũ**, mã số sinh viên 252805008, là sinh viên khoa Công nghệ Thông tin, trường Đại học Tôn Đức Thắng.

Sau đây, em xin phép được trình bày báo cáo đề tài Capstone 3 của mình với tên gọi: **"Tích hợp biểu diễn đa phương thức vào hệ thống gợi ý thời trang dựa trên đồ thị"** (Integrating Multimodal Representations into Graph-based Fashion Recommender Systems). Đề tài này được thực hiện dưới sự hướng dẫn khoa học của **Tiến sĩ Trần Trung Tín**. Mục tiêu chính của nghiên cứu là đánh giá hiệu năng của **24 cấu hình mạng đồ thị đa phương thức** khác nhau trên tập dữ liệu thuê quần áo thực tế Vibrent Clothes Rental (VCR).

---

## Slide 2 — Mục lục (Table of Contents)  ⏱ 0:30–0:45
Để quý thầy cô tiện theo dõi, bài thuyết trình của em hôm nay sẽ bao gồm **5 phần nội dung chính**:
1. **Đặt vấn đề & Động lực nghiên cứu**: làm rõ các thách thức hiện tại.
2. **Các câu hỏi nghiên cứu**: xác định mục tiêu và phạm vi của đề tài.
3. **Phương pháp nghiên cứu & Pipeline xử lý**: quy trình xử lý dữ liệu và cấu trúc của 3 mô hình đồ thị.
4. **Cấu hình thực nghiệm & Tập dữ liệu VCR**: không gian 24 cấu hình và tập dữ liệu thuê VCR.
5. **Kết quả thực nghiệm & Thảo luận**: đưa ra các câu trả lời cụ thể cho các câu hỏi nghiên cứu và rút ra kết luận.

Trước khi vào phần 1, em xin dành một slide ngắn để nhắc lại 3 nền tảng lý thuyết quan trọng nhất.

---

## Slide 3 — CF / CB / Hybrid  ⏱ 0:45–1:15
Trước khi đi vào bài toán chính, em xin trình bày ngắn gọn **3 triết lý gợi ý nền tảng** được minh họa trực tiếp trên slide.
* **Lọc cộng tác (Collaborative Filtering - CF)**: gợi ý dựa hoàn toàn trên hành vi tương tác. Điểm yếu chí mạng của CF là bài toán **Khởi đầu lạnh (Cold-Start)**: sản phẩm mới chưa có tương tác bị cô lập hoàn toàn.
* **Lọc dựa trên nội dung (Content-Based - CB)**: đo lường độ tương đồng giữa các sản phẩm qua đặc trưng nội dung (hình ảnh, văn bản). CB giải quyết tốt Cold-Start vì sản phẩm mới vẫn kết nối qua thuộc tính nội dung.
* **Mô hình Hybrid trong GNN**: kết hợp cả hai nguồn tín hiệu (hành vi CF + tương đồng nội dung CB) tại mỗi lớp truyền tin GCN để bổ trợ và khắc phục điểm yếu của nhau trong một mô hình đồ thị thống nhất.

---

## Slide 4 — Đặt vấn đề & Động lực  ⏱ 1:15–2:00
Trong lĩnh vực gợi ý thời trang, chúng ta đối mặt với hai nút thắt cổ chai lớn luôn song hành:
1. **Sự thưa thớt của dữ liệu (Data Sparsity)**: Ma trận tương tác người dùng - sản phẩm cực kỳ thưa (trên 99%), khiến các mô hình CF truyền thống thiếu tín hiệu trầm trọng.
2. **Sự phụ thuộc hoàn toàn vào ID sản phẩm (ID-bound CF)**: Các mô hình truyền thống học hành vi qua ID mà bỏ qua các thuộc tính thời trang tối quan trọng như hình ảnh thẩm mỹ hay mô tả văn bản.

**Ý tưởng cốt lõi của đề tài** là tích hợp các đặc trưng đa phương thức (gồm hình ảnh và văn bản) vào mạng đồ thị để lan truyền tín hiệu sở thích thông qua các cạnh tương đồng về mặt hình ảnh và ngữ nghĩa giữa các sản phẩm, giải quyết bài toán khởi đầu lạnh.

---

## Slide 5 — Câu hỏi & Mục tiêu Nghiên cứu  ⏱ 2:00–2:45
Để định hướng nghiên cứu, đề tài đặt ra **5 mục tiêu từ O1 đến O5**: bao quát từ khâu tiền xử lý, trích xuất đặc trưng, huấn luyện mô hình cho đến đánh giá hiệu năng. Những mục tiêu này giúp trả lời **4 câu hỏi nghiên cứu (RQ)**:
* **RQ1**: Bộ mã hóa hình ảnh nào — CLIP hay MobileNetV2 — phù hợp hơn cho gợi ý thời trang?
* **RQ2**: Chiến lược hợp nhất đa phương thức nào (hợp nhất muộn hay attention gating) tối ưu chất lượng xếp hạng?
* **RQ3**: Kiến trúc GNN nào (CombiGCN, BM3 hay FREEDOM) hoạt động hiệu quả nhất?
* **RQ4**: Sự kết hợp đa phương thức có thực sự tốt hơn so với việc chỉ sử dụng một phương thức đơn lẻ?

---

## Slide 6 — Tập dữ liệu · VCR  ⏱ 2:45–3:30
Thực nghiệm sử dụng tập dữ liệu thực tế **Vibrent Clothes Rental (VCR)**.
* Các con số quan trọng: **553 người dùng, 2.194 sản phẩm, 9.455 lượt tương tác** và độ thưa cực cao **99.22%**.
* Đây là môi trường lý tưởng để thử nghiệm độ bền của mô hình trước thách thức khởi đầu lạnh.
* **Chiến lược phân chia**: temporal split 80/20 cho từng người dùng để tránh rò rỉ thông tin tương lai.
* **Lý do chọn K=5 làm chỉ số chính**: Trung bình mỗi người dùng chỉ có 3.81 sản phẩm trong tập kiểm tra, nên K lớn hơn 5 sẽ gây bão hòa Recall — không phân biệt được sự khác biệt giữa các mô hình.

---

## Slide 7 — Phương pháp · Quy trình xử lý (Pipeline)  ⏱ 3:30–4:15
Quy trình xử lý dữ liệu đề xuất gồm **5 giai đoạn liên tục**:
1. **Lọc 5-core (Initial Filtering)**: lọc lặp để loại bỏ các người dùng và sản phẩm có ít hơn 5 tương tác nhằm giảm nhiễu cực đoan.
2. **Ánh xạ ID (ID Remapping)**: chuyển các chuỗi ID thô thưa thớt thành chỉ số nguyên liên tục để dựng ma trận kề sạch.
3. **Phân chia theo thời gian (Temporal Split)**: phân chia tương tác theo dòng thời gian của từng người dùng với tỷ lệ 80% huấn luyện và 20% kiểm thử.
4. **Trích xuất đặc trưng (Feature Extraction)**: trích xuất các đặc trưng hình ảnh (bằng CLIP và MobileNetV2 sau khi giảm chiều bằng PCA) và đặc trưng văn bản (bằng BERT).
5. **Huấn luyện & Đánh giá GNN (GNN Training & Evaluation)**: huấn luyện 24 cấu hình và đánh giá các chỉ số xếp hạng top-N ở các ngưỡng K khác nhau.

---

## Slide 8 — Không gian cấu hình (Config Space)  ⏱ 4:15–4:45
Để thực hiện một nghiên cứu toàn diện, chúng em xây dựng **không gian cấu hình gồm 24 phiên bản** khác nhau:
* **3 mô hình**: CombiGCN · BM3 · FREEDOM.
* **2 bộ mã hóa hình ảnh**: CLIP · MobileNetV2.
* **4 chiến lược hợp nhất**: chỉ ảnh (`img_only`), chỉ văn bản (`text_only`), hợp nhất muộn bằng trung bình cộng (`multimodal`), và cơ chế attention gating có học (`mm_attention`).
* Mỗi cấu hình đều được huấn luyện tối đa 1.000 epochs với cơ chế early stopping dựa trên chỉ số Recall@20.

Xương sống lọc cộng tác (CF) của cả 3 mô hình đều được xây dựng trên **xương sống chung LightGCN**.

---

## Slide 9 — Ba kiến trúc GNN (Three Models)  ⏱ 4:45–5:15
Cả ba kiến trúc đều dùng chung backbone LightGCN, nhưng triết lý tích hợp đa phương thức hoàn toàn khác nhau:
* **CombiGCN (Data-level)**: Hợp nhất offline trước huấn luyện, xây dựng đồ thị tương đồng item-item tĩnh song song với đồ thị tương tác CF.
* **BM3 (Model-level)**: Chiếu đặc trưng thô qua Linear Projector vào không gian chung, rồi căn chỉnh với nhánh CF bằng Bootstrap Contrastive Loss tự giám sát (không cần mẫu âm), sử dụng EMA target encoder để chống sụp đổ biểu diễn.
* **FREEDOM (Decoupled Model-level)**: Duy trì hai nhánh lan truyền hoàn toàn độc lập (tương tác CF và đồ thị kNN nội dung bị đóng băng) và liên kết chúng bằng InfoNCE loss.

---

## Slide 10 — Mô hình CombiGCN  ⏱ 5:15–5:45
CombiGCN thực hiện **truyền thông điệp song song trên đồ thị kép (Dual-Graph)**:
1. Đồ thị tương tác User-Item (nhánh CF) học hành vi mua sắm thực tế của người dùng qua phép lan truyền Graph Conv.
2. Đồ thị tương đồng sản phẩm Item-Item (nhánh Semantic) được tính toán trước offline từ đặc trưng nội dung thô để kết nối các sản phẩm tương đồng thẩm mỹ, giúp sản phẩm mới chưa có tương tác vẫn có thể được lan truyền đặc trưng.

Các biểu diễn từ 2 nhánh được cộng trực tiếp tại mỗi lớp GCN (**Layer-wise fusion**), giúp biểu diễn sản phẩm luôn song hành cả tín hiệu hành vi lẫn thuộc tính thời trang, tối ưu qua hàm **BPR Loss**.

---

## Slide 11 — Mô hình BM3  ⏱ 5:45–6:15
BM3 nổi bật với cơ chế **Bootstrap Contrastive Learning tự giám sát**:
* **Không cần mẫu âm**: Loại bỏ sự phụ thuộc vào kích thước batch lớn, giúp tiết kiệm tài nguyên huấn luyện.
* **EMA Target Encoder**: Duy trì một bản sao target CF di chuyển chậm và khóa gradient để làm mục tiêu ổn định cho nhánh Online bám đuổi, chống sụp đổ biểu diễn.
* **Luồng dự đoán một chiều (asymmetric)**: Nhánh online CF dự đoán target modal (đã khóa gradient) và ngược lại, ép hai nhánh CF và Đa phương thức tự đồng bộ hóa biểu diễn. Cơ chế này hoạt động như một bộ điều chuẩn ngầm rất mạnh giúp kháng overfitting cực tốt trên dữ liệu thưa VCR.

---

## Slide 12 — Mô hình FREEDOM  ⏱ 6:15–6:45
FREEDOM sử dụng **kiến trúc đồ thị tách biệt hoàn toàn (Decoupled)**:
* Nhánh CF chạy LightGCN trên đồ thị tương tác, nhánh Content chạy GCN trên đồ thị **kNN tương đồng sản phẩm bị đóng băng hoàn toàn (Frozen kNN)** từ lúc khởi tạo.
* Hai nhánh độc lập này được căn chỉnh với nhau thông qua hàm lỗi **InfoNCE Contrastive Loss** (sử dụng in-batch negatives).
* **Vấn đề cốt lõi trên VCR**: Do kNN tĩnh xây dựng từ đặc trưng thô lúc khởi tạo chứa nhiều nhiễu và bị khóa chặt vĩnh viễn, các liên kết nhiễu liên tục lan truyền sai lệch thông tin thẩm mỹ mà không thể tự điều chỉnh bằng gradient, làm hiệu năng FREEDOM kém BM3 tới 53% NDCG@10.

---

## Slide 13 — Thiết kế Tích hợp Đa phương thức  ⏱ 6:45–7:15
Slide này so sánh hai triết lý hợp nhất đa phương thức ở cấp độ kiến trúc:
* **Hợp nhất mức dữ liệu (Data-level - CombiGCN)**: Hợp nhất offline trước khi train. Ma trận tương đồng $S$ tĩnh hướng dẫn lan truyền, dễ giải thích và tách biệt khỏi số chiều của đặc trưng.
* **Hợp nhất mức mô hình (Model-level - BM3, FREEDOM)**: Chiếu và hợp nhất end-to-end trong lúc huấn luyện.
  * **Late Fusion (multimodal)**: Trung bình cộng đơn giản `(h_v + h_t) / 2` — không có tham số học thêm.
  * **Attention Gating**: Sử dụng trọng số $\alpha$ có thể học — tăng tính linh hoạt nhưng cực kỳ dễ overfitting trên tập tương tác nhỏ.

---

## Slide 14 — RQ1 · Mã hóa trực quan  ⏱ 7:15–7:45
**Trả lời RQ1: Bộ mã hóa hình ảnh nào phù hợp hơn?**
* **MobileNetV2 giành chiến thắng** trong cấu hình late-fusion tốt nhất của mỗi mô hình:
  * BM3: MBNv2 đạt NDCG@10 = **0.0186** so với CLIP = 0.0142 (MBNv2 cao hơn ~31%).
  * CombiGCN: MBNv2 = **0.0175** vs CLIP = 0.0174.
* **Lý do**: MobileNetV2 (mạng CNN truyền thống) giữ lại đặc trưng không gian cục bộ (hoa văn, đường may, chất liệu vải) — những yếu tố thẩm mỹ trực tiếp quyết định sự phối đồ. CLIP được tối ưu hóa cho căn chỉnh ngữ nghĩa mức cao nên chỉ nhận diện khái niệm trừu tượng (như "áo đỏ").
* **Mặt khác**: CLIP chỉ thắng ở cấu hình đơn phương thức (`img_only`). Do đó, sự vượt trội của encoder phụ thuộc vào cấu hình, không phải phổ quát.

---

## Slide 15 — RQ2 & RQ4 · Chiến lược hợp nhất & Ablation  ⏱ 7:45–8:30
**Trả lời RQ2 & RQ4: Chiến lược hợp nhất tốt nhất và Đa phương thức vs Đơn phương thức?**
* **Trả lời RQ4 (Đa phương thức thắng thế)**: Nhìn vào bảng Ablation Study ở góc trái, việc kết hợp đa phương thức (`multimodal` late fusion) luôn vượt trội hơn hẳn chỉ dùng ảnh (`img_only`) hoặc chỉ dùng chữ (`text_only`). Ví dụ BM3 multimodal đạt **0.0186** so với 0.0150 (img) và 0.0149 (text).
* **Trả lời RQ2 (Late fusion tối ưu nhất)**: Late fusion không chứa tham số bổ sung là ổn định nhất. Cơ chế attention gating có học thực tế làm giảm nghiêm trọng hiệu năng do overfitting trên dữ liệu thưa:
  * BM3 giảm **46%** (từ 0.0186 xuống 0.0101) khi thêm attention.
  * CombiGCN giảm **14%** (từ 0.0175 xuống 0.0151).
  * FREEDOM là ngoại lệ duy nhất tăng nhẹ 9% (từ 0.0081 lên 0.0088) nhờ cấu trúc decoupled sẵn.

---

## Slide 16 — RQ3 · So sánh mô hình  ⏱ 8:30–9:00
**Trả lời RQ3: Kiến trúc nào tối ưu nhất?**
Thứ tự hiệu năng là **BM3 > CombiGCN > FREEDOM**, nhất quán trên hầu hết các chỉ số.
* **Tại K=1**: BM3 và CombiGCN **hòa nhau** (NDCG@1 = 0.0127) ở vị trí top-1.
* **Từ K ≥ 5**: BM3 bứt phá rõ rệt. Ở $K=5$, BM3 đạt NDCG@5 = **0.0162** so với CombiGCN = **0.0137** (vượt trội +18.4%), nhờ hiệu ứng điều chuẩn bootstrap tích lũy dần theo vị trí xếp hạng. Khoảng cách này thu hẹp lại ở K=10 (+6.3% — 0.0186 vs 0.0175). Do trung bình tập test chỉ có 3.81 mục/user, việc đánh giá ở K=5 là tối quan trọng để tránh bão hòa Recall.
* **FREEDOM** luôn đứng cuối bảng (NDCG@10 = **0.0088**, kém BM3 tới 53%) do ảnh hưởng nhiễu của đồ thị kNN tĩnh.

---

## Slide 17 — Động học huấn luyện (Training Dynamics)  ⏱ 9:00–9:30
Quá trình hội tụ và overfitting giải thích tại sao hiệu năng xếp theo thứ tự trên:
* **CombiGCN hội tụ nhanh nhất** (đạt đỉnh ở epoch 280, nhanh hơn BM3 2.5 lần), nhưng sau đó loss giảm sâu 70% trong khi chất lượng kiểm thử đi xuống — dấu hiệu overfitting điển hình do thiếu cơ chế điều chuẩn trên ma trận tương đồng tĩnh.
* **BM3 hội tụ chậm hơn nhưng mạnh mẽ** (đạt đỉnh ở epoch 720), loss sau đỉnh chỉ giảm nhẹ 21% nhờ cơ chế bootstrap tự giám sát đóng vai trò bộ điều chuẩn ngầm kháng overfit rất tốt.
* **FREEDOM hội tụ muộn nhất** (epoch 960) và đồ thị loss gần như đi ngang.

**Khuyến nghị thực tiễn**: Dùng CombiGCN + early stopping nếu tài nguyên hạn chế; dùng BM3 để đạt chất lượng ranking tốt nhất.

---

## Slide 18 — Kết luận & Đóng góp  ⏱ 9:30–9:45
Từ 24 cấu hình thực nghiệm trên tập dữ liệu VCR, nghiên cứu rút ra **4 đóng góp chính**:
1. **Hợp nhất đa phương thức tốt hơn đơn phương thức**: cải thiện hiệu năng trong mọi kiến trúc đồ thị.
2. **Lựa chọn bộ mã hóa phụ thuộc cấu hình**: MobileNetV2 tốt hơn cho late fusion (giữ đặc trưng cục bộ); CLIP thắng trong cấu hình đơn phương thức.
3. **Đơn giản hiệu quả hơn trên dữ liệu thưa**: Late fusion không tham số vượt trội attention gating có học.
4. **Hiệu năng GNN tương tác với độ sâu xếp hạng**: BM3 vượt trội ở K ≥ 5; CombiGCN cạnh tranh ở top-1 và hội tụ nhanh hơn.

Cấu hình tối ưu nhất là **BM3 + MobileNetV2 + Late Fusion (multimodal)** với NDCG@10 = **0.0186**.

---

## Slide 19 — Hạn chế & Hướng đi tương lai  ⏱ 9:45–10:00
Đề tài thẳng thắn nhìn nhận **4 hạn chế chính**:
1. Kết quả hiện tại mới dừng lại ở ước lượng **single-run**, chưa thực hiện kiểm định ý nghĩa thống kê trên nhiều random seeds.
2. Chỉ số tuyệt đối còn tương đối thấp (HR@10 khoảng 7-8%) do dữ liệu VCR cực thưa; giá trị nằm ở **so sánh tương đối**.
3. Chưa benchmark với các baseline thuần túy (như LightGCN không đa phương thức hay Popularity).
4. Các đặc trưng hình ảnh được trích xuất **tĩnh**, chưa phản ánh được xu hướng thời trang theo thời gian.

**Hướng nghiên cứu tiếp theo**: Đánh giá đa seed, thử nghiệm trên tập dữ liệu thời trang lớn hơn và truyền tin mùa vụ.

---

## Slide 20 — Cảm ơn (Thank You)  ⏱ 10:00
Em xin chân thành cảm ơn quý thầy cô trong Hội đồng đã dành thời gian lắng nghe bài thuyết trình của em. Em cũng xin gửi lời cảm ơn sâu sắc đến **Tiến sĩ Trần Trung Tín**, người đã tận tình và kiên nhẫn hướng dẫn em hoàn thành đề tài này.

Tóm lại: **Kết hợp đặc trưng đa phương thức qua BM3 + MobileNetV2 là giải pháp tối ưu cho bài toán gợi ý thời trang trên dữ liệu thuê quần áo thưa thớt VCR**.

Em rất mong nhận được câu hỏi và đóng góp từ quý thầy cô để hoàn thiện đề tài hơn nữa. Em xin chân thành cảm ơn!
