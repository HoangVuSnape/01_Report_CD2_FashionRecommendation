const pptxgen = require("pptxgenjs");
const fs = require("fs");
const p = new pptxgen();

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a valid PNG file: ' + filePath);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}
p.layout = "LAYOUT_16x9"; // 10 x 5.625 in
p.author = "Hoang Dinh Quy Vu";
p.title = "Multimodal Graph-based Fashion Recommendation";

// ── Palette ──
const NAVY = "1E2A52", INK = "1F2A44", TEAL = "2E7D8F", MUT = "6B7280",
      LINEC = "E2E6EE", RED = "C0392B", GREEN = "2E8B57", BLUE = "2E6FB0",
      GOLD = "B07A12", PURP = "6B4FB0", CARD = "F8FAFC", ORG = "F4E8D6";
const HEAD = "Georgia", BODY = "Calibri";
const LOGO = "E:/DoCode/CD2/01_Report_CD2_FashionRecommendation/logo.jpg";
const FIG = "E:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs";
const FORMULA_DIR = "E:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/formulas";
const TOTAL = 19;

// ── Base chrome ──
function base(slide, title, idx) {
  slide.background = { color: "FFFFFF" };
  slide.addShape(p.shapes.RECTANGLE, { x: 0.5, y: 0.42, w: 0.13, h: 0.34, fill: { color: TEAL } });
  slide.addText(title, { x: 0.74, y: 0.36, w: 7.9, h: 0.5, fontSize: 22, bold: true, color: NAVY, fontFace: HEAD, margin: 0, valign: "middle" });
  slide.addImage({ path: LOGO, x: 9.02, y: 0.3, w: 0.78, h: 0.55, sizing: { type: "contain", w: 0.78, h: 0.55 } });
  slide.addShape(p.shapes.LINE, { x: 0.5, y: 0.98, w: 9.3, h: 0, line: { color: LINEC, width: 1 } });
  slide.addText("Hoang Dinh Quy Vu  ·  Capstone Project 3", { x: 0.5, y: 5.3, w: 6, h: 0.22, fontSize: 8, color: MUT, fontFace: BODY, margin: 0, valign: "middle" });
  slide.addText(String(idx).padStart(2, "0") + " / " + TOTAL, { x: 8.9, y: 5.3, w: 0.9, h: 0.22, fontSize: 8, color: MUT, fontFace: BODY, align: "right", margin: 0, valign: "middle" });
}
function card(slide, x, y, w, h, fill) {
  slide.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.07, fill: { color: fill || CARD }, line: { color: LINEC, width: 1 } });
}
function node(slide, x, y, w, h, title, sub, opt) {
  opt = opt || {};
  const fill = opt.fill || CARD, ln = opt.line || LINEC, tc = opt.color || NAVY;
  slide.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: fill }, line: { color: ln, width: opt.lw || 1 } });
  if (sub) {
    slide.addText(title, { x, y: y + 0.13, w, h: 0.34, fontSize: opt.ts || 11.5, bold: true, color: tc, fontFace: BODY, align: "center", margin: 0 });
    slide.addText(sub, { x: x + 0.06, y: y + h - 0.42, w: w - 0.12, h: 0.34, fontSize: opt.ss || 9, color: MUT, fontFace: BODY, align: "center", margin: 0 });
  } else {
    slide.addText(title, { x, y, w, h, fontSize: opt.ts || 11.5, bold: true, color: tc, fontFace: BODY, align: "center", valign: "middle", margin: 0 });
  }
}
function aRight(slide, x, y, len) { slide.addShape(p.shapes.LINE, { x, y, w: len, h: 0, line: { color: MUT, width: 1.5, endArrowType: "triangle" } }); }
function aDown(slide, x, y, len) { slide.addShape(p.shapes.LINE, { x, y, w: 0, h: len, line: { color: MUT, width: 1.5, endArrowType: "triangle" } }); }
function formulaRow(slide, y, title, sub, eqImg, desc, bg) {
  const hBox = 1.1;
  card(slide, 0.5, y, 9.0, hBox, bg || CARD);
  slide.addText(title, { x: 0.7, y: y + 0.18, w: 2.3, h: 0.3, fontSize: 11.5, bold: true, color: NAVY, fontFace: HEAD, margin: 0 });
  slide.addText(sub, { x: 0.7, y: y + 0.52, w: 2.3, h: 0.4, fontSize: 8.5, color: MUT, fontFace: BODY, valign: "top", margin: 0 });
  
  // Outer equation box (width 4.4, height 0.86, from X=3.1, Y=y+0.12)
  slide.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 3.1, y: y + 0.12, w: 4.4, h: 0.86, rectRadius: 0.05, fill: { color: "FFFFFF" }, line: { color: LINEC, width: 0.75 } });
  
  // Calculate dynamic dimensions of the PNG formula to prevent stretching
  const dim = getPngDimensions(eqImg);
  const r = dim.width / dim.height;
  
  const W_max = 4.2;
  const H_max = 0.74;
  
  let w_img, h_img;
  if (r > W_max / H_max) {
    w_img = W_max;
    h_img = W_max / r;
  } else {
    h_img = H_max;
    w_img = H_max * r;
  }
  
  // Center the image inside the bounding box (box center is X=5.3, Y=y+0.55)
  const x_img = 5.3 - w_img / 2;
  const y_img = (y + 0.55) - h_img / 2;
  
  // LaTeX Equation Image
  slide.addImage({
    path: eqImg,
    x: x_img,
    y: y_img,
    w: w_img,
    h: h_img
  });
  
  slide.addText(desc, { x: 7.65, y: y + 0.12, w: 1.7, h: 0.86, fontSize: 8.5, color: INK, fontFace: BODY, valign: "middle", margin: 0 });
}

// ════════ 1 — Title ════════
{
  const s = p.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.18, fill: { color: NAVY } });
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 5.445, w: 10, h: 0.18, fill: { color: TEAL } });
  s.addImage({ path: LOGO, x: 0.5, y: 0.42, w: 0.82, h: 0.6, sizing: { type: "contain", w: 0.82, h: 0.6 } });
  s.addText("TON DUC THANG UNIVERSITY", { x: 1.45, y: 0.42, w: 8, h: 0.3, fontSize: 15, bold: true, color: NAVY, fontFace: HEAD, align: "left", margin: 0, valign: "middle" });
  s.addText("FACULTY OF INFORMATION TECHNOLOGY", { x: 1.45, y: 0.72, w: 8, h: 0.26, fontSize: 11.5, color: TEAL, fontFace: BODY, align: "left", charSpacing: 1, margin: 0, valign: "middle" });
  s.addShape(p.shapes.LINE, { x: 0.5, y: 1.18, w: 9, h: 0, line: { color: LINEC, width: 1 } });
  s.addText("CAPSTONE PROJECT 3  ·  COMPUTER SCIENCE", { x: 0.5, y: 1.62, w: 9, h: 0.32, fontSize: 13, bold: true, color: TEAL, fontFace: BODY, align: "center", charSpacing: 3, margin: 0 });
  s.addText("Integrating Multimodal Representations into\nGraph-based Fashion Recommender Systems", { x: 0.5, y: 2.04, w: 9, h: 1.0, fontSize: 27, bold: true, color: NAVY, fontFace: HEAD, align: "center", lineSpacingMultiple: 1.03, margin: 0 });
  s.addText("Benchmarking 24 multimodal GNN configurations on the Vibrent Clothes Rental dataset", { x: 0.5, y: 3.18, w: 9, h: 0.35, fontSize: 13.5, italic: true, color: INK, fontFace: BODY, align: "center", margin: 0 });
  s.addShape(p.shapes.LINE, { x: 3.7, y: 3.74, w: 2.6, h: 0, line: { color: LINEC, width: 1 } });
  s.addText([
    { text: "Presented by  ", options: { color: MUT } },
    { text: "Hoang Dinh Quy Vu", options: { bold: true, color: NAVY } },
    { text: "   ·   252805008", options: { color: MUT } },
  ], { x: 0.5, y: 3.88, w: 9, h: 0.33, fontSize: 15, fontFace: BODY, align: "center", margin: 0 });
  s.addText([
    { text: "Advised by  ", options: { color: MUT } },
    { text: "Dr. Tran Trung Tin", options: { bold: true, color: TEAL } },
  ], { x: 0.5, y: 4.26, w: 9, h: 0.33, fontSize: 14, fontFace: BODY, align: "center", margin: 0 });
  s.addText("BM3 · CombiGCN · FREEDOM   |   CLIP · MobileNetV2 · BERT   |   Ho Chi Minh City, 2026", { x: 0.5, y: 4.78, w: 9, h: 0.3, fontSize: 10.5, color: MUT, fontFace: BODY, align: "center", margin: 0 });
}

