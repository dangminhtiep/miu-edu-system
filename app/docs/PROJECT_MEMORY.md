# PROJECT MEMORY - MIU WEB

Cap nhat: 2026-03-06
Muc tieu: bo nho tong hop cho kien truc, pham vi san pham, va trang thai trien khai cua MIU Web.

## 1) Cach dung file nay
- Day la bo nho muc cao cho repo `miu-web`.
- Cac file chi tiet duoc tach rieng trong `app/docs/`.
- Quy tac cap nhat docs duoc luu tai `DOC_MAINTENANCE_PROTOCOL.md`.
- Quy uoc giao tiep nguoi-AI duoc luu tai `COLLABORATION_CONVENTIONS.md`.

## 2) Muc tieu cua MIU Web
- Lam giao dien van hanh cho he sinh thai MIU.
- Ve lau dai, he thong nay se phuc vu:
  - quan tri
  - giao vien
  - hoc sinh
  - van hanh trung tam
- Se can tich hop voi:
  - du lieu hoc sinh
  - du lieu lop hoc
  - du lieu hoc phi / van hanh
  - du lieu noi dung hoc tap tu `miu-bank`

Mo rong tu master doc:
- MIU Web duoc hieu nhu `web operating system (he thong van hanh tren web)` cho toan bo MIU EDU.
- Pham vi tam nhin dai han bao gom:
  - growth / sales funnel
  - academic operations
  - billing and finance
  - HR and teacher quality
  - branch and franchise control
  - intelligence layers nhu MPI

## 3) Giai doan hien tai
- Dang o pha dat nen tang `frontend (giao dien)` va `application structure (cau truc ung dung)`.
- Chua co backend that, chua co auth, chua co role model on dinh.
- Repo hien tai chu yeu la bo khung ky thuat + mot vai trang mau.
- Master doc hien tai duoc xem la `vision document (tai lieu tam nhin)`, chua phai `implementation spec (dac ta trien khai)`.
- Vi vay, cong viec truoc mat la tach y tuong thanh:
  - phase 1 bat buoc
  - phase sau
  - lop chien luoc dai han

## 4) Trang thai thuc te
- Da co:
  - root layout co sidebar
  - dashboard page
  - students page
  - mock API route cho students
- Chua co:
  - database
  - authentication
  - authorization
  - domain modules day du
  - content integration

## 5) Nguyen tac cho repo nay
- Khong duoc nham `demo UI (giao dien mau)` voi `implemented system behavior (hanh vi he thong da trien khai)`.
- Moi thay doi ve huong kien truc / module / role / data model phai duoc ghi lai trong docs.
- Khong dua tri nho du an vao chat; repo docs moi la bo nho chuan.

## 6) Uu tien gan
- khoa bo nho ngoai cho repo nay
- xac dinh module scope
- xac dinh role model
- xac dinh data architecture
- thay root page mac dinh bang trang chu co chu dich

## 7) 4 lop he thong de trien khai khong vo tran
- `Foundation OS (nen mong he thong van hanh)`
- `Operational Core (loi van hanh)`
- `Business Intelligence (tri tue kinh doanh)`
- `Strategic Intelligence (tri tue chien luoc)`

Trong do:
- phase 1 chi nen tap trung vao `Foundation OS` va mot phan `Operational Core`
- chua nen lao ngay vao MPI, talent radar, DRM nang cao, franchise intelligence
## 8) Uu tien phase 1 duoc de xuat
- auth
- RBAC
- student / parent / class / enrollment
- attendance
- homework workflow co ban
- mini-test co ban
- billing co ban
- notification co ban
- settings engine co ban
- audit log co ban

## 9) Cac file can doc dau phien
1. `PROJECT_OVERVIEW.md`
2. `DECISIONS_LOG.md`
3. `MODULE_STATUS.md`
4. `OPEN_QUESTIONS.md`
5. `RISK_REGISTER.md`
6. `SESSION_HANDOFF.md`
7. `DOC_MAINTENANCE_PROTOCOL.md`
8. `COLLABORATION_CONVENTIONS.md`
