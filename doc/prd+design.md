# 🧾 HOLY CRESCENT SCHOOL — FINAL PRODUCT DEFINITION

## 🎯 PRODUCT TYPE

* **Portfolio Website (Primary Identity)**
* **Event Registration SaaS (Primary Goal Now)**

---

# 🎯 CORE GOALS (LOCKED)

1. ✅ Maximize registrations
2. ✅ Keep UI minimal, clean, institutional
3. ✅ Ensure fast performance (mobile-first)
4. ❌ No heavy system / no clutter
5. ❌ No unnecessary animation

---

# 🎨 DESIGN SYSTEM (STRICT)

## Visual Direction

* Style: **Minimal Modern + Formal Institutional**
* Feel: Clean, structured, respectful (not playful, not flashy)

---

## 🎨 Color System

| Purpose    | Color                         |
| ---------- | ----------------------------- |
| Background | #FAFAF7                       |
| Primary    | #1F3D2B (Deep Academic Green) |
| Accent     | #C8A96A (Soft Gold)           |
| Text       | #1A1A1A                       |
| Border     | #EAEAEA                       |

👉 No gradients overload
👉 No deep/dark UI
👉 No glassmorphism

---

## ✍️ Typography

* Bangla: **Noto Sans Bengali**
* English: **Inter**

Rules:

* No fancy fonts
* Large readable sizes
* Clear hierarchy

---

# 🌐 SITE STRUCTURE (PORTFOLIO)

```
/
├── Home
├── About
├── History
├── Teachers
├── Gallery
├── Notice
├── Contact
├── Registration  ⭐ CORE
```

---

# 🧠 LANGUAGE SYSTEM

* Default: **English**
* Toggle: **Top-right**
* Bangla optional

### Behavior

* Stored in localStorage
* Instant switch (no reload)

---

# 🤖 AI ASSISTANT (GEMINI FLASH 2.5 LITE)

## Purpose

* Help with registration
* Answer school + reunion queries

## Features

* Auto language detect (BN / Banglish / EN)
* Friendly tone
* Predefined prompts:

  * Registration help
  * Fee info
  * Batch help

## Placement

* Floating bottom-right button

---

# 🧾 CORE PAGE — `/registration`

---

## 🧱 STRUCTURE

```
Hero
↓
Register / Pay Toggle
↓
Multi-step Form
↓
AI Assistant
↓
Footer Note (legal)
```

---

## 🎯 HERO SECTION