// ════════ 2 — Table of Contents ════════
{
  const s = p.addSlide();
  base(s, "Table of Contents", 2);
  const items = [
    "Problem & Motivation", "Research Questions & Objectives", "Dataset: Vibrent Clothes Rental",
    "Methodology & Configuration Space", "Models: CombiGCN · BM3 · FREEDOM", "Multimodal Integration Design",
    "RQ1 — Visual Encoder", "RQ2 — Fusion Strategy", "RQ3 — Model Comparison",
    "Training Dynamics & Overfitting", "Conclusion & Contributions", "Limitations & Future Work",
  ];
  const colX = [0.6, 5.15], colW = 4.25, rowY = 1.55, dy = 0.56, rh = 0.46;
  items.forEach((it, i) => {
    const col = i < 6 ? 0 : 1, row = i % 6;
    const x = colX[col], y = rowY + row * dy;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h: rh, rectRadius: 0.05, fill: { color: CARD }, line: { color: LINEC, width: 0.75 } });
    s.addShape(p.shapes.RECTANGLE, { x: x, y: y, w: 0.07, h: rh, fill: { color: TEAL } });
    s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.2, y, w: 0.55, h: rh, fontSize: 15, bold: true, color: TEAL, fontFace: HEAD, margin: 0, valign: "middle" });
    s.addText(it, { x: x + 0.82, y, w: colW - 0.95, h: rh, fontSize: 12.5, color: INK, fontFace: BODY, margin: 0, valign: "middle" });
  });
}

// ════════ 3 — Problem & Motivation ════════
{
  const s = p.addSlide();
  base(s, "Problem & Motivation", 3);
  s.addText([
    { text: "Fashion recommendation is hard", options: { bold: true, color: NAVY, fontSize: 14, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Users interact with very few items, leaving the user-item graph extremely sparse.", options: { color: INK, fontSize: 12.5, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Two coupled bottlenecks", options: { bold: true, color: NAVY, fontSize: 14, breakLine: true, paraSpaceAfter: 4 } },
    { text: "ID-bound collaborative filtering", options: { bold: true, color: RED, fontSize: 12.5, bullet: { code: "2022" } } },
    { text: " — cold / tail items have no signal to learn from.", options: { color: INK, fontSize: 12.5, breakLine: true } },
    { text: "Style is visual & textual", options: { bold: true, color: RED, fontSize: 12.5, bullet: { code: "2022" } } },
    { text: " — pure interaction IDs ignore aesthetics & descriptions.", options: { color: INK, fontSize: 12.5, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Our angle", options: { bold: true, color: NAVY, fontSize: 14, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Inject multimodal item content into graph collaborative filtering to propagate preference along visual / textual similarity links.", options: { color: INK, fontSize: 12.5 } },
  ], { x: 0.6, y: 1.2, w: 5.0, h: 3.9, valign: "top", margin: 0 });
  card(s, 5.85, 1.25, 3.85, 3.7);
  s.addText("WHAT WE BENCHMARK", { x: 6.05, y: 1.45, w: 3.5, h: 0.3, fontSize: 10, bold: true, color: TEAL, fontFace: BODY, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "3", options: { bold: true, color: NAVY, fontSize: 15 } }, { text: "  graph models    ", options: { color: MUT, fontSize: 11.5 } },
    { text: "×  2", options: { bold: true, color: NAVY, fontSize: 15 } }, { text: "  vision encoders\n", options: { color: MUT, fontSize: 11.5, breakLine: true } },
    { text: "×  4", options: { bold: true, color: NAVY, fontSize: 15 } }, { text: "  fusion strategies", options: { color: MUT, fontSize: 11.5, breakLine: true } },
  ], { x: 6.05, y: 1.78, w: 3.5, h: 0.7, valign: "top", margin: 0 });
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 6.05, y: 2.62, w: 3.5, h: 0.55, rectRadius: 0.05, fill: { color: "EAF3F4" }, line: { color: TEAL, width: 1 } });
  s.addText("=  24 model configurations", { x: 6.05, y: 2.62, w: 3.5, h: 0.55, fontSize: 14, bold: true, color: TEAL, fontFace: BODY, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "Question: ", options: { bold: true, color: NAVY, fontSize: 11.5 } },
    { text: "which encoder, which fusion, and which architecture actually help under real sparsity?", options: { color: INK, fontSize: 11.5, italic: true } },
  ], { x: 6.05, y: 3.35, w: 3.5, h: 1.4, valign: "top", margin: 0 });
}

// ════════ 4 — Research Questions & Objectives ════════
{
  const s = p.addSlide();
  base(s, "Research Questions & Objectives", 4);
  card(s, 0.6, 1.2, 4.3, 3.75, "FBF1EC");
  s.addText("OBJECTIVES", { x: 0.85, y: 1.4, w: 3.8, h: 0.3, fontSize: 11, bold: true, color: GOLD, fontFace: BODY, charSpacing: 2, margin: 0 });
  const objs = [
    ["O1", "Preprocess the VCR dataset (5-core, per-user temporal 80/20 split)"],
    ["O2", "Extract visual (CLIP, MobileNetV2) & textual (BERT) features"],
    ["O3", "Adapt 3 multimodal GNNs on a shared LightGCN backbone"],
    ["O4", "Benchmark 24 configs across encoders & fusion strategies"],
    ["O5", "Analyse ranking quality across K and metrics"],
  ];
  objs.forEach((o, i) => {
    const y = 1.78 + i * 0.62;
    s.addText(o[0], { x: 0.85, y, w: 0.55, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: HEAD, margin: 0, valign: "middle" });
    s.addText(o[1], { x: 1.42, y, w: 3.4, h: 0.55, fontSize: 11, color: INK, fontFace: BODY, margin: 0, valign: "middle" });
  });
  s.addText("FOUR RESEARCH QUESTIONS", { x: 5.25, y: 1.4, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: TEAL, fontFace: BODY, charSpacing: 2, margin: 0 });
  const rqs = [
    ["RQ1", "Which visual encoder — CLIP or MobileNetV2 — suits fashion better?"],
    ["RQ2", "Which fusion is best? Does trainable attention beat parameter-free late fusion?"],
    ["RQ3", "Which architecture (BM3 / CombiGCN / FREEDOM) wins at its optimal config?"],
    ["RQ4", "Is the ranking stable across cut-off K and across metrics?"],
  ];
  rqs.forEach((q, i) => {
    const y = 1.78 + i * 0.78;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 5.25, y, w: 4.45, h: 0.66, rectRadius: 0.05, fill: { color: CARD }, line: { color: LINEC, width: 0.75 } });
    s.addText(q[0], { x: 5.4, y, w: 0.7, h: 0.66, fontSize: 13, bold: true, color: TEAL, fontFace: HEAD, margin: 0, valign: "middle" });
    s.addText(q[1], { x: 6.08, y: y + 0.04, w: 3.5, h: 0.58, fontSize: 10.5, color: INK, fontFace: BODY, valign: "middle", margin: 0 });
  });
}

