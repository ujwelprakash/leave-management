"# leave-management" 
# Leave Management Status Panel (MERN Stack)

A Leave Status Approval Panel built using **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
The system allows employees to apply for leave, and the request flows through a step-by-step approval chain:
**Employee → Team Lead → Project Lead → HR → CEO**.

---

## 🚀 Features
- Employee applies for leave.
- Step-by-step approval workflow.
- Approvers can **approve** or **reject** leave.
- Workflow visualization with colors:
  - ✅ Approved → Green
  - ⏳ Current (Pending) → Blue
  - 💤 Upcoming → Gray
  - ❌ Rejected → Red
- JWT-based authentication.
- Role-based dashboard (Employee sees Apply Leave, Approvers see Leave List).
- Instant UI updates after approval/rejection.

---

## 🗂️ Folder Structure
leave-management/
│
├── backend/
│ ├── models/ # Mongoose models (User, LeaveRequest)
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic for auth & leave
│ ├── middleware/ # Auth (JWT) middleware
│ ├── server.js # Express app entry point
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── context/ authcontext
│ │ ├── components/ # React components (Navbar, ProtectedRoute, etc.)
│ │ ├── pages/ # Pages (Login, LeavesList, ApplyLeave, LeaveDetails)
│ │ ├── api/ # Axios setup
│ │ └── App.js
│ ├── package.json
│ └── vite.config.js
│
├── README.md
└── .gitignore

---

## ⚙️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/ujwelprakash/leave-management.git
cd leave-management
cd backend
npm install
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
npm run dev
cd ../frontend
npm install
npm run dev
🔑 API Endpoints
Auth

POST /api/auth/register → Register new user

POST /api/auth/login → Login user

GET /api/auth/me → Get logged-in user

Leaves

POST /api/leaves → Apply for leave (Employee)

GET /api/leaves/:id → Get leave details

PUT /api/leaves/:id/approve → Approve leave (current approver only)

PUT /api/leaves/:id/reject → Reject leave

📋 Workflow

Employee applies for leave → request stored in MongoDB.

Leave moves through workflow: Team Lead → Project Lead → HR → CEO.

Each approver can approve/reject only at their stage.

Rejection at any stage → leave marked as Rejected.


