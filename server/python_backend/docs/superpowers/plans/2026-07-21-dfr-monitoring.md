# DFR Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sidebar menu named `DFR` for monitoring DFR memory and storage from the uploaded IP list.

**Architecture:** Keep DFR monitoring isolated from Annunciator polling. Load DFR device metadata from `dfr_devices.json`, poll each device's `diagreport.cgi?now=0` endpoint at a slow interval, parse RAM/storage XML into app state, expose it via `/api/dfr`, and render a dedicated dashboard page.

**Tech Stack:** FastAPI backend in `api.py`, React dashboard in `dashboard-ui/src/App.jsx`, CSS in `dashboard-ui/src/index.css`, JSON config file for DFR list.

## Global Constraints

- Sidebar label is exactly `DFR`.
- Page content focuses on DFR memory and storage monitoring.
- Offline/unreachable devices must remain visible as offline cards/rows.
- Do not change existing Annunciator, PQM, WAHA, Telegram, Kapasitor, AVR, AR behavior except for shared menu/dashboard integration.
- Use `http://<ip>/cgi-bin/diagreport.cgi?now=0` for Qualitrol-style diagnostic data.
- First release should be extensible for future DFR features.

---

### Task 1: DFR Diagnostic Parser

**Files:**
- Create: `test_dfr_diagnostic_parser.py`
- Modify: `api.py`

**Interfaces:**
- Produces: `parse_dfr_diagnostic_report(xml_text: str) -> dict`

- [ ] Write a failing parser test for RAM and non-volatile storage.
- [ ] Run the test and verify it fails because the parser does not exist.
- [ ] Implement the parser.
- [ ] Run the test and verify it passes.

### Task 2: DFR Backend State And API

**Files:**
- Create: `dfr_devices.json`
- Modify: `api.py`
- Modify: `BUAT-PAKET-UPDATE-VOLTKRAFT.ps1`

**Interfaces:**
- Produces: `/api/dfr`
- Produces: background worker `dfr-polling`

- [ ] Add DFR config loader and default polling thresholds.
- [ ] Poll diagnostic endpoint per IP with timeout and offline handling.
- [ ] Add summary/status payload for the dashboard.
- [ ] Include `dfr_devices.json` in update packages.

### Task 3: DFR Dashboard Menu

**Files:**
- Modify: `dashboard-ui/src/App.jsx`
- Modify: `dashboard-ui/src/index.css`

**Interfaces:**
- Consumes: `/api/dfr`

- [ ] Add `DFR` sidebar menu item.
- [ ] Fetch `/api/dfr` with the existing authenticated polling loop.
- [ ] Render summary cards, search/filter, and DFR cards with RAM/storage bars.
- [ ] Keep layout responsive and consistent with current dashboard style.

### Task 4: Notes, Validation, Package

**Files:**
- Modify: `CATATAN_COPY_UPDATE_SERVER_VOLTKRAFT.txt`

- [ ] Record changed files and production update notes.
- [ ] Run Python syntax checks and parser test.
- [ ] Build dashboard or package using existing update script.
- [ ] Report package path and verification results.
