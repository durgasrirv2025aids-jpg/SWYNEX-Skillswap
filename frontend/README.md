# SkillSwap Frontend

A complete, premium-quality React.js frontend for the **SkillSwap** Student Skill Exchange Platform, integrated with the existing Spring Boot backend.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Spring Boot backend running on `http://localhost:8080`

### Installation & Run

```bash
cd frontend
npm install
npm run dev
```

The app will start at **http://localhost:5173**

### Production Build

```bash
npm run build
```

---

## 🔗 Backend API Integration

The frontend connects to your Spring Boot backend at `http://localhost:8080`.

**CORS:** The backend already allows `http://localhost:5173` — no changes needed.

**Authentication:** Uses JWT Bearer tokens (stored in `localStorage`). All authenticated requests include `Authorization: Bearer <token>`. 401 responses automatically redirect to `/login`.

---

## 📄 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Public hero, features, how-it-works |
| `/register` | Register | Student registration |
| `/login` | Login | Email/password login |
| `/dashboard` | Dashboard | Stats, quick actions, skill summary |
| `/profile` | My Profile | View/edit profile |
| `/skills` | My Skills | Add/remove teaching & learning skills |
| `/find-partners` | Find Partners | Matching students (uses `/api/matches`) |
| `/sent-requests` | Sent Requests | Track outgoing exchange requests |
| `/received-requests` | Received Requests | Accept/reject incoming requests |
| `/connections` | Connections | Accepted skill exchange connections |
| `/notifications` | Notifications | View and mark backend notifications as read |
| `/settings` | Settings | Account settings & logout |
| `/students/:id` | Student Profile | Public profile view |

---

## ✅ Feature Checklist

- [x] Beautiful landing page
- [x] Student registration with validation
- [x] JWT login with token storage
- [x] Professional dashboard with real stats
- [x] View & edit student profile
- [x] Add/remove teaching skills (TEACH)
- [x] Add/remove learning skills (LEARN)
- [x] Find matching partners (backend `/api/matches`)
- [x] Send exchange requests with optional message
- [x] View & cancel sent requests
- [x] Search and filter sent requests by status
- [x] Accept / reject received requests
- [x] Track accepted connections
- [x] Search & filter connections
- [x] View backend notifications and mark them as read
- [x] View any student's public profile
- [x] Toast notifications & confirm dialogs
- [x] Responsive design (mobile + desktop)
- [x] Protected routes + auto-redirect on 401
- [x] Loading states and skeleton screens

## Multi-user workflow test

Create each test account through the registration page, then sign in and add the listed skills through **My Skills**. No users are seeded automatically.

| Test student | Can teach | Wants to learn |
| --- | --- | --- |
| A | Java, HTML | Python, React |
| B | Python, React | Java, HTML |
| C | React, SQL | HTML |
| D | Python, HTML | Java, React |
| E | Python, CSS | Java, HTML |

Use separate browser profiles or incognito windows so each session has its own login token.

1. Sign in as A and verify B, D, and E appear as reciprocal matches. A should not appear in A's own results.
2. Send A-to-B and A-to-D requests. Check **Sent Requests** in A's browser and **Received Requests** in B's and D's browsers.
3. Accept A's request as B. Confirm A and B both appear in the other's **My Connections** after refreshing or signing in again.
4. Reject A's request as D. Confirm it changes to **Rejected** in A's sent list and does not create a connection.
5. Accept A's request as E and verify A has multiple connections without changing the rejected request to D.
6. Confirm C and D can also match. Try sending a second request to the same student while one is pending; the backend should reject the duplicate.

A match requires reciprocal skills in both directions, and existing connections are omitted from partner discovery. A successful but empty match response means no unconnected student currently satisfies both skill directions and active filters. API failures are displayed separately from the empty state.