// ════════ 5 — Dataset ════════
{
  const s = p.addSlide();
  base(s, "Dataset · Vibrent Clothes Rental (VCR)", 5);
  s.addText("A clothes-rental log: highly sparse, short per-user history — a realistic stress test for cold-start recommendation.", { x: 0.6, y: 1.12, w: 9.1, h: 0.4, fontSize: 12, color: INK, fontFace: BODY, valign: "top", margin: 0 });
  const stats = [
    ["553", "users"], ["2,194", "items"], ["9,455", "interactions"],
    ["99.22%", "sparsity"], ["3.81", "test items / user"], ["80 / 20", "temporal split"],
  ];
  stats.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 3.05, y = 1.7 + row * 1.18;
    card(s, x, y, 2.8, 1.0);
    s.addText(st[0], { x, y: y + 0.12, w: 2.8, h: 0.5, fontSize: 24, bold: true, color: TEAL, fontFace: HEAD, align: "center", margin: 0 });
    s.addText(st[1], { x, y: y + 0.64, w: 2.8, h: 0.3, fontSize: 10.5, color: MUT, fontFace: BODY, align: "center", margin: 0 });
  });
  card(s, 0.6, 4.18, 9.1, 0.78, "EAF3F4");
  s.addText([
    { text: "Why this matters:  ", options: { bold: true, color: NAVY, fontSize: 12 } },
    { text: "with only ~3.81 ground-truth items per user, top-K beyond 5 saturates recall — so ", options: { color: INK, fontSize: 12 } },
    { text: "K = 5 is our primary cut-off", options: { bold: true, color: TEAL, fontSize: 12 } },
    { text: ", with K ∈ {1, 5, 10, 20} reported for comparison.", options: { color: INK, fontSize: 12 } },
  ], { x: 0.82, y: 4.18, w: 8.7, h: 0.78, fontFace: BODY, valign: "middle", margin: 0 });
}

// ════════ 6 — Methodology · Proposed Data Pipeline ════════
{
  const s = p.addSlide();
  base(s, "Methodology · Proposed Data Pipeline", 6);
  s.addImage({
    path: FIG + "/data_pipeline.3.1.png",
    x: 0.5,
    y: 1.5,
    w: 5.2,
    h: 2.84,
    sizing: { type: "contain", w: 5.2, h: 2.84 }
  });
  card(s, 6.0, 1.25, 3.5, 3.7, "EFF4FB");
  s.addText("DATA PREPROCESSING STAGES", { x: 6.2, y: 1.45, w: 3.1, h: 0.3, fontSize: 11, bold: true, color: BLUE, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "1. Initial Filtering & Sampling", options: { bold: true, color: NAVY, fontSize: 11, breakLine: true } },
    { text: "Applies 5-core filtering iteratively. Removes cold users/items with fewer than 5 interactions.", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "2. Data Refinement & Mapping", options: { bold: true, color: NAVY, fontSize: 11, breakLine: true } },
    { text: "Maps raw sparse IDs to sequential indices for users and items, creating clean adjacency matrices.", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "3. Per-User Partitioning", options: { bold: true, color: NAVY, fontSize: 11, breakLine: true } },
    { text: "Splits each user's history chronologically: 80% for training, 20% for testing.", options: { color: INK, fontSize: 10.5 } }
  ], { x: 6.2, y: 1.65, w: 3.1, h: 3.2, valign: "top", margin: 0 });
}

// ════════ 7 — Methodology · Configuration Space ════════
{
  const s = p.addSlide();
  base(s, "Methodology · Configuration Space", 7);
  // pipeline strip
  node(s, 0.5, 1.25, 2.0, 0.85, "VCR Log", "5-core filter");
  node(s, 2.75, 1.25, 2.15, 0.85, "Feature Extraction", "CLIP · MBNv2 · BERT");
  node(s, 5.15, 1.25, 2.05, 0.85, "Multimodal GNN", "shared LightGCN core");
  node(s, 7.45, 1.25, 2.05, 0.85, "Top-N Ranking", "6 metrics @ K", { fill: "EAF3F4", line: TEAL, color: TEAL });
  aRight(s, 2.5, 1.675, 0.25); aRight(s, 4.9, 1.675, 0.25); aRight(s, 7.2, 1.675, 0.25);
  // 3 axes
  const axes = [
    ["3  ARCHITECTURES", BLUE, "EFF4FB", ["CombiGCN — dual-graph item-item similarity", "BM3 — bootstrap contrastive (no negatives)", "FREEDOM — frozen kNN graph + InfoNCE"]],
    ["2  VISION ENCODERS", PURP, "F3EFFA", ["CLIP — 512-d vision-language", "MobileNetV2 — 1280→768-d (PCA), local texture", "(text: BERT 768-d, shared across encoders)"]],
    ["4  FUSION TYPES", TEAL, "EAF3F4", ["img_only  ·  text_only", "multimodal — late fusion (average)", "multimodal_attention — trainable gate"]],
  ];
  axes.forEach((a, i) => {
    const x = 0.5 + i * 3.1;
    card(s, x, 2.45, 2.9, 2.45, a[2]);
    s.addText(a[0], { x: x + 0.18, y: 2.6, w: 2.6, h: 0.3, fontSize: 11.5, bold: true, color: a[1], fontFace: BODY, charSpacing: 1, margin: 0 });
    s.addText(a[3].map(t => ({ text: t, options: { color: INK, fontSize: 10.5, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } })),
      { x: x + 0.18, y: 2.95, w: 2.55, h: 1.85, valign: "top", margin: 0 });
  });
  s.addText("3 × 2 × 4 = 24 configurations.  LightGCN is the shared CF backbone (not run as a standalone configuration).", { x: 0.5, y: 4.98, w: 9.2, h: 0.3, fontSize: 9.5, italic: true, color: MUT, fontFace: BODY, align: "center", margin: 0 });
}

// ════════ 8 — Models · Three Architectures, One Backbone ════════
{
  const s = p.addSlide();
  base(s, "Models · Three Architectures, One Backbone", 8);
  s.addText("All three extend the LightGCN propagation scheme on the user-item graph; they differ in how multimodal content is injected.", { x: 0.6, y: 1.1, w: 9.1, h: 0.35, fontSize: 11.5, color: INK, fontFace: BODY, valign: "top", margin: 0 });
  const models = [
    ["CombiGCN", BLUE, "EFF4FB", "Dual-graph propagation", ["Pre-computes an item-item similarity graph from content features", "Fuses CF branch + similarity branch at each layer", "Fusion at the data level"]],
    ["BM3", TEAL, "EAF3F4", "Self-supervised bootstrap", ["Single LightGCN + raw modal projectors", "Bootstrap contrastive loss, EMA target, no negatives", "Implicit regulariser → robust"]],
    ["FREEDOM", PURP, "F3EFFA", "Decoupled kNN structure", ["Frozen item-item kNN graph at init", "Content propagated, aligned via InfoNCE", "Decoupled collaborative + semantic views"]],
  ];
  models.forEach((m, i) => {
    const x = 0.5 + i * 3.1;
    card(s, x, 1.6, 2.9, 3.3, m[2]);
    s.addText(m[0], { x: x + 0.18, y: 1.74, w: 2.6, h: 0.4, fontSize: 17, bold: true, color: m[1], fontFace: HEAD, margin: 0 });
    s.addText(m[3], { x: x + 0.18, y: 2.18, w: 2.6, h: 0.3, fontSize: 10.5, italic: true, color: MUT, fontFace: BODY, margin: 0 });
    s.addShape(p.shapes.LINE, { x: x + 0.18, y: 2.52, w: 2.54, h: 0, line: { color: LINEC, width: 1 } });
    s.addText(m[4].map(t => ({ text: t, options: { color: INK, fontSize: 10.5, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 7 } })),
      { x: x + 0.18, y: 2.62, w: 2.55, h: 2.2, valign: "top", margin: 0 });
  });
}

