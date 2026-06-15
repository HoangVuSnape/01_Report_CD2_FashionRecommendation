# Kịch Bản Thuyết Trình — Bảo Vệ (~10 phút)
**Tích Hợp Biểu Diễn Đa Phương Tiện vào Hệ Thống Gợi Ý Thời Trang Dựa trên Đồ Thị**
Người thuyết trình: Hoàng Đinh Quý Vũ · Cố vấn: TS. Trần Trung Tín

> Tổng cộng ≈ 10:00. Thời gian mỗi slide là hướng dẫn tích lũy, không bắt buộc. Hãy nói các dòng **in đậm**; phần còn lại có thể diễn giải.

---

## Slide 1 — Tiêu đề  ⏱ 0:00–0:30
Chào buổi sáng. Tên tôi là **Hoàng Đinh Quý Vũ**, đây là Dự án Tốt nghiệp 3 của tôi, được hướng dẫn bởi **TS. Trần Trung Tín**.

Chủ đề là *Tích Hợp Biểu Diễn Đa Phương Tiện vào Hệ Thống Gợi Ý Thời Trang Dựa trên Đồ Thị*. Tóm lại: tôi đánh giá **24 cấu hình mô hình** kết hợp các đặc trưng hình ảnh và văn bản với mạng nơ-ron đồ thị, trên tập dữ liệu thuê quần áo thực tế, để tìm hiểu **những gì thực sự giúp** gợi ý khi dữ liệu rất thưa thớt.

---

## Slide 2 — Mục lục  ⏱ 0:30–0:45
Tôi sẽ trình bày về động lực và các câu hỏi nghiên cứu, tập dữ liệu và phương pháp, sau đó dành hầu hết thời gian cho **ba câu hỏi kết quả** — mã hóa, hợp nhất và mô hình — và kết thúc với kết luận và hạn chế.

*(Giữ ngắn — chỉ hướng dẫn khán giả.)*

---

## Slide 3 — Vấn đề & Động lực  ⏱ 0:45–1:45
Gợi ý thời trang khó vì hai lý do liên quan.

Thứ nhất, người dùng tương tác với **rất ít mục**, nên đồ thị người dùng–mục rất thưa thớt, và **lọc hợp tác dựa trên ID** hầu như không có tín hiệu cho các mục lạnh hoặc xếp hạng thấp.

Thứ hai, **phong cách là trực quan và văn bản** — hình dáng của một bộ quần áo, mô tả của nó — và các ID tương tác thuần túy loại bỏ tất cả những điều đó.

**Vì vậy cách tiếp cận của chúng tôi là đưa nội dung mục đa phương tiện trực tiếp vào lọc hợp tác dựa trên đồ thị**, để ưu tiên có thể lan truyền dọc theo các liên kết tương tự trực quan và văn bản giữa các mục.

Cụ thể, chúng tôi đánh giá lưới **3 mô hình đồ thị × 2 mã hóa tầm nhìn × 4 chiến lược hợp nhất — 24 cấu hình** — và hỏi: mã hóa nào, hợp nhất nào, và kiến trúc nào thực sự giúp ích khi dữ liệu thưa thớt hiện thực?

---

## Slide 4 — Câu hỏi & Mục tiêu Nghiên cứu  ⏱ 1:45–2:30
Các mục tiêu của chúng tôi bắt đầu từ tiền xử lý tập dữ liệu, trích xuất các đặc trưng, điều chỉnh các mô hình, để đánh giá và phân tích.

Những điều này kết tinh thành **bốn câu hỏi nghiên cứu**:
- **RQ1** — CLIP hay MobileNetV2: mã hóa trực quan nào phù hợp với thời trang?
- **RQ2** — hợp nhất nào tốt nhất, và **chú ý** có thể học tập vượt qua hợp nhất muộn đơn giản không?
- **RQ3** — kiến trúc nào chiến thắng trong cấu hình tốt nhất của riêng nó?
- **RQ4** — xếp hạng đó **ổn định** giữa các K khác nhau và các chỉ số không?

