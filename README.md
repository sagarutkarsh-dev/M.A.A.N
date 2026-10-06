# M.A.A.N. (मान)
### Metrological Assurance, Authentication & Network
*Smart India Hackathon 2026 | Team Tech Titans | National Institute of Technology Calicut*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20SSR-black.svg)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791.svg)](https://www.postgresql.org)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter%20%2B%20Hive-02569B.svg)](https://flutter.dev)
[![Status](https://img.shields.io/badge/Readiness-TRL--4-blue.svg)]()

---

## 📌 Executive Summary
**M.A.A.N.** is an automated regulatory operating system designed to digitize and enforce the **Legal Metrology Act, 2009** and the **Legal Metrology (General) Rules, 2011**. It bridges physical calibration with digital trust by eliminating manual field calculations, preventing scale-cloning fraud, and enabling zero-app citizen verification.

---

## ⚙️ Core Architecture & Statutory Engines

* **Algorithmic MPE Tolerance Engine:** Rule-Based MPE Engine: Implements the applicable statutory MPE and verification/inspection test procedures for supported instrument categories, including NAWI Classes I–IV, based on the relevant provisions of the Legal Metrology (General) Rules, 2011.
  Automatically evaluates test loads against true pre-rounding error ($P = I + 0.5e - \Delta L$) and applies the statutory $2\times \text{MPE}$ multiplier for field inspections.
* **Rule 27 Lifecycle State Machine (FSM):** Rule 27 Lifecycle Engine: Automatically determines the applicable reverification interval based on instrument category and applicable statutory/state rules, with support for Rule 27 re-verification triggers following dismantling or repair. Lifecycle Compliance Engine: Flags instruments requiring re-verification following applicable dismantling or repair events and prevents issuance/continued digital compliance status until the required verification is completed.
* **3-Layer Anti-Fraud Hardware Binding:** Helps detect instrument identity mismatches and potential scale-cloning fraud:
  1. *Physical Foil Hologram Sticker ID* (`HOLO-992`)
  2. *Machine-Engraved Metal Chassis Serial* (via on-device Google ML Kit OCR)
  3. *Internal Digital EEPROM Calibration Counter Sync*
* **Zero-Downtime "Day-Forward" Migration:** Resolves the historical paper backlog by migrating active instruments on-demand during routine renewal cycles (`PORTAL_NEW` vs `LEGACY_MIGRATED`).

---

## 🛠️ Technology Stack
* **Frontend:** Next.js 14 App Router + Pure Tailwind CSS (Server-Side Rendered for sub-second mobile loads on 2G/3G networks)
* **Inspector App:** Flutter (Dart) + Hive / SQLite (Offline-first native mobile client with Google ML Kit OCR)
* **Backend:** FastAPI (Python 3.11) + Celery & Redis (00:00 midnight cron workers & reconciliation)
* **Database:** PostgreSQL 16 + PostGIS extension (ACID-compliant Eleventh Schedule ledgers)
* **Integrations:** Bharatkosh / e-GRAS (Treasury webhooks), DigiLocker Push URI API, WhatsApp Cloud API
* **Cloud Infrastructure:** Dockerized microservices engineered for GI Cloud (MeghRaj NIC Cloud)

---

## 📂 Repository Structure
```text 
M.A.A.N/
├── frontend/      # Next.js 14 Web (Public QR View, Trader Portal, Admin Console)
├── backend/       # FastAPI Core (MPE Engine, Rule 27 FSM, Dynamic Billing)
├── mobile-lmo/    # Flutter Offline-First Field Inspection Client
└── docs/          # Statutory Schemas, Database DDLs & Rule Specifications---
*Developed by Team Tech Titans (NIT Calicut) for SIH 2026.*
```
