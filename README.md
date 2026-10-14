# CivicPulse AI — The City That Listens and Acts

> **"See the issue. Understand the impact. Drive the action."**

CivicPulse AI is an AI-powered civic intelligence and municipal operations platform designed for Indian cities and towns (demonstrated on **Nagpur, Maharashtra**). It transforms unstructured citizen reports into actionable, transparent community intelligence using geospatial mapping, AI triage, automated duplicate detection, predictive analytics, and end-to-end municipal workflow tracking.

---

## ⚡ Quick Start (Zero Setup Needed)

**Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).**

```
civicpulse-ai/
├── index.html       <-- Double-click or open directly in your browser
├── css/
│   └── styles.css   <-- Complete design system (light/dark mode, cards, badges)
├── js/
│   ├── data.js      <-- Seed dataset (45 Nagpur civic issues, AppState, AI engine)
│   └── app.js       <-- Full application engine & interactive workflows
└── README.md
```

- **No Node.js or npm required**: All dependencies (Leaflet.js maps, Chart.js analytics) are loaded via high-speed CDNs.
- **Offline & Local-Ready**: All seed records, calculations, officer state, and activity logs persist in `localStorage`.
- **Reset Demo Anytime**: One-click "Reset Demo Data" button in the top navigation restores the original state with 45 seeded issues.

---

## 🎯 Key Application Modules

### 1. Live City Intelligence Dashboard
- **Citywide KPI Metrics**: Total reports, open issues, resolved issues, critical public hazards, and average resolution time in days.
- **Interactive Geospatial Map**: Centered on Nagpur with category-coded circle markers for 8 civic issue types (potholes, garbage, water leaks, streetlights, industrial pollution, open manholes/hazards, encroachments, drainage).
- **Dynamic Category Filtering**: Live chip filters above the map isolate specific infrastructure concerns.
- **Data Analytics Visualizations**:
  - 30-day incident trend timeline (Chart.js line chart).
  - Issue distribution by category (doughnut chart).
  - Cross-ward volume comparison across top 8 neighborhoods (stacked bar chart).
  - Municipal resolution status pipeline.
- **Live Activity Feed**: Real-time event stream showing recent citizen reports, officer status transitions, and community upvotes.

### 2. AI-Powered Issue Reporting
- **5-Step Assisted Reporting Flow**:
  1. **Evidence Upload**: Drag-and-drop or select sample demo photos (potholes, overflowing garbage, pipe bursts).
  2. **Description & Voice**: Textarea with character counter and a simulated bilingual (Hindi/English) voice transcription button.
  3. **Location & Ward Selection**: Ward/neighborhood dropdown with one-click GPS coordinate simulation.
  4. **AI Triage & Duplicate Detection**:
     - Classifies the civic issue category.
     - Generates concise incident title and public-safety summary.
     - Estimates severity (Critical, High, Medium, Low) with clear rationale.
     - Identifies immediate hazards (e.g. two-wheeler skid danger, open manhole falls).
     - Assigns the responsible municipal department (e.g. Roads & Infrastructure, Water Supply, Drainage & Sewage).
     - Detects existing duplicate reports using Jaccard text similarity and geospatial proximity.
     - Allows citizens to **"Upvote Instead of Duplicating"** to consolidate community demand.
     - Generates confidence score and enforces officer human review for critical hazards.
  5. **Submission & Tracking**: Issues an instant tracking reference ID (e.g. `RPT-046`).

### 3. Community Issue Explorer
- Comprehensive directory of all 45+ seeded civic reports across 15 wards.
- Full-text search by title, description, ward name, or reference ID.
- Multi-dimensional filters (Category, Severity, Status, Sorting by Priority Score, Newest, or Upvotes).
- Grid vs. List display toggle.
- Interactive upvoting with live counter increments and priority score recalculation.
- Detailed issue modal showing incident background, AI rationale, and complete historical audit timeline.

