# 广州仲裁委员会案件管理系统 · 二期 Demo

> 面向仲裁秘书与仲裁员的智能案件作业平台，支持案件总览、时间线、智能阅卷与文书写作全流程。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 · Composition API (`<script setup>`) |
| 构建 | Vite 5 |
| UI 组件 | Element Plus |
| 富文本编辑器 | TipTap 3 (`@tiptap/vue-3` + StarterKit + 扩展) |
| 样式 | CSS 自定义属性（无 SCSS / 无 Tailwind）|
| Word 处理 | mammoth（导入）· docx（导出）|
| 语言 | JavaScript（无 TypeScript）|

---

## 项目结构

```
frontend/
├── src/
│   ├── main.js                        # 入口，引入全局样式
│   ├── styles/
│   │   ├── theme.css                  # CSS 变量与主题别名
│   │   ├── base.css                   # 全局基础样式
│   │   └── doc-shared.css             # 文书写作/智能阅卷共享组件样式
│   ├── components/
│   │   ├── editor/
│   │   │   └── EditorArea.vue         # TipTap 富文本编辑器（支持只读模式）
│   │   └── ToastMessage.vue           # 全局提示组件
│   └── views/
│       └── 案件总作业台/
│           ├── index.vue              # 主工作台（四视图路由 + 宽布局切换）
│           ├── mock.js                # 左侧导航与案件基础数据
│           └── components/
│               ├── docWriterConfig.js     # 文书写作模块全量 Mock 数据
│               ├── docReviewConfig.js     # 智能阅卷模块全量 Mock 数据
│               ├── DocWriterView.vue      # 文书写作三栏视图（编排层）
│               ├── LeftMaterialPanel.vue  # 文书写作左侧：证据材料面板
│               ├── RightWriterPanel.vue   # 文书写作右侧：AI写作/校对/批注三 Tab
│               ├── DocReviewView.vue      # 智能阅卷三栏视图（编排层）
│               ├── LeftCaseReviewPanel.vue  # 智能阅卷左侧：案件概览 + 材料 + 模块选择
│               └── RightAiAnalysisPanel.vue # 智能阅卷右侧：AI审查建议 + 质量评估
```

---

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产包
npm run build
```

---

## 主要功能模块

### 案件总作业台

工作台分四个视图，通过左侧导航切换：

| 导航项 | 视图 | 说明 |
|--------|------|------|
| 案件总览 | overview | 案件基本信息、当事人、仲裁员 |
| 时间线 | timeline | 案件关键节点时间轴 |
| 智能阅卷 | reading | 三栏：案件/材料概览 + 裁决书只读 + AI质量评估 |
| 文书写作 | writing | 三栏：证据材料 + TipTap编辑器 + AI写作/校对/批注 |

智能阅卷和文书写作视图采用**宽布局模式**（左侧导航收窄至 180px，内容区撑满），左右主侧边栏自动隐藏。

### 文书写作（DocWriterView）

- 左侧材料面板：7份案件材料，支持来源筛选（申请方/被申请方/仲裁庭），高风险冲突材料引用拦截
- 中间编辑器：TipTap 富文本，支持 Word 导入（mammoth）与导出（docx），段落定位高亮
- 右侧三 Tab：
  - **AI 写作助手**：按文书章节选择预设指令（生成争议焦点/裁决理由/检测冲突等），返回模拟结果并可一键插入编辑器
  - **校对检查**：三组校对项（格式/逻辑/证据引用），点击可定位至对应段落
  - **人工批注**：添加/处理批注，支持筛选待处理/已处理

### 智能阅卷（DocReviewView）

- 左侧面板：案件概览卡片、6份材料列表（含预览弹窗）、三个审查模块选择器（核心诉求/无争议事实/争议焦点）
- 中间编辑器：只读模式显示裁决书全文，工具栏隐藏
- 右侧面板：对应模块的审查建议 + 五维质量评分（论证逻辑/争议焦点/自由裁量/事实认定/文书规范）

---

## 演示案件数据

所有 Mock 数据均基于以下真实结构案例：

- **案号**：（2026）粤仲案字第 5412 号
- **申请人**：新菱空调（佛冈）有限公司
- **被申请人**：广东恒力建设工程有限公司
- **纠纷类型**：买卖合同纠纷 · 简易程序
- **争议金额**：货款人民币 82,957.70 元 + 逾期利息
- **独任仲裁员**：陈某某 · 秘书：陈炜
- **开庭日期**：2026-04-15

---

## 样式规范

- 主色：`--primary-color: #3B61E0`（深蓝）
- 渐变：`--gradient-primary: linear-gradient(135deg, #1e3170 0%, #3d56c8 100%)`
- 面板头部均使用 `--gradient-primary` 深蓝渐变背景
- 三栏布局宽度：左 286px / 中 1fr / 右 308px（定义在 `doc-shared.css`）
- 编辑器背景：纯白 `#fff`，卡片背景：`#fafbfd`

---

## 注意事项

- 本项目为纯前端 Demo，所有数据均为静态 Mock，无后端接口
- TipTap 编辑器使用自定义扩展 `ParagraphIdAttr` 支持 `data-paragraph-id` 属性，用于段落定位
- Word 导出功能依赖 `docx` 库在浏览器端生成 `.docx` 文件
- Element Plus 组件按需引入，通过全局注册方式使用
