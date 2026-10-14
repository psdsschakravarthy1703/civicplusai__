/**
 * CivicPulse AI — Application Engine
 * The City That Listens and Acts
 */

// Global State References & Helper Variables
window._civicMap = null;
window._activeCategoryFilter = "all";
window._explorerFilters = {
  search: "",
  category: "all",
  severity: "all",
  status: "all",
  neighborhood: "all",
  sort: "priority"
};
window._explorerViewMode = "grid"; // 'grid' | 'list'
window._reportState = {
  step: 1,
  image: null,
  imagePreview: null,
  description: "",
  category: "pothole",
  neighborhood: "Civil Lines",
  address: "",
  lat: 21.1521,
  lng: 79.0842,
  aiResult: null,
  duplicates: [],
  selectedDuplicateId: null
};
window._activeOfficerTab = "queue"; // 'queue' | 'all' | 'departments'
window._officerFilters = {
  overdueOnly: false,
  criticalOnly: false,
  status: "all",
  department: "all"
};

/* ==========================================================================
   UTILITY & UI HELPER FUNCTIONS
   ========================================================================== */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function timeAgo(isoString) {
  if (!isoString) return "Recently";
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}mo ago`;
}

function formatDate(isoString) {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 16px;">${iconMap[type] || "ℹ"}</span>
    <div style="flex: 1; font-size: 13px; line-height: 1.4;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function openModal(title, bodyHTML, footerHTML = "") {
  const overlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalFooter = document.getElementById("modal-footer");

  if (!overlay || !modalTitle || !modalBody) return;

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
  modalFooter.innerHTML = footerHTML;
  modalFooter.style.display = footerHTML ? "flex" : "none";

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderBadge(type, value) {
  if (type === "severity") {
    const sev = SEVERITY_LEVELS[value] || { label: value, color: "#6b7280" };
    return `<span class="badge badge-${value}">${sev.label}</span>`;
  }
  if (type === "status") {
    const st = STATUS_FLOW[value] || { label: value };
    return `<span class="badge badge-${value}">${st.label}</span>`;
  }
  if (type === "category") {
    const cat = CATEGORIES[value] || { label: value, icon: "📌" };
    return `<span class="badge" style="background: rgba(13,148,136,0.1); color: var(--teal); border: 1px solid rgba(13,148,136,0.2);">${cat.icon} ${cat.label}</span>`;
  }
  return `<span class="badge">${escapeHtml(value)}</span>`;
}

function toggleDarkMode() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("civicpulse_darkmode", next === "dark" ? "true" : "false");

  const darkIcon = document.getElementById("icon-dark");
  const lightIcon = document.getElementById("icon-light");
  if (darkIcon && lightIcon) {
    if (next === "dark") {
      darkIcon.classList.add("hidden");
      lightIcon.classList.remove("hidden");
    } else {
      darkIcon.classList.remove("hidden");
      lightIcon.classList.add("hidden");
    }
  }

  // Refresh charts if dashboard or insights is active
  if (AppState.currentView === "dashboard") {
    initDashboardCharts();
  }
}

function confirmResetDemo() {
  if (confirm("Reset all civic reports, officer notes, and metrics back to the original demo seed?")) {
    AppState.resetDemo();
    showToast("Demo dataset reset to initial state", "success");
    navigateTo(AppState.currentView || "dashboard");
  }
}

/* ==========================================================================
   NAVIGATION ROUTING
   ========================================================================== */

function navigateTo(view) {
  AppState.currentView = view;

  // Update tabs active class
  document.querySelectorAll(".nav-tab").forEach(tab => {
    if (tab.getAttribute("data-view") === view) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  const content = document.getElementById("app-content");
  if (!content) return;

  // Destroy map if leaving dashboard
  if (window._civicMap && view !== "dashboard") {
    window._civicMap.remove();
    window._civicMap = null;
  }

  window.scrollTo(0, 0);

  switch (view) {
    case "dashboard":
      showDashboard();
      break;
    case "report":
      showReportIssue();
      break;
    case "explorer":
      showCommunityExplorer();
      break;
    case "action-center":
      showMunicipalActionCenter();
      break;
    case "insights":
      showPredictiveInsights();
      break;
    case "impact":
      showImpactCenter();
      break;
    default:
      showDashboard();
  }
}

/* ==========================================================================
   SECTION 1: LIVE CITY INTELLIGENCE DASHBOARD
   ========================================================================== */

function showDashboard() {
  const content = document.getElementById("app-content");
  const stats = AppState.getStats();

  let html = `
    <!-- Top Notice Banner -->
    <div class="demo-notice">
      <span>🔔</span>
      <div style="flex: 1;">
        <strong>DEMO CITY INTELLIGENCE PLATFORM (NAGPUR)</strong> — Showing simulated civic reports, active AI triage, and real-time municipal response metrics. All data is demonstration only.
      </div>
      <button class="btn btn-sm btn-ghost" onclick="confirmResetDemo()" style="color: var(--amber); border-color: rgba(217,119,6,0.3);">
        Reset Demo
      </button>
    </div>

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" style="--accent-color: var(--teal);">
        <div class="stat-label">Total Reports</div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-change good">Across 15 wards</div>
        <div class="stat-icon">📊</div>
      </div>
      <div class="stat-card" style="--accent-color: #f97316;">
        <div class="stat-label">Active / Open Issues</div>
        <div class="stat-value">${stats.open}</div>
        <div class="stat-change up">${Math.round((stats.open / stats.total) * 100)}% pending action</div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-card" style="--accent-color: #16a34a;">
        <div class="stat-label">Resolved Issues</div>
        <div class="stat-value">${stats.resolved}</div>
        <div class="stat-change good">${Math.round((stats.resolved / stats.total) * 100)}% resolution rate</div>
        <div class="stat-icon">✅</div>
      </div>
      <div class="stat-card" style="--accent-color: #dc2626;">
        <div class="stat-label">Critical Hazards</div>
        <div class="stat-value" style="color: var(--color-critical);">${stats.critical}</div>
        <div class="stat-change up">Immediate priority</div>
        <div class="stat-icon">⚠️</div>
      </div>
      <div class="stat-card" style="--accent-color: #3b82f6;">
        <div class="stat-label">Avg Resolution Time</div>
        <div class="stat-value">${stats.avgResolution} <span style="font-size: 16px; font-weight: 500;">days</span></div>
        <div class="stat-change good">-18% from last month</div>
        <div class="stat-icon">⚡</div>
      </div>
    </div>

    <!-- Main Dashboard Two-Column Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Interactive Map & Controls -->
      <div class="dashboard-main">
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Live Geographic Incident Map — ${DEMO_CITY.name}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">
              Click any pin to inspect issue & actions
            </div>
          </div>

          <!-- Category filter buttons above map -->
          <div style="padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid var(--border); display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;">
            <button class="btn btn-sm ${window._activeCategoryFilter === 'all' ? 'btn-primary' : 'btn-ghost'}" onclick="filterMapCategory('all')">
              All Categories (${AppState.reports.length})
            </button>
            ${Object.keys(CATEGORIES).map(catKey => {
              const cat = CATEGORIES[catKey];
              const count = AppState.reports.filter(r => r.category === catKey).length;
              const isActive = window._activeCategoryFilter === catKey;
              return `
                <button class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}" onclick="filterMapCategory('${catKey}')" style="white-space: nowrap;">
                  ${cat.icon} ${cat.label.split('/')[0]} (${count})
                </button>
              `;
            }).join("")}
          </div>

          <div class="map-container" style="border: none; border-radius: 0;">
            <div id="city-map"></div>
          </div>

          <!-- Map Legend -->
          <div class="map-legend">
            <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Category Key:</span>
            ${Object.keys(CATEGORIES).map(k => `
              <div class="legend-item">
                <span class="legend-dot" style="background: ${CATEGORIES[k].color};"></span>
                <span>${CATEGORIES[k].icon} ${CATEGORIES[k].label.split('/')[0]}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- 30-Day Trend Chart -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>30-Day Report Volume Trend</span>
              </div>
            </div>
            <div class="card-body">
              <div class="chart-canvas-wrapper">
                <canvas id="chart-trend"></canvas>
              </div>
            </div>
          </div>

          <!-- Category Distribution -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10h-10z"/></svg>
                <span>Issues by Category</span>
              </div>
            </div>
            <div class="card-body">
              <div class="chart-canvas-wrapper">
                <canvas id="chart-category"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Neighborhood Comparison Chart -->
        <div class="card" style="margin-top: 16px;">
          <div class="card-header">
            <div class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              <span>Wards & Neighborhood Activity Comparison (Top 8)</span>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-canvas-wrapper" style="height: 260px;">
              <canvas id="chart-neighborhood"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Sidebar (Activity Feed + Quick Actions) -->
      <div class="dashboard-sidebar">
        <!-- Quick Action Card -->
        <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(15,23,42,0.02) 100%); border-color: rgba(13,148,136,0.3);">
          <div class="card-body" style="text-align: center; padding: 22px 18px;">
            <div style="font-size: 32px; margin-bottom: 8px;">📢</div>
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">Spot a Civic Problem?</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
              Report potholes, waste heaps, water leaks or streetlight failures with instant AI severity triage.
            </p>
            <button class="btn btn-primary" onclick="navigateTo('report')" style="width: 100%; justify-content: center;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7h14"/></svg>
              Report an Issue Now
            </button>
          </div>
        </div>

        <!-- Live Activity Feed -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Live Activity Stream</span>
            </div>
            <span class="badge badge-demo">Simulated</span>
          </div>
          <div class="card-body" style="padding: 12px 16px;">
            <div class="activity-feed">
              ${AppState.activity.slice(0, 7).map(item => `
                <div class="activity-item" style="cursor: pointer;" onclick="openIssueDetailModal('${item.reportId}')">
                  <div class="activity-dot ${item.type}"></div>
                  <div class="activity-content">
                    <div class="activity-text">${escapeHtml(item.text)}</div>
                    <div class="activity-time">${timeAgo(item.time)}</div>
                  </div>
                </div>
              `).join("")}
            </div>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('explorer')" style="width: 100%; margin-top: 12px; justify-content: center;">
              View All Reports in Explorer →
            </button>
          </div>
        </div>

        <!-- Status Breakdown Widget -->
        <div class="card" style="margin-top: 20px;">
          <div class="card-header">
            <div class="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Resolution Pipeline</span>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-canvas-wrapper" style="height: 180px;">
              <canvas id="chart-status"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  content.innerHTML = html;

  // Initialize Map & Charts after DOM is ready
  setTimeout(() => {
    initMap();
    initDashboardCharts();
  }, 50);
}

function initMap() {
  const mapEl = document.getElementById("city-map");
  if (!mapEl || typeof L === "undefined") return;

  if (window._civicMap) {
    try {
      window._civicMap.remove();
    } catch (e) {
      console.warn("Map remove error", e);
    }
    window._civicMap = null;
  }

  // Centered on Nagpur
  window._civicMap = L.map("city-map", {
    center: DEMO_CITY.center,
    zoom: DEMO_CITY.zoom,
    scrollWheelZoom: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(window._civicMap);

  renderMapMarkers();
}

function renderMapMarkers() {
  if (!window._civicMap) return;

  // Clear existing marker layers
  if (window._markerGroup) {
    window._civicMap.removeLayer(window._markerGroup);
  }
  window._markerGroup = L.layerGroup().addTo(window._civicMap);

  const filter = window._activeCategoryFilter || "all";
  const reportsToDisplay = filter === "all"
    ? AppState.reports
    : AppState.reports.filter(r => r.category === filter);

  reportsToDisplay.forEach(report => {
    const cat = CATEGORIES[report.category] || { color: "#3b82f6", icon: "📌", label: "Issue" };
    const marker = L.circleMarker([report.location.lat, report.location.lng], {
      radius: report.severity === "critical" ? 11 : 8,
      fillColor: cat.color,
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    });

    const popupHtml = `
      <div style="font-family: inherit; font-size: 13px; max-width: 240px; padding: 4px;">
        <div style="display: flex; gap: 4px; margin-bottom: 6px;">
          ${renderBadge("severity", report.severity)}
          ${renderBadge("status", report.status)}
        </div>
        <div style="font-weight: 700; margin-bottom: 4px; color: #0f172a; line-height: 1.3;">
          ${escapeHtml(report.title)}
        </div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
          📍 ${escapeHtml(report.neighborhood)} • ${timeAgo(report.reportedAt)}
        </div>
        <button onclick="openIssueDetailModal('${report.id}')" style="background: #0d9488; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; width: 100%; cursor: pointer;">
          Inspect Full Report →
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml);
    window._markerGroup.addLayer(marker);
  });
}