### 4. Municipal Action Center (Officer Workspace)
- Dedicated municipal official workspace with simulated officer credentials.
- **Priority Action Queue**: Sorted by calculated urgency score (0–100) combining severity, safety hazard, days open, and citizen upvotes.
- **Overdue Filter**: Instant filter for reports open for more than 7 days.
- **Complete Workflow Progression**:
  - `Reported` ➔ `Verified` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`
- **Department Re-assignment**: Re-route issues between 8 specialized municipal departments.
- **Officer Notes & Audit Trail**: Add progress notes and dispatch timestamps.
- **Human Verification Checkpoint**: Mandates officer confirmation before closing AI-flagged critical hazard issues.
- **Resolution Evidence**: Records concrete repair evidence before marking issues as resolved.

### 5. Predictive Community Insights
- **Hazard Hotspots & Pattern Detection**:
  - *Civil Lines*: Recurring road subbase failures near the district hospital.
  - *Wardhaman Nagar*: Chronic drainage underpass flooding across consecutive monsoons.
  - *Kamptee Road*: Industrial smoke emission cluster near residential school bus stops.
  - *Itwari*: Aging pedestrian lane infrastructure and missing manhole covers.
  - *Monsoon Pre-Alert*: Multi-ward stormwater blockage forecast identifying pre-monsoon desilting priorities.
- Trend direction badges, confidence ratings, and municipal intervention recommendations.
- Cross-ward risk comparison scorecard across all 15 sectors.

### 6. Impact & Accountability Center
- Real-time resolution metrics and median resolution time tracking (down from 12.4-day baseline).
- **Before vs. After Comparative Scorecard**: Contrasts traditional paper/call-center processes against CivicPulse AI.
- **Quantified Environmental Metric**: Estimated clean water conserved from repaired main leakages (displayed with transparent formula: *Resolved Leaks × 500L standard leak prevention index*).
- Case highlights of verified and closed civic repairs.

---

## 🏆 Acceptance Test Demonstration Script

To demonstrate the full end-to-end workflow during a live presentation:

1. **Start on the Dashboard**: Point out the live Nagpur map with 45 seeded incidents, the category breakdown, and the citywide stats.
2. **Submit a New Hazard Report**:
   - Navigate to **"Report Issue"**.
   - Step 1: Click the **"🚧 Pothole Demo"** button.
   - Step 2: Click **"🎙️ Simulate Voice Report"** to show multilingual voice transcription.
   - Step 3: Select **"Civil Lines"** and click **"📍 Auto-Detect GPS"**.
   - Step 4: Click **"Analyze with Civic AI"** — show the automated severity estimation, the department routing, and the duplicate detection matching existing Civil Lines pothole reports.
   - Step 5: Click **"Confirm & Submit"** to generate a new incident reference ID.
3. **Inspect in Action Center**:
   - Go to **"Action Center"**.
   - Note the newly submitted report at the top of the **Priority Queue**.
   - Click **"Take Action"**.
   - Advance status from `Reported` ➔ `Verified` ➔ `In Progress` ➔ `Resolved`.
   - Check the **"Human Verification Required"** box and add a resolution note (e.g., *"Patching completed by Ward 4 road crew"*).
   - Click **"Save Changes"**.
4. **Observe Platform-Wide Impact**:
   - Return to **Dashboard**: Notice the resolved count increased, open count decreased, and a new resolution event appeared in the live activity stream.
   - Open **Predictive Insights**: Show how Civil Lines is highlighted as an infrastructure hotspot requiring structural resurfacing.

---

## 🛡️ Responsible AI & Privacy Principles

- **No Autonomous Irreversible Decisions**: AI provides suggestions, severity ratings, and department routing; municipal officers retain human-in-the-loop authority.
- **Privacy First**: Citizen identity is anonymized on public issue cards; no phone numbers or personal identifiers are stored.
- **Transparent Priority Model**: Priority scores are calculated deterministically from documented risk factors, not opaque black-box thresholds.
- **Honest Demonstrations**: All demo records are clearly watermarked as simulated demonstration data.

---

*CivicPulse AI — Built for the Next Generation of Smart, Accountable Indian Cities.*
