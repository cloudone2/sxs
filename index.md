---
layout: default
title: Home
---

<div class="home">
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

            <div class="mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-level">Level</span>
                    <input type="number" class="form-control" aria-label="Level" aria-describedby="text-level">
                </div>
            </div>
            <div class="form-text" id="text-score-level"></div>

            <div class="mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-gear">Gear</span>
                    <input type="number" class="form-control" aria-label="Gear" aria-describedby="text-gear">
                </div>
            </div>
            <div class="form-text" id="text-score-gear"></div>

            <div class="mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-skill">Skill</span>
                    <input type="number" class="form-control" aria-label="Skill" aria-describedby="text-skill">
                </div>
            </div>
            <div class="form-text" id="text-score-skill"></div>

            <div class="mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-relics">Relics</span>
                    <input type="number" class="form-control" aria-label="Relics" aria-describedby="text-relics">
                </div>
            </div>
            <div class="form-text" id="text-score-relics"></div>

            <div class="mb-3">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="text-pet">Pet</span>
                    <input type="number" class="form-control" aria-label="Pet" aria-describedby="text-pet">
                </div>
            </div>
            <div class="form-text" id="text-score-pet"></div>
        </div>
    </div>

    <!-- Optional: Add pagination if you have many posts -->
</div>

<script>
    const seasonData = {{ site.data.seasons | jsonify }};

    console.log(seasonData); // Now you can use seasonData

    document.getElementById('text-level').addEventListener('change', function(event) {
        calcScore();
    });

    document.getElementById('text-gear').addEventListener('change', function(event) {
        calcScore();
    });

    document.getElementById('text-skill').addEventListener('change', function(event) {
        calcScore();
    });

    document.getElementById('text-relics').addEventListener('change', function(event) {
        calcScore();
    });

    document.getElementById('text-pet').addEventListener('change', function(event) {
        calcScore();
    });

    function calcScore(n_level, n_gear, n_skill, n_relics, n_pet, season){
        let n_level = document.getElementById('text-level').value;
        let n_gear = document.getElementById('text-gaer').value;
        let n_skill = document.getElementById('text-skill').value;
        let n_relics = document.getElementById('text-relics').value;
        let n_pet = document.getElementById('text-pet').value;
        let n_season = document.getElementById('target-season').value;
        let season_data = null;
        let score = 0;

        if ( seasonData[n_season-1] !== undefined ){
            season_data = seasonData[n_season-1];

            let res_level = n_level * season_data.score_level;
            console.log("Level Score: " + res_level);
            let res_gear = n_gear * season_data.score_gear*5;
            console.log("Gear Score: " + res_gear);
            let res_skill = n_skill * season_data.score_skill*8;
            console.log("Skill Score: " + res_skill);
            let res_relics = n_relics * season_data.score_relics*20;
            console.log("Relics Score: " + res_relics);
            let res_pet = n_pet * season_data.score_pet*4;
            console.log("Pet Score: " + res_pet);
            let res_total = ( (res_level + res_gear + res_skill + res_relics + res_pet) / season_data.score_div ) + season_data.star_start;
            console.log("Total Score: " + res_total);
        }else{
            return false;
        }

        return false;
    }
</script>