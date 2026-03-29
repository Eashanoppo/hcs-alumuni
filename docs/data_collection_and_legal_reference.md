# HCS Alumni Portal — Data Collection & Legal Reference
> **Purpose:** This document is a full technical audit of every piece of user data collected by the platform, how it flows, where it is stored, and what a user needs to know before using the platform. It is the primary reference for writing the **Privacy Policy** and **Terms of Service** pages.

---

## 1. Platform Overview

The **Holy Crescent School (HCS) Alumni Portal** is a Next.js web application built for the **Rajat Jayanti Utsab 2026** (Silver Jubilee Festival). It allows former students to:
- Register as alumni (5-step form)
- Submit payment for the event
- Log in and view/edit their alumni profile
- Browse a public directory and gallery
- Read notices and contact the organization

**Backend infrastructure:**
- **Database:** Supabase (PostgreSQL) — hosted cloud database
- **Image/File storage:** Cloudinary — third-party CDN
- **Authentication:** Custom cookie-based sessions (no OAuth)
- **Hosting:** Vercel (implied by Next.js deployment)

---

## 2. Data Collected From Users

### 2.1 Registration Form (5 Steps) — `/registration`

This is the primary data collection flow. All data is submitted to the `registrants` table in Supabase.

#### Step 1 — Personal Information (`Step1.tsx`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name (English) | Text | ✅ Yes | |
| Full Name (Bangla) | Text | No | |
| Father's Name | Text | ✅ Yes | |
| Mother's Name | Text | ✅ Yes | |
| Date of Birth | Day/Month/Year dropdowns | ✅ Yes | Stored as `D-MonthName-YYYY` (e.g. `15-March-1990`). **Used as password for login.** |
| Present Address | Textarea | ✅ Yes | |
| Permanent Address | Textarea | ✅ Yes | |
| Occupation | Text | ✅ Yes | |
| Workplace | Text | No | At least one of Workplace or Current Institution is required |
| Current/Last Institution | Text | No | |
| Profile Photo | Image file upload | No | Uploaded to **Cloudinary**, URL stored in DB |

#### Step 2 — Academic Information (`Step2.tsx`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Admission Year | Dropdown (1980–2026) | ✅ Yes | |
| Admission Class | Dropdown (Nursery–Class 9) | ✅ Yes | |
| Leaving Year | Dropdown (1980–2026) | ✅ Yes | |
| Leaving Class | Dropdown (KG–Class 10) | ✅ Yes | |
| Last Certificate | Dropdown (PESC / JSC / SSC) | ✅ Yes | |
| SSC Batch | Dropdown (2009–2026) | Conditional | Required only if certificate = SSC |
| School-life Photo | Image file upload | No | Optional memory photo, uploaded to **Cloudinary** |

#### Step 3 — Contact Information (`Step3.tsx`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Mobile Phone Number | Tel input | ✅ Yes | **Primary login credential.** Must be unique in DB. |
| Email Address | Email input | ✅ Yes | |
| WhatsApp Number | Tel input | No | |
| Facebook Profile URL | URL input | No | |
| Instagram Profile URL | URL input | No | |

#### Step 4 — Participation Information (`Step4.tsx`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Attending the event? | Radio (Yes/No/Probably) | ✅ Yes | |
| Spouse attending? | Toggle checkbox | Conditional | Only shown if attending = "Yes" |
| Number of children | Number input | Conditional | Only shown if attending = "Yes". Affects fee calculation. |
| T-shirt Size | Dropdown (S/M/L/XL/XXL) | ✅ Yes | |
| Willing to volunteer? | Radio (Yes/No) | ✅ Yes | |
| Special message/feedback | Textarea | No | Not explicitly stored in DB schema; UI field only |

#### Step 5 — Review & Submit (`Step5.tsx`)

- User reviews all data entered above
- Can update their profile photo one final time
- Submits all data to Supabase via `submitRegistrationCheckMobile()` server action
- System auto-generates an **Alumni Number** (`HCS-{year}-{4 random digits}`)
- On success → redirected to `/registration/payment`

---

### 2.2 Payment Form — `/registration/payment`

Data is inserted into the `payments` table in Supabase.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Payment Method | Button selection (bKash / Nagad) | ✅ Yes | Cash is also a valid DB value but not shown in UI |
| Sender's Mobile Number | Tel input | ✅ Yes | The number used to send the mobile money |
| Transaction ID (TrxID) | Text input | ✅ Yes | The transaction reference from bKash or Nagad |

**Fee structure (calculated automatically):**
- Alumni base fee: **BDT 700**
- Spouse fee: **BDT 300** (if spouse attending)
- Additional children fee: **BDT 200 per child** (first child is free)

