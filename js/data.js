// CivicPulse AI — Demo Data
// All records below are DEMONSTRATION DATA for the fictional city of Nagpur (Demo City).
// They do not represent real reports from actual residents or government departments.

const DEMO_CITY = {
  name: "Nagpur (Demo City)",
  center: [21.1458, 79.0882],
  zoom: 13
};

const NEIGHBORHOODS = [
  "Civil Lines", "Dharampeth", "Sadar", "Sitabuldi", "Gandhibagh",
  "Itwari", "Kamptee Road", "Laxmi Nagar", "Bajaj Nagar", "Manish Nagar",
  "Pratap Nagar", "Wardhaman Nagar", "Hingna Road", "Bhandara Road", "Seminary Hills"
];

const CATEGORIES = {
  pothole: { label: "Pothole / Road Damage", icon: "🚧", color: "#ef4444", mapColor: "#ef4444" },
  garbage: { label: "Garbage / Waste", icon: "🗑️", color: "#f97316", mapColor: "#f97316" },
  water: { label: "Water Leakage / Flooding", icon: "💧", color: "#3b82f6", mapColor: "#3b82f6" },
  streetlight: { label: "Streetlight Outage", icon: "💡", color: "#eab308", mapColor: "#eab308" },
  pollution: { label: "Pollution / Air Quality", icon: "🌫️", color: "#8b5cf6", mapColor: "#8b5cf6" },
  safety: { label: "Safety Hazard", icon: "⚠️", color: "#ec4899", mapColor: "#ec4899" },
  encroachment: { label: "Encroachment / Obstruction", icon: "🚫", color: "#14b8a6", mapColor: "#14b8a6" },
  drainage: { label: "Drainage / Sewage", icon: "🔧", color: "#64748b", mapColor: "#64748b" }
};

const SEVERITY_LEVELS = {
  critical: { label: "Critical", score: 4, color: "#dc2626", bg: "#fee2e2" },
  high: { label: "High", score: 3, color: "#ea580c", bg: "#ffedd5" },
  medium: { label: "Medium", score: 2, color: "#ca8a04", bg: "#fefce8" },
  low: { label: "Low", score: 1, color: "#16a34a", bg: "#f0fdf4" }
};

const STATUS_FLOW = {
  reported: { label: "Reported", color: "#6b7280", next: "verified" },
  verified: { label: "Verified", color: "#3b82f6", next: "assigned" },
  assigned: { label: "Assigned", color: "#8b5cf6", next: "in_progress" },
  in_progress: { label: "In Progress", color: "#f97316", next: "resolved" },
  resolved: { label: "Resolved", color: "#16a34a", next: null }
};

const DEPARTMENTS = [
  "Roads & Infrastructure Department",
  "Sanitation & Waste Management",
  "Water Supply Department",
  "Electrical & Streetlighting",
  "Environment & Pollution Control",
  "Public Safety Department",
  "Town Planning Department",
  "Drainage & Sewage Department"
];

