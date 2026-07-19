/* =============================================================================
 * build_deck.js
 * Faithful, EDITABLE PPTX rebuild of "Fashion RecSys Deck.dc.html" (deck-stage).
 * Every element is a native PowerPoint object (text box / shape / table / image),
 * so the deck can be fine-tuned inside PowerPoint.
 *
 *   Run:  cd 4_docs/02_Present/present_v2 && node build_deck.js
 *   Out:  Fashion_RecSys_Deck_editable.pptx
 *
 * Coordinate model (HTML canvas 1920x1080  ->  16:9 slide 13.333" x 7.5"):
 *   inch = px / 144        pt = px / 2
 * Fonts (PPT-safe substitutes for the deck's Google fonts):
 *   Playfair Display -> Georgia (serif)   DM Sans -> Segoe UI (sans)   mono -> Consolas
 * ========================================================================== */
const path = require('path');
const fs = require('fs');
const https = require('https');
const PptxGenJS = require('pptxgenjs');

const UP = path.join(__dirname, 'uploads');            // source images
const FDIR = path.join(__dirname, 'formulas');         // rendered LaTeX PNGs
const OUT = path.join(__dirname, 'Fashion_RecSys_Deck_editable.pptx');

// ---- unit helpers -----------------------------------------------------------
const IN = px => px / 144;     // px -> inches
const PT = px => px / 2;       // px -> points
const img = f => path.join(UP, f);

// ---- palette ----------------------------------------------------------------
const C = {
  navy: '0D1B3E', navy2: '1A3060', blue: '1464B4', red: 'C1272D',
  white: 'FFFFFF', off: 'EEF3FA', lt: 'E4EAF4', muted: '8899BB',
  dark: '1A1E2E', green: '1A7A50', greenLt: '7ECBA5', gold: 'C89A00',
  redBg: 'FDF3F3', goldBg: 'FDF8E8', greenBg: 'F0FAF5', imgBg: 'F5F7FB',
  barTrk: 'E4EAF4', barClipGrey: 'AAB8D0', line: 'DDE3F0',
};
const F = { serif: 'Georgia', sans: 'Segoe UI', mono: 'Consolas' };

// tag chip presets: [bg, fg]
const TAG = {
  tb: ['DEEAF9', C.blue], tr: ['FAE5E5', C.red],
  tg: ['D8F0E8', C.green], tn: ['E8E9EF', C.navy],
};

// ---- layout constants -------------------------------------------------------
const PADX = IN(96);                 // side padding
const CW = 13.333 - PADX * 2;        // content width  (12.0")
const CXL = PADX;                    // left edge
const CXR = 13.333 - PADX;           // right edge
const EYE_Y = IN(112);
const TITLE_Y = IN(158);
const FOOT_Y = IN(980);
const COLGAP = IN(52);
const COLW = (CW - COLGAP) / 2;      // default two-column width
const COL2X = CXL + COLW + COLGAP;   // right column x

// =============================================================================
// inline markup -> pptx runs.   **bold**   `mono`
// =============================================================================
function runs(str, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m;
  const push = (t, extra) => { if (t) out.push({ text: t, options: { ...base, ...extra } }); };
  while ((m = re.exec(str))) {
    push(str.slice(last, m.index), {});
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else push(tok.slice(1, -1), { fontFace: F.mono, color: C.green });
    last = re.lastIndex;
  }
  push(str.slice(last), {});
  return out.length ? out : [{ text: str, options: base }];
}

// read intrinsic PNG size (for aspect-correct placement)
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

// =============================================================================
// reusable primitives
// =============================================================================
function box(s, x, y, w, h, { fill = C.off, accent = null, accentColor = C.blue, line = null } = {}) {
  s.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: fill },
    line: line ? { color: line, width: 1 } : { type: 'none' },
  });
  if (accent) s.addShape('rect', { x, y: y + 0.02, w: 0.055, h: h - 0.04, fill: { color: accentColor }, line: { type: 'none' } });
}

function eyebrow(s, text, color = C.blue, y = EYE_Y, x = CXL, w = CW) {
  s.addText(text.toUpperCase(), {
    x, y, w, h: 0.3, fontFace: F.sans, fontSize: 12, bold: true,
    color, charSpacing: 2, align: 'left', valign: 'middle',
  });
}

function title(s, text, { dark = false, y = TITLE_Y, size = 25, h = 0.95 } = {}) {
  s.addText(text.replace(/<br>/g, '\n'), {
    x: CXL, y, w: CW, h, fontFace: F.serif, fontSize: size, bold: true,
    color: dark ? C.white : C.navy, align: 'left', valign: 'top', lineSpacingMultiple: 1.05,
  });
}

function footer(s, name, page, dark = false) {
  s.addShape('line', { x: CXL, y: FOOT_Y, w: CW, h: 0, line: { color: dark ? '39456B' : C.line, width: 1 } });
  s.addText('Hoang Dinh Quy Vu · research topic 2', {
    x: CXL, y: FOOT_Y + 0.03, w: CW * 0.7, h: 0.3, fontFace: F.sans, fontSize: 12,
    color: dark ? 'FFFFFF' : C.muted, align: 'left', valign: 'middle', transparency: dark ? 70 : 0,
  });
  s.addText(page, {
    x: CXR - 2, y: FOOT_Y + 0.03, w: 2, h: 0.3, fontFace: F.sans, fontSize: 12, bold: true,
    color: dark ? 'FFFFFF' : C.navy, align: 'right', valign: 'middle', transparency: dark ? 50 : 0,
  });
}

function tag(s, x, y, text, kind, h = 0.34) {
  const [bg, fg] = TAG[kind];
  const w = 0.32 + text.length * 0.099;
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.03, fill: { color: bg }, line: { type: 'none' } });
  s.addText(text, { x, y, w, h, fontFace: F.sans, fontSize: 12, bold: true, color: fg, align: 'center', valign: 'middle', wrap: false });
  return w;
}

function tagRow(s, x, y, items, gap = 0.12) {
  let cx = x;
  for (const [text, kind] of items) cx += tag(s, cx, y, text, kind) + gap;
}

function stepNum(s, x, y, label, color = C.blue, d = 0.34) {
  s.addShape('ellipse', { x, y, w: d, h: d, fill: { color }, line: { type: 'none' } });
  s.addText(label, { x, y, w: d, h: d, fontFace: F.sans, fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle' });
}

// simple bullet: colored dot + body text run
function bullet(s, x, y, w, str, { dot = C.blue, size = 13, h = 0.5 } = {}) {
  s.addShape('ellipse', { x, y: y + 0.09, w: 0.07, h: 0.07, fill: { color: dot }, line: { type: 'none' } });
  s.addText(runs(str, { fontFace: F.sans, fontSize: size, color: C.dark }), {
    x: x + 0.16, y, w: w - 0.16, h, align: 'left', valign: 'top', lineSpacingMultiple: 1.1,
  });
}

function body(s, x, y, w, str, opts = {}) {
  s.addText(runs(str, { fontFace: F.sans, fontSize: opts.size || 13, color: opts.color || C.dark }), {
    x, y, w, h: opts.h || 0.5, align: 'left', valign: opts.valign || 'top', lineSpacingMultiple: opts.ls || 1.15,
  });
}

function h3(s, x, y, w, text, color = C.navy, size = 15) {
  s.addText(text, { x, y, w, h: 0.35, fontFace: F.sans, fontSize: size, bold: true, color, align: 'left', valign: 'top' });
}

function pic(s, file, x, y, w, h) {
  s.addImage({ path: img(file), x, y, w, h, sizing: { type: 'contain', w, h } });
}

// picture panel with soft background (mirrors the .imgBg image wrapper)
function picPanel(s, file, x, y, w, h) {
  box(s, x, y, w, h, { fill: C.imgBg });
  const pad = 0.14;
  s.addImage({ path: img(file), x: x + pad, y: y + pad, w: w - 2 * pad, h: h - 2 * pad, sizing: { type: 'contain', w: w - 2 * pad, h: h - 2 * pad } });
}

// =============================================================================
// deck framework
// =============================================================================
const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'W16x9', width: 13.333, height: 7.5 });
pptx.layout = 'W16x9';
pptx.author = 'Hoang Dinh Quy Vu';
pptx.title = 'Integrating Multimodal Representations into Graph-based Fashion Recommender Systems';

const LOGO = img('logo.jpg');
const LOGO_ASPECT = (() => { try { const s = pngSize; return 1; } catch { return 1; } })();

function newSlide(dark = false, { notes = '', logo = true } = {}) {
  const s = pptx.addSlide();
  s.background = { color: dark ? C.navy : C.white };
  if (logo) s.addImage({ path: LOGO, x: CXR - 1.0, y: 0.12, w: 1.0, h: 0.52, sizing: { type: 'contain', w: 1.0, h: 0.52 } });
  if (notes) s.addNotes(notes);
  return s;
}

// content slide scaffold (light bg): eyebrow + title + footer
function contentSlide(eye, eyeColor, ttl, page, notes, { titleSize = 25 } = {}) {
  const s = newSlide(false, { notes });
  eyebrow(s, eye, eyeColor);
  title(s, ttl, { size: titleSize });
  footer(s, null, page, false);
  return s;
}

const CONTENT_Y = IN(300);   // where the .cols content region begins

// =============================================================================
// SLIDES
// =============================================================================
const N = {}; // speaker notes captured from HTML data-speaker-notes

