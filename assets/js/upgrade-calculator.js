/* ============================================
   升級計算器 JavaScript
   Upgrade Calculator
   ============================================ */

// 全局變量
let seasons, seasonData, SEASON_CONSTANTS;

// 儲存每個賽季的計算值
const seasonStates = {};

/* ============================================
   初始化函數
   ============================================ */

// 初始化計算器（由 HTML 調用）
function initializeCalculator(seasonsData, dataMap, constantsMap) {
  seasons = seasonsData;
  seasonData = dataMap;
  SEASON_CONSTANTS = constantsMap;
  
  // 初始化每個賽季的狀態
  Object.keys(seasonData).forEach(key => {
    seasonStates[key] = {
      totalStamina: 0,
      totalHours: 0,
      daysRemaining: 0,
      hoursRemaining: 0,
      speedupHours: 0,
      staminaUsage: null
    };
  });
  
  console.log('已載入賽季 Loaded seasons:', Object.keys(seasonData));
}

/* ============================================
   日期時間初始化
   ============================================ */

// 初始化日期時間輸入
document.addEventListener('DOMContentLoaded', function() {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  
  // 為所有已載入的賽季設定當前時間
  Object.keys(seasonData || {}).forEach(seasonId => {
    const element = document.getElementById(seasonId + '-current-time');
    if (element) {
      element.value = localDateTime;
      
      // 添加自動計算監聽器
      const startDateEl = document.getElementById(seasonId + '-start-date');
      const currentTimeEl = document.getElementById(seasonId + '-current-time');
      const mallStaminaEl = document.getElementById(seasonId + '-mall-stamina');
      
      if (startDateEl) startDateEl.addEventListener('change', () => autoCalculateStamina(seasonId));
      if (currentTimeEl) currentTimeEl.addEventListener('change', () => autoCalculateStamina(seasonId));
      if (mallStaminaEl) mallStaminaEl.addEventListener('input', () => autoCalculateStamina(seasonId));
      
      // 初始化時自動計算一次
      setTimeout(() => autoCalculateStamina(seasonId), 100);
    }
  });
});

/* ============================================
   體力計算函數
   ============================================ */

// 自動計算體力（不顯示獨立結果區塊）
function autoCalculateStamina(seasonId) {
  const constants = SEASON_CONSTANTS[seasonId];
  const state = seasonStates[seasonId];
  
  if (!constants || !state) return;
  
  const startDateInput = document.getElementById(seasonId + '-start-date');
  const currentTimeInput = document.getElementById(seasonId + '-current-time');
  const mallStaminaInput = document.getElementById(seasonId + '-mall-stamina');
  
  if (!startDateInput?.value || !currentTimeInput?.value) return;
  
  const startDate = new Date(startDateInput.value + 'T10:01:00');
  const currentTime = new Date(currentTimeInput.value);
  const mallStamina = parseInt(mallStaminaInput?.value) || 0;
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);
  endDate.setHours(8, 0, 0, 0);
  
  const remainingMs = endDate - currentTime;
  const daysRemaining = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(remainingMs / (1000 * 60 * 60));
  
  // 計算免費加速時數（每天2小時）
  const speedupHours = daysRemaining * 2;
  const totalHours = hoursRemaining + speedupHours;
  
  const staminaFromTime = totalHours * 5;
  const totalDailyBonus = constants.baseDailyStamina + mallStamina;
  const staminaFromDaily = daysRemaining * totalDailyBonus;
  
  const totalStamina = staminaFromTime + staminaFromDaily;
  
  state.totalStamina = totalStamina;
  state.totalHours = totalHours;
  state.daysRemaining = daysRemaining;
  state.hoursRemaining = hoursRemaining;
  state.speedupHours = speedupHours;
}

// 計算體力（保留向後兼容，但改為呼叫自動計算）
function calculateStamina(seasonId) {
  autoCalculateStamina(seasonId);
  alert('✅ 體力已計算！請繼續選擇體力使用優先級。\nStamina calculated! Please proceed to select stamina usage priority.');
}

/* ============================================
   UI 切換函數
   ============================================ */

