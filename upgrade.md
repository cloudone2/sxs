---
layout: default
title: 資源升級計算器
description: 計算賽季內資源產出和升級需求的專業工具
---

# 📊 資源升級計算器

<div id="app">
  <!-- 賽季選擇 -->
  <div class="card season-selector" id="seasonSelector">
    <div class="card-header">
      <h3><i class="fas fa-calendar-alt"></i> 賽季選擇</h3>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="seasonSelect" class="form-label">選擇賽季</label>
          <select class="form-select" id="seasonSelect">
            <option value="">請選擇賽季</option>
          </select>
        </div>
        <div class="col-md-6 mb-3" id="seasonInfo" style="display: none;">
          <div class="season-theme-preview">
            <h5 id="seasonTitle"></h5>
            <div class="theme-preview" id="themePreview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 主要計算介面 -->
  <div id="calculatorInterface" style="display: none;">
    
    <!-- 時間設定 -->
    <div class="card time-settings">
      <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#timeSettingsBody">
        <h3><i class="fas fa-clock"></i> 時間設定 <i class="fas fa-chevron-down toggle-icon"></i></h3>
      </div>
      <div class="card-body collapse show" id="timeSettingsBody">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="startDateTime" class="form-label">賽季開始時間</label>
            <input type="datetime-local" class="form-control" id="startDateTime">
          </div>
          <div class="col-md-6 mb-3">
            <label for="currentDateTime" class="form-label">當前時間</label>
            <input type="datetime-local" class="form-control" id="currentDateTime">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="buyDailyDeal">
              <label class="form-check-label" for="buyDailyDeal">
                購買每日特惠 (10體力 - 299代金券)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 體力優先刷取 -->
    <div class="card stamina-priority">
      <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#staminaPriorityBody">
        <h3><i class="fas fa-bolt"></i> 體力優先刷取 <i class="fas fa-chevron-down toggle-icon"></i></h3>
      </div>
      <div class="card-body collapse show" id="staminaPriorityBody">
        <div class="row" id="staminaResourceOptions">
          <!-- 動態生成資源選項 -->
        </div>
      </div>
    </div>

    <!-- 產出設定 -->
    <div class="card production-settings">
      <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#productionSettingsBody">
        <h3><i class="fas fa-industry"></i> 產出設定 <i class="fas fa-chevron-down toggle-icon"></i></h3>
      </div>
      <div class="card-body collapse show" id="productionSettingsBody">
        
        <!-- 推車掛機 -->
        <div class="mb-4">
          <h5><i class="fas fa-cart-plus"></i> 推車掛機產量 (每小時)</h5>
          <div class="row" id="cartProductionInputs">
            <!-- 動態生成 -->
          </div>
        </div>

        <!-- 秘境工具 -->
        <div class="mb-4">
          <h5><i class="fas fa-tools"></i> 秘境工具數量</h5>
          <div class="row" id="secretRealmToolInputs">
            <!-- 動態生成 -->
          </div>
        </div>

        <!-- 羈絆冒險 (S3/S4限定) -->
        <div class="mb-4" id="bondAdventureSection" style="display: none;">
          <h5><i class="fas fa-users"></i> 羈絆冒險獎勵</h5>
          <div id="bondAdventureInputs">
            <!-- 動態生成 -->
          </div>
        </div>

      </div>
    </div>

    <!-- 升級目標 -->
    <div class="card upgrade-goals">
      <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#upgradeGoalsBody">
        <h3><i class="fas fa-level-up-alt"></i> 升級目標 <i class="fas fa-chevron-down toggle-icon"></i></h3>
      </div>
      <div class="card-body collapse show" id="upgradeGoalsBody">
        
        <!-- 裝備升級 -->
        <div class="upgrade-category mb-4" data-category="gear">
          <div class="category-header collapsible" data-bs-toggle="collapse" data-bs-target="#gearUpgrades">
            <h5><i class="fas fa-sword"></i> 裝備升級 (5項) <small class="text-muted">平均等級: <span class="avg-level">--</span></small> <i class="fas fa-chevron-down toggle-icon"></i></h5>
          </div>
          <div class="collapse" id="gearUpgrades">
            <div class="row mb-3">
              <div class="col-md-6">
                <button class="btn btn-outline-primary btn-sm" onclick="applyResonanceLevel('gear', 'start')">套用共鳴等級(起始)</button>
              </div>
              <div class="col-md-6">
                <button class="btn btn-outline-success btn-sm" onclick="applyResonanceLevel('gear', 'target')">套用共鳴等級(目標)</button>
              </div>
            </div>
            <div class="upgrade-items" id="gearItems">
              <!-- 動態生成5個裝備輸入 -->
            </div>
          </div>
        </div>

        <!-- 技能升級 -->
        <div class="upgrade-category mb-4" data-category="skill">
          <div class="category-header collapsible" data-bs-toggle="collapse" data-bs-target="#skillUpgrades">
            <h5><i class="fas fa-book"></i> 技能升級 (8項) <small class="text-muted">平均等級: <span class="avg-level">--</span></small> <i class="fas fa-chevron-down toggle-icon"></i></h5>
          </div>
          <div class="collapse" id="skillUpgrades">
            <div class="row mb-3">
              <div class="col-md-6">
                <button class="btn btn-outline-primary btn-sm" onclick="applyResonanceLevel('skill', 'start')">套用共鳴等級(起始)</button>
              </div>
              <div class="col-md-6">
                <button class="btn btn-outline-success btn-sm" onclick="applyResonanceLevel('skill', 'target')">套用共鳴等級(目標)</button>
              </div>
            </div>
            <div class="upgrade-items" id="skillItems">
              <!-- 動態生成8個技能輸入 -->
            </div>
          </div>
        </div>

        <!-- 古遺物升級 -->
        <div class="upgrade-category mb-4" data-category="relic">
          <div class="category-header collapsible" data-bs-toggle="collapse" data-bs-target="#relicUpgrades">
            <h5><i class="fas fa-gem"></i> 古遺物升級 (20項) <small class="text-muted">平均等級: <span class="avg-level">--</span></small> <i class="fas fa-chevron-down toggle-icon"></i></h5>
          </div>
          <div class="collapse" id="relicUpgrades">
            <div class="row mb-3">
              <div class="col-md-6">
                <button class="btn btn-outline-primary btn-sm" onclick="applyResonanceLevel('relic', 'start')">套用共鳴等級(起始)</button>
              </div>
              <div class="col-md-6">
                <button class="btn btn-outline-success btn-sm" onclick="applyResonanceLevel('relic', 'target')">套用共鳴等級(目標)</button>
              </div>
            </div>
            <div class="upgrade-items" id="relicItems">
              <!-- 動態生成20個古遺物輸入 -->
            </div>
          </div>
        </div>

        <!-- 幻獸升級 -->
        <div class="upgrade-category mb-4" data-category="pet">
          <div class="category-header collapsible" data-bs-toggle="collapse" data-bs-target="#petUpgrades">
            <h5><i class="fas fa-paw"></i> 幻獸升級 (4項) <small class="text-muted">平均等級: <span class="avg-level">--</span></small> <i class="fas fa-chevron-down toggle-icon"></i></h5>
          </div>
          <div class="collapse" id="petUpgrades">
            <div class="row mb-3">
              <div class="col-md-6">
                <button class="btn btn-outline-primary btn-sm" onclick="applyResonanceLevel('pet', 'start')">套用共鳴等級(起始)</button>
              </div>
              <div class="col-md-6">
                <button class="btn btn-outline-success btn-sm" onclick="applyResonanceLevel('pet', 'target')">套用共鳴等級(目標)</button>
              </div>
            </div>
            <div class="upgrade-items" id="petItems">
              <!-- 動態生成4個幻獸輸入 -->
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 計算按鈕 -->
    <div class="text-center mb-4">
      <button class="btn btn-primary btn-lg" onclick="calculateAll()">
        <i class="fas fa-calculator"></i> 開始計算
      </button>
    </div>

    <!-- 計算結果 -->
    <div id="calculationResults" style="display: none;">
      <!-- 結果將在這裡顯示 -->
    </div>

  </div>
</div>

<!-- 嵌入的YAML數據 -->
<script type="application/json" id="seasonsData">{{ site.data.seasons | jsonify }}</script>
<script type="application/json" id="upgradesData">
{
  {% for season_file in site.data.upgrades %}
    "{{ season_file[0] }}": {{ season_file[1] | jsonify }}{% unless forloop.last %},{% endunless %}
  {% endfor %}
}
</script>
<script type="application/json" id="freezeDriedData">{{ site.data.freeze_dried_exp | jsonify }}</script>

<link rel="stylesheet" href="{{ '/assets/css/upgrade-calculator.css' | relative_url }}">
<script src="{{ '/assets/js/upgrade-utils.js' | relative_url }}"></script>
<script src="{{ '/assets/js/upgrade-templates.js' | relative_url }}"></script>
<script src="{{ '/assets/js/upgrade-calculator.js' | relative_url }}"></script>