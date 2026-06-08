---
layout: default
title: "資源升級計算器"
description: "計算賽季內的資源產出與升級需求"
---

<!-- 嵌入賽季資料 -->
{% capture seasons_data %}
{{ site.data.seasons | jsonify }}
{% endcapture %}

{% capture s2_data %}
{{ site.data.upgrades.s2 | jsonify }}
{% endcapture %}

{% capture s3_data %}
{{ site.data.upgrades.s3 | jsonify }}
{% endcapture %}

{% capture s4_data %}
{{ site.data.upgrades.s4 | jsonify }}
{% endcapture %}

{% capture s5_data %}
{{ site.data.upgrades.s5 | jsonify }}
{% endcapture %}

{% capture freeze_dried_data %}
{{ site.data.freeze_dried_exp | jsonify }}
{% endcapture %}

<div class="upgrade-calculator">
  <!-- Header -->
  <div class="header-section">
    <h1 class="text-center mb-4">
      <i class="fa-brands fa-sourcetree me-3"></i>
      資源升級計算器
    </h1>
    <p class="text-center text-muted">計算賽季內可用體力、資源產出與升級需求</p>
  </div>

  <!-- Season Selection -->
  <div class="card mb-4" id="seasonCard">
    <div class="card-header">
      <h5 class="mb-0">
        <i class="fas fa-calendar-alt me-2"></i>
        賽季設定
      </h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="seasonSelect" class="form-label">選擇賽季</label>
          <select class="form-select" id="seasonSelect">
            <option value="">選擇賽季...</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label for="releaseDate" class="form-label">賽季開始日期時間</label>
          <input type="datetime-local" class="form-control" id="releaseDate">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="endDate" class="form-label">賽季結束日期時間</label>
          <input type="datetime-local" class="form-control" id="endDate">
        </div>
        <div class="col-md-6 mb-3">
          <label for="currentDate" class="form-label">當前日期時間</label>
          <input type="datetime-local" class="form-control" id="currentDate">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="form-check mt-2">
            <input class="form-check-input" type="checkbox" id="buyDailyDeal">
            <label class="form-check-label" for="buyDailyDeal">
              會購買每日特惠 (10體力/299代金券)
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Stamina Production Selection -->
  <div class="card mb-4" id="staminaCard" style="display: none;">
    <div class="card-header">
      <h5 class="mb-0">
        <i class="fas fa-bolt me-2"></i>
        體力刷取選擇
      </h5>
    </div>
    <div class="card-body">
      <p class="text-muted mb-3">選擇優先刷取的資源類型（顯示每5體力的產量）</p>
      <div id="staminaResourceButtons" class="row">
        <!-- 動態生成資源按鈕 -->
      </div>
    </div>
  </div>

  <!-- Production Settings -->
  <div class="card mb-4" id="productionCard" style="display: none;">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-cogs me-2"></i>
        產出速率設定
      </h5>
      <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#productionSettings">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div class="collapse show" id="productionSettings">
      <div class="card-body">
        <!-- 推車掛機產量 -->
        <div class="mb-4">
          <h6><i class="fas fa-shopping-cart me-2"></i>推車掛機產量 (每小時)</h6>
          <div class="row">
            <div class="col-md-3 mb-2">
              <label class="form-label">💰 金幣</label>
              <input type="number" class="form-control" id="cartGold" value="0">
            </div>
            <div class="col-md-3 mb-2">
              <label class="form-label">🪨 粗煉石</label>
              <input type="number" class="form-control" id="cartRefinedStone" value="0">
            </div>
            <div class="col-md-3 mb-2">
              <label class="form-label">⏳ 時之砂</label>
              <input type="number" class="form-control" id="cartHourglass" value="0">
            </div>
            <div class="col-md-3 mb-2">
              <label class="form-label">📖 歷戰精華</label>
              <input type="number" class="form-control" id="cartBattleEssence" value="0">
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 mb-2">
              <label class="form-label">🥩 普通凍乾</label>
              <input type="number" class="form-control" id="cartFreezeDried" value="0">
            </div>
          </div>
        </div>

        <!-- 秘境工具數量 -->
        <div class="mb-4">
          <h6><i class="fas fa-hammer me-2"></i>秘境工具數量 (已持有)</h6>
          <div id="secretRealmTools" class="row">
            <!-- 動態生成工具輸入 -->
          </div>
        </div>

        <!-- 羈絆冒險 -->
        <div class="mb-4" id="bondAdventureSection" style="display: none;">
          <h6><i class="fas fa-heart me-2"></i>羈絆冒險獎勵 (每日)</h6>
          <div id="bondAdventureInputs" class="row">
            <!-- 動態生成羈絆冒險輸入 -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Current Resources -->
  <div class="card mb-4" id="currentResourcesCard" style="display: none;">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-box-open me-2"></i>
        現有資源
      </h5>
      <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#currentResourcesSettings">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div class="collapse show" id="currentResourcesSettings">
      <div class="card-body">
        <p class="text-muted mb-3">輸入目前手上持有的資源數量（凍乾填寫個數，將自動換算為 EXP）</p>
        <div class="row">
          <div class="col-md-4 mb-2">
            <label class="form-label">💰 金幣</label>
            <input type="number" class="form-control" id="currentGold" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">🪨 粗煉石</label>
            <input type="number" class="form-control" id="currentRefinedStone" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">📖 歷戰精華</label>
            <input type="number" class="form-control" id="currentBattleEssence" value="0" min="0">
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-2">
            <label class="form-label">⏳ 時之砂</label>
            <input type="number" class="form-control" id="currentHourglass" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">⭐ 稀有時之砂 <small class="text-muted">(= 5 時之砂)</small></label>
            <input type="number" class="form-control" id="currentHourglassRare" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">💎 史詩時之砂 <small class="text-muted">(= 25 時之砂)</small></label>
            <input type="number" class="form-control" id="currentHourglassEpic" value="0" min="0">
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-2">
            <label class="form-label">🥩 普通凍乾 <small class="text-muted">(50 EXP/個)</small></label>
            <input type="number" class="form-control" id="currentFreezeDriedNormal" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">⭐ 優質凍乾 <small class="text-muted">(400 EXP/個)</small></label>
            <input type="number" class="form-control" id="currentFreezeDriedPremium" value="0" min="0">
          </div>
          <div class="col-md-4 mb-2">
            <label class="form-label">💎 精品凍乾 <small class="text-muted">(2000 EXP/個)</small></label>
            <input type="number" class="form-control" id="currentFreezeDriedDeluxe" value="0" min="0">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Upgrade Goals -->
  <div class="card mb-4" id="upgradeCard" style="display: none;">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-level-up-alt me-2"></i>
        升級目標設定
      </h5>
      <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#upgradeSettings">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div class="collapse show" id="upgradeSettings">
      <div class="card-body">
        <div id="upgradeCategories">
          <!-- 動態生成升級類別 -->
        </div>
      </div>
    </div>
  </div>

  <!-- Calculate Button -->
  <div class="text-center mb-4" id="calculateSection" style="display: none;">
    <button class="btn btn-primary btn-lg" id="calculateBtn">
      <i class="fas fa-calculator me-2"></i>
      開始計算
    </button>
  </div>

  <!-- Results -->
  <div id="results" class="results-section">
    <!-- 計算結果將在這裡顯示 -->
  </div>
</div>

<!-- 載入 CSS 和 JavaScript -->
<link rel="stylesheet" href="{{ '/assets/css/upgrade-calculator.css' | relative_url }}">

<script>
  // 嵌入資料到全域變數
  window.seasonsData = {{ seasons_data }};
  window.s2Data = {{ s2_data }};
  window.s3Data = {{ s3_data }};
  window.s4Data = {{ s4_data }};
  window.s5Data = {{ s5_data }};
  window.freezeDriedData = {{ freeze_dried_data }};
</script>

<script src="{{ '/assets/js/upgrade-utils.js' | relative_url }}"></script>
<script src="{{ '/assets/js/upgrade-templates.js' | relative_url }}"></script>
<script src="{{ '/assets/js/upgrade-calculator.js' | relative_url }}"></script>

<script>
  // 初始化計算器
  document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
  });
</script>