// ---- 01 COVER ---------------------------------------------------------------
N.cover = "Kính thưa quý thầy cô trong Hội đồng và các bạn sinh viên. Em tên là Hoàng Đình Quý Vũ, mã số sinh viên 252805008, là sinh viên khoa Công nghệ Thông tin, trường Đại học Tôn Đức Thắng. Sau đây, em xin phép được trình bày báo cáo đề tài Capstone 3 của mình với tên gọi: 'Tích hợp biểu diễn đa phương thức vào hệ thống gợi ý thời trang dựa trên đồ thị'. Đề tài được thực hiện dưới sự hướng dẫn của Tiến sĩ Trần Trung Tín, đánh giá 24 cấu hình mạng đồ thị đa phương thức trên tập Vibrent Clothes Rental.";
(function cover() {
  const s = newSlide(true, { notes: N.cover, logo: true });
  s.addText('TON DUC THANG UNIVERSITY · FACULTY OF INFORMATION TECHNOLOGY', {
    x: CXL, y: IN(112), w: CW, h: 0.3, fontFace: F.sans, fontSize: 12, color: C.muted, charSpacing: 1.5, valign: 'middle',
  });
  s.addText('research topic 2 · Computer Science · Ho Chi Minh City, 2026', {
    x: CXL, y: IN(150), w: CW, h: 0.3, fontFace: F.sans, fontSize: 12, color: '5A6B8C', valign: 'middle',
  });
  // accent ticks
  s.addShape('roundRect', { x: CXL, y: 2.55, w: 0.31, h: 0.03, rectRadius: 0.015, fill: { color: C.red }, line: { type: 'none' } });
  s.addShape('roundRect', { x: CXL + 0.36, y: 2.55, w: 0.1, h: 0.03, rectRadius: 0.015, fill: { color: C.blue }, line: { type: 'none' } });
  s.addText('Integrating Multimodal Representations\ninto Graph-based Fashion Recommender Systems', {
    x: CXL, y: 2.7, w: 10.6, h: 1.7, fontFace: F.serif, fontSize: 32, bold: true, color: C.white, lineSpacingMultiple: 1.12, valign: 'top',
  });
  s.addText('Benchmarking 24 multimodal GNN configurations on the Vibrent Clothes Rental dataset', {
    x: CXL, y: 4.45, w: 10.6, h: 0.5, fontFace: F.sans, fontSize: 15, color: C.muted, valign: 'top',
  });
  // presenter / advisor
  s.addText([
    { text: 'Presented by\n', options: { fontSize: 11, color: C.muted } },
    { text: 'Hoang Dinh Quy Vu · 252805008', options: { fontSize: 13, bold: true, color: C.white, fontFace: F.serif } },
  ], { x: CXL, y: 6.05, w: 4.2, h: 0.8, fontFace: F.sans, valign: 'top', lineSpacingMultiple: 1.2 });
  s.addText([
    { text: 'Advised by\n', options: { fontSize: 11, color: C.muted } },
    { text: 'Dr. Tran Trung Tin', options: { fontSize: 13, bold: true, color: C.white, fontFace: F.serif } },
  ], { x: CXL + 3.1, y: 6.05, w: 4, h: 0.8, fontFace: F.sans, valign: 'top', lineSpacingMultiple: 1.2 });
  // keyword chips
  const kws = ['BM3', 'CombiGCN', 'FREEDOM', 'CLIP', 'MobileNetV2', 'BERT'];
  let cx = CXR - 4.4;
  kws.forEach((k, i) => {
    const w = 0.24 + k.length * 0.085;
    const yy = 6.15 + (i < 3 ? 0 : 0.42);
    if (i === 3) cx = CXR - 4.4;
    s.addShape('roundRect', { x: cx, y: yy, w, h: 0.34, rectRadius: 0.03, fill: { color: '17264A' }, line: { color: C.greenLt, width: 0.5, transparency: 70 } });
    s.addText(k, { x: cx, y: yy, w, h: 0.34, fontFace: F.mono, fontSize: 11, color: C.greenLt, align: 'center', valign: 'middle' });
    cx += w + 0.12;
  });
})();

// ---- 02 TABLE OF CONTENTS ---------------------------------------------------
N.toc = "Bài thuyết trình gồm 5 phần: (1) Đặt vấn đề & động lực; (2) Câu hỏi nghiên cứu & mục tiêu; (3) Phương pháp & pipeline cùng 3 mô hình GNN; (4) Cấu hình thực nghiệm & tập dữ liệu VCR; (5) Kết quả thực nghiệm & thảo luận, kết luận.";
(function toc() {
  const s = newSlide(true, { notes: N.toc });
  eyebrow(s, 'Roadmap · 5 Sections', C.muted);
  title(s, 'Table of Contents', { dark: true });
  const items = [
    ['01', 'Problem &\nMotivation', 'Sparsity · Cold-start · Bottlenecks'],
    ['02', 'Research\nQuestions', 'Four RQs · Objectives · Scope'],
    ['03', 'Methodology\n& Pipeline', 'Architecture · CombiGCN · BM3 · FREEDOM'],
    ['04', 'Model Config\n& Data', 'VCR Dataset · 24 Configs · Features'],
    ['05', 'Experiments', 'RQ1 · RQ2 · RQ3 · Training · Conclusion'],
  ];
  const y = 2.55, h = 3.4, gap = 0.0;
  const cw = CW / 5;
  items.forEach((it, i) => {
    const x = CXL + i * cw;
    s.addShape('line', { x, y, w: 0, h, line: { color: 'FFFFFF', width: 1.5, transparency: 85 } });
    s.addText(it[0], { x: x + 0.22, y: y + 0.1, w: cw - 0.3, h: 1.1, fontFace: F.serif, fontSize: 46, bold: true, color: C.blue, valign: 'top' });
    s.addText(it[1], { x: x + 0.22, y: y + 1.35, w: cw - 0.34, h: 1.0, fontFace: F.sans, fontSize: 14, bold: true, color: C.white, valign: 'top', lineSpacingMultiple: 1.1 });
    s.addText(it[2], { x: x + 0.22, y: y + 2.4, w: cw - 0.34, h: 0.9, fontFace: F.sans, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.15 });
  });
  s.addShape('line', { x: CXR, y, w: 0, h, line: { color: 'FFFFFF', width: 1.5, transparency: 85 } });
  footer(s, null, '02 / 20', true);
})();

// ---- 03 CF / CB / HYBRID  (image + ADDED concept bullets) -------------------
N.cfcb = "Trước bài toán chính, em trình bày ngắn gọn 3 triết lý gợi ý nền tảng. (1) Collaborative Filtering (CF): gợi ý dựa trên hành vi tương tác; điểm yếu là Cold-Start khi sản phẩm mới chưa có tương tác. (2) Content-Based (CB): đo tương đồng qua nội dung (màu, chất liệu, kiểu dáng), giải quyết Cold-Start. (3) Hybrid trong GCN: item_next = item_interaction (CF) + item_similar (CB), để CB bù đắp điểm yếu Cold-Start của CF trong một mô hình GCN thống nhất.";
(function cfcb() {
  const s = contentSlide('Background · Recommender Paradigms', C.blue,
    'CF, Content-Based & Hybrid —<br>three paradigms underlying this work', '03 / 20', N.cfcb);
  // left column: concise concept cards (ADDED)
  const lw = COLW, x = CXL;
  let y = CONTENT_Y;
  const cards = [
    ['CF', 'tb', C.blue, 'Collaborative Filtering', 'Recommends from **interaction behaviour** — co-bought items suggest each other. Weakness: **cold-start** — a new item with no interactions is isolated.'],
    ['CB', 'tg', C.green, 'Content-Based', 'Measures **item–item similarity** from content (colour, material, silhouette). **Solves cold-start** — new items still link through content.'],
    ['HYBRID', 'tn', C.navy, 'Hybrid (in GCN)', 'Combines both: `item_next = item_interaction + item_similar` — CB covers CF’s cold-start gap in one unified GCN.'],
  ];
  const ch = 1.46, cg = 0.14;
  cards.forEach(([lab, kind, ac, head, txt]) => {
    box(s, x, y, lw, ch, { fill: C.off, accent: true, accentColor: ac });
    tag(s, x + 0.2, y + 0.18, lab, kind, 0.32);
    h3(s, x + 0.2, y + 0.62, lw - 0.4, head, ac, 14);
    body(s, x + 0.2, y + 0.98, lw - 0.4, txt, { size: 11.5, ls: 1.08 });
    y += ch + cg;
  });
  // right column: diagram
  picPanel(s, 'Cf_CB_Hybrid.png', COL2X, CONTENT_Y, COLW, ch * 3 + cg * 2);
})();

// ---- 04 PROBLEM -------------------------------------------------------------
N.problem = "Gợi ý thời trang đối mặt hai nút thắt song hành: (1) tương tác cực thưa (>99%) khiến CF truyền thống thiếu tín hiệu; (2) phụ thuộc hoàn toàn vào ID sản phẩm, bỏ qua hình ảnh/mô tả. Ý tưởng: tích hợp đặc trưng đa phương thức (ảnh + văn bản) vào đồ thị để truyền tín hiệu qua các cạnh tương đồng, giải quyết cold-start & dữ liệu thưa.";
(function problem() {
  const s = contentSlide('01 · Problem & Motivation', C.blue,
    'Sparse interactions expose two coupled<br>bottlenecks in ID-bound collaborative filtering', '04 / 20', N.problem);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Fashion recommendation is hard'); y += 0.4;
  bullet(s, CXL, y, COLW, 'Users interact with very few items, leaving the user–item graph **extremely sparse**', { h: 0.6 }); y += 0.62;
  bullet(s, CXL, y, COLW, 'Short per-user history = near-zero signal for cold & tail items', { h: 0.5 }); y += 0.65;
  h3(s, CXL, y, COLW, 'Two coupled bottlenecks'); y += 0.4;
  bullet(s, CXL, y, COLW, '**ID-bound CF** — cold / tail items have no interaction signal to learn from', { dot: C.red, h: 0.6 }); y += 0.62;
  bullet(s, CXL, y, COLW, '**Style is visual & textual** — pure interaction IDs ignore aesthetics & descriptions entirely', { dot: C.red, h: 0.6 });
  // right column boxes
  let ry = CONTENT_Y;
  box(s, COL2X, ry, COLW, 1.55, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'Our Angle', C.blue, ry + 0.16, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.55, COLW - 0.44, 'Inject multimodal item content (visual + textual features) into graph collaborative filtering to propagate preference signals along **visual and semantic similarity edges**', { size: 12.5, ls: 1.15 });
  ry += 1.75;
  box(s, COL2X, ry, COLW, 1.55, { fill: C.redBg, accent: true, accentColor: C.red });
  eyebrow(s, 'Key Challenge', C.red, ry + 0.16, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.55, COLW - 0.44, 'Bridging the gap between rich item content and sparse interaction graphs without overfitting a 9,455-interaction log', { size: 12.5, ls: 1.15 });
})();

// ---- 05 RESEARCH QUESTIONS --------------------------------------------------
N.rq = "4 câu hỏi nghiên cứu: RQ1 – bộ mã hóa hình ảnh nào phù hợp (CLIP vs MobileNetV2)? RQ2 – chiến lược hợp nhất nào tốt nhất? RQ3 – kiến trúc GNN nào mạnh nhất (CombiGCN/BM3/FREEDOM)? RQ4 – đa phương thức có hơn đơn phương thức? Kèm 5 mục tiêu O1–O5 từ tiền xử lý, trích xuất đặc trưng, huấn luyện tới đánh giá @K.";
(function rq() {
  const s = contentSlide('02 · Research Questions & Objectives', C.blue,
    'Four RQs probe encoder, fusion strategy,<br>architecture depth, and cross-modal effects', '05 / 20', N.rq);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Objectives', C.blue); y += 0.42;
  const obj = [
    ['O1', 'Preprocess VCR dataset (5-core, per-user 80/20 temporal split)'],
    ['O2', 'Extract visual `CLIP` `MBNv2` & textual `BERT` features'],
    ['O3', 'Adapt 3 multimodal GNNs on a shared LightGCN backbone'],
    ['O4', 'Benchmark 24 configs across encoders & fusion strategies'],
    ['O5', 'Analyse ranking quality across K ∈ {1, 5, 10, 20}'],
  ];
  obj.forEach(([n, t]) => {
    stepNum(s, CXL, y, n, C.blue);
    body(s, CXL + 0.5, y - 0.02, COLW - 0.5, t, { size: 12.5, ls: 1.1 });
    y += 0.62;
  });
  // right: 4 RQ boxes
  let ry = CONTENT_Y;
  h3(s, COL2X, ry, COLW, 'Four Research Questions', C.blue); ry += 0.42;
  const rqs = [
    ['RQ1', 'Which visual encoder — CLIP or MobileNetV2 — suits fashion recommendation better?'],
    ['RQ2', 'Which multimodal fusion strategy (late, attention, weighted) maximises ranking quality on sparse logs?'],
    ['RQ3', 'Which GNN architecture (CombiGCN, BM3, FREEDOM) performs best on the VCR dataset?'],
    ['RQ4', 'Do single-modality features outperform cross-modal fusion?'],
  ];
  const bh = 0.86, bg = 0.1;
  rqs.forEach(([n, t]) => {
    box(s, COL2X, ry, COLW, bh, { fill: C.off, accent: true, accentColor: C.blue });
    eyebrow(s, n, C.blue, ry + 0.1, COL2X + 0.22, COLW - 0.44);
    body(s, COL2X + 0.22, ry + 0.38, COLW - 0.44, t, { size: 12, ls: 1.08 });
    ry += bh + bg;
  });
})();