Phần còn lại của bài nói trả lời những câu hỏi này theo thứ tự.

---

## Slide 5 — Tập dữ liệu · VCR  ⏱ 2:30–3:15
Chúng tôi sử dụng tập dữ liệu **Vibrent Clothes Rental** — nhật ký thuê thực tế.

Các con số chính: **553 người dùng, 2.194 mục, khoảng 9.500 tương tác**, và nó **99,2% thưa thớt**. Quan trọng nhất, mỗi người dùng trung bình chỉ có **3,81 mục thử nghiệm**.

**Số cuối cùng này là động lực chính:** với quá ít mục cơ sở sự thật cho mỗi người dùng, danh sách xếp hạng dài hơn 5 chỉ làm bão hòa hồi tưởng và làm mở rộng sự khác biệt giữa các mô hình. Vì vậy **K = 5 là điểm cắt chính của chúng tôi**, và chúng tôi báo cáo K của 1, 5, 10 và 20 để so sánh.

---

## Slide 6 — Phương pháp · Không gian cấu hình  ⏱ 3:15–4:00
Quy trình là tiêu chuẩn: lọc nhật ký, trích xuất đặc trưng, cấp dữ liệu cho GNN đa phương tiện, và đánh giá xếp hạng hàng đầu N.

Thí nghiệm là lưới **24 ô** dọc theo ba trục:
- **Ba kiến trúc** — CombiGCN, BM3, FREEDOM.
- **Hai mã hóa tầm nhìn** — CLIP ở 512 chiều, và MobileNetV2, được giảm từ 1280 xuống 768 bằng PCA. Văn bản được mã hóa bằng BERT (768 chiều); riêng CombiGCN dùng thêm độ tương đồng TF-IDF để dựng đồ thị.
- **Bốn loại hợp nhất** — chỉ hình ảnh, chỉ văn bản, hợp nhất muộn, và chú ý có thể huấn luyện.

**Một khung hình quan trọng:** cả ba kiến trúc đều chia sẻ **lược đồ lan truyền LightGCN** làm xương sống lọc hợp tác của họ. LightGCN là nền tảng họ kế thừa — nó *không phải* được chạy như một cấu hình riêng biệt.

---

## Slide 7 — Mô hình  ⏱ 4:00–4:45
Ba mô hình khác nhau ở **cách** họ đưa vào nội dung đa phương tiện.

**CombiGCN** làm điều đó ở *cấp độ dữ liệu* — nó tính toán trước đồ thị tương tự mục–mục từ các đặc trưng nội dung và hợp nhất nhánh đó với nhánh hợp tác ở mỗi lớp.

**BM3** làm điều đó ở *cấp độ mô hình* — một LightGCN cộng với mất mát tương phản kỳ ngoại tự giám sát **bootstrap**, với mã hóa đích EMA và không có lấy mẫu âm. Như chúng ta sẽ thấy, điều đó hoạt động như một chính quy hóa mạnh.

**FREEDOM** đóng băng **đồ thị nội dung kNN** tại khởi tạo và căn chỉnh các chế độ xem hợp tác và ngữ nghĩa với mất mát InfoNCE.

---

## Slide 8 — Thiết kế Tích hợp Đa phương tiện  ⏱ 4:45–5:15
Hai mô hình tích hợp, cạnh nhau.

**Cấp độ dữ liệu**, trong CombiGCN: hợp nhất xảy ra ngoại tuyến — các đặc trưng trở thành ma trận tương tự S hoạt động như một tiên nghiệm cấu trúc tĩnh, tách biệt với kích thước đặc trưng.

**Cấp độ mô hình**, trong BM3 và FREEDOM: các nhúng thô được chiếu vào không gian CF và hợp nhất từ đầu đến cuối — hoặc bằng **trung bình** không có tham số (hợp nhất muộn), hoặc bằng **cửa chú ý có thể huấn luyện** cân nhắc mỗi phương thức cho mỗi mục.

