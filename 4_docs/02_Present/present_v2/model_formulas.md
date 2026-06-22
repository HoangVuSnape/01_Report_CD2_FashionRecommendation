# Công thức toán học các mô hình (Slide 10, 11, 12)

Tài liệu này tổng hợp chi tiết các công thức toán học dạng LaTeX của 3 mô hình chính: **CombiGCN** (Slide 10), **BM3** (Slide 11), và **FREEDOM** (Slide 12). Các công thức được trích xuất trực tiếp từ file báo cáo LaTeX hệ thống (`3_2_Models_used_in_this_study.tex`) nhằm phục vụ việc đưa vào Slide HTML và Speaker Notes.

---

## 10. CombiGCN (Slide 10)

Mô hình CombiGCN thực hiện lan truyền đặc trưng song song trên hai đồ thị: Đồ thị tương tác User-Item ($\mathcal{G}_{ui}$) và Đồ thị tương tự Item-Item ($\mathcal{G}_{ii}$).

### 10.1. Chuẩn hóa đồ thị tương tự Item-Item
Trước khi huấn luyện, ma trận tương đồng cosine $\mathbf{W}$ được xây dựng từ đặc trưng đa phương thức (visual/textual) và lọc nhiễu (giữ lại các giá trị $> 0.5$). Ma trận kề chuẩn hóa đối xứng được tính như sau:
$$\mathbf{S} = \mathbf{D}_s^{-1/2} \mathbf{W} \mathbf{D}_s^{-1/2}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{W} \in \mathbb{R}^{|\mathcal{I}| \times |\mathcal{I}|}$: Ma trận tương đồng cosine thô giữa các vật phẩm (đã lọc ngưỡng $0.5$).
  - $\mathbf{D}_s$: Ma trận bậc đường chéo (diagonal degree matrix) của $\mathbf{W}$.
  - $\mathbf{S}$: Ma trận kề chuẩn hóa đối xứng của đồ thị tương tự Item-Item.

### 10.2. Quy tắc lan truyền biểu diễn (Propagation Rule)
Tại lớp thứ $k+1$:

* **Nhánh lan truyền User (chỉ nhận thông tin từ tương tác User-Item):**
  $$\mathbf{e}_u^{(k+1)} = \sum_{i \in \mathcal{N}_u} \frac{1}{\sqrt{|\mathcal{N}_u| |\mathcal{N}_i|}} \mathbf{e}_i^{(k)}$$

* **Nhánh lan truyền Item (Hợp nhất từ nhánh tương tác CF và nhánh tương đồng Sim):**
  $$\mathbf{e}_i^{(k+1)} = \mathbf{e}_{i, \text{CF}}^{(k+1)} + \mathbf{e}_{i, \text{Sim}}^{(k+1)}$$
  Trong đó:
  - **Nhánh tương tác Collaborative Filtering (CF):**
    $$\mathbf{e}_{i, \text{CF}}^{(k+1)} = \sum_{u \in \mathcal{N}_i} \frac{1}{\sqrt{|\mathcal{N}_i| |\mathcal{N}_u|}} \mathbf{e}_u^{(k)}$$
  - **Nhánh tương đồng Content (Sim):**
    $$\mathbf{e}_{i, \text{Sim}}^{(k+1)} = \sum_{j \in \mathcal{S}_i} S_{ij} \mathbf{e}_j^{(k)}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{e}_u^{(k)}, \mathbf{e}_i^{(k)}$: Embedding của user $u$ và item $i$ tại lớp $k$.
  - $\mathcal{N}_u, \mathcal{N}_i$: Tập hợp các item tương tác với user $u$, và tập hợp các user tương tác với item $i$.
  - $\mathcal{S}_i$: Tập hợp các item tương đồng với item $i$ trong đồ thị tương tự.
  - $S_{ij}$: Trọng số liên kết đã chuẩn hóa giữa item $i$ và item $j$.

### 10.3. Tổng hợp các lớp (Layer Aggregation)
Sau khi lan truyền qua $N$ lớp, các biểu diễn ở mỗi lớp được trung bình để tạo biểu diễn cuối cùng phục vụ cho việc tính điểm BPR Loss:
$$\mathbf{e}_u = \frac{1}{N+1}\sum_{k=0}^{N} \mathbf{e}_u^{(k)}, \quad \mathbf{e}_i = \frac{1}{N+1}\sum_{k=0}^{N} \mathbf{e}_i^{(k)}$$

---

## 11. BM3 (Slide 11)

BM3 sử dụng cơ chế Bootstrap Contrastive Learning tự giám sát (tương tự BYOL) nhằm căn chỉnh không gian biểu diễn cộng tác (CF) và không gian biểu diễn đa phương thức (modal) mà không cần mẫu âm (negative samples).

### 11.1. Chiếu đặc trưng đa phương thức (Modal Projection & Fusion)
* **Chiếu đặc trưng tuyến tính (đưa về cùng số chiều $d=512$):**
  $$\mathbf{h}_{v,i} = \mathbf{W}_v \mathbf{x}_{vis,i} + \mathbf{b}_v, \quad \mathbf{h}_{t,i} = \mathbf{W}_t \mathbf{x}_{txt,i} + \mathbf{b}_t$$

* **Hợp nhất đa phương thức (Modal Fusion):**
  $$\mathbf{e}_{i, \text{modal}} = \frac{\mathbf{h}_{v,i} + \mathbf{h}_{t,i}}{2}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{x}_{vis,i}, \mathbf{x}_{txt,i}$: Đặc trưng ảnh (CLIP/MobileNetV2) và đặc trưng văn bản (BERT) thô của item $i$.
  - $\mathbf{W}_v, \mathbf{W}_t, \mathbf{b}_v, \mathbf{b}_t$: Ma trận trọng số và vector bias của các lớp chiếu tuyến tính (trainable).
  - $\mathbf{e}_{i, \text{modal}}$: Biểu diễn đa phương thức hợp nhất của item $i$.

### 11.2. Cập nhật tham số Target Encoder (EMA Update)
Để chống sụp đổ biểu diễn (representation collapse), BM3 duy trì một mạng target được cập nhật động bằng Trung bình trượt lũy thừa (EMA) từ mạng online:
$$\mathbf{\Theta}_{target} \leftarrow m \mathbf{\Theta}_{target} + (1 - m) \mathbf{\Theta}_{online}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{\Theta}_{online}, \mathbf{\Theta}_{target}$: Tham số của mạng online (huấn luyện trực tiếp bằng lan truyền ngược) và mạng target (chỉ cập nhật bằng EMA, ngắt gradient).
  - $m = 0.995$: Hệ số quán tính momentum.

### 11.3. Hàm mất mát Bootstrap Loss
Đo lường mức độ tương đồng cosine bất đối xứng giữa hai vector biểu diễn trực tuyến (online) và mục tiêu (target):
$$\mathcal{L}_{boot}(\mathbf{p}, \mathbf{z}) = 2 - 2 \frac{\mathbf{p}^T \mathbf{z}}{\|\mathbf{p}\| \|\mathbf{z}\|}$$

### 11.4. Hàm mất mát Căn chỉnh Tự giám sát (Contrastive Alignment Loss)
$$\mathcal{L}_{CL} = \frac{1}{2} \left[ \mathcal{L}_{boot}(q(\mathbf{e}_{i, \text{CF}}), sg(\mathbf{e}_{i, \text{modal}})) + \mathcal{L}_{boot}(q(\mathbf{e}_{i, \text{modal}}), sg(\mathbf{e}_{i, \text{target}})) \right]$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{e}_{i, \text{CF}}$: Embedding của item $i$ sinh ra từ nhánh Collaborative Filtering (LightGCN).
  - $q(\cdot)$: Khối dự đoán trực tuyến (online predictor head) - MLP 2 lớp với kích hoạt ReLU để phá vỡ tính đối xứng.
  - $sg(\cdot)$: Toán tử chặn gradient (stop-gradient).
  - $\mathbf{e}_{i, \text{target}}$: Biểu diễn mục tiêu của item sinh ra bởi mạng target.

### 11.5. Hợp nhất cuối cùng & Hàm tối ưu hóa tổng hợp (Joint Loss)
* **Biểu diễn Item cuối cùng để chấm điểm khuyến nghị:**
  $$\mathbf{h}_i = \mathbf{e}_{i, \text{CF}} + \mathbf{e}_{i, \text{modal}}$$
* **Hàm mất mát toàn cục:**
  $$\mathcal{L}_{total} = \mathcal{L}_{BPR} + \lambda_1 \mathcal{L}_{reg} + \lambda_2 \mathcal{L}_{CL}$$
  *(Trong cấu hình thực nghiệm, $\lambda_2 = 0.2$)*.

---

## 12. FREEDOM (Slide 12)

FREEDOM tách biệt hoàn toàn quá trình lan truyền tín hiệu cộng tác (CF) và tín hiệu nội dung (content) bằng cách cố định đồ thị tương tự k-NN và tối ưu hóa căn chỉnh thông qua InfoNCE Loss (có sử dụng mẫu âm trong batch).

### 12.1. Cố định đồ thị k-NN (Frozen kNN Graph)
Tại bước khởi tạo, đồ thị kNN được xây dựng từ đặc trưng đa phương thức (chọn top-$k = 10$ lân cận gần nhất) và chuẩn hóa đối xứng:
$$\mathbf{A}^{knn} = \mathbf{D}_{knn}^{-1/2} \mathbf{W}^{knn} \mathbf{D}_{knn}^{-1/2}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{W}^{knn}$: Ma trận kề kNN chứa độ tương đồng cosine (chỉ giữ lại $k$ lân cận gần nhất của mỗi item, tự lặp bằng $0$).
  - $\mathbf{D}_{knn}$: Ma trận bậc đường chéo của $\mathbf{W}^{knn}$.
  - $\mathbf{A}^{knn}$: Ma trận kề chuẩn hóa đối xứng, được đóng băng (frozen - không lan truyền gradient) trong suốt quá trình train.

### 12.2. Lan truyền thông tin nội dung (Content Propagation)
Tín hiệu nội dung được lan truyền qua các lớp trên đồ thị kNN đóng băng:
$$\mathbf{e}_{i, \text{content}}^{(k+1)} = \sum_{j \in \mathcal{N}_k(i)} A^{knn}_{ij} \mathbf{e}_{j, \text{content}}^{(k)}$$

* **Ý nghĩa ký hiệu:**
  - $\mathbf{e}_{i, \text{content}}^{(0)} = \mathbf{e}_{i, \text{modal}}$: Khởi tạo bằng biểu diễn đa phương thức chiếu.
  - $\mathcal{N}_k(i)$: Tập $k$ item lân cận gần nhất của item $i$.
  - $\mathbf{e}_{i, \text{content}}$: Biểu diễn nội dung cuối cùng sau khi thực hiện Mean Pooling các lớp.

### 12.3. Hàm mất mát Căn chỉnh InfoNCE (InfoNCE Alignment Loss)
FREEDOM căn chỉnh biểu diễn giữa góc nhìn cộng tác (interactive view) và góc nhìn nội dung (semantic view) bằng hàm InfoNCE:
$$\mathcal{L}_{CL} = -\sum_{i \in \mathcal{B}} \ln \frac{\exp\left(s(\mathbf{e}_{i, \text{CF}}, \mathbf{e}_{i, \text{content}}) / \tau\right)}{\sum_{j \in \mathcal{B}} \exp\left(s(\mathbf{e}_{i, \text{CF}}, \mathbf{e}_{j, \text{content}}) / \tau\right)}$$

* **Ý nghĩa ký hiệu:**
  - $\mathcal{B}$: Tập hợp các mẫu trong mini-batch huấn luyện.
  - $\mathbf{e}_{i, \text{CF}}$: Biểu diễn cộng tác (interactive view) từ LightGCN.
  - $\mathbf{e}_{i, \text{content}}$: Biểu diễn nội dung (semantic view) từ lan truyền trên đồ thị kNN.
  - $s(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u}^T \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$: Hàm tính tương đồng cosine.
  - $\tau = 0.2$: Siêu tham số nhiệt độ (temperature).

### 12.4. Hợp nhất cuối cùng & Hàm tối ưu hóa tổng hợp (Joint Loss)
* **Biểu diễn Item cuối cùng để khuyến nghị:**
  $$\mathbf{e}_i = \mathbf{e}_{i, \text{CF}} + \mathbf{e}_{i, \text{content}}$$
* **Hàm mất mát toàn cục:**
  $$\mathcal{L}_{total} = \mathcal{L}_{BPR} + \lambda_1 \mathcal{L}_{reg} + \lambda_2 \mathcal{L}_{CL}$$
  *(Trong cấu hình thực nghiệm, $\lambda_2 = 0.1$)*.