// ---- 06 DATASET -------------------------------------------------------------
N.dataset = "Tập VCR (Vibrent Clothes Rental) rất thưa (99.22%): 553 users, 2,194 items, 9,455 tương tác — môi trường lý tưởng test cold-start. Chia temporal 80/20 mỗi user; trung bình 3.81 item/user trong test nên chọn K=5 làm chỉ số chính để tránh bão hòa Recall ở K lớn.";
(function dataset() {
  const s = contentSlide('03 · Dataset · Vibrent Clothes Rental (VCR)', C.blue,
    '99.22% sparsity makes VCR an ideal<br>cold-start stress test for recommender systems', '06 / 20', N.dataset);
  const leftW = CW * 0.42, rightX = CXL + leftW + COLGAP, rightW = CW - leftW - COLGAP;
  picPanel(s, 'data_pipeline.3.1.png', CXL, CONTENT_Y, leftW, IN(650));
  // stat grid
  let ry = CONTENT_Y;
  const gw = (rightW - 0.12) / 2, gh = 0.82;
  const stats = [['553', 'Users', false], ['2,194', 'Items', false], ['9,455', 'Interactions', false], ['99.22%', 'Sparsity', true]];
  stats.forEach((st, i) => {
    const gx = rightX + (i % 2) * (gw + 0.12);
    const gy = ry + Math.floor(i / 2) * (gh + 0.12);
    box(s, gx, gy, gw, gh, { fill: st[2] ? C.redBg : C.off, accent: true, accentColor: st[2] ? C.red : C.blue });
    s.addText(st[0], { x: gx + 0.2, y: gy + 0.08, w: gw - 0.3, h: 0.5, fontFace: F.serif, fontSize: 30, bold: true, color: st[2] ? C.red : C.navy, valign: 'middle' });
    s.addText(st[1], { x: gx + 0.2, y: gy + 0.54, w: gw - 0.3, h: 0.24, fontFace: F.sans, fontSize: 11, color: C.muted, valign: 'middle' });
  });
  ry += gh * 2 + 0.24;
  box(s, rightX, ry, rightW, 0.82, { fill: C.off, accent: true, accentColor: C.blue });
  h3(s, rightX + 0.2, ry + 0.12, rightW - 0.4, 'Split Strategy', C.navy, 13);
  body(s, rightX + 0.2, ry + 0.42, rightW - 0.4, 'Per-user **temporal 80/20** split — training on earlier interactions, testing on more recent ones', { size: 11.5, ls: 1.05 });
  ry += 0.94;
  box(s, rightX, ry, rightW, 0.94, { fill: C.goldBg, accent: true, accentColor: C.gold });
  eyebrow(s, 'Why K = 5 is primary', '9A7600', ry + 0.1, rightX + 0.2, rightW - 0.4);
  body(s, rightX + 0.2, ry + 0.38, rightW - 0.4, 'With only **3.81 ground-truth items / user** on average, top-K beyond 5 saturates Recall — K ∈ {1,5,10,20} all reported', { size: 11.5, ls: 1.05 });
})();

// ---- 07 PIPELINE ------------------------------------------------------------
N.pipeline = "Pipeline 5 giai đoạn: (1) Lọc 5-core; (2) Ánh xạ ID về chỉ số liên tục; (3) Temporal split 80/20 mỗi user; (4) Trích xuất đặc trưng đa phương thức (CLIP, MobileNetV2→PCA 768, BERT); (5) Huấn luyện & đánh giá 24 cấu hình GNN với siêu tham số dùng chung.";
(function pipeline() {
  const s = contentSlide('04 · Methodology · Proposed Data Pipeline', C.blue,
    'Five stages distill raw rental logs<br>into model-ready multimodal graphs', '07 / 20', N.pipeline);
  let y = CONTENT_Y;
  const steps1 = [
    ['1', 'Initial Filtering', 'Apply `5-core` filtering iteratively — remove users & items with fewer than 5 interactions'],
    ['2', 'ID Remapping', 'Map sparse raw IDs → dense sequential indices; build clean adjacency matrix'],
    ['3', 'Temporal Split', 'Per-user chronological partition: **80% train · 20% test**'],
  ];
  steps1.forEach(([n, hd, tx]) => {
    stepNum(s, CXL, y, n);
    h3(s, CXL + 0.5, y - 0.04, COLW - 0.5, hd, C.navy, 14);
    body(s, CXL + 0.5, y + 0.28, COLW - 0.5, tx, { size: 12, ls: 1.1 });
    y += 1.0;
  });
  let ry = CONTENT_Y;
  const steps2 = [
    ['4', 'Feature Extraction', 'Visual: `CLIP` 512-d · `MobileNetV2` 1280→768 PCA\nTextual: `BERT` 768-d · `TF-IDF` (CombiGCN graph)'],
    ['5', 'GNN Training & Evaluation', 'Train 24 configurations; evaluate on NDCG, HR, Precision, Recall @ K ∈ {1,5,10,20}'],
  ];
  steps2.forEach(([n, hd, tx]) => {
    stepNum(s, COL2X, ry, n);
    h3(s, COL2X + 0.5, ry - 0.04, COLW - 0.5, hd, C.navy, 14);
    body(s, COL2X + 0.5, ry + 0.28, COLW - 0.5, tx, { size: 12, ls: 1.1 });
    ry += 1.05;
  });
  box(s, COL2X, ry + 0.05, COLW, 0.7, { fill: C.off, accent: true, accentColor: C.blue });
  body(s, COL2X + 0.2, ry + 0.16, COLW - 0.4, 'Common settings: `d = 512` · `4 GCN layers` · `lr 1e-3` · `early stop patience 40` · monitor Recall@20', { size: 11.5, color: C.muted, ls: 1.1 });
})();

// ---- 08 CONFIG SPACE --------------------------------------------------------
N.config = "24 cấu hình = 3 mô hình (CombiGCN, BM3, FREEDOM) × 2 bộ mã hóa ảnh (CLIP, MobileNetV2) × 4 chiến lược hợp nhất (img_only, text_only, late-avg, attention). Mỗi cấu hình huấn luyện tối đa 1,000 epochs với early stopping theo Recall@20.";
(function config() {
  const s = contentSlide('04 · Methodology · Configuration Space', C.blue,
    '24 configs: 3 models × 2 encoders × 4 fusions<br>— a fully crossed benchmark', '08 / 20', N.config);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Dimensions', C.blue); y += 0.42;
  box(s, CXL, y, COLW, 0.92, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'Models (× 3)', C.blue, y + 0.1, CXL + 0.2, COLW - 0.4);
  tagRow(s, CXL + 0.2, y + 0.44, [['CombiGCN', 'tb'], ['BM3', 'tb'], ['FREEDOM', 'tb']]);
  y += 1.04;
  box(s, CXL, y, COLW, 0.92, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'Visual Encoders (× 2)', C.blue, y + 0.1, CXL + 0.2, COLW - 0.4);
  tagRow(s, CXL + 0.2, y + 0.44, [['CLIP 512-d', 'tn'], ['MobileNetV2 768-d', 'tn']]);
  y += 1.04;
  box(s, CXL, y, COLW, 0.92, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'Fusion Strategies (× 4)', C.blue, y + 0.1, CXL + 0.2, COLW - 0.4);
  tagRow(s, CXL + 0.2, y + 0.44, [['img_only', 'tg'], ['text_only', 'tg'], ['late (avg)', 'tg'], ['attention', 'tg']]);
  // right: pipeline chips + total runs
  let ry = CONTENT_Y;
  h3(s, COL2X, ry, COLW, 'Pipeline Overview', C.blue); ry += 0.5;
  const chips = [['INPUT', 'VCR Log'], ['FILTER', '5-core'], ['FEATURES', 'CLIP/MBNv2/BERT'], ['GNN', 'LightGCN core'], ['EVAL', '6 metrics @ K']];
  const chw = (COLW - 0.4 * 4 * 0) / 5;
  const cellW = (COLW - 0.9) / 5;
  chips.forEach((c, i) => {
    const cx = COL2X + i * (cellW + 0.225);
    box(s, cx, ry, cellW, 0.85, { fill: C.off });
    s.addText(c[0], { x: cx, y: ry + 0.1, w: cellW, h: 0.24, fontFace: F.sans, fontSize: 9.5, bold: true, color: C.blue, align: 'center', charSpacing: 1 });
    s.addText(c[1], { x: cx + 0.02, y: ry + 0.36, w: cellW - 0.04, h: 0.42, fontFace: F.sans, fontSize: 9.5, color: C.muted, align: 'center', valign: 'middle', lineSpacingMultiple: 1 });
    if (i < 4) s.addText('→', { x: cx + cellW - 0.02, y: ry, w: 0.225, h: 0.85, fontFace: F.sans, fontSize: 14, bold: true, color: C.blue, align: 'center', valign: 'middle' });
  });
  ry += 1.15;
  box(s, COL2X, ry, COLW, 1.35, { fill: C.navy });
  s.addText('TOTAL RUNS', { x: COL2X + 0.25, y: ry + 0.16, w: COLW - 0.5, h: 0.24, fontFace: F.sans, fontSize: 11, bold: true, color: 'FFFFFF', charSpacing: 1, transparency: 55 });
  s.addText([
    { text: '24  ', options: { fontFace: F.serif, fontSize: 24, bold: true, color: C.white } },
    { text: 'configurations · each trained up to 1,000 epochs with early stopping · 6 ranking metrics reported', options: { fontFace: F.sans, fontSize: 12.5, color: C.white } },
  ], { x: COL2X + 0.25, y: ry + 0.46, w: COLW - 0.5, h: 0.8, valign: 'top', lineSpacingMultiple: 1.15 });
})();