---

### 2.3 Alumni Login — `/login/alumni`

No new data is *collected* here, but the following is *used for authentication*:

| Input | Used for |
|-------|----------|
| Mobile Number (or Alumni Number) | Lookup in `registrants` table |
| Date of Birth (Day/Month/Year) | Password / identity verification |

- A browser **cookie** (`alumni_session`) is set for 24 hours on successful login
- No password is stored — DOB acts as the sole authentication secret

---

### 2.4 Profile Edit — `/profile/edit`

Authenticated alumni can update the following fields. Sensitive fields are **locked**.

| Field | Editable? | Notes |
|-------|-----------|-------|
| Full Name (English) | ✅ Yes | |
| Full Name (Bangla) | ✅ Yes | |
| Profile Photo | ✅ Yes | Old photo is deleted from Cloudinary on save |
| Email | ✅ Yes | |
| Present Address | ✅ Yes | |
| Permanent Address | ✅ Yes | |
| Occupation | ✅ Yes | |
| Workplace | ✅ Yes | |
| Current Institution | ✅ Yes | |
| Event Attendance | ✅ Yes | |
| Volunteer Status | ✅ Yes | |
| **Mobile Number** | ❌ Locked | Cannot be changed after registration |
| **Date of Birth** | ❌ Locked | Used as authentication; cannot be changed |
| **Alumni Number** | ❌ Locked | System-assigned |
| **Registration/Payment Status** | ❌ Locked | Admin-only |

---

### 2.5 Contact Page — `/contact`

The contact form collects:
- Name
- Email
- Subject
- Message

> ⚠️ **Note:** As of the current code, this form has **no backend action attached**. The `<form>` element has no `onSubmit` handler and does not submit data to Supabase or any API. Data entered here is **not stored**. This should be flagged in the Privacy Policy as either "not collected" or implemented before launch.

---

## 3. Data Storage Architecture

### 3.1 Supabase Database Tables

| Table | What's stored |
|-------|---------------|
| `registrants` | All alumni personal, academic, contact, and participation data |
| `payments` | Payment transaction records linked to registrants |
| `notices` | Admin-published notices and announcements |
| `gallery` | Photo gallery entries |
| `visions` | "Our Vision" homepage cards (admin-managed) |
| `testimonials` | Alumni quotes for homepage (admin-managed) |
| `site_settings` | Global settings: contact info, WhatsApp number, etc. (JSONB) |

### 3.2 Cloudinary (Image CDN)

All images uploaded by users are sent directly from the browser to **Cloudinary** using an **unsigned upload preset** (`hcs_alumni_preset`). This includes:
- Profile photos (Step 1 & Step 5)
- School-life photos (Step 2)
- Profile edit photos

Cloudinary stores the image and returns a public URL (`secure_url`) that is then saved in Supabase. Images are publicly accessible via the Cloudinary CDN URL.

When a user updates their profile photo, the **old image is deleted** from Cloudinary via the Cloudinary Admin API (server-side).

---

## 4. Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| **Supabase** | Database hosting (PostgreSQL) | All structured user data |
| **Cloudinary** | Image hosting and delivery | All user-uploaded images |
| **bKash** | Mobile payment gateway (external) | Transaction processed outside this app |
| **Nagad** | Mobile payment gateway (external) | Transaction processed outside this app |
| **Vercel** | App hosting and deployment | Request logs, environment variables |

---

## 5. Authentication & Session Management

| User Type | Method | Session Token | Duration |
|-----------|--------|---------------|----------|
| Alumni | Mobile + DOB | Cookie: `alumni_session` | 24 hours |
| Admin | Username + Password | Cookie: `hcs_admin_session` | 24 hours |

- Alumni sessions are stored in a **client-readable browser cookie** (`document.cookie`)
- Admin sessions are stored in an **HTTP-only server cookie** (more secure)
- No token refresh mechanism; sessions expire after 24 hours

---

## 6. Data Visibility & Access Control

### Row-Level Security (RLS) in Supabase

| Table | Public Can Read | Public Can Insert | Admin Full Access |
|-------|----------------|------------------|-------------------|
| `registrants` | Only `APPROVED` records | ✅ Yes (registration) | ✅ Yes |
| `payments` | ❌ No | ✅ Yes (payment submission) | ✅ Yes |
| `notices` | ✅ Yes | ❌ No | ✅ Yes |
| `gallery` | ✅ Yes | ❌ No | ✅ Yes |
| `visions` | ✅ Yes | ❌ No | ✅ Yes |
| `testimonials` | ✅ Yes | ❌ No | ✅ Yes |
| `site_settings` | ✅ Yes | ❌ No | ✅ Yes |

