# Extracted Figures & Tables Results (Chapter 2 onwards)

This document contains the raw code extraction and markdown representations of all figures and tables defined in the report starting from Chapter 2.

---

## 🖼️ Extracted Figures

### Figure 3.1
* **Source LaTeX File:** [3_1_Overview_of_the_proposed_pipeline.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_1_Overview_of_the_proposed_pipeline.tex#L5-L10)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\data_pipeline.3.1.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
	\centering
	\includegraphics[width=0.9\textwidth]{figs/data_pipeline.3.1}
	\caption{Workflow of the proposed data preprocessing pipeline, outlining the three primary steps: initial filtering and sampling, data refinement via N-core filtering and ID mapping, and per-user temporal partitioning into training and testing datasets.}
	\label{fig:data_pipeline}
\end{figure}
```
* **Context:** Illustrates the chronological dataset partitioning: filtering raw outfits, running $5$-core filtering, user/item indexing, and sorting interactions chronologically per-user to split them into $80/20$ train/test subsets.

---

### Figure 3.2
* **Source LaTeX File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L17-L22)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\combigcn.jpg`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
	\centering
	\includegraphics[width=0.9\textwidth]{figs/combigcn}
	\caption{Architecture and workflow of CombiGCN, combining the user-item collaborative filtering (CF) branch with the item-item similarity branch via dual-graph GCN layers.}
	\label{fig:combigcn}
\end{figure}
```
* **Context:** Depicts how adapted CombiGCN fuses traditional user-item GCN message-passing (CF branch) with signal propagation over a content-based item-item similarity graph in each neural network layer.

---

### Figure 3.3
* **Source LaTeX File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L57-L62)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\bm3.jpg`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
	\centering
	\includegraphics[width=0.95\textwidth]{figs/bm3}
	\caption{Architecture and workflow of BM3, featuring the collaborative filtering (CF) branch, linear modal projectors, and the self-supervised bootstrap contrastive learning process with an EMA target encoder.}
	\label{fig:bm3}
\end{figure}
```
* **Context:** Shows the bootstrap self-supervised multimodal recommendation framework, highlighting the online encoder, predictor head, stop-gradient operator, and exponential moving average (EMA) target encoder.

---

### Figure 3.4
* **Source LaTeX File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L100-L105)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\freedom.jpg`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
	\centering
	\includegraphics[width=0.95\textwidth]{figs/freedom}
	\caption{Architecture and workflow of FREEDOM, showing the decoupled interactive view (CF branch) and semantic view (content branch over a frozen kNN graph) aligned via InfoNCE contrastive loss.}
	\label{fig:freedom}
\end{figure}
```
* **Context:** Details the decoupled graph structure learning mechanism in FREEDOM, contrasting the interactive collaborative GCN view with the content kNN graph semantic view, optimized via standard InfoNCE loss.

---

### Figure 4.1
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L39-L56)
* **Local Asset Paths:**
  - Subfigure (a) CLIP: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_46_Recall_Precision_NDCG_K_CLIP.png`
  - Subfigure (b) MobileNetV2: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_47_Recall_Precision_NDCG_K_MBNV2.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[htbp]
    \centering
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_46_Recall_Precision_NDCG_K_CLIP.png}
        \caption{CLIP Encoder Configurations}
        \label{fig:metrics_clip}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_47_Recall_Precision_NDCG_K_MBNV2.png}
        \caption{MobileNetV2 (MBNv2) Encoder Configurations}
        \label{fig:metrics_mbnv2}
    \end{subfigure}
    \caption{Top-$N$ recommendation performance (Recall@K, Precision@K, NDCG@K) of various model configurations under CLIP and MobileNetV2 encoders across different values of $K \in \{1, 5, 10, 20\}$. Red stars highlight the optimal configuration for each metric at each $K$ level.}
    \label{fig:encoder_line_comparison}