// ---- 09 THREE MODELS --------------------------------------------------------
N.three = "3 kiến trúc tiêu biểu, chung xương sống LightGCN: CombiGCN (hợp nhất mức dữ liệu — lan truyền trên cả đồ thị tương tác và đồ thị tương đồng item-item); BM3 (hợp nhất mức mô hình qua bootstrap contrastive, không cần mẫu âm); FREEDOM (hợp nhất mức mô hình, hai view độc lập, liên kết bằng InfoNCE trên đồ thị kNN đóng băng).";
(function three() {
  const s = contentSlide('05 · Models · Three Architectures, One Backbone', C.blue,
    'Three architectures, one LightGCN backbone —<br>differing in multimodal injection strategy', '09 / 20', N.three);
  const y = CONTENT_Y, h = IN(600), gap = 0.36, w = (CW - gap * 2) / 3;
  const cards = [
    ['CombiGCN', C.blue, C.off, 'Dual-graph propagation', 'Pre-computes item–item similarity graph from content features. Fuses CF branch + similarity branch at each GCN layer.', ['Data-level fusion', 'tb']],
    ['BM3', C.red, C.redBg, 'Self-supervised bootstrap', 'Single LightGCN + raw modal projectors. Bootstrap contrastive loss with EMA target encoder. **No negative samples needed.**', ['Model-level fusion', 'tr']],
    ['FREEDOM', C.green, C.greenBg, 'Decoupled GNN + InfoNCE', 'Maintains two independent views (CF + semantic). Aligns them via InfoNCE loss over a frozen kNN graph.', ['Model-level fusion', 'tg']],
  ];
  cards.forEach((c, i) => {
    const x = CXL + i * (w + gap);
    box(s, x, y, w, h, { fill: c[2], accent: true, accentColor: c[1] });
    eyebrow(s, c[0], c[1], y + 0.2, x + 0.24, w - 0.44);
    h3(s, x + 0.24, y + 0.6, w - 0.44, c[3], C.navy, 15);
    body(s, x + 0.24, y + 1.05, w - 0.44, c[4], { size: 12.5, ls: 1.2 });
    tag(s, x + 0.24, y + h - 0.55, c[5][0], c[5][1]);
  });
})();

// ---- 10 COMBIGCN ------------------------------------------------------------
N.combi = "CombiGCN: tính trước ma trận tương đồng item-item S offline; lan truyền đồng thời trên đồ thị tương tác user-item (CF) và đồ thị tương đồng item-item (semantic); tại mỗi lớp GCN cộng trực tiếp hai biểu diễn. Hội tụ nhanh nhờ đồ thị tĩnh làm tiên nghiệm, nhưng dễ overfit nếu train quá lâu.";
(function combi() {
  const s = contentSlide('05 · Models · CombiGCN Architecture', C.blue,
    'CombiGCN fuses content at data level via<br>a pre-computed item similarity graph', '10 / 20', N.combi);
  const lw = CW * 0.4, rx = CXL + lw + COLGAP, rw = CW - lw - COLGAP;
  let y = CONTENT_Y;
  h3(s, CXL, y, lw, 'Dual-Graph Propagation', C.blue); y += 0.44;
  bullet(s, CXL, y, lw, 'Propagates representations on **two graphs simultaneously**', { h: 0.5 }); y += 0.5;
  box(s, CXL + 0.3, y, lw - 0.3, 0.55, { fill: C.off, accent: true, accentColor: C.blue });
  body(s, CXL + 0.5, y + 0.12, lw - 0.6, '① User–Item Collaborative Graph (CF branch)', { size: 11.5, color: C.muted }); y += 0.66;
  box(s, CXL + 0.3, y, lw - 0.3, 0.55, { fill: C.off, accent: true, accentColor: C.blue });
  body(s, CXL + 0.5, y + 0.12, lw - 0.6, '② Item–Item Content Similarity Graph (semantic branch)', { size: 11.5, color: C.muted }); y += 0.72;
  bullet(s, CXL, y, lw, '**Layer-wise fusion** — CF + semantic representations merged at each GCN layer', { h: 0.6 });
  picPanel(s, 'pasted-1781801152776-0.png', rx, CONTENT_Y, rw, IN(600));
})();

// ---- 11 BM3 -----------------------------------------------------------------
N.bm3 = "BM3: chỉ lan truyền LightGCN trên đồ thị tương tác; projector tuyến tính chiếu ảnh/văn bản vào không gian embedding; bootstrap contrastive loss căn chỉnh nhánh CF và nhánh đa phương thức. Không cần mẫu âm → độc lập batch-size; bootstrap như regularizer mạnh, kiểm soát overfitting trên VCR.";
(function bm3() {
  const s = contentSlide('05 · Models · BM3 Architecture', C.red,
    'BM3 aligns modalities via bootstrap loss —<br>no negatives, strong implicit regularizer', '11 / 20', N.bm3);
  const lw = CW * 0.4, rx = CXL + lw + COLGAP, rw = CW - lw - COLGAP;
  let y = CONTENT_Y;
  h3(s, CXL, y, lw, 'Bootstrap Contrastive Learning', C.blue); y += 0.44;
  const bs = [
    'Aligns collaborative branch & modal projectors via **self-supervised bootstrap loss**',
    'EMA (Exponential Moving Average) target encoder stabilizes training — no gradient on target',
    'Requires **no negative samples** → eliminates batch-size dependency',
    'Acts as a strong regularizer — explains why BM3 resists overfitting on VCR’s sparse log',
  ];
  bs.forEach(t => { bullet(s, CXL, y, lw, t, { dot: C.red, h: 0.72 }); y += 0.74; });
  picPanel(s, 'bm3.png', rx, CONTENT_Y, rw, IN(600));
})();

// ---- 12 FREEDOM -------------------------------------------------------------
N.freedom = "FREEDOM: tách biệt hoàn toàn nhánh tương tác và nhánh ngữ nghĩa; nhánh ngữ nghĩa chạy trên đồ thị kNN đóng băng lúc khởi tạo; dùng InfoNCE căn chỉnh hai view. Trên VCR, FREEDOM kém nhất (thấp hơn BM3 ~53% NDCG@10) do đồ thị kNN tĩnh trên danh mục nhỏ (2,194 items) chứa nhiều nhiễu.";
(function freedom() {
  const s = contentSlide('05 · Models · FREEDOM Architecture', C.green,
    'FREEDOM decouples CF and semantic views,<br>aligned via frozen kNN + InfoNCE loss', '12 / 20', N.freedom);
  const lw = CW * 0.4, rx = CXL + lw + COLGAP, rw = CW - lw - COLGAP;
  let y = CONTENT_Y;
  h3(s, CXL, y, lw, 'Decoupled GNN Architecture', C.green); y += 0.44;
  bullet(s, CXL, y, lw, 'Maintains **two independent views** during training', { dot: C.green, h: 0.5 }); y += 0.5;
  box(s, CXL + 0.3, y, lw - 0.3, 0.55, { fill: C.off, accent: true, accentColor: C.green });
  body(s, CXL + 0.5, y + 0.12, lw - 0.6, '① Collaborative View (CF): user–item interaction graph', { size: 11.5, color: C.muted }); y += 0.66;
  box(s, CXL + 0.3, y, lw - 0.3, 0.55, { fill: C.off, accent: true, accentColor: C.green });
  body(s, CXL + 0.5, y + 0.12, lw - 0.6, '② Semantic View: item–item kNN similarity graph', { size: 11.5, color: C.muted }); y += 0.72;
  bullet(s, CXL, y, lw, '**InfoNCE alignment** — contrastive loss aligns GNN representations with frozen kNN graph', { dot: C.green, h: 0.6 });
  picPanel(s, 'pasted-1781801166860-0.png', rx, CONTENT_Y, rw, IN(600));
})();

// ---- 13 MULTIMODAL INTEGRATION ---------------------------------------------
N.mm = "So sánh hai triết lý hợp nhất: Data-level (CombiGCN) — hợp nhất offline, ma trận S là tiên nghiệm tĩnh, dễ giải thích, tách khỏi số chiều đặc trưng. Model-level (BM3/FREEDOM) — chiếu & hợp nhất end-to-end: late fusion (trung bình cộng) vs attention gating (trọng số học được, dễ overfit khi tương tác ít); kèm baseline img_only/text_only.";
(function mm() {
  const s = contentSlide('06 · Multimodal Integration Design', C.blue,
    'Data-level vs. model-level: two fundamentally<br>different philosophies for injecting content', '13 / 20', N.mm);
  const y = CONTENT_Y, h = IN(600);
  box(s, CXL, y, COLW, h, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'DATA-LEVEL · CombiGCN', C.blue, y + 0.18, CXL + 0.24, COLW - 0.44);
  body(s, CXL + 0.24, y + 0.5, COLW - 0.48, 'Fusion happens **offline** at the data layer — before any model sees the data', { size: 12.5, ls: 1.1 });
  bullet(s, CXL + 0.24, y + 1.15, COLW - 0.48, 'Visual + textual → item–item similarity matrix `S` (cosine, thresholded, normalised, cached)', { h: 0.6 });
  bullet(s, CXL + 0.24, y + 1.85, COLW - 0.48, '`S` acts as a **static structural prior** guiding graph propagation — decoupled from feature dimensionality', { h: 0.7 });
  tag(s, CXL + 0.24, y + h - 0.55, 'Offline · Static · Interpretable', 'tb');
  box(s, COL2X, y, COLW, h, { fill: C.redBg, accent: true, accentColor: C.red });
  eyebrow(s, 'MODEL-LEVEL · BM3 · FREEDOM', C.red, y + 0.18, COL2X + 0.24, COLW - 0.44);
  body(s, COL2X + 0.24, y + 0.5, COLW - 0.48, 'Raw embeddings projected into CF space and fused **end-to-end**', { size: 12.5, ls: 1.1 });
  bullet(s, COL2X + 0.24, y + 1.0, COLW - 0.48, '**Late fusion (multimodal):** element-wise average `e = (hᵥ + hₜ) / 2`', { dot: C.red, h: 0.55 });
  bullet(s, COL2X + 0.24, y + 1.6, COLW - 0.48, '**Attention gating:** learnable α weights each modality — risks overfitting on sparse data', { dot: C.red, h: 0.55 });
  bullet(s, COL2X + 0.24, y + 2.2, COLW - 0.48, '**img_only / text_only:** single-modality ablation baselines', { dot: C.red, h: 0.5 });
  tag(s, COL2X + 0.24, y + h - 0.55, 'Online · Learnable · End-to-end', 'tr');
})();

