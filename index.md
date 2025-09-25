---
layout: default
title: 原初之星
current_season: 2
---

<div class="home container mt-5 container-star" data-season="" id="container-home">
    <div class="row">
        <div class="col-md-4 col-12 tab-calc">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">原初之星</h5>
                    <div class="">
                        <span class="form-text float-end">賽季</span>
                        <div class="input-group mb-3">
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
                    <div class="">
                        <span class="form-text float-end">等級</span>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="text-level"><i class="fa-regular fa-user"></i></span>
                            <input type="number" class="form-control" id="i-level" aria-label="Level"
                                aria-describedby="text-level">
                        </div>
                        <div class="form-text" id="text-score-level"></div>
                    </div>
                    <div class="">
                        <span class="form-text float-end">裝備(5)</span>
                        <div class="input-group">
                            <span class="input-group-text" id="text-gear"><i class="fa-solid fa-shirt"></i></span>
                            <input type="number" class="form-control" id="i-gear" aria-label="Gear"
                                aria-describedby="text-gear">
                        </div>
                        <div class="form-text" id="text-score-gear"></div>
                    </div>
                    <div class="">
                        <span class="form-text float-end">技能(8)</span>
                        <div class="input-group">
                            <span class="input-group-text" id="text-skill"><i class="fa-solid fa-book-tanakh"></i></span>
                            <input type="number" class="form-control" id="i-skill" aria-label="Skill"
                                aria-describedby="text-skill">
                        </div>
                        <div class="form-text" id="text-score-skill"></div>
                    </div>
                    <div class="">
                        <span class="form-text float-end">古遺物(20)</span>
                        <div class="input-group ">
                            <span class="input-group-text" id="text-relics"><i class="fa-solid fa-monument"></i></span>
                            <input type="number" class="form-control" id="i-relics" aria-label="Relics"
                                aria-describedby="text-relics">
                        </div>
                        <div class="form-text" id="text-score-relics"></div>
                    </div>
                    <div class="">
                        <span class="form-text float-end">幻獸(5)</span>
                        <div class="input-group">
                            <span class="input-group-text" id="text-pet"><i class="fa-solid fa-paw"></i></span>
                            <input type="number" class="form-control" id="i-pet" aria-label="Pet" aria-describedby="text-pet">
                        </div>
                        <div class="form-text" id="text-score-pet"></div>
                    </div>
                    <div class="">
                        <span class="form-text float-end">原初之星(已有)</span>
                        <div class="input-group">
                            <span class="input-group-text" id="text-current-star"><i class="fa-solid fa-star"></i></span>
                            <input type="number" class="form-control" id="i-current-star" aria-label="Current Star"
                                aria-describedby="text-current-star">
                        </div>
                    </div>
                    <div class="form-text fw-bold text-danger" id="text-score-total"></div>
                </div>
            </div>
        </div>
        <div class="col-md-8 col-12 tab-map">
            <div class="card">
                <div class="card-body">
                    <div class="d-none d-md-block">
                        <table class="table" id="table-stars">
                            <thead>
                                <tr>
                                    <th scope="col">Reward</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Reward</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody id="table-stars-body"></tbody>
                        </table>
                    </div>
                    <div class="d-block d-md-none">
                        <table class="table" id="table-stars-mobile">
                            <thead>
                                <tr>
                                    <th scope="col">Reward</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody id="table-stars-mobile-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="timeline-tab">
                        <ul class="timeline" id="star-timeline">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

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
                console.log(`Added listener to ${key} input`);
            }
        }

        const tab_star = {
            table_body: document.getElementById('table-stars-body'),
            table_body_mobile: document.getElementById('table-stars-mobile-body'),
            star_timeline: document.getElementById('star-timeline')
        };

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

            document.getElementById('container-home').setAttribute("data-season", season_data.id);

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
            //end stra Calculator

            //start count table
            let new_index = 0;
            let new_last_index = 0;
            for (const star_el of starRewardsData.tiers.slice().reverse()) { // You can use `let` instead of `const` if you like
                //console.log(star_el);
                if( res_total_round >  star_el.start ){
                    new_index = star_el.index;
                    new_last_index = star_el.index - 1;
                    //console.log("new_index: " + new_index);
                    //console.log("new_last_index: " + new_last_index);
                    break;
                }
            }

            let current_index = 0;
            let current_lats_index = 0;
            for (const star_el of starRewardsData.tiers.slice().reverse()) { 
                //console.log(star_el);
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

            for (let i = 0; i < new_star_list.length; i++) {
                //console.log(starRewardsData.tiers[new_index]);
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
                        <td>${new_star_list[i].title}</td>
                        <td>
                            ${new_star_list[i].new_total_value}%(
                            <span class="text-info">${new_star_list[i].current_total_value}%</span> + 
                            <span class="text-success">${new_star_list[i].diff_total_value}%</span>)
                        </td>
                        <td>${new_star_list[i+1].title}</td>
                        <td>
                            ${new_star_list[i+1].new_total_value}%(
                            <span class="text-info">${new_star_list[i+1].current_total_value}%</span> + 
                            <span class="text-success">${new_star_list[i+1].diff_total_value}%</span>)
                        </td>
                    </tr>
                `;
            }
            for (let i = 0; i < new_star_list.length; i++) {
                tableHtml_mobile += `
                    <tr>
                        <td>${new_star_list[i].title}</td>
                        <td>
                            ${new_star_list[i].new_total_value}%(
                            <span class="text-info">${new_star_list[i].current_total_value}%</span> + 
                            <span class="text-success">${new_star_list[i].diff_total_value}%</span>)
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

            let res_total_round_up = res_total_round*1.2
            console.log("n_current_star: " + n_current_star + " res_total_round: " + res_total_round_up);
            for (const star_el of star_map.slice().reverse()) { 
                if( res_total_round_up >  star_el.star_index  ){
                    if( res_total_round >  star_el.star_index ){
                        starMapHtml += `
                            <li class="event" data-star="${star_el.star_index}">
                                <p>✨[${star_el.star_index}]${star_el.title} +${star_el.value}</p>
                            </li>
                        `;
                    }else{
                        starMapHtml += `
                            <li class="event" data-star="${star_el.star_index}">
                                <p>[${star_el.star_index}]${star_el.title} +${star_el.value}</p>
                            </li>
                        `;
                    }
                    
                }
            }
            console.log("star_map");
            console.log(star_map);

            tab_star.star_timeline.innerHTML = starMapHtml;
            //end star map

            return false;
        }
    });
</script>