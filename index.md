---
layout: default
title: 原初之星
current_season: 3
---
<section class="container container-star" data-season="" id="container-home">
    <h5 class="page-title">原初之星</h5>
    <div class="card-star">
        <div class="row g-3">
            <div class="col-md-5 col-12 tab-calc">
                <div class="card">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="form-text float-end small">賽季</span>
                            <div class="input-group">
                                <label class="input-group-text" for="target-season"><i class="fa-solid fa-feather-pointed"></i></label>
                                <select class="form-select" id="target-season">
                                    {% assign sorted_seasons = site.data.seasons | sort: "season_number" | reverse %}
                                    {% for item in sorted_seasons %}
                                    <option value="{{ item.season_number }}" {% if item.season_number == page.current_season %}selected{% endif %}>
                                        {{ item.title }}
                                    </option>
                                    {% endfor %}
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">等級</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-regular fa-user"></i></span>
                                <input type="number" class="form-control" id="i-level" placeholder="角色等級" inputmode="numeric">
                            </div>
                            <div class="form-text small" id="text-score-level"></div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">裝備 (×5)</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-shirt"></i></span>
                                <input type="number" class="form-control" id="i-gear" placeholder="裝備等級" inputmode="numeric">
                            </div>
                            <div class="form-text small" id="text-score-gear"></div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">技能 (×8)</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-book-tanakh"></i></span>
                                <input type="number" class="form-control" id="i-skill" placeholder="技能等級" inputmode="numeric">
                            </div>
                            <div class="form-text small" id="text-score-skill"></div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">古遺物 (×20)</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-monument"></i></span>
                                <input type="number" class="form-control" id="i-relics" placeholder="古遺物等級" inputmode="numeric">
                            </div>
                            <div class="form-text small" id="text-score-relics"></div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">幻獸 (×4)</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-paw"></i></span>
                                <input type="number" class="form-control" id="i-pet" placeholder="幻獸等級" inputmode="numeric">
                            </div>
                            <div class="form-text small" id="text-score-pet"></div>
                        </div>
                        
                        <div class="mb-3">
                            <span class="form-text float-end small">已有星數</span>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-star"></i></span>
                                <input type="number" class="form-control" id="i-current-star" placeholder="目前擁有" value="0" inputmode="numeric">
                            </div>
                        </div>
                        
                        <!-- Mobile Result Display -->
                        <div class="result-mobile d-md-none mb-3 p-3 rounded text-center">
                            <div class="h3 mb-1 fw-bold" id="mobile-total-stars">0</div>
                            <div class="small">總星數</div>
                        </div>
                        
                        <div class="form-text fw-bold text-center" id="text-score-total"></div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-7 col-12 tab-map">
                <!-- Rewards Table -->
                <div class="card mb-3">
                    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <h6 class="mb-0"><i class="fa-solid fa-gift me-2"></i>獎勵統計</h6>
                        <button class="btn btn-sm btn-outline-light d-md-none" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#rewards-content" 
                                aria-expanded="true" aria-controls="rewards-content">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="collapse show" id="rewards-content">
                        <div class="card-body p-0">
                            <!-- Desktop Table -->
                            <div class="d-none d-md-block">
                                <table class="table table-sm mb-0" id="table-stars">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col">獎勵</th>
                                            <th scope="col">數值</th>
                                            <th scope="col">獎勵</th>
                                            <th scope="col">數值</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table-stars-body"></tbody>
                                </table>
                            </div>
                            <!-- Mobile Table -->
                            <div class="d-block d-md-none">
                                <table class="table table-sm mb-0" id="table-stars-mobile">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col" class="w-50">獎勵</th>
                                            <th scope="col" class="w-50">數值</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table-stars-mobile-body"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Timeline -->
                <div class="card">
                    <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                        <h6 class="mb-0"><i class="fa-solid fa-timeline me-2"></i>星數里程碑</h6>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-dark small" id="timeline-badge">0</span>
                            <button class="btn btn-sm btn-outline-dark d-md-none" type="button" 
                                    data-bs-toggle="collapse" data-bs-target="#timeline-content" 
                                    aria-expanded="true" aria-controls="timeline-content">
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                    <div class="collapse show" id="timeline-content">
                        <div class="card-body timeline-container">
                            <ul class="timeline mb-0" id="star-timeline">
                                <li class="text-muted text-center py-3">
                                    <i class="fa-solid fa-hourglass-start fa-2x mb-2 d-block"></i>
                                    <small>輸入數值查看里程碑</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