// ════════ 9 — Models · CombiGCN Architecture ════════
{
  const s = p.addSlide();
  base(s, "Models · CombiGCN Architecture", 9);
  s.addImage({
    path: FIG + "/combignc.jpg",
    x: 0.5,
    y: 1.5,
    w: 5.2,
    h: 2.83,
    sizing: { type: "contain", w: 5.2, h: 2.83 }
  });
  card(s, 6.0, 1.25, 3.5, 3.7, "EFF4FB");
  s.addText("COMBIGNCN DESIGN", { x: 6.2, y: 1.45, w: 3.1, h: 0.3, fontSize: 11, bold: true, color: BLUE, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "Dual-Graph Propagation", options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
    { text: "Propagates user/item representations on two graphs simultaneously:", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 4 } },
    { text: "• User-Item Collaborative Graph (CF branch)", options: { color: INK, fontSize: 10.5, breakLine: true } },
    { text: "• Item-Item Similarity Graph (content branch)", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Layer-wise Fusion", options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
    { text: "Fuses collaborative representations with semantic representations at each GCN layer to enrich embedding vectors.", options: { color: INK, fontSize: 10.5 } }
  ], { x: 6.2, y: 1.65, w: 3.1, h: 3.2, valign: "top", margin: 0 });
}

// ════════ 10 — Models · BM3 Architecture ════════
{
  const s = p.addSlide();
  base(s, "Models · BM3 Architecture", 10);
  s.addImage({
    path: FIG + "/bm3.png",
    x: 0.5,
    y: 1.5,
    w: 5.2,
    h: 2.91,
    sizing: { type: "contain", w: 5.2, h: 2.91 }
  });
  card(s, 6.0, 1.25, 3.5, 3.7, "EAF3F4");
  s.addText("BM3 DESIGN", { x: 6.2, y: 1.45, w: 3.1, h: 0.3, fontSize: 11, bold: true, color: TEAL, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "Bootstrap Contrastive Learning", options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
    { text: "Aligns representations of collaborative branch and modal projectors using self-supervised learning.", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Key Characteristics:", options: { bold: true, color: NAVY, fontSize: 11.5, breakLine: true, paraSpaceAfter: 4 } },
    { text: "• Uses EMA (Exponential Moving Average) target encoder to stabilize training.", options: { color: INK, fontSize: 10.5, breakLine: true } },
    { text: "• Requires no negative samples, eliminating batch-size dependency.", options: { color: INK, fontSize: 10.5, breakLine: true } },
    { text: "• Acts as a strong regularizer that prevents overfitting.", options: { color: INK, fontSize: 10.5 } }
  ], { x: 6.2, y: 1.65, w: 3.1, h: 3.2, valign: "top", margin: 0 });
}

// ════════ 11 — Models · FREEDOM Architecture ════════
{
  const s = p.addSlide();
  base(s, "Models · FREEDOM Architecture", 11);
  s.addImage({
    path: FIG + "/freedom.jpg",
    x: 0.5,
    y: 1.5,
    w: 5.2,
    h: 2.83,
    sizing: { type: "contain", w: 5.2, h: 2.83 }
  });
  card(s, 6.0, 1.25, 3.5, 3.7, "F3EFFA");
  s.addText("FREEDOM DESIGN", { x: 6.2, y: 1.45, w: 3.1, h: 0.3, fontSize: 11, bold: true, color: PURP, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "Decoupled GNN Architecture", options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
    { text: "Maintains two independent views during training:", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 4 } },
    { text: "• Collaborative View (CF): User-item graph.", options: { color: INK, fontSize: 10.5, breakLine: true } },
    { text: "• Semantic View: Item-item kNN graph.", options: { color: INK, fontSize: 10.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "InfoNCE Alignment", options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
    { text: "Aligns GNN representations with semantic graph via contrastive InfoNCE loss over a frozen kNN graph.", options: { color: INK, fontSize: 10.5 } }
  ], { x: 6.2, y: 1.65, w: 3.1, h: 3.2, valign: "top", margin: 0 });
}

// ════════ 12 — Multimodal Integration Design ════════
{
  const s = p.addSlide();
  base(s, "Multimodal Integration Design", 12);
  card(s, 0.6, 1.2, 4.45, 3.75, "EFF4FB");
  s.addText("DATA-LEVEL  (CombiGCN)", { x: 0.85, y: 1.38, w: 4, h: 0.3, fontSize: 11, bold: true, color: BLUE, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "Fusion happens offline at the data layer.", options: { color: INK, fontSize: 12, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Visual + textual features → item-item similarity matrix S (cosine, thresholded, normalised, cached).", options: { color: INK, fontSize: 12, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } },
    { text: "S acts as a static structural prior guiding graph propagation — decoupled from feature dimensionality.", options: { color: INK, fontSize: 12, bullet: { code: "2022" } } },
  ], { x: 0.85, y: 1.72, w: 3.95, h: 3.0, valign: "top", margin: 0 });
  card(s, 5.25, 1.2, 4.45, 3.75, "F3EFFA");
  s.addText("MODEL-LEVEL  (BM3 · FREEDOM)", { x: 5.5, y: 1.38, w: 4, h: 0.3, fontSize: 11, bold: true, color: PURP, fontFace: BODY, charSpacing: 1, margin: 0 });
  s.addText([
    { text: "Raw embeddings projected into the CF space and fused end-to-end.", options: { color: INK, fontSize: 12, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Late fusion (multimodal): element-wise average  e = (hᵥ + hₜ) / 2", options: { color: INK, fontSize: 12, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Attention gating (multimodal_attention): trainable βᵥ, βₜ weight each modality per item.", options: { color: INK, fontSize: 12, bullet: { code: "2022" } } },
  ], { x: 5.5, y: 1.72, w: 3.95, h: 3.0, valign: "top", margin: 0 });
}

// ════════ 13 — RQ1 Encoder ════════
{
  const s = p.addSlide();
  base(s, "RQ1 · Visual Encoder — CLIP vs MobileNetV2", 13);
  s.addText("NDCG@10 — the winner flips with configuration", { x: 0.6, y: 1.1, w: 6, h: 0.3, fontSize: 11, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
  s.addChart(p.charts.BAR, [
    { name: "CLIP", labels: ["BM3\nmultimodal", "CombiGCN\nimg_only", "BM3\ntext_only", "FREEDOM\nmultimodal"], values: [0.0142, 0.0155, 0.0158, 0.0049] },
    { name: "MobileNetV2", labels: ["BM3\nmultimodal", "CombiGCN\nimg_only", "BM3\ntext_only", "FREEDOM\nmultimodal"], values: [0.0186, 0.0085, 0.0149, 0.0081] },
  ], {
    x: 0.5, y: 1.45, w: 6.0, h: 3.5, barDir: "col", barGrouping: "clustered", chartColors: [PURP, TEAL],
    catAxisLabelColor: INK, catAxisLabelFontSize: 9, valAxisLabelColor: MUT, valAxisLabelFontSize: 9,
    valAxisMaxVal: 0.02, valAxisMinVal: 0, valAxisMajorUnit: 0.005, valGridLine: { color: LINEC, size: 0.5 }, catGridLine: { style: "none" },
    showValue: false, showLegend: true, legendPos: "b", legendColor: INK, legendFontSize: 10, showTitle: false,
  });
  card(s, 6.75, 1.45, 2.95, 3.5, "FBF1EC");
  s.addText("VERDICT", { x: 6.95, y: 1.62, w: 2.6, h: 0.3, fontSize: 10, bold: true, color: GOLD, fontFace: BODY, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "MobileNetV2 wins inside each model's best (late-fusion) config", options: { bold: true, color: TEAL, fontSize: 12, breakLine: true, paraSpaceAfter: 6 } },
    { text: "— local texture beats CLIP's coarse semantics for styling.", options: { color: INK, fontSize: 11, breakLine: true, paraSpaceAfter: 8 } },
    { text: "But CLIP wins img_only & text_only", options: { bold: true, color: PURP, fontSize: 12, breakLine: true, paraSpaceAfter: 6 } },
    { text: "→ superiority is configuration-dependent, not universal.", options: { color: INK, fontSize: 11 } },
  ], { x: 6.95, y: 1.95, w: 2.55, h: 2.9, valign: "top", margin: 0 });
}

// ════════ 14 — RQ2 Fusion ════════
{
  const s = p.addSlide();
  base(s, "RQ2 · Fusion Strategy — Ablation (MBNv2)", 14);
  s.addText("NDCG@10 across the four fusion settings", { x: 0.6, y: 1.1, w: 6, h: 0.3, fontSize: 11, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
  s.addChart(p.charts.BAR, [
    { name: "BM3", labels: ["img_only", "text_only", "multimodal", "mm_attention"], values: [0.0150, 0.0149, 0.0186, 0.0101] },
    { name: "CombiGCN", labels: ["img_only", "text_only", "multimodal", "mm_attention"], values: [0.0085, 0.0071, 0.0175, 0.0151] },
    { name: "FREEDOM", labels: ["img_only", "text_only", "multimodal", "mm_attention"], values: [0.0062, 0.0031, 0.0081, 0.0088] },
  ], {
    x: 0.5, y: 1.45, w: 6.0, h: 3.5, barDir: "col", barGrouping: "clustered", chartColors: [TEAL, BLUE, PURP],
    catAxisLabelColor: INK, catAxisLabelFontSize: 9.5, valAxisLabelColor: MUT, valAxisLabelFontSize: 9,
    valAxisMaxVal: 0.02, valAxisMinVal: 0, valAxisMajorUnit: 0.005, valGridLine: { color: LINEC, size: 0.5 }, catGridLine: { style: "none" },
    showValue: false, showLegend: true, legendPos: "b", legendColor: INK, legendFontSize: 10, showTitle: false,
  });
  card(s, 6.75, 1.45, 2.95, 3.5, "FBF1EC");
  s.addText("VERDICT", { x: 6.95, y: 1.62, w: 2.6, h: 0.3, fontSize: 10, bold: true, color: GOLD, fontFace: BODY, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "Late fusion is best & parameter-free", options: { bold: true, color: TEAL, fontSize: 12, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Attention gating hurts:", options: { bold: true, color: RED, fontSize: 12, breakLine: true, paraSpaceAfter: 3 } },
    { text: "BM3 −46%  ·  CombiGCN −14%", options: { color: INK, fontSize: 11, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Trainable weights overfit 9,455 sparse interactions; only weak FREEDOM gains (+8%).", options: { color: INK, fontSize: 11 } },
  ], { x: 6.95, y: 1.95, w: 2.55, h: 2.9, valign: "top", margin: 0 });
}

// ════════ 15 — RQ3 Model Comparison ════════
{
  const s = p.addSlide();
  base(s, "RQ3 · Model Comparison (best configs)", 15);
  s.addText("Best configuration of each model — NDCG@5 vs NDCG@10", { x: 0.6, y: 1.1, w: 6, h: 0.3, fontSize: 11, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
  s.addChart(p.charts.BAR, [
    { name: "NDCG@5", labels: ["BM3", "CombiGCN", "FREEDOM"], values: [0.0162, 0.0137, 0.0084] },
    { name: "NDCG@10", labels: ["BM3", "CombiGCN", "FREEDOM"], values: [0.0186, 0.0175, 0.0088] },
  ], {
    x: 0.5, y: 1.45, w: 6.0, h: 3.5, barDir: "col", barGrouping: "clustered", chartColors: [TEAL, NAVY],
    catAxisLabelColor: INK, catAxisLabelFontSize: 11, valAxisLabelColor: MUT, valAxisLabelFontSize: 9,
    valAxisMaxVal: 0.02, valAxisMinVal: 0, valAxisMajorUnit: 0.005, valGridLine: { color: LINEC, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: INK, dataLabelFontSize: 8.5, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0000",
    showLegend: true, legendPos: "b", legendColor: INK, legendFontSize: 10, showTitle: false,
  });
  card(s, 6.75, 1.45, 2.95, 3.5, "EAF3F4");
  s.addText("HIERARCHY", { x: 6.95, y: 1.62, w: 2.6, h: 0.3, fontSize: 10, bold: true, color: TEAL, fontFace: BODY, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "BM3 > CombiGCN > FREEDOM", options: { bold: true, color: NAVY, fontSize: 12.5, breakLine: true, paraSpaceAfter: 8 } },
    { text: "BM3 leads for all K ≥ 5", options: { color: INK, fontSize: 11, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 5 } },
    { text: "At K = 1, BM3 = CombiGCN tie (0.0127)", options: { color: INK, fontSize: 11, bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 5 } },
    { text: "FREEDOM −53% vs BM3 — kNN noise on small data", options: { color: INK, fontSize: 11, bullet: { code: "2022" } } },
  ], { x: 6.95, y: 1.95, w: 2.55, h: 2.9, valign: "top", margin: 0 });
}

// ════════ 16 — Training Dynamics ════════
{
  const s = p.addSlide();
  base(s, "Training Dynamics & Overfitting", 16);
  s.addText("Epoch of peak validation performance (best config of each model)", { x: 0.6, y: 1.1, w: 6.2, h: 0.3, fontSize: 11, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
  s.addChart(p.charts.BAR, [
    { name: "Best epoch", labels: ["BM3", "CombiGCN", "FREEDOM"], values: [720, 280, 960] },
  ], {
    x: 0.5, y: 1.5, w: 5.7, h: 3.35, barDir: "col", chartColors: [TEAL],
    catAxisLabelColor: INK, catAxisLabelFontSize: 11, valAxisLabelColor: MUT, valAxisLabelFontSize: 9,
    valAxisMaxVal: 1000, valAxisMinVal: 0, valAxisMajorUnit: 200, valGridLine: { color: LINEC, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: INK, dataLabelFontSize: 10, dataLabelPosition: "outEnd", showLegend: false, showTitle: false,
  });
  const notes = [
    ["CombiGCN — fast but overfits", RED, "Peaks @ 280; loss then falls −70% while test quality drops. ~2.5× faster than BM3 → good if training budget is tight (with early stopping)."],
    ["BM3 — slow but robust", TEAL, "Peaks @ 720; loss falls only −21% after. Bootstrap contrastive acts as a strong implicit regulariser."],
    ["FREEDOM — late & flat", MUT, "Peaks @ 960; loss almost stationary (+0.3%) — weak optimisation direction on sparse data."],
  ];
  notes.forEach((n, i) => {
    const y = 1.5 + i * 1.14;
    card(s, 6.45, y, 3.25, 1.0, i === 1 ? "EAF3F4" : CARD);
    s.addText(n[0], { x: 6.62, y: y + 0.1, w: 2.95, h: 0.3, fontSize: 11.5, bold: true, color: n[1], fontFace: BODY, margin: 0 });
    s.addText(n[2], { x: 6.62, y: y + 0.38, w: 2.95, h: 0.58, fontSize: 9.3, color: INK, fontFace: BODY, valign: "top", margin: 0 });
  });
  s.addText("Single run per config — read as qualitative trends (see Limitations).", { x: 0.5, y: 4.95, w: 6, h: 0.3, fontSize: 9, italic: true, color: MUT, fontFace: BODY, margin: 0 });
}

// ════════ 17 — Conclusion & Contributions ════════
{
  const s = p.addSlide();
  base(s, "Conclusion & Contributions", 17);
  const con = [
    ["01", "Multimodal late fusion helps", "Within every evaluated architecture, fusing visual + textual beats single-modality variants."],
    ["02", "Encoder choice is conditional", "MobileNetV2 leads in late-fusion configs; CLIP wins visual-only — not a universal ranking."],
    ["03", "Simpler fusion is stronger", "Parameter-free late fusion is robust; trainable attention overfits sparse interaction logs."],
    ["04", "Architecture × depth matters", "BM3 best for K ≥ 5; CombiGCN ties at top-1 & converges ~2.5× faster."],
  ];
  con.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.65, y = 1.25 + row * 1.55;
    card(s, x, y, 4.4, 1.38);
    s.addText(c[0], { x: x + 0.18, y: y + 0.16, w: 0.7, h: 0.5, fontSize: 22, bold: true, color: TEAL, fontFace: HEAD, margin: 0 });
    s.addText(c[1], { x: x + 0.95, y: y + 0.16, w: 3.3, h: 0.4, fontSize: 12.5, bold: true, color: NAVY, fontFace: BODY, valign: "top", margin: 0 });
    s.addText(c[2], { x: x + 0.95, y: y + 0.56, w: 3.3, h: 0.75, fontSize: 10.5, color: INK, fontFace: BODY, valign: "top", margin: 0 });
  });
  card(s, 0.6, 4.45, 9.1, 0.6, "EAF3F4");
  s.addText("Best configuration:  BM3 · MobileNetV2 · multimodal late fusion  —  NDCG@10 = 0.0186, NDCG@5 = 0.0162.", { x: 0.82, y: 4.45, w: 8.7, h: 0.6, fontSize: 12.5, italic: true, bold: true, color: NAVY, fontFace: BODY, align: "center", valign: "middle", margin: 0 });
}

// ════════ 18 — Limitations & Future Work ════════
{
  const s = p.addSlide();
  base(s, "Limitations & Future Work", 18);
  const lims = [
    ["Single-run estimates", "No multiple seeds or significance tests; narrow margins (BM3 vs CombiGCN) are indicative trends."],
    ["Near-floor absolute metrics", "Extreme sparsity (3.81 test items/user) keeps HR@10 ~0.07 — focus is relative comparison."],
    ["No standalone baselines tuned", "LightGCN-only and popularity baselines not benchmarked; d = 512 fixed without tuning."],
    ["Static offline features", "Pre-extracted embeddings ignore temporal trend / seasonality dynamics."],
  ];
  lims.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.65, y = 1.25 + row * 1.42;
    card(s, x, y, 4.4, 1.25);
    s.addShape(p.shapes.RECTANGLE, { x: x, y: y + 0.06, w: 0.1, h: 1.13, fill: { color: GOLD } });
    s.addText(l[0], { x: x + 0.28, y: y + 0.14, w: 4.0, h: 0.4, fontSize: 12.5, bold: true, color: NAVY, fontFace: BODY, valign: "top", margin: 0 });
    s.addText(l[1], { x: x + 0.28, y: y + 0.54, w: 4.0, h: 0.65, fontSize: 10.3, color: INK, fontFace: BODY, valign: "top", margin: 0 });
  });
  card(s, 0.6, 4.18, 9.1, 0.78, "EAF3F4");
  s.addText([
    { text: "Future work:  ", options: { bold: true, color: TEAL, fontSize: 12 } },
    { text: "multi-seed significance testing, popularity & LightGCN baselines, embedding-capacity ablation, and temporal / sequence-aware fusion.", options: { color: INK, fontSize: 12 } },
  ], { x: 0.82, y: 4.18, w: 8.7, h: 0.78, fontFace: BODY, valign: "middle", margin: 0 });
}

// ════════ 15 — Thank You ════════
{
  const s = p.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.18, fill: { color: NAVY } });
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 5.445, w: 10, h: 0.18, fill: { color: TEAL } });
  s.addImage({ path: LOGO, x: 4.45, y: 1.0, w: 1.1, h: 0.82, sizing: { type: "contain", w: 1.1, h: 0.82 } });
  s.addText("Thank You", { x: 0.5, y: 2.1, w: 9, h: 0.95, fontSize: 46, bold: true, color: NAVY, fontFace: HEAD, align: "center", margin: 0 });
  s.addShape(p.shapes.LINE, { x: 4.0, y: 3.2, w: 2.0, h: 0, line: { color: TEAL, width: 1.5 } });
  s.addText("Questions & Discussion", { x: 0.5, y: 3.32, w: 9, h: 0.4, fontSize: 16, color: TEAL, fontFace: BODY, align: "center", margin: 0 });
  s.addText([
    { text: "Hoang Dinh Quy Vu", options: { bold: true, color: NAVY } },
    { text: "    ·    Advised by  ", options: { color: MUT } },
    { text: "Dr. Tran Trung Tin", options: { bold: true, color: TEAL } },
  ], { x: 0.5, y: 4.2, w: 9, h: 0.3, fontSize: 12.5, fontFace: BODY, align: "center", margin: 0 });
  s.addText("Ton Duc Thang University  ·  Faculty of Information Technology", { x: 0.5, y: 4.6, w: 9, h: 0.28, fontSize: 10.5, color: MUT, fontFace: BODY, align: "center", margin: 0 });
}

// ── Appendix chrome ──
function baseApp(slide, title) {
  slide.background = { color: "FFFFFF" };
  slide.addShape(p.shapes.RECTANGLE, { x: 0.5, y: 0.42, w: 0.13, h: 0.34, fill: { color: GOLD } });
  slide.addText(title, { x: 0.74, y: 0.36, w: 7.9, h: 0.5, fontSize: 21, bold: true, color: NAVY, fontFace: HEAD, margin: 0, valign: "middle" });
  slide.addImage({ path: LOGO, x: 9.02, y: 0.3, w: 0.78, h: 0.55, sizing: { type: "contain", w: 0.78, h: 0.55 } });
  slide.addShape(p.shapes.LINE, { x: 0.5, y: 0.98, w: 9.3, h: 0, line: { color: LINEC, width: 1 } });
  slide.addText("Appendix · Backup slide (not in 10-min flow)", { x: 0.5, y: 5.3, w: 7, h: 0.22, fontSize: 8, color: MUT, fontFace: BODY, margin: 0, valign: "middle" });
}
function qaBlock(s, y, h, qNum, q, a, col) {
  card(s, 0.5, y, 9.2, h);
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: y + 0.14, w: 0.5, h: 0.32, rectRadius: 0.05, fill: { color: col } });
  s.addText("Q" + qNum, { x: 0.7, y: y + 0.14, w: 0.5, h: 0.32, fontSize: 10.5, bold: true, color: "FFFFFF", fontFace: BODY, align: "center", valign: "middle", margin: 0 });
  s.addText(q, { x: 1.35, y: y + 0.12, w: 8.1, h: 0.38, fontSize: 11.5, bold: true, color: NAVY, fontFace: BODY, valign: "middle", margin: 0 });
  s.addText([{ text: "A   ", options: { bold: true, color: col } }, { text: a, options: { color: INK } }], { x: 0.72, y: y + 0.52, w: 8.75, h: h - 0.62, fontSize: 10, fontFace: BODY, valign: "top", margin: 0 });
}

// ════════ Appendix A1 — Anticipated questions 1–3 ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Anticipated Questions (1/2)");
  qaBlock(s, 1.15, 1.22, 1,
    "Absolute scores are tiny (NDCG ~0.018, HR ~0.07) — is the system actually useful?",
    "These are near-floor by construction: VCR is 99.22% sparse with only 3.81 ground-truth items per user, so top-K beyond the catalog saturates. The contribution is the controlled relative comparison across 24 configurations, not the absolute magnitude — which we report honestly rather than inflate.",
    RED);
  qaBlock(s, 2.47, 1.22, 2,
    "You headline MobileNetV2 > CLIP, yet CLIP wins several configs — isn't that a contradiction?",
    "No — the advantage is explicitly configuration-dependent. MobileNetV2 leads inside each model's best late-fusion config; CLIP wins visual-only and text-only settings (e.g. CombiGCN img_only, NDCG@20 0.0220 vs 0.0119). We scope the claim to the late-fusion regime, not a universal ranking.",
    RED);
  qaBlock(s, 3.79, 1.22, 3,
    "Why does trainable attention gating hurt the strong models?",
    "The attention gate adds learnable parameters on top of only 9,455 interactions, so it overfits and injects noise — degrading BM3 (−46%) and CombiGCN (−14%). Parameter-free late fusion has no such capacity to overfit, so it is the robust choice on sparse data. FREEDOM, being weaker, gains only marginally (+8%).",
    RED);
}

// ════════ Appendix A2 — Anticipated questions 4–6 ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Anticipated Questions (2/2)");
  qaBlock(s, 1.15, 1.22, 4,
    "There are no standalone LightGCN baseline numbers — why?",
    "LightGCN is the shared collaborative-filtering backbone that all three architectures inherit; it is not run as a standalone configuration (sim_type = none is not among the four tested fusion settings). We disclose this in the Limitations and do not claim a baseline gain we did not measure — benchmarking it is future work.",
    GOLD);
  qaBlock(s, 2.47, 1.22, 5,
    "Single run, no significance testing — can the differences be trusted?",
    "We report this openly in §5.2. Given the small test set and near-floor metrics, narrow margins (e.g. BM3 vs CombiGCN) are presented as indicative trends, not statistically confirmed differences. The consistent BM3 > CombiGCN > FREEDOM ordering across K and 5/6 metrics is the robust signal; multi-seed significance testing is planned.",
    GOLD);
  qaBlock(s, 3.79, 1.22, 6,
    "Why is BM3 the strongest architecture here?",
    "Its bootstrap contrastive self-supervision (EMA target, no negatives) acts as a strong implicit regulariser, so it keeps generalising under sparsity and resists overfitting even at epoch 720. CombiGCN overfits its static similarity graph quickly (peaks @ 280), and FREEDOM's frozen kNN graph injects noise on this small dataset.",
    GOLD);
}

// ── Data-table helper ──
function dataTable(s, x, y, w, colW, caption, headers, rows, aligns) {
  if (caption) s.addText(caption, { x, y: y - 0.32, w, h: 0.28, fontSize: 10.5, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
  const head = headers.map(h => ({ text: h, options: { fill: { color: NAVY }, color: "FFFFFF", bold: true, align: "center", fontSize: 9 } }));
  const body = rows.map(r => r.map((c, i) => ({ text: String(c), options: { align: aligns[i], fontSize: 9, color: INK } })));
  s.addTable([head, ...body], { x, y, w, colW, rowH: 0.3, border: { type: "solid", pt: 0.5, color: LINEC }, fontFace: BODY, valign: "middle", fill: { color: "FFFFFF" }, margin: 2 });
}
const L = "left", C = "center";

// ════════ Data D1 — Full encoder comparison (Table 4.2) ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Full Encoder Comparison (Table 4.2)");
  dataTable(s, 0.5, 1.5, 9.2, [2.2, 2.4, 1.5, 1.5, 1.6], "NDCG@10 across all 12 model-fusion configurations — CLIP vs MobileNetV2",
    ["Model", "Sim Type", "CLIP", "MobileNetV2", "MBNv2 Δ (%)"],
    [["BM3", "img_only", "0.0129", "0.0150", "+16.3"],
     ["BM3", "text_only", "0.0158", "0.0149", "−6.1"],
     ["BM3", "multimodal", "0.0142", "0.0186", "+30.8"],
     ["BM3", "mm_attention", "0.0059", "0.0101", "+72.2"],
     ["CombiGCN", "img_only", "0.0155", "0.0085", "−45.2"],
     ["CombiGCN", "text_only", "0.0077", "0.0071", "−7.5"],
     ["CombiGCN", "multimodal", "0.0174", "0.0175", "+0.7"],
     ["CombiGCN", "mm_attention", "0.0153", "0.0151", "−1.6"],
     ["FREEDOM", "img_only", "0.0060", "0.0062", "+3.7"],
     ["FREEDOM", "text_only", "0.0049", "0.0031", "−36.1"],
     ["FREEDOM", "multimodal", "0.0049", "0.0081", "+63.7"],
     ["FREEDOM", "mm_attention", "0.0033", "0.0088", "+165.3"]],
    [L, L, C, C, C]);
}

// ════════ Data D2 — Ablation (4.3) + Best-vs-best (4.4) ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Ablation & Best Configurations");
  dataTable(s, 0.5, 1.45, 9.2, [2.6, 1.65, 1.65, 1.65, 1.65], "Table 4.3 — NDCG@10 ablation by fusion type (best encoder per cell)",
    ["Model (best enc.)", "img_only", "text_only", "multimodal", "mm_attention"],
    [["BM3 (MBNv2)", "0.0150", "0.0149", "0.0186", "0.0101"],
     ["CombiGCN (MBNv2)", "0.0085", "0.0071", "0.0175", "0.0151"],
     ["FREEDOM (MBNv2)", "0.0062", "0.0031", "0.0081", "0.0088"]],
    [L, C, C, C, C]);
  dataTable(s, 0.5, 3.45, 9.2, [1.5, 2.0, 1.0, 1.05, 1.05, 1.05, 1.55], "Table 4.4 — Best config of each architecture across ranking metrics",
    ["Model", "Best Config", "NDCG@5", "NDCG@10", "Rec@10", "Prec@10", "MRR@10"],
    [["BM3", "MBNv2 · multimodal", "0.0162", "0.0186", "0.0250", "0.0078", "0.0291"],
     ["CombiGCN", "MBNv2 · multimodal", "0.0137", "0.0175", "0.0244", "0.0081", "0.0290"],
     ["FREEDOM", "MBNv2 · mm_attention", "0.0084", "0.0088", "0.0132", "0.0031", "0.0124"]],
    [L, L, C, C, C, C, C]);
}

// ════════ Data D3 — Convergence (4.5) + Metrics ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Convergence & Evaluation Metrics");
  dataTable(s, 0.5, 1.5, 9.2, [1.7, 2.7, 1.6, 1.6, 1.6], "Table 4.5 — Convergence statistics (best config of each architecture)",
    ["Model", "Best Config", "Best Epoch", "Loss @ Best", "Loss @ 1000"],
    [["BM3", "MBNv2 · multimodal", "720", "0.0369", "0.0290"],
     ["CombiGCN", "MBNv2 · multimodal", "280", "0.0406", "0.0119"],
     ["FREEDOM", "MBNv2 · mm_attention", "960", "0.4683", "0.4698"]],
    [L, L, C, C, C]);
  s.addText("EVALUATION METRICS  (K ∈ {1, 5, 10, 20}, primary K = 5)", { x: 0.5, y: 3.25, w: 9, h: 0.3, fontSize: 10.5, bold: true, color: TEAL, fontFace: BODY, charSpacing: 1, margin: 0 });
  const mets = [
    ["Recall@K", "fraction of relevant items retrieved"],
    ["Precision@K", "fraction of top-K that are relevant"],
    ["NDCG@K", "position-weighted ranking quality"],
    ["HR@K", "≥ 1 relevant item in top-K"],
    ["MAP@K", "mean average precision"],
    ["MRR@K", "reciprocal rank of first hit"],
  ];
  mets.forEach((m, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 3.1, y = 3.6 + row * 0.72;
    card(s, x, y, 2.92, 0.62);
    s.addText(m[0], { x: x + 0.12, y: y + 0.06, w: 2.7, h: 0.26, fontSize: 11, bold: true, color: NAVY, fontFace: BODY, margin: 0 });
    s.addText(m[1], { x: x + 0.12, y: y + 0.31, w: 2.7, h: 0.26, fontSize: 8.7, color: MUT, fontFace: BODY, margin: 0 });
  });
}

// ════════ Data D4 — Hyperparameters ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Key Hyperparameters");
  const blocks = [
    ["(a) Common Optimization", [["Embedding dim d", "512"], ["GNN layers", "4"], ["Learning rate", "0.001 (Adam)"], ["L2 weight decay", "1e-4"]]],
    ["(b) Training Schedule", [["Batch size", "8,192"], ["Max epochs", "1,000"], ["Early stop", "patience 40"], ["Monitor", "Recall@20"]]],
    ["(c) Encoders", [["CLIP (img)", "512-d"], ["MobileNetV2 (img)", "1280→768 PCA"], ["BERT (text)", "768-d"], ["TF-IDF", "CombiGCN graph"]]],
    ["(d) BM3", [["CL weight λ_CL", "0.2"], ["EMA momentum m", "0.995"], ["Predictor", "2-layer MLP"], ["Negatives", "none"]]],
    ["(e) FREEDOM", [["CL weight λ_CL", "0.1"], ["InfoNCE τ", "0.2"], ["kNN size k", "10"], ["kNN graph", "frozen"]]],
    ["(f) CombiGCN", [["Item-item graph", "precomputed"], ["Fusion level", "data layer"], ["Norm", "symmetric"], ["Loss", "BPR"]]],
  ];
  const bx = [0.5, 3.57, 6.64], bw = 2.93, byy = [1.3, 3.25], bh = 1.78;
  blocks.forEach((b, i) => {
    const x = bx[i % 3], y = byy[Math.floor(i / 3)];
    card(s, x, y, bw, bh);
    s.addText(b[0], { x: x + 0.12, y: y + 0.1, w: bw - 0.24, h: 0.3, fontSize: 10.5, bold: true, color: TEAL, fontFace: BODY, margin: 0 });
    const rt = [];
    b[1].forEach(kv => {
      rt.push({ text: kv[0] + "  ", options: { color: MUT, fontSize: 9.5 } });
      rt.push({ text: kv[1], options: { color: INK, fontSize: 9.5, bold: true, breakLine: true } });
    });
    s.addText(rt, { x: x + 0.12, y: y + 0.45, w: bw - 0.24, h: bh - 0.55, fontFace: BODY, valign: "top", margin: 0, paraSpaceAfter: 3 });
  });
}

// ════════ Data D5 — Architecture figures ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Model Architectures");
  const figs = [
    [FIG + "/combignc.jpg", "CombiGCN — dual-graph propagation"],
    [FIG + "/bm3.png", "BM3 — bootstrap contrastive (EMA target)"],
    [FIG + "/freedom.jpg", "FREEDOM — frozen kNN + InfoNCE"],
  ];
  figs.forEach((f, i) => {
    const y = 1.2 + i * 1.4;
    s.addImage({ path: f[0], x: 0.6, y: y, w: 5.4, h: 1.28, sizing: { type: "contain", w: 5.4, h: 1.28 } });
    s.addText(f[1], { x: 6.2, y: y + 0.4, w: 3.5, h: 0.5, fontSize: 12, bold: true, color: NAVY, fontFace: BODY, valign: "middle", margin: 0 });
  });
}

