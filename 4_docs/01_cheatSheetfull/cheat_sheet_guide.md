# Report Figures & Tables Guide (Chapter 2 onwards)

This guide documents the figures and tables used in the report starting from Chapter 2. It serves as a mapping cheat sheet between the LaTeX files and the actual figure assets and tables.

All figure assets are stored in the directory: [figs/](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs)

---

## 📂 Document Structure & Mappings

The table below outlines the chapters, their corresponding LaTeX source files, and the IDs of any figures or tables defined within them.

| Chapter / Section | LaTeX Source File | Figures Defined | Tables Defined |
| :--- | :--- | :--- | :--- |
| **Chapter 2: Background** | | | |
| 2.1 Recommender Systems | [2_1_Recommender_Systems.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/2_Background/2_1_Recommender_Systems.tex) | None | None |
| 2.2 Graph-based systems | [2_2_Graph_based_recommendation_systems_and_LightGCN.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/2_Background/2_2_Graph_based_recommendation_systems_and_LightGCN.tex) | None | None |
| 2.3 Multimodal features | [2_3_Multimodal_features_in_fashion_recommendation.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/2_Background/2_3_Multimodal_features_in_fashion_recommendation.tex) | None | None |
| 2.4 Evaluation metrics | [2_4_Evaluation_metrics.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/2_Background/2_4_Evaluation_metrics.tex) | None | None |
| **Chapter 3: Methods & Models** | | | |
| 3.1 Overview of Pipeline | [3_1_Overview_of_the_proposed_pipeline.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_1_Overview_of_the_proposed_pipeline.tex) | **Figure 3.1** | None |
| 3.2 Models in Study | [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex) | **Figure 3.2**, **Figure 3.3**, **Figure 3.4** | None |
| 3.3 Multimodal Integration | [3_3_Multimodal_integration_design.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_3_Multimodal_integration_design.tex) | None | None |
| **Chapter 4: Experiments** | | | |
| 4.1 Dataset | [4_1_Dataset.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_1_Dataset.tex) | None | **Table 4.1** |
| 4.2 Experimental Setup | [4_2_Experimental_setup.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_2_Experimental_setup.tex) | None | None |
| 4.3 Results and Analysis | [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex) | **Figure 4.1**, **Figure 4.2**, **Figure 4.3**, **Figure 4.4**, **Figure 4.5**, **Figure 4.6** | **Table 4.2**, **Table 4.3**, **Table 4.4**, **Table 4.5** |
| **Chapter 5: Conclusion** | | | |
| 5.1 Conclusion | [5_1_Conclusion.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/5_Conclusion/5_1_Conclusion.tex) | None | None |
| 5.2 Limitations | [5_2_Limitations.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/5_Conclusion/5_2_Limitations.tex) | None | None |
| 5.3 Future Work | [5_3_Future_work.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/5_Conclusion/5_3_Future_work.tex) | None | None |

---

## 🖼️ List of Figures Summary

1. **Figure 3.1: Data Preprocessing Pipeline Workflow**
   - **File:** [3_1_Overview_of_the_proposed_pipeline.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_1_Overview_of_the_proposed_pipeline.tex#L5-L10)
   - **Asset:** [figs/data_pipeline.3.1.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/data_pipeline.3.1.png)
   - **Content:** Steps of raw data filtering, sampling (10k triplets), N-core filtering (5-core reduction), user/item ID mapping, and per-user temporal 80/20 partitioning.

2. **Figure 3.2: adapted CombiGCN Architecture & Workflow**
   - **File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L17-L22)
   - **Asset:** [figs/combigcn.jpg](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/combigcn.jpg)
   - **Content:** Dual-graph propagation architecture merging a collaborative filtering user-item branch with an item-item similarity branch.

3. **Figure 3.3: BM3 Architecture & Workflow**
   - **File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L57-L62)
   - **Asset:** [figs/bm3.jpg](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/bm3.jpg)
   - **Content:** Self-supervised bootstrap multimodal recommendation workflow featuring linear projection heads, online predictor, and EMA target encoder.