\end{figure}
```
* **Context:** Contrasts the performance of CLIP and MobileNetV2 under different values of $K$. Highlights how CLIP configurations fluctuate heavily, while MobileNetV2 consistently converges with `bm3_multimodal` leading.

---

### Figure 4.2
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L66-L83)
* **Local Asset Paths:**
  - Subfigure (a) CLIP: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_74_Radar_Overview_CLIP_12_Configs.png`
  - Subfigure (b) MobileNetV2: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_75_Radar_Overview_MBNv2_12_Configs.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[htbp]
    \centering
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_74_Radar_Overview_CLIP_12_Configs.png}
        \caption{CLIP Encoder Configurations}
        \label{fig:radar_clip}
    \end{subfigure}
    \hfill
    \begin{subfigure}[b]{0.48\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_75_Radar_Overview_MBNv2_12_Configs.png}
        \caption{MobileNetV2 (MBNv2) Encoder Configurations}
        \label{fig:radar_mbnv2}
    \end{subfigure}
    \caption{Radar charts summarizing the performance of the evaluated configurations across six recommendation metrics. The MobileNetV2-based \texttt{bm3\_multimodal} configuration exhibits a balanced, widely-expanded polygon compared to the fragmented performance of CLIP-based configurations.}
    \label{fig:encoder_radar_comparison}
\end{figure}
```
* **Context:** Radar charts mapping multi-metric profiles. MobileNetV2 creates a balanced, large polygon representing generalized learning, whereas CLIP graphs are collapsed and highly asymmetrical.

---

### Figure 4.3
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L103-L129)
* **Local Asset Paths:**
  - Subfigure (a) BM3: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_48_NDCG_K_BM3_ablation.png`
  - Subfigure (b) CombiGCN: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_56_NDCG_K_COMBIGCN_ablation.png`
  - Subfigure (c) FREEDOM: `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_64_NDCG_K_FREEDOM_ablation.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[htbp]
    \centering
    \begin{subfigure}[b]{0.6\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_48_NDCG_K_BM3_ablation.png}
        \caption{BM3 Ablation}
        \label{fig:ablation_bm3}
    \end{subfigure}
    
    \vspace{0.4cm}
    \begin{subfigure}[b]{0.6\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_56_NDCG_K_COMBIGCN_ablation.png}
        \caption{CombiGCN Ablation}
        \label{fig:ablation_combigcn}
    \end{subfigure}
    
    \vspace{0.4cm}
    \begin{subfigure}[b]{0.6\textwidth}
        \centering
        \includegraphics[width=\textwidth]{figs/chap4/Figure_64_NDCG_K_FREEDOM_ablation.png}
        \caption{FREEDOM Ablation}
        \label{fig:ablation_freedom}
    \end{subfigure}
    \caption{NDCG@K ablation heatmaps for BM3, CombiGCN, and FREEDOM architectures across various visual encoders and similarity/fusion types.}
    \label{fig:ablation_heatmaps}
\end{figure}
```
* **Context:** Grid heatmaps depicting the NDCG@K ablation analysis for all 24 encoder/fusion combinations under the three primary models.

---

### Figure 4.4
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L134-L139)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_55_BM3_NDCG_10_by_sim_type_x_encoder.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.7\textwidth]{figs/chap4/Figure_55_BM3_NDCG_10_by_sim_type_x_encoder.png}
    \caption{BM3 performance comparison at NDCG@10 across different similarity/fusion types and visual encoders.}
    \label{fig:bm3_sim_comparison}
\end{figure}
```
* **Context:** Visualizes BM3 performance at NDCG@10 across encoders and fusion strategies. Highlights the $46\%$--$59\%$ performance drop when switching from late fusion to weighted attention gating.

---

### Figure 4.5
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L185-L190)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_72_Tier_1_Best_Config_per_Model_Metrics_Overview.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{figs/chap4/Figure_72_Tier_1_Best_Config_per_Model_Metrics_Overview.png}
    \caption{Comparison of the best configurations of BM3, CombiGCN, and FREEDOM across all six evaluation metrics.}
    \label{fig:best_config_overview}