// ---- helper for horizontal bar rows (RQ1/RQ2) -------------------------------
function barRows(s, x, y, w, rows, labelW = 1.9, opts = {}) {
  const rh = opts.rh || 0.26, rgap = opts.rgap || 0.11, ggap = opts.ggap || 0.14;
  const trackX = x + labelW, trackW = w - labelW - 0.75;
  let cy = y;
  rows.forEach(r => {
    if (r === null) { cy += ggap; return; }
    const [label, val, frac, color] = r;
    s.addText(label, { x, y: cy - 0.02, w: labelW - 0.05, h: rh + 0.04, fontFace: F.sans, fontSize: 11, color: C.dark, align: 'left', valign: 'middle' });
    s.addShape('roundRect', { x: trackX, y: cy, w: trackW, h: rh, rectRadius: 0.02, fill: { color: C.barTrk }, line: { type: 'none' } });
    s.addShape('roundRect', { x: trackX, y: cy, w: Math.max(0.05, trackW * frac), h: rh, rectRadius: 0.02, fill: { color }, line: { type: 'none' } });
    s.addText(val, { x: trackX + trackW + 0.05, y: cy - 0.02, w: 0.7, h: rh + 0.04, fontFace: F.sans, fontSize: 11, bold: true, color: C.navy, align: 'right', valign: 'middle' });
    cy += rh + rgap;
  });
  return cy;
}

// ---- 14 RQ1 -----------------------------------------------------------------
N.rq1 = "RQ1 – bộ mã hóa hình ảnh: MobileNetV2 thắng trong cấu hình late-fusion tốt nhất của mỗi mô hình (BM3: 0.0186 vs 0.0142) nhờ giữ đặc trưng cục bộ (hoa văn, chất liệu, đường may). CLIP lại thắng ở cấu hình đơn phương thức (img_only) nhờ ngữ nghĩa mức cao. Kết luận: lựa chọn bộ mã hóa phụ thuộc cấu hình, không có bên nào thắng tuyệt đối.";
(function rq1() {
  const s = contentSlide('07 · RQ1 — Visual Encoder', C.blue,
    'MobileNetV2 leads in late-fusion configs;<br>CLIP dominates modal-only — no universal winner', '14 / 20', N.rq1);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'NDCG@10 — Late Fusion configs', C.blue); y += 0.4;
  s.addText([{ text: 'MobileNetV2 ', options: { color: C.dark } }, { text: '■', options: { color: C.blue } }, { text: '   vs CLIP ', options: { color: C.dark } }, { text: '■', options: { color: C.barClipGrey } }],
    { x: CXL, y, w: COLW, h: 0.26, fontFace: F.sans, fontSize: 11 }); y += 0.34;
  barRows(s, CXL, y, COLW, [
    ['BM3 · MBNv2', '0.0186', 0.93, C.blue],
    ['BM3 · CLIP', '0.0142', 0.71, C.barClipGrey], null,
    ['CombiGCN · MBNv2', '0.0175', 0.88, C.blue],
    ['CombiGCN · CLIP', '0.0174', 0.87, C.barClipGrey], null,
    ['FREEDOM · MBNv2', '0.0081', 0.41, C.blue],
    ['FREEDOM · CLIP', '0.0049', 0.25, C.barClipGrey],
  ]);
  // right verdict boxes
  let ry = CONTENT_Y;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.navy });
  s.addText('VERDICT', { x: COL2X + 0.22, y: ry + 0.12, w: COLW - 0.44, h: 0.24, fontFace: F.sans, fontSize: 11, bold: true, color: 'FFFFFF', charSpacing: 1, transparency: 55 });
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, '**MobileNetV2 wins** inside each model’s best (late-fusion) config — local texture beats CLIP’s coarse semantics for styling', { size: 12, color: C.white, ls: 1.15 });
  ry += 1.3;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'But CLIP wins img_only & text_only', C.blue, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'Encoder superiority is **configuration-dependent**, not universal — CLIP’s semantic richness helps when only one modality is active', { size: 12, ls: 1.15 });
  ry += 1.3;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.redBg, accent: true, accentColor: C.red });
  eyebrow(s, 'Why MBNv2 wins late-fusion', C.red, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'MobileNetV2 captures fine-grained local texture (fabric, pattern, cut) that matters for fashion styling, complementing BERT', { size: 12, ls: 1.15 });
})();

// ---- 15 RQ2 & RQ4 -----------------------------------------------------------
N.rq2 = "RQ2 & RQ4: đa phương thức (late fusion) vượt trội đơn phương thức ở cả 3 mô hình; late fusion (trung bình cộng) là chiến lược tốt & ổn định nhất. Attention gating làm giảm mạnh BM3 (−46%) và CombiGCN (−14%) do overfitting trên log thưa 9,455 tương tác. Kết luận RQ4: với dữ liệu thưa, đơn giản là tốt nhất và đa phương thức giúp cold-start.";
(function rq2() {
  const s = contentSlide('08 · RQ2 & RQ4 — Fusion & Cross-Modal Ablation', C.blue,
    'Late fusion beats attention & single-modality —<br>sparse logs benefit from cross-modal integration', '15 / 20', N.rq2);
  let y = CONTENT_Y - 0.05;
  h3(s, CXL, y, COLW, 'NDCG@10 — Fusion type ablation (MBNv2)', C.blue); y += 0.36;
  s.addText([{ text: 'Late ', options: { color: C.dark } }, { text: '■', options: { color: C.blue } }, { text: '   vs Attention ', options: { color: C.dark } }, { text: '■', options: { color: C.red } }],
    { x: CXL, y, w: COLW, h: 0.24, fontFace: F.sans, fontSize: 11 }); y += 0.3;
  y = barRows(s, CXL, y, COLW, [
    ['BM3 · Late', '0.0186', 0.93, C.blue],
    ['BM3 · Attention', '0.0101', 0.505, C.red], null,
    ['CombiGCN · Late', '0.0175', 0.875, C.blue],
    ['CombiGCN · Attention', '0.0151', 0.755, C.red], null,
    ['FREEDOM · Late', '0.0081', 0.405, C.blue],
    ['FREEDOM · Attention', '0.0088', 0.44, C.green],
  ], 1.9, { rh: 0.21, rgap: 0.07, ggap: 0.1 });
  y += 0.1;
  h3(s, CXL, y, COLW, 'Ablation Study (NDCG@10)', C.blue); y += 0.38;
  s.addTable([
    [th('Model (MBNv2)'), th('img only'), th('text only'), th('multimodal'), th('attention')],
    [td('BM3', C.blue, true), td('0.0150'), td('0.0149'), td('0.0186', C.blue, true), td('0.0101')],
    [td('CombiGCN'), td('0.0085'), td('0.0071'), td('0.0175', C.blue, true), td('0.0151')],
    [td('FREEDOM'), td('0.0062'), td('0.0031'), td('0.0081'), td('0.0088', C.blue, true)],
  ], { x: CXL, y, w: COLW, colW: [COLW * 0.3, COLW * 0.16, COLW * 0.16, COLW * 0.2, COLW * 0.18], rowH: 0.28, border: { type: 'none' }, fontFace: F.sans, fontSize: 11, valign: 'middle' });
  // right
  let ry = CONTENT_Y;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.navy });
  s.addText('VERDICT', { x: COL2X + 0.22, y: ry + 0.12, w: COLW - 0.44, h: 0.24, fontFace: F.sans, fontSize: 11, bold: true, color: 'FFFFFF', charSpacing: 1, transparency: 55 });
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, '**Late fusion is best & parameter-free.** Attention gating hurts: BM3 −46% · CombiGCN −14%', { size: 12.5, color: C.white, ls: 1.15 });
  ry += 1.3;
  box(s, COL2X, ry, COLW, 1.5, { fill: C.redBg, accent: true, accentColor: C.red });
  eyebrow(s, 'Why attention fails here', C.red, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'Trainable attention weights overfit 9,455 sparse interactions — only FREEDOM sees a weak +9% gain, likely because its decoupled architecture dampens overfitting', { size: 12, ls: 1.15 });
  ry += 1.65;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'Takeaway (RQ4 Answer)', C.blue, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'On sparse logs, **simplicity wins** — multimodal late fusion (average) consistently outperforms visual-only and text-only variants', { size: 12, ls: 1.15 });
})();

// table cell helpers
function th(t) { return { text: t, options: { bold: true, color: C.navy, fill: { color: C.white }, fontFace: F.sans, fontSize: 11, border: [{ type: 'none' }, { type: 'none' }, { pt: 1.5, color: C.navy }, { type: 'none' }], valign: 'middle' } }; }
function td(t, color = C.dark, bold = false) { return { text: t, options: { color, bold, fontFace: F.sans, fontSize: 11, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: 'E0E6F0' }, { type: 'none' }], valign: 'middle' } }; }

// ---- 16 RQ3 -----------------------------------------------------------------
N.rq3 = "RQ3 – so sánh mô hình: BM3 > CombiGCN > FREEDOM. Tại K=5, BM3 dẫn CombiGCN ~18.4% NDCG; ưu thế BM3 rõ từ K≥5 khi hiệu ứng bootstrap tích lũy. Tại K=1, BM3 và CombiGCN hòa (0.0127). FREEDOM cuối bảng do nhiễu đồ thị kNN tĩnh trên danh mục nhỏ (−53% vs BM3).";
(function rq3() {
  const s = contentSlide('09 · RQ3 — Model Comparison', C.blue,
    'BM3 > CombiGCN > FREEDOM — bootstrap<br>regularization dominates on sparse rental data', '16 / 20', N.rq3);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Best configuration per model', C.blue); y += 0.5;
  s.addTable([
    [th('Model'), th('Config'), th('NDCG@5'), th('NDCG@10')],
    [td('BM3', C.blue, true), tdm('MBNv2 · late'), td('0.0162', C.blue, true), td('0.0186', C.blue, true)],
    [td('CombiGCN'), tdm('MBNv2 · late'), td('0.0137'), td('0.0175')],
    [td('FREEDOM', 'AAAAAA'), tdm('MBNv2 · attention', 'AAAAAA'), td('0.0084', 'AAAAAA'), td('0.0088', 'AAAAAA')],
  ], { x: CXL, y, w: COLW, colW: [COLW * 0.26, COLW * 0.36, COLW * 0.19, COLW * 0.19], rowH: 0.42, border: { type: 'none' }, fontFace: F.sans, fontSize: 12, valign: 'middle' });
  y += 2.1;
  box(s, CXL, y, COLW, 0.85, { fill: C.off, accent: true, accentColor: C.blue });
  body(s, CXL + 0.2, y + 0.14, COLW - 0.4, 'At K = 1: BM3 = CombiGCN tie (0.0127) — BM3 advantage emerges at K ≥ 5 where bootstrap regularization compounds', { size: 12, color: C.muted, ls: 1.1 });
  // right
  let ry = CONTENT_Y;
  box(s, COL2X, ry, COLW, 1.0, { fill: C.navy });
  s.addText('HIERARCHY', { x: COL2X + 0.22, y: ry + 0.12, w: COLW - 0.44, h: 0.24, fontFace: F.sans, fontSize: 11, bold: true, color: 'FFFFFF', charSpacing: 1, transparency: 55 });
  s.addText([
    { text: 'BM3', options: { fontFace: F.serif, fontSize: 16, bold: true, color: C.white } },
    { text: '   ›   ', options: { color: C.white, transparency: 50 } },
    { text: 'CombiGCN', options: { fontFace: F.serif, fontSize: 16, bold: true, color: C.white } },
    { text: '   ›   ', options: { color: C.white, transparency: 50 } },
    { text: 'FREEDOM', options: { fontFace: F.serif, fontSize: 16, bold: true, color: C.white } },
  ], { x: COL2X + 0.22, y: ry + 0.42, w: COLW - 0.44, h: 0.5, valign: 'middle' });
  ry += 1.15;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.off, accent: true, accentColor: C.blue });
  eyebrow(s, 'BM3 leads K ≥ 5', C.blue, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'Bootstrap contrastive acts as implicit regularizer — BM3’s self-supervised alignment prevents rank degradation at larger K', { size: 12, ls: 1.15 });
  ry += 1.3;
  box(s, COL2X, ry, COLW, 1.15, { fill: C.redBg, accent: true, accentColor: C.red });
  eyebrow(s, 'FREEDOM −53% vs BM3', C.red, ry + 0.1, COL2X + 0.22, COLW - 0.44);
  body(s, COL2X + 0.22, ry + 0.4, COLW - 0.44, 'kNN graph noise on a small 2,194-item catalog propagates incorrect semantic similarity — the frozen graph is a liability at this scale', { size: 12, ls: 1.15 });
})();
function tdm(t, color = C.green) { return { text: t, options: { color, fontFace: F.mono, fontSize: 11, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: 'E0E6F0' }, { type: 'none' }], valign: 'middle' } }; }

