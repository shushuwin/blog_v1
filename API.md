# 个人网络安全博客 · 使用说明与接口文档

## 技术栈与数据库
- 前端：React 18 + Vite + React Router + TailwindCSS + Framer Motion
- 后端：FastAPI + SQLAlchemy + jose(JWT) + bcrypt
- 数据库：默认使用 SQLite（文件路径 `./blog.db`）。可通过环境变量 `DATABASE_URL` 替换为其他数据库。
  - 示例：
    - SQLite：`sqlite:///./blog.db`
    - PostgreSQL：`postgresql+psycopg2://user:pass@localhost:5432/dbname`
    - MySQL：`mysql+pymysql://user:pass@localhost:3306/dbname`

## 环境变量（后端）
在项目根目录创建 `.env`（可选）：
- `DATABASE_URL`：数据库连接串，默认 `sqlite:///./blog.db`
- `JWT_SECRET`：JWT 秘钥（默认：`change_me`，建议修改）
- `JWT_EXPIRES`：JWT 过期时间（秒），默认 `3600`
- `ADMIN_USERNAME`：管理员用户名，默认 `admin`
- `ADMIN_PASSWORD`：管理员密码，默认 `admin`
- `ADMIN_EMAIL`：管理员邮箱，默认 `admin@example.com`
- `UPLOAD_DIR`：上传根目录，默认 `backend/app/static/uploads`

> 后端启动时会自动：创建数据表、初始化或更新管理员账号为当前配置（用户名与密码）。

## 启动与联动
- 启动后端（默认端口 `8000`）：
  - `python -m uvicorn backend.app.main:app --reload --port 8000`
- 启动前端（默认端口 `5173`，运行时可能调整）：
  - `npm run dev`
- 前端 API 地址：`src/services/api.ts` 中默认读取 `VITE_API_URL`，未设置时使用 `http://localhost:8000`
  - 如需自定义，在前端根目录创建 `.env`：`VITE_API_URL=http://localhost:8000`

## 权限与认证
- 登录接口返回 JWT（Bearer Token），前端保存到 `localStorage` 并自动注入到后续请求头 `Authorization: Bearer <token>`。
- 管理员账号：默认 `admin / admin`（可通过 `.env` 修改）。
- 管理端接口均要求管理员登录；普通浏览接口无需登录。
- 受保护文章内容需额外使用文章访问令牌（详见“文章内容访问”）。

---

## 接口总览
后端根路径：`http://localhost:8000`

### 1) 认证 Auth
- `POST /api/auth/login`
  - 描述：用户名密码登录，返回 JWT
  - 请求体：`{ "username": string, "password": string }`
  - 响应：`{ "access_token": string, "token_type": "bearer", "expires_in": number }`
- `GET /api/auth/me`
  - 描述：获取当前登录用户信息（需携带 `Authorization: Bearer <jwt>`）
  - 响应：`{ id, username, email, avatar_url, created_at, is_admin }`

### 2) 文章 Posts
- `GET /api/posts`
  - 描述：分页查询文章，可按标签筛选
  - 参数：`page`(默认1), `limit`(默认10), `tag`(可选标签 slug)
  - 响应：`{ items: PostOut[], total: number }`
  - `PostOut`：`{ id, title, summary, is_published, is_protected }`
- `POST /api/posts`（管理员）
  - 描述：创建文章（不含内容）
  - 请求体：`PostCreate`
    - `{ title, summary?, category_id?, is_published=true, is_protected=false, password?, tags?: string[] }`
  - 响应：`PostOut`
- `GET /api/posts/{post_id}`
  - 描述：获取文章基本信息
  - 响应：`PostOut | {}`
- `PUT /api/posts/{post_id}`（管理员）
  - 描述：更新文章基本信息
  - 请求体：`PostUpdate`
- `DELETE /api/posts/{post_id}`（管理员）
  - 描述：删除文章
  - 响应：`{ success: boolean }`
- `GET /api/posts/{post_id}/content`
  - 描述：读取文章内容（Markdown 转 HTML）
  - 受保护逻辑：若文章 `is_protected=true`，需在请求头携带 `Authorization: Bearer <post_access_token>`（并非 JWT）
  - 响应：`{ content: string }`（HTML）
- `POST /api/posts/{post_id}/access`
  - 描述：为受保护文章申请访问令牌
  - 请求体：`{ password: string }`
  - 响应：`{ post_access_token: string }`