/* Default Theme Colors */
:root {
    --season-color: #667eea;
    --season-color-light: #764ba2;
}

/* Mobile Optimizations */
@media (max-width: 767.98px) {
    .container-star {
        padding: 0.5rem;
    }
    
    .page-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .card {
        margin-bottom: 1rem;
    }
    
    .card-body {
        padding: 1rem;
    }
    
    .input-group-text {
        min-width: 2.5rem;
        justify-content: center;
    }
    
    .form-control {
        font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .form-text {
        font-size: 0.8rem;
    }
    
    /* Mobile result display */
    .result-mobile {
        background: linear-gradient(135deg, var(--season-color) 0%, var(--season-color-light) 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    /* Collapse button animation - Bootstrap 5.3 compatible */
    [data-bs-toggle="collapse"] i {
        transition: transform 0.35s ease;
    }
    
    [data-bs-toggle="collapse"][aria-expanded="true"] i {
        transform: rotate(180deg);
    }
    
    /* Timeline mobile adjustments */
    .timeline::before {
        left: 12px;
    }
    
    .timeline .event {
        padding-left: 40px;
        margin-bottom: 15px;
    }
    
    .timeline .event::before {
        width: 28px;
        height: 28px;
        font-size: 0.9rem;
        left: -2px;
    }
    
    .timeline .event p {
        padding: 10px 12px;
        font-size: 0.9rem;
    }
    
    .timeline .badge {
        font-size: 0.65rem;
        padding: 0.2em 0.4em;
        display: inline-block;
        margin-top: 0.25rem;
    }
    
    /* Table mobile optimizations */
    .table-sm td, .table-sm th {
        padding: 0.5rem 0.25rem;
        font-size: 0.85rem;
    }
    
    .table td {
        word-break: break-word;
    }
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 991.98px) {
    .timeline .event {
        padding-left: 50px;
    }
    
    .timeline .event::before {
        width: 35px;
        height: 35px;
    }
}

/* Timeline Styles */
.timeline {
    list-style: none;
    padding-left: 0;
    position: relative;
    max-height: 500px;
    overflow-y: auto;
}

.timeline::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    height: 100%;
    width: 2px;
    background: linear-gradient(180deg, var(--season-color) 0%, var(--season-color-light) 100%);
}

.timeline .event {
    position: relative;
    padding-left: 55px;
    margin-bottom: 25px;
    transition: all 0.3s ease;
}

.timeline .event::before {
    content: '⭐';
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--season-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.timeline .event p {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 8px;
    margin: 0;
    border-left: 3px solid var(--season-color);
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.timeline .event:hover {
    transform: translateX(5px);
}

.timeline .event:hover p {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Enhanced Timeline - Achieved vs Upcoming */
.timeline .event.achieved::before {
    content: '✨';
    background: linear-gradient(135deg, var(--season-color) 0%, var(--season-color-light) 100%);
    border-color: var(--season-color-light);
    animation: glow 2s ease-in-out infinite;
}

.timeline .event.achieved p {
    background: linear-gradient(90deg, 
        rgba(102, 126, 234, 0.1) 0%, 
        rgba(118, 75, 162, 0.05) 100%);
    border-left-color: var(--season-color);
    font-weight: 600;
}

.timeline .event.upcoming::before {
    content: '⭐';
    background: #f8f9fa;
    border-color: #dee2e6;
    opacity: 0.7;
}

.timeline .event.upcoming p {
    background: #ffffff;
    border-left-color: #dee2e6;
    opacity: 0.85;
}

.timeline .event.upcoming:hover {
    opacity: 1;
}

.timeline .event.upcoming:hover::before {
    opacity: 1;
}

/* Glow animation for achieved milestones */
@keyframes glow {
    0%, 100% { 
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        transform: scale(1);
    }
    50% { 
        box-shadow: 0 0 20px rgba(118, 75, 162, 0.6);
        transform: scale(1.05);
    }
}

/* Badge styles */
.timeline .badge {
    font-size: 0.75rem;
    padding: 0.25em 0.5em;
}

/* Smooth fade for far upcoming items */
.timeline .event.upcoming:nth-child(n+10) {
    opacity: 0.6;
}

.timeline .event.upcoming:nth-child(n+15) {
    opacity: 0.4;
}

.timeline .event.upcoming:nth-child(n+20) {
    opacity: 0.3;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.timeline .event {
    animation: fadeIn 0.5s ease;
}

/* Smooth scrolling */
.timeline-container {
    -webkit-overflow-scrolling: touch;
}

/* Loading state */
.calculating {
    opacity: 0.6;
    pointer-events: none;
}

/* Touch target size for mobile - Bootstrap 5.3 compatible */
@media (max-width: 767.98px) {
    .btn, button {
        min-height: 44px;
    }
    
    .btn-sm {
        min-height: 38px;
        min-width: 38px;
    }
}

/* Bootstrap 5.3 Collapse transition */
.collapse {
    transition: height 0.35s ease;
}

.collapsing {
    transition: height 0.35s ease;
}
</style>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        //init star Calculator data
        const seasonData = {{ site.data.seasons | jsonify }};
        console.log("Season data loaded:", seasonData);

        //init count table data
        const starRewardsData = {{ site.data.star_rewards | jsonify}};
        console.log("Star Rewards data loaded:", starRewardsData);

        const elements = {
            level: document.getElementById('i-level'),
            gear: document.getElementById('i-gear'),
            skill: document.getElementById('i-skill'),
            relics: document.getElementById('i-relics'),
            pet: document.getElementById('i-pet'),
            current_star: document.getElementById('i-current-star'),
            season: document.getElementById('target-season')
        };

        // Add event listeners
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element ${key} (id: i-${key}) not found!`);
            } else {
                element.addEventListener('change', calcScore);
                element.addEventListener('input', debounce(calcScore, 300));
                console.log(`Added listener to ${key} input`);
            }
        }

        const tab_star = {
            table_body: document.getElementById('table-stars-body'),
            table_body_mobile: document.getElementById('table-stars-mobile-body'),
            star_timeline: document.getElementById('star-timeline')
        };

        // Debounce function for better mobile performance
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Initial calculation
        calcScore();

        // Helper function to lighten color
        function lightenColor(color, percent) {
            const num = parseInt(color.replace("#",""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
                (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
                .toString(16).slice(1);
        }

        function setThemeColor(season_data){
            document.getElementById('container-home').setAttribute("data-season", season_data.id);
            
            // Get theme color from season data
            const primaryColor = season_data.theme_color || '#667eea';
            const lightColor = lightenColor(primaryColor, 20);
            
            // Set CSS variables dynamically
            document.documentElement.style.setProperty('--bs-emphasis-color', primaryColor);
            document.documentElement.style.setProperty('--bs-body-color', primaryColor);
            document.documentElement.style.setProperty('--bs-secondary-color', primaryColor);
            document.documentElement.style.setProperty('--bs-border-color', primaryColor);
            document.documentElement.style.setProperty('--season-color', primaryColor);
            document.documentElement.style.setProperty('--season-color-light', lightColor);
            
            console.log(`Theme updated: ${season_data.id}, Primary: ${primaryColor}, Light: ${lightColor}`);
        }

        function calcScore() {
            // Get input values
            let orig_level = elements.level ? parseFloat(elements.level.value) || 0 : 0;
            let orig_gear = elements.gear ? parseFloat(elements.gear.value) || 0 : 0;
            let orig_skill = elements.skill ? parseFloat(elements.skill.value) || 0 : 0;
            let orig_relics = elements.relics ? parseFloat(elements.relics.value) || 0 : 0;
            let orig_pet = elements.pet ? parseFloat(elements.pet.value) || 0 : 0;
            let n_season = elements.season ? parseFloat(elements.season.value) : 1;
            let n_current_star = elements.current_star ? parseFloat(elements.current_star.value) || 0 : 0;

            // Get season data
            let season_data = seasonData.find(season => season.season_number === n_season);

            if (!season_data) {
                console.error("Season data not found for season number:", n_season);
                return false;
            }

            console.log("Using season data:", season_data);

            setThemeColor(season_data);
            
            // Apply fixed level adjustments
            let fixed_level = season_data.fixed_level || 0;
            let fixed_relics_level = season_data.fixed_relics_level || 0;

            // Calculate effective levels with proper adjustments
            let n_level = (fixed_level > orig_level) ? 0 : (orig_level - fixed_level);
            let n_gear = (fixed_level > orig_gear) ? 0 : (orig_gear - fixed_level);
            let n_skill = (fixed_level > orig_skill) ? 0 : (orig_skill - fixed_level);
            let n_relics = (fixed_relics_level > orig_relics) ? 0 : (orig_relics - fixed_relics_level);
            let n_pet = (fixed_level > orig_pet) ? 0 : (orig_pet - fixed_level);

            // Calculate scores using correct property names
            let res_level = n_level * (season_data.score_level * 1);
            let res_gear = n_gear * (season_data.score_gear * 5);
            let res_skill = n_skill * (season_data.score_skill * 8);
            let res_relics = n_relics * (season_data.score_relics * 20);
            let res_pet = n_pet * (season_data.score_pet * 4);

            // Add current stars before rounding for more accurate calculation
            let res_total = ((res_level + res_gear + res_skill + res_relics + res_pet) /
                (season_data.score_div)) + (season_data.star_start) + n_current_star;
            if( res_total == season_data.star_start ){
                res_total = 0; //reset to default
            }
            let res_total_round = Math.max(0, Math.floor(res_total));

            // Update display with season-specific thresholds
            if (document.getElementById('text-score-level'))
                document.getElementById('text-score-level').innerHTML =
                    `<span class="text-primary">分數: ${res_level}</span> <span class="text-muted">(輸入: ${orig_level}, 固定: ${fixed_level})</span>`;
            if (document.getElementById('text-score-gear'))
                document.getElementById('text-score-gear').innerHTML =
                    `<span class="text-primary">分數: ${res_gear}</span> <span class="text-muted">(輸入: ${orig_gear}, 固定: ${fixed_level})</span>`;
            if (document.getElementById('text-score-skill'))
                document.getElementById('text-score-skill').innerHTML =
                    `<span class="text-primary">分數: ${res_skill}</span> <span class="text-muted">(輸入: ${orig_skill}, 固定: ${fixed_level})</span>`;
            if (document.getElementById('text-score-relics'))
                document.getElementById('text-score-relics').innerHTML =
                    `<span class="text-primary">分數: ${res_relics}</span> <span class="text-muted">(輸入: ${orig_relics}, 固定: ${fixed_relics_level})</span>`;
            if (document.getElementById('text-score-pet'))
                document.getElementById('text-score-pet').innerHTML =
                    `<span class="text-primary">分數: ${res_pet}</span> <span class="text-muted">(輸入: ${orig_pet}, 固定: ${fixed_level})</span>`;
            
            // Update mobile total display
            if (document.getElementById('mobile-total-stars'))
                document.getElementById('mobile-total-stars').textContent = res_total_round;
            
            if (document.getElementById('text-score-total')) {
                if (n_current_star > 0) {
                    document.getElementById('text-score-total').innerHTML =
                        `✨ 總星數: <span class="text-danger">${res_total_round}</span> (基礎: <span class="text-info">${n_current_star}</span> + 增加: <span class="text-success">+${Math.round(res_total - n_current_star)}</span>) ✨`;
                } else {
                    document.getElementById('text-score-total').innerHTML =
                        `✨ 總星數: <span class="text-danger">${res_total_round}</span> (${season_data.title}) ✨`;
                }
            }

            console.log("Calculation complete:", {
                level: { input: orig_level, adjusted: n_level, score: res_level },
                gear: { input: orig_gear, adjusted: n_gear, score: res_gear },
                skill: { input: orig_skill, adjusted: n_skill, score: res_skill },
                relics: { input: orig_relics, adjusted: n_relics, score: res_relics },
                pet: { input: orig_pet, adjusted: n_pet, score: res_pet },
                current_stars: n_current_star,
                total: res_total_round,
                season: season_data.title
            });
            //end star Calculator

            //start count table
            let new_index = 0;
            let new_last_index = 0;
            for (const star_el of starRewardsData.tiers.slice().reverse()) {
                if( res_total_round >  star_el.start ){
                    new_index = star_el.index;
                    new_last_index = star_el.index - 1;
                    break;
                }
            }

            let current_index = 0;
            let current_lats_index = 0;
            for (const star_el of starRewardsData.tiers.slice().reverse()) { 
                if( n_current_star >  star_el.start ){
                    current_index = star_el.index;
                    current_lats_index = star_el.index - 1;
                    break;
                }
            }

            //init star element
            const new_star_list = starRewardsData.reward_types;

            let tableHtml = '';
            let tableHtml_mobile = '';
            let starMapHtml = '';
            let achievedCount = 0;
            let upcomingCount = 0;

            for (let i = 0; i < new_star_list.length; i++) {
                new_star_list[i].new_star_stop = false;
                new_star_list[i].new_star_index = 
                    starRewardsData.tiers[new_index].start + starRewardsData.tiers[new_index].increment * i;
                new_star_list[i].new_total_value = new_star_list[i].value * starRewardsData.tiers[new_index].index;

                new_star_list[i].current_star_stop = false;
                new_star_list[i].current_star_index = 
                    starRewardsData.tiers[current_index].start + starRewardsData.tiers[current_index].increment * i;
                new_star_list[i].current_total_value = new_star_list[i].value * starRewardsData.tiers[current_index].index;

                
                if( new_star_list[i].new_star_index > res_total_round ){
                    new_star_list[i].new_star_stop = true;
                    new_star_list[i].new_star_index = 
                        starRewardsData.tiers[new_index].start + starRewardsData.tiers[new_last_index].increment * i;
                    new_star_list[i].new_total_value = new_star_list[i].value * starRewardsData.tiers[new_last_index].index;
                }

                if( new_star_list[i].current_star_index > n_current_star ){
                    new_star_list[i].current_star_stop = true;
                    new_star_list[i].current_star_index = 
                        starRewardsData.tiers[current_index].start + starRewardsData.tiers[current_lats_index].increment * i;
                    new_star_list[i].current_total_value = new_star_list[i].value * starRewardsData.tiers[current_lats_index].index;
                }

                new_star_list[i].diff_total_value = new_star_list[i].new_total_value - new_star_list[i].current_total_value;

                console.log(new_star_list[i]);
            }

            for (let i = 0; i < new_star_list.length; i += 2) {
                tableHtml += `
                    <tr>
                        <td class="fw-semibold">${new_star_list[i].title}</td>
                        <td>
                            <span class="fw-bold">${new_star_list[i].new_total_value}%</span>
                            <small class="text-muted">
                                (<span class="text-info">${new_star_list[i].current_total_value}%</span> + 
                                <span class="text-success">+${new_star_list[i].diff_total_value}%</span>)
                            </small>
                        </td>
                        <td class="fw-semibold">${new_star_list[i+1].title}</td>
                        <td>
                            <span class="fw-bold">${new_star_list[i+1].new_total_value}%</span>
                            <small class="text-muted">
                                (<span class="text-info">${new_star_list[i+1].current_total_value}%</span> + 
                                <span class="text-success">+${new_star_list[i+1].diff_total_value}%</span>)
                            </small>
                        </td>
                    </tr>
                `;
            }
            for (let i = 0; i < new_star_list.length; i++) {
                tableHtml_mobile += `
                    <tr>
                        <td class="fw-semibold">${new_star_list[i].title}</td>
                        <td>
                            <div class="fw-bold">${new_star_list[i].new_total_value}%</div>
                            <small class="text-muted">
                                (<span class="text-info">${new_star_list[i].current_total_value}%</span> + 
                                <span class="text-success">+${new_star_list[i].diff_total_value}%</span>)
                            </small>
                        </td>
                    </tr>
                `;
            }
            //end init star element

            tab_star.table_body.innerHTML = tableHtml;
            tab_star.table_body_mobile.innerHTML = tableHtml_mobile;
            //end count table

            //start star map
            const star_map = new Array();
            let star_index = 0;
            let tmp_star_value = 0;
            for (const tier_el of starRewardsData.tiers) { 
                tmp_star_value = tier_el.start;
                if( tier_el.index > 0 ){
                    for (const reward_el of starRewardsData.reward_types) { 
                        const tmpStarEl = new Object();
                        tmpStarEl.star_index = tmp_star_value;
                        tmpStarEl.name = reward_el.name;
                        tmpStarEl.title = reward_el.title;
                        tmpStarEl.value = reward_el.value;

                        star_map.push(tmpStarEl);
                        tmp_star_value += tier_el.increment;
                    }
                }
            }

            // Show more未獲得 stars - 10% more + 10 extra, or minimum 100
            let res_total_round_up = res_total_round > 0 
                ? res_total_round * 1.1 + 10
                : 100;
                
            console.log("n_current_star: " + n_current_star + " res_total_round: " + res_total_round + " display_limit: " + res_total_round_up);
            
            for (const star_el of star_map.slice().reverse()) { 
                if( res_total_round_up >  star_el.star_index  ){
                    const achieved = res_total_round >= star_el.star_index;
                    const isNext = !achieved && star_el.star_index === Math.ceil(res_total_round) + 1;
                    const starsNeeded = star_el.star_index - res_total_round;
                    
                    if (achieved) achievedCount++;
                    else upcomingCount++;
                    
                    starMapHtml += `
                        <li class="event ${achieved ? 'achieved' : 'upcoming'}" data-star="${star_el.star_index}">
                            <p>
                                ${achieved ? '✨' : (isNext ? '🎯' : '⭐')} 
                                <strong>[${star_el.star_index}]</strong> 
                                ${star_el.title}
                                <span class="badge ${achieved ? 'bg-success' : (isNext ? 'bg-warning text-dark' : 'bg-secondary')}">
                                    +${star_el.value}%
                                </span>
                                ${isNext ? '<span class="badge bg-info">下一個</span>' : ''}
                                ${!achieved && starsNeeded > 0 && starsNeeded <= 20 ? 
                                    `<span class="badge bg-light text-dark">還需 ${starsNeeded} 星</span>` : ''}
                            </p>
                        </li>
                    `;
                }
            }
            
            console.log("star_map");
            console.log(star_map);

            tab_star.star_timeline.innerHTML = starMapHtml;
            
            // Update timeline badge
            const timelineBadge = document.getElementById('timeline-badge');
            if (timelineBadge) {
                timelineBadge.innerHTML = `<span class="text-success">✨${achievedCount}</span>/<span class="text-warning">⭐${upcomingCount}</span>`;
            }
            //end star map

            return false;
        }
    });
</script>