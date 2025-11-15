---
layout: default
title: Upgrade Calculator
---

<link rel="stylesheet" href="{{ '/assets/css/upgrade-calculator.css' | relative_url }}">

<div class="upgrade-container">
  <div class="season-header">
    <h1>🎮 Upgrade Calculator</h1>
    <p>Calculate if you have enough resources to complete all upgrades</p>
    <p>計算資源是否足夠完成所有升級</p>
    <div class="season-selector">
      {% for season in site.data.seasons %}
        {% assign season_data = site.data.upgrades[season.id] %}
        {% if season_data %}
          <button class="season-btn{% if season.id == 's3' %} active{% endif %}" 
                  onclick="switchSeason('{{ season.id }}')">
            Season {{ season.season_number }}
          </button>
        {% else %}
          <button class="season-btn" disabled title="Coming Soon">
            Season {{ season.season_number }} 🔒
          </button>
        {% endif %}
      {% endfor %}
    </div>
  </div>

  {% for season in site.data.seasons %}
    {% assign season_data = site.data.upgrades[season.id] %}
    {% if season_data %}
      <div id="{{ season.id }}-content" class="season-content{% if season.id == 's3' %} active{% endif %}">
        <div class="season-info">
          <h1>Season {{ season.season_number }}: {{ season.title }}</h1>
          <p>Calculate resources needed for all upgrades</p>
          <p>計算所有升級所需的資源</p>
        </div>

        <!-- Step 1: Time & Stamina Calculator -->
        <div class="calculator-section">
          <h2>⏰ Step 1: Calculate Available Stamina</h2>
          <p class="subtitle">第一步：計算可用體力</p>

          <div class="input-grid">
            <div class="input-card">
              <label>Season Start Date</label>
              <span class="label-zh">賽季開始日期</span>
              <input type="date" id="{{ season.id }}-start-date" value="{{ season.release_date }}">
            </div>
            <div class="input-card">
              <label>Current Date & Time</label>
              <span class="label-zh">當前日期時間</span>
              <input type="datetime-local" id="{{ season.id }}-current-time">
            </div>
            <div class="input-card">
              <label>Daily Mall Stamina</label>
              <span class="label-zh">商城每日體力</span>
              <input type="number" id="{{ season.id }}-mall-stamina" value="10" min="0" max="100">
            </div>
          </div>

          <div class="info-section">
            <p><strong>ℹ️ Info:</strong> Base daily stamina: {{ season_data.daily_stamina.total }} (Daily Missions: {{ season_data.daily_stamina.sources[0].amount }} + Shop Treasury: {{ season_data.daily_stamina.sources[1].amount }})</p>
            <p><strong>ℹ️ 說明：</strong>基礎每日體力：{{ season_data.daily_stamina.total }} (每日任務：{{ season_data.daily_stamina.sources[0].amount }} + 商店寶庫：{{ season_data.daily_stamina.sources[1].amount }})</p>
          </div>

          <div id="{{ season.id }}-stamina-result" style="display:none; background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; margin-top: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #2e7d32;">📊 Available Stamina / 可用體力</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div>
                <div style="font-size: 0.9em; color: #558b2f;">Days Remaining / 剩餘天數</div>
                <div style="font-size: 1.5em; font-weight: bold; color: #2e7d32;" id="{{ season.id }}-days-left">-</div>
              </div>
              <div>
                <div style="font-size: 0.9em; color: #558b2f;">Hours Remaining / 剩餘小時</div>
                <div style="font-size: 1.5em; font-weight: bold; color: #2e7d32;" id="{{ season.id }}-hours-left">-</div>
              </div>
              <div>
                <div style="font-size: 0.9em; color: #558b2f;">Free Speedup Hours / 免費加速時數</div>
                <div style="font-size: 1.5em; font-weight: bold; color: #2e7d32;" id="{{ season.id }}-speedup-hours">-</div>
              </div>
              <div>
                <div style="font-size: 0.9em; color: #558b2f;">Total Available Stamina / 總可用體力</div>
                <div style="font-size: 1.8em; font-weight: bold; color: #1b5e20;" id="{{ season.id }}-total-stamina">-</div>
              </div>
            </div>
          </div>

          <button class="calculate-btn" onclick="calculateStamina('{{ season.id }}')">Calculate Stamina / 計算體力</button>
        </div>

        <!-- Step 2: Stamina Usage Priority -->
        <div class="calculator-section">
          <h2>⚡ Step 2: Stamina Usage Priority</h2>
          <p class="subtitle">第二步：體力使用優先級 (Select ONE resource to focus stamina farming)</p>

          <div class="stamina-options" id="{{ season.id }}-stamina-options">
            {% for resource in season_data.stamina_production.resources %}
            <div class="stamina-option" data-resource="{{ resource.key }}" onclick="selectStaminaUsage('{{ season.id }}', '{{ resource.key }}')">
              <div class="icon">
                {% if resource.key == "gold" %}💰
                {% elsif resource.key == "refined_stone" %}🪨
                {% elsif resource.key == "hourglass" %}⏳
                {% elsif resource.key == "battle_essence" %}📖
                {% endif %}
              </div>
              <div class="name">{{ resource.name }}</div>
              <div class="name-zh">{{ resource.name_zh }}</div>
            </div>
            {% endfor %}
          </div>
        </div>

        <!-- Step 3: Production Rates -->
        <div class="calculator-section">
          <h2>🏭 Step 3: Cart Production Rates</h2>
          <p class="subtitle">第三步：推車每小時產量 (Resources produced per hour from cart)</p>

          <div class="input-grid">
            <div class="input-card">
              <label>💰 Gold per Hour</label>
              <span class="label-zh">每小時金幣</span>
              <input type="number" id="{{ season.id }}-cart-gold" value="29750" min="0">
            </div>
            <div class="input-card">
              <label>🪨 Refined Stone per Hour</label>
              <span class="label-zh">每小時粗煉石</span>
              <input type="number" id="{{ season.id }}-cart-stone" value="2772" min="0">
            </div>
            <div class="input-card">
              <label>⏳ Hourglass per Hour</label>
              <span class="label-zh">每小時時之砂</span>
              <input type="number" id="{{ season.id }}-cart-hourglass" value="1962" min="0">
            </div>
            <div class="input-card">
              <label>📖 Battle Essence per Hour</label>
              <span class="label-zh">每小時歷戰精華</span>
              <input type="number" id="{{ season.id }}-cart-essence" value="3398" min="0">
            </div>
            <div class="input-card">
              <label>🥩 Freeze-dried per Hour</label>
              <span class="label-zh">每小時凍乾</span>
              <input type="number" id="{{ season.id }}-cart-dried" value="203" min="0">
            </div>
          </div>
        </div>

        <!-- Step 4: Secret Realm Tool Levels -->
        <div class="calculator-section">
          <h2>🔨 Step 4: Secret Realm Tool Levels</h2>
          <p class="subtitle">第四步：秘境工具等級</p>

          <div class="input-grid">
            {% for resource in season_data.secret_realm.resources %}
            <div class="input-card">
              <label>{{ resource.tool_name }}</label>
              <span class="label-zh">{{ resource.tool_name_zh }}</span>
              <input type="number" id="{{ season.id }}-tool-{{ resource.key }}" value="1" min="1" max="10">
              <div style="margin-top: 8px; font-size: 0.9em; color: #6c757d;">
                Base: {{ resource.value | number_with_delimiter }} per run
              </div>
            </div>
            {% endfor %}
          </div>
        </div>

        <!-- Step 5: Upgrade Targets -->
        <div class="calculator-section">
          <h2>🎯 Step 5: Upgrade Targets</h2>
          <p class="subtitle">第五步：升級目標等級</p>

          <div class="upgrade-targets">
            <!-- Gear Section -->
            <div class="category-header">
              <h3>⚔️ Gear (5 items / 5件裝備)</h3>
              <div class="avg-level-input">
                <label>Average Level / 共鳴等級:</label>
                {% assign min_level = season_data.categories.gear.levels.first.level %}
                {% assign max_level = season_data.categories.gear.levels.last.level %}
                <input type="number" id="{{ season.id }}-gear-avg" value="{{ max_level }}" 
                       min="{{ min_level }}" max="{{ max_level }}" 
                       onchange="applyAvgLevel('{{ season.id }}', 'gear', 5)">
                <button class="apply-btn" onclick="applyAvgLevel('{{ season.id }}', 'gear', 5)">Apply to All / 套用全部</button>
              </div>
            </div>
            <div class="upgrade-grid">
              {% for i in (1..5) %}
              <div class="upgrade-item">
                <div class="title">Item {{ i }} / 裝備{{ i }}</div>
                <div class="level-inputs">
                  {% assign min_level = season_data.categories.gear.levels.first.level %}
                  {% assign max_level = season_data.categories.gear.levels.last.level %}
                  <input type="number" id="{{ season.id }}-gear{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}">
                  <span>→</span>
                  <input type="number" id="{{ season.id }}-gear{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}">
                </div>
              </div>
              {% endfor %}
            </div>

            <!-- Skills Section -->
            <div class="category-header" style="margin-top: 30px;">
              <h3>📚 Skills (8 items / 8個技能)</h3>
              <div class="avg-level-input">
                <label>Average Level / 共鳴等級:</label>
                {% assign min_level = season_data.categories.skill.levels.first.level %}
                {% assign max_level = season_data.categories.skill.levels.last.level %}
                <input type="number" id="{{ season.id }}-skill-avg" value="{{ max_level }}" 
                       min="{{ min_level }}" max="{{ max_level }}" 
                       onchange="applyAvgLevel('{{ season.id }}', 'skill', 8)">
                <button class="apply-btn" onclick="applyAvgLevel('{{ season.id }}', 'skill', 8)">Apply to All / 套用全部</button>
              </div>
            </div>
            <div class="upgrade-grid">
              {% for i in (1..8) %}
              <div class="upgrade-item">
                <div class="title">Skill {{ i }} / 技能{{ i }}</div>
                <div class="level-inputs">
                  {% assign min_level = season_data.categories.skill.levels.first.level %}
                  {% assign max_level = season_data.categories.skill.levels.last.level %}
                  <input type="number" id="{{ season.id }}-skill{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}">
                  <span>→</span>
                  <input type="number" id="{{ season.id }}-skill{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}">
                </div>
              </div>
              {% endfor %}
            </div>

            <!-- Relics Section -->
            <div class="category-header" style="margin-top: 30px;">
              <h3>✨ Relics (20 items / 20個古遺物)</h3>
              <div class="avg-level-input">
                <label>Average Level / 共鳴等級:</label>
                {% assign min_level = season_data.categories.relic.levels.first.level %}
                {% assign max_level = season_data.categories.relic.levels.last.level %}
                <input type="number" id="{{ season.id }}-relic-avg" value="{{ max_level }}" 
                       min="{{ min_level }}" max="{{ max_level }}" 
                       onchange="applyAvgLevel('{{ season.id }}', 'relic', 20)">
                <button class="apply-btn" onclick="applyAvgLevel('{{ season.id }}', 'relic', 20)">Apply to All / 套用全部</button>
              </div>
            </div>
            <div class="upgrade-grid">
              {% for i in (1..20) %}
              <div class="upgrade-item">
                <div class="title">Relic {{ i }} / 古遺物{{ i }}</div>
                <div class="level-inputs">
                  {% assign min_level = season_data.categories.relic.levels.first.level %}
                  {% assign max_level = season_data.categories.relic.levels.last.level %}
                  <input type="number" id="{{ season.id }}-relic{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}">
                  <span>→</span>
                  <input type="number" id="{{ season.id }}-relic{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}">
                </div>
              </div>
              {% endfor %}
            </div>

            <!-- Pets Section -->
            <div class="category-header" style="margin-top: 30px;">
              <h3>🐾 Pets (4 items / 4隻幻獸)</h3>
              <div class="avg-level-input">
                <label>Average Level / 共鳴等級:</label>
                {% assign min_level = season_data.categories.pet.levels.first.level %}
                {% assign max_level = season_data.categories.pet.levels.last.level %}
                <input type="number" id="{{ season.id }}-pet-avg" value="{{ max_level }}" 
                       min="{{ min_level }}" max="{{ max_level }}" 
                       onchange="applyAvgLevel('{{ season.id }}', 'pet', 4)">
                <button class="apply-btn" onclick="applyAvgLevel('{{ season.id }}', 'pet', 4)">Apply to All / 套用全部</button>
              </div>
            </div>
            <div class="upgrade-grid">
              {% for i in (1..4) %}
              <div class="upgrade-item">
                <div class="title">Pet {{ i }} / 幻獸{{ i }}</div>
                <div class="level-inputs">
                  {% assign min_level = season_data.categories.pet.levels.first.level %}
                  {% assign max_level = season_data.categories.pet.levels.last.level %}
                  <input type="number" id="{{ season.id }}-pet{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}">
                  <span>→</span>
                  <input type="number" id="{{ season.id }}-pet{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}">
                </div>
              </div>
              {% endfor %}
            </div>
          </div>

          <button class="calculate-btn" onclick="calculateResources('{{ season.id }}')">🧮 Calculate Resources / 計算資源</button>
        </div>

        <!-- Results Section -->
        <div id="{{ season.id }}-results" class="results-section">
          <h2>📊 Resource Analysis / 資源分析</h2>
          <div class="results-grid" id="{{ season.id }}-results-grid"></div>
          
          <div class="breakdown-section">
            <h3>📋 Detailed Breakdown / 詳細分解</h3>
            <div class="breakdown-grid" id="{{ season.id }}-breakdown-grid"></div>
          </div>
        </div>
      </div>
    {% else %}
      <div id="{{ season.id }}-content" class="season-content">
        <div class="season-info">
          <h1>Season {{ season.season_number }}: {{ season.title }}</h1>
        </div>
        <div class="no-data-message">
          <h2>📊 No Upgrade Data Available</h2>
          <p>Upgrade calculator data for {{ season.title }} is not available yet.</p>
          <p>升級計算器數據尚未提供</p>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>

