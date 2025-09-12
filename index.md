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
  const seasonData = [
    {% for season in site.data.seasons %}
    {
      id: "{{ season.id }}",
      title: "{{ season.title }}",
      episodes: "{{ season.episodes }}",
      year: "{{ season.year }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
  
  console.log(seasonData); // Now you can use seasonData
</script>