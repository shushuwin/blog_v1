## 1. 项目结构设计

### 1.1 前端目录结构

```
frontend/
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/               # 静态资源
│   │   ├── images/
│   │   ├── styles/
│   │   └── fonts/
│   ├── components/           # 通用组件
│   │   ├── common/          # 基础组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loading.tsx
│   │   ├── layout/          # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/              # UI组件库
│   │       ├── MarkdownViewer.tsx
│   │       ├── CodeHighlighter.tsx
│   │       ├── ImageGallery.tsx
│   │       └── FileUploader.tsx
│   ├── pages/               # 页面组件
│   │   ├── home/           # 个人主页
│   │   │   └── HomePage.tsx
│   │   ├── notes/          # 笔记分享
│   │   │   ├── NotesList.tsx
│   │   │   └── NoteDetail.tsx
│   │   ├── projects/       # 实战项目
│   │   │   ├── ProjectsList.tsx
│   │   │   └── ProjectDetail.tsx
│   │   ├── life/           # 个人生活
│   │   │   ├── LifeList.tsx
│   │   │   └── LifeDetail.tsx
│   │   ├── tools/          # 趣味功能
│   │   │   ├── ToolsList.tsx
│   │   │   ├── FileScanner.tsx
│   │   │   └── PasswordGenerator.tsx
│   │   └── admin/          # 后台管理
│   │       ├── login/AdminLogin.tsx
│   │       ├── posts/PostManager.tsx
│   │       ├── posts/PostEditor.tsx
│   │       ├── projects/ProjectManager.tsx
│   │       ├── files/FileManager.tsx
│   │       └── settings/Settings.tsx
│   ├── hooks/              # 自定义Hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── usePagination.ts
│   │   └── useTheme.ts
│   ├── services/           # API服务
│   │   ├── api.ts         # Axios实例配置
│   │   ├── auth.service.ts
│   │   ├── posts.service.ts
│   │   ├── projects.service.ts
│   │   ├── files.service.ts
│   │   └── tools.service.ts
│   ├── store/              # 状态管理
│   │   ├── auth.store.ts
│   │   ├── posts.store.ts
│   │   └── ui.store.ts
│   ├── types/              # TypeScript类型定义
│   │   ├── auth.types.ts
│   │   ├── posts.types.ts
│   │   ├── projects.types.ts
│   │   └── common.types.ts
│   ├── utils/              # 工具函数
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── styles/             # 全局样式
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── .env                    # 环境变量
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
└── README.md               # 项目说明
```

### 1.2 后端目录结构

```
backend/
├── app/                    # 应用主目录
│   ├── api/               # API路由
│   │   ├── __init__.py
│   │   ├── auth.py        # 认证相关接口
│   │   ├── posts.py       # 文章管理接口
│   │   ├── projects.py    # 项目管理接口
│   │   ├── files.py       # 文件管理接口
│   │   ├── tools.py       # 工具接口
│   │   └── settings.py    # 系统设置接口
│   ├── core/              # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py      # 配置管理
│   │   ├── security.py    # 安全配置
│   │   └── exceptions.py  # 异常处理
│   ├── models/            # 数据模型
│   │   ├── __init__.py
│   │   ├── user.py        # 用户模型
│   │   ├── post.py        # 文章模型
│   │   ├── project.py     # 项目模型
│   │   ├── file.py        # 文件模型
│   │   └── base.py        # 基础模型
│   ├── schemas/           # Pydantic模型
│   │   ├── __init__.py
│   │   ├── auth.py        # 认证相关模型
│   │   ├── post.py        # 文章相关模型
│   │   ├── project.py     # 项目相关模型
│   │   ├── file.py        # 文件相关模型
│   │   └── common.py      # 通用模型
│   ├── services/          # 业务逻辑
│   │   ├── __init__.py
│   │   ├── auth_service.py     # 认证服务
│   │   ├── post_service.py     # 文章服务
│   │   ├── project_service.py  # 项目服务
│   │   ├── file_service.py     # 文件服务
│   │   ├── security_service.py # 安全服务
│   │   └── tools_service.py    # 工具服务
│   ├── utils/             # 工具函数
│   │   ├── __init__.py
│   │   ├── database.py    # 数据库工具
│   │   ├── file_scanner.py # 文件扫描
│   │   ├── password.py    # 密码工具
│   │   ├── validators.py  # 验证器
│   │   └── formatters.py  # 格式化工具
│   ├── middleware/        # 中间件
│   │   ├── __init__.py
│   │   ├── cors.py        # CORS处理
│   │   ├── logging.py     # 日志中间件
│   │   └── error_handler.py # 错误处理
│   ├── static/            # 静态文件
│   │   └── uploads/       # 上传文件目录
│   ├── templates/         # 模板文件
│   └── main.py            # 应用入口
├── alembic/               # 数据库迁移
│   ├── versions/          # 迁移版本
│   ├── alembic.ini        # 迁移配置
│   └── env.py             # 迁移环境
├── tests/                 # 测试文件
│   ├── __init__.py
│   ├── conftest.py        # 测试配置
│   ├── test_auth.py       # 认证测试
│   ├── test_posts.py      # 文章测试
│   └── test_files.py      # 文件测试
├── requirements/          # 依赖管理
│   ├── base.txt           # 基础依赖
│   ├── dev.txt            # 开发依赖
│   └── prod.txt           # 生产依赖
├── .env                   # 环境变量
├── alembic.ini            # 数据库迁移配置
├── requirements.txt       # 项目依赖
└── main.py                # 应用启动文件
```