<script>
// Load all season data dynamically from upgrades subfolder
const seasons = {{ site.data.seasons | jsonify }};
const seasonData = {};
const SEASON_CONSTANTS = {};

{% for season in site.data.seasons %}
  {% assign season_key = season.id %}
  {% assign season_data = site.data.upgrades[season_key] %}
  {% if season_data %}
    seasonData['{{ season_key }}'] = {{ season_data | jsonify }};
    SEASON_CONSTANTS['{{ season_key }}'] = {
      totalDays: {{ season.total_day }},
      baseDailyStamina: {{ season_data.daily_stamina.total }},
      releaseDate: '{{ season.release_date }}'
    };
  {% endif %}
{% endfor %}

console.log('Loaded seasons:', Object.keys(seasonData));

// Store calculated values for each season
const seasonStates = {};
Object.keys(seasonData).forEach(key => {
  seasonStates[key] = {
    totalStamina: 0,
    totalHours: 0,
    staminaUsage: null
  };
});

// Initialize datetime inputs
document.addEventListener('DOMContentLoaded', function() {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  
  // Set current time for all loaded seasons
  Object.keys(seasonData).forEach(seasonId => {
    const element = document.getElementById(seasonId + '-current-time');
    if (element) element.value = localDateTime;
  });
});

function switchSeason(season) {
  document.querySelectorAll('.season-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  document.querySelectorAll('.season-content').forEach(content => content.classList.remove('active'));
  document.getElementById(season + '-content').classList.add('active');
}

// New function: Apply average level to all items in a category
function applyAvgLevel(seasonId, category, count) {
  const avgLevel = parseInt(document.getElementById(`${seasonId}-${category}-avg`).value);
  
  if (isNaN(avgLevel)) {
    alert('Please enter a valid level / 請輸入有效等級');
    return;
  }
  
  // Get the minimum level for this category
  const data = seasonData[seasonId];
  const categoryData = data.categories[category];
  const minLevel = categoryData.levels[0].level;
  
  // Apply to all items in this category
  for (let i = 1; i <= count; i++) {
    const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
    const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
    
    if (fromInput) fromInput.value = minLevel;
    if (toInput) toInput.value = avgLevel;
  }
  
  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓ Applied / 已套用';
  button.style.background = '#4CAF50';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
  }, 1500);
}