// ---- 17 TRAINING DYNAMICS ---------------------------------------------------
N.train = "Động lực huấn luyện: CombiGCN hội tụ nhanh nhất (đỉnh epoch 280) nhưng loss giảm −70% sau đỉnh → nguy cơ overfit cao nếu không early stop. BM3 chậm hơn ~2.5× (đỉnh 720) nhưng ổn định, loss chỉ giảm −21%. FREEDOM đỉnh muộn 960, gần như phẳng. Khuyến nghị: CombiGCN khi ngân sách hẹp (early stop); BM3 khi ưu tiên chất lượng ranking.";
(function train() {
  const s = contentSlide('10 · Training Dynamics & Overfitting', C.blue,
    'BM3’s bootstrap loss prevents overfitting;<br>CombiGCN peaks early then degrades −70%', '17 / 20', N.train);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Peak validation epoch (best config)', C.blue); y += 0.45;
  const rows = [
    ['CombiGCN', '@ epoch 280', 'tb', C.off, C.blue, 'Peaks early, then loss falls **−70%** while test quality drops. ~2.5× faster than BM3 → useful if budget is tight (with early stopping).'],
    ['BM3', '@ epoch 720', 'tr', C.redBg, C.red, 'Slow but robust — loss falls only **−21%** after peak. Bootstrap contrastive acts as a strong implicit regularizer.'],
    ['FREEDOM', '@ epoch 960', 'tg', C.greenBg, C.green, 'Late & flat — loss nearly stationary after peak. Frozen kNN prevents destabilization but also limits adaptation.'],
  ];
  const rh = 1.05;
  rows.forEach(r => {
    box(s, CXL, y, COLW, rh, { fill: r[3], accent: true, accentColor: r[4] });
    h3(s, CXL + 0.22, y + 0.14, COLW - 2, r[0], C.navy, 15);
    tag(s, CXL + COLW - 1.7, y + 0.14, r[1], r[2]);
    body(s, CXL + 0.22, y + 0.52, COLW - 0.44, r[5], { size: 11.5, ls: 1.1 });
    y += rh + 0.1;
  });
  // right
  let ry = CONTENT_Y;
  h3(s, COL2X, ry, COLW, 'Convergence Summary', C.blue); ry += 0.45;
  s.addTable([
    [th('Model'), th('Peak epoch'), th('Loss drop'), th('Verdict')],
    [td('CombiGCN'), td('280'), td('−70%', C.blue, true), td('Overfit risk', 'AAAAAA')],
    [td('BM3', C.blue, true), td('720', C.blue, true), td('−21%'), td('Robust', C.blue, true)],
    [td('FREEDOM'), td('960'), td('~0%'), td('Flat')],
  ], { x: COL2X, y: ry, w: COLW, colW: [COLW * 0.3, COLW * 0.24, COLW * 0.22, COLW * 0.24], rowH: 0.4, border: { type: 'none' }, fontFace: F.sans, fontSize: 12, valign: 'middle' });
  ry += 2.05;
  box(s, COL2X, ry, COLW, 1.25, { fill: C.navy });
  s.addText('PRACTICAL GUIDANCE', { x: COL2X + 0.22, y: ry + 0.14, w: COLW - 0.44, h: 0.24, fontFace: F.sans, fontSize: 11, bold: true, color: 'FFFFFF', charSpacing: 1, transparency: 55 });
  body(s, COL2X + 0.22, ry + 0.44, COLW - 0.44, 'Use **CombiGCN** when training budget is tight (with early stopping). Use **BM3** when ranking quality matters most — its regularization pays off at K ≥ 5.', { size: 12, color: C.white, ls: 1.15 });
})();

// ---- 18 CONCLUSION ----------------------------------------------------------
N.concl = "4 kết luận từ 24 cấu hình: (1) Đa phương thức (late fusion) luôn cải thiện so với đơn phương thức. (2) Lựa chọn MobileNetV2 vs CLIP phụ thuộc cách hợp nhất; MBNv2 tốt hơn cho late fusion nhờ giữ đặc trưng cục bộ. (3) Hợp nhất đơn giản không tham số (late) hiệu quả hơn attention học được trên dữ liệu thưa. (4) BM3 là kiến trúc tối ưu nhất cho gợi ý thời trang thưa nhờ bootstrap tự giám sát.";
(function conclusion() {
  const s = newSlide(true, { notes: N.concl });
  eyebrow(s, '11 · Conclusion & Contributions', C.muted);
  title(s, 'Four reproducible findings on multimodal GNN<br>for sparse fashion recommendation', { dark: true, h: 1.0 });
  const cards = [
    ['01', C.blue, 'Multimodal late fusion helps', 'Within every evaluated architecture, fusing visual + textual beats single-modality variants'],
    ['02', C.red, 'Encoder choice is conditional', 'MobileNetV2 leads in late-fusion; CLIP wins visual-only — no universal ranking across all configs'],
    ['03', C.greenLt, 'Simpler fusion is stronger', 'Parameter-free late fusion is robust; trainable attention overfits the 9,455-interaction sparse log'],
    ['04', 'F0C040', 'Architecture × depth matters', 'BM3 best for K ≥ 5; CombiGCN matches at K = 1; FREEDOM requires larger catalogs than VCR provides'],
  ];
  const y0 = 2.75, gw = (CW - 0.3) / 2, gh = 1.75, gg = 0.3;
  cards.forEach((c, i) => {
    const x = CXL + (i % 2) * (gw + gg);
    const yy = y0 + Math.floor(i / 2) * (gh + 0.25);
    s.addShape('roundRect', { x, y: yy, w: gw, h: gh, rectRadius: 0.05, fill: { color: 'FFFFFF', transparency: 94 }, line: { type: 'none' } });
    s.addShape('rect', { x, y: yy, w: gw, h: 0.045, fill: { color: c[1] }, line: { type: 'none' } });
    s.addText(c[0], { x: x + 0.28, y: yy + 0.16, w: 1, h: 0.4, fontFace: F.serif, fontSize: 18, bold: true, color: c[1], valign: 'top' });
    s.addText(c[2], { x: x + 0.28, y: yy + 0.62, w: gw - 0.5, h: 0.4, fontFace: F.sans, fontSize: 15, bold: true, color: C.white, valign: 'top' });
    s.addText(runs(c[3], { fontFace: F.sans, fontSize: 12, color: 'FFFFFF' }), { x: x + 0.28, y: yy + 1.02, w: gw - 0.5, h: 0.65, valign: 'top', lineSpacingMultiple: 1.15, transparency: 30 });
  });
  footer(s, null, '18 / 20', true);
})();

// ---- 19 LIMITATIONS ---------------------------------------------------------
N.limit = "4 hạn chế: (1) kết quả single-run, chưa kiểm định ý nghĩa thống kê đa seed; (2) độ thưa lớn khiến chỉ số tuyệt đối thấp (HR@10 ~7-8%), giá trị chủ yếu ở so sánh tương đối; (3) chưa benchmark baseline thuần (LightGCN-only, popularity), d=512 cố định; (4) đặc trưng tĩnh, chưa phản ánh xu hướng thời trang theo thời gian. Hướng tương lai: đa seed, thêm baseline, dữ liệu lớn hơn, đặc trưng theo thời gian.";
(function limitations() {
  const s = contentSlide('12 · Limitations & Future Work', C.red,
    'Single-run estimates on near-floor metrics —<br>findings are directional, not definitive', '19 / 20', N.limit);
  let y = CONTENT_Y;
  h3(s, CXL, y, COLW, 'Current Limitations', C.navy); y += 0.44;
  const lims = [
    '**Single-run estimates** — no multiple seeds or significance tests; narrow margins (BM3 vs CombiGCN) are indicative trends',
    '**Near-floor absolute metrics** — extreme sparsity (3.81 test items/user) keeps HR@10 ~0.07; focus is relative comparison',
    '**No standalone baselines** — LightGCN-only and popularity baselines not benchmarked; d = 512 fixed without ablation',
    '**Static offline features** — pre-extracted embeddings ignore temporal trends in fashion',
  ];
  lims.forEach(t => { bullet(s, CXL, y, COLW, t, { dot: C.red, h: 0.72 }); y += 0.76; });
  let ry = CONTENT_Y;
  h3(s, COL2X, ry, COLW, 'Future Work', C.navy); ry += 0.44;
  const fut = [
    ['F1', 'Multi-seed evaluation + significance testing to confirm BM3 vs CombiGCN margin'],
    ['F2', 'Benchmark standalone LightGCN baseline; ablate embedding dimension d'],
    ['F3', 'Cross-dataset validation — test on larger fashion catalog to verify FREEDOM’s kNN hypothesis'],
    ['F4', 'Temporal-aware feature extraction and seasonal trend modeling'],
  ];
  fut.forEach(([n, t]) => {
    stepNum(s, COL2X, ry, n, C.green);
    body(s, COL2X + 0.5, ry - 0.02, COLW - 0.5, t, { size: 12.5, ls: 1.1 });
    ry += 0.78;
  });
})();