## 2. 开发规范

### 2.1 代码规范

**前端规范 (TypeScript/React)**

* 使用ESLint + Prettier进行代码格式化

* 组件命名使用PascalCase，如：`UserProfile.tsx`

* 函数和变量使用camelCase，如：`getUserData()`

* 常量使用UPPER\_SNAKE\_CASE，如：`API_BASE_URL`

* 接口名使用I前缀，如：`interface IUserData`

* 类型名使用T前缀或完整描述，如：`type UserRole = 'admin' | 'user'`

**后端规范 (Python)**

* 遵循PEP 8编码规范

* 使用Black进行代码格式化

* 类名使用PascalCase，如：`UserService`

* 函数和变量使用snake\_case，如：`get_user_data()`

* 常量使用UPPER\_SNAKE\_CASE，如：`MAX_FILE_SIZE`

* 添加类型注解，如：`def get_user(user_id: int) -> User:`

### 2.2 Git提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型说明：

* feat: 新功能

* fix: 修复bug

* docs: 文档更新

* style: 代码格式调整

* refactor: 代码重构

* test: 测试相关

* chore: 构建过程或辅助工具的变动

示例：

```
feat(auth): 添加JWT认证功能

- 实现用户登录认证
- 添加token刷新机制
- 添加权限验证中间件

Closes #123
```

### 2.3 安全规范

**认证安全**

* 使用JWT进行身份认证，设置合理的过期时间

* 密码使用bcrypt加密存储，salt rounds设置为12

* 实现token刷新机制，避免长期有效的token

* 敏感操作需要重新验证身份

**文件上传安全**

* 限制文件类型和大小（图片：5MB，其他：10MB）

* 检查文件MIME类型和扩展名的一致性

* 使用文件内容检测（magic number）

* 文件重命名存储，避免路径遍历攻击

* 实现恶意文件扫描功能

**数据安全**

* 所有用户输入进行验证和清理

* 使用参数化查询防止SQL注入

* 敏感数据加密存储

* 实现访问日志记录

* 定期备份重要数据

**API安全**

* 实现请求频率限制（60次/分钟）

* 使用HTTPS进行数据传输

* 添加CORS配置，限制跨域请求

* 错误信息不暴露系统细节

* 实现API版本控制

### 2.4 部署规范

**环境配置**

```bash
# 开发环境
NODE_ENV=development
VITE_API_URL=http://localhost:8000

# 生产环境
NODE_ENV=production
VITE_API_URL=https://api.yourblog.com
```

**构建部署**

```bash
# 前端构建
npm run build

# 后端启动
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 生产环境
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**数据库迁移**

```bash
# 生成迁移文件
alembic revision --autogenerate -m "add new table"

# 执行迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

## 3. 开发流程

### 3.1 开发环境搭建

**前端环境**

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 构建生产版本
npm run build
```

**后端环境**

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements/dev.txt

# 初始化数据库
alembic upgrade head

# 启动开发服务器
python main.py

# 运行测试
pytest
```

### 3.2 功能开发流程

1. 创建功能分支：`git checkout -b feature/new-feature`
2. 编写后端API和数据库模型
3. 实现前端页面和组件
4. 添加单元测试和集成测试
5. 进行代码审查和测试
6. 合并到主分支：`git merge feature/new-feature`

### 3.3 测试策略

**单元测试**

* 后端：使用pytest，覆盖率>80%

* 前端：使用Jest + React Testing Library

**集成测试**

* API接口测试

* 数据库操作测试

* 文件上传测试

**安全测试**

* SQL注入测试

* XSS攻击测试

* 文件上传安全测试

* 认证绕过测试