function calculateStamina(seasonId) {
  const constants = SEASON_CONSTANTS[seasonId];
  const state = seasonStates[seasonId];
  
  if (!constants || !state) {
    alert('Season data not found');
    return;
  }
  
  const startDate = new Date(document.getElementById(seasonId + '-start-date').value + 'T10:01:00');
  const currentTime = new Date(document.getElementById(seasonId + '-current-time').value);
  const mallStamina = parseInt(document.getElementById(seasonId + '-mall-stamina').value) || 0;
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);
  endDate.setHours(8, 0, 0, 0);
  
  const remainingMs = endDate - currentTime;
  const daysRemaining = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(remainingMs / (1000 * 60 * 60));
  
  // Calculate free speedup hours (2 hours per day)
  const speedupHours = daysRemaining * 2;
  const totalHours = hoursRemaining + speedupHours;
  
  const staminaFromTime = totalHours * 5;
  const totalDailyBonus = constants.baseDailyStamina + mallStamina;
  const staminaFromDaily = daysRemaining * totalDailyBonus;
  
  const totalStamina = staminaFromTime + staminaFromDaily;
  
  state.totalStamina = totalStamina;
  state.totalHours = totalHours;
  
  document.getElementById(seasonId + '-days-left').textContent = daysRemaining;
  document.getElementById(seasonId + '-hours-left').textContent = hoursRemaining.toLocaleString();
  document.getElementById(seasonId + '-speedup-hours').textContent = speedupHours.toLocaleString();
  document.getElementById(seasonId + '-total-stamina').textContent = totalStamina.toLocaleString();
  document.getElementById(seasonId + '-stamina-result').style.display = 'block';
}

