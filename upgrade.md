---
layout: default
title: 升級計算器 | Upgrade Calculator
lang: zh-TW
---

<link rel="stylesheet" href="{{ '/assets/css/upgrade-calculator.css' | relative_url }}">

<!-- ============================================
     隱藏模板區 Hidden Templates Section
     ============================================ -->
<div style="display: none;">
  <!-- 體力摘要模板 Stamina Summary Template -->
  <template id="stamina-summary-template">
    <div class="calc-step">
      <div class="step-title">⏰ 步驟一：可用體力分析 Available Stamina Analysis</div>
      <div class="production-breakdown">
        <div class="step-item">
          <span class="step-label">📅 剩餘天數 Days Remaining:</span>
          <span class="step-value">{{daysRemaining}} 天 days</span>
        </div>
        <div class="step-item">
          <span class="step-label">⏳ 剩餘小時 Hours Remaining:</span>
          <span class="step-value">{{hoursRemaining}} 小時 hours</span>
        </div>
        <div class="step-item">
          <span class="step-label">⚡ 加速小時 Speedup Hours:</span>
          <span class="step-value">{{speedupHours}} 小時 hours ({{daysRemaining}} × 2)</span>
        </div>
        <div class="step-item">
          <span class="step-label">🕐 總可用小時 Total Hours:</span>
          <span class="step-value">{{totalHours}} 小時 hours</span>
        </div>
        <div class="formula">
          <strong>📋 體力來源 Stamina Sources:</strong><br>
          <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8;">
            1️⃣ 時間體力 Time-based: {{totalHours}} 小時 × 5 = <strong style="color: var(--info-color);">{{timeStamina}}</strong><br>
            2️⃣ 每日獎勵 Daily rewards: {{daysRemaining}} 天 × {{totalDailyStamina}} = <strong style="color: var(--success-color);">{{dailyStamina}}</strong><br>
            <div style="border-top: 2px solid var(--border-color); margin-top: 8px; padding-top: 8px;">
              3️⃣ <strong style="font-size: 1.1em; color: var(--primary-color);">總體力 Total Stamina: {{totalStamina}}</strong> (可刷 {{totalRuns}} 次 runs)
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 推車產量摘要模板 Cart Production Summary Template -->
  <template id="cart-production-summary-template">
    <div class="calc-step">
      <div class="step-title">🏭 步驟三：推車產量 Cart Production</div>
      <div class="production-breakdown">
        <div class="step-item">
          <span class="step-label">💰 金幣 Gold ({{goldPerHour}}/hr):</span>
          <span class="step-value">{{cartGold}}</span>
        </div>
        <div class="step-item">
          <span class="step-label">🪨 粗煉石 Refined Stone ({{stonePerHour}}/hr):</span>
          <span class="step-value">{{cartStone}}</span>
        </div>
        <div class="step-item">
          <span class="step-label">⏳ 時之砂 Hourglass ({{hourglassPerHour}}/hr):</span>
          <span class="step-value">{{cartHourglass}}</span>
        </div>
        <div class="step-item">
          <span class="step-label">📖 歷戰精華 Battle Essence ({{essencePerHour}}/hr):</span>
          <span class="step-value">{{cartEssence}}</span>
        </div>
        <div class="step-item">
          <span class="step-label">🥩 普通凍乾 Normal Freeze-dried ({{driedPerHour}}/hr):</span>
          <span class="step-value">{{cartDriedCount}} 個 items</span>
        </div>
        <div class="formula" style="margin-top: 8px;">
          <strong>📊 凍乾經驗值 Freeze-dried EXP:</strong><br>
          {{cartDriedCount}} 個 items × {{normalExp}} EXP = <strong style="color: var(--success-color);">{{cartDriedExp}} EXP</strong>
        </div>
      </div>
    </div>
  </template>

  <!-- 秘境工具摘要模板 Secret Realm Summary Template -->
  <template id="secret-realm-summary-template">
    <div class="calc-step">
      <div class="step-title">🔨 步驟四：秘境工具產量 Secret Realm Tool Production</div>
      <div class="production-breakdown">
        {{toolItemsHtml}}
      </div>
    </div>
  </template>

  <!-- 羈絆冒險摘要模板 Bond Adventure Summary Template -->
  <template id="bond-adventure-summary-template">
    <div class="calc-step">
      <div class="step-title">🎭 步驟四點五：羈絆冒險 Bond Adventure</div>
      <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        關卡獎勵 Stage Reward: {{selectedStageText}}
      </div>
      <div class="production-breakdown">
        <div class="step-item">
          <span class="step-label">⭐ 每次獎勵 Reward Per Run:</span>
          <span class="step-value">{{premiumPerRun}} 優質凍乾 Premium</span>
        </div>
        <div class="step-item">
          <span class="step-label">📅 剩餘天數 Days Remaining:</span>
          <span class="step-value">{{daysRemaining}} 天 days ({{totalRuns}} 次獎勵 runs)</span>
        </div>
        <div class="step-item">
          <span class="step-label">⭐ 總可獲得 Total Premium:</span>
          <span class="step-value">{{premiumTotal}} 個 items</span>
        </div>
        <div class="formula" style="margin-top: 8px;">
          <strong>📊 凍乾經驗值 Freeze-dried EXP:</strong><br>
          <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8; background: #f0f9ff; padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            {{premiumTotal}} 個 items × {{premiumExp}} EXP = <strong style="color: var(--success-color); font-size: 1.2em;">{{totalBondExp}} EXP</strong>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 升級需求摘要模板 Upgrade Requirements Summary Template -->
  <template id="upgrade-requirements-summary-template">
    <div class="calc-step">
      <div class="step-title">🎯 步驟五：升級需求匯總 Upgrade Requirements Summary</div>
      <div class="production-breakdown">
        <!-- 裝備分類 Gear Category -->
        <div class="category-breakdown">
          <div class="category-title">⚔️ 裝備 Gear (5件)</div>
          <div class="step-item">
            <span class="step-label">💰 金幣 Gold:</span>
            <span class="step-value">{{breakdownGearGold}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">🪨 粗煉石 Refined Stone (鐵錠 Iron):</span>
            <span class="step-value">{{breakdownGearIron}}</span>
          </div>
          <div class="upgrade-details" data-category="gear">
            <strong>📋 升級明細 Upgrade Details:</strong><br>
            <div class="details-content">{{gearUpgradeDetails}}</div>
          </div>
        </div>
        
        <!-- 古遺物分類 Relics Category -->
        <div class="category-breakdown">
          <div class="category-title">✨ 古遺物 Relics (20個)</div>
          <div class="step-item">
            <span class="step-label">💰 金幣 Gold:</span>
            <span class="step-value">{{breakdownRelicGold}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">⏳ 時之砂 Hourglass:</span>
            <span class="step-value">{{breakdownRelicHourglass}}</span>
          </div>
          <div class="upgrade-details" data-category="relic">
            <strong>📋 升級明細 Upgrade Details:</strong><br>
            <div class="details-content">{{relicUpgradeDetails}}</div>
          </div>
        </div>
        
        <!-- 技能分類 Skills Category -->
        <div class="category-breakdown">
          <div class="category-title">📚 技能 Skills (8個)</div>
          <div class="step-item">
            <span class="step-label">📖 歷戰精華 Battle Essence:</span>
            <span class="step-value">{{breakdownSkillEssence}}</span>
          </div>
          <div class="upgrade-details" data-category="skill">
            <strong>📋 升級明細 Upgrade Details:</strong><br>
            <div class="details-content">{{skillUpgradeDetails}}</div>
          </div>
        </div>
        
        <!-- 幻獸分類 Pets Category -->
        <div class="category-breakdown">
          <div class="category-title">🐾 幻獸 Pets (4隻)</div>
          <div class="step-item">
            <span class="step-label">🥩 凍乾經驗值 Freeze-dried EXP:</span>
            <span class="step-value">{{breakdownPetFreezeDried}}</span>
          </div>
          <div class="upgrade-details" data-category="pet">
            <strong>📋 升級明細 Upgrade Details:</strong><br>
            <div class="details-content">{{petUpgradeDetails}}</div>
          </div>
        </div>
        
        <!-- 總需求 Total Requirements -->
        <div style="margin-top: 16px; padding-top: 16px; border-top: 3px solid var(--primary-color);">
          <div class="category-title" style="font-size: 1.1em; color: var(--primary-color);">📊 總需求 Total Requirements</div>
          <div class="step-item">
            <span class="step-label">💰 金幣 Gold:</span>
            <span class="step-value" style="font-weight: bold; color: var(--danger-color);">{{neededGold}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">🪨 粗煉石 Refined Stone:</span>
            <span class="step-value" style="font-weight: bold; color: var(--danger-color);">{{neededRefinedStone}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">⏳ 時之砂 Hourglass:</span>
            <span class="step-value" style="font-weight: bold; color: var(--danger-color);">{{neededHourglass}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">📖 歷戰精華 Battle Essence:</span>
            <span class="step-value" style="font-weight: bold; color: var(--danger-color);">{{neededBattleEssence}}</span>
          </div>
          <div class="step-item">
            <span class="step-label">🥩 凍乾經驗值 Freeze-dried EXP:</span>
            <span class="step-value" style="font-weight: bold; color: var(--danger-color);">{{neededFreezeDried}}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
</div>

<!-- ============================================
     主要內容區 Main Content Area
     ============================================ -->
<div class="upgrade-container">
  <div class="season-header">
    <h1>🎮 升級計算器 Upgrade Calculator</h1>
    <p>計算資源是否足夠完成所有升級</p>
    <p class="subtitle-en">Calculate if you have enough resources to complete all upgrades</p>
    <div class="season-selector">
      {% for season in site.data.seasons.seasons %}
        {% assign season_data = site.data.upgrades[season.id] %}
        {% if season_data %}
          <button class="season-btn{% if season.id == 's3' %} active{% endif %}" 
                  onclick="switchSeason('{{ season.id }}')">
            第 {{ season.season_number }} 季 Season {{ season.season_number }}
          </button>
        {% else %}
          <button class="season-btn" disabled title="即將推出 Coming Soon">
            第 {{ season.season_number }} 季 🔒
          </button>
        {% endif %}
      {% endfor %}
    </div>
  </div>

  {% for season in site.data.seasons.seasons %}
    {% assign season_data = site.data.upgrades[season.id] %}
    {% if season_data %}
      <div id="{{ season.id }}-content" class="season-content{% if season.id == 's3' %} active{% endif %}">
        <div class="season-info">
          <h1>第 {{ season.season_number }} 季：{{ season.title }}</h1>
          <p>計算所有升級所需的資源</p>
          <p class="subtitle-en">Calculate resources needed for all upgrades</p>
        </div>

        <!-- 步驟 1：計算可用體力 -->
        <div class="calculator-section">
          <h2>⏰ 步驟一：計算可用體力</h2>
          <p class="subtitle">Step 1: Calculate Available Stamina (體力會自動計算 Stamina calculates automatically)</p>

          <div class="input-grid">
            <div class="input-card">
              <label>
                賽季開始日期 Season Start Date
                <small>固定 10:01 AM Fixed</small>
              </label>
              <input type="date" id="{{ season.id }}-start-date" value="{{ season.release_date }}" class="input-field">
            </div>

            <div class="input-card">
              <label>
                當前日期時間 Current Date & Time
                <small>自動填入 Auto-filled</small>
              </label>
              <input type="datetime-local" id="{{ season.id }}-current-time" class="input-field">
            </div>

            <div class="input-card">
              <label>
                商城每日體力 Daily Mall Stamina
                <small>預設 10 Default 10</small>
              </label>
              <input type="number" id="{{ season.id }}-mall-stamina" value="10" min="0" max="50" class="input-field">
            </div>
          </div>

          <div class="info-box">
            <span class="info-icon">ℹ️</span>
            <div>
              <strong>📘 說明 Info:</strong> 基礎每日體力：{{ season_data.daily_stamina.total }} (每日任務 + 商店寶庫)<br>
              <strong>Info:</strong> Base daily stamina: {{ season_data.daily_stamina.total }} (Daily Missions + Shop Treasury)
            </div>
          </div>
        </div>

        <!-- 步驟 2：體力使用優先級 -->
        <div class="calculator-section">
          <h2>⚡ 步驟二：選擇體力使用優先級 Select Stamina Usage Priority</h2>
          <p class="subtitle">Step 2: Select Stamina Usage Priority (選擇一個資源 Select one resource)</p>

          <div id="{{ season.id }}-stamina-options" class="stamina-options">
            {% for resource in season_data.stamina_production.resources %}
            <div class="stamina-option" onclick="selectStaminaUsage('{{ season.id }}', '{{ resource.key }}')">
              <div class="option-icon">{{ resource.icon }}</div>
              <div class="option-name">{{ resource.name_zh }}</div>
              <div class="option-name-en">{{ resource.name }}</div>
              <div class="option-rate">{{ resource.value }}/次 per run</div>
            </div>
            {% endfor %}
          </div>
        </div>

        <!-- 步驟 3：推車產量 -->
        <div class="calculator-section">
          <h2>🏭 步驟三：推車產量 Cart Production</h2>
          <p class="subtitle">Step 3: Cart Production (每小時產量 hourly rate)</p>

          <div class="input-grid">
            <div class="input-card">
              <label>
                💰 金幣 Gold
                <small>每小時產量 Per hour rate</small>
              </label>
              <input type="number" id="{{ season.id }}-cart-gold" value="0" min="0" step="100">
            </div>

            <div class="input-card">
              <label>
                🪨 粗煉石 Refined Stone
                <small>每小時產量 Per hour rate</small>
              </label>
              <input type="number" id="{{ season.id }}-cart-stone" value="0" min="0" step="10">
            </div>

            <div class="input-card">
              <label>
                ⏳ 時之砂 Hourglass
                <small>每小時產量 Per hour rate</small>
              </label>
              <input type="number" id="{{ season.id }}-cart-hourglass" value="0" min="0" step="10">
            </div>

            <div class="input-card">
              <label>
                📖 歷戰精華 Battle Essence
                <small>每小時產量 Per hour rate</small>
              </label>
              <input type="number" id="{{ season.id }}-cart-essence" value="0" min="0" step="10">
            </div>

            <div class="input-card">
              <label>
                🥩 普通凍乾 Normal Freeze-dried
                <small>每小時產量 Per hour rate</small>
              </label>
              <input type="number" id="{{ season.id }}-cart-dried" value="0" min="0" step="10">
            </div>
          </div>

          <div class="info-box" style="background: #fef3c7;">
            <span class="info-icon">💡</span>
            <div>
              <strong>說明 Note:</strong> 推車只產生普通凍乾 ({{ site.data.freeze_dried_exp.types[0].exp }} EXP/個 per item)<br>
              Cart only produces Normal Freeze-dried ({{ site.data.freeze_dried_exp.types[0].exp }} EXP each)
            </div>
          </div>
        </div>

        <!-- 步驟 4：秘境工具產量 -->
        <div class="calculator-section">
          <h2>🔨 步驟四：秘境工具產量 Secret Realm Tool Production</h2>
          <p class="subtitle">Step 4: Secret Realm Tool Production (填入你擁有的工具數量 Enter number of tools you own)</p>

          <div class="input-grid">
            {% for resource in season_data.secret_realm.resources %}
            <div class="input-card">
              <label>
                {{ resource.icon }} {{ resource.tool_name_zh }}
                <small>{{ resource.tool_name }} ({{ resource.value }}{{ resource.icon }})</small>
              </label>
              <input type="number" id="{{ season.id }}-tool-{{ resource.key }}" value="0" min="0" max="10">
            </div>
            {% endfor %}
          </div>

          <div class="info-box" style="background: #fef3c7;">
            <span class="info-icon">💡</span>
            <div>
              <strong>說明 Note:</strong> 秘境工具產量 = 每個工具的基礎值 × 你擁有的工具數量<br>
              Secret Realm tool production = Base value per tool × Number of tools you own
            </div>
          </div>
        </div>

        <!-- 步驟 4.5：羈絆冒險（S3+ 限定） -->
        {% if season.bond_adventure_enabled %}
          {% comment %} 從 seasons.yml 中取得預設獎勵數量 {% endcomment %}
          {% assign default_reward_amount = 0 %}
          {% if season.bond_adventure_enabled.rewards %}
            {% for reward in season.bond_adventure_enabled.rewards %}
              {% if reward.type == "premium" %}
                {% assign default_reward_amount = reward.amount %}
              {% endif %}
            {% endfor %}
          {% endif %}
          
          <div class="calculator-section">
            <h2>🎭 步驟四點五：羈絆冒險 Bond Adventure</h2>
            <p class="subtitle">Step 4.5: Bond Adventure (每天可獲得 4 次獎勵 4 rewards per day)</p>
            
            <div class="input-grid">
              <!-- 關卡獎勵輸入 -->
              <div class="input-card">
                <label>
                  ⭐ 關卡獎勵 Stage Reward
                  <small>每次獎勵的優質凍乾數量 Premium freeze-dried per reward</small>
                </label>
                <input type="number" id="{{ season.id }}-bond-stage-reward" value="{{ default_reward_amount }}" min="0" step="1" class="input-field" oninput="updateBondAdventurePreview('{{ season.id }}')" placeholder="輸入獎勵數量 Enter reward amount">
              </div>

              <!-- 預覽資訊 -->
              <div class="input-card" style="grid-column: 1 / -1;">
                <div id="{{ season.id }}-bond-preview" style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <div style="font-weight: bold; margin-bottom: 8px;">📊 羈絆冒險預覽 Bond Adventure Preview:</div>
                  <div id="{{ season.id }}-bond-preview-content" style="color: #1e40af; line-height: 1.8;">
                    請輸入關卡獎勵數量<br>
                    Please enter stage reward amount
                  </div>
                </div>
              </div>
            </div>
            
            <div class="info-box" style="background: #e0f2fe;">
              <span class="info-icon">💡</span>
              <div>
                <strong>說明 Note:</strong><br>
                • 羈絆冒險每天可獲得 <strong>4 次</strong>獎勵（每次獎勵由完成關卡決定）<br>
                Bond Adventure grants <strong>4 rewards per day</strong> (reward amount based on completed stage)
              </div>
            </div>
            
            <div class="info-box" style="background: #fef3c7; margin-top: 12px;">
              <span class="info-icon">📊</span>
              <div>
                <strong>凍乾經驗值系統 Freeze-dried EXP System:</strong><br>
                {% for type in site.data.freeze_dried_exp.types %}
                • {{ type.icon }} {{ type.name_zh }} {{ type.name }}: <strong>{{ type.exp }} EXP</strong><br>
                {% endfor %}
              </div>
            </div>
          </div>
        {% endif %}

        <!-- 步驟 5：升級目標 -->
        <div class="calculator-section">
          <h2>🎯 步驟五：升級目標等級 Upgrade Target Levels</h2>
          <p class="subtitle">Step 5: Upgrade Targets</p>

          <div class="upgrade-targets">
            <!-- 裝備區塊（預設折疊） -->
            <div class="collapsible-category">
              <div class="category-header collapsed" onclick="toggleCategory('{{ season.id }}-gear')">
                <span class="collapse-icon">▶</span>
                <span class="category-title">
                  <h3>⚔️ 裝備 Gear（5件 5 items）</h3>
                </span>
                <div class="avg-level-input">
                  <label>當前共鳴等級 Current Level:</label>
                  {% assign min_level = season_data.categories.gear.levels.first.level %}
                  {% assign max_level = season_data.categories.gear.levels.last.level %}
                  <input type="number" id="{{ season.id }}-gear-current-avg" value="{{ min_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <label style="margin-left: 10px;">目標共鳴等級 Target Level:</label>
                  <input type="number" id="{{ season.id }}-gear-target-avg" value="{{ max_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <button class="apply-btn" onclick="event.stopPropagation(); applyAvgLevelNew('{{ season.id }}', 'gear', 5)">套用全部 Apply to All</button>
                </div>
              </div>
              <div class="category-content" id="{{ season.id }}-gear-content">
                <div class="upgrade-grid">
                  {% for i in (1..5) %}
                  <div class="upgrade-item">
                    <label>裝備{{ i }} Item {{ i }}</label>
                    <div class="level-inputs">
                      {% assign min_level = season_data.categories.gear.levels.first.level %}
                      {% assign max_level = season_data.categories.gear.levels.last.level %}
                      <input type="number" id="{{ season.id }}-gear{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="當前 Current">
                      <span>→</span>
                      <input type="number" id="{{ season.id }}-gear{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="目標 Target">
                    </div>
                  </div>
                  {% endfor %}
                </div>
              </div>
            </div>

            <!-- 技能區塊（預設折疊） -->
            <div class="collapsible-category">
              <div class="category-header collapsed" onclick="toggleCategory('{{ season.id }}-skill')">
                <span class="collapse-icon">▶</span>
                <span class="category-title">
                  <h3>📚 技能 Skills（8個 8 items）</h3>
                </span>
                <div class="avg-level-input">
                  <label>當前共鳴等級 Current Level:</label>
                  {% assign min_level = season_data.categories.skill.levels.first.level %}
                  {% assign max_level = season_data.categories.skill.levels.last.level %}
                  <input type="number" id="{{ season.id }}-skill-current-avg" value="{{ min_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <label style="margin-left: 10px;">目標共鳴等級 Target Level:</label>
                  <input type="number" id="{{ season.id }}-skill-target-avg" value="{{ max_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <button class="apply-btn" onclick="event.stopPropagation(); applyAvgLevelNew('{{ season.id }}', 'skill', 8)">套用全部 Apply to All</button>
                </div>
              </div>
              <div class="category-content" id="{{ season.id }}-skill-content">
                <div class="upgrade-grid">
                  {% for i in (1..8) %}
                  <div class="upgrade-item">
                    <label>技能{{ i }} Skill {{ i }}</label>
                    <div class="level-inputs">
                      {% assign min_level = season_data.categories.skill.levels.first.level %}
                      {% assign max_level = season_data.categories.skill.levels.last.level %}
                      <input type="number" id="{{ season.id }}-skill{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="當前 Current">
                      <span>→</span>
                      <input type="number" id="{{ season.id }}-skill{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="目標 Target">
                    </div>
                  </div>
                  {% endfor %}
                </div>
              </div>
            </div>

            <!-- 古遺物區塊（預設折疊） -->
            <div class="collapsible-category">
              <div class="category-header collapsed" onclick="toggleCategory('{{ season.id }}-relic')">
                <span class="collapse-icon">▶</span>
                <span class="category-title">
                  <h3>✨ 古遺物 Relics（20個 20 items）</h3>
                </span>
                <div class="avg-level-input">
                  <label>當前共鳴等級 Current Level:</label>
                  {% assign min_level = season_data.categories.relic.levels.first.level %}
                  {% assign max_level = season_data.categories.relic.levels.last.level %}
                  <input type="number" id="{{ season.id }}-relic-current-avg" value="{{ min_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <label style="margin-left: 10px;">目標共鳴等級 Target Level:</label>
                  <input type="number" id="{{ season.id }}-relic-target-avg" value="{{ max_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <button class="apply-btn" onclick="event.stopPropagation(); applyAvgLevelNew('{{ season.id }}', 'relic', 20)">套用全部 Apply to All</button>
                </div>
              </div>
              <div class="category-content" id="{{ season.id }}-relic-content">
                <div class="upgrade-grid">
                  {% for i in (1..20) %}
                  <div class="upgrade-item">
                    <label>古遺物{{ i }} Relic {{ i }}</label>
                    <div class="level-inputs">
                      {% assign min_level = season_data.categories.relic.levels.first.level %}
                      {% assign max_level = season_data.categories.relic.levels.last.level %}
                      <input type="number" id="{{ season.id }}-relic{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="當前 Current">
                      <span>→</span>
                      <input type="number" id="{{ season.id }}-relic{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="目標 Target">
                    </div>
                  </div>
                  {% endfor %}
                </div>
              </div>
            </div>

            <!-- 幻獸區塊（預設折疊） -->
            <div class="collapsible-category">
              <div class="category-header collapsed" onclick="toggleCategory('{{ season.id }}-pet')">
                <span class="collapse-icon">▶</span>
                <span class="category-title">
                  <h3>🐾 幻獸 Pets（4隻 4 items）</h3>
                </span>
                <div class="avg-level-input">
                  <label>當前共鳴等級 Current Level:</label>
                  {% assign min_level = season_data.categories.pet.levels.first.level %}
                  {% assign max_level = season_data.categories.pet.levels.last.level %}
                  <input type="number" id="{{ season.id }}-pet-current-avg" value="{{ min_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <label style="margin-left: 10px;">目標共鳴等級 Target Level:</label>
                  <input type="number" id="{{ season.id }}-pet-target-avg" value="{{ max_level }}" 
                         min="{{ min_level }}" max="{{ max_level }}" 
                         onclick="event.stopPropagation()">
                  <button class="apply-btn" onclick="event.stopPropagation(); applyAvgLevelNew('{{ season.id }}', 'pet', 4)">套用全部 Apply to All</button>
                </div>
              </div>
              <div class="category-content" id="{{ season.id }}-pet-content">
                <div class="upgrade-grid">
                  {% for i in (1..4) %}
                  <div class="upgrade-item">
                    <label>幻獸{{ i }} Pet {{ i }}</label>
                    <div class="level-inputs">
                      {% assign min_level = season_data.categories.pet.levels.first.level %}
                      {% assign max_level = season_data.categories.pet.levels.last.level %}
                      <input type="number" id="{{ season.id }}-pet{{ i }}-from" value="{{ min_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="當前 Current">
                      <span>→</span>
                      <input type="number" id="{{ season.id }}-pet{{ i }}-to" value="{{ max_level }}" min="{{ min_level }}" max="{{ max_level }}" placeholder="目標 Target">
                    </div>
                  </div>
                  {% endfor %}
                </div>
              </div>
            </div>
          </div>

          <!-- 計算按鈕 -->
          <div class="calculate-section">
            <button class="calculate-btn" onclick="calculateResources('{{ season.id }}')">
              🧮 計算資源 Calculate Resources
            </button>
          </div>
        </div>

        <!-- 結果區塊 -->
        <div id="{{ season.id }}-results" class="results-section">
          <h2>📊 總需求匯總 Total Requirements Summary</h2>
          
          <!-- 計算步驟摘要 -->
          <div id="{{ season.id }}-calc-summary" class="calc-summary">
            <!-- 由 JavaScript 動態生成 -->
          </div>

          <!-- 資源對比結果 -->
          <h3>💰 資源對比 Resource Comparison</h3>
          <div id="{{ season.id }}-results-grid" class="results-grid">
            <!-- 由 JavaScript 動態生成 -->
          </div>
        </div>
      </div>
    {% else %}
      <div id="{{ season.id }}-content" class="season-content">
        <div class="season-info">
          <h1>第 {{ season.season_number }} 季：{{ season.title }}</h1>
        </div>
        <div class="no-data-message">
          <h2>📊 暫無升級數據 No Upgrade Data Available</h2>
          <p>{{ season.title }} 的升級計算器數據尚未提供</p>
          <p class="subtitle-en">Upgrade calculator data for {{ season.title }} is not available yet.</p>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>

<script src="{{ '/assets/js/upgrade-calculator.js' | relative_url }}"></script>
<script>
// 注入 Jekyll 數據到 JavaScript
(function() {
  const seasons = {{ site.data.seasons.seasons | jsonify }};
  const seasonData = {};
  const SEASON_CONSTANTS = {};
  const bondAdventureDataMap = {};
  const freezeDriedExpData = {{ site.data.freeze_dried_exp | jsonify }};

  {% for season in site.data.seasons.seasons %}
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
    
    // 載入羈絆冒險數據（如果該賽季有啟用）
    {% if season.bond_adventure_enabled and season.bond_adventure_file %}
      {% assign bond_file = season.bond_adventure_file %}
      {% assign bond_data = site.data[bond_file] %}
      {% if bond_data %}
        bondAdventureDataMap['{{ season_key }}'] = {{ bond_data | jsonify }};
      {% endif %}
    {% endif %}
  {% endfor %}

  // 初始化計算器
  initializeCalculator(seasons, seasonData, SEASON_CONSTANTS, bondAdventureDataMap, freezeDriedExpData);
})();
</script>