// ---- 20 THANK YOU -----------------------------------------------------------
N.thanks = "Em xin chân thành cảm ơn quý thầy cô trong Hội đồng và Tiến sĩ Trần Trung Tín. Nghiên cứu chứng minh: kết hợp đặc trưng đa phương thức qua mạng đồ thị tự giám sát BM3 với bộ mã hóa MobileNetV2 là giải pháp tối ưu cho gợi ý thời trang trên dữ liệu thuê quần áo thưa VCR. Em xin lắng nghe câu hỏi từ quý thầy cô. Em xin cảm ơn.";
(function thanks() {
  const s = newSlide(true, { notes: N.thanks });
  s.addShape('roundRect', { x: 6.35, y: 1.9, w: 0.31, h: 0.03, rectRadius: 0.015, fill: { color: C.red }, line: { type: 'none' } });
  s.addShape('roundRect', { x: 6.71, y: 1.9, w: 0.1, h: 0.03, rectRadius: 0.015, fill: { color: C.blue }, line: { type: 'none' } });
  s.addText('Thank You', { x: 0, y: 2.2, w: 13.333, h: 1.1, fontFace: F.serif, fontSize: 40, bold: true, color: C.white, align: 'center' });
  s.addText('Questions & Discussion', { x: 0, y: 3.35, w: 13.333, h: 0.5, fontFace: F.sans, fontSize: 18, color: C.muted, align: 'center' });
  const info = [['Presented by', 'Hoang Dinh Quy Vu · 252805008'], ['Advised by', 'Dr. Tran Trung Tin'], ['Institution', 'Ton Duc Thang University']];
  const tw = 3.6, tot = tw * 3, x0 = (13.333 - tot) / 2;
  info.forEach((it, i) => {
    const x = x0 + i * tw;
    s.addText(it[0], { x, y: 4.5, w: tw, h: 0.3, fontFace: F.sans, fontSize: 11, color: C.muted, align: 'center' });
    s.addText(it[1], { x, y: 4.8, w: tw, h: 0.35, fontFace: F.serif, fontSize: 13, bold: true, color: C.white, align: 'center' });
  });
  const kws = ['BM3', 'CombiGCN', 'FREEDOM', 'CLIP', 'MobileNetV2', 'BERT'];
  let totw = 0; const wds = kws.map(k => { const w = 0.24 + k.length * 0.085; totw += w + 0.12; return w; });
  let cx = (13.333 - totw) / 2;
  kws.forEach((k, i) => {
    s.addShape('roundRect', { x: cx, y: 5.6, w: wds[i], h: 0.34, rectRadius: 0.03, fill: { color: '17264A' }, line: { type: 'none' } });
    s.addText(k, { x: cx, y: 5.6, w: wds[i], h: 0.34, fontFace: F.mono, fontSize: 11, color: C.greenLt, align: 'center', valign: 'middle' });
    cx += wds[i] + 0.12;
  });
})();

// ---- 21-23 APPENDIX FORMULA SLIDES -----------------------------------------
// formula manifest: key -> latex  (rendered to formulas/<key>.png)
const FORMULAS = {
  c1: '\\mathbf{S} = \\mathbf{D}_s^{-1/2} \\mathbf{W} \\mathbf{D}_s^{-1/2}',
  c2: '\\mathbf{e}_u^{(k+1)} = \\sum_{i \\in \\mathcal{N}_u} \\frac{1}{\\sqrt{|\\mathcal{N}_u| |\\mathcal{N}_i|}} \\mathbf{e}_i^{(k)}',
  c3: '\\mathbf{e}_i^{(k+1)} = \\mathbf{e}_{i,\\text{CF}}^{(k+1)} + \\mathbf{e}_{i,\\text{Sim}}^{(k+1)}',
  c3b: '\\mathbf{e}_{i,\\text{CF}}^{(k+1)} = \\sum_{u \\in \\mathcal{N}_i} \\frac{1}{\\sqrt{|\\mathcal{N}_i| |\\mathcal{N}_u|}} \\mathbf{e}_u^{(k)}',
  c3c: '\\mathbf{e}_{i,\\text{Sim}}^{(k+1)} = \\sum_{j \\in \\mathcal{S}_i} S_{ij} \\mathbf{e}_j^{(k)}',
  c4: '\\mathbf{e}_u = \\frac{1}{N+1}\\sum_{k=0}^{N} \\mathbf{e}_u^{(k)}, \\quad \\mathbf{e}_i = \\frac{1}{N+1}\\sum_{k=0}^{N} \\mathbf{e}_i^{(k)}',
  b1a: '\\mathbf{h}_{v,i} = \\mathbf{W}_v \\mathbf{x}_{vis,i} + \\mathbf{b}_v, \\quad \\mathbf{h}_{t,i} = \\mathbf{W}_t \\mathbf{x}_{txt,i} + \\mathbf{b}_t',
  b1b: '\\mathbf{e}_{i,\\text{modal}} = \\frac{\\mathbf{h}_{v,i} + \\mathbf{h}_{t,i}}{2}',
  b2: '\\mathbf{\\Theta}_{target} \\leftarrow m\\, \\mathbf{\\Theta}_{target} + (1 - m)\\, \\mathbf{\\Theta}_{online}',
  b3a: '\\mathcal{L}_{boot}(\\mathbf{p}, \\mathbf{z}) = 2 - 2\\, \\frac{\\mathbf{p}^{\\top} \\mathbf{z}}{\\|\\mathbf{p}\\| \\|\\mathbf{z}\\|}',
  b3b: '\\mathcal{L}_{CL} = \\tfrac{1}{2}\\left[ \\mathcal{L}_{boot}(q(\\mathbf{e}_{i,\\text{CF}}), sg(\\mathbf{e}_{i,\\text{modal}})) + \\mathcal{L}_{boot}(q(\\mathbf{e}_{i,\\text{modal}}), sg(\\mathbf{e}_{i,\\text{target}})) \\right]',
  b4: '\\mathbf{h}_i = \\mathbf{e}_{i,\\text{CF}} + \\mathbf{e}_{i,\\text{modal}} \\qquad \\mathcal{L}_{total} = \\mathcal{L}_{BPR} + \\lambda_1 \\mathcal{L}_{reg} + \\lambda_2 \\mathcal{L}_{CL}',
  r1: '\\mathbf{A}^{knn} = \\mathbf{D}_{knn}^{-1/2} \\mathbf{W}^{knn} \\mathbf{D}_{knn}^{-1/2}',
  r2: '\\mathbf{e}_{i,\\text{content}}^{(k+1)} = \\sum_{j \\in \\mathcal{N}_k(i)} A^{knn}_{ij} \\mathbf{e}_{j,\\text{content}}^{(k)}',
  r3: '\\mathcal{L}_{CL} = -\\sum_{i \\in \\mathcal{B}} \\ln \\frac{\\exp(s(\\mathbf{e}_{i,\\text{CF}}, \\mathbf{e}_{i,\\text{content}}) / \\tau)}{\\sum_{j \\in \\mathcal{B}} \\exp(s(\\mathbf{e}_{i,\\text{CF}}, \\mathbf{e}_{j,\\text{content}}) / \\tau)}',
  r4: '\\mathbf{e}_i = \\mathbf{e}_{i,\\text{CF}} + \\mathbf{e}_{i,\\text{content}} \\qquad \\mathcal{L}_{total} = \\mathcal{L}_{BPR} + \\lambda_1 \\mathcal{L}_{reg} + \\lambda_2 \\mathcal{L}_{CL}',
};

// place a formula PNG centered in a given width, at a target height
function formula(s, key, x, y, maxW, hIn) {
  const p = path.join(FDIR, key + '.png');
  const { w, h } = pngSize(p);
  let dh = hIn, dw = dh * (w / h);
  if (dw > maxW) { dw = maxW; dh = dw * (h / w); }
  s.addImage({ path: p, x: x + (maxW - dw) / 2, y, w: dw, h: dh });
  return dh;
}

function fBox(s, x, y, w, h, accent, fill = C.off) { box(s, x, y, w, h, { fill, accent: true, accentColor: accent }); }

function appendixCombi() {
  const s = contentSlide('Appendix · Mathematical Formulations', C.blue,
    'CombiGCN — Dual-Graph Propagation Equations', 'A1 / A3', N.aCombi);
  const y = CONTENT_Y, h = IN(620), bh1 = 1.55, bh2 = 1.45;
  // left
  fBox(s, CXL, y, COLW, bh1, C.blue);
  h3(s, CXL + 0.2, y + 0.12, COLW - 0.4, '1. Symmetric Graph Normalization', C.navy, 14);
  formula(s, 'c1', CXL + 0.2, y + 0.55, COLW - 0.4, 0.4);
  body(s, CXL + 0.2, y + 1.02, COLW - 0.4, '`W`: cosine similarity thresholded at 0.5 · `D_s`: degree matrix · `S`: normalised item adjacency', { size: 10.5, color: C.muted, ls: 1.05 });
  fBox(s, CXL, y + bh1 + 0.12, COLW, bh2, C.blue);
  h3(s, CXL + 0.2, y + bh1 + 0.24, COLW - 0.4, '2. User Representation Update', C.navy, 14);
  formula(s, 'c2', CXL + 0.2, y + bh1 + 0.66, COLW - 0.4, 0.5);
  body(s, CXL + 0.2, y + bh1 + 1.22, COLW - 0.4, 'User updates are driven **solely** by the user–item interaction graph', { size: 10.5, color: C.muted });
  // right
  fBox(s, COL2X, y, COLW, bh1 + 0.35, C.blue);
  h3(s, COL2X + 0.2, y + 0.12, COLW - 0.4, '3. Item Dual-Graph Fusion', C.navy, 14);
  formula(s, 'c3', COL2X + 0.2, y + 0.52, COLW - 0.4, 0.35);
  s.addText('CF branch', { x: COL2X + 0.2, y: y + 0.95, w: 2, h: 0.24, fontFace: F.sans, fontSize: 10, bold: true, color: C.navy });
  formula(s, 'c3b', COL2X + 0.2, y + 1.18, COLW - 0.4, 0.42);
  fBox(s, COL2X, y + bh1 + 0.47, COLW, bh2 - 0.35, C.blue);
  h3(s, COL2X + 0.2, y + bh1 + 0.57, COLW - 0.4, '4. Layer-wise Mean Pooling', C.navy, 14);
  formula(s, 'c4', COL2X + 0.2, y + bh1 + 0.95, COLW - 0.4, 0.42);
}
N.aCombi = "Phụ lục 1 — công thức CombiGCN: chuẩn hóa đối xứng ma trận tương đồng S (giữ cosine>0.5); cập nhật user chỉ trên đồ thị tương tác; item cộng trực tiếp nhánh CF và nhánh Sim; tổng hợp bằng trung bình cộng các lớp.";

