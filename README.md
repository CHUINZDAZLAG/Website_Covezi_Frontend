# 📋 Trello Clone - Frontend

## 📖 Mô tả dự án (What & Why)

**Trello Clone** là một ứng dụng quản lý công việc theo mô hình Kanban board, được xây dựng để mô phỏng các tính năng cốt lõi của Trello. Dự án này được tạo ra nhằm mục đích:

- **What**: Một ứng dụng web quản lý dự án với giao diện kéo thả (drag & drop), cho phép người dùng tạo boards, lists, và cards để tổ chức công việc
- **Why**: Thực hành phát triển ứng dụng full-stack với các công nghệ hiện đại, áp dụng các best practices trong React và quản lý state

## ✨ Tính năng chính

- 🔐 **Xác thực người dùng**: Đăng ký, đăng nhập, xác minh tài khoản
- 📊 **Quản lý Board**: Tạo, chỉnh sửa, xóa các board dự án
- 📝 **Quản lý Lists & Cards**: Tạo danh sách công việc và thẻ nhiệm vụ
- 🖱️ **Drag & Drop**: Kéo thả cards giữa các lists một cách mượt mà
- 👥 **Cộng tác nhóm**: Mời thành viên, phân quyền truy cập
- 🔔 **Thông báo real-time**: Cập nhật tức thì với Socket.io
- 📱 **Responsive Design**: Tương thích với mọi thiết bị
- 🌙 **Theme switching**: Chuyển đổi giữa light/dark mode
- ⚙️ **Cài đặt tài khoản**: Quản lý thông tin cá nhân và bảo mật

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend Core
- ⚛️ **React 18** - Library xây dựng giao diện
- 🚀 **Vite** - Build tool và dev server
- 📦 **Redux Toolkit** - Quản lý state toàn cục
- 🧭 **React Router DOM** - Routing
- 💾 **Redux Persist** - Lưu trữ state bền vững

### UI/UX
- 🎨 **Material-UI (MUI)** - Component library
- 🖱️ **DND Kit** - Drag and drop functionality
- 📝 **React MD Editor** - Markdown editor
- 🎯 **React Hook Form** - Form validation
- 🍞 **React Toastify** - Toast notifications

### Utilities
- 🌐 **Axios** - HTTP client
- 🔌 **Socket.io Client** - Real-time communication
- 📅 **Moment.js** - Date manipulation
- 🎨 **Random Color** - Color generation
- 🧩 **Lodash** - Utility functions

## 🚀 Hướng dẫn cài đặt & chạy

### Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn
- Git

### Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/trander-25/Trello-Frontend.git
   cd Trello-Frontend
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình environment**
   ```bash
   # Tạo file .env.local và cấu hình các biến môi trường
   cp .env.example .env.local
   ```

4. **Chạy ứng dụng**
   ```bash
   # Development mode
   npm run dev
   # hoặc
   yarn dev
   ```

5. **Build cho production**
   ```bash
   npm run build
   # hoặc
   yarn build
   ```

### Scripts có sẵn
- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm run lint` - Kiểm tra code style với ESLint
- `npm run preview` - Preview bản build

## 📊 Trạng thái dự án

🚧 **Đang phát triển** - Dự án hiện tại đang trong giai đoạn hoàn thiện các tính năng cốt lõi

### Hoàn thành ✅
- Xác thực người dùng
- CRUD operations cho Boards, Lists, Cards
- Drag & Drop functionality
- Real-time notifications
- Responsive design
- Theme switching

### Đang phát triển 🔄
- Advanced collaboration features
- File attachments
- Advanced search & filtering
- Mobile app optimization

### Kế hoạch 📋
- Integration testing
- Performance optimization
- PWA features
- Advanced analytics

## 👨‍💻 Tác giả & Liên hệ

**Trander**
- GitHub: [@trander-25](https://github.com/trander-25)
- Email: [thevinh15925@gmail.com](mailto:thevinh15925@gmail.com)

---

📄 **License**: MIT License
⭐ Nếu dự án hữu ích, hãy cho một star nhé!