Sự tương phản đó — trung bình cố định so với cổng học tập — chính xác là những gì RQ2 kiểm tra.

---

## Slide 9 — RQ1 · Mã hóa trực quan  ⏱ 5:15–6:05
**RQ1: CLIP hay MobileNetV2.** Nhìn vào các thanh — và lưu ý người chiến thắng *lật ngược* với cấu hình.

**Bên trong cấu hình hợp nhất muộn tốt nhất của mỗi mô hình, MobileNetV2 chiến thắng** — đối với đa phương tiện BM3 nó là 0,0186 so với 0,0142. Trực giác: tương thích thời trang phụ thuộc vào **bề mặt địa phương, may vá, hoa văn** — chính xác những gì mã hóa tích chập bảo tồn, trong khi CLIP nắm bắt ngữ nghĩa thô hơn.

**Nhưng — và điều này rất quan trọng — CLIP chiến thắng các cài đặt chỉ trực quan và chỉ văn bản**, ví dụ như CombiGCN chỉ hình ảnh. Vì vậy yêu cầu của chúng tôi được xác định phạm vi cụ thể: **lợi thế của MobileNetV2 phụ thuộc vào cấu hình, không phổ quát.**

---

## Slide 10 — RQ2 · Chiến lược hợp nhất  ⏱ 6:05–7:00
**RQ2: hợp nhất nào?** Câu trả lời rõ ràng và hơi phản trực quan.

**Hợp nhất muộn không có tham số là chiến lược tốt nhất** cho các mô hình mạnh — kết hợp hình ảnh và văn bản vượt qua bất kỳ phương thức nào.

**Thêm một cổng chú ý có thể huấn luyện thực tế sẽ làm tổn hại** — nó giảm BM3 bởi **46%** và CombiGCN bởi **14%**. Với chỉ ~9.500 tương tác, những tham số bổ sung đó **quá khớp và thêm nhiễu**. Mô hình duy nhất nó giúp là FREEDOM, mô hình yếu nhất, và chỉ bởi 8%.

**Bài học: trên dữ liệu thưa thớt, hợp nhất đơn giản hơn là mạnh hơn.**

---

## Slide 11 — RQ3 · So sánh mô hình  ⏱ 7:00–7:50
**RQ3: kiến trúc nào?** Hệ thống phân cấp là **BM3 > CombiGCN > FREEDOM**, nhất quán trên các chỉ số.

**BM3 dẫn đầu cho mỗi điểm cắt từ K = 5 trở lên** — NDCG@10 tốt nhất của nó là 0,0186.

Một sắc thái trung thực: **ở K = 1, BM3 và CombiGCN bằng nhau**, cả hai đều ở 0,0127 — lợi thế duy nhất của CombiGCN là một chút trên Precision@10. Vì vậy lợi thế của BM3 thực sự nổi lên ở **độ sâu truy xuất vừa phải**, không phải ở cực độ một mục.

FREEDOM khoảng **53% dưới BM3** — xây dựng đồ thị kNN từ các đặc trưng thô chỉ đưa quá nhiều nhiễu trên tập dữ liệu nhỏ như vậy.

---

## Slide 12 — Động lực huấn luyện  ⏱ 7:50–8:30
Ngoài độ chính xác, **hành vi huấn luyện** kể một câu chuyện bổ sung — điều này trả lời một câu hỏi thực tế "mô hình nào khi?".

**CombiGCN hội tụ nhanh nhất** — nó đạt đỉnh ở kỷ nguyên 280, khoảng **2,5 lần nhanh hơn** BM3 — nhưng sau đó nó quá khớp: mất mát huấn luyện tiếp tục giảm trong khi chất lượng thử nghiệm giảm.

**BM3 chậm hơn nhưng mạnh mẽ** — nó đạt đỉnh ở 720, và mục tiêu tương phản giữ nó không quá khớp.