// 切換賽季
function switchSeason(season) {
  document.querySelectorAll('.season-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  document.querySelectorAll('.season-content').forEach(content => content.classList.remove('active'));
  document.getElementById(season + '-content').classList.add('active');
}

// 切換分類折疊/展開
function toggleCategory(categoryId) {
  const content = document.getElementById(categoryId + '-content');
  const header = content.previousElementSibling;
  const icon = header.querySelector('.collapse-icon');
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    icon.textContent = '▶';
    header.classList.add('collapsed');
  } else {
    content.classList.add('active');
    icon.textContent = '▼';
    header.classList.remove('collapsed');
  }
}

// 切換升級詳情折疊/展開
function toggleUpgradeDetail(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.collapse-icon');
  const container = header.parentElement;
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    icon.textContent = '▶';
    container.classList.remove('expanded');
  } else {
    content.classList.add('active');
    icon.textContent = '▼';
    container.classList.add('expanded');
  }
}

/* ============================================
   快速設定函數
   ============================================ */

// 套用當前和目標等級到所有項目
function applyAvgLevelNew(seasonId, category, count) {
  const currentLevel = parseInt(document.getElementById(`${seasonId}-${category}-current-avg`).value);
  const targetLevel = parseInt(document.getElementById(`${seasonId}-${category}-target-avg`).value);
  
  if (isNaN(currentLevel) || isNaN(targetLevel)) {
    alert('請輸入有效等級 Please enter valid levels');
    return;
  }
  
  if (currentLevel >= targetLevel) {
    alert('目標等級必須高於當前等級 Target level must be higher than current level');
    return;
  }
  
  // 套用到該分類的所有項目
  for (let i = 1; i <= count; i++) {
    const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
    const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
    
    if (fromInput) fromInput.value = currentLevel;
    if (toInput) toInput.value = targetLevel;
  }
  
  // 視覺回饋
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓ 已套用 Applied';
  button.style.background = '#4CAF50';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
  }, 1500);
}

/* ============================================
   體力使用選擇
   ============================================ */