function filterMapCategory(catKey) {
  window._activeCategoryFilter = catKey;
  renderMapMarkers();

  // Update button active states in map filter bar
  const buttons = document.querySelectorAll(".dashboard-main .btn-sm");
  buttons.forEach(btn => {
    if (btn.innerText.toLowerCase().includes(catKey.toLowerCase()) || (catKey === "all" && btn.innerText.includes("All Categories"))) {
      btn.className = "btn btn-sm btn-primary";
    } else {
      btn.className = "btn btn-sm btn-ghost";
    }
  });
}

function initDashboardCharts() {
  if (typeof Chart === "undefined") return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#475569";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  // 1. Line Chart: 30-Day Trend
  const trendCanvas = document.getElementById("chart-trend");
  if (trendCanvas) {
    const existing = Chart.getChart(trendCanvas);
    if (existing) existing.destroy();

    const trends = AppState.getTrends();
    // Downsample to every 3rd day for clean display
    const sampled = trends.filter((_, idx) => idx % 3 === 0 || idx === trends.length - 1);

    new Chart(trendCanvas, {
      type: "line",
      data: {
        labels: sampled.map(d => d.date),
        datasets: [{
          label: "New Reports",
          data: sampled.map(d => d.count),
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#0d9488"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, stepSize: 1, font: { size: 11 } },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  // 2. Doughnut Chart: Categories
  const categoryCanvas = document.getElementById("chart-category");
  if (categoryCanvas) {
    const existing = Chart.getChart(categoryCanvas);
    if (existing) existing.destroy();

    const catData = AppState.getCategoryBreakdown();
    const labels = Object.keys(catData).map(k => CATEGORIES[k] ? CATEGORIES[k].label.split('/')[0] : k);
    const data = Object.values(catData);
    const colors = Object.keys(catData).map(k => CATEGORIES[k] ? CATEGORIES[k].color : "#64748b");

    new Chart(categoryCanvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: isDark ? "#1e293b" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { boxWidth: 12, color: textColor, font: { size: 11 } }
          }
        },
        cutout: "68%"
      }
    });
  }

  // 3. Bar Chart: Neighborhood Comparison
  const neighCanvas = document.getElementById("chart-neighborhood");
  if (neighCanvas) {
    const existing = Chart.getChart(neighCanvas);
    if (existing) existing.destroy();

    const nStats = AppState.getNeighborhoodStats();
    // Sort top 8
    const sorted = Object.entries(nStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8);

    new Chart(neighCanvas, {
      type: "bar",
      data: {
        labels: sorted.map(s => s[0]),
        datasets: [
          {
            label: "Open Issues",
            data: sorted.map(s => s[1].total - s[1].resolved),
            backgroundColor: "#ea580c",
            borderRadius: 4
          },
          {
            label: "Resolved",
            data: sorted.map(s => s[1].resolved),
            backgroundColor: "#16a34a",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, ticks: { color: textColor, font: { size: 11 } }, grid: { display: false } },
          y: { stacked: true, ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } }
        },
        plugins: {
          legend: {
            position: "top",
            labels: { boxWidth: 12, color: textColor, font: { size: 11 } }
          }
        }
      }
    });
  }

  // 4. Doughnut: Status Pipeline
  const statusCanvas = document.getElementById("chart-status");
  if (statusCanvas) {
    const existing = Chart.getChart(statusCanvas);
    if (existing) existing.destroy();

    const stData = AppState.getStatusBreakdown();
    new Chart(statusCanvas, {
      type: "doughnut",
      data: {
        labels: ["Reported", "Verified", "Assigned", "In Progress", "Resolved"],
        datasets: [{
          data: [
            stData.reported || 0,
            stData.verified || 0,
            stData.assigned || 0,
            stData.in_progress || 0,
            stData.resolved || 0
          ],
          backgroundColor: ["#6b7280", "#3b82f6", "#8b5cf6", "#f97316", "#16a34a"],
          borderWidth: 2,
          borderColor: isDark ? "#1e293b" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { boxWidth: 10, color: textColor, font: { size: 10 } }
          }
        },
        cutout: "60%"
      }
    });
  }
}

/* ==========================================================================
   SECTION 2: AI-POWERED ISSUE REPORTING WORKFLOW
   ========================================================================== */

function showReportIssue() {
  const content = document.getElementById("app-content");
  const s = window._reportState;

  content.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Section Title -->
      <div class="section-header" style="text-align: center; margin-bottom: 28px;">
        <h1 class="section-title" style="font-size: 26px;">Report a Community Issue</h1>
        <p class="section-subtitle">
          Submit photos or voice reports. CivicPulse AI analyzes urgency, identifies public-safety risks, detects existing duplicate reports, and routes to the appropriate municipal department.
        </p>
      </div>

      <!-- Step Indicator -->
      <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 32px; padding: 0 10px;">
        <div style="position: absolute; top: 18px; left: 40px; right: 40px; height: 2px; background: var(--border); z-index: 1;"></div>
        ${[
          { num: 1, label: "Evidence" },
          { num: 2, label: "Description" },
          { num: 3, label: "Location" },
          { num: 4, label: "AI Triage" },
          { num: 5, label: "Submitted" }
        ].map(step => {
          const isDone = s.step > step.num;
          const isCurrent = s.step === step.num;
          const bg = isCurrent ? "var(--teal)" : isDone ? "#16a34a" : "var(--bg-secondary)";
          const color = (isCurrent || isDone) ? "#ffffff" : "var(--text-muted)";
          return `
            <div style="display: flex; flex-direction: column; align-items: center; z-index: 2; position: relative;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: ${bg}; color: ${color}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border: 3px solid var(--bg-card); box-shadow: var(--shadow-sm);">
                ${isDone ? "✓" : step.num}
              </div>
              <span style="font-size: 12px; margin-top: 6px; font-weight: ${isCurrent ? '700' : '500'}; color: ${isCurrent ? 'var(--teal)' : 'var(--text-muted)'};">
                ${step.label}
              </span>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Form Container Card -->
      <div class="card" style="box-shadow: var(--shadow-md);">
        <div class="card-body" style="padding: 32px;" id="report-step-content">
          ${renderReportStep(s.step)}
        </div>
      </div>

      <!-- Responsible AI / Privacy Notice -->
      <div class="privacy-notice">
        <strong>Responsible AI Policy:</strong> CivicPulse AI performs preliminary automated analysis to assist municipal officers. AI estimates do not constitute official findings. Submissions do not automatically dispatch emergency 112 services. Personal information is redacted on public issue cards.
      </div>
    </div>
  `;
}

function renderReportStep(step) {
  const s = window._reportState;

  // STEP 1: IMAGE EVIDENCE
  if (step === 1) {
    return `
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Step 1: Upload Photo Evidence</h3>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
        Clear photos help the AI prioritize road depth, waste volume, and pedestrian safety hazards.
      </p>

      <div class="upload-area" id="drop-zone" onclick="document.getElementById('file-upload').click()">
        <input type="file" id="file-upload" accept="image/*" onchange="handleFileSelected(event)">
        <div class="upload-icon">📷</div>
        <div class="upload-text">
          <strong>Click to upload</strong> or drag and drop an issue image
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">PNG, JPG, or WEBP up to 5MB</div>
      </div>

      ${s.imagePreview ? `
        <div style="margin-top: 16px; position: relative;" class="upload-preview">
          <img src="${s.imagePreview}" alt="Evidence Preview">
          <button class="upload-preview-remove" onclick="removeSelectedImage(event)">✕ Remove</button>
        </div>
      ` : ""}

      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border);">
        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">
          Or select an instant demo photo:
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="selectDemoImage('pothole')">
            🚧 Pothole Demo
          </button>
          <button type="button" class="btn btn-secondary" onclick="selectDemoImage('garbage')">
            🗑️ Garbage Demo
          </button>
          <button type="button" class="btn btn-secondary" onclick="selectDemoImage('water')">
            💧 Water Leak Demo
          </button>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 28px;">
        <button class="btn btn-primary" onclick="proceedReportStep(2)">
          Continue to Description →
        </button>
      </div>
    `;
  }

  // STEP 2: DESCRIPTION & VOICE INPUT
  if (step === 2) {
    return `
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Step 2: Describe the Problem</h3>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
        Provide details about hazard severity, traffic impact, or affected residents.
      </p>

      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <label class="form-label" style="margin-bottom: 0;">
            Issue Description <span class="required">*</span>
          </label>
          <button type="button" class="btn btn-sm btn-ghost" onclick="simulateVoiceInput()" style="color: var(--teal); border-color: rgba(13,148,136,0.3);">
            🎙️ Simulate Voice Report (Hindi/English)
          </button>
        </div>
        <textarea id="issue-desc" class="form-control" rows="5" placeholder="e.g. Dangerous 2-foot deep pothole near the Civil Lines post office crossing. Two scooterists swerved and nearly crashed this morning..." oninput="updateCharCount(this)">${escapeHtml(s.description)}</textarea>
        <div style="display: flex; justify-content: space-between; margin-top: 4px;">
          <span id="desc-error" class="form-error hidden">Please enter at least 20 characters for accurate AI classification.</span>
          <span id="char-count" style="font-size: 11px; color: var(--text-muted); margin-left: auto;">${s.description.length} chars</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 28px;">
        <button class="btn btn-ghost" onclick="proceedReportStep(1)">← Back</button>
        <button class="btn btn-primary" onclick="validateStep2()">
          Continue to Location →
        </button>
      </div>
    `;
  }

  // STEP 3: CATEGORY & LOCATION
  if (step === 3) {
    return `
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Step 3: Category & Incident Location</h3>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
        Specify where this issue is located within the demo city.
      </p>

      <div class="form-group">
        <label class="form-label">Category <span class="required">*</span></label>
        <select id="issue-category" class="form-control">
          ${Object.keys(CATEGORIES).map(k => `
            <option value="${k}" ${s.category === k ? 'selected' : ''}>${CATEGORIES[k].icon} ${CATEGORIES[k].label}</option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <label class="form-label" style="margin-bottom: 0;">Neighborhood / Ward <span class="required">*</span></label>
          <button type="button" class="btn btn-sm btn-ghost" onclick="simulateGpsLocation()" style="font-size: 11px;">
            📍 Auto-Detect GPS Location
          </button>
        </div>
        <select id="issue-neighborhood" class="form-control" onchange="updateLocationCoords(this.value)">
          ${NEIGHBORHOODS.map(n => `
            <option value="${n}" ${s.neighborhood === n ? 'selected' : ''}>${n}</option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Specific Street Address or Landmark</label>
        <input type="text" id="issue-address" class="form-control" value="${escapeHtml(s.address || `Near ${s.neighborhood} Junction, Nagpur`)}" placeholder="e.g. Opposite State Bank, Wardha Road Crossing">
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 28px;">
        <button class="btn btn-ghost" onclick="proceedReportStep(2)">← Back</button>
        <button class="btn btn-primary" onclick="startAiAnalysis()">
          ✨ Analyze with Civic AI →
        </button>
      </div>
    `;
  }

  // STEP 4: AI ANALYSIS & DUPLICATE DETECTION
  if (step === 4) {
    if (!s.aiResult) {
      return `
        <div style="text-align: center; padding: 48px 24px;">
          <div style="font-size: 44px; margin-bottom: 16px; animation: bounce 1s infinite;">🧠</div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">CivicPulse AI Engine Processing...</h3>
          <p style="font-size: 13px; color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
            Analyzing issue severity keywords, checking geographic proximity for duplicate reports, calculating urgency priority score, and matching municipal department jurisdiction.
          </p>
        </div>
      `;
    }

    const ai = s.aiResult;
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="font-size: 18px; font-weight: 700;">Step 4: AI Intelligence Triage</h3>
        <span class="ai-badge">⚡ CivicPulse Model v2.4 (Demo Mode)</span>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px;">
        Review automated triage results before submission. You can confirm or submit.
      </p>

      <!-- AI Structured Output Box -->
      <div class="ai-analysis-panel" style="margin-top: 0;">
        <div class="ai-analysis-header">
          <div style="font-weight: 700; font-size: 15px; color: var(--text-primary); flex: 1;">
            ${escapeHtml(ai.title)}
          </div>
          ${renderBadge("severity", ai.severity)}
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Summary</div>
          <div class="ai-field-value">${escapeHtml(ai.summary)}</div>
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Severity Rationale</div>
          <div class="ai-field-value">${escapeHtml(ai.severityExplanation)}</div>
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Assigned Dept</div>
          <div class="ai-field-value" style="font-weight: 600; color: var(--teal);">${escapeHtml(ai.department)}</div>
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Recommended Action</div>
          <div class="ai-field-value">${escapeHtml(ai.nextAction)}</div>
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Safety Hazard</div>
          <div class="ai-field-value" style="color: ${ai.severity === 'critical' ? 'var(--color-critical)' : 'var(--text-primary)'}; font-weight: 500;">
            ${escapeHtml(ai.publicSafetyRisk)}
          </div>
        </div>

        <div class="ai-field">
          <div class="ai-field-label">Confidence Score</div>
          <div class="ai-field-value">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700;">${Math.round(ai.confidence * 100)}%</span>
              <div class="confidence-bar" style="flex: 1; max-width: 140px;">
                <div class="confidence-fill" style="width: ${ai.confidence * 100}%;"></div>
              </div>
            </div>
          </div>
        </div>

        ${ai.needsHumanReview ? `
          <div class="human-review-alert">
            <span style="font-size: 18px;">⚠️</span>
            <div>
              <strong>Officer Human Review Flagged:</strong> High-risk or uncertain safety parameters detected. A municipal officer must verify this report on-site before closure.
            </div>
          </div>
        ` : ""}
      </div>

      <!-- Duplicate Detection Alert -->
      ${s.duplicates && s.duplicates.length > 0 ? `
        <div class="duplicate-alert">
          <div class="duplicate-alert-title">
            <span>🔍</span>
            <span>Similar Reports Detected Nearby (${s.duplicates.length} Matches)</span>
          </div>
          <p style="font-size: 12px; color: #78350f; margin-bottom: 10px;">
            Other citizens have reported a similar issue in this vicinity. Supporting an existing report helps municipal teams prioritize faster instead of splitting attention across duplicates.
          </p>

          ${s.duplicates.map(d => `
            <div class="duplicate-item">
              <div>
                <strong style="color: #92400e;">${d.report.id}:</strong> ${escapeHtml(d.report.title)}
                <div style="font-size: 11px; color: var(--text-muted);">
                  📍 ${d.report.neighborhood} • ${timeAgo(d.report.reportedAt)} • ${d.report.upvotes || 0} supporters
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="duplicate-match">${Math.round(d.score * 100)}% match</span>
                <button type="button" class="btn btn-sm btn-primary" onclick="supportExistingReport('${d.report.id}')">
                  👍 Upvote Instead
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <div style="display: flex; justify-content: space-between; margin-top: 28px;">
        <button class="btn btn-ghost" onclick="proceedReportStep(3)">← Back</button>
        <button class="btn btn-primary btn-lg" onclick="submitFinalReport()">
          🚀 Confirm & Submit Official Report
        </button>
      </div>
    `;
  }

  // STEP 5: SUCCESS / CONFIRMATION
  if (step === 5) {
    const reportId = s.submittedId || "RPT-NEW";
    return `
      <div style="text-align: center; padding: 20px 0;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          ✓
        </div>
        <h2 style="font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          Report Submitted Successfully!
        </h2>
        <div style="display: inline-block; padding: 6px 14px; background: var(--bg-secondary); border-radius: 20px; font-size: 14px; font-weight: 700; color: var(--teal); margin-bottom: 16px;">
          Tracking Reference ID: ${reportId}
        </div>
        <p style="font-size: 14px; color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px;">
          Your report has been entered into the Nagpur Municipal Action queue with prioritized routing to the <strong>${escapeHtml(s.aiResult?.department || "appropriate department")}</strong>.
        </p>

        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="resetReportForm(); navigateTo('report');">
            Report Another Issue
          </button>
          <button class="btn btn-primary" onclick="navigateTo('explorer')">
            View in Community Explorer
          </button>
          <button class="btn btn-ghost" onclick="navigateTo('dashboard')">
            Return to Dashboard
          </button>
        </div>
      </div>
    `;
  }
}

function proceedReportStep(stepNum) {
  window._reportState.step = stepNum;
  const container = document.getElementById("report-step-content");
  if (container) {
    container.innerHTML = renderReportStep(stepNum);
    window.scrollTo(0, 100);
  } else {
    showReportIssue();
  }
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    window._reportState.imagePreview = e.target.result;
    proceedReportStep(1);
  };
  reader.readAsDataURL(file);
}

function selectDemoImage(type) {
  const demoImages = {
    pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    garbage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
    water: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80"
  };

  const descriptions = {
    pothole: "Large dangerous pothole at the main Civil Lines intersection. Two-wheelers have almost crashed trying to avoid it, especially hazardous after dark.",
    garbage: "Overflowing municipal waste bins near Dharampeth vegetable market. Garbage has spread across the pedestrian sidewalk causing severe odor and stray animal menace.",
    water: "Major underground pipeline leakage on Sadar Bazar Road. Fresh drinking water is gushing out and flooding the main street."
  };

  window._reportState.imagePreview = demoImages[type];
  window._reportState.category = type;
  if (!window._reportState.description) {
    window._reportState.description = descriptions[type];
  }

  showToast(`Loaded ${type} demo image & sample context`, "info");
  proceedReportStep(1);
}

function removeSelectedImage(e) {
  e.stopPropagation();
  window._reportState.imagePreview = null;
  proceedReportStep(1);
}

function simulateVoiceInput() {
  const demoTranscripts = [
    "नमस्ते, मैं सिविल लाइन्स नागपुर से बोल रहा हूँ। यहाँ मुख्य डाकघर के पास सड़क पर एक बहुत बड़ा गड्ढा हो गया है। आज सुबह दो स्कूटर सवार गिरते गिरते बचे। कृपया तुरंत मरम्मत करें।",
    "Dangerous crater on the main road in Sitabuldi near the railway station crossing. It is at least 6 inches deep and filled with water so vehicles cannot see it."
  ];

  const transcript = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];
  const textarea = document.getElementById("issue-desc");
  if (textarea) {
    textarea.value = transcript;
    window._reportState.description = transcript;
    updateCharCount(textarea);
    showToast("Voice input simulated and transcribed", "success");
  }
}

function updateCharCount(el) {
  const count = el.value.length;
  window._reportState.description = el.value;
  const countEl = document.getElementById("char-count");
  if (countEl) countEl.innerText = `${count} chars`;

  const err = document.getElementById("desc-error");
  if (err && count >= 20) {
    err.classList.add("hidden");
    el.classList.remove("error");
  }
}

function validateStep2() {
  const desc = window._reportState.description.trim();
  const textarea = document.getElementById("issue-desc");
  const err = document.getElementById("desc-error");

  if (desc.length < 20) {
    if (textarea) textarea.classList.add("error");
    if (err) err.classList.remove("hidden");
    showToast("Please provide at least 20 characters in the description", "warning");
    return;
  }

  proceedReportStep(3);
}

function simulateGpsLocation() {
  const randomNeigh = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
  window._reportState.neighborhood = randomNeigh;
  window._reportState.address = `Near ${randomNeigh} Main Road, Ward 12, Nagpur`;

  const select = document.getElementById("issue-neighborhood");
  const addr = document.getElementById("issue-address");
  if (select) select.value = randomNeigh;
  if (addr) addr.value = window._reportState.address;

  showToast(`GPS pinned location to ${randomNeigh}`, "success");
}

function updateLocationCoords(neighName) {
  window._reportState.neighborhood = neighName;
  const addr = document.getElementById("issue-address");
  if (addr && !addr.value.trim()) {
    addr.value = `Near ${neighName} Junction, Nagpur`;
    window._reportState.address = addr.value;
  }
}

async function startAiAnalysis() {
  const cat = document.getElementById("issue-category")?.value || window._reportState.category;
  const neigh = document.getElementById("issue-neighborhood")?.value || window._reportState.neighborhood;
  const addr = document.getElementById("issue-address")?.value || `Near ${neigh}, Nagpur`;

  window._reportState.category = cat;
  window._reportState.neighborhood = neigh;
  window._reportState.address = addr;

  // Move to step 4 with loading state
  window._reportState.step = 4;
  window._reportState.aiResult = null;
  proceedReportStep(4);

  try {
    const coords = { lat: 21.1458 + (Math.random() - 0.5) * 0.05, lng: 79.0882 + (Math.random() - 0.5) * 0.05 };
    window._reportState.lat = coords.lat;
    window._reportState.lng = coords.lng;

    const analysis = await AIAnalysis.analyze(cat, window._reportState.description, {
      neighborhood: neigh,
      address: addr,
      lat: coords.lat,
      lng: coords.lng
    });

    // Run duplicate detection
    const duplicates = AppState.findDuplicates(window._reportState.description, cat, coords);

    window._reportState.aiResult = analysis;
    window._reportState.duplicates = duplicates;

    proceedReportStep(4);
    showToast(analysis.isDemo ? "AI intelligence analysis complete (Demo Mode)" : "AI intelligence analysis complete (Live Gemini API)", "success");
  } catch (err) {
    console.error("AI analysis error:", err);
    window._reportState.aiResult = AIAnalysis.analyzeInDemoMode(cat, window._reportState.description, {
      neighborhood: neigh,
      address: addr,
      lat: 21.1458,
      lng: 79.0882
    });
    proceedReportStep(4);
  }
}


function supportExistingReport(existingReportId) {
  AppState.upvoteReport(existingReportId);
  showToast(`Upvoted report ${existingReportId}! Your support was registered.`, "success");
  openIssueDetailModal(existingReportId);
}

function submitFinalReport() {
  const s = window._reportState;
  const newId = AppState.generateId();

  const report = {
    id: newId,
    title: s.aiResult.title,
    description: s.description,
    category: s.category,
    severity: s.aiResult.severity,
    status: "reported",
    neighborhood: s.neighborhood,
    location: {
      lat: s.lat,
      lng: s.lng,
      address: s.address
    },
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reporterName: "Citizen Reporter (Anonymous)",
    upvotes: 1,
    aiAnalysis: s.aiResult,
    priorityScore: s.aiResult.priorityScore,
    priorityLabel: s.aiResult.priorityLabel,
    updates: [
      {
        timestamp: new Date().toISOString(),
        author: "CivicPulse AI",
        text: `Automated report ingestion and AI triage completed. Severity flagged as ${s.aiResult.severity.toUpperCase()}. Route suggested: ${s.aiResult.department}.`
      }
    ],
    duplicateOf: s.duplicates && s.duplicates.length > 0 ? s.duplicates[0].report.id : null,
    isDemo: true
  };

  AppState.addReport(report);
  s.submittedId = newId;
  proceedReportStep(5);
  showToast(`Report ${newId} logged successfully!`, "success");
}

function resetReportForm() {
  window._reportState = {
    step: 1,
    image: null,
    imagePreview: null,
    description: "",
    category: "pothole",
    neighborhood: "Civil Lines",
    address: "",
    lat: 21.1521,
    lng: 79.0842,
    aiResult: null,
    duplicates: [],
    selectedDuplicateId: null
  };
}

/* ==========================================================================
   SECTION 3: COMMUNITY ISSUE EXPLORER
   ========================================================================== */

function showCommunityExplorer() {
  const content = document.getElementById("app-content");
  const f = window._explorerFilters;

  content.innerHTML = `
    <div>
      <!-- Section Header -->
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: gap: 12px;">
        <div>
          <h1 class="section-title">Community Issue Explorer</h1>
          <p class="section-subtitle">
            Browse verified municipal reports across Nagpur wards. Upvote existing issues to escalate their priority score.
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm ${window._explorerViewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}" onclick="setExplorerView('grid')" title="Grid View">
            ⊞ Grid
          </button>
          <button class="btn btn-sm ${window._explorerViewMode === 'list' ? 'btn-primary' : 'btn-ghost'}" onclick="setExplorerView('list')" title="List View">
            ☰ List
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="filters-bar">
        <div class="search-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search keywords (e.g. pothole, sewage, flood)..." value="${escapeHtml(f.search)}" oninput="handleExplorerSearch(this.value)">
        </div>

        <div class="filter-group">
          <span class="filter-label">Category:</span>
          <select class="filter-select" onchange="handleExplorerFilter('category', this.value)">
            <option value="all">All Categories</option>
            ${Object.keys(CATEGORIES).map(k => `
              <option value="${k}" ${f.category === k ? 'selected' : ''}>${CATEGORIES[k].icon} ${CATEGORIES[k].label.split('/')[0]}</option>
            `).join("")}
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Severity:</span>
          <select class="filter-select" onchange="handleExplorerFilter('severity', this.value)">
            <option value="all">All Severities</option>
            <option value="critical" ${f.severity === 'critical' ? 'selected' : ''}>Critical</option>
            <option value="high" ${f.severity === 'high' ? 'selected' : ''}>High</option>
            <option value="medium" ${f.severity === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="low" ${f.severity === 'low' ? 'selected' : ''}>Low</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <select class="filter-select" onchange="handleExplorerFilter('status', this.value)">
            <option value="all">All Statuses</option>
            ${Object.keys(STATUS_FLOW).map(k => `
              <option value="${k}" ${f.status === k ? 'selected' : ''}>${STATUS_FLOW[k].label}</option>
            `).join("")}
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Sort:</span>
          <select class="filter-select" onchange="handleExplorerFilter('sort', this.value)">
            <option value="priority" ${f.sort === 'priority' ? 'selected' : ''}>Priority Score</option>
            <option value="newest" ${f.sort === 'newest' ? 'selected' : ''}>Newest First</option>
            <option value="upvotes" ${f.sort === 'upvotes' ? 'selected' : ''}>Most Supported</option>
          </select>
        </div>
      </div>

      <!-- Reports Container -->
      <div id="explorer-results">
        ${renderExplorerResults()}
      </div>
    </div>
  `;
}

function getFilteredReports() {
  const f = window._explorerFilters;
  let list = [...AppState.reports];

  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.neighborhood.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  }

  if (f.category !== "all") {
    list = list.filter(r => r.category === f.category);
  }

  if (f.severity !== "all") {
    list = list.filter(r => r.severity === f.severity);
  }

  if (f.status !== "all") {
    list = list.filter(r => r.status === f.status);
  }

  if (f.neighborhood !== "all") {
    list = list.filter(r => r.neighborhood === f.neighborhood);
  }

  // Sorting
  if (f.sort === "priority") {
    list.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
  } else if (f.sort === "newest") {
    list.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
  } else if (f.sort === "upvotes") {
    list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  }

  return list;
}

function renderExplorerResults() {
  const reports = getFilteredReports();
  const isGrid = window._explorerViewMode === "grid";

  if (reports.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No Civic Reports Found</div>
        <div class="empty-state-desc">Try clearing filters or searching for different keywords.</div>
      </div>
    `;
  }

  const gridStyle = isGrid
    ? "display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;"
    : "display: flex; flex-direction: column; gap: 12px;";

  return `
    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
      Showing <strong>${reports.length}</strong> community reports:
    </div>

    <div style="${gridStyle}">
      ${reports.map(report => {
        const cat = CATEGORIES[report.category] || { icon: "📌", label: "Issue" };
        return `
          <div class="issue-card ${report.severity}" onclick="openIssueDetailModal('${report.id}')">
            <div class="issue-card-header">
              <div class="issue-cat-icon">
                ${cat.icon}
              </div>
              <div class="issue-meta">
                <div class="issue-title">${escapeHtml(report.title)}</div>
                <div class="issue-badges">
                  ${renderBadge("severity", report.severity)}
                  ${renderBadge("status", report.status)}
                  ${report.duplicateOf ? `<span class="badge badge-demo" title="Potential duplicate of ${report.duplicateOf}">Similar to ${report.duplicateOf}</span>` : ""}
                </div>
              </div>
            </div>

            <div class="issue-desc">
              ${escapeHtml(report.description)}
            </div>

            <div class="issue-footer">
              <div class="issue-footer-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${escapeHtml(report.neighborhood)}</span>
              </div>
              <div class="issue-footer-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${timeAgo(report.reportedAt)}</span>
              </div>
              <button class="upvote-btn" onclick="handleCardUpvote(event, '${report.id}')" title="Support this community report">
                👍 <span>${report.upvotes || 0}</span>
              </button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function handleExplorerSearch(query) {
  window._explorerFilters.search = query;
  const res = document.getElementById("explorer-results");
  if (res) res.innerHTML = renderExplorerResults();
}

function handleExplorerFilter(key, val) {
  window._explorerFilters[key] = val;
  const res = document.getElementById("explorer-results");
  if (res) res.innerHTML = renderExplorerResults();
}

function setExplorerView(mode) {
  window._explorerViewMode = mode;
  showCommunityExplorer();
}

function handleCardUpvote(event, reportId) {
  event.stopPropagation();
  AppState.upvoteReport(reportId);
  showToast(`Upvoted report ${reportId}!`, "success");

  // Re-render results in place
  const res = document.getElementById("explorer-results");
  if (res) res.innerHTML = renderExplorerResults();
}

/* ==========================================================================
   ISSUE DETAIL MODAL
   ========================================================================== */

function openIssueDetailModal(reportId) {
  const report = AppState.reports.find(r => r.id === reportId);
  if (!report) return;

  const cat = CATEGORIES[report.category] || { icon: "📌", label: "Issue" };
  const ai = report.aiAnalysis;

  const bodyHtml = `
    <div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
        ${renderBadge("category", report.category)}
        ${renderBadge("severity", report.severity)}
        ${renderBadge("status", report.status)}
        <span class="badge badge-demo">Priority Score: ${report.priorityScore || 50}/100</span>
      </div>

      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">
        ${escapeHtml(report.title)}
      </h3>

      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; display: flex; gap: 14px; flex-wrap: wrap;">
        <span>📍 <strong>Location:</strong> ${escapeHtml(report.location?.address || report.neighborhood)}</span>
        <span>🕒 <strong>Reported:</strong> ${formatDate(report.reportedAt)}</span>
        <span>👤 <strong>Reporter:</strong> ${escapeHtml(report.reporterName || "Anonymous")}</span>
      </div>

      <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
        ${escapeHtml(report.description)}
      </div>

      ${report.duplicateOf ? `
        <div style="padding: 10px 14px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: var(--radius-md); font-size: 12px; margin-bottom: 20px; color: #92400e;">
          🔗 <strong>Linked Duplicate:</strong> This issue has been flagged as similar to earlier report <strong>${report.duplicateOf}</strong>.
          <button class="btn btn-sm btn-ghost" onclick="openIssueDetailModal('${report.duplicateOf}')" style="margin-left: 8px; padding: 2px 8px; font-size: 11px;">
            Open Original Report →
          </button>
        </div>
      ` : ""}

      <!-- AI Triage Box if available -->
      ${ai ? `
        <div class="ai-analysis-panel" style="margin-bottom: 20px;">
          <div class="ai-analysis-header">
            <span class="ai-badge">AI Intelligence Assessment</span>
            <span style="font-size: 12px; color: var(--text-muted); margin-left: auto;">Confidence: ${Math.round(ai.confidence * 100)}%</span>
          </div>
          <div style="font-size: 13px; margin-bottom: 8px;"><strong>Triage Summary:</strong> ${escapeHtml(ai.summary)}</div>
          <div style="font-size: 13px; margin-bottom: 8px;"><strong>Assigned Dept:</strong> <span style="color: var(--teal); font-weight: 600;">${escapeHtml(ai.department)}</span></div>
          <div style="font-size: 13px; margin-bottom: 8px;"><strong>Action Recommended:</strong> ${escapeHtml(ai.nextAction)}</div>
          <div style="font-size: 13px; color: ${ai.severity === 'critical' ? 'var(--color-critical)' : 'inherit'};">
            <strong>Public Safety Note:</strong> ${escapeHtml(ai.publicSafetyRisk)}
          </div>
        </div>
      ` : ""}

      <!-- Updates & Resolution Timeline -->
      <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Official Updates & Action Log</h4>
      ${report.updates && report.updates.length > 0 ? `
        <div class="timeline">
          ${report.updates.map(u => `
            <div class="timeline-item">
              <div class="timeline-date">${formatDate(u.timestamp)}</div>
              <div class="timeline-content">
                <div class="timeline-author">${escapeHtml(u.author || "Municipal Dispatch")}</div>
                <div>${escapeHtml(u.text)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      ` : `
        <div style="font-size: 13px; color: var(--text-muted); font-style: italic;">No official officer notes logged yet.</div>
      `}

      ${report.resolutionSummary ? `
        <div style="margin-top: 16px; padding: 14px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); color: #166534;">
          <strong>Resolution Evidence Summary:</strong> ${escapeHtml(report.resolutionSummary)}
        </div>
      ` : ""}
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="handleCardUpvote(event, '${report.id}')">
      👍 Support Issue (${report.upvotes || 0})
    </button>
    <button class="btn btn-primary" onclick="closeModal(); openOfficerModal('${report.id}');">
      🛠 Officer Actions
    </button>
  `;

  openModal(`Incident ${report.id}`, bodyHtml, footerHtml);
}

/* ==========================================================================
   SECTION 4: MUNICIPAL ACTION CENTER (OFFICER WORKSPACE)
   ========================================================================== */

function showMunicipalActionCenter() {
  const content = document.getElementById("app-content");
  const tab = window._activeOfficerTab;
  const f = window._officerFilters;

  content.innerHTML = `
    <div>
      <!-- Demo Officer Header Banner -->
      <div style="padding: 16px 20px; background: var(--navy-800); border-radius: var(--radius-lg); color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; box-shadow: var(--shadow-sm); flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: var(--teal); display: flex; align-items: center; justify-content: center; font-size: 22px;">
            🛡️
          </div>
          <div>
            <div style="font-weight: 700; font-size: 16px;">Municipal Officer Dispatch Desk</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">
              Nagpur Municipal Corporation (Simulated Workspace) • Officer ID: #NMC-8821
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge" style="background: rgba(255,255,255,0.15); color: white;">Local Persistence Active</span>
          <button class="btn btn-sm btn-secondary" onclick="exportMunicipalRosterCsv()" style="background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.25);">
            📥 Export CSV
          </button>
          <button class="btn btn-sm btn-ghost" onclick="confirmResetDemo()" style="color: white; border-color: rgba(255,255,255,0.3);">
            Reset Data
          </button>
        </div>
      </div>

      <!-- Action Center Tabs -->
      <div class="tab-list">
        <button class="tab-trigger ${tab === 'queue' ? 'active' : ''}" onclick="setOfficerTab('queue')">
          ⚡ Priority Action Queue (${AppState.reports.filter(r => r.status !== 'resolved').length})
        </button>
        <button class="tab-trigger ${tab === 'all' ? 'active' : ''}" onclick="setOfficerTab('all')">
          📋 All Issues Directory (${AppState.reports.length})
        </button>
        <button class="tab-trigger ${tab === 'departments' ? 'active' : ''}" onclick="setOfficerTab('departments')">
          🏢 Department Routing
        </button>
      </div>

      <!-- Filters Row -->
      <div class="filters-bar" style="margin-bottom: 20px;">
        <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
          <input type="checkbox" ${f.overdueOnly ? 'checked' : ''} onchange="toggleOfficerFilter('overdueOnly')">
          <span>Show Overdue Issues (>7 Days)</span>
        </label>

        <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer; margin-left: 16px;">
          <input type="checkbox" ${f.criticalOnly ? 'checked' : ''} onchange="toggleOfficerFilter('criticalOnly')">
          <span>Critical Only</span>
        </label>

        <div class="filter-group" style="margin-left: auto;">
          <span class="filter-label">Status:</span>
          <select class="filter-select" onchange="setOfficerFilter('status', this.value)">
            <option value="all">All</option>
            ${Object.keys(STATUS_FLOW).map(k => `
              <option value="${k}" ${f.status === k ? 'selected' : ''}>${STATUS_FLOW[k].label}</option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="officer-tab-content">
        ${renderOfficerContent()}
      </div>
    </div>
  `;
}

function setOfficerTab(tab) {
  window._activeOfficerTab = tab;
  showMunicipalActionCenter();
}

function toggleOfficerFilter(key) {
  window._officerFilters[key] = !window._officerFilters[key];
  const container = document.getElementById("officer-tab-content");
  if (container) container.innerHTML = renderOfficerContent();
}

function setOfficerFilter(key, val) {
  window._officerFilters[key] = val;
  const container = document.getElementById("officer-tab-content");
  if (container) container.innerHTML = renderOfficerContent();
}

function renderOfficerContent() {
  const tab = window._activeOfficerTab;
  const f = window._officerFilters;
  let reports = [...AppState.reports];

  // Apply filters
  if (f.overdueOnly) {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    reports = reports.filter(r => new Date(r.reportedAt).getTime() < sevenDaysAgo && r.status !== "resolved");
  }

  if (f.criticalOnly) {
    reports = reports.filter(r => r.severity === "critical");
  }

  if (f.status !== "all") {
    reports = reports.filter(r => r.status === f.status);
  }

  // TAB 1: PRIORITY QUEUE
  if (tab === "queue") {
    const queueReports = reports
      .filter(r => r.status !== "resolved")
      .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    if (queueReports.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-title">No Pending Issues in Queue</div>
          <div class="empty-state-desc">All filtered civic issues have been handled or resolved!</div>
        </div>
      `;
    }

    return `
      <div class="priority-queue">
        ${queueReports.map(report => {
          const daysOpen = Math.floor((Date.now() - new Date(report.reportedAt).getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysOpen > 7;
          return `
            <div class="queue-item" onclick="openOfficerModal('${report.id}')">
              <div class="priority-score ${report.severity}" title="Calculated Priority Score (0-100)">
                ${report.priorityScore || 50}
              </div>

              <div class="queue-content">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                  <span style="font-weight: 700; font-size: 12px; color: var(--teal);">${report.id}</span>
                  <div class="queue-title">${escapeHtml(report.title)}</div>
                </div>

                <div class="queue-meta">
                  <span>📍 ${escapeHtml(report.neighborhood)}</span>
                  <span>📁 ${escapeHtml(report.aiAnalysis?.department || "Unassigned")}</span>
                  <span style="color: ${isOverdue ? 'var(--color-critical)' : 'inherit'}; font-weight: ${isOverdue ? '700' : 'normal'};">
                    ⏳ ${daysOpen} days open ${isOverdue ? '(! OVERDUE)' : ''}
                  </span>
                  <span>👍 ${report.upvotes || 0} upvotes</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                ${renderBadge("status", report.status)}
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openOfficerModal('${report.id}');">
                  Take Action →
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // TAB 2: ALL ISSUES DIRECTORY
  if (tab === "all") {
    return `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${reports.map(r => `
          <div class="card" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer;" onclick="openOfficerModal('${r.id}')">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                <span style="font-weight: 700; font-size: 12px; color: var(--teal);">${r.id}</span>
                ${renderBadge("severity", r.severity)}
                ${renderBadge("status", r.status)}
                <span style="font-size: 12px; color: var(--text-muted);">• ${escapeHtml(r.neighborhood)}</span>
              </div>
              <div style="font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${escapeHtml(r.title)}
              </div>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); openOfficerModal('${r.id}');">
              Manage →
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }

  // TAB 3: DEPARTMENT ROUTING
  if (tab === "departments") {
    const deptGroups = {};
    DEPARTMENTS.forEach(d => deptGroups[d] = []);

    reports.forEach(r => {
      const dept = r.aiAnalysis?.department || "Roads & Infrastructure Department";
      if (!deptGroups[dept]) deptGroups[dept] = [];
      deptGroups[dept].push(r);
    });

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        ${DEPARTMENTS.map(dept => {
          const items = deptGroups[dept] || [];
          const openCount = items.filter(i => i.status !== "resolved").length;
          return `
            <div class="card">
              <div class="card-header" style="background: var(--bg-secondary);">
                <div>
                  <div style="font-weight: 700; font-size: 14px;">${escapeHtml(dept)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${openCount} active / ${items.length} total</div>
                </div>
                <span class="badge ${openCount > 3 ? 'badge-high' : 'badge-low'}">${openCount} Open</span>
              </div>
              <div class="card-body" style="padding: 12px 16px; max-height: 240px; overflow-y: auto;">
                ${items.length === 0 ? `
                  <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 20px 0;">No active issues assigned</div>
                ` : `
                  ${items.slice(0, 5).map(it => `
                    <div style="padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="openOfficerModal('${it.id}')">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${escapeHtml(it.title)}</span>
                      ${renderBadge("status", it.status)}
                    </div>
                  `).join("")}
                `}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }
}

/* ==========================================================================
   OFFICER ACTION MODAL (TRANSITIONS, UPDATES, PERSISTENCE)
   ========================================================================== */

function openOfficerModal(reportId) {
  const report = AppState.reports.find(r => r.id === reportId);
  if (!report) return;

  const ai = report.aiAnalysis;
  const currentStatus = report.status;
  const statuses = ["reported", "verified", "assigned", "in_progress", "resolved"];

  const bodyHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- Left Column: Report Details & AI Rationale -->
      <div>
        <div style="display: flex; gap: 6px; margin-bottom: 8px;">
          <span style="font-weight: 700; font-size: 12px; color: var(--teal);">${report.id}</span>
          ${renderBadge("severity", report.severity)}
          ${renderBadge("status", report.status)}
        </div>

        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">
          ${escapeHtml(report.title)}
        </h4>

        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
          📍 ${escapeHtml(report.location?.address || report.neighborhood)} • Reported ${formatDate(report.reportedAt)}
        </div>

        <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-md); font-size: 13px; line-height: 1.4; margin-bottom: 16px;">
          ${escapeHtml(report.description)}
        </div>

        ${ai ? `
          <div class="ai-analysis-panel" style="margin-top: 0; padding: 14px;">
            <div style="font-weight: 700; font-size: 12px; color: var(--teal); margin-bottom: 6px;">AI TRIAGE INSIGHT:</div>
            <div style="font-size: 12px; margin-bottom: 4px;"><strong>Recommended:</strong> ${escapeHtml(ai.nextAction)}</div>
            <div style="font-size: 12px; color: var(--color-critical);"><strong>Hazard:</strong> ${escapeHtml(ai.publicSafetyRisk)}</div>
          </div>
        ` : ""}

        <!-- Past Updates -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 700; font-size: 12px; margin-bottom: 8px;">AUDIT TRAIL / TIMELINE:</div>
          <div style="max-height: 140px; overflow-y: auto; font-size: 12px; display: flex; flex-direction: column; gap: 6px;">
            ${(report.updates || []).map(u => `
              <div style="background: var(--bg-secondary); padding: 8px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 11px;">
                  <span>${escapeHtml(u.author)}</span>
                  <span>${timeAgo(u.timestamp)}</span>
                </div>
                <div style="margin-top: 2px;">${escapeHtml(u.text)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Right Column: Officer Action Controls -->
      <div style="border-left: 1px solid var(--border); padding-left: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 14px; color: var(--teal);">
          Take Municipal Action
        </h4>

        <!-- Status Transition Stepper -->
        <div class="form-group">
          <label class="form-label">Workflow Status Progression</label>
          <div class="status-stepper">
            ${statuses.map(st => {
              const isCurrent = currentStatus === st;
              const isPast = statuses.indexOf(currentStatus) > statuses.indexOf(st);
              const cls = isCurrent ? "active" : isPast ? "done" : "";
              return `
                <div class="status-step ${cls}" onclick="setModalStatus('${report.id}', '${st}')">
                  ${STATUS_FLOW[st].label}
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Assigned Department -->
        <div class="form-group">
          <label class="form-label">Assign Department</label>
          <select id="officer-dept-select" class="form-control">
            ${DEPARTMENTS.map(d => `
              <option value="${d}" ${report.aiAnalysis?.department === d ? 'selected' : ''}>${d}</option>
            `).join("")}
          </select>
        </div>

        <!-- Human Review Verification Checkbox if flagged -->
        ${ai?.needsHumanReview ? `
          <div style="padding: 10px 12px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: var(--radius-md); margin-bottom: 14px;">
            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #92400e; cursor: pointer;">
              <input type="checkbox" id="human-review-chk" style="margin-top: 2px;">
              <span><strong>Human Verification Required:</strong> I confirm on-site inspection or supervisory review of this safety hazard before status closure.</span>
            </label>
          </div>
        ` : ""}

        <!-- Resolution Evidence Summary (shown if resolved) -->
        <div class="form-group" id="resolution-summary-group" style="${currentStatus === 'resolved' ? '' : 'display: none;'}">
          <label class="form-label">Resolution Summary & Evidence <span class="required">*</span></label>
          <textarea id="officer-resolution-text" class="form-control" rows="2" placeholder="e.g. Hot-mix asphalt patching completed by Ward 4 road crew. Tested for drainage leveling.">${escapeHtml(report.resolutionSummary || "")}</textarea>
        </div>

        <!-- Add Progress Note -->
        <div class="form-group">
          <label class="form-label">Add Officer Progress Note</label>
          <textarea id="officer-note-text" class="form-control" rows="3" placeholder="e.g. Inspected site at 10:30 AM. Repair crew dispatched with heavy roller..."></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px;">
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveOfficerAction('${report.id}')">
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  `;

  openModal(`Officer Action: ${report.id}`, bodyHtml, "");
}

function setModalStatus(reportId, nextStatus) {
  // Update UI stepper
  const steps = document.querySelectorAll(".status-step");
  const statuses = ["reported", "verified", "assigned", "in_progress", "resolved"];
  const targetIdx = statuses.indexOf(nextStatus);

  steps.forEach((step, idx) => {
    step.className = "status-step";
    if (idx === targetIdx) step.classList.add("active");
    else if (idx < targetIdx) step.classList.add("done");
  });

  window._modalSelectedStatus = nextStatus;

  // Show/hide resolution field
  const resGroup = document.getElementById("resolution-summary-group");
  if (resGroup) {
    resGroup.style.display = nextStatus === "resolved" ? "block" : "none";
  }
}

function saveOfficerAction(reportId) {
  const report = AppState.reports.find(r => r.id === reportId);
  if (!report) return;

  const targetStatus = window._modalSelectedStatus || report.status;
  const dept = document.getElementById("officer-dept-select")?.value || report.aiAnalysis?.department;
  const note = document.getElementById("officer-note-text")?.value.trim();
  const resolutionText = document.getElementById("officer-resolution-text")?.value.trim();
  const reviewChk = document.getElementById("human-review-chk");

  // Enforce human review confirmation if flagged
  if (report.aiAnalysis?.needsHumanReview && reviewChk && !reviewChk.checked && targetStatus === "resolved") {
    showToast("Please check the Human Verification confirmation before resolving this high-risk issue", "warning");
    return;
  }

  const updates = {
    status: targetStatus
  };

  if (dept) {
    if (!report.aiAnalysis) report.aiAnalysis = {};
    report.aiAnalysis.department = dept;
  }

  if (targetStatus === "resolved") {
    updates.resolvedAt = new Date().toISOString();
    updates.resolutionSummary = resolutionText || "Issue verified and resolved by municipal field team.";
  }

  AppState.updateReport(reportId, updates);

  // If officer note provided, log to updates timeline
  if (note || targetStatus !== report.status) {
    const text = note || `Status updated from ${STATUS_FLOW[report.status].label} to ${STATUS_FLOW[targetStatus].label}.`;
    AppState.addUpdate(reportId, {
      timestamp: new Date().toISOString(),
      author: "Officer Mehta (Dispatch)",
      text
    });
  }

  closeModal();
  showToast(`Updated ${reportId} to ${STATUS_FLOW[targetStatus].label}`, "success");

  // Re-render whichever view is active
  if (AppState.currentView === "action-center") {
    showMunicipalActionCenter();
  } else if (AppState.currentView === "dashboard") {
    showDashboard();
  } else if (AppState.currentView === "explorer") {
    showCommunityExplorer();
  }
}

/* ==========================================================================
   SECTION 5: PREDICTIVE COMMUNITY INSIGHTS
   ========================================================================== */

function showPredictiveInsights() {
  const content = document.getElementById("app-content");
  const nStats = AppState.getNeighborhoodStats();

  content.innerHTML = `
    <div>
      <!-- Section Header -->
      <div class="section-header">
        <h1 class="section-title">Predictive Community Intelligence</h1>
        <p class="section-subtitle">
          Historical issue clustering, seasonal hazard forecasting, and proactive municipal maintenance recommendations based on cross-ward data patterns.
        </p>
      </div>

      <!-- Demo Intelligence Notice -->
      <div class="demo-notice" style="margin-bottom: 24px;">
        <span>🔮</span>
        <div>
          <strong>PREDICTIVE MODEL INSIGHTS (DEMO)</strong> — Recommendations are calculated by correlating recurrence frequency, duration since report, and infrastructure category densities across Nagpur wards.
        </div>
      </div>

      <!-- Predictive Insights Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 18px; margin-bottom: 32px;">
        ${PREDICTIVE_INSIGHTS.map(ins => {
          const typeIcons = {
            hotspot: "🔥",
            pattern: "📈",
            prediction: "⛈️"
          };
          return `
            <div class="insight-card">
              <div class="insight-header">
                <div class="insight-type-icon ${ins.type}">
                  ${typeIcons[ins.type] || "💡"}
                </div>
                <div style="flex: 1;">
                  <div class="insight-title">${escapeHtml(ins.title)}</div>
                  <div class="insight-meta">
                    📍 ${escapeHtml(ins.neighborhood)} • Category: ${renderBadge("category", ins.category)}
                  </div>
                </div>
              </div>

              <div class="insight-desc">
                ${escapeHtml(ins.description)}
              </div>

              <div class="insight-recommendation">
                <strong>Recommended Preventive Action:</strong>
                ${escapeHtml(ins.recommendation)}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border);">
                <div class="confidence-indicator">
                  <span class="confidence-label">Confidence:</span>
                  <strong style="color: var(--teal); font-size: 13px;">${Math.round(ins.confidence * 100)}%</strong>
                </div>
                <span class="trend-badge ${ins.trend}">
                  Trend: ${ins.trend.toUpperCase()}
                </span>
                <span style="font-size: 12px; color: var(--text-muted);">
                  ${ins.dataPoints} incident signals
                </span>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Neighborhood Deep Dive Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>Ward & Neighborhood Risk Scorecard</span>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">15 Municipal Sectors</span>
        </div>
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
            <thead>
              <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
                <th style="padding: 12px 16px;">Neighborhood / Ward</th>
                <th style="padding: 12px 16px;">Total Reports</th>
                <th style="padding: 12px 16px;">Open Issues</th>
                <th style="padding: 12px 16px;">Resolved</th>
                <th style="padding: 12px 16px;">Critical Hazards</th>
                <th style="padding: 12px 16px;">Resolution Rate</th>
                <th style="padding: 12px 16px;">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(nStats).map(nName => {
                const s = nStats[nName];
                const open = s.total - s.resolved;
                const rate = s.total > 0 ? Math.round((s.resolved / s.total) * 100) : 0;
                const risk = s.critical > 0 ? "High" : open > 2 ? "Moderate" : "Low";
                const riskColor = risk === "High" ? "var(--color-critical)" : risk === "Moderate" ? "var(--color-high)" : "var(--color-low)";

                return `
                  <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px 16px; font-weight: 600;">${escapeHtml(nName)}</td>
                    <td style="padding: 12px 16px;">${s.total}</td>
                    <td style="padding: 12px 16px; color: ${open > 0 ? '#f97316' : 'inherit'}; font-weight: 600;">${open}</td>
                    <td style="padding: 12px 16px; color: #16a34a; font-weight: 600;">${s.resolved}</td>
                    <td style="padding: 12px 16px; color: ${s.critical > 0 ? 'var(--color-critical)' : 'inherit'}; font-weight: ${s.critical > 0 ? '700' : 'normal'};">
                      ${s.critical}
                    </td>
                    <td style="padding: 12px 16px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${rate}%</span>
                        <div style="width: 60px; height: 5px; background: var(--bg-secondary); border-radius: 3px; overflow: hidden;">
                          <div style="width: ${rate}%; height: 100%; background: #16a34a;"></div>
                        </div>
                      </div>
                    </td>
                    <td style="padding: 12px 16px;">
                      <span style="font-weight: 700; color: ${riskColor};">${risk}</span>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SECTION 6: CIVIC IMPACT CENTER
   ========================================================================== */

function showImpactCenter() {
  const content = document.getElementById("app-content");
  const stats = AppState.getStats();

  // Calculate environmental and civic benefits
  const waterLeaksResolved = AppState.reports.filter(r => (r.category === "water" || r.category === "drainage") && r.status === "resolved").length;
  // Estimated 500 liters saved per resolved leak incident
  const estimatedLitersSaved = waterLeaksResolved * 500;
  const criticalResolved = AppState.reports.filter(r => r.severity === "critical" && r.status === "resolved").length;
  const totalUpvotes = AppState.reports.reduce((acc, r) => acc + (r.upvotes || 0), 0);

  content.innerHTML = `
    <div>
      <!-- Section Header -->
      <div class="section-header">
        <h1 class="section-title">Civic Impact & Accountability Center</h1>
        <p class="section-subtitle">
          Measuring the real-world difference: resolution speed, community participation, and tangible urban infrastructure improvements.
        </p>
      </div>

      <!-- Key Impact Cards -->
      <div class="impact-grid">
        <div class="impact-card">
          <div class="impact-number" style="color: var(--teal);">${stats.resolved}</div>
          <div class="impact-label">Civic Issues Resolved</div>
          <div class="impact-sub">Verified by municipal crews</div>
        </div>

        <div class="impact-card">
          <div class="impact-number" style="color: #3b82f6;">${stats.avgResolution}d</div>
          <div class="impact-label">Median Resolution Time</div>
          <div class="impact-sub">Down from 12.4 days baseline</div>
        </div>

        <div class="impact-card">
          <div class="impact-number" style="color: #16a34a;">${criticalResolved}</div>
          <div class="impact-label">Critical Hazards Neutralized</div>
          <div class="impact-sub">Potholes, bursts & fallen wires</div>
        </div>

        <div class="impact-card">
          <div class="impact-number" style="color: #ea580c;">${totalUpvotes}</div>
          <div class="impact-label">Citizen Endorsements</div>
          <div class="impact-sub">Community priority upvotes</div>
        </div>
      </div>

      <!-- Before and After Comparison -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            <span>Before vs. After CivicPulse AI Adoption (Simulated Model)</span>
          </div>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Before Column -->
            <div style="padding: 18px; background: var(--bg-secondary); border-radius: var(--radius-md); border-left: 4px solid #94a3b8;">
              <h3 style="font-size: 15px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px;">
                Traditional Municipal Complaint System
              </h3>
              <ul style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; padding-left: 20px;">
                <li>Citizen reports lost in paper registers or disconnected apps.</li>
                <li>No automated severity classification; critical hazards sit in line.</li>
                <li>Duplicate complaints create duplicate dispatches and wasted fuel.</li>
                <li>Average resolution cycle: <strong>12.4 business days</strong>.</li>
                <li>Zero transparency for citizens after report submission.</li>
              </ul>
            </div>

            <!-- After Column -->
            <div style="padding: 18px; background: rgba(13,148,136,0.08); border-radius: var(--radius-md); border-left: 4px solid var(--teal);">
              <h3 style="font-size: 15px; font-weight: 700; color: var(--teal); margin-bottom: 12px;">
                With CivicPulse AI Intelligence Platform
              </h3>
              <ul style="font-size: 13px; color: var(--text-primary); line-height: 1.8; padding-left: 20px;">
                <li>Instant AI classification of safety risks within <strong>1.5 seconds</strong>.</li>
                <li>Accurate automated duplicate detection prevents redundant field crews.</li>
                <li>Transparent prioritization queue focuses officers on critical hazards.</li>
                <li>Current average resolution time: <strong>${stats.avgResolution} days</strong>.</li>
                <li>Live public tracking and community support upvoting.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Environmental & Efficiency Impact Box -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            <span>Estimated Resource Conservation (Calculated Assumption)</span>
          </div>
        </div>
        <div class="card-body">
          <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div style="font-size: 36px; font-weight: 800; color: #3b82f6;">
              ${estimatedLitersSaved.toLocaleString()} L
            </div>
            <div style="flex: 1; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              <strong>Drinking Water Saved:</strong> Based on <strong>${waterLeaksResolved} resolved</strong> water pipeline leakages with an assumed average flow loss of 500 liters prevented per early intervention.
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
                Formula: (Resolved Water Outages × 500L standard leak prevention index). Provided for illustrative environmental impact analysis.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real Success Stories -->
      <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 14px;">Resolved Case Highlights</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px;">
        ${AppState.reports.filter(r => r.status === "resolved").slice(0, 3).map(r => `
          <div class="card" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 12px; color: #16a34a;">✓ ${r.id} RESOLVED</span>
              <span style="font-size: 11px; color: var(--text-muted);">${timeAgo(r.resolvedAt || r.updatedAt)}</span>
            </div>
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">${escapeHtml(r.title)}</div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">📍 ${escapeHtml(r.neighborhood)}</div>
            <div style="font-size: 12px; color: #166534; background: #f0fdf4; padding: 8px; border-radius: 6px;">
              ${escapeHtml(r.resolutionSummary || "Verified and repaired by municipal crew.")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ==========================================================================
   SYSTEM SETTINGS & EXPORT TOOLS
   ========================================================================== */

function openSettingsModal() {
  const currentKey = localStorage.getItem("civicpulse_gemini_key") || "";
  const isLive = Boolean(currentKey);

  const bodyHtml = `
    <div>
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 6px;">AI Engine Configuration</h4>
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
          CivicPulse AI runs out-of-the-box with a high-fidelity <strong>Deterministic Demonstration Engine</strong>. You can optionally connect a Google Gemini 1.5 API key to perform live multimodal triage on citizen descriptions.
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">Google Gemini API Key (Optional)</label>
        <input type="password" id="gemini-api-key" class="form-control" value="${escapeHtml(currentKey)}" placeholder="AIzaSy...">
        <div class="form-hint">Stored strictly in local browser storage. Never sent to any third-party analytics.</div>
      </div>

      <div style="padding: 14px; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
          Active Operating Mode
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 14px; font-weight: 600; color: ${isLive ? 'var(--teal)' : 'var(--amber)'};">
            ${isLive ? "✨ Live Gemini 1.5 Flash Active" : "⚡ Deterministic Demo Engine Active"}
          </span>
          <button type="button" class="btn btn-sm btn-ghost" onclick="testGeminiApiKey()">
            🔌 Test Connection
          </button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-danger btn-sm" onclick="clearApiKey()">
          Remove API Key (Revert to Demo)
        </button>
        <button class="btn btn-primary" onclick="saveSettings()">
          💾 Save Configuration
        </button>
      </div>
    </div>
  `;

  openModal("CivicPulse AI System Settings", bodyHtml, "");
}

function saveSettings() {
  const input = document.getElementById("gemini-api-key");
  if (!input) return;

  const key = input.value.trim();
  if (key) {
    localStorage.setItem("civicpulse_gemini_key", key);
    showToast("Gemini API key saved! Live AI triage enabled.", "success");
  } else {
    localStorage.removeItem("civicpulse_gemini_key");
    showToast("Reverted to Deterministic Demo Mode.", "info");
  }
  closeModal();
}

function clearApiKey() {
  localStorage.removeItem("civicpulse_gemini_key");
  const input = document.getElementById("gemini-api-key");
  if (input) input.value = "";
  showToast("API key removed. Running in Demo Mode.", "info");
  closeModal();
}

async function testGeminiApiKey() {
  const input = document.getElementById("gemini-api-key");
  const key = input ? input.value.trim() : localStorage.getItem("civicpulse_gemini_key");

  if (!key) {
    showToast("Please enter an API key first to test connection", "warning");
    return;
  }

  showToast("Testing Gemini API connection...", "info");

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Ping: Respond with JSON {'status': 'ok'}" }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (res.ok) {
      showToast("✓ Gemini API connection successful!", "success");
    } else {
      showToast(`✕ API error: HTTP ${res.status}. Check key permissions.`, "error");
    }
  } catch (err) {
    showToast("✕ Network request failed: " + err.message, "error");
  }
}

function exportMunicipalRosterCsv() {
  const reports = AppState.reports;
  if (!reports || reports.length === 0) {
    showToast("No records available to export", "warning");
    return;
  }

  const headers = ["ID", "Title", "Category", "Severity", "Status", "Ward", "PriorityScore", "ReportedAt", "Department", "Upvotes"];
  const rows = reports.map(r => [
    `"${r.id}"`,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${r.category}"`,
    `"${r.severity}"`,
    `"${r.status}"`,
    `"${r.neighborhood}"`,
    r.priorityScore || 50,
    `"${r.reportedAt}"`,
    `"${(r.aiAnalysis?.department || '').replace(/"/g, '""')}"`,
    r.upvotes || 0
  ]);

  const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nagpur_civicpulse_dispatch_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Exported ${reports.length} records to CSV!`, "success");
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */


document.addEventListener("DOMContentLoaded", () => {
  // Initialize state from localStorage or seed
  AppState.init();

  // Dark mode restore
  if (AppState.darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    const darkIcon = document.getElementById("icon-dark");
    const lightIcon = document.getElementById("icon-light");
    if (darkIcon) darkIcon.classList.add("hidden");
    if (lightIcon) lightIcon.classList.remove("hidden");
  }

  // Handle ESC key for modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Modal overlay click to close
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Initial load
  navigateTo("dashboard");
});
