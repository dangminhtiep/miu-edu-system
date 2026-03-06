# PROJECT MEMORY - MIU WEB

Cap nhat: 2026-03-07
Muc tieu: bo nho tong hop cho kien truc, pham vi san pham, va trang thai trien khai cua MIU Web.

## 1) Cach dung file nay
- Day la bo nho muc cao cho repo `miu-web`.
- Cac file chi tiet duoc tach rieng trong `app/docs/`.
- Quy tac cap nhat docs duoc luu tai `DOC_MAINTENANCE_PROTOCOL.md`.
- Quy uoc giao tiep nguoi-AI duoc luu tai `COLLABORATION_CONVENTIONS.md`.
- Quy uoc ky thuat lien phien duoc luu tai `ENGINEERING_STANDARDS.md`.

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
  - workspace chot `AI homework grading` ban dau
  - API route nop bai va cham bai ban dau
  - bo khung provider `gemini` va `mock`
- Chua co:
  - database
  - authentication
  - authorization
  - domain modules day du
  - content integration

## 5) Nguyen tac cho repo nay
- Khong duoc nham `demo UI (giao dien mau)` voi `implemented system behavior (hanh vi he thong da trien khai)`.
- Moi thay doi ve huong kien truc / module / role / data model phai duoc ghi lai trong docs.
- Moi thay doi ve chuan ky thuat code lien phien cung phai duoc ghi lai trong docs.
- Khong dua tri nho du an vao chat; repo docs moi la bo nho chuan.
- Cac rule nghiep vu co kha nang doi trong tuong lai nen duoc uu tien thiet ke theo huong `configuration-driven (dieu khien bang cau hinh)`, khong hard-code rai rac trong UI va route.
- He thong phai san sang cho mo rong tai va thay doi ha tang ve sau, ngay ca khi phase hien tai van trien khai gon nhe.
- Khong duoc `over-engineer (thiet ke qua tay)` den muc lam cham hoac lech muc tieu truoc mat.
- Moi quyet dinh ky thuat phai can bang giua:
  - `future-ready (san sang tuong lai)`
  - `current-phase focus (trong tam giai doan hien tai)`
- Uu tien truoc phai bam vao lat cat `AI homework grading` va cac nen tang that su can cho no.
- Khi tu van, can giai thich ro theo ngon ngu de hieu cho nguoi moi, khong mac dinh rang nguoi dung da biet thuat ngu.

## 6) Uu tien gan
- khoa bo nho ngoai cho repo nay
- chot lat cat van hanh dau tien la `AI homework grading (cham bai tap ve nha bang AI)`
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

## 9) Huong da chot cho lat cat dau tien
- Co the xay som `AI homework grading` truoc khi toan bo he thong role/auth/backend duoc khoa.
- Input uu tien dau tien la anh bai tap hoc sinh nop.
- De bai va rubric khong phai do hoc sinh nhap; giao vien se tao bai giao truoc.
- Gemini la nha cung cap AI dau tien duoc uu tien tich hop vi ket qua thu nghiem ban dau tot.
- Tuy nhien, kien truc phai `provider-agnostic`, khong de workflow lop nghiep vu phu thuoc truc tiep vao Gemini.
- He thong can tach rieng:
  - `homework domain`
  - `submission storage`
  - `AI provider adapter`
  - `grading result schema`
  - `future teacher override`
- Ket qua AI duoc xem la ket qua he thong sinh ra co kiem soat, khong phai su that bat bien.
- Can luu thong tin phuc vu truy vet va thay the provider sau nay:
  - model name
  - prompt version
  - confidence
  - recognized content
  - review flag
- Assignment can later include image or PDF attachments as the official prompt material.
- `LaTeX (ngon ngu danh may toan hoc)` conversion is not a current phase-1 priority.
- Kien truc da chot them huong:
  - `domain lifecycle (vong doi nghiep vu)` la phan on dinh
  - `policy/settings (chinh sach/cau hinh)` la phan co the bien doi
  - `infrastructure adapters (lop ket noi ha tang)` la phan co the thay the
- Student submission policy currently locked:
  - one normal submission only
  - late submission allowed but flagged
  - immediate AI result if no review flag
  - complaint path required for grading disputes
  - wrong submission recovery uses complaint plus one teacher unlock
- MIU feedback tone is now `MIU` + `ban`.
- Initial rubric locked:
  - `Phan tich va huong giai`
  - `Ky nang tinh toan`
  - `Trinh bay`
- Teacher must also store the official answer key so the student can compare after grading.
- Gemini output rules now locked:
  - structured output only
  - total score, praise, mistakes, improvement suggestions
  - respectful and encouraging MIU tone
  - confidence + review signaling when uncertain
## 10) Cac file can doc dau phien
1. `PROJECT_OVERVIEW.md`
2. `DECISIONS_LOG.md`
3. `MODULE_STATUS.md`
4. `OPEN_QUESTIONS.md`
5. `RISK_REGISTER.md`
6. `SESSION_HANDOFF.md`
7. `DOC_MAINTENANCE_PROTOCOL.md`
8. `COLLABORATION_CONVENTIONS.md`
