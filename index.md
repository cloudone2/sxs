---
layout: default
title: 原初之星
---

<div class="home container mt-5">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">原初之星</h5>

            <div class="input-group mb-3">
                <label class="input-group-text" for="target-season">賽季</label>
                <select class="form-select" id="target-season">
                    {% assign sorted_seasons = site.data.seasons | sort: "season_number" | reverse %}
                    {% for item in sorted_seasons %}
                    <option value="{{ item.season_number }}">{{ item.title }}</option>
                    {% endfor %}
                </select>
            </div>

            <div class="">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-level">Level</span>
                    <input type="number" class="form-control" id="i-level" aria-label="Level"
                        aria-describedby="text-level">
                </div>
                <div class="form-text mb-3" id="text-score-level"></div>
            </div>

            <div class="">
                <div class="input-group">
                    <span class="input-group-text" id="text-gear">Gear</span>
                    <input type="number" class="form-control" id="i-gear" aria-label="Gear"
                        aria-describedby="text-gear">
                </div>
                <div class="form-text mb-3" id="text-score-gear"></div>
            </div>

            <div class="">
                <div class="input-group">
                    <span class="input-group-text" id="text-skill">Skill</span>
                    <input type="number" class="form-control" id="i-skill" aria-label="Skill"
                        aria-describedby="text-skill">
                </div>
                <div class="form-text mb-3" id="text-score-skill"></div>
            </div>

            <div class="">
                <div class="input-group ">
                    <span class="input-group-text" id="text-relics">Relics</span>
                    <input type="number" class="form-control" id="i-relics" aria-label="Relics"
                        aria-describedby="text-relics">
                </div>
                <div class="form-text mb-3" id="text-score-relics"></div>
            </div>

            <div class="">
                <div class="input-group">
                    <span class="input-group-text" id="text-pet">Pet</span>
                    <input type="number" class="form-control" id="i-pet" aria-label="Pet" aria-describedby="text-pet">
                </div>
                <div class="form-text mb-3" id="text-score-pet"></div>
            </div>

            <div class="">
                <div class="input-group">
                    <span class="input-group-text" id="text-current-star">Current Star</span>
                    <input type="number" class="form-control" id="i-current-star" aria-label="Current Star"
                        aria-describedby="text-current-star">
                </div>
            </div>

            <div class="form-text fw-bold text-danger" id="text-score-total"></div>
        </div>
    </div>

    <!-- Optional: Add pagination if you have many posts -->
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const seasonData = {{ site.data.seasons | jsonify
    }};
    console.log("Season data loaded:", seasonData);

    const elements = {
        level: document.getElementById('i-level'),
        gear: document.getElementById('i-gear'),
        skill: document.getElementById('i-skill'),
        relics: document.getElementById('i-relics'),
        pet: document.getElementById('i-pet'),
        current_star: document.getElementById('i-current-star'), // Fixed typo: was i-current-start
        season: document.getElementById('target-season')
    };

    // Add event listeners
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element ${key} (id: i-${key}) not found!`);
        } else {
            element.addEventListener('change', calcScore);
            console.log(`Added listener to ${key} input`);
        }
    }

    // Initial calculation
    calcScore();

    function calcScore() {
        // Get input values
        let orig_level = elements.level ? parseInt(elements.level.value) || 0 : 0;
        let orig_gear = elements.gear ? parseInt(elements.gear.value) || 0 : 0;
        let orig_skill = elements.skill ? parseInt(elements.skill.value) || 0 : 0;
        let orig_relics = elements.relics ? parseInt(elements.relics.value) || 0 : 0;
        let orig_pet = elements.pet ? parseInt(elements.pet.value) || 0 : 0;
        let n_season = elements.season ? parseInt(elements.season.value) : 1;
        let n_current_star = elements.current_star ? parseInt(elements.current_star.value) || 0 : 0;

        // Get season data
        let season_data = seasonData.find(season => season.season_number === n_season);

        if (!season_data) {
            console.error("Season data not found for season number:", n_season);
            return false;
        }

        console.log("Using season data:", season_data);

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
        let res_total_round = Math.max(0, Math.round(res_total));

        // Update display with season-specific thresholds
        if (document.getElementById('text-score-level'))
            document.getElementById('text-score-level').textContent =
                `Score: ${res_level} (Input: ${orig_level}, Fixed: ${fixed_level})`;
        if (document.getElementById('text-score-gear'))
            document.getElementById('text-score-gear').textContent =
                `Score: ${res_gear} (Input: ${orig_gear}, Fixed: ${fixed_level})`;
        if (document.getElementById('text-score-skill'))
            document.getElementById('text-score-skill').textContent =
                `Score: ${res_skill} (Input: ${orig_skill}, Fixed: ${fixed_level})`;
        if (document.getElementById('text-score-relics'))
            document.getElementById('text-score-relics').textContent =
                `Score: ${res_relics} (Input: ${orig_relics}, Fixed: ${fixed_relics_level})`;
        if (document.getElementById('text-score-pet'))
            document.getElementById('text-score-pet').textContent =
                `Score: ${res_pet} (Input: ${orig_pet}, Fixed: ${fixed_level})`;
        if (document.getElementById('text-score-total')) {
            if (n_current_star > 0) {
                document.getElementById('text-score-total').textContent =
                    `✨ Total Stars: ${res_total_round} (Base: ${Math.round(res_total - n_current_star)}, Current: +${n_current_star}) ✨`;
            } else {
                document.getElementById('text-score-total').textContent =
                    `✨ Total Stars: ${res_total_round} (Season ${n_season}: ${season_data.title}) ✨`;
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

        return false;
    }
    });
</script>