- `POST /api/posts/{post_id}/markdown`（管理员）
  - 描述：通过文本上传 Markdown 内容并绑定到文章
  - 请求体：`{ content: string }`
  - 响应：`{ success: true }`
- `POST /api/posts/upload`（管理员）
  - 描述：表单上传 Markdown 文件并创建文章
  - 表单字段：`file`(必填), `title?`, `category_id?`, `is_published?`, `is_protected?`, `password?`, `tags?`(逗号分隔)
  - 响应：`{ id, path, md5 }`

### 3) 项目 Projects
- `GET /api/projects`：分页查询（`{ items: ProjectOut[], total }`）
- `POST /api/projects`（管理员）：创建项目，体为 `ProjectCreate`
- `GET /api/projects/{pid}`：详情，`ProjectOut | {}`
- `PUT /api/projects/{pid}`（管理员）：更新，体为 `ProjectUpdate`
- `DELETE /api/projects/{pid}`（管理员）：删除，`{ success }`
- `GET /api/projects/{pid}/content`：读取内容（Markdown→HTML）
- `POST /api/projects/{pid}/markdown`（管理员）：上传文本内容
- `POST /api/projects/upload`（管理员）：表单上传 Markdown 文件并创建项目

### 4) 生活随笔 Life Posts
- `GET /api/life-posts`：分页查询（`{ items: LifeOut[], total }`）
- `POST /api/life-posts`（管理员）：创建，体为 `LifeCreate`
- `GET /api/life-posts/{lid}`：详情，`LifeOut | {}`
- `PUT /api/life-posts/{lid}`（管理员）：更新，体为 `LifeUpdate`
- `DELETE /api/life-posts/{lid}`（管理员）：删除，`{ success }`
- `GET /api/life-posts/{lid}/content`：读取内容（Markdown→HTML）
- `POST /api/life-posts/{lid}/markdown`（管理员）：上传文本内容

### 5) 文件与工具 Files
- `POST /api/files/upload`（管理员）：上传任意文件，返回路径与 MD5
- `POST /api/files/upload-image`（管理员）：上传图片，返回路径与 MD5
- `POST /api/files/scan`：恶意检测模型推断（无需登录，二进制文件流）
  - 响应：`{ label, confidence }`

### 6) 设置 Settings
- `GET /api/settings`：获取公共设置（上传目录、模型路径）
- `PUT /api/admin/settings`（管理员）：更新系统设置（键值对），示例 `{ MALWARE_MODEL_PATH: "..." }`，响应 `{ success: true }`

### 7) 分类与标签 Categories & Tags
- `GET /api/categories`：返回 `{ id, name, slug }[]`
- `GET /api/tags`：返回 `{ id, name, slug, count }[]`
- `GET /api/tags/{slug}/posts`：标签下文章分页列表，返回 `{ items, total }`

---

## 示例（curl）
```bash
# 登录（管理员）
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# 查询文章列表
curl "http://localhost:8000/api/posts?page=1&limit=10"

# 管理员创建文章
curl -X POST http://localhost:8000/api/posts \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"title":"标题","summary":"摘要","is_published":true,"is_protected":false,"tags":["security","web"]}'

# 受保护文章：申请访问令牌
curl -X POST http://localhost:8000/api/posts/123/access \
  -H "Content-Type: application/json" \
  -d '{"password":"post-secret"}'

# 携带文章访问令牌读取内容
curl http://localhost:8000/api/posts/123/content \
  -H "Authorization: Bearer <post_access_token>"
```

---

## 常见问题
- 后台界面空白：请先登录管理员账号并确保前端 `Authorization` 已设置；接口 `/api/auth/me` 可用于校验。
- 更换数据库：修改 `.env` 中 `DATABASE_URL`，重启后端；首次启动会自动建表。
- 上传目录：默认 `backend/app/static/uploads`，可通过 `UPLOAD_DIR` 修改。

## 目录结构（关键）
- 后端接口：`backend/app/api/*`
- 配置与启动：`backend/app/core/config.py`、`backend/app/main.py`
- 数据库与模型：`backend/app/utils/database.py`、`backend/app/models/*`
- 前端服务：`frontend/src/services/api.ts`

> 如需扩展评论等功能，可在后端新增相应模型与接口，前端再接入。现有文档涵盖当前项目全部已实现接口。