![Image](https://images.openai.com/static-rsc-4/-xsUiQBpbEJu88EcYLZjE0OS-9-2PqUWjA_iWdfziR_ftHrT_8yL5v9tpP_ASBVnmn2ZHZEaXPCXeoPGWdXGZ5Rooh31yGwlr-flpXKSDb3zFgTCv2cH7XFb5yil5FM9AVB1XhCuIyhXH11OaJfDDgY-wtGyOKHfoaIJlbFKJl-eagGGl8KX7k2Z8RHhiLjf?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/82wMgN6Q_CEWy7qvaPR00nYEg8Lf1llEgi0SphVoyE5J-JrhQYFTCy1YjJJOKqo38DP51nWzadVl78PVybVKs08ZizDy4akyRIudK0SlnW6o3691mmIqqXpkVAL5T_ca4WX6E-wE936c2QEfrdvLyGesI03y5XGvppuQh1FxBb_eHSZFix1ysTj1LUy12ztg?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/urGvESF0Jcy9mb0H3mrigeV04K4_haQFSuAc1AtiIykBcThZ7L5dN8u2dqhoS5QUwBXWiua8cG6jFnvFrcn7n9hpIWpxQTCC-Xk4XLePfKdiRSq91TdV0upEc_o-dR5bk-KTUKrfgSCDXN3PoHiF1NSXcMkyiKDqmUINYOQuw-WBM4BFw1XS5vBKNA-99w51?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/tbF3VVyxq5qyEtAfd8YTwMs36GC654VkzbU9OBYlTvLuoB15UYr66Ht-Aptq-rNUrpPJlsu7WQJhojR41rWcJBSglPusgWrYSg3NJ50TKYUwaG2em4oU4QkZjgwYt4ecbszdljKbwJvRg64eoH2u6LnaFcoka0jUdcXQVt0otxAiOyEkwpEY_6ttmojQgdP2?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/rVxs581B-ZdsGxDjFI35qmHZwz71DRDIlSzp4zIYJQzWVrXbBApZR_lVNau5t7kBEiJ8ZiMtkUtMLJ1UUrhxRakOjHMWy5FgIcT_3qK6qzLSyyYLJvOkkRHATMFDDNQ0ovPA_5kDvmM61Pkq3Hcw6Fbbq5mDqItdeSzlCcEKN61t2Fb0CpXekiu6XsEtQq7i?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/XH61yDm_EOtRhIwmIWcZPKawQuJ1QmW_nRandcMWkyDUcVVQcfFM9PGUNEWZlEW2VEzaw9YSn_M07yoNJjKc260FNDacNwu9IXtnOUFEf_zxFihPyHRjIb3SRRRfepRn1gciB_QvaJv4KxDs3su-W6NT-fcPWTPDePGIc2fUPJkp8PKHzYfKzV0f-NvjQu7N?purpose=fullsize)

### Content (Bangla)

**Title:**
হলি ক্রিসেন্ট স্কুল, আশুলিয়া
রজত জয়ন্তী উৎসব

**Subtitle:**
ALUMNI রেজিষ্ট্রেশন ফর্ম

---

## 🔘 TOGGLE

```
[ Register ]   [ ফি প্রদান ]
```

---

# 🧾 REGISTRATION FORM (MULTI-STEP)

---

## STEP 1 — ব্যক্তিগত তথ্য

Fields:

* পূর্ণ নাম *
* পিতার নাম
* মাতার নাম
* জন্মতারিখ *
* স্থায়ী ঠিকানা
* বর্তমান ঠিকানা
* বর্তমান ছবি * (required)
* বর্তমান পেশা/পদবি *

---

## STEP 2 — একাডেমিক তথ্য

ভর্তি বছর*
কোন শ্রেণিতে ভর্তি হয়েছেন 
(drop down menu (nurseary,kg,1,2,3,4,5,6,7,8,9))*
স্কুল ছাড়ার বছর*
কোন শ্রেণীতে ছেড়েছেন
(Kg,1,2,3,4,5,6,7,8,9)
school থেকে প্রাপ্ত সর্বশেষ সার্টিফিকেট*
PESC(Class-5)
JSC(Class-8)
SSC
If user chooses ssc from drop down 
Then there will be option for ssc batch (2009-2026)

স্কুলে থাকাকালীন কোন ছবি যদি থাকে

### Conditional Logic

* SSC → batch (2009–2026)
* JSC → batch (2010–2019)

---

## STEP 3 — Contact

* Email
* Mobile *

---

## STEP 4 — Participation

* Attend *
* Volunteer *
* Message (optional)

---

## STEP 5 — Review

* Full summary
* Edit option

---

## ✅ VALIDATION RULES

* Phone UNIQUE
* Required fields strict
* Image required

---

## 🚨 ERROR CASES

* Duplicate phone → “Already Registered”
* Invalid data → inline error

---

## 📡 API

```
POST /api/register
```

---

## 🎉 SUCCESS

```
Registration Successful
→ Proceed to Payment
```

---

# 🔐 LOGIN (FOR PAYMENT)

```
/registration/login
```

Fields:

* Phone
* DOB

---

# 💳 PAYMENT PAGE

---

## 💰 PACKAGE LOGIC

* Alumni: 700
* Spouse: +300
* Kids: 1 free, extra 200 each

---

## OPTIONS

* Alumni Only
* With Spouse
* With Kids
* With Spouse & Kids

---

## 🧮 Calculation

* Real-time update
* Sticky price box

---

## 💳 INPUT

* Method: bkash / nagad
* TXID (editable later)
* Screenshot (optional)

---

## STATUS FLOW

| Status   | Meaning       |
| -------- | ------------- |
| Unpaid   | Not submitted |
| Pending  | Submitted     |
| Paid     | Approved      |
| Rejected | Wrong TXID    |

---

## API

```
POST /api/payment
```

---

# 👨‍💼 ADMIN PANEL

---

## 🔐 LOGIN

* Google OAuth 2.0
* Allowed email via `.env`

---

## 📍 ROUTE

```
/admin
```

---

## 📊 DASHBOARD

* Total registrations
* Paid
* Unpaid
* Pending

👉 Only numbers (no heavy charts)

---

## 📋 TABLE

Columns:

* Name
* Phone
* Batch
* Status

---

## 🔍 FILTERS

* SSC batch
* JSC batch
* Payment status

---

## ⚙️ ACTIONS

* View full details
* Approve payment
* Edit
* Delete

---

## 🖼️ IMAGE RULES

* Preview ✅
* Download ✅

---

# 🖼️ GALLERY SYSTEM

---

## ADMIN

* Upload images
* Categorize:

  * Campus
  * Events
  * Memories

---

## FRONTEND

* Clean grid
* Lightbox preview (minimal)

---

# 🧑‍🏫 TEACHERS PAGE

* Editable from admin
* Fields:

  * Name
  * Subject
  * Photo

---

# 📢 NOTICE PAGE

* Admin adds notices
* Sorted by date

---

# 📱 MOBILE UX

---

## PRIORITY: VERY HIGH

### Rules:

* Single column
* Big inputs
* Sticky bottom button:

```
[ Register ]
```

---

## WhatsApp Button

* Opens chat with provided number

---

# ⚡ PERFORMANCE STRATEGY

* Next.js 16 (App Router)
* Static pages where possible
* API routes for dynamic
* Image optimization
* Lazy load gallery

---

# 🧱 TECH STACK (CONFIRMED)

* Frontend: Next.js 16+
* Hosting: Vercel
* DB: Supabase
* Images: Cloudinary
* Auth: Google OAuth (admin only)
* AI: Gemini Flash 2.5 Lite

---

# 🔐 SECURITY

* Admin route protected
* API validation
* Rate limit (basic)

---

# ⚖️ LEGAL FOOTER (ONLY REGISTRATION)

```
হলি ক্রিসেন্ট স্কুল, আশুলিয়া
রজত জয়ন্তী উৎসব

স্বত্ব সংরক্ষিত @ সমির কুমার সরকার
অ্যালামনি উপকমিটি
মোবাইলঃ ০১৯১২৫৯১৪৯২

শর্তাবলি: প্রদত্ত সকল তথ্য সঠিক এবং স্কুল কর্তৃপক্ষ প্রয়োজনে যাচাই করতে পারে।
```