\end{figure}
```
* **Context:** Shows the final performance breakdown comparing the optimal setup of BM3 (MBNv2, multimodal), CombiGCN (MBNv2, multimodal), and FREEDOM (MBNv2, mm_attention) across metrics.

---

### Figure 4.6
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L222-L227)
* **Local Asset Path:** `E:\DoCode\CD2\01_Report_CD2_FashionRecommendation\figs\chap4\Figure_82_Best_Overall_Models_for_Each_Metric.png`
* **LaTeX Source Code:**
```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.7\textwidth]{figs/chap4/Figure_82_Best_Overall_Models_for_Each_Metric.png}
    \caption{Best overall performing model configuration for each recommendation metric, averaged across all $K$ cut-off values.}
    \label{fig:best_overall_per_metric}
\end{figure}
```
* **Context:** Confirms BM3's configuration (`bm3_mbnv2_multimodal`) dominates in 5 out of 6 metrics when scores are averaged across all experimental $K$ values.

---

## 📊 Extracted Tables

### Table 4.1: Statistical Summary of the Preprocessed VCR Dataset
* **Source LaTeX File:** [4_1_Dataset.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_1_Dataset.tex#L23-L40)
* **LaTeX Source Code:**
```latex
\begin{table}[H]
\centering
\caption{Statistical Summary of the Preprocessed VCR Dataset.}
\label{tab:dataset_stats}
\begin{tabular}{lr}
\hline
\textbf{Statistic} & \textbf{Value} \\ \hline
Number of unique users ($|\mathcal{U}|$) & 553 \\
Number of unique items ($|\mathcal{I}|$) & 2,194 \\
Total interactions & 9,455 \\
Graph density (\%) & $0.78\%$ \\
Graph sparsity (\%) & $99.22\%$ \\
Training interactions & 7,350 \\
Testing interactions & 2,105 \\
Average training interactions per user & 13.29 \\
Average testing interactions per user & 3.81 \\ \hline
\end{tabular}
\end{table}
```
* **Markdown Representation:**

| Statistic | Value |
| :--- | :--- |
| Number of unique users ($|\mathcal{U}|$) | 553 |
| Number of unique items ($|\mathcal{I}|$) | 2,194 |
| Total interactions | 9,455 |
| Graph density (%) | $0.78\%$ |
| Graph sparsity (%) | $99.22\%$ |
| Training interactions | 7,350 |
| Testing interactions | 2,105 |
| Average training interactions per user | 13.29 |
| Average testing interactions per user | 3.81 |

---

### Table 4.2: Impact of the Visual Encoder on NDCG@10
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L11-L33)
* **LaTeX Source Code:**
```latex
\begin{table}[H]
\centering
\caption{Impact of the visual encoder on NDCG@10 across all model--fusion configurations (CLIP vs.\ MobileNetV2). The final column reports the relative change when switching from CLIP to MobileNetV2.}
\label{tab:encoder_comparison}
\small
\setlength{\tabcolsep}{6pt}
\begin{tabular}{llccc}
\hline
\textbf{Model} & \textbf{Sim Type} & \textbf{NDCG@10 (CLIP)} & \textbf{NDCG@10 (MBNv2)} & \textbf{MBNv2 $\Delta$ (\%)} \\ \hline
BM3 & img\_only & 0.0129 & 0.0150 & $+16.3$ \\
BM3 & tfidf & \textbf{0.0158} & 0.0149 & $-6.1$ \\
BM3 & multimodal & 0.0142 & \textbf{0.0186} & $+30.8$ \\
BM3 & mm\_attention & 0.0059 & 0.0101 & $+72.2$ \\ \hline
CombiGCN & img\_only & \textbf{0.0155} & 0.0085 & $-45.2$ \\
CombiGCN & tfidf & \textbf{0.0077} & 0.0071 & $-7.5$ \\
CombiGCN & multimodal & 0.0174 & \textbf{0.0175} & $+0.7$ \\
CombiGCN & mm\_attention & \textbf{0.0153} & 0.0151 & $-1.6$ \\ \hline
FREEDOM & img\_only & 0.0060 & 0.0062 & $+3.7$ \\
FREEDOM & tfidf & \textbf{0.0049} & 0.0031 & $-36.1$ \\
FREEDOM & multimodal & 0.0049 & \textbf{0.0081} & $+63.7$ \\
FREEDOM & mm\_attention & 0.0033 & \textbf{0.0088} & $+165.3$ \\ \hline
\end{tabular}
\end{table}
```
* **Markdown Representation:**

| Model | Sim Type | NDCG@10 (CLIP) | NDCG@10 (MBNv2) | MBNv2 $\Delta$ (%) |
| :--- | :--- | :---: | :---: | :---: |
| **BM3** | img_only | 0.0129 | 0.0150 | $+16.3\%$ |
| **BM3** | tfidf | **0.0158** | 0.0149 | $-6.1\%$ |
| **BM3** | multimodal | 0.0142 | **0.0186** | $+30.8\%$ |
| **BM3** | mm_attention | 0.0059 | 0.0101 | $+72.2\%$ |
| **CombiGCN** | img_only | **0.0155** | 0.0085 | $-45.2\%$ |
| **CombiGCN** | tfidf | **0.0077** | 0.0071 | $-7.5\%$ |
| **CombiGCN** | multimodal | 0.0174 | **0.0175** | $+0.7\%$ |
| **CombiGCN** | mm_attention | **0.0153** | 0.0151 | $-1.6\%$ |
| **FREEDOM** | img_only | 0.0060 | 0.0062 | $+3.7\%$ |
| **FREEDOM** | tfidf | **0.0049** | 0.0031 | $-36.1\%$ |
| **FREEDOM** | multimodal | 0.0049 | **0.0081** | $+63.7\%$ |
| **FREEDOM** | mm_attention | 0.0033 | **0.0088** | $+165.3\%$ |

---

### Table 4.3: Ablation Study Comparison of NDCG@10 Scores
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L155-L168)
* **LaTeX Source Code:**
```latex
\begin{table}[H]
\centering
\caption{Ablation Study Comparison of NDCG@10 Scores Under Different Similarity and Fusion Types (Best Encoder Selected for Each Setup).}
\label{tab:ablation_summary}
\small
\setlength{\tabcolsep}{6pt}
\begin{tabular}{lcccc}
\hline
\textbf{Model} & \textbf{img\_only} & \textbf{tfidf} & \textbf{multimodal} & \shortstack[c]{\textbf{multimodal\_}\\\textbf{attention}} \\ \hline
BM3 (MBNv2) & 0.0150 & 0.0149 & \textbf{0.0186} & 0.0101 \\
CombiGCN (MBNv2) & 0.0085 & 0.0071 & \textbf{0.0175} & 0.0151 \\
FREEDOM (MBNv2) & 0.0062 & 0.0031 & 0.0081 & \textbf{0.0088} \\ \hline
\end{tabular}
\end{table}
```
* **Markdown Representation:**

| Model (Best Encoder) | img_only | tfidf | multimodal | multimodal_attention |
| :--- | :---: | :---: | :---: | :---: |
| **BM3 (MBNv2)** | 0.0150 | 0.0149 | **0.0186** | 0.0101 |
| **CombiGCN (MBNv2)** | 0.0085 | 0.0071 | **0.0175** | 0.0151 |
| **FREEDOM (MBNv2)** | 0.0062 | 0.0031 | 0.0081 | **0.0088** |

---

### Table 4.4: Best-performing Configuration of each Architecture across Ranking Metrics
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L194-L209)
* **LaTeX Source Code:**
```latex
\begin{table}[H]
\centering
\caption{Best-performing configuration of each architecture across ranking metrics (best configuration selected by NDCG@10). Bold marks the highest value in each column.}
\label{tab:best_vs_best}
\scriptsize
\setlength{\tabcolsep}{4pt}
\resizebox{\textwidth}{!}{%
\begin{tabular}{llcccccccc}
\hline
\textbf{Model} & \textbf{Best Config} & \textbf{NDCG@5} & \textbf{NDCG@10} & \textbf{Recall@5} & \textbf{Recall@10} & \textbf{Prec@5} & \textbf{Prec@10} & \textbf{MRR@5} & \textbf{MRR@10} \\ \hline
BM3 & MBNv2 $\cdot$ multimodal & \textbf{0.0162} & \textbf{0.0186} & \textbf{0.0166} & \textbf{0.0250} & \textbf{0.0105} & 0.0078 & \textbf{0.0259} & \textbf{0.0291} \\
CombiGCN & MBNv2 $\cdot$ multimodal & 0.0137 & 0.0175 & 0.0127 & 0.0244 & 0.0090 & \textbf{0.0081} & 0.0242 & 0.0290 \\
FREEDOM & MBNv2 $\cdot$ mm\_attention & 0.0084 & 0.0088 & 0.0105 & 0.0132 & 0.0054 & 0.0031 & 0.0118 & 0.0124 \\ \hline
\end{tabular}%
}
\end{table}
```
* **Markdown Representation:**

| Model | Best Config | NDCG@5 | NDCG@10 | Recall@5 | Recall@10 | Prec@5 | Prec@10 | MRR@5 | MRR@10 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BM3** | MBNv2 $\cdot$ multimodal | **0.0162** | **0.0186** | **0.0166** | **0.0250** | **0.0105** | 0.0078 | **0.0259** | **0.0291** |
| **CombiGCN** | MBNv2 $\cdot$ multimodal | 0.0137 | 0.0175 | 0.0127 | 0.0244 | 0.0090 | **0.0081** | 0.0242 | 0.0290 |
| **FREEDOM** | MBNv2 $\cdot$ mm_attention | 0.0084 | 0.0088 | 0.0105 | 0.0132 | 0.0054 | 0.0031 | 0.0118 | 0.0124 |

---

### Table 4.5: Convergence Statistics of the Best Configuration of each Architecture
* **Source LaTeX File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L239-L252)
* **LaTeX Source Code:**
```latex
\begin{table}[H]
\centering
\caption{Convergence statistics of the best configuration of each architecture: peak-performance epoch and training-loss evolution from the best epoch to the final epoch.}
\label{tab:convergence_analysis}
\small
\setlength{\tabcolsep}{6pt}
\begin{tabular}{llccc}
\hline
\textbf{Model} & \textbf{Best Config} & \textbf{Best Epoch} & \textbf{Loss@Best} & \textbf{Loss@1000} \\ \hline
BM3 & MBNv2 $\cdot$ multimodal & 720 & 0.0369 & 0.0290 \\
CombiGCN & MBNv2 $\cdot$ multimodal & 280 & 0.0406 & 0.0119 \\
FREEDOM & MBNv2 $\cdot$ mm\_attention & 960 & 0.4683 & 0.4698 \\ \hline
\end{tabular}
\end{table}
```
* **Markdown Representation:**

| Model | Best Config | Best Epoch | Loss@Best | Loss@1000 |
| :--- | :--- | :---: | :---: | :---: |
| **BM3** | MBNv2 $\cdot$ multimodal | 720 | 0.0369 | 0.0290 |
| **CombiGCN** | MBNv2 $\cdot$ multimodal | 280 | 0.0406 | 0.0119 |
| **FREEDOM** | MBNv2 $\cdot$ mm_attention | 960 | 0.4683 | 0.4698 |