4. **Figure 3.4: FREEDOM Architecture & Workflow**
   - **File:** [3_2_Models_used_in_this_study.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/3_Methods_Models/3_2_Models_used_in_this_study.tex#L100-L105)
   - **Asset:** [figs/freedom.jpg](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/freedom.jpg)
   - **Content:** Decoupled structural graph learning showing collaborative interaction view and semantic view over a frozen kNN graph, aligned via InfoNCE.

5. **Figure 4.1: Top-N Recommendation Performance (Recall, Precision, NDCG)**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L39-L54)
   - **Assets:** 
     - (a) CLIP: [Figure_46_Recall_Precision_NDCG_K_CLIP.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_46_Recall_Precision_NDCG_K_CLIP.png)
     - (b) MobileNetV2: [Figure_47_Recall_Precision_NDCG_K_MBNV2.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_47_Recall_Precision_NDCG_K_MBNV2.png)
   - **Content:** Performance curves for multiple model configurations showing Recall@K, Precision@K, and NDCG@K for $K \in \{1, 5, 10, 20\}$.

6. **Figure 4.2: Performance Radar Charts**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L66-L81)
   - **Assets:**
     - (a) CLIP: [Figure_74_Radar_Overview_CLIP_12_Configs.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_74_Radar_Overview_CLIP_12_Configs.png)
     - (b) MobileNetV2: [Figure_75_Radar_Overview_MBNv2_12_Configs.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_75_Radar_Overview_MBNv2_12_Configs.png)
   - **Content:** Multi-dimensional charts comparing the structural balance across six recommendation metrics.

7. **Figure 4.3: NDCG@K Ablation Heatmaps**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L103-L128)
   - **Assets:**
     - (a) BM3 Ablation: [Figure_48_NDCG_K_BM3_ablation.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_48_NDCG_K_BM3_ablation.png)
     - (b) CombiGCN Ablation: [Figure_56_NDCG_K_COMBIGCN_ablation.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_56_NDCG_K_COMBIGCN_ablation.png)
     - (c) FREEDOM Ablation: [Figure_64_NDCG_K_FREEDOM_ablation.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_64_NDCG_K_FREEDOM_ablation.png)
   - **Content:** Grid heatmaps showing NDCG@K scores under different visual encoders and similarity/fusion settings.

8. **Figure 4.4: BM3 NDCG@10 Sim Type Comparison**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L134-L139)
   - **Asset:** [Figure_55_BM3_NDCG_10_by_sim_type_x_encoder.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_55_BM3_NDCG_10_by_sim_type_x_encoder.png)
   - **Content:** Visual comparison of BM3 performance under varying encoders and similarity configurations at NDCG@10.

9. **Figure 4.5: Best Model Configuration Comparison**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L185-L190)
   - **Asset:** [Figure_72_Tier_1_Best_Config_per_Model_Metrics_Overview.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_72_Tier_1_Best_Config_per_Model_Metrics_Overview.png)
   - **Content:** Side-by-side bar chart comparison of BM3, CombiGCN, and FREEDOM under their respective optimal setups.

10. **Figure 4.6: Best Model Configuration averaged across K**
    - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L222-L227)
    - **Asset:** [Figure_82_Best_Overall_Models_for_Each_Metric.png](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/figs/chap4/Figure_82_Best_Overall_Models_for_Each_Metric.png)
    - **Content:** Performance of the best overall configs averaged across all $K$ cut-off levels.

---

## 📊 List of Tables Summary

1. **Table 4.1: Dataset Statistical Summary**
   - **File:** [4_1_Dataset.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_1_Dataset.tex#L23-L40)
   - **Content:** Overview of preprocessed VCR dataset size, users, items, train/test interaction counts, sparsity, and densities.

2. **Table 4.2: Visual Encoder Impact on NDCG@10**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L11-L33)
   - **Content:** Comparison of CLIP vs MobileNetV2 across all models and similarity fusion configurations with percentage change.

3. **Table 4.3: Similarity and Fusion Ablation comparison (NDCG@10)**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L155-L168)
   - **Content:** NDCG@10 scores of BM3, CombiGCN, and FREEDOM under `img_only`, `text_only`, `multimodal`, and `multimodal_attention` with the optimal encoder.

4. **Table 4.4: Best-Performing Configurations Comparison**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L194-L209)
   - **Content:** Direct comparison of the best configuration of each model on metrics (NDCG, Recall, Precision, MRR at $K \in \{5, 10\}$).

5. **Table 4.5: Convergence & Overfitting Statistics**
   - **File:** [4_3_Results_and_analysis.tex](file:///e:/DoCode/CD2/01_Report_CD2_FashionRecommendation/2_chapters/4_Experiments/4_3_Results_and_analysis.tex#L239-L252)
   - **Content:** Best epoch, loss at best epoch, and loss at epoch 1000 for the best configurations of BM3, CombiGCN, and FREEDOM.