function appendixBM3() {
  const s = contentSlide('Appendix · Mathematical Formulations', C.red,
    'BM3 — Self-Supervised Bootstrap Equations', 'A2 / A3', N.aBM3);
  const y = CONTENT_Y, bh = 1.55;
  fBox(s, CXL, y, COLW, bh + 0.2, C.red, C.redBg);
  h3(s, CXL + 0.2, y + 0.12, COLW - 0.4, '1. Modal Projection & Fusion', C.navy, 14);
  formula(s, 'b1a', CXL + 0.2, y + 0.52, COLW - 0.4, 0.34);
  formula(s, 'b1b', CXL + 0.2, y + 0.95, COLW - 0.4, 0.4);
  fBox(s, CXL, y + bh + 0.32, COLW, bh - 0.1, C.red, C.redBg);
  h3(s, CXL + 0.2, y + bh + 0.44, COLW - 0.4, '2. EMA Target Encoder Update', C.navy, 14);
  formula(s, 'b2', CXL + 0.2, y + bh + 0.86, COLW - 0.4, 0.34);
  body(s, CXL + 0.2, y + bh + 1.28, COLW - 0.4, 'm = 0.995 momentum · no gradient flows through target encoder', { size: 10.5, color: C.muted });
  fBox(s, COL2X, y, COLW, bh + 0.2, C.red, C.redBg);
  h3(s, COL2X + 0.2, y + 0.12, COLW - 0.4, '3. Asymmetric Bootstrap Loss', C.navy, 14);
  formula(s, 'b3a', COL2X + 0.2, y + 0.5, COLW - 0.4, 0.36);
  formula(s, 'b3b', COL2X + 0.2, y + 0.95, COLW - 0.4, 0.5);
  fBox(s, COL2X, y + bh + 0.32, COLW, bh - 0.1, C.red, C.redBg);
  h3(s, COL2X + 0.2, y + bh + 0.44, COLW - 0.4, '4. Joint Optimization Objective', C.navy, 14);
  formula(s, 'b4', COL2X + 0.2, y + bh + 0.86, COLW - 0.4, 0.34);
  body(s, COL2X + 0.2, y + bh + 1.28, COLW - 0.4, 'BPR loss + contrastive term (λ₂ = 0.2)', { size: 10.5, color: C.muted });
}
N.aBM3 = "Phụ lục 2 — công thức BM3: chiếu đặc trưng ảnh/văn bản về d=512 và hợp nhất trung bình; cập nhật target bằng EMA (m=0.995); bootstrap loss bất đối xứng; mục tiêu tổng = BPR + λ1·reg + λ2·CL.";

function appendixFreedom() {
  const s = contentSlide('Appendix · Mathematical Formulations', C.green,
    'FREEDOM — Decoupled Graph & InfoNCE Equations', 'A3 / A3', N.aFree);
  const y = CONTENT_Y, bh = 1.55;
  fBox(s, CXL, y, COLW, bh, C.green, C.greenBg);
  h3(s, CXL + 0.2, y + 0.12, COLW - 0.4, '1. Frozen kNN Graph Construction', C.green, 14);
  formula(s, 'r1', CXL + 0.2, y + 0.55, COLW - 0.4, 0.38);
  body(s, CXL + 0.2, y + 1.05, COLW - 0.4, 'Top-k = 10 neighbours by modal cosine similarity · frozen during training', { size: 10.5, color: C.muted });
  fBox(s, CXL, y + bh + 0.12, COLW, bh, C.green, C.greenBg);
  h3(s, CXL + 0.2, y + bh + 0.24, COLW - 0.4, '2. Decoupled Content Propagation', C.green, 14);
  formula(s, 'r2', CXL + 0.2, y + bh + 0.66, COLW - 0.4, 0.42);
  body(s, CXL + 0.2, y + bh + 1.2, COLW - 0.4, 'Initialised with modal embeddings; learns pure semantic structure', { size: 10.5, color: C.muted });
  fBox(s, COL2X, y, COLW, bh, C.green, C.greenBg);
  h3(s, COL2X + 0.2, y + 0.12, COLW - 0.4, '3. InfoNCE Contrastive Alignment', C.green, 14);
  formula(s, 'r3', COL2X + 0.2, y + 0.6, COLW - 0.4, 0.6);
  body(s, COL2X + 0.2, y + 1.25, COLW - 0.4, 'B: mini-batch · s(·): cosine similarity · τ = 0.2 temperature', { size: 10.5, color: C.muted });
  fBox(s, COL2X, y + bh + 0.12, COLW, bh, C.green, C.greenBg);
  h3(s, COL2X + 0.2, y + bh + 0.24, COLW - 0.4, '4. Final Fused Joint Loss', C.green, 14);
  formula(s, 'r4', COL2X + 0.2, y + bh + 0.7, COLW - 0.4, 0.34);
  body(s, COL2X + 0.2, y + bh + 1.2, COLW - 0.4, 'Contrastive alignment weight λ₂ = 0.1', { size: 10.5, color: C.muted });
}
N.aFree = "Phụ lục 3 — công thức FREEDOM: đồ thị kNN đóng băng (top-k=10); lan truyền nội dung độc lập; InfoNCE căn chỉnh CF và content (τ=0.2); mục tiêu tổng = BPR + λ1·reg + λ2·CL (λ2=0.1).";

// ---- 24 (NEW) TABLE 4.2 -----------------------------------------------------
N.table42 = "Bảng 4.2 — Tác động của bộ mã hóa hình ảnh lên NDCG@10 trên tất cả cấu hình mô hình–hợp nhất (CLIP vs MobileNetV2). Cột cuối là thay đổi tương đối khi chuyển CLIP → MobileNetV2. In đậm = giá trị tốt hơn trong mỗi cặp.";
function tableFourTwo() {
  const s = contentSlide('Appendix · RQ1 Detail · Table 4.2', C.blue,
    'Visual encoder impact on NDCG@10 —<br>CLIP vs MobileNetV2 across all configs', 'A4 / A4', N.table42);
  // caption line
  s.addText('Bold marks the better encoder in each row · final column = relative change CLIP → MobileNetV2', {
    x: CXL, y: CONTENT_Y - 0.05, w: CW, h: 0.3, fontFace: F.sans, fontSize: 12, italic: true, color: C.muted,
  });
  const rows = [
    // [model, sim, clip, mbn, delta, clipBest, mbnBest]
    ['BM3', 'img_only', '0.0129', '0.0150', '+16.3', false, true],
    ['BM3', 'text_only', '0.0158', '0.0149', '−6.1', true, false],
    ['BM3', 'multimodal', '0.0142', '0.0186', '+30.8', false, true],
    ['BM3', 'mm_attention', '0.0059', '0.0101', '+72.2', false, true],
    ['CombiGCN', 'img_only', '0.0155', '0.0085', '−45.2', true, false],
    ['CombiGCN', 'text_only', '0.0077', '0.0071', '−7.5', true, false],
    ['CombiGCN', 'multimodal', '0.0174', '0.0175', '+0.7', false, true],
    ['CombiGCN', 'mm_attention', '0.0153', '0.0151', '−1.6', true, false],
    ['FREEDOM', 'img_only', '0.0060', '0.0062', '+3.7', false, true],
    ['FREEDOM', 'text_only', '0.0049', '0.0031', '−36.1', true, false],
    ['FREEDOM', 'multimodal', '0.0049', '0.0081', '+63.7', false, true],
    ['FREEDOM', 'mm_attention', '0.0033', '0.0088', '+165.3', false, true],
  ];
  const header = [
    th2('Model'), th2('Sim Type'), th2('NDCG@10 (CLIP)', 'right'), th2('NDCG@10 (MBNv2)', 'right'), th2('MBNv2 Δ (%)', 'right'),
  ];
  const tblRows = [header];
  let prevModel = null;
  rows.forEach(r => {
    const groupTop = r[0] !== prevModel; prevModel = r[0];
    const topB = groupTop ? { pt: 1.5, color: C.navy } : { pt: 0.5, color: 'E8ECF4' };
    const deltaColor = r[4].startsWith('−') ? C.red : C.green;
    tblRows.push([
      cell42(r[0], { color: C.navy, bold: true, topB }),
      cell42(r[1], { color: C.dark, mono: true, topB }),
      cell42(r[2], { color: r[5] ? C.blue : C.dark, bold: r[5], align: 'right', topB }),
      cell42(r[3], { color: r[6] ? C.blue : C.dark, bold: r[6], align: 'right', topB }),
      cell42(r[4], { color: deltaColor, bold: true, align: 'right', topB }),
    ]);
  });
  s.addTable(tblRows, {
    x: CXL, y: CONTENT_Y + 0.35, w: CW,
    colW: [CW * 0.2, CW * 0.24, CW * 0.2, CW * 0.2, CW * 0.16],
    rowH: 0.3, valign: 'middle', fontFace: F.sans, fontSize: 12, border: { type: 'none' },
  });
}
function th2(t, align = 'left') { return { text: t, options: { bold: true, color: C.navy, fontFace: F.sans, fontSize: 12, align, valign: 'middle', border: [{ type: 'none' }, { type: 'none' }, { pt: 1.5, color: C.navy }, { type: 'none' }] } }; }
function cell42(t, { color, bold = false, align = 'left', mono = false, topB }) {
  return { text: t, options: { color, bold, align, valign: 'middle', fontFace: mono ? F.mono : F.sans, fontSize: 12, border: [topB, { type: 'none' }, { type: 'none' }, { type: 'none' }] } };
}

// =============================================================================
// formula rendering + write
// =============================================================================
function fetchPng(latex, dest) {
  return new Promise((resolve, reject) => {
    const url = 'https://latex.codecogs.com/png.image?' + encodeURIComponent('\\dpi{300}\\bg{white} ' + latex);
    https.get(url, r => {
      if (r.statusCode !== 200) { reject(new Error('HTTP ' + r.statusCode)); return; }
      const c = []; r.on('data', d => c.push(d));
      r.on('end', () => { const b = Buffer.concat(c); if (b.length < 200 || b.slice(1, 4).toString() !== 'PNG') { reject(new Error('bad png')); return; } fs.writeFileSync(dest, b); resolve(); });
    }).on('error', reject);
  });
}

async function ensureFormulas() {
  if (!fs.existsSync(FDIR)) fs.mkdirSync(FDIR);
  const keys = Object.keys(FORMULAS);
  for (const k of keys) {
    const dest = path.join(FDIR, k + '.png');
    if (fs.existsSync(dest) && fs.statSync(dest).size > 200) continue;
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try { await fetchPng(FORMULAS[k], dest); ok = true; process.stdout.write(`  ✓ ${k}\n`); }
      catch (e) { await new Promise(r => setTimeout(r, 600)); }
    }
    if (!ok) throw new Error('failed to render formula ' + k);
  }
}

(async function main() {
  console.log('Rendering LaTeX formulas via CodeCogs …');
  await ensureFormulas();
  console.log('Building appendix + table slides …');
  appendixCombi();
  appendixBM3();
  appendixFreedom();
  tableFourTwo();
  await pptx.writeFile({ fileName: OUT });
  console.log('\n✅ Wrote ' + OUT);
})().catch(e => { console.error('\n❌ ' + e.stack); process.exit(1); });