function selectStaminaUsage(seasonId, resource) {
  const state = seasonStates[seasonId];
  state.staminaUsage = resource;
  
  document.querySelectorAll(`#${seasonId}-stamina-options .stamina-option`).forEach(opt => {
    opt.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

function calculateResources(seasonId) {
  const data = seasonData[seasonId];
  const state = seasonStates[seasonId];
  
  if (!data || !state) {
    alert('Season data not found');
    return;
  }
  
  if (state.totalStamina === 0) {
    alert('Please calculate stamina first (Step 1)');
    return;
  }
  
  if (!state.staminaUsage) {
    alert('Please select stamina usage priority (Step 2)');
    return;
  }
  
  const cartGold = parseInt(document.getElementById(seasonId + '-cart-gold').value) || 0;
  const cartStone = parseInt(document.getElementById(seasonId + '-cart-stone').value) || 0;
  const cartHourglass = parseInt(document.getElementById(seasonId + '-cart-hourglass').value) || 0;
  const cartEssence = parseInt(document.getElementById(seasonId + '-cart-essence').value) || 0;
  const cartDried = parseInt(document.getElementById(seasonId + '-cart-dried').value) || 0;
  
  const cartProduction = {
    gold: cartGold * state.totalHours,
    refined_stone: cartStone * state.totalHours,
    hourglass: cartHourglass * state.totalHours,
    battle_essence: cartEssence * state.totalHours,
    freeze_dried: cartDried * state.totalHours
  };
  
  const staminaRates = {};
  data.stamina_production.resources.forEach(resource => {
    staminaRates[resource.key] = resource.value;
  });
  
  const staminaProduction = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };
  
  const runs = Math.floor(state.totalStamina / 5);
  staminaProduction[state.staminaUsage] = staminaRates[state.staminaUsage] * runs;
  
  const needed = {
    gold: 0,
    iron: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };
  
  const breakdown = {
    gear: { gold: 0, iron: 0 },
    skill: { battle_essence: 0 },
    relic: { gold: 0, hourglass: 0 },
    pet: { freeze_dried: 0 }
  };
  
  for (let i = 1; i <= 5; i++) {
    const from = parseInt(document.getElementById(seasonId + `-gear${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-gear${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.gear, from, to);
    needed.gold += costs.gold || 0;
    needed.iron += costs.iron || 0;
    breakdown.gear.gold += costs.gold || 0;
    breakdown.gear.iron += costs.iron || 0;
  }
  
  for (let i = 1; i <= 8; i++) {
    const from = parseInt(document.getElementById(seasonId + `-skill${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-skill${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.skill, from, to);
    needed.battle_essence += costs.battle_record || 0;
    breakdown.skill.battle_essence += costs.battle_record || 0;
  }
  
  for (let i = 1; i <= 20; i++) {
    const from = parseInt(document.getElementById(seasonId + `-relic${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-relic${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.relic, from, to);
    needed.gold += costs.gold || 0;
    needed.hourglass += costs.hourglass || 0;
    breakdown.relic.gold += costs.gold || 0;
    breakdown.relic.hourglass += costs.hourglass || 0;
  }
  
  for (let i = 1; i <= 4; i++) {
    const from = parseInt(document.getElementById(seasonId + `-pet${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-pet${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.pet, from, to);
    needed.freeze_dried += costs.freeze_dried || 0;
    breakdown.pet.freeze_dried += costs.freeze_dried || 0;
  }
  
  needed.refined_stone += needed.iron;
  
  const available = {
    gold: cartProduction.gold + staminaProduction.gold,
    refined_stone: cartProduction.refined_stone + staminaProduction.refined_stone,
    hourglass: cartProduction.hourglass + staminaProduction.hourglass,
    battle_essence: cartProduction.battle_essence + staminaProduction.battle_essence,
    freeze_dried: cartProduction.freeze_dried + staminaProduction.freeze_dried
  };
  
  displayResults(seasonId, needed, available, cartProduction, staminaProduction, breakdown, state.staminaUsage);
}

function calculateCategoryCost(category, fromLevel, toLevel) {
  const costs = {};
  category.resources.forEach(resource => {
    costs[resource.key] = 0;
  });
  
  category.levels.forEach(level => {
    if (level.level > fromLevel && level.level <= toLevel) {
      category.resources.forEach(resource => {
        costs[resource.key] += level[resource.key] || 0;
      });
    }
  });
  
  return costs;
}

function displayResults(seasonId, needed, available, cartProd, staminaProd, breakdown, staminaUsage) {
  const resultsGrid = document.getElementById(seasonId + '-results-grid');
  const breakdownGrid = document.getElementById(seasonId + '-breakdown-grid');
  
  const resources = [
    { key: 'gold', name: 'Gold', name_zh: '金幣', icon: '💰' },
    { key: 'refined_stone', name: 'Refined Stone', name_zh: '粗煉石', icon: '🪨' },
    { key: 'hourglass', name: 'Hourglass', name_zh: '時之砂', icon: '⏳' },
    { key: 'battle_essence', name: 'Battle Essence', name_zh: '歷戰精華', icon: '📖' },
    { key: 'freeze_dried', name: 'Freeze-dried', name_zh: '凍乾', icon: '🥩' }
  ];
  
  let html = '';
  resources.forEach(resource => {
    const need = needed[resource.key] || 0;
    const avail = available[resource.key] || 0;
    const diff = avail - need;
    const isSurplus = diff >= 0;
    
    const staminaNote = resource.key === staminaUsage ? '<br><span style="font-size:0.8em;">(All-in 全投入)</span>' : '';
    
    html += `
      <div class="result-card">
        <div class="resource-name">${resource.icon} ${resource.name}</div>
        <div class="resource-name-zh">${resource.name_zh}${staminaNote}</div>
        <div class="amounts">
          <div class="amount-row">
            <span class="amount-label">Needed / 需要</span>
            <span class="amount-value">${need.toLocaleString()}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Available / 可獲得</span>
            <span class="amount-value">${avail.toLocaleString()}</span>
          </div>
        </div>
        <div class="difference ${isSurplus ? 'surplus' : 'shortage'}">
          ${isSurplus ? '✅' : '❌'} ${isSurplus ? '+' : ''}${diff.toLocaleString()}
        </div>
      </div>
    `;
  });
  
  resultsGrid.innerHTML = html;
  
  let breakdownHtml = `
    <div class="breakdown-card">
      <div class="category">⚔️ Gear / 裝備 (5 items)</div>
      <div class="resource-list">
        <div class="resource-item">
          <span>💰 Gold</span>
          <span class="value">${breakdown.gear.gold.toLocaleString()}</span>
        </div>
        <div class="resource-item">
          <span>🔩 Iron</span>
          <span class="value">${breakdown.gear.iron.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div class="breakdown-card">
      <div class="category">📚 Skills / 技能 (8 items)</div>
      <div class="resource-list">
        <div class="resource-item">
          <span>📖 Battle Essence</span>
          <span class="value">${breakdown.skill.battle_essence.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div class="breakdown-card">
      <div class="category">✨ Relics / 古遺物 (20 items)</div>
      <div class="resource-list">
        <div class="resource-item">
          <span>💰 Gold</span>
          <span class="value">${breakdown.relic.gold.toLocaleString()}</span>
        </div>
        <div class="resource-item">
          <span>⏳ Hourglass</span>
          <span class="value">${breakdown.relic.hourglass.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div class="breakdown-card">
      <div class="category">🐾 Pets / 幻獸 (4 items)</div>
      <div class="resource-list">
        <div class="resource-item">
          <span>🥩 Freeze-dried</span>
          <span class="value">${breakdown.pet.freeze_dried.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
  
  breakdownGrid.innerHTML = breakdownHtml;
  
  document.getElementById(seasonId + '-results').classList.add('show');
  document.getElementById(seasonId + '-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
</script>