// Seed reports — 45 demo civic issues
const SEED_REPORTS = [
  {
    id: "RPT-001",
    title: "Large pothole near Civil Lines crossing — accident risk",
    description: "A very large pothole, approximately 2 feet wide and 6 inches deep, has developed at the main intersection near Civil Lines post office. Two scooter riders have already had near-misses. It is especially dangerous at night.",
    category: "pothole",
    severity: "critical",
    status: "in_progress",
    neighborhood: "Civil Lines",
    location: { lat: 21.1521, lng: 79.0842, address: "Near Civil Lines Post Office, Nagpur" },
    reportedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen A",
    upvotes: 34,
    aiAnalysis: {
      title: "Critical Road Hazard — Deep Pothole at Major Intersection",
      summary: "A deep, wide pothole at a busy intersection poses significant accident risk, particularly for two-wheelers. Requires urgent patching.",
      severity: "critical",
      severityExplanation: "Intersection location + near-miss incidents + depth indicate high injury risk.",
      department: "Roads & Infrastructure Department",
      nextAction: "Deploy road crew within 24 hours for emergency patching. Place warning cones immediately.",
      publicSafetyRisk: "High — two-wheelers at serious risk of loss of control.",
      confidence: 0.91,
      needsHumanReview: false
    },
    priorityScore: 92,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Verified on-site. Pothole confirmed critical. Crew dispatched." },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Sharma", text: "Temporary patching done. Permanent repair scheduled for next week." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-002",
    title: "Overflowing garbage dump near Dharampeth market",
    description: "The garbage collection point near Dharampeth vegetable market has not been cleared for over a week. Waste is overflowing onto the footpath. Strong smell and flies are visible. Area residents are very upset.",
    category: "garbage",
    severity: "high",
    status: "assigned",
    neighborhood: "Dharampeth",
    location: { lat: 21.1398, lng: 79.0789, address: "Dharampeth Vegetable Market Area, Nagpur" },
    reportedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen B",
    upvotes: 28,
    aiAnalysis: {
      title: "Overflowing Garbage — Market Area Health Hazard",
      summary: "Week-old uncollected waste at a busy market is a public health risk. Urgent sanitation clearance needed.",
      severity: "high",
      severityExplanation: "High footfall area + week of accumulation + health risk indicators.",
      department: "Sanitation & Waste Management",
      nextAction: "Schedule immediate special collection. Increase frequency for this location.",
      publicSafetyRisk: "Medium — potential disease vector if not addressed.",
      confidence: 0.88,
      needsHumanReview: false
    },
    priorityScore: 78,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Report verified. Special collection van assigned." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-003",
    title: "Water main burst — road flooding on Sadar Bazar stretch",
    description: "A water main appears to have burst near Sadar Bazar. Water is gushing out and flooding the road for approximately 100 metres. Traffic has slowed. The water is clean but waste is accumulating. This has been going on since morning.",
    category: "water",
    severity: "critical",
    status: "resolved",
    neighborhood: "Sadar",
    location: { lat: 21.1466, lng: 79.0912, address: "Sadar Bazar Main Road, Nagpur" },
    reportedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen C",
    upvotes: 51,
    aiAnalysis: {
      title: "Burst Water Main — Road Flooding Emergency",
      summary: "Active water main burst causing road flooding. Immediate utility response required to prevent water waste and traffic hazard.",
      severity: "critical",
      severityExplanation: "Active leak + road flooding + traffic disruption = high urgency.",
      department: "Water Supply Department",
      nextAction: "Dispatch plumbing crew immediately. Isolate section if necessary.",
      publicSafetyRisk: "High — flooding creates slip hazard and traffic risk.",
      confidence: 0.94,
      needsHumanReview: false
    },
    priorityScore: 95,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Crew dispatched. Road closure in place." },
      { timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Pipe repaired. Road reopened. Issue resolved." }
    ],
    resolutionSummary: "Water main repaired within 3 hours of report. Road surface dried within 6 hours.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-004",
    title: "Three streetlights out on Seminary Hills road",
    description: "The stretch of road going up Seminary Hills has three consecutive streetlights that are not working. This makes the road very dark at night and it is a popular walking area. Please fix urgently.",
    category: "streetlight",
    severity: "high",
    status: "verified",
    neighborhood: "Seminary Hills",
    location: { lat: 21.1612, lng: 79.0756, address: "Seminary Hills Main Road, Nagpur" },
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen D",
    upvotes: 19,
    aiAnalysis: {
      title: "Multiple Streetlight Outages — Dark Pedestrian Route",
      summary: "Three consecutive non-functional streetlights on a walking route create significant nighttime safety risk.",
      severity: "high",
      severityExplanation: "Popular pedestrian area + multiple lights out + night-time safety risk.",
      department: "Electrical & Streetlighting",
      nextAction: "Send electrical inspection team. Replace bulbs/fuses within 48 hours.",
      publicSafetyRisk: "Medium-High — pedestrians at risk after dark.",
      confidence: 0.86,
      needsHumanReview: false
    },
    priorityScore: 71,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Singh", text: "Verified. Electrical team notified. Parts on order." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-005",
    title: "Heavy industrial smoke from factory near Kamptee Road",
    description: "A factory near Kamptee Road is emitting very thick black smoke constantly since yesterday evening. Residents nearby are coughing and air quality is visibly poor. Children and elderly people are affected.",
    category: "pollution",
    severity: "critical",
    status: "reported",
    neighborhood: "Kamptee Road",
    location: { lat: 21.1689, lng: 79.1124, address: "Industrial Area, Kamptee Road, Nagpur" },
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen E",
    upvotes: 42,
    aiAnalysis: {
      title: "Industrial Air Pollution — Health Emergency in Residential Area",
      summary: "Continuous thick black smoke emission near residential area. Immediate environmental enforcement action required.",
      severity: "critical",
      severityExplanation: "Ongoing emissions + health symptoms reported + vulnerable residents affected.",
      department: "Environment & Pollution Control",
      nextAction: "Deploy pollution control officer for site inspection. Issue stop-work notice if violations confirmed by on-site inspection.",
      publicSafetyRisk: "High — respiratory health risk for nearby residents.",
      confidence: 0.83,
      needsHumanReview: true
    },
    priorityScore: 88,
    priorityLabel: "Critical",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-006",
    title: "Pothole cluster on Sitabuldi flyover approach",
    description: "Multiple potholes have appeared on the road approaching the Sitabuldi flyover. At least 5-6 potholes in a 50-metre stretch. Vehicles are swerving dangerously to avoid them.",
    category: "pothole",
    severity: "high",
    status: "in_progress",
    neighborhood: "Sitabuldi",
    location: { lat: 21.1441, lng: 79.0849, address: "Sitabuldi Flyover Approach, Nagpur" },
    reportedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen F",
    upvotes: 27,
    aiAnalysis: {
      title: "Multiple Potholes — Flyover Approach Dangerous for Traffic",
      summary: "Cluster of 5-6 potholes near flyover causing dangerous swerving. Road surface has seriously deteriorated.",
      severity: "high",
      severityExplanation: "Multiple potholes + high traffic flyover approach + dangerous vehicle maneuvers.",
      department: "Roads & Infrastructure Department",
      nextAction: "Emergency road patching team. Place warning cones/signs immediately.",
      publicSafetyRisk: "High — risk of collision due to swerving vehicles.",
      confidence: 0.89,
      needsHumanReview: false
    },
    priorityScore: 82,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Crew deployed with cones. Patching in progress." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-007",
    title: "Illegal dumping near Gandhibagh drainage nala",
    description: "Construction debris and plastic waste is being dumped into the drainage nala near Gandhibagh. This will cause blockages during monsoon. Locals have seen this happening at night.",
    category: "garbage",
    severity: "medium",
    status: "reported",
    neighborhood: "Gandhibagh",
    location: { lat: 21.1381, lng: 79.0934, address: "Gandhibagh Drainage Nala, Nagpur" },
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen G",
    upvotes: 15,
    aiAnalysis: {
      title: "Illegal Dumping into Drainage Channel — Flood Risk",
      summary: "Construction debris and plastic being dumped in a drainage nala. Pre-monsoon clearance urgently needed.",
      severity: "medium",
      severityExplanation: "Pre-monsoon period makes drainage blockage risk higher than usual.",
      department: "Drainage & Sewage Department",
      nextAction: "Clear nala, install CCTV for anti-dumping surveillance, issue notice to identified violators after on-site investigation.",
      publicSafetyRisk: "Medium — flooding risk during rains.",
      confidence: 0.79,
      needsHumanReview: true
    },
    priorityScore: 58,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-008",
    title: "Manhole cover missing on Itwari pedestrian lane",
    description: "A manhole cover is completely missing from a pedestrian lane in Itwari. The opening is approximately 2 feet wide. A child could easily fall in. It has been like this for at least 3 days.",
    category: "safety",
    severity: "critical",
    status: "assigned",
    neighborhood: "Itwari",
    location: { lat: 21.1342, lng: 79.0891, address: "Itwari Pedestrian Lane, near Clock Tower, Nagpur" },
    reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen H",
    upvotes: 38,
    aiAnalysis: {
      title: "Missing Manhole Cover — Immediate Child Safety Risk",
      summary: "An open manhole on a pedestrian path is an immediate fall hazard, especially for children. Emergency barricading and cover replacement needed.",
      severity: "critical",
      severityExplanation: "Open manhole + pedestrian lane + child risk + 3-day duration = highest priority.",
      department: "Drainage & Sewage Department",
      nextAction: "Immediately barricade the opening. Replace cover within 24 hours.",
      publicSafetyRisk: "Critical — serious injury or death risk from fall.",
      confidence: 0.96,
      needsHumanReview: false
    },
    priorityScore: 97,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Barricades placed. Cover replacement team assigned." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-009",
    title: "Sewage overflow on Laxmi Nagar residential street",
    description: "Sewage from an overflowing drain is flowing into the residential street in Laxmi Nagar. The smell is unbearable and people cannot walk on the street. Several residents are worried about disease.",
    category: "drainage",
    severity: "high",
    status: "in_progress",
    neighborhood: "Laxmi Nagar",
    location: { lat: 21.1478, lng: 79.1032, address: "Laxmi Nagar Colony, Lane 4, Nagpur" },
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen I",
    upvotes: 31,
    aiAnalysis: {
      title: "Sewage Overflow — Residential Street Health Emergency",
      summary: "Overflowing sewage in a residential area creates serious public health risk. Immediate drainage clearance needed.",
      severity: "high",
      severityExplanation: "Sewage in residential street + health complaints + access obstruction.",
      department: "Drainage & Sewage Department",
      nextAction: "Deploy suction tanker. Inspect and clear blockage in main drain line.",
      publicSafetyRisk: "High — disease risk from sewage exposure.",
      confidence: 0.91,
      needsHumanReview: false
    },
    priorityScore: 84,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Deshmukh", text: "Suction tanker deployed. Main line blockage found and cleared partially." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-010",
    title: "Encroachment on footpath outside Bajaj Nagar school",
    description: "A vendor has set up a permanent stall blocking the entire footpath outside a school in Bajaj Nagar. Students and parents are forced to walk on the road during school hours. Very dangerous.",
    category: "encroachment",
    severity: "medium",
    status: "reported",
    neighborhood: "Bajaj Nagar",
    location: { lat: 21.1325, lng: 79.0768, address: "Near Government School, Bajaj Nagar, Nagpur" },
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen J",
    upvotes: 22,
    aiAnalysis: {
      title: "Footpath Encroachment Near School — Child Safety Risk",
      summary: "Vendor blocking school footpath forces children onto road. Requires town planning enforcement.",
      severity: "medium",
      severityExplanation: "School zone + child safety + pedestrian road risk.",
      department: "Town Planning Department",
      nextAction: "Inspect encroachment. Issue notice. Coordinate with school timings for enforcement.",
      publicSafetyRisk: "Medium — children walking on road near school.",
      confidence: 0.84,
      needsHumanReview: false
    },
    priorityScore: 62,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-011",
    title: "Road pothole near Civil Lines hospital — ambulance risk",
    description: "A significant pothole near Civil Lines hospital entrance is causing problems for ambulances. The jolt is severe enough to affect patients being transported. Needs urgent repair.",
    category: "pothole",
    severity: "critical",
    status: "verified",
    neighborhood: "Civil Lines",
    location: { lat: 21.1534, lng: 79.0854, address: "Near Civil Lines Government Hospital, Nagpur" },
    reportedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen K",
    upvotes: 47,
    aiAnalysis: {
      title: "Pothole at Hospital Entrance — Emergency Vehicle Risk",
      summary: "Pothole near hospital entrance impacts ambulance operations and patient safety. Top priority repair needed.",
      severity: "critical",
      severityExplanation: "Hospital access route + ambulance impact + patient safety risk.",
      department: "Roads & Infrastructure Department",
      nextAction: "Emergency patching within 12 hours given hospital proximity.",
      publicSafetyRisk: "Critical — disrupts emergency medical access.",
      confidence: 0.93,
      needsHumanReview: false
    },
    priorityScore: 96,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Escalated to Roads Department head. Emergency crew on way." }
    ],
    duplicateOf: "RPT-001",
    isDemo: true
  },
  {
    id: "RPT-012",
    title: "Street dog menace near Manish Nagar park",
    description: "A large pack of stray dogs has been aggressive near the public park in Manish Nagar. Three children were chased last week. Morning walkers are afraid to use the park.",
    category: "safety",
    severity: "high",
    status: "reported",
    neighborhood: "Manish Nagar",
    location: { lat: 21.1289, lng: 79.0823, address: "Manish Nagar Public Park, Nagpur" },
    reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen L",
    upvotes: 29,
    aiAnalysis: {
      title: "Aggressive Stray Dog Pack Near Children's Park",
      summary: "Pack of aggressive stray dogs near public park poses risk to children and elderly. ABC program intervention needed.",
      severity: "high",
      severityExplanation: "Children affected + multiple incidents + public park location.",
      department: "Public Safety Department",
      nextAction: "Deploy animal control team for assessment and ABC (Animal Birth Control) program referral.",
      publicSafetyRisk: "High — risk of dog bite, especially for children.",
      confidence: 0.82,
      needsHumanReview: true
    },
    priorityScore: 73,
    priorityLabel: "High",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-013",
    title: "No street lights on Pratap Nagar colony road",
    description: "The entire internal road of Pratap Nagar colony has been without streetlighting for two weeks. Residents are using mobile phone torches to walk at night. Two incidents of chain snatching reported in the area.",
    category: "streetlight",
    severity: "high",
    status: "assigned",
    neighborhood: "Pratap Nagar",
    location: { lat: 21.1213, lng: 79.0912, address: "Pratap Nagar Colony Internal Road, Nagpur" },
    reportedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen M",
    upvotes: 35,
    aiAnalysis: {
      title: "Colony-Wide Streetlight Failure — Crime Risk",
      summary: "Complete darkness in residential colony for 2 weeks. Crime incidents reported. Urgent electrical repair needed.",
      severity: "high",
      severityExplanation: "2-week outage + crime incidents + residential safety.",
      department: "Electrical & Streetlighting",
      nextAction: "Inspect main distribution board. Restore lighting within 24 hours.",
      publicSafetyRisk: "High — darkness linked to reported crime incidents.",
      confidence: 0.87,
      needsHumanReview: false
    },
    priorityScore: 79,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Singh", text: "Electrical team assigned. Transformer fault identified." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-014",
    title: "Open garbage burning near Wardhaman Nagar",
    description: "Municipal workers appear to be burning garbage in an open area near Wardhaman Nagar. The smoke is affecting residents and there are children playing nearby. This practice should be stopped.",
    category: "pollution",
    severity: "medium",
    status: "reported",
    neighborhood: "Wardhaman Nagar",
    location: { lat: 21.1178, lng: 79.0734, address: "Wardhaman Nagar Waste Ground, Nagpur" },
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen N",
    upvotes: 18,
    aiAnalysis: {
      title: "Open Waste Burning — Air Quality and Health Violation",
      summary: "Open garbage burning violates environmental norms. Smoke affecting nearby children. Sanitation department must use designated disposal instead.",
      severity: "medium",
      severityExplanation: "Environmental violation + children exposed + residential area.",
      department: "Environment & Pollution Control",
      nextAction: "Stop burning immediately. Route waste to designated disposal site.",
      publicSafetyRisk: "Medium — air quality impact on children and elderly.",
      confidence: 0.81,
      needsHumanReview: true
    },
    priorityScore: 56,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-015",
    title: "Road cave-in near Bhandara Road — vehicle stuck",
    description: "A section of road near Bhandara Road has caved in, creating a pit approximately 4 feet deep. A small vehicle almost fell in earlier today. The area is cordoned off by locals using stones but no official barricades.",
    category: "safety",
    severity: "critical",
    status: "in_progress",
    neighborhood: "Bhandara Road",
    location: { lat: 21.1089, lng: 79.1234, address: "Bhandara Road, Near Toll Naka, Nagpur" },
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen O",
    upvotes: 55,
    aiAnalysis: {
      title: "Road Cave-In — Immediate Vehicle and Pedestrian Hazard",
      summary: "Deep road cave-in near active road requires immediate official barricading and emergency repair.",
      severity: "critical",
      severityExplanation: "4-foot pit + near-miss vehicle incident + unofficial barricades only.",
      department: "Roads & Infrastructure Department",
      nextAction: "Official barricading immediately. Assess structural cause. Repair within 48 hours.",
      publicSafetyRisk: "Critical — risk of vehicle falling into pit.",
      confidence: 0.95,
      needsHumanReview: false
    },
    priorityScore: 98,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Official barricades placed. Infrastructure team en route for assessment." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-016",
    title: "Stagnant water breeding mosquitoes in Hingna Road locality",
    description: "A large puddle of stagnant water has formed near Hingna Road due to poor drainage. It has been there for over 10 days and mosquitoes are visibly breeding there. Multiple residents have reported dengue fever in the area.",
    category: "water",
    severity: "high",
    status: "reported",
    neighborhood: "Hingna Road",
    location: { lat: 21.0987, lng: 79.0623, address: "Hingna Road, Near Shivaji Chowk, Nagpur" },
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen P",
    upvotes: 44,
    aiAnalysis: {
      title: "Stagnant Water — Active Mosquito Breeding Site",
      summary: "10-day-old stagnant water with reported dengue cases nearby. Health department and drainage team both need to act.",
      severity: "high",
      severityExplanation: "10+ days stagnant + visible mosquito breeding + dengue reports nearby.",
      department: "Drainage & Sewage Department",
      nextAction: "Drain stagnant water. Apply anti-larval treatment. Notify health department of dengue risk.",
      publicSafetyRisk: "High — active disease vector.",
      confidence: 0.88,
      needsHumanReview: false
    },
    priorityScore: 81,
    priorityLabel: "High",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-017",
    title: "Pothole on Civil Lines main road — second report",
    description: "Reporting again about the big pothole near Civil Lines post office. Still not fixed. My auto-rickshaw tyre burst this morning because of it.",
    category: "pothole",
    severity: "critical",
    status: "reported",
    neighborhood: "Civil Lines",
    location: { lat: 21.1518, lng: 79.0838, address: "Civil Lines Post Office Road, Nagpur" },
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen Q",
    upvotes: 12,
    aiAnalysis: {
      title: "Repeat Report — Civil Lines Pothole Still Unresolved",
      summary: "Second citizen report about same pothole. Tyre burst incident confirms continued severity.",
      severity: "critical",
      severityExplanation: "Escalated urgency due to vehicle damage incident reported.",
      department: "Roads & Infrastructure Department",
      nextAction: "Expedite repair for RPT-001. Mark as high-urgency duplicate.",
      publicSafetyRisk: "High — vehicle damage confirmed.",
      confidence: 0.94,
      needsHumanReview: false
    },
    priorityScore: 90,
    priorityLabel: "Critical",
    updates: [],
    duplicateOf: "RPT-001",
    isDemo: true
  },
  {
    id: "RPT-018",
    title: "Garbage not collected in Sadar for 5 days",
    description: "Our area in Sadar has not had garbage collection for 5 days. Residents are leaving garbage bags on the street as bins are full. Dogs are tearing the bags and spreading waste everywhere.",
    category: "garbage",
    severity: "medium",
    status: "resolved",
    neighborhood: "Sadar",
    location: { lat: 21.1450, lng: 79.0920, address: "Sadar Colony Residential Area, Nagpur" },
    reportedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen R",
    upvotes: 21,
    aiAnalysis: {
      title: "5-Day Garbage Collection Failure — Residential Area",
      summary: "Extended collection disruption causing hygiene problems. Route supervisor action needed.",
      severity: "medium",
      severityExplanation: "5-day gap + secondary waste spread by animals.",
      department: "Sanitation & Waste Management",
      nextAction: "Dispatch emergency collection. Investigate route disruption cause.",
      publicSafetyRisk: "Medium — health and hygiene impact.",
      confidence: 0.85,
      needsHumanReview: false
    },
    priorityScore: 55,
    priorityLabel: "Medium",
    updates: [
      { timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Extra collection vehicle deployed." },
      { timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Area cleared. Normal schedule resumed." }
    ],
    resolutionSummary: "Emergency collection completed. Route schedule adjusted.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-019",
    title: "Tree fallen on road after storm — Seminary Hills",
    description: "A large tree fell on the road leading to Seminary Hills during last night's storm. One lane is completely blocked. Traffic is crawling. The tree has broken electric wires as well.",
    category: "safety",
    severity: "critical",
    status: "resolved",
    neighborhood: "Seminary Hills",
    location: { lat: 21.1598, lng: 79.0761, address: "Seminary Hills Road, Nagpur" },
    reportedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen S",
    upvotes: 33,
    aiAnalysis: {
      title: "Storm Debris — Fallen Tree with Downed Power Lines",
      summary: "Tree blocking road with downed electrical wires. Dual-department emergency response needed.",
      severity: "critical",
      severityExplanation: "Fallen power lines + road blockage = combined electrocution and traffic risk.",
      department: "Roads & Infrastructure Department",
      nextAction: "Coordinate Roads and Electrical departments. DO NOT approach downed wires. Evacuate 20m radius.",
      publicSafetyRisk: "Critical — live electrical wire hazard.",
      confidence: 0.97,
      needsHumanReview: false
    },
    priorityScore: 99,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Tree removed. Electrical team repaired wires. Road cleared." }
    ],
    resolutionSummary: "Emergency resolved within 4 hours. Both departments coordinated effectively.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-020",
    title: "Water supply contamination smell in Dharampeth area",
    description: "The tap water in our area of Dharampeth has a foul smell since yesterday. Several neighbors have noticed it. We are afraid to drink or cook with this water. Please test it urgently.",
    category: "water",
    severity: "high",
    status: "verified",
    neighborhood: "Dharampeth",
    location: { lat: 21.1405, lng: 79.0781, address: "Dharampeth Residential Colony, Nagpur" },
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen T",
    upvotes: 39,
    aiAnalysis: {
      title: "Potential Water Supply Contamination — Health Risk",
      summary: "Foul-smelling tap water across multiple households. Water testing and supply inspection urgently needed.",
      severity: "high",
      severityExplanation: "Multiple households + foul smell + potential health risk from contaminated water.",
      department: "Water Supply Department",
      nextAction: "Issue advisory to boil water. Deploy water testing team within 24 hours. Inspect treatment plant output.",
      publicSafetyRisk: "High — drinking contaminated water risk.",
      confidence: 0.86,
      needsHumanReview: true
    },
    priorityScore: 85,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Water testing team deployed. Boil-water advisory issued for the area." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-021",
    title: "Damaged footpath creates tripping hazard in Laxmi Nagar",
    description: "The footpath along the main road in Laxmi Nagar has multiple broken tiles and exposed metal rods sticking out. Two elderly people have already tripped. Very dangerous especially during rains.",
    category: "safety",
    severity: "medium",
    status: "reported",
    neighborhood: "Laxmi Nagar",
    location: { lat: 21.1489, lng: 79.1041, address: "Laxmi Nagar Main Road Footpath, Nagpur" },
    reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen U",
    upvotes: 16,
    aiAnalysis: null,
    priorityScore: 52,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-022",
    title: "Clogged drain causing flooding in Bajaj Nagar",
    description: "The main drain on the commercial strip in Bajaj Nagar is completely clogged. Every time it rains, the entire road floods 1-2 feet deep. Shopkeepers lose business. Vehicles get stranded.",
    category: "drainage",
    severity: "high",
    status: "in_progress",
    neighborhood: "Bajaj Nagar",
    location: { lat: 21.1316, lng: 79.0756, address: "Bajaj Nagar Commercial Street, Nagpur" },
    reportedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen V",
    upvotes: 43,
    aiAnalysis: null,
    priorityScore: 76,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Deshmukh", text: "Drain inspection completed. Major blockage found. Clearance in progress." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-023",
    title: "Pothole near Itwari railway station auto stand",
    description: "Large pothole at the auto rickshaw stand near Itwari station. Autos are bottoming out. Several autos have suffered tyre damage. The area is always busy and the pothole keeps growing.",
    category: "pothole",
    severity: "medium",
    status: "resolved",
    neighborhood: "Itwari",
    location: { lat: 21.1358, lng: 79.0879, address: "Itwari Railway Station Auto Stand, Nagpur" },
    reportedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen W",
    upvotes: 24,
    aiAnalysis: null,
    priorityScore: 61,
    priorityLabel: "Medium",
    updates: [
      { timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Pothole repaired." }
    ],
    resolutionSummary: "Pothole patched with hot-mix asphalt.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-024",
    title: "Abandoned construction material blocking road — Gandhibagh",
    description: "Building materials including sand, bricks and iron rods are abandoned on the road in Gandhibagh for the past week. Vehicles cannot pass properly. No contractor or owner in sight.",
    category: "encroachment",
    severity: "medium",
    status: "reported",
    neighborhood: "Gandhibagh",
    location: { lat: 21.1372, lng: 79.0948, address: "Gandhibagh Colony Road, Nagpur" },
    reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen X",
    upvotes: 11,
    aiAnalysis: null,
    priorityScore: 48,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-025",
    title: "Vehicle exhaust pollution near Kamptee Road school bus stop",
    description: "Heavy vehicles idling near the school bus stop on Kamptee Road are creating serious pollution. Children wait there every morning breathing diesel exhaust. No enforcement of no-idling rules.",
    category: "pollution",
    severity: "medium",
    status: "reported",
    neighborhood: "Kamptee Road",
    location: { lat: 21.1678, lng: 79.1098, address: "Kamptee Road School Bus Stop, Nagpur" },
    reportedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen Y",
    upvotes: 20,
    aiAnalysis: null,
    priorityScore: 53,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-026",
    title: "Crumbling compound wall — public safety risk in Sitabuldi",
    description: "The compound wall of an old government building in Sitabuldi is visibly crumbling. Chunks of brick and plaster have fallen on the footpath below. People walk past constantly and it is only a matter of time before someone is injured.",
    category: "safety",
    severity: "high",
    status: "assigned",
    neighborhood: "Sitabuldi",
    location: { lat: 21.1432, lng: 79.0856, address: "Near Old PWD Building, Sitabuldi, Nagpur" },
    reportedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen Z",
    upvotes: 26,
    aiAnalysis: null,
    priorityScore: 74,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Sharma", text: "Temporary fencing placed. Structural assessment team assigned." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-027",
    title: "Water logging near Wardhaman Nagar underpass",
    description: "The underpass near Wardhaman Nagar fills completely with water during rain. Cars and two-wheelers are getting stuck and sometimes submerged. This has been a recurring problem for 3 monsoon seasons.",
    category: "drainage",
    severity: "critical",
    status: "reported",
    neighborhood: "Wardhaman Nagar",
    location: { lat: 21.1189, lng: 79.0741, address: "Wardhaman Nagar Underpass, Nagpur" },
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen AA",
    upvotes: 67,
    aiAnalysis: null,
    priorityScore: 87,
    priorityLabel: "Critical",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-028",
    title: "No garbage collection in Manish Nagar slum pocket",
    description: "The informal settlement pocket in Manish Nagar has not received any sanitation service for the past month. Waste is piling up. Children play near it. Burning is happening due to desperation.",
    category: "garbage",
    severity: "high",
    status: "in_progress",
    neighborhood: "Manish Nagar",
    location: { lat: 21.1275, lng: 79.0834, address: "Manish Nagar Informal Settlement, Nagpur" },
    reportedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen BB",
    upvotes: 52,
    aiAnalysis: null,
    priorityScore: 79,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Route extended to cover this area. First collection done." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-029",
    title: "Bright LED billboard blinding drivers at night — Bhandara Road",
    description: "A newly installed billboard on Bhandara Road has extremely bright LED lights that directly face oncoming traffic at night. Drivers are being blinded momentarily. There have been near-miss accidents.",
    category: "safety",
    severity: "medium",
    status: "reported",
    neighborhood: "Bhandara Road",
    location: { lat: 21.1098, lng: 79.1218, address: "Bhandara Road National Highway, Nagpur" },
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen CC",
    upvotes: 17,
    aiAnalysis: null,
    priorityScore: 60,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-030",
    title: "Pothole on Hingna Road near school — children at risk",
    description: "A dangerous pothole on the main road near a school in Hingna Road area. Children cross here every day. The pothole gets filled with water when it rains making it invisible and even more dangerous.",
    category: "pothole",
    severity: "high",
    status: "verified",
    neighborhood: "Hingna Road",
    location: { lat: 21.0978, lng: 79.0634, address: "Hingna Road School Zone, Nagpur" },
    reportedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen DD",
    upvotes: 31,
    aiAnalysis: null,
    priorityScore: 77,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Verified. School zone — elevated priority. Repair scheduled." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-031",
    title: "Broken public bench and lights in Sitabuldi garden",
    description: "The public garden near Sitabuldi market has broken benches and non-functional lights throughout. Families cannot use it safely after dusk. The garden is getting run-down generally.",
    category: "streetlight",
    severity: "low",
    status: "reported",
    neighborhood: "Sitabuldi",
    location: { lat: 21.1422, lng: 79.0863, address: "Sitabuldi Public Garden, Nagpur" },
    reportedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen EE",
    upvotes: 8,
    aiAnalysis: null,
    priorityScore: 32,
    priorityLabel: "Low",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-032",
    title: "Choked street drain — Itwari lane floods with every rain",
    description: "The street drain in the narrow lane behind Itwari market chokes completely in every rain. The lane floods knee-deep. Residents have complained multiple times over the past 2 years with no lasting fix.",
    category: "drainage",
    severity: "high",
    status: "reported",
    neighborhood: "Itwari",
    location: { lat: 21.1349, lng: 79.0898, address: "Itwari Market Back Lane, Nagpur" },
    reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen FF",
    upvotes: 29,
    aiAnalysis: null,
    priorityScore: 72,
    priorityLabel: "High",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-033",
    title: "Drinking water pipe exposed and damaged — Kamptee Road",
    description: "A drinking water supply pipe is exposed and partially broken on Kamptee Road. Vehicles are rolling over it. The pipe could rupture fully at any time causing major water loss.",
    category: "water",
    severity: "high",
    status: "assigned",
    neighborhood: "Kamptee Road",
    location: { lat: 21.1701, lng: 79.1112, address: "Kamptee Road, Near Hanuman Temple, Nagpur" },
    reportedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen GG",
    upvotes: 22,
    aiAnalysis: null,
    priorityScore: 75,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Rao", text: "Water supply team assigned. Temporary protective cover placed." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-034",
    title: "Footpath encroachment by shops — entire pedestrian way blocked near Gandhibagh",
    description: "Almost every shop on the main road near Gandhibagh has extended its goods onto the footpath completely blocking it. Pedestrians including the elderly and disabled walk on the road.",
    category: "encroachment",
    severity: "medium",
    status: "verified",
    neighborhood: "Gandhibagh",
    location: { lat: 21.1364, lng: 79.0926, address: "Gandhibagh Main Commercial Road, Nagpur" },
    reportedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen HH",
    upvotes: 14,
    aiAnalysis: null,
    priorityScore: 51,
    priorityLabel: "Medium",
    updates: [
      { timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Sharma", text: "Verified. Enforcement drive planned." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-035",
    title: "Chemical smell from drain — Laxmi Nagar",
    description: "A strong chemical or sewage smell is coming from drains near our house in Laxmi Nagar. It is stronger than usual sewage smell. Residents worry about industrial discharge entering the drain.",
    category: "pollution",
    severity: "high",
    status: "reported",
    neighborhood: "Laxmi Nagar",
    location: { lat: 21.1467, lng: 79.1024, address: "Laxmi Nagar Drain Junction, Nagpur" },
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen II",
    upvotes: 19,
    aiAnalysis: null,
    priorityScore: 69,
    priorityLabel: "High",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-036",
    title: "Pothole on Wardhaman Nagar main road — repeat report",
    description: "Reporting this pothole again. It was patched 3 months ago but the patch has broken and the pothole is back, now bigger than before. Poor quality patching material used.",
    category: "pothole",
    severity: "medium",
    status: "reported",
    neighborhood: "Wardhaman Nagar",
    location: { lat: 21.1171, lng: 79.0729, address: "Wardhaman Nagar Main Road, Nagpur" },
    reportedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen JJ",
    upvotes: 13,
    aiAnalysis: null,
    priorityScore: 50,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-037",
    title: "Broken park equipment — child injury risk in Dharampeth",
    description: "The children's play equipment in the Dharampeth neighbourhood park has several broken parts. A sharp metal edge is exposed on the slide. Children are still using it. High risk of injury.",
    category: "safety",
    severity: "high",
    status: "assigned",
    neighborhood: "Dharampeth",
    location: { lat: 21.1389, lng: 79.0774, address: "Dharampeth Neighbourhood Park, Nagpur" },
    reportedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen KK",
    upvotes: 25,
    aiAnalysis: null,
    priorityScore: 72,
    priorityLabel: "High",
    updates: [
      { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Singh", text: "Play equipment cordoned off. Repair team assigned." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-038",
    title: "Unauthorized banner causing traffic sign obstruction — Bajaj Nagar",
    description: "Multiple large political and advertising banners have been placed in Bajaj Nagar, completely obstructing a traffic signal and a stop sign. Drivers cannot see the signal properly.",
    category: "safety",
    severity: "medium",
    status: "resolved",
    neighborhood: "Bajaj Nagar",
    location: { lat: 21.1308, lng: 79.0762, address: "Bajaj Nagar Signal Junction, Nagpur" },
    reportedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen LL",
    upvotes: 10,
    aiAnalysis: null,
    priorityScore: 62,
    priorityLabel: "Medium",
    updates: [
      { timestamp: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Sharma", text: "Banners removed. Traffic signal visible again." }
    ],
    resolutionSummary: "Unauthorized banners removed within 3 days of report.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-039",
    title: "Pothole on Bhandara Road — truck damaged axle",
    description: "There is a very deep pothole on Bhandara Road that recently caused a loaded truck to damage its front axle. This pothole has been worsening with every rain. Needs proper repair not just patching.",
    category: "pothole",
    severity: "critical",
    status: "in_progress",
    neighborhood: "Bhandara Road",
    location: { lat: 21.1076, lng: 79.1242, address: "Bhandara Road Highway, Km Marker 12, Nagpur" },
    reportedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen MM",
    upvotes: 36,
    aiAnalysis: null,
    priorityScore: 85,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Mehta", text: "Damage confirmed. Full road repair, not patching, approved." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-040",
    title: "Garbage littering near Pratap Nagar bus stop",
    description: "The bus stop area in Pratap Nagar has become a major littering point. No dustbin nearby. Bus passengers leave garbage everywhere. Serious eyesore and hygiene problem.",
    category: "garbage",
    severity: "low",
    status: "resolved",
    neighborhood: "Pratap Nagar",
    location: { lat: 21.1224, lng: 79.0918, address: "Pratap Nagar Bus Stop, Nagpur" },
    reportedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen NN",
    upvotes: 7,
    aiAnalysis: null,
    priorityScore: 28,
    priorityLabel: "Low",
    updates: [
      { timestamp: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Patil", text: "Two dustbins installed. Area cleaned." }
    ],
    resolutionSummary: "Dustbins installed. Anti-littering signage placed.",
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-041",
    title: "Cracked and uneven road surface — Sadar footpath danger",
    description: "The footpath surface on the main commercial street in Sadar is severely cracked and uneven. Tiles are loose and wobble underfoot. Multiple trips and falls have been reported. Very busy pedestrian stretch.",
    category: "safety",
    severity: "medium",
    status: "verified",
    neighborhood: "Sadar",
    location: { lat: 21.1457, lng: 79.0905, address: "Sadar Commercial Street Footpath, Nagpur" },
    reportedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen OO",
    upvotes: 18,
    aiAnalysis: null,
    priorityScore: 55,
    priorityLabel: "Medium",
    updates: [
      { timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Sharma", text: "Inspected. Loose tiles documented. Repair queued." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-042",
    title: "Street water pipe leaking near Hingna Road junction",
    description: "A street water pipe near the main Hingna Road junction has a visible leak. Water is constantly flowing onto the road surface, creating a slippery patch. The leakage has been ongoing for over a week.",
    category: "water",
    severity: "medium",
    status: "reported",
    neighborhood: "Hingna Road",
    location: { lat: 21.0992, lng: 79.0618, address: "Hingna Road Junction, Nagpur" },
    reportedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen PP",
    upvotes: 12,
    aiAnalysis: null,
    priorityScore: 46,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-043",
    title: "Night market blocking entire road — Sitabuldi",
    description: "An unauthorized night market has sprung up every evening in Sitabuldi and blocks the entire road for 3 hours. Traffic grinds to a halt. Emergency vehicles cannot pass through.",
    category: "encroachment",
    severity: "high",
    status: "reported",
    neighborhood: "Sitabuldi",
    location: { lat: 21.1448, lng: 79.0844, address: "Sitabuldi Zero Mile Road, Nagpur" },
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen QQ",
    upvotes: 34,
    aiAnalysis: null,
    priorityScore: 70,
    priorityLabel: "High",
    updates: [],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-044",
    title: "Faulty traffic signal — road accident risk near Civil Lines",
    description: "The traffic signal at the major Civil Lines intersection is not working properly. It gets stuck on red for one side for very long periods. Drivers are ignoring signals and near-collisions are happening daily.",
    category: "safety",
    severity: "critical",
    status: "assigned",
    neighborhood: "Civil Lines",
    location: { lat: 21.1526, lng: 79.0849, address: "Civil Lines Major Intersection, Nagpur" },
    reportedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen RR",
    upvotes: 49,
    aiAnalysis: null,
    priorityScore: 91,
    priorityLabel: "Critical",
    updates: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), author: "Officer Singh", text: "Traffic signal team dispatched. Controller unit being replaced." }
    ],
    duplicateOf: null,
    isDemo: true
  },
  {
    id: "RPT-045",
    title: "Pothole cluster — Wardhaman Nagar housing society road",
    description: "The internal road inside a housing society in Wardhaman Nagar has developed multiple potholes after recent rains. The society maintains that this is a public road and NMC should repair it. Society residents affected.",
    category: "pothole",
    severity: "medium",
    status: "reported",
    neighborhood: "Wardhaman Nagar",
    location: { lat: 21.1182, lng: 79.0745, address: "Wardhaman Nagar Housing Society Road, Nagpur" },
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reporterName: "Citizen SS",
    upvotes: 9,
    aiAnalysis: null,
    priorityScore: 42,
    priorityLabel: "Medium",
    updates: [],
    duplicateOf: null,
    isDemo: true
  }
];

// Activity feed
const SEED_ACTIVITY = [
  { id: 1, type: "report_new", reportId: "RPT-005", text: "New critical pollution report in Kamptee Road", time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 2, type: "status_change", reportId: "RPT-015", text: "Road cave-in on Bhandara Road marked In Progress", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 3, type: "report_new", reportId: "RPT-020", text: "Water contamination concern raised in Dharampeth", time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 4, type: "upvote", reportId: "RPT-027", text: "Wardhaman Nagar underpass flooding report gained 12 upvotes", time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: 5, type: "resolved", reportId: "RPT-003", text: "Sadar water main burst resolved within 3 hours", time: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 6, type: "report_new", reportId: "RPT-044", text: "Faulty traffic signal reported at Civil Lines", time: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 7, type: "status_change", reportId: "RPT-009", text: "Laxmi Nagar sewage overflow now In Progress", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 8, type: "resolved", reportId: "RPT-019", text: "Seminary Hills fallen tree emergency resolved", time: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString() }
];

// Predictive insights based on demo data
const PREDICTIVE_INSIGHTS = [
  {
    id: "INS-001",
    type: "hotspot",
    title: "Civil Lines — Recurring Road Infrastructure Failures",
    description: "Civil Lines has reported 3 pothole-related issues in the last 30 days, including a critical hospital-access pothole and a faulty traffic signal. The road subbase may need structural assessment.",
    neighborhood: "Civil Lines",
    category: "pothole",
    confidence: 0.87,
    trend: "increasing",
    dataPoints: 3,
    recommendation: "Commission a comprehensive road condition survey for Civil Lines. Consider full resurfacing rather than patching.",
    supportingReports: ["RPT-001", "RPT-011", "RPT-017"]
  },
  {
    id: "INS-002",
    type: "pattern",
    title: "Wardhaman Nagar — Chronic Drainage Failures",
    description: "Wardhaman Nagar has reported both a recurring underpass flooding issue (3rd consecutive monsoon) and general drainage problems. This suggests systemic drainage infrastructure deficit.",
    neighborhood: "Wardhaman Nagar",
    category: "drainage",
    confidence: 0.92,
    trend: "increasing",
    dataPoints: 2,
    recommendation: "Engage drainage engineers for a full capacity assessment of Wardhaman Nagar storm drain network before next monsoon.",
    supportingReports: ["RPT-027", "RPT-045"]
  },
  {
    id: "INS-003",
    type: "hotspot",
    title: "Kamptee Road — Industrial Pollution Cluster",
    description: "Two separate pollution complaints from Kamptee Road area — industrial smoke and vehicle exhaust near a school. This area may require environmental monitoring.",
    neighborhood: "Kamptee Road",
    category: "pollution",
    confidence: 0.78,
    trend: "increasing",
    dataPoints: 2,
    recommendation: "Install air quality sensor in Kamptee Road area. Schedule environmental compliance inspection for nearby industrial units.",
    supportingReports: ["RPT-005", "RPT-025"]
  },
  {
    id: "INS-004",
    type: "pattern",
    title: "Itwari — Recurring Drainage and Infrastructure Issues",
    description: "Itwari has seen a missing manhole cover, a choked drain causing flooding, and past pothole issues. The area's aging infrastructure may need comprehensive renewal.",
    neighborhood: "Itwari",
    category: "drainage",
    confidence: 0.81,
    trend: "stable",
    dataPoints: 3,
    recommendation: "Commission infrastructure condition audit for Itwari. Prioritize drainage and manhole inventory.",
    supportingReports: ["RPT-008", "RPT-023", "RPT-032"]
  },
  {
    id: "INS-005",
    type: "prediction",
    title: "Monsoon Pre-Alert — Drainage Hotspots",
    description: "Based on 6 active drainage and water-related reports across multiple neighborhoods, significant flooding risk exists in: Wardhaman Nagar underpass, Bajaj Nagar commercial street, Itwari back lane, and Gandhibagh nala.",
    neighborhood: "Multiple",
    category: "drainage",
    confidence: 0.84,
    trend: "increasing",
    dataPoints: 6,
    recommendation: "Pre-monsoon desilting drive in these 4 locations. Target completion 4 weeks before expected monsoon onset.",
    supportingReports: ["RPT-007", "RPT-022", "RPT-027", "RPT-032"]
  }
];

// App State Management
const AppState = {
  reports: [],
  activity: [],
  insights: PREDICTIVE_INSIGHTS,
  filters: { category: "all", severity: "all", status: "all", search: "" },
  currentView: "dashboard",
  darkMode: false,

  init() {
    const stored = localStorage.getItem("civicpulse_reports");
    const storedActivity = localStorage.getItem("civicpulse_activity");
    if (stored) {
      this.reports = JSON.parse(stored);
    } else {
      this.reports = JSON.parse(JSON.stringify(SEED_REPORTS));
      this.save();
    }
    if (storedActivity) {
      this.activity = JSON.parse(storedActivity);
    } else {
      this.activity = JSON.parse(JSON.stringify(SEED_ACTIVITY));
      this.saveActivity();
    }
    const dm = localStorage.getItem("civicpulse_darkmode");
    if (dm === "true") this.darkMode = true;
  },

  save() {
    localStorage.setItem("civicpulse_reports", JSON.stringify(this.reports));
  },

  saveActivity() {
    localStorage.setItem("civicpulse_activity", JSON.stringify(this.activity));
  },

  resetDemo() {
    this.reports = JSON.parse(JSON.stringify(SEED_REPORTS));
    this.activity = JSON.parse(JSON.stringify(SEED_ACTIVITY));
    this.save();
    this.saveActivity();
  },

  addReport(report) {
    this.reports.unshift(report);
    this.save();
    this.activity.unshift({
      id: Date.now(),
      type: "report_new",
      reportId: report.id,
      text: `New ${CATEGORIES[report.category].label} report in ${report.neighborhood}`,
      time: new Date().toISOString()
    });
    this.saveActivity();
  },

  updateReport(id, updates) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.reports[idx] = { ...this.reports[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
    }
  },

  addUpdate(reportId, update) {
    const idx = this.reports.findIndex(r => r.id === reportId);
    if (idx >= 0) {
      if (!this.reports[idx].updates) this.reports[idx].updates = [];
      this.reports[idx].updates.push(update);
      this.reports[idx].updatedAt = new Date().toISOString();
      this.save();
      this.activity.unshift({
        id: Date.now(),
        type: "status_change",
        reportId,
        text: `Status updated for ${this.reports[idx].title.substring(0, 40)}...`,
        time: new Date().toISOString()
      });
      this.saveActivity();
    }
  },

  upvoteReport(reportId) {
    const idx = this.reports.findIndex(r => r.id === reportId);
    if (idx >= 0) {
      this.reports[idx].upvotes = (this.reports[idx].upvotes || 0) + 1;
      this.save();
    }
  },

  getStats() {
    const total = this.reports.length;
    const open = this.reports.filter(r => r.status !== "resolved").length;
    const resolved = this.reports.filter(r => r.status === "resolved").length;
    const critical = this.reports.filter(r => r.severity === "critical" && r.status !== "resolved").length;

    // Avg resolution time in days
    const resolvedWithTime = this.reports.filter(r => r.resolvedAt && r.reportedAt);
    const avgResolution = resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((acc, r) => {
          const d = (new Date(r.resolvedAt) - new Date(r.reportedAt)) / (1000 * 60 * 60 * 24);
          return acc + d;
        }, 0) / resolvedWithTime.length
      : 0;

    return { total, open, resolved, critical, avgResolution: avgResolution.toFixed(1) };
  },

  getCategoryBreakdown() {
    const breakdown = {};
    Object.keys(CATEGORIES).forEach(cat => breakdown[cat] = 0);
    this.reports.forEach(r => { breakdown[r.category] = (breakdown[r.category] || 0) + 1; });
    return breakdown;
  },

  getStatusBreakdown() {
    const breakdown = {};
    Object.keys(STATUS_FLOW).forEach(s => breakdown[s] = 0);
    this.reports.forEach(r => { breakdown[r.status] = (breakdown[r.status] || 0) + 1; });
    return breakdown;
  },

  getNeighborhoodStats() {
    const stats = {};
    this.reports.forEach(r => {
      if (!stats[r.neighborhood]) stats[r.neighborhood] = { total: 0, resolved: 0, critical: 0 };
      stats[r.neighborhood].total++;
      if (r.status === "resolved") stats[r.neighborhood].resolved++;
      if (r.severity === "critical") stats[r.neighborhood].critical++;
    });
    return stats;
  },

  getTrends() {
    // Reports by day for last 30 days
    const now = Date.now();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = now - (i + 1) * 24 * 60 * 60 * 1000;
      const dayEnd = now - i * 24 * 60 * 60 * 1000;
      const count = this.reports.filter(r => {
        const t = new Date(r.reportedAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;
      const d = new Date(dayEnd);
      days.push({ date: `${d.getDate()}/${d.getMonth() + 1}`, count });
    }
    return days;
  },

  findDuplicates(description, category, location) {
    const threshold = 0.3;
    const candidates = [];
    const descWords = new Set(description.toLowerCase().split(/\s+/).filter(w => w.length > 3));

    this.reports.forEach(r => {
      if (r.status === "resolved") return;
      if (r.category !== category) return;

      const rWords = new Set(r.description.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      const intersection = [...descWords].filter(w => rWords.has(w)).length;
      const union = new Set([...descWords, ...rWords]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      // Location proximity
      const dist = Math.sqrt(
        Math.pow((r.location.lat - location.lat) * 111, 2) +
        Math.pow((r.location.lng - location.lng) * 111 * Math.cos(location.lat * Math.PI / 180), 2)
      );

      const score = jaccard * 0.6 + (dist < 0.5 ? 0.4 : dist < 1 ? 0.2 : 0);
      if (score >= threshold) candidates.push({ report: r, score: Math.min(score, 1) });
    });

    return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
  },

  generateId() {
    const existing = this.reports.map(r => parseInt(r.id.replace("RPT-", ""), 10));
    const max = existing.length > 0 ? Math.max(...existing) : 0;
    return `RPT-${String(max + 1).padStart(3, "0")}`;
  }
};

// AI Demo Analysis
const AIAnalysis = {
  analyzeInDemoMode(category, description, location) {
    const cat = CATEGORIES[category] || CATEGORIES.pothole;
    const descLower = description.toLowerCase();

    const criticalKeywords = ["accident", "injury", "child", "emergency", "burst", "collapse", "cave", "fallen", "fire", "electr", "missing cover", "manhole"];
    const highKeywords = ["dangerous", "risk", "blocked", "overflow", "flooding", "severe", "burning"];

    let severity = "medium";
    let priorityScore = 50;

    if (criticalKeywords.some(k => descLower.includes(k))) {
      severity = "critical";
      priorityScore = Math.floor(Math.random() * 15) + 82;
    } else if (highKeywords.some(k => descLower.includes(k))) {
      severity = "high";
      priorityScore = Math.floor(Math.random() * 15) + 65;
    } else if (descLower.includes("minor") || descLower.includes("small") || descLower.includes("low")) {
      severity = "low";
      priorityScore = Math.floor(Math.random() * 15) + 20;
    } else {
      priorityScore = Math.floor(Math.random() * 15) + 45;
    }

    const deptMap = {
      pothole: "Roads & Infrastructure Department",
      garbage: "Sanitation & Waste Management",
      water: "Water Supply Department",
      streetlight: "Electrical & Streetlighting",
      pollution: "Environment & Pollution Control",
      safety: "Public Safety Department",
      encroachment: "Town Planning Department",
      drainage: "Drainage & Sewage Department"
    };

    const titlePhrases = {
      pothole: "Road Damage — Pothole Requires Repair",
      garbage: "Waste Management Issue",
      water: "Water Infrastructure Problem",
      streetlight: "Streetlight Outage",
      pollution: "Pollution Concern",
      safety: "Public Safety Hazard",
      encroachment: "Encroachment/Obstruction Issue",
      drainage: "Drainage System Problem"
    };

    const riskMap = {
      critical: "High — immediate public safety risk identified. Prioritize human review.",
      high: "Medium-High — assess on-site within 24 hours.",
      medium: "Low-Medium — standard response timeframe.",
      low: "Low — routine maintenance response."
    };

    const nextActions = {
      pothole: "Dispatch road maintenance crew. Place warning signs. Assess for permanent repair vs. patching.",
      garbage: "Schedule priority collection. Inspect collection route compliance.",
      water: "Dispatch plumbing team. Assess pipe condition. Check upstream supply.",
      streetlight: "Send electrical inspection team. Check fuses, bulbs, and distribution board.",
      pollution: "Deploy environment officer for on-site assessment. Do not issue penalty without investigation.",
      safety: "Inspect site immediately. Implement temporary safety measures. Assess permanent solution.",
      encroachment: "Issue notice after on-site verification. Coordinate with Town Planning.",
      drainage: "Deploy drainage team for blockage clearance. Assess root cause."
    };

    const confidence = 0.72 + Math.random() * 0.18;
    const needsHumanReview = severity === "critical" || confidence < 0.8;

    return {
      title: titlePhrases[category] || "Civic Issue Reported",
      summary: `Demo AI Analysis: ${cat.label} issue reported in ${location.address || location.neighborhood || "the city"}. ${description.substring(0, 100)}...`,
      severity,
      severityExplanation: `Based on description keywords and issue category. [DEMO — Not a verified assessment]`,
      department: deptMap[category],
      nextAction: nextActions[category],
      publicSafetyRisk: riskMap[severity],
      confidence: parseFloat(confidence.toFixed(2)),
      needsHumanReview,
      priorityScore,
      priorityLabel: SEVERITY_LEVELS[severity].label,
      isDemo: true
    };
  },

  async analyze(category, description, location) {
    const apiKey = localStorage.getItem("civicpulse_gemini_key");
    if (!apiKey) {
      return this.analyzeInDemoMode(category, description, location);
    }

    try {
      const prompt = `You are CivicPulse AI, an intelligent civic infrastructure triage engine for Indian municipal corporations.
Analyze this citizen report:
Category: ${category}
Location: ${location.neighborhood || "Nagpur"}, ${location.address || ""}
Description: ${description}

Respond ONLY with a valid JSON object strictly matching this schema:
{
  "title": "Concise professional title (max 8 words)",
  "summary": "1-2 sentence executive summary of the issue and location",
  "severity": "critical" | "high" | "medium" | "low",
  "severityExplanation": "Clear factual rationale explaining why this severity level was assigned",
  "department": "Roads & Infrastructure Department" | "Sanitation & Waste Management" | "Water Supply Department" | "Electrical & Streetlighting" | "Environment & Pollution Control" | "Public Safety Department" | "Town Planning Department" | "Drainage & Sewage Department",
  "nextAction": "Actionable immediate next operational step for municipal field crews",
  "publicSafetyRisk": "Specific public safety risk assessment",
  "confidence": number between 0.60 and 0.99,
  "needsHumanReview": boolean (true if severity is critical or confidence < 0.85)
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) {
        console.warn("Gemini API error, falling back to demo mode", res.status);
        return this.analyzeInDemoMode(category, description, location);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return this.analyzeInDemoMode(category, description, location);

      const parsed = JSON.parse(rawText);
      const sev = (parsed.severity || "medium").toLowerCase();
      const baseScores = { critical: 92, high: 75, medium: 52, low: 28 };

      return {
        title: parsed.title || "Civic Incident Reported",
        summary: parsed.summary || description,
        severity: sev,
        severityExplanation: parsed.severityExplanation || "Assessed via Gemini 1.5 Flash live multimodal triage.",
        department: parsed.department || "Roads & Infrastructure Department",
        nextAction: parsed.nextAction || "Deploy field inspection crew.",
        publicSafetyRisk: parsed.publicSafetyRisk || "Assessing public hazard.",
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.92,
        needsHumanReview: Boolean(parsed.needsHumanReview || sev === "critical"),
        priorityScore: baseScores[sev] || 50,
        priorityLabel: SEVERITY_LEVELS[sev]?.label || "Medium",
        isDemo: false,
        source: "Gemini 1.5 Flash (Live)"
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to demo mode:", err);
      return this.analyzeInDemoMode(category, description, location);
    }
  }
};

