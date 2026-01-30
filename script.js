document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Highlight Active Nav Link
    // Detects the current page to apply the 'active' style in the navbar
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 2. Dynamic Footer Year
    // Automatically updates the copyright year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Mobile Menu Toggle Logic
    // Handles the opening and closing of the hamburger menu on mobile devices
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            // Toggle the 'active' class to slide the mobile menu in/out
            navLinksContainer.classList.toggle('active');
            
            // Switch the icon between hamburger (bars) and close (times)
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // 4. Close mobile menu when a link is clicked
    // Ensures the menu disappears when navigating to a new section
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- EXISTING NAV CODE HERE (Keep your active link/hamburger code) ---

    // --- ROADMAP GENERATOR LOGIC ---
    const roadmapForm = document.getElementById('roadmap-form');
    
    if (roadmapForm) {
        roadmapForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. GATHER INPUTS
            const inputs = {
                coding: document.getElementById('skill-coding').value,
                excel: document.getElementById('skill-excel').value,
                sql: document.getElementById('skill-sql').value,
                python: document.getElementById('skill-python').value,
                viz: document.getElementById('skill-viz').value,
                stats: document.getElementById('skill-stats').value,
                business: document.getElementById('skill-business').value,
                tools: document.getElementById('skill-tools').value,
                goal: document.getElementById('career-goal').value,
                time: document.getElementById('study-time').value
            };

            // 2. CALCULATE GAP & TIMELINE
            const resultData = generateRoadmapData(inputs);

            // 3. RENDER RESULTS
            renderResults(resultData);
        });
    }
});

// CORE LOGIC FUNCTION
function generateRoadmapData(inputs) {
    let weeks = 0;
    let gaps = [];
    let phases = [];

    // --- GAP ANALYSIS & TIME CALCULATION ---
    
    // EXCEL
    if (inputs.excel === 'Beginner') {
        weeks += 2;
        gaps.push({ skill: "Excel", status: "weak" });
    } else {
        gaps.push({ skill: "Excel", status: "strong" });
    }

    // SQL (Critical)
    if (inputs.sql === 'Beginner') {
        weeks += 4;
        gaps.push({ skill: "SQL", status: "weak" });
    } else if (inputs.sql === 'Intermediate') {
        weeks += 2;
        gaps.push({ skill: "SQL", status: "moderate" });
    } else {
        gaps.push({ skill: "SQL", status: "strong" });
    }

    // PYTHON
    if (inputs.python === 'Beginner') {
        weeks += 5;
        gaps.push({ skill: "Python", status: "weak" });
    } else {
        gaps.push({ skill: "Python", status: "strong" });
    }

    // VISUALIZATION
    if (inputs.viz === 'Beginner' || inputs.tools === 'None') {
        weeks += 3;
        gaps.push({ skill: "Data Viz", status: "weak" });
    } else {
        gaps.push({ skill: "Data Viz", status: "strong" });
    }

    // Adjust for Study Time
    if (inputs.time === 'high') { weeks = Math.round(weeks * 0.7); } // Fast track
    if (inputs.time === 'low') { weeks = Math.round(weeks * 1.3); } // Slow track

    // Baseline minimum
    if (weeks < 4) weeks = 4;

    // --- BUILD PHASES ---

    // Phase 1: Foundations
    let p1Tasks = [];
    if (inputs.excel !== 'Expert') p1Tasks.push("Master Excel Pivot Tables & VLOOKUP");
    if (inputs.stats !== 'Expert') p1Tasks.push("Learn Basic Stats (Mean, Median, Std Dev)");
    if (inputs.business === 'Beginner') p1Tasks.push("Study Business Metrics (KPIs, ROI)");

    phases.push({
        title: "Phase 1: Data Foundations",
        weeks: "Weeks 1-" + Math.round(weeks * 0.2),
        tasks: p1Tasks.length > 0 ? p1Tasks : ["Refresh Statistical Concepts", "Advanced Excel Modeling"]
    });

    // Phase 2: Core Technical Skills
    let p2Tasks = [];
    if (inputs.sql !== 'Expert') p2Tasks.push("SQL: Joins, Aggregations, Subqueries");
    if (inputs.viz !== 'Expert') p2Tasks.push("Data Viz: Build 1 Dashboard in Tableau/PowerBI");
    
    phases.push({
        title: "Phase 2: The Analyst Toolbelt",
        weeks: "Weeks " + (Math.round(weeks * 0.2) + 1) + "-" + Math.round(weeks * 0.6),
        tasks: p2Tasks.length > 0 ? p2Tasks : ["Advanced SQL Window Functions", "Tableau LOD Expressions"]
    });

    // Phase 3: Advanced & Python
    let p3Tasks = [];
    if (inputs.python !== 'Expert') p3Tasks.push("Python: Pandas for Data Cleaning");
    p3Tasks.push("EDA Project on Kaggle Dataset");
    
    phases.push({
        title: "Phase 3: Advanced Analytics",
        weeks: "Weeks " + (Math.round(weeks * 0.6) + 1) + "-" + weeks,
        tasks: p3Tasks
    });

    return {
        totalWeeks: weeks,
        gaps: gaps,
        phases: phases
    };
}

// RENDER FUNCTION
function renderResults(data) {
    const display = document.getElementById('roadmap-result');
    const timeDisplay = document.getElementById('estimated-time');
    const gapGrid = document.getElementById('gap-grid');
    const timeline = document.getElementById('timeline-content');

    // Show Section
    display.style.display = 'block';
    
    // Set Time
    timeDisplay.innerText = data.totalWeeks + " Weeks";

    // Set Gaps
    gapGrid.innerHTML = '';
    data.gaps.forEach(g => {
        let className = g.status === 'weak' ? 'gap-weak' : (g.status === 'moderate' ? 'gap-moderate' : 'gap-strong');
        gapGrid.innerHTML += `<div class="gap-item ${className}">${g.skill}: ${g.status.toUpperCase()}</div>`;
    });

    // Set Timeline
    timeline.innerHTML = '';
    data.phases.forEach(phase => {
        let taskList = phase.tasks.map(t => `<li>${t}</li>`).join('');
        
        timeline.innerHTML += `
            <div class="phase-block">
                <div class="phase-title">${phase.title} <span style="font-size:0.8rem; color:var(--text-muted)">(${phase.weeks})</span></div>
                <div class="week-card">
                    <h4>Focus Areas:</h4>
                    <ul style="padding-left:20px; color:var(--text-muted); margin-bottom:10px;">
                        ${taskList}
                    </ul>
                    <div class="week-tags">
                        <span>Hands-on</span>
                        <span>Project-Based</span>
                    </div>
                </div>
            </div>
        `;
    });

    // Scroll to result
    display.scrollIntoView({ behavior: 'smooth' });
}