# 📄 Software Requirements Specification (SRS): Next.js Blog System

## 1. Project Overview
ระบบเว็บไซต์ Blog ที่รองรับการจัดการเนื้อหาและการจัดการผู้ใช้งานแบบครบวงจร พัฒนาในรูปแบบ Full-stack application รองรับกระบวนการทำงานอัตโนมัติ (CI/CD) เพื่อความรวดเร็วในการส่งมอบซอฟต์แวร์

## 2. Technology Stack
*   **Frontend & Backend:** Next.js (App Router)
*   **Language:** TypeScript
*   **Database ORM:** Prisma (แนะนำ) หรือ Drizzle ORM
*   **Database:** PostgreSQL หรือ MySQL
*   **Authentication:** NextAuth.js หรือ JWT (JSON Web Token) สแครชเองผ่าน API Route
*   **CI/CD:** GitHub Actions / GitLab CI

---

## 3. Functional Requirements

### 3.1 Authentication System
*   **Register:** ผู้ใช้งานสามารถสมัครสมาชิกผ่านระบบโดยใช้ Email และ Password (ต้องมีการเข้ารหัส Password ก่อนบันทึก)
*   **Login:** ผู้ใช้งานสามารถเข้าสู่ระบบเพื่อรับ Authentication Token / Session
*   **Logout:** ผู้ใช้งานสามารถออกจากระบบเพื่อทำลาย Session หรือ Token ปัจจุบัน

### 3.2 User Management (CRUD API)
*   **Create User:** ระบบสามารถสร้างบัญชีผู้ใช้ใหม่ได้ (เชื่อมโยงกับ Register หรือให้ Admin เป็นผู้สร้าง)
*   **Read User:**
    *   ดูข้อมูล Profile ของตนเอง
    *   ดูรายชื่อผู้ใช้งานทั้งหมดในระบบ (สิทธิ์ Admin)
*   **Update User:** ผู้ใช้งานสามารถแก้ไขข้อมูลส่วนตัวของตนเองได้ (เช่น ชื่อ, รูปโปรไฟล์)
*   **Delete User:** ลบบัญชีผู้ใช้งานออกจากระบบ (Soft Delete หรือ Hard Delete ขึ้นอยู่กับ Policy)

### 3.3 Blog System (API)
*   **Create Blog:** ผู้ใช้งานที่เข้าสู่ระบบแล้วสามารถสร้างโพสต์บทความใหม่ได้ (ประกอบด้วย Title, Content, Author, Published Date)
*   **Read Blog:**
    *   ดึงรายการโพสต์ทั้งหมดมาแสดงผลที่หน้าแรก (รองรับ Pagination)
    *   ดึงรายละเอียดของโพสต์แต่ละบทความตาม ID หรือ Slug

---

## 4. API Endpoints Specification

| Feature | Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | สมัครสมาชิก | Public |
| **Auth** | POST | `/api/auth/login` | เข้าสู่ระบบ | Public |
| **Auth** | POST | `/api/auth/logout` | ออกจากระบบ | Bearer Token / Session |
| **User** | GET | `/api/users` | ดึงข้อมูลผู้ใช้ทั้งหมด | Admin |
| **User** | GET | `/api/users/[id]` | ดึงข้อมูลผู้ใช้ตาม ID | Bearer Token |
| **User** | PUT | `/api/users/[id]` | อัปเดตข้อมูลผู้ใช้ | Bearer Token |
| **User** | DELETE | `/api/users/[id]` | ลบข้อมูลผู้ใช้ | Admin / Owner |
| **Blog** | GET | `/api/blogs` | ดึงรายการ Blog ทั้งหมด | Public |
| **Blog** | GET | `/api/blogs/[id]` | ดึงข้อมูล Blog ตาม ID | Public |
| **Blog** | POST | `/api/blogs` | สร้าง Blog ใหม่ | Bearer Token |

---

## 5. Non-Functional Requirements & Architecture
*   **Architecture Pattern:** ออกแบบโครงสร้างโค้ดแบบ Clean Architecture / Layered Architecture ในส่วนของ API Route เพื่อแยก Service, Controller และ Repository ออกจากกันให้ง่ายต่อการดูแลรักษา
*   **Security:** ป้องกัน SQL Injection ด้วย ORM, ป้องกัน XSS ในฝั่งแสดงผล และเข้ารหัสรหัสผ่านด้วย bcrypt
*   **Quality Assurance & Testing:**
    *   **API Testing:** จัดเตรียม Test Script บน Postman สำหรับทดสอบ API Endpoints ทั้งหมด
    *   **Automated Testing:** รองรับการเขียน Automated UI/E2E Test ด้วย Robot Framework เพื่อทดสอบ Flow การทำงานหลัก (Register -> Login -> Create Blog)

---

## 6. CI/CD Pipeline (Continuous Integration / Continuous Deployment)



ระบบต้องมีการตั้งค่า Workflow ผ่าน CI/CD Tools (เช่น GitHub Actions) โดยมีขั้นตอนดังนี้:

**Stage 1: CI (Continuous Integration)**
1.  **Code Checkout:** ดึง Source Code ล่าสุด
2.  **Setup Environment:** ติดตั้ง Node.js และจัดการ Cache สำหรับ dependencies
3.  **Install Dependencies:** รันคำสั่ง `npm install`
4.  **Linting & Type Checking:** รัน `npm run lint` และ `tsc --noEmit` เพื่อตรวจสอบความถูกต้องของ TypeScript
5.  **Build:** รัน `npm run build` ของ Next.js เพื่อทดสอบว่าโปรเจกต์สามารถ Build ผ่านได้

**Stage 2: CD (Continuous Deployment)**
1.  **Deploy to Environment:** อัปโหลดและ Deploy Build Artifacts ขึ้นสู่ Server (เช่น Vercel, Docker Container, หรือ Cloud Provider อื่นๆ) ทันทีที่โค้ดถูก Merge เข้า Branch หลัก (เช่น `main` หรือ `production`)