// ════════ Data D6 — Result figures ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Result Figures");
  s.addImage({ path: FIG + "/chap4/Figure_72_Tier_1_Best_Config_per_Model_Metrics_Overview.png", x: 0.55, y: 1.25, w: 4.5, h: 3.3, sizing: { type: "contain", w: 4.5, h: 3.3 } });
  s.addText("Best config of each model across 6 metrics", { x: 0.55, y: 4.6, w: 4.5, h: 0.3, fontSize: 9.5, italic: true, color: MUT, fontFace: BODY, align: "center", margin: 0 });
  s.addImage({ path: FIG + "/chap4/Figure_75_Radar_Overview_MBNv2_12_Configs.png", x: 5.25, y: 1.25, w: 4.45, h: 3.3, sizing: { type: "contain", w: 4.45, h: 3.3 } });
  s.addText("MobileNetV2 radar — bm3_multimodal dominates", { x: 5.25, y: 4.6, w: 4.45, h: 0.3, fontSize: 9.5, italic: true, color: MUT, fontFace: BODY, align: "center", margin: 0 });
}

// ════════ Appendix A3 — CF Backbone Formulas (LightGCN) ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · CF Backbone Formulas (LightGCN)");
  formulaRow(s, 1.25, "Graph Structure", "Bipartite Adjacency Matrix", 
    FORMULA_DIR + "/formula_28_1.png", 
    "R: Bipartite interaction matrix\nD: Diagonal degree matrix");
  formulaRow(s, 2.50, "Node Propagation", "LightGCN aggregation", 
    FORMULA_DIR + "/formula_28_2.png", 
    "N_u: Set of items user u rated\ne_u^(k): Latent embedding at layer k");
  formulaRow(s, 3.75, "BPR Optimization", "Bayesian Personalized Ranking", 
    FORMULA_DIR + "/formula_28_3.png", 
    "r_ui: Score prediction for item i\nD: Observed vs unobserved triplets");
}

