/**
 * Star Calculator - Main Application
 * Calculates star rewards based on character progression
 */

(function() {
    'use strict';

    // ========================================
    // DATA INITIALIZATION
    // ========================================
    let seasonData = [];
    let starRewardsData = {};
    let uiText = {};

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const elements = {
        level: document.getElementById('i-level'),
        gear: document.getElementById('i-gear'),
        skill: document.getElementById('i-skill'),
        relics: document.getElementById('i-relics'),
        pet: document.getElementById('i-pet'),
        current_star: document.getElementById('i-current-star'),
        season: document.getElementById('target-season')
    };

    const displayElements = {
        totalStars: document.getElementById('display-total-stars'),
        starsBreakdown: document.getElementById('display-stars-breakdown'),
        statBaseStars: document.getElementById('stat-base-stars'),
        statAddedStars: document.getElementById('stat-added-stars'),
        progressBar: document.getElementById('progress-bar'),
        milestoneInfo: document.getElementById('milestone-info'),
        milestoneDisplay: document.getElementById('milestone-display'),
        tableBody: document.getElementById('table-stars-body'),
        timeline: document.getElementById('star-timeline')
    };

    // Mobile summary elements
    const mobileSummaryElements = {
        level: document.getElementById('mobile-level-calc'),
        gear: document.getElementById('mobile-gear-calc'),
        skill: document.getElementById('mobile-skill-calc'),
        relics: document.getElementById('mobile-relics-calc'),
        pet: document.getElementById('mobile-pet-calc'),
        total: document.getElementById('mobile-total-calc')
    };

    // Desktop preview elements
    const desktopPreviewElements = {
        level: document.getElementById('desktop-level-calc'),
        gear: document.getElementById('desktop-gear-calc'),
        skill: document.getElementById('desktop-skill-calc'),
        relics: document.getElementById('desktop-relics-calc'),
        pet: document.getElementById('desktop-pet-calc'),
        total: document.getElementById('desktop-total-calc')
    };

    // Feedback elements
    const feedbackElements = {
        level: document.getElementById('text-score-level'),
        gear: document.getElementById('text-score-gear'),
        skill: document.getElementById('text-score-skill'),
        relics: document.getElementById('text-score-relics'),
        pet: document.getElementById('text-score-pet')
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
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

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 102, g: 126, b: 234 };
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    function adjustHue(color, degrees) {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        h = (h * 360 + degrees) % 360;
        if (h < 0) h += 360;
        h = h / 360;
        
        let r2, g2, b2;
        if (s === 0) {
            r2 = g2 = b2 = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r2 = hue2rgb(p, q, h + 1/3);
            g2 = hue2rgb(p, q, h);
            b2 = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        
        return "#" + toHex(r2) + toHex(g2) + toHex(b2);
    }

    function getCurrentTier(stars) {
        for (let i = starRewardsData.tiers.length - 1; i >= 0; i--) {
            if (stars >= starRewardsData.tiers[i].start) {
                return starRewardsData.tiers[i];
            }
        }
        return starRewardsData.tiers[0];
    }

    function getNextMilestone(stars) {
        const currentTier = getCurrentTier(stars);
        const currentTierIndex = starRewardsData.tiers.indexOf(currentTier);
        
        if (currentTier.increment === 0) {
            if (currentTierIndex < starRewardsData.tiers.length - 1) {
                const nextTier = starRewardsData.tiers[currentTierIndex + 1];
                return {
                    stars: nextTier.start,
                    type: 'tier',
                    tier: nextTier,
                    remaining: nextTier.start - stars
                };
            }
            return null;
        }
        
        const nextRewardStars = Math.ceil(stars / currentTier.increment) * currentTier.increment;
        
        const nextTierIndex = currentTierIndex + 1;
        if (nextTierIndex < starRewardsData.tiers.length) {
            const nextTier = starRewardsData.tiers[nextTierIndex];
            
            if (nextRewardStars >= nextTier.start) {
                return {
                    stars: nextTier.start,
                    type: 'tier',
                    tier: nextTier,
                    remaining: nextTier.start - stars
                };
            }
        }
        
        return {
            stars: nextRewardStars,
            type: 'reward',
            tier: currentTier,
            remaining: nextRewardStars - stars
        };
    }

    // ========================================
    // THEME FUNCTIONS
    // ========================================
    
    function setThemeColor(season_data) {
        const container = document.getElementById('container-home');
        if (container) {
            container.setAttribute("data-season", season_data.id || season_data.season_number);
        }
        
        const primaryColor = season_data.theme_color || '#667eea';
        
        const lightColor = lightenColor(primaryColor, 20);
        const darkColor = darkenColor(primaryColor, 10);
        const secondaryColor = adjustHue(primaryColor, 25);
        const tertiaryColor = adjustHue(primaryColor, -25);
        
        const rgb = hexToRgb(primaryColor);
        const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        
        document.documentElement.style.setProperty('--season-color', primaryColor);
        document.documentElement.style.setProperty('--season-color-light', lightColor);
        document.documentElement.style.setProperty('--season-color-dark', darkColor);
        document.documentElement.style.setProperty('--season-color-secondary', secondaryColor);
        document.documentElement.style.setProperty('--season-color-tertiary', tertiaryColor);
        document.documentElement.style.setProperty('--season-color-rgb', rgbString);
        
        applyHeaderColors(primaryColor, lightColor, secondaryColor, tertiaryColor);
        
        const select = document.getElementById('target-season');
        if (select) {
            const encodedColor = primaryColor.replace('#', '%23');
            const arrowSvg = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='${encodedColor}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e`;
            select.style.backgroundImage = `url("${arrowSvg}")`;
        }
        
        console.log(`Theme updated: ${season_data.title}`, {
            primary: primaryColor,
            light: lightColor,
            dark: darkColor,
            secondary: secondaryColor,
            tertiary: tertiaryColor,
            rgb: rgbString
        });
    }

    function applyHeaderColors(primary, light, secondary, tertiary) {
        const mainHeader = document.querySelector('.gradient-header');
        if (mainHeader) {
            mainHeader.style.background = `linear-gradient(135deg, ${primary} 0%, ${light} 100%)`;
        }
        
        const rewardsHeader = document.querySelector('.gradient-header-secondary');
        if (rewardsHeader) {
            rewardsHeader.style.background = `linear-gradient(135deg, ${secondary} 0%, ${lightenColor(secondary, 15)} 100%)`;
        }
        
        const timelineHeader = document.querySelector('.gradient-header-tertiary');
        if (timelineHeader) {
            timelineHeader.style.background = `linear-gradient(135deg, ${tertiary} 0%, ${lightenColor(tertiary, 15)} 100%)`;
        }
    }

    // ========================================
    // SAVE/LOAD FUNCTIONS
    // ========================================
    
    function saveInputs() {
        const data = {
            level: elements.level?.value || '',
            gear: elements.gear?.value || '',
            skill: elements.skill?.value || '',
            relics: elements.relics?.value || '',
            pet: elements.pet?.value || '',
            current_star: elements.current_star?.value || '0',
            season: elements.season?.value || '3'
        };
        localStorage.setItem('starCalcData', JSON.stringify(data));
    }

    function loadInputs() {
        try {
            const savedData = localStorage.getItem('starCalcData');
            if (savedData) {
                const data = JSON.parse(savedData);
                if (elements.level) elements.level.value = data.level || '';
                if (elements.gear) elements.gear.value = data.gear || '';
                if (elements.skill) elements.skill.value = data.skill || '';
                if (elements.relics) elements.relics.value = data.relics || '';
                if (elements.pet) elements.pet.value = data.pet || '';
                if (elements.current_star) elements.current_star.value = data.current_star || '0';
                if (elements.season) elements.season.value = data.season || '3';
                console.log('Data loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // ========================================
    // DISPLAY UPDATE FUNCTIONS
    // ========================================
    
    function updateMilestoneProgress(stars) {
        const nextMilestone = getNextMilestone(stars);
        
        if (!nextMilestone) {
            displayElements.milestoneDisplay.innerHTML = `
                <div class="text-center py-3">
                    <i class="fas fa-trophy fa-2x text-warning mb-2"></i>
                    <p class="mb-0 fw-bold text-success">🎉 已達到最高階段！</p>
                </div>
            `;
            return;
        }
        
        const currentTier = getCurrentTier(stars);
        const starsInCurrentTier = stars - currentTier.start;
        const progress = currentTier.increment > 0 
            ? (starsInCurrentTier % currentTier.increment) / currentTier.increment * 100
            : 0;
        
        displayElements.progressBar.style.width = `${progress}%`;
        displayElements.progressBar.innerHTML = `
            <span class="px-2">${progress.toFixed(0)}%</span>
        `;
        
        const milestoneIcon = nextMilestone.type === 'tier' 
            ? '<i class="fas fa-level-up-alt text-warning"></i>' 
            : '<i class="fas fa-gift text-success"></i>';
        
        const milestoneLabel = nextMilestone.type === 'tier' 
            ? '升級階段' 
            : '下一獎勵';
        
        displayElements.milestoneInfo.innerHTML = `
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span>
                    <i class="fas fa-star text-warning me-1"></i>
                    當前: <strong>${stars}</strong>
                </span>
                <span>
                    ${milestoneIcon}
                    ${milestoneLabel}: <strong>${nextMilestone.stars}</strong>
                </span>
                <span class="badge bg-success">
                    還需 ${nextMilestone.remaining} 星
                </span>
            </div>
            ${nextMilestone.type === 'tier' ? `
                <div class="alert alert-info mt-2 mb-0 py-2 small">
                    <i class="fas fa-arrow-up me-1"></i>
                    升階後單次加成: <strong>+${nextMilestone.tier.increment}%</strong>
                </div>
            ` : ''}
        `;
    }

    function updateRewardsTable(rewardsList) {
        if (!rewardsList || rewardsList.length === 0) {
            displayElements.tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">
                        <i class="fas fa-calculator fa-2x mb-2 d-block opacity-25"></i>
                        請輸入數值開始計算
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHtml = '';
        for (let i = 0; i < rewardsList.length; i += 2) {
            const left = rewardsList[i];
            const right = rewardsList[i + 1] || { title: '', new_total_value: 0, current_total_value: 0, diff_total_value: 0 };
            
            tableHtml += `
                <tr>
                    <td data-label="獎勵類型">
                        <div class="reward-name">${left.title}</div>
                    </td>
                    <td data-label="當前數值">
                        <div class="reward-value">${left.new_total_value}%</div>
                        <div class="reward-breakdown">
                            <span class="text-info">${left.current_total_value}%</span>
                            <span class="mx-1">→</span>
                            <span class="text-success">+${left.diff_total_value}%</span>
                        </div>
                    </td>
                    ${right.title ? `
                        <td data-label="獎勵類型">
                            <div class="reward-name">${right.title}</div>
                        </td>
                        <td data-label="當前數值">
                            <div class="reward-value">${right.new_total_value}%</div>
                            <div class="reward-breakdown">
                                <span class="text-info">${right.current_total_value}%</span>
                                <span class="mx-1">→</span>
                                <span class="text-success">+${right.diff_total_value}%</span>
                            </div>
                        </td>
                    ` : '<td colspan="2" class="d-none d-md-table-cell"></td>'}
                </tr>
            `;
        }
        
        displayElements.tableBody.innerHTML = tableHtml;
    }

    function updateTimeline(currentStars) {
        const starMap = [];
        for (const tier of starRewardsData.tiers) {
            if (tier.index === 0) continue;
            
            let starValue = tier.start;
            for (const reward of starRewardsData.reward_types) {
                starMap.push({
                    star_index: starValue,
                    name: reward.name,
                    title: reward.title,
                    value: reward.value,
                    tier_index: tier.index
                });
                starValue += tier.increment;
            }
        }
        
        const displayLimit = currentStars > 0 
            ? Math.max(currentStars * 1.1 + 10, 100)
            : 100;
        
        let timelineHtml = '';
        
        const reversedMap = starMap.slice().reverse();
        
        for (const milestone of reversedMap) {
            if (milestone.star_index > displayLimit) continue;
            
            const achieved = currentStars >= milestone.star_index;
            const starsNeeded = milestone.star_index - currentStars;
            const isNext = !achieved && starsNeeded > 0 && starsNeeded <= 20;
            
            const icon = achieved ? '✨' : (isNext ? '🎯' : '⭐');
            
            timelineHtml += `
                <li class="event ${achieved ? 'achieved' : 'upcoming'}">
                    <p>
                        <span class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                            <span>
                                ${icon} 
                                <strong>[${milestone.star_index}]</strong> 
                                ${milestone.title}
                            </span>
                            <span class="d-flex gap-1 flex-wrap">
                                <span class="badge ${achieved ? 'bg-success' : (isNext ? 'bg-warning text-dark' : 'bg-secondary')}">
                                    +${milestone.value}%
                                </span>
                                ${isNext ? '<span class="badge bg-info">下一個</span>' : ''}
                                ${!achieved && starsNeeded > 0 && starsNeeded <= 20 ? 
                                    `<span class="badge bg-light text-dark">還需 ${starsNeeded}</span>` : ''}
                            </span>
                        </span>
                    </p>
                </li>
            `;
        }
        
        if (timelineHtml) {
            displayElements.timeline.innerHTML = timelineHtml;
            
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    const nextMilestone = displayElements.timeline.querySelector('.event.upcoming');
                    if (nextMilestone) {
                        nextMilestone.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center'
                        });
                    }
                }, 300);
            }
        } else {
            displayElements.timeline.innerHTML = `
                <li class="timeline-placeholder">
                    <i class="fas fa-hourglass-start fa-2x mb-2 d-block"></i>
                    <p>輸入數值查看里程碑</p>
                </li>
            `;
        }
    }

    // ========================================
    // MAIN CALCULATION FUNCTION
    // ========================================
    
    function calcScore() {
        const container = document.getElementById('container-home');
        if (container) {
            container.classList.add('calculating');
        }
        
        try {
            const orig_level = Math.max(0, parseFloat(elements.level?.value) || 0);
            const orig_gear = Math.max(0, parseFloat(elements.gear?.value) || 0);
            const orig_skill = Math.max(0, parseFloat(elements.skill?.value) || 0);
            const orig_relics = Math.max(0, parseFloat(elements.relics?.value) || 0);
            const orig_pet = Math.max(0, parseFloat(elements.pet?.value) || 0);
            const n_season = parseFloat(elements.season?.value) || 1;
            const n_current_star = Math.max(0, parseFloat(elements.current_star?.value) || 0);

            const season_data = seasonData.find(season => season.season_number === n_season);

            if (!season_data) {
                console.error("Season data not found for season number:", n_season);
                return false;
            }

            console.log("Using season:", season_data.title);

            setThemeColor(season_data);
            
            const fixed_level = season_data.fixed_level || 0;
            const fixed_relics_level = season_data.fixed_relics_level || 0;

            const n_level = Math.max(0, orig_level - fixed_level);
            const n_gear = Math.max(0, orig_gear - fixed_level);
            const n_skill = Math.max(0, orig_skill - fixed_level);
            const n_relics = Math.max(0, orig_relics - fixed_relics_level);
            const n_pet = Math.max(0, orig_pet - fixed_level);

            const res_level = n_level * (season_data.score_level * 1);
            const res_gear = n_gear * (season_data.score_gear * 5);
            const res_skill = n_skill * (season_data.score_skill * 8);
            const res_relics = n_relics * (season_data.score_relics * 20);
            const res_pet = n_pet * (season_data.score_pet * 4);

            let res_total = ((res_level + res_gear + res_skill + res_relics + res_pet) / 
                season_data.score_div) + season_data.star_start + n_current_star;
            
            if (res_total === season_data.star_start) {
                res_total = 0;
            }
            
            const res_total_round = Math.max(0, Math.floor(res_total));
            const added_stars = Math.round(res_total - n_current_star);

            // Update feedback with formulas
            if (feedbackElements.level) {
                feedbackElements.level.innerHTML = 
                    `<span class="text-primary fw-bold">分數: ${res_level}</span> 
                    <span class="text-muted small">= (${orig_level} - ${fixed_level}) × ${season_data.score_level}</span>`;
            }
            if (feedbackElements.gear) {
                feedbackElements.gear.innerHTML = 
                    `<span class="text-primary fw-bold">分數: ${res_gear}</span> 
                    <span class="text-muted small">= (${orig_gear} - ${fixed_level}) × ${season_data.score_gear} × 5</span>`;
            }
            if (feedbackElements.skill) {
                feedbackElements.skill.innerHTML = 
                    `<span class="text-primary fw-bold">分數: ${res_skill}</span> 
                    <span class="text-muted small">= (${orig_skill} - ${fixed_level}) × ${season_data.score_skill} × 8</span>`;
            }
            if (feedbackElements.relics) {
                feedbackElements.relics.innerHTML = 
                    `<span class="text-primary fw-bold">分數: ${res_relics}</span> 
                    <span class="text-muted small">= (${orig_relics} - ${fixed_relics_level}) × ${season_data.score_relics} × 20</span>`;
            }
            if (feedbackElements.pet) {
                feedbackElements.pet.innerHTML = 
                    `<span class="text-primary fw-bold">分數: ${res_pet}</span> 
                    <span class="text-muted small">= (${orig_pet} - ${fixed_level}) × ${season_data.score_pet} × 4</span>`;
            }

            // Update mobile summary
            if (mobileSummaryElements.level) mobileSummaryElements.level.textContent = res_level;
            if (mobileSummaryElements.gear) mobileSummaryElements.gear.textContent = res_gear;
            if (mobileSummaryElements.skill) mobileSummaryElements.skill.textContent = res_skill;
            if (mobileSummaryElements.relics) mobileSummaryElements.relics.textContent = res_relics;
            if (mobileSummaryElements.pet) mobileSummaryElements.pet.textContent = res_pet;
            if (mobileSummaryElements.total) {
                const totalScore = res_level + res_gear + res_skill + res_relics + res_pet;
                mobileSummaryElements.total.textContent = totalScore;
            }

            // Update desktop preview
            if (desktopPreviewElements.level) {
                desktopPreviewElements.level.textContent = res_level;
                desktopPreviewElements.gear.textContent = res_gear;
                desktopPreviewElements.skill.textContent = res_skill;
                desktopPreviewElements.relics.textContent = res_relics;
                desktopPreviewElements.pet.textContent = res_pet;
                const totalScore = res_level + res_gear + res_skill + res_relics + res_pet;
                desktopPreviewElements.total.textContent = totalScore;
            }
            
            if (displayElements.totalStars) {
                displayElements.totalStars.textContent = res_total_round;
            }
            
            if (displayElements.starsBreakdown) {
                if (n_current_star > 0) {
                    displayElements.starsBreakdown.innerHTML = `
                        基礎 <span class="text-info">${n_current_star}</span> + 
                        增加 <span class="text-success">+${added_stars}</span>
                    `;
                } else {
                    displayElements.starsBreakdown.textContent = `${season_data.title} 賽季`;
                }
            }
            
            if (displayElements.statBaseStars) {
                displayElements.statBaseStars.textContent = n_current_star;
            }
            if (displayElements.statAddedStars) {
                displayElements.statAddedStars.textContent = `+${added_stars}`;
            }
            
            updateMilestoneProgress(res_total_round);
            
            const rewardsList = [];
            const currentTier = getCurrentTier(res_total_round);
            const new_index = currentTier.index;
            const new_last_index = Math.max(0, new_index - 1);
            
            let current_index = 0;
            for (const tier of starRewardsData.tiers.slice().reverse()) {
                if (n_current_star >= tier.start) {
                    current_index = tier.index;
                    break;
                }
            }
            const current_last_index = Math.max(0, current_index - 1);
            
            for (let i = 0; i < starRewardsData.reward_types.length; i++) {
                const reward = starRewardsData.reward_types[i];
                
                const new_star_index = starRewardsData.tiers[new_index].start + 
                    starRewardsData.tiers[new_index].increment * i;
                const new_total_value = reward.value * starRewardsData.tiers[new_index].index;
                
                const current_star_index = starRewardsData.tiers[current_index].start + 
                    starRewardsData.tiers[current_index].increment * i;
                const current_total_value = reward.value * starRewardsData.tiers[current_index].index;
                
                let adjusted_new_value = new_total_value;
                if (new_star_index > res_total_round && new_last_index >= 0) {
                    adjusted_new_value = reward.value * starRewardsData.tiers[new_last_index].index;
                }
                
                let adjusted_current_value = current_total_value;
                if (current_star_index > n_current_star && current_last_index >= 0) {
                    adjusted_current_value = reward.value * starRewardsData.tiers[current_last_index].index;
                }
                
                rewardsList.push({
                    title: reward.title,
                    name: reward.name,
                    value: reward.value,
                    new_total_value: adjusted_new_value,
                    current_total_value: adjusted_current_value,
                    diff_total_value: adjusted_new_value - adjusted_current_value
                });
            }
            
            updateRewardsTable(rewardsList);
            updateTimeline(res_total_round);
            
            console.log("Calculation complete:", {
                total: res_total_round,
                base: n_current_star,
                added: added_stars,
                tier: currentTier.index
            });
            
        } catch (error) {
            console.error('Calculation error:', error);
        } finally {
            if (container) {
                setTimeout(() => {
                    container.classList.remove('calculating');
                }, 300);
            }
        }
        
        return false;
    }

    // ========================================
    // EVENT LISTENERS SETUP
    // ========================================
    
    function setupEventListeners() {
        // Input change listeners
        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                element.addEventListener('change', () => {
                    saveInputs();
                    calcScore();
                });
                element.addEventListener('input', debounce(() => {
                    saveInputs();
                    calcScore();
                }, 300));
            }
        }

        // Clear button
        const btnClear = document.getElementById('btn-clear');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (confirm(uiText.confirm?.clear_all || '確定要清空所有輸入嗎？')) {
                    for (const [key, element] of Object.entries(elements)) {
                        if (element && key !== 'season') {
                            element.value = key === 'current_star' ? '0' : '';
                        }
                    }
                    saveInputs();
                    calcScore();
                }
            });
        }

        // Example button
        const btnExample = document.getElementById('btn-example');
        if (btnExample) {
            btnExample.addEventListener('click', () => {
                const n_season = parseFloat(elements.season?.value) || 3;
                const season_data = seasonData.find(s => s.season_number === n_season);
                
                if (season_data) {
                    if (elements.level) elements.level.value = season_data.fixed_level + 10;
                    if (elements.gear) elements.gear.value = season_data.fixed_level + 8;
                    if (elements.skill) elements.skill.value = season_data.fixed_level + 5;
                    if (elements.relics) elements.relics.value = season_data.fixed_relics_level + 2;
                    if (elements.pet) elements.pet.value = season_data.fixed_level + 3;
                    if (elements.current_star) elements.current_star.value = season_data.star_start;
                    
                    saveInputs();
                    calcScore();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                calcScore();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                btnClear?.click();
            }
        });

        // Bootstrap tooltips
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(
                document.querySelectorAll('[data-bs-toggle="tooltip"]')
            );
            tooltipTriggerList.map(tooltipTriggerEl => 
                new bootstrap.Tooltip(tooltipTriggerEl)
            );
        }

        // Collapse toggle icons
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
            button.addEventListener('click', function() {
                const target = document.querySelector(this.getAttribute('data-bs-target'));
                if (target) {
                    target.addEventListener('shown.bs.collapse', () => {
                        this.setAttribute('aria-expanded', 'true');
                    });
                    target.addEventListener('hidden.bs.collapse', () => {
                        this.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    function initialize(config) {
        console.log('Star Calculator initializing...');
        
        // Store data from config
        seasonData = config.seasonData || [];
        starRewardsData = config.starRewardsData || {};
        uiText = config.uiText || {};
        
        console.log('Season data loaded:', seasonData.length, 'seasons');
        console.log('Star Rewards data loaded:', starRewardsData.tiers?.length, 'tiers');
        
        // Verify all elements exist
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.warn(`Element ${key} not found!`);
            }
        }
        
        // Setup event listeners
        setupEventListeners();
        
        // Load saved data and calculate
        loadInputs();
        calcScore();
        
        console.log('Star Calculator initialized successfully');
    }

    // ========================================
    // EXPORT
    // ========================================
    
    // Expose initialize function globally
    window.StarCalculator = {
        init: initialize
    };

})();