// 選擇體力使用優先級
function selectStaminaUsage(seasonId, resource) {
  const state = seasonStates[seasonId];
  state.staminaUsage = resource;
  
  document.querySelectorAll(`#${seasonId}-stamina-options .stamina-option`).forEach(opt => {
    opt.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

/* ============================================
   主要計算函數
   ============================================ */

// 計算資源
function calculateResources(seasonId) {
  const data = seasonData[seasonId];
  const state = seasonStates[seasonId];
  
  if (!data || !state) {
    alert('找不到賽季數據 Season data not found');
    return;
  }
  
  // 自動計算體力（如果尚未計算）
  if (state.totalStamina === 0) {
    autoCalculateStamina(seasonId);
  }
  
  if (state.totalStamina === 0) {
    alert('請先填寫步驟一的日期時間資訊\nPlease fill in Step 1: Date & Time information first');
    return;
  }
  
  if (!state.staminaUsage) {
    alert('請選擇體力使用優先級（步驟二）\nPlease select stamina usage priority (Step 2)');
    return;
  }
  
  // 步驟三：推車產量
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
  
  // 步驟四：秘境工具產量（基礎值 × 工具數量）
  const secretRealmProduction = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };
  
  // 計算每種秘境工具的產量
  if (data.secret_realm && data.secret_realm.resources) {
    data.secret_realm.resources.forEach(resource => {
      const toolQuantity = parseInt(document.getElementById(seasonId + '-tool-' + resource.key).value) || 0;
      // 公式：基礎值 × 工具數量
      const production = resource.value * toolQuantity;
      secretRealmProduction[resource.key] = production;
    });
  }
  
  // 步驟二：體力產量
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
  
  // 計算裝備需求
  for (let i = 1; i <= 5; i++) {
    const from = parseInt(document.getElementById(seasonId + `-gear${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-gear${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.gear, from, to);
    needed.gold += costs.gold || 0;
    needed.iron += costs.iron || 0;
    breakdown.gear.gold += costs.gold || 0;
    breakdown.gear.iron += costs.iron || 0;
  }
  
  // 計算技能需求
  for (let i = 1; i <= 8; i++) {
    const from = parseInt(document.getElementById(seasonId + `-skill${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-skill${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.skill, from, to);
    needed.battle_essence += costs.battle_record || 0;
    breakdown.skill.battle_essence += costs.battle_record || 0;
  }
  
  // 計算古遺物需求
  for (let i = 1; i <= 20; i++) {
    const from = parseInt(document.getElementById(seasonId + `-relic${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-relic${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.relic, from, to);
    needed.gold += costs.gold || 0;
    needed.hourglass += costs.hourglass || 0;
    breakdown.relic.gold += costs.gold || 0;
    breakdown.relic.hourglass += costs.hourglass || 0;
  }
  
  // 計算幻獸需求
  for (let i = 1; i <= 4; i++) {
    const from = parseInt(document.getElementById(seasonId + `-pet${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-pet${i}-to`).value);
    const costs = calculateCategoryCost(data.categories.pet, from, to);
    needed.freeze_dried += costs.freeze_dried || 0;
    breakdown.pet.freeze_dried += costs.freeze_dried || 0;
  }
  
  // 粗煉石（對應 YAML 的 iron key）
  needed.refined_stone += needed.iron;
  
  // 總可用資源 = 推車 + 體力 + 秘境工具
  const available = {
    gold: cartProduction.gold + staminaProduction.gold + secretRealmProduction.gold,
    refined_stone: cartProduction.refined_stone + staminaProduction.refined_stone + secretRealmProduction.refined_stone,
    hourglass: cartProduction.hourglass + staminaProduction.hourglass + secretRealmProduction.hourglass,
    battle_essence: cartProduction.battle_essence + staminaProduction.battle_essence + secretRealmProduction.battle_essence,
    freeze_dried: cartProduction.freeze_dried + staminaProduction.freeze_dried + secretRealmProduction.freeze_dried
  };
  
  displayResults(seasonId, needed, available, cartProduction, staminaProduction, secretRealmProduction, breakdown, state.staminaUsage);
}

/* ============================================
   輔助計算函數
   ============================================ */

// 計算分類花費
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

/* ============================================
   結果顯示函數
   ============================================ */

// 顯示結果
function displayResults(seasonId, needed, available, cartProd, staminaProd, secretRealmProd, breakdown, staminaUsage) {
  const resultsGrid = document.getElementById(seasonId + '-results-grid');
  const calcSummary = document.getElementById(seasonId + '-calc-summary');
  const state = seasonStates[seasonId];
  const constants = SEASON_CONSTANTS[seasonId];
  
  const resources = [
    { key: 'gold', name: 'Gold', name_zh: '金幣', icon: '💰' },
    { key: 'refined_stone', name: 'Refined Stone', name_zh: '粗煉石', icon: '🪨' },
    { key: 'hourglass', name: 'Hourglass', name_zh: '時之砂', icon: '⏳' },
    { key: 'battle_essence', name: 'Battle Essence', name_zh: '歷戰精華', icon: '📖' },
    { key: 'freeze_dried', name: 'Freeze-dried', name_zh: '凍乾', icon: '🥩' }
  ];
  
  // 取得體力次數和比率
  const totalRuns = Math.floor(state.totalStamina / 5);
  const staminaRates = {};
  seasonData[seasonId].stamina_production.resources.forEach(resource => {
    staminaRates[resource.key] = resource.value;
  });
  
  // 取得秘境工具數量資訊
  const toolQuantities = {};
  if (seasonData[seasonId].secret_realm && seasonData[seasonId].secret_realm.resources) {
    seasonData[seasonId].secret_realm.resources.forEach(resource => {
      const quantity = parseInt(document.getElementById(seasonId + '-tool-' + resource.key).value) || 0;
      toolQuantities[resource.key] = {
        quantity: quantity,
        baseValue: resource.value,
        name_zh: resource.tool_name_zh
      };
    });
  }
  
  // 建立計算摘要
  const staminaResourceName = resources.find(r => r.key === staminaUsage)?.name_zh || staminaUsage;
  const staminaResourceIcon = resources.find(r => r.key === staminaUsage)?.icon || '📦';
  
  const mallStamina = parseInt(document.getElementById(seasonId + '-mall-stamina')?.value) || 0;
  const totalDailyStamina = constants.baseDailyStamina + mallStamina;
  const timeStamina = state.totalHours * 5;
  const dailyStamina = state.daysRemaining * totalDailyStamina;
  
  let summaryHtml = `
    <h3>🧮 計算步驟 Calculation Steps</h3>
    
    <!-- 步驟 1：時間與體力 -->
    <div class="calc-step">
      <div class="step-title">⏰ 步驟一：時間與體力分析 Time & Stamina Analysis</div>
      <div class="step-content">
        <div class="step-item">
          <span class="step-label">剩餘天數 Days Remaining:</span>
          <span class="step-value">${state.daysRemaining.toLocaleString()} 天 days</span>
        </div>
        <div class="step-item">
          <span class="step-label">剩餘小時 Hours Remaining:</span>
          <span class="step-value">${state.hoursRemaining.toLocaleString()} 小時 hrs</span>
        </div>
        <div class="step-item">
          <span class="step-label">免費加速時數 Free Speedup Hours:</span>
          <span class="step-value">${state.speedupHours.toLocaleString()} 小時 hrs <span style="font-size:0.9em; color: var(--text-secondary);">(每天2小時 2hrs/day)</span></span>
        </div>
        <div class="step-item" style="border-top: 2px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
          <span class="step-label"><strong>總時數 Total Hours:</strong></span>
          <span class="step-value"><strong>${state.totalHours.toLocaleString()} 小時 hrs</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label"><strong>總體力 Total Stamina:</strong></span>
          <span class="step-value"><strong>${state.totalStamina.toLocaleString()}</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label"><strong>體力次數 Stamina Runs:</strong></span>
          <span class="step-value"><strong>${totalRuns.toLocaleString()} 次 runs <span style="font-size:0.9em; color: var(--text-secondary);">(5體力/次 5 stamina per run)</span></strong></span>
        </div>
      </div>
      <div class="production-breakdown">
        <div class="formula" style="color: var(--text-secondary); margin-top: 8px;">
          <strong>📋 計算公式 Calculation Formula:</strong><br>
          • 總時數 Total Hours = 剩餘小時 ${state.hoursRemaining.toLocaleString()} + 免費加速 (${state.daysRemaining} days × 2 hrs) = ${state.totalHours.toLocaleString()} hrs<br>
          • 時間體力 Time Stamina = ${state.totalHours.toLocaleString()} hrs × 5 = ${timeStamina.toLocaleString()}<br>
          • 每日體力 Daily Stamina = ${state.daysRemaining} days × ${totalDailyStamina} = ${dailyStamina.toLocaleString()}<br>
          • <strong>總體力 Total Stamina = ${timeStamina.toLocaleString()} + ${dailyStamina.toLocaleString()} = ${state.totalStamina.toLocaleString()}</strong><br>
          • <strong>體力次數 Stamina Runs = ${state.totalStamina.toLocaleString()} ÷ 5 = ${totalRuns.toLocaleString()} 次 runs</strong>
        </div>
      </div>
    </div>
    
    <!-- 步驟 2：體力優先級 -->
    <div class="calc-step">
      <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
      <div class="step-highlight">
        ${staminaResourceIcon} 全體力投入 All-in → ${staminaResourceName}
      </div>
      <div class="production-breakdown">
        <div class="formula" style="margin-top: 8px;">
          <strong>📋 計算過程 Calculation Process:</strong><br>
          <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8; background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
            <div style="margin-bottom: 8px;">1️⃣ 總體力 Total Stamina: <strong style="color: var(--primary-color);">${state.totalStamina.toLocaleString()}</strong></div>
            <div style="margin-bottom: 8px;">2️⃣ 每次消耗 Cost Per Run: <strong style="color: var(--warning-color);">5 體力 stamina</strong></div>
            <div style="margin-bottom: 8px;">3️⃣ 可刷取次數 Total Runs: ${state.totalStamina.toLocaleString()} ÷ 5 = <strong style="color: var(--info-color);">${totalRuns.toLocaleString()} 次 runs</strong></div>
            <div style="margin-bottom: 8px;">4️⃣ 每次產量 Production Per Run: <strong style="color: var(--success-color);">${staminaRates[staminaUsage].toLocaleString()}</strong> ${staminaResourceName}</div>
            <div style="padding-top: 8px; border-top: 2px solid var(--border-color);">
              5️⃣ <strong style="font-size: 1.1em; color: var(--success-color);">總產量 Total Production:</strong><br>
              <span style="font-size: 1.05em; padding-left: 20px; display: block; margin-top: 4px;">
                ${totalRuns.toLocaleString()} 次 runs × ${staminaRates[staminaUsage].toLocaleString()} = <strong style="color: var(--success-color); font-size: 1.2em;">${staminaProd[staminaUsage].toLocaleString()}</strong> ${staminaResourceName}
              </span>
            </div>
          </div>
        </div>
        <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 0.95em;">
          💡 <strong>說明 Note:</strong> 每次刷取消耗 5 體力，所以總次數 = 總體力 ÷ 5<br>
          Each run costs 5 stamina, so total runs = total stamina ÷ 5
        </div>
      </div>
    </div>
    
    <!-- 步驟 3：推車產量 -->
    <div class="calc-step">
      <div class="step-title">🏭 步驟三：推車產量 Cart Production (${state.totalHours.toLocaleString()} 小時 hours)</div>
      <div class="step-content">
        <div class="step-item">
          <span class="step-label">💰 金幣 Gold (${state.totalHours > 0 ? (cartProd.gold / state.totalHours).toFixed(0) : '0'}💰/hr) (×${state.totalHours.toLocaleString()}小時):</span>
          <span class="step-value">${cartProd.gold.toLocaleString()}</span>
        </div>
        <div class="step-item">
          <span class="step-label">🪨 粗煉石 Refined Stone (${state.totalHours > 0 ? (cartProd.refined_stone / state.totalHours).toFixed(0) : '0'}🪨/hr) (×${state.totalHours.toLocaleString()}小時):</span>
          <span class="step-value">${cartProd.refined_stone.toLocaleString()}</span>
        </div>
        <div class="step-item">
          <span class="step-label">⏳ 時之砂 Hourglass (${state.totalHours > 0 ? (cartProd.hourglass / state.totalHours).toFixed(0) : '0'}⏳/hr) (×${state.totalHours.toLocaleString()}小時):</span>
          <span class="step-value">${cartProd.hourglass.toLocaleString()}</span>
        </div>
        <div class="step-item">
          <span class="step-label">📖 歷戰精華 Battle Essence (${state.totalHours > 0 ? (cartProd.battle_essence / state.totalHours).toFixed(0) : '0'}📖/hr) (×${state.totalHours.toLocaleString()}小時):</span>
          <span class="step-value">${cartProd.battle_essence.toLocaleString()}</span>
        </div>
        <div class="step-item">
          <span class="step-label">🥩 凍乾 Freeze-dried (${state.totalHours > 0 ? (cartProd.freeze_dried / state.totalHours).toFixed(0) : '0'}🥩/hr) (×${state.totalHours.toLocaleString()}小時):</span>
          <span class="step-value">${cartProd.freeze_dried.toLocaleString()}</span>
        </div>
      </div>
      <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 0.95em;">
        💡 <strong>說明 Note:</strong> 推車產量 = 每小時產量 × 總時數 ${state.totalHours.toLocaleString()} 小時<br>
        Cart production = Rate per hour × Total hours ${state.totalHours.toLocaleString()} hrs
      </div>
    </div>
    
    <!-- 步驟 4：秘境工具產量 -->
    <div class="calc-step">
      <div class="step-title">🔨 步驟四：秘境工具產量 Secret Realm Tool Production</div>
      <div class="step-content">`;
  
  // 顯示每個工具的產量
  let hasTools = false;
  Object.keys(toolQuantities).forEach(key => {
    const resource = resources.find(r => r.key === key);
    const tool = toolQuantities[key];
    if (resource && tool && tool.quantity > 0) {
      hasTools = true;
      summaryHtml += `
        <div class="step-item">
          <span class="step-label">${resource.icon} ${tool.name_zh} <span style="color: var(--text-secondary); font-size: 0.9em;">(${tool.baseValue.toLocaleString()}${resource.icon})</span> (×${tool.quantity}個):</span>
          <span class="step-value">${secretRealmProd[key].toLocaleString()}</span>
        </div>`;
    }
  });
  
  if (!hasTools) {
    summaryHtml += `
        <div class="step-item">
          <span class="step-label" style="color: var(--text-secondary);">尚未擁有秘境工具 No secret realm tools yet</span>
          <span class="step-value">0</span>
        </div>`;
  }
  
  summaryHtml += `
      </div>
      <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 0.95em;">
        💡 <strong>說明 Note:</strong> 秘境工具產量 = 每個工具的基礎值 × 你擁有的工具數量<br>
        Secret Realm tool production = Base value per tool × Number of tools you own
      </div>
    </div>
    
    <!-- 步驟 5：升級需求 -->
    <div class="calc-step">
      <div class="step-title">🎯 步驟五：升級總需求 Total Upgrade Requirements</div>
      
      <!-- 5.0 總需求匯總 -->
      <div class="step-content" style="background: #f1f5f9; padding: 16px; border-radius: 8px; border: 2px solid var(--primary-color); margin-bottom: 20px;">
        <div style="text-align: center; margin-bottom: 12px;">
          <strong style="font-size: 1.1em; color: var(--primary-color);">📊 總需求匯總 Total Requirements Summary</strong>
        </div>
        <div class="step-item">
          <span class="step-label">💰 需要金幣 Gold Needed:</span>
          <span class="step-value"><strong style="font-size: 1.1em;">${needed.gold.toLocaleString()}</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label">🪨 粗煉石 Refined Stone:</span>
          <span class="step-value"><strong style="font-size: 1.1em;">${needed.refined_stone.toLocaleString()}</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label">⏳ 時之砂 Hourglass:</span>
          <span class="step-value"><strong style="font-size: 1.1em;">${needed.hourglass.toLocaleString()}</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label">📖 歷戰精華 Battle Essence:</span>
          <span class="step-value"><strong style="font-size: 1.1em;">${needed.battle_essence.toLocaleString()}</strong></span>
        </div>
        <div class="step-item">
          <span class="step-label">🥩 凍乾 Freeze-dried:</span>
          <span class="step-value"><strong style="font-size: 1.1em;">${needed.freeze_dried.toLocaleString()}</strong></span>
        </div>
      </div>
      
      <div class="production-breakdown" style="margin-bottom: 20px;">
        <strong>📋 計算來源 Calculation Source:</strong><br>
        • 💰 金幣 Gold = 裝備 Gear ${breakdown.gear.gold.toLocaleString()} + 古遺物 Relics ${breakdown.relic.gold.toLocaleString()} = ${needed.gold.toLocaleString()}<br>
        • 🪨 粗煉石 Refined Stone = ${breakdown.gear.iron.toLocaleString()}<br>
        • ⏳ 時之砂 Hourglass = 古遺物 Relics ${breakdown.relic.hourglass.toLocaleString()}<br>
        • 📖 歷戰精華 Battle Essence = 技能 Skills ${breakdown.skill.battle_essence.toLocaleString()}<br>
        • 🥩 凍乾 Freeze-dried = 幻獸 Pets ${breakdown.pet.freeze_dried.toLocaleString()}
      </div>
      
      <div style="text-align: center; margin: 16px 0; padding: 12px; background: #e0f2fe; border-radius: 6px;">
        <strong>📋 查看詳細升級清單 View Detailed Upgrade List</strong><br>
        <span style="font-size: 0.9em; color: var(--text-secondary);">點擊下方分類查看每件裝備/技能的升級需求 Click categories below to see individual upgrade requirements</span>
      </div>
      
      <!-- 5.1 裝備需求詳細表 -->
      <div class="upgrade-category-detail collapsible">
        <div class="category-header" onclick="toggleUpgradeDetail(this)">
          <span class="collapse-icon">▶</span>
          ⚔️ 裝備 Gear (5件 5 items) - 💰 ${breakdown.gear.gold.toLocaleString()} + 🪨 ${breakdown.gear.iron.toLocaleString()}
        </div>
        <div class="upgrade-detail-content">
          <div class="upgrade-table-container">
            <table class="upgrade-detail-table">
              <thead>
                <tr>
                  <th>裝備 Item</th>
                  <th>當前 Current</th>
                  <th>→</th>
                  <th>目標 Target</th>
                  <th>💰 金幣 Gold</th>
                  <th>🪨 粗煉石 Refined Stone</th>
                </tr>
              </thead>
              <tbody>`;
  
  // 計算並顯示每件裝備的升級需求
  for (let i = 1; i <= 5; i++) {
    const from = parseInt(document.getElementById(seasonId + `-gear${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-gear${i}-to`).value);
    const costs = calculateCategoryCost(seasonData[seasonId].categories.gear, from, to);
    const gold = costs.gold || 0;
    const iron = costs.iron || 0;
    
    summaryHtml += `
                <tr>
                  <td>裝備 ${i} Gear ${i}</td>
                  <td>${from}</td>
                  <td>→</td>
                  <td>${to}</td>
                  <td>${gold.toLocaleString()}</td>
                  <td>${iron.toLocaleString()}</td>
                </tr>`;
  }
  
  summaryHtml += `
                <tr class="total-row">
                  <td colspan="4"><strong>小計 Subtotal:</strong></td>
                  <td><strong>${breakdown.gear.gold.toLocaleString()}</strong></td>
                  <td><strong>${breakdown.gear.iron.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 5.2 技能需求詳細表 -->
      <div class="upgrade-category-detail collapsible">
        <div class="category-header" onclick="toggleUpgradeDetail(this)">
          <span class="collapse-icon">▶</span>
          📚 技能 Skills (8個 8 items) - 📖 ${breakdown.skill.battle_essence.toLocaleString()}
        </div>
        <div class="upgrade-detail-content">
          <div class="upgrade-table-container">
            <table class="upgrade-detail-table">
              <thead>
                <tr>
                  <th>技能 Skill</th>
                  <th>當前 Current</th>
                  <th>→</th>
                  <th>目標 Target</th>
                  <th>📖 歷戰精華 Battle Essence</th>
                </tr>
              </thead>
              <tbody>`;
  
  // 計算並顯示每個技能的升級需求
  for (let i = 1; i <= 8; i++) {
    const from = parseInt(document.getElementById(seasonId + `-skill${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-skill${i}-to`).value);
    const costs = calculateCategoryCost(seasonData[seasonId].categories.skill, from, to);
    const essence = costs.battle_record || 0;
    
    summaryHtml += `
                <tr>
                  <td>技能 ${i} Skill ${i}</td>
                  <td>${from}</td>
                  <td>→</td>
                  <td>${to}</td>
                  <td>${essence.toLocaleString()}</td>
                </tr>`;
  }
  
  summaryHtml += `
                <tr class="total-row">
                  <td colspan="4"><strong>小計 Subtotal:</strong></td>
                  <td><strong>${breakdown.skill.battle_essence.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 5.3 古遺物需求詳細表 -->
      <div class="upgrade-category-detail collapsible">
        <div class="category-header" onclick="toggleUpgradeDetail(this)">
          <span class="collapse-icon">▶</span>
          ✨ 古遺物 Relics (20個 20 items) - 💰 ${breakdown.relic.gold.toLocaleString()} + ⏳ ${breakdown.relic.hourglass.toLocaleString()}
        </div>
        <div class="upgrade-detail-content">
          <div class="upgrade-table-container">
            <table class="upgrade-detail-table">
              <thead>
                <tr>
                  <th>古遺物 Relic</th>
                  <th>當前 Current</th>
                  <th>→</th>
                  <th>目標 Target</th>
                  <th>💰 金幣 Gold</th>
                  <th>⏳ 時之砂 Hourglass</th>
                </tr>
              </thead>
              <tbody>`;
  
  // 計算並顯示每個古遺物的升級需求
  let hasRelicUpgrade = false;
  for (let i = 1; i <= 20; i++) {
    const from = parseInt(document.getElementById(seasonId + `-relic${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-relic${i}-to`).value);
    const costs = calculateCategoryCost(seasonData[seasonId].categories.relic, from, to);
    const gold = costs.gold || 0;
    const hourglass = costs.hourglass || 0;
    
    // 只顯示有升級需求的項目
    if (from < to) {
      hasRelicUpgrade = true;
      summaryHtml += `
                <tr>
                  <td>古遺物 ${i} Relic ${i}</td>
                  <td>${from}</td>
                  <td>→</td>
                  <td>${to}</td>
                  <td>${gold.toLocaleString()}</td>
                  <td>${hourglass.toLocaleString()}</td>
                </tr>`;
    }
  }
  
  if (!hasRelicUpgrade) {
    summaryHtml += `
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-secondary);">
                    無升級項目 No upgrades
                  </td>
                </tr>`;
  }
  
  summaryHtml += `
                <tr class="total-row">
                  <td colspan="4"><strong>小計 Subtotal:</strong></td>
                  <td><strong>${breakdown.relic.gold.toLocaleString()}</strong></td>
                  <td><strong>${breakdown.relic.hourglass.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 5.4 幻獸需求詳細表 -->
      <div class="upgrade-category-detail collapsible">
        <div class="category-header" onclick="toggleUpgradeDetail(this)">
          <span class="collapse-icon">▶</span>
          🐾 幻獸 Pets (4隻 4 items) - 🥩 ${breakdown.pet.freeze_dried.toLocaleString()}
        </div>
        <div class="upgrade-detail-content">
          <div class="upgrade-table-container">
            <table class="upgrade-detail-table">
              <thead>
                <tr>
                  <th>幻獸 Pet</th>
                  <th>當前 Current</th>
                  <th>→</th>
                  <th>目標 Target</th>
                  <th>🥩 凍乾 Freeze-dried</th>
                </tr>
              </thead>
              <tbody>`;
  
  // 計算並顯示每隻幻獸的升級需求
  for (let i = 1; i <= 4; i++) {
    const from = parseInt(document.getElementById(seasonId + `-pet${i}-from`).value);
    const to = parseInt(document.getElementById(seasonId + `-pet${i}-to`).value);
    const costs = calculateCategoryCost(seasonData[seasonId].categories.pet, from, to);
    const dried = costs.freeze_dried || 0;
    
    summaryHtml += `
                <tr>
                  <td>幻獸 ${i} Pet ${i}</td>
                  <td>${from}</td>
                  <td>→</td>
                  <td>${to}</td>
                  <td>${dried.toLocaleString()}</td>
                </tr>`;
  }
  
  summaryHtml += `
                <tr class="total-row">
                  <td colspan="4"><strong>小計 Subtotal:</strong></td>
                  <td><strong>${breakdown.pet.freeze_dried.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 步驟 6：最終計算 -->
    <div class="calc-step">
      <div class="step-title">📊 步驟六：可用 vs 需求 Available vs Required</div>
      <div class="production-breakdown" style="font-size: 1em;">
        <strong>每種資源的公式 Formula for each resource:</strong><br>
        <span style="color: var(--success-color);">可用 Available</span> = 
        <span style="color: var(--info-color);">推車產量 Cart</span> + 
        <span style="color: var(--warning-color);">體力產量 Stamina</span> + 
        <span style="color: #9333ea;">秘境工具 Secret Realm Tools</span><br>
        <span style="color: var(--primary-color);">結果 Result</span> = 
        <span style="color: var(--success-color);">可用 Available</span> - 
        <span style="color: var(--danger-color);">需求 Required</span>
      </div>
    </div>
  `;
  
  calcSummary.innerHTML = summaryHtml;
  
  // 建立結果網格
  let html = '';
  resources.forEach(resource => {
    const need = needed[resource.key] || 0;
    const avail = available[resource.key] || 0;
    const cart = cartProd[resource.key] || 0;
    const stamina = staminaProd[resource.key] || 0;
    const secretRealm = secretRealmProd[resource.key] || 0;
    const diff = avail - need;
    const isSurplus = diff >= 0;
    
    const staminaNote = resource.key === staminaUsage ? '<br><span style="font-size:0.8em; color: #f59e0b;">(⚡ 全投入 All-in)</span>' : '';
    
    html += `
      <div class="result-card">
        <div class="resource-name">${resource.icon} ${resource.name_zh}</div>
        <div class="resource-name-en">${resource.name}${staminaNote}</div>
        <div class="amounts">
          <div class="amount-row">
            <span class="amount-label">推車 Cart</span>
            <span class="amount-value" style="color: #0ea5e9;">${cart.toLocaleString()}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">體力 Stamina</span>
            <span class="amount-value" style="color: #f59e0b;">${stamina.toLocaleString()}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">秘境工具 Secret Realm</span>
            <span class="amount-value" style="color: #9333ea;">${secretRealm.toLocaleString()}</span>
          </div>
          <div class="amount-row" style="border-top: 2px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
            <span class="amount-label"><strong>總可獲得 Total Available</strong></span>
            <span class="amount-value" style="color: var(--success-color);"><strong>${avail.toLocaleString()}</strong></span>
          </div>
          <div class="amount-row">
            <span class="amount-label"><strong>需要 Required</strong></span>
            <span class="amount-value" style="color: var(--danger-color);"><strong>${need.toLocaleString()}</strong></span>
          </div>
        </div>
        <div class="difference ${isSurplus ? 'surplus' : 'shortage'}">
          ${isSurplus ? '✅' : '❌'} ${isSurplus ? '剩餘 Surplus: +' : '不足 Shortage: '}${Math.abs(diff).toLocaleString()}
        </div>
      </div>
    `;
  });
  
  resultsGrid.innerHTML = html;
  
  document.getElementById(seasonId + '-results').classList.add('show');
  document.getElementById(seasonId + '-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}