// ════════ Appendix A4 — CombiGCN & BM3 Formulas ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · CombiGCN & BM3 Formulas");
  formulaRow(s, 1.25, "CombiGCN Fusion", "Dual-graph message-passing", 
    FORMULA_DIR + "/formula_29_1.png", 
    "S: Normalized similarity prior\nS_i: Similar items neighborhood", "EFF4FB");
  formulaRow(s, 2.50, "BM3 Projections", "Linear projectors & EMA", 
    FORMULA_DIR + "/formula_29_2.png", 
    "x_vis, x_txt: Raw item features\nm = 0.995 (momentum decay)", "EAF3F4");
  formulaRow(s, 3.75, "BM3 Bootstrap Loss", "Bootstrap contrastive learning", 
    FORMULA_DIR + "/formula_29_3.png", 
    "L_boot: Cosine distance loss\nsg(•): Stop-gradient operator", "EAF3F4");
}

// ════════ Appendix A5 — FREEDOM Formulas ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · FREEDOM Formulas");
  formulaRow(s, 1.25, "FREEDOM Content GCN", "Content kNN graph aggregation", 
    FORMULA_DIR + "/formula_30_1.png", 
    "A^knn: Normalized kNN graph\nN_k(i): Content-similar neighbors", "F3EFFA");
  formulaRow(s, 2.50, "InfoNCE Alignment", "Contrastive loss between GNN views", 
    FORMULA_DIR + "/formula_30_2.png", 
    "B: Mini-batch of item nodes\ns(•): Cosine similarity; τ = 0.2", "F3EFFA");
  formulaRow(s, 3.75, "Joint Optimization", "Multi-task objective function", 
    FORMULA_DIR + "/formula_30_3.png", 
    "λ_1: L2 weight decay\nλ_2: Contrastive loss weight", CARD);
}

