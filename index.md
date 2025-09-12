---
layout: default
title: Home
---

<div class="home container">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">原初之星</h5>

            <div class="input-group mb-3">
                <select class="form-select" id="target-season">
                    {% for item in site.data.seasons %}
                    <option value="{{ item.season_number }}">{{ item.title }}</option>
                    {% endfor %}
                </select>
                <label class="input-group-text" for="target-season">賽季</label>
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
            
            <div class="form-text text-red" id="text-score-total"></div>
        </div>
    </div>

    <!-- Optional: Add pagination if you have many posts -->
</div>

<script>
    // Wait for DOM to be fully loaded before accessing elements
    document.addEventListener('DOMContentLoaded', function() {
        const seasonData = {{ site.data.seasons | jsonify }};
        console.log("Season data loaded:", seasonData); 

        // Add event listeners only after confirming elements exist
        const elements = {
            level: document.getElementById('i-level'),
            gear: document.getElementById('i-gear'),
            skill: document.getElementById('i-skill'),
            relics: document.getElementById('i-relics'),
            pet: document.getElementById('i-pet'),
            season: document.getElementById('target-season')
        };
        
        // Check if all elements exist
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
            // Safely get values with error checking
            let n_level = elements.level ? parseInt(elements.level.value) || 0 : 0;
            let n_gear = elements.gear ? parseInt(elements.gear.value) || 0 : 0;
            let n_skill = elements.skill ? parseInt(elements.skill.value) || 0 : 0;
            let n_relics = elements.relics ? parseInt(elements.relics.value) || 0 : 0;
            let n_pet = elements.pet ? parseInt(elements.pet.value) || 0 : 0;
            let n_season = elements.season ? parseInt(elements.season.value) : 1;
            
            // Find season data safely
            let season_data = seasonData.find(season => season.season_number === n_season);
            
            if (!season_data) {
                console.error("Season data not found for season number:", n_season);
                return false;
            }
            
            console.log("Using season data:", season_data);
            
            // Set default score multipliers if not in your data
            const scoreMultipliers = {
                level: season_data.score_level || 1,
                gear: season_data.score_gear || 5,
                skill: season_data.score_skill || 8,
                relics: season_data.score_relics || 20,
                pet: season_data.score_pet || 4,
                div: season_data.score_div || 100,
                star_start: season_data.star_start || 0
            };
            
            // Calculate scores
            let res_level = n_level * scoreMultipliers.level;
            let res_gear = n_gear * scoreMultipliers.gear;
            let res_skill = n_skill * scoreMultipliers.skill;
            let res_relics = n_relics * scoreMultipliers.relics;
            let res_pet = n_pet * scoreMultipliers.pet;
            
            let res_total = ((res_level + res_gear + res_skill + res_relics + res_pet) / 
                          scoreMultipliers.div) + scoreMultipliers.star_start;
            let res_total_round = Math.round(res_total);  
            
            // Update display if elements exist
            if (document.getElementById('text-score-level'))
                document.getElementById('text-score-level').textContent = `Score: ${res_level}`;
            if (document.getElementById('text-score-gear'))
                document.getElementById('text-score-gear').textContent = `Score: ${res_gear}`;
            if (document.getElementById('text-score-skill'))
                document.getElementById('text-score-skill').textContent = `Score: ${res_skill}`;
            if (document.getElementById('text-score-relics'))
                document.getElementById('text-score-relics').textContent = `Score: ${res_relics}`;
            if (document.getElementById('text-score-pet'))
                document.getElementById('text-score-pet').textContent = `Score: ${res_pet}`;
            if (document.getElementById('text-score-total'))
                document.getElementById('text-score-toal').textContent = `Score: ${res_total_round}`;
            
            console.log("Calculation complete:", {
                level: res_level,
                gear: res_gear,
                skill: res_skill,
                relics: res_relics,
                pet: res_pet,
                total: res_total
            });
            
            return false;
        }
    });
</script>