**FREEDOM đạt đỉnh rất muộn và bằng phẳng**, báo hiệu một hướng tối ưu hóa yếu.

Vì vậy nếu ngân sách huấn luyện chặt chẽ, CombiGCN với dừng sớm là một lựa chọn hợp lý; để có chất lượng tốt nhất, BM3.
*(Lưu ý: chạy đơn — tôi trình bày điều này như một xu hướng, không phải một bảo đảm.)*

---

## Slide 13 — Kết luận & Đóng góp  ⏱ 8:30–9:15
Bốn điểm rút ra:

1. **Hợp nhất đa phương tiện muộn giúp** — trong mỗi kiến trúc, hình ảnh cộng với văn bản vượt qua phương thức đơn lẻ.
2. **Lựa chọn mã hóa có điều kiện** — MobileNetV2 cho hợp nhất muộn, CLIP cho chỉ trực quan; không phải xếp hạng phổ quát.
3. **Hợp nhất đơn giản hơn là mạnh hơn** — hợp nhất muộn mạnh mẽ; chú ý có thể huấn luyện quá khớp trên nhật ký thưa thớt.
4. **Kiến trúc tương tác với độ sâu** — BM3 cho K ≥ 5, CombiGCN bằng nhau ở top-1 và huấn luyện nhanh hơn.

**Cấu hình tốt nhất duy nhất là BM3 với MobileNetV2 và hợp nhất đa phương tiện muộn — NDCG@10 của 0,0186.**

---

## Slide 14 — Hạn chế & Công việc tương lai  ⏱ 9:15–9:45
Tôi muốn thực tế về ranh giới.

Kết quả là từ **một lần chạy** — vì vậy biên số hẹp là xu hướng chỉ thị, không được xác nhận thống kê. Điểm số tuyệt đối ở **gần sàn** vì thưa thớt cực kỳ. Chúng tôi **không** điều chỉnh một LightGCN độc lập hoặc cơ sở đường dẫn phổ biến, và kích thước nhúng được khắc phục. Các đặc trưng **tĩnh**, bỏ qua các xu hướng thời gian.

**Công việc tương lai**: kiểm tra ý nghĩa đa hạt giống, các cơ sở đúng đắn, một tổ hợp khả năng nhúng, và hợp nhất biết trình tự, nhận biết thời gian.

---

## Slide 15 — Cảm ơn  ⏱ 9:45–10:00
Đó là kết thúc bài thuyết trình của tôi. **Thông điệp cốt lõi: kết hợp nội dung đa phương tiện với lọc hợp tác dựa trên đồ thị giúp giảm thiểu sự thưa thớt trong gợi ý thời trang — nhưng những lợi ích phụ thuộc vào mã hóa, hợp nhất và kiến trúc bạn ghép nối chúng.**

Cảm ơn — tôi sẵn sàng trả lời các câu hỏi của bạn.

---

## Tham khảo nhanh Q&A (xem các slide phụ lục A1–A2)
- **"Điểm số rất nhỏ — hữu ích?"** → gần sàn theo xây dựng (99,2% thưa thớt, 3,81 mục/người dùng); đóng góp là so sánh tương đối.
- **"MBNv2 > CLIP nhưng CLIP chiến thắng một số?"** → rõ ràng phụ thuộc cấu hình; được giới hạn ở chế độ hợp nhất muộn.
- **"Tại sao chú ý làm hại?"** → các tham số có thể huấn luyện quá khớp 9.455 tương tác; hợp nhất muộn không có dung lượng để quá khớp.
- **"Không có cơ sở LightGCN?"** → đó là xương sống chia sẻ, không phải chạy độc lập; được công bố trong hạn chế.
- **"Chạy đơn — đáng tin cậy?"** → được công bố; thứ tự là tín hiệu mạnh mẽ; đa hạt giống là công việc tương lai.
- **"Tại sao BM3 tốt nhất?"** → tự giám sát tương phản bootstrap chính quy; chống quá khớp dưới sự thưa thớt.