### What's Publicly Visible in the Alumni Directory
Only **APPROVED** registrants appear in the public `/directory`. Visible fields include: name, batch/SSC batch, photo, occupation, workplace/institution.

---

## 7. What Users Must Know Before Using the Platform

This section is for drafting the Privacy Policy and Terms of Service disclosures.

### 7.1 Data Consent Points (Privacy Policy)

1. **Sensitive Personal Data is collected:** Full name, date of birth, father's/mother's name, present and permanent address, mobile number, email.
2. **Date of Birth is used as a password:** It is stored in plaintext in the database and used to authenticate login. Users should be made aware of this.
3. **Photos are uploaded to a third-party service (Cloudinary):** Images become publicly accessible via a CDN URL.
4. **A unique Alumni Number is auto-generated** and assigned to each registrant.
5. **Social media links are optional but stored:** Facebook and Instagram profile URLs, if provided, are stored in the database.
6. **Payment transaction data is retained:** Sender mobile number and transaction ID are stored even after payment is verified.
7. **Profile data is visible to other users** once approved by admin (in the alumni directory).
8. **Data is stored on Supabase servers**, which may be hosted outside Bangladesh (EU/US region depending on Supabase configuration).
9. **Cookies are set** for session management (24-hour expiry).
10. **No password recovery mechanism exists** — if a user forgets their DOB, there is a "forgot credentials" page at `/login/forgot-credentials` (implement accordingly).

### 7.2 Terms of Service Points

1. **Eligibility:** Only former students of Holy Crescent School are eligible to register.
2. **Accuracy:** Users must provide accurate, truthful information. False registration may result in rejection or removal.
3. **Uniqueness:** One registration per mobile number is enforced. Duplicate registrations will be rejected.
4. **Payment is non-refundable:** After payment is verified, fees (BDT 700 base + optional spouse/children fees) are non-refundable.
5. **Payment must include reference:** Users must include their email or mobile number in the bKash/Nagad payment reference.
6. **Admin Approval Required:** Registration is not confirmed until admin reviews and approves. Registration status can be: PENDING → PAID → APPROVED or REJECTED.
7. **Profile is publicly visible after approval:** Approved alumni profiles can be viewed by any visitor of the directory.
8. **Photos must be appropriate:** Users agree not to upload offensive, misleading, or copyrighted images.
9. **Social media links are optional and voluntary:** Providing them means they may be displayed on public profiles.
10. **Account cannot be transferred or shared.**
11. **Admin reserves the right to reject or remove** any registration at any time without prior notice.
12. **Mobile number cannot be changed** after registration. It is tied to the account permanently.
13. **The contact form** (currently non-functional) — if implemented, messages sent through it may be stored and reviewed by the organization.

---

## 8. Data Flows Summary Diagram

```
User Browser
    │
    ├─ [Registration Steps 1–5]
    │       │
    │       ├─ Images ─────────────► Cloudinary (CDN storage)
    │       │                             │
    │       │                          public URL
    │       │                             │
    │       └─ Form Data + photo_url ──► Supabase `registrants` table
    │
    ├─ [Payment Form]
    │       │
    │       └─ TrxID, sender number ──► Supabase `payments` table
    │
    ├─ [Login (/login/alumni)]
    │       │
    │       ├─ Mobile + DOB ─────────► Supabase (lookup query)
    │       └─ Session cookie set in browser (24h)
    │
    └─ [Profile Edit]
            │
            ├─ New photo ────────────► Cloudinary (upload new, delete old)
            └─ Updated fields ───────► Supabase `registrants` table (UPDATE)
```

---

## 9. Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key (client-side reads) |
| `NEXT_PUBLIC_SUPABASE_Service_Role_KEY` | Admin Supabase key (server-side writes/admin ops) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (client-side uploads) |
| `CLOUDINARY_API_KEY` | Cloudinary API key (server-side deletions) |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-side deletions) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name (`hcs_alumni_preset`) |
| `ADMIN_USERNAME` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password |

> ⚠️ **Security Note:** `NEXT_PUBLIC_SUPABASE_Service_Role_KEY` is prefixed with `NEXT_PUBLIC_`, which means it is exposed to the browser. This should be moved to a non-public env variable (`SUPABASE_SERVICE_ROLE_KEY`) and only accessed server-side. This is a security vulnerability that should be fixed before production.

---

*Document generated: 2026-03-29 | Based on full codebase audit of `c:\Work\hcs-alumuni`*