// ════════ Appendix A6 — Evaluation Metric Formulas ════════
{
  const s = p.addSlide();
  baseApp(s, "Appendix · Evaluation Metric Formulas");
  formulaRow(s, 1.25, "Retrieval Accuracy", "Click-level retrieval accuracy", 
    FORMULA_DIR + "/formula_31_1.png", 
    "I_u^test: Ground-truth test items\nI_u,K: Top-K recommendations", "FBF1EC");
  formulaRow(s, 2.50, "Rank Gain (NDCG)", "Normalized discounted cumulative gain", 
    FORMULA_DIR + "/formula_31_2.png", 
    "r_i = 1 if item at rank i is relevant\nIDCG: Ideal sorted DCG", "EAF3F4");
  formulaRow(s, 3.75, "Precision Orders", "MAP & MRR metrics", 
    FORMULA_DIR + "/formula_31_3.png", 
    "P(i): Precision at position i\nrank_u*: First hit rank in top-K", "EAF3F4");
}

p.writeFile({ fileName: "E:/DoCode/CD2/01_Report_CD2_FashionRecommendation/4_docs/02_Present/Fashion_RecSys_CD2.pptx" })
  .then(f => console.log("WROTE", f))
  .catch(e => { console.error("ERR", e); process.exit(1); });
