/* ============================================
   升級計算器 JavaScript - 使用外部模板版本
   Upgrade Calculator - External Templates Version
   ============================================ */

// 全局變量
let seasons, seasonData, SEASON_CONSTANTS, bondAdventureDataMap, freezeDriedExpData;
let seasonStates = {};
let templates = {}; // 存儲載入的模板

/* ============================================
   模板載入與渲染工具
   ============================================ */

// 載入 HTML 模板
async function loadTemplate(templateName) {
  try {
    const response = await fetch(`/assets/templates/upgrade/${templateName}.html`);
    if (!response.ok) {
      console.error(`Failed to load template: ${templateName}`);
      return '';
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    return '';
  }
}

// 初始化所有模板
async function initializeTemplates() {
  const templateNames = [
    'stamina-summary',
    'cart-production-summary',
    'secret-realm-summary',
    'bond-adventure-summary',
    'upgrade-requirements-summary'
  ];
  
  console.log('📥 開始載入模板 Loading templates...');
  
  for (const name of templateNames) {
    templates[name] = await loadTemplate(name);
    console.log(`✅ 已載入 Loaded: ${name}`);
  }
  
  console.log('✨ 所有模板載入完成 All templates loaded');
}

// 簡單的模板引擎
function renderTemplate(template, data) {
  let result = template;
  
  // 替換變量 {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
  
  // 處理條件語句 {{#if condition}}...{{/if}}
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  // 處理反向條件 {{^if condition}}...{{/if}}
  result = result.replace(/\{\{\^if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return !data[condition] ? content : '';
  });
  
  return result;
}

// 格式化數字（添加千分位）
function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString();
  }
  return num;
}

/* ============================================
   初始化函數
   ============================================ */

async function initializeCalculator(seasonsData, dataMap, constantsMap, bondDataMap, expData) {
  seasons = seasonsData;
  seasonData = dataMap;
  SEASON_CONSTANTS = constantsMap;
  bondAdventureDataMap = bondDataMap || {};
  freezeDriedExpData = expData;
  
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
  
  // 載入所有模板
  await initializeTemplates();
  
  console.log('已載入賽季 Loaded seasons:', Object.keys(seasonData));
  console.log('羈絆冒險數據 Bond Adventure data:', Object.keys(bondAdventureDataMap));
  console.log('凍乾經驗值數據 Freeze-dried EXP data:', freezeDriedExpData);
}

/* ============================================
   日期時間初始化
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  
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
      
      // 添加羈絆冒險監聽器 - 改為監聽新的 input 欄位
      const bondRewardEl = document.getElementById(seasonId + '-bond-stage-reward');
      
      if (bondRewardEl) {
        bondRewardEl.addEventListener('input', () => {
          updateBondAdventurePreview(seasonId);
        });
      }
      
      // 初始化時自動計算一次
      setTimeout(() => {
        autoCalculateStamina(seasonId);
        updateBondAdventurePreview(seasonId);
      }, 100);
    }
  });
});

/* ============================================
   體力計算函數
   ============================================ */

// 自動計算體力
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

/* ============================================
   羈絆冒險預覽函數
   ============================================ */

// 更新羈絆冒險預覽
function updateBondAdventurePreview(seasonId) {
  const state = seasonStates[seasonId];
  if (!state || state.daysRemaining === 0) {
    autoCalculateStamina(seasonId);
  }
  
  const bondRewardInput = document.getElementById(seasonId + '-bond-stage-reward');
  const previewContent = document.getElementById(seasonId + '-bond-preview-content');
  
  if (!bondRewardInput || !previewContent) return;
  
  const premiumPerRun = parseInt(bondRewardInput.value) || 0;
  
  const premiumExp = freezeDriedExpData.types.find(t => t.key === 'premium')?.exp || 400;
  
  const daysRemaining = state.daysRemaining || 0;
  const totalRuns = daysRemaining * 4;
  const premiumTotal = premiumPerRun * totalRuns;
  const totalExp = premiumTotal * premiumExp;
  
  let html = '';
  
  if (premiumPerRun === 0) {
    html = `
      <div style="color: #64748b;">
        ⚠️ 請輸入關卡獎勵數量 Please enter stage reward amount
      </div>
    `;
  } else {
    html = `
      <div style="margin-bottom: 8px;">
        <strong>⭐ 每次獎勵 Reward Per Run:</strong> ${premiumPerRun.toLocaleString()} 優質凍乾 Premium
      </div>
      <div style="margin-bottom: 8px;">
        <strong>📅 剩餘天數 Days Remaining:</strong> ${daysRemaining.toLocaleString()} 天 days (${totalRuns.toLocaleString()} 次獎勵 runs)
      </div>
      <div style="margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #bfdbfe;">
        <strong>⭐ 總可獲得 Total Premium:</strong> ${premiumTotal.toLocaleString()} 個 items
      </div>
      <div style="padding-top: 8px; border-top: 2px solid #3b82f6;">
        <strong style="font-size: 1.1em;">📈 總經驗值 Total EXP:</strong> 
        <span style="color: #16a34a; font-size: 1.2em; font-weight: bold;">${totalExp.toLocaleString()} EXP</span>
      </div>
    `;
    
    html += `
      <div style="margin-top: 12px; padding: 8px; background: #e0f2fe; border-radius: 6px; color: #075985; font-size: 0.9em;">
        📋 <strong>公式 Formula:</strong><br>
        ${daysRemaining} 天 × 4 次/天 × ${premiumPerRun} 個/次 × ${premiumExp} EXP = <strong style="color: #16a34a;">${totalExp.toLocaleString()} EXP</strong>
      </div>
    `;
  }
  
  previewContent.innerHTML = html;
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
  
  for (let i = 1; i <= count; i++) {
    const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
    const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
    
    if (fromInput) fromInput.value = currentLevel;
    if (toInput) toInput.value = targetLevel;
  }
  
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
  
  // 取得凍乾經驗值數據
  const normalType = freezeDriedExpData.types.find(t => t.key === 'normal');
  const premiumType = freezeDriedExpData.types.find(t => t.key === 'premium');
  const normalExp = normalType?.exp || 50;
  const premiumExp = premiumType?.exp || 400;
  
  // 步驟三：推車產量（普通凍乾）
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
    freeze_dried: cartDried * state.totalHours * normalExp
  };
  
  // 步驟四：秘境工具產量
  const secretRealmProduction = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };
  
  if (data.secret_realm && data.secret_realm.resources) {
    data.secret_realm.resources.forEach(resource => {
      const toolQuantity = parseInt(document.getElementById(seasonId + '-tool-' + resource.key).value) || 0;
      const production = resource.value * toolQuantity;
      secretRealmProduction[resource.key] = production;
    });
  }
  
  // 步驟四點五：羈絆冒險（S3+ 限定）
  let bondAdventureExp = 0;
  let bondAdventurePremium = 0;
  const currentSeason = seasons.find(s => s.id === seasonId);
  if (currentSeason?.bond_adventure_enabled) {
    const bondRewardInput = document.getElementById(seasonId + '-bond-stage-reward');
    const premiumPerRun = parseInt(bondRewardInput?.value) || 0;
    
    const totalRuns = state.daysRemaining * 4;
    const premiumTotal = premiumPerRun * totalRuns;
    
    bondAdventurePremium = premiumPerRun;
    bondAdventureExp = premiumTotal * premiumExp;
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
  
  // 粗煉石
  needed.refined_stone += needed.iron;
  
  // 總可用資源
  const available = {
    gold: cartProduction.gold + staminaProduction.gold + secretRealmProduction.gold,
    refined_stone: cartProduction.refined_stone + staminaProduction.refined_stone + secretRealmProduction.refined_stone,
    hourglass: cartProduction.hourglass + staminaProduction.hourglass + secretRealmProduction.hourglass,
    battle_essence: cartProduction.battle_essence + staminaProduction.battle_essence + secretRealmProduction.battle_essence,
    freeze_dried: cartProduction.freeze_dried + staminaProduction.freeze_dried + secretRealmProduction.freeze_dried + bondAdventureExp
  };
  
  displayResults(seasonId, needed, available, cartProduction, staminaProduction, secretRealmProduction, bondAdventureExp, breakdown, state.staminaUsage);
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
   結果顯示函數 (使用模板)
   ============================================ */

// 顯示結果
function displayResults(seasonId, needed, available, cartProd, staminaProd, secretRealmProd, bondAdventureExp, breakdown, staminaUsage) {
  const resultsGrid = document.getElementById(seasonId + '-results-grid');
  const calcSummary = document.getElementById(seasonId + '-calc-summary');
  const state = seasonStates[seasonId];
  const constants = SEASON_CONSTANTS[seasonId];
  const currentSeason = seasons.find(s => s.id === seasonId);
  
  const normalType = freezeDriedExpData.types.find(t => t.key === 'normal');
  const premiumType = freezeDriedExpData.types.find(t => t.key === 'premium');
  const normalExp = normalType?.exp || 50;
  const premiumExp = premiumType?.exp || 400;
  
  const resources = [
    { key: 'gold', name: 'Gold', name_zh: '金幣', icon: '💰' },
    { key: 'refined_stone', name: 'Refined Stone', name_zh: '粗煉石', icon: '🪨' },
    { key: 'hourglass', name: 'Hourglass', name_zh: '時之砂', icon: '⏳' },
    { key: 'battle_essence', name: 'Battle Essence', name_zh: '歷戰精華', icon: '📖' },
    { key: 'freeze_dried', name: 'Freeze-dried', name_zh: '凍乾', icon: '🥩' }
  ];
  
  // 準備模板數據
  const templateData = prepareTemplateData(
    seasonId, state, constants, staminaUsage, cartProd, staminaProd, 
    secretRealmProd, bondAdventureExp, needed, breakdown, available, 
    resources, currentSeason, normalExp, premiumExp
  );
  
  // 渲染計算摘要
  calcSummary.innerHTML = renderCalculationSummary(templateData);
  
  // 渲染結果網格
  resultsGrid.innerHTML = renderFinalComparison(templateData, resources, currentSeason);
  
  document.getElementById(seasonId + '-results').classList.add('show');
  document.getElementById(seasonId + '-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================
   模板數據準備
   ============================================ */

function prepareTemplateData(seasonId, state, constants, staminaUsage, cartProd, staminaProd, secretRealmProd, bondAdventureExp, needed, breakdown, available, resources, currentSeason, normalExp, premiumExp) {
  const totalRuns = Math.floor(state.totalStamina / 5);
  const staminaRates = {};
  seasonData[seasonId].stamina_production.resources.forEach(resource => {
    staminaRates[resource.key] = resource.value;
  });
  
  const mallStamina = parseInt(document.getElementById(seasonId + '-mall-stamina')?.value) || 0;
  const totalDailyStamina = constants.baseDailyStamina + mallStamina;
  const timeStamina = state.totalHours * 5;
  const dailyStamina = state.daysRemaining * totalDailyStamina;
  
  const cartDriedPerHour = parseInt(document.getElementById(seasonId + '-cart-dried').value) || 0;
  const cartDriedCount = cartDriedPerHour * state.totalHours;
  
  const staminaResource = resources.find(r => r.key === staminaUsage);
  
  // 秘境工具數據
  const toolQuantities = {};
  if (seasonData[seasonId].secret_realm && seasonData[seasonId].secret_realm.resources) {
    seasonData[seasonId].secret_realm.resources.forEach(resource => {
      const quantity = parseInt(document.getElementById(seasonId + '-tool-' + resource.key).value) || 0;
      toolQuantities[resource.key] = {
        quantity: quantity,
        baseValue: resource.value,
        name_zh: resource.tool_name_zh,
        icon: resources.find(r => r.key === resource.key)?.icon || '📦'
      };
    });
  }
  
  // 羈絆冒險數據
  let bondData = null;
  if (currentSeason?.bond_adventure_enabled && bondAdventureExp > 0) {
    const bondRewardInput = document.getElementById(seasonId + '-bond-stage-reward');
    const premiumPerRun = parseInt(bondRewardInput?.value) || 0;
    const totalBondRuns = state.daysRemaining * 4;
    const premiumTotal = premiumPerRun * totalBondRuns;
    
    bondData = {
      selectedStageText: '自訂 Custom',
      premiumPerRun: formatNumber(premiumPerRun),
      daysRemaining: formatNumber(state.daysRemaining),
      totalRuns: formatNumber(totalBondRuns),
      premiumTotal: formatNumber(premiumTotal),
      totalBondExp: formatNumber(bondAdventureExp),
      premiumExp: formatNumber(premiumExp)
    };
  }
  
  return {
    // 步驟 1: 體力數據
    daysRemaining: formatNumber(state.daysRemaining),
    hoursRemaining: formatNumber(state.hoursRemaining),
    speedupHours: formatNumber(state.speedupHours),
    totalHours: formatNumber(state.totalHours),
    totalStamina: formatNumber(state.totalStamina),
    totalRuns: formatNumber(totalRuns),
    totalDailyStamina: formatNumber(totalDailyStamina),
    timeStamina: formatNumber(timeStamina),
    dailyStamina: formatNumber(dailyStamina),
    
    // 步驟 2: 體力使用
    staminaResourceIcon: staminaResource?.icon || '📦',
    staminaResourceName: staminaResource?.name_zh || staminaUsage,
    staminaRate: formatNumber(staminaRates[staminaUsage]),
    staminaProduction: formatNumber(staminaProd[staminaUsage]),
    
    // 步驟 3: 推車產量
    goldPerHour: formatNumber(state.totalHours > 0 ? Math.round(cartProd.gold / state.totalHours) : 0),
    stonePerHour: formatNumber(state.totalHours > 0 ? Math.round(cartProd.refined_stone / state.totalHours) : 0),
    hourglassPerHour: formatNumber(state.totalHours > 0 ? Math.round(cartProd.hourglass / state.totalHours) : 0),
    essencePerHour: formatNumber(state.totalHours > 0 ? Math.round(cartProd.battle_essence / state.totalHours) : 0),
    driedPerHour: formatNumber(cartDriedPerHour),
    cartGold: formatNumber(cartProd.gold),
    cartStone: formatNumber(cartProd.refined_stone),
    cartHourglass: formatNumber(cartProd.hourglass),
    cartEssence: formatNumber(cartProd.battle_essence),
    cartDriedCount: formatNumber(cartDriedCount),
    cartDriedExp: formatNumber(cartProd.freeze_dried),
    normalExp: formatNumber(normalExp),
    
    // 步驟 4: 秘境工具
    toolQuantities: toolQuantities,
    secretRealmProd: secretRealmProd,
    
    // 步驟 4.5: 羈絆冒險
    bondData: bondData,
    hasBondAdventure: bondData !== null,
    
    // 步驟 5: 升級需求
    neededGold: formatNumber(needed.gold),
    neededRefinedStone: formatNumber(needed.refined_stone),
    neededHourglass: formatNumber(needed.hourglass),
    neededBattleEssence: formatNumber(needed.battle_essence),
    neededFreezeDried: formatNumber(needed.freeze_dried),
    
    breakdownGearGold: formatNumber(breakdown.gear.gold),
    breakdownGearIron: formatNumber(breakdown.gear.iron),
    breakdownRelicGold: formatNumber(breakdown.relic.gold),
    breakdownRelicHourglass: formatNumber(breakdown.relic.hourglass),
    breakdownSkillEssence: formatNumber(breakdown.skill.battle_essence),
    breakdownPetFreezeDried: formatNumber(breakdown.pet.freeze_dried),
    
    // 可用資源
    available: available,
    needed: needed
  };
}

/* ============================================
   模板渲染函數
   ============================================ */

// 渲染計算摘要
function renderCalculationSummary(data) {
  let html = '<h3>🧮 計算步驟 Calculation Steps</h3>';
  
  // 步驟 1: 體力分析
  html += renderTemplate(templates['stamina-summary'], data);
  
  // 步驟 2: 體力使用（內聯處理）
  html += renderStaminaUsageSummary(data);
  
  // 步驟 3: 推車產量
  html += renderTemplate(templates['cart-production-summary'], data);
  
  // 步驟 4: 秘境工具
  html += renderSecretRealmSummary(data);
  
  // 步驟 4.5: 羈絆冒險（條件渲染）
  if (data.hasBondAdventure) {
    html += renderTemplate(templates['bond-adventure-summary'], {
      ...data,
      ...data.bondData
    });
  }
  
  // 步驟 5: 升級需求
  html += renderTemplate(templates['upgrade-requirements-summary'], data);
  
  // 步驟 6: 最終說明
  html += renderFinalCalculationNote(data);
  
  return html;
}

// 渲染體力使用摘要（內聯處理）
function renderStaminaUsageSummary(data) {
  return `
    <div class="calc-step">
      <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
      <div class="step-highlight">
        ${data.staminaResourceIcon} 全體力投入 All-in → ${data.staminaResourceName}
      </div>
      <div class="production-breakdown">
        <div class="formula" style="margin-top: 8px;">
          <strong>📋 計算過程 Calculation Process:</strong><br>
          <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8; background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
            <div style="margin-bottom: 8px;">1️⃣ 總體力 Total Stamina: <strong style="color: var(--primary-color);">${data.totalStamina}</strong></div>
            <div style="margin-bottom: 8px;">2️⃣ 每次消耗 Cost Per Run: <strong style="color: var(--warning-color);">5 體力 stamina</strong></div>
            <div style="margin-bottom: 8px;">3️⃣ 可刷取次數 Total Runs: ${data.totalStamina} ÷ 5 = <strong style="color: var(--info-color);">${data.totalRuns} 次 runs</strong></div>
            <div style="margin-bottom: 8px;">4️⃣ 每次產量 Production Per Run: <strong style="color: var(--success-color);">${data.staminaRate}</strong> ${data.staminaResourceName}</div>
            <div style="padding-top: 8px; border-top: 2px solid var(--border-color);">
              5️⃣ <strong style="font-size: 1.1em; color: var(--success-color);">總產量 Total Production:</strong><br>
              <span style="font-size: 1.05em; padding-left: 20px; display: block; margin-top: 4px;">
                ${data.totalRuns} 次 runs × ${data.staminaRate} = <strong style="color: var(--success-color); font-size: 1.2em;">${data.staminaProduction}</strong> ${data.staminaResourceName}
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
  `;
}

// 渲染秘境工具摘要
function renderSecretRealmSummary(data) {
  const resources = [
    { key: 'gold', name_zh: '金幣', icon: '💰' },
    { key: 'refined_stone', name_zh: '粗煉石', icon: '🪨' },
    { key: 'hourglass', name_zh: '時之砂', icon: '⏳' },
    { key: 'battle_essence', name_zh: '歷戰精華', icon: '📖' }
  ];
  
  let toolItemsHtml = '';
  let hasTools = false;
  
  Object.keys(data.toolQuantities).forEach(key => {
    const tool = data.toolQuantities[key];
    if (tool && tool.quantity > 0) {
      hasTools = true;
      const production = data.secretRealmProd[key] || 0;
      toolItemsHtml += `
        <div class="step-item">
          <span class="step-label">${tool.icon} ${tool.name_zh} <span style="color: var(--text-secondary); font-size: 0.9em;">(${formatNumber(tool.baseValue)}${tool.icon})</span> (×${tool.quantity}個):</span>
          <span class="step-value">${formatNumber(production)}</span>
        </div>`;
    }
  });
  
  if (!hasTools) {
    toolItemsHtml = `
      <div class="step-item">
        <span class="step-label" style="color: var(--text-secondary);">尚未擁有秘境工具 No secret realm tools yet</span>
        <span class="step-value">0</span>
      </div>`;
  }
  
  return renderTemplate(templates['secret-realm-summary'], {
    ...data,
    toolItemsHtml: toolItemsHtml
  });
}

// 渲染最終計算說明
function renderFinalCalculationNote(data) {
  const bondText = data.hasBondAdventure ? ' + <span style="color: #f59e0b;">羈絆冒險 Bond Adventure</span>' : '';
  
  return `
    <div class="calc-step">
      <div class="step-title">📊 步驟六：可用 vs 需求 Available vs Required</div>
      <div class="production-breakdown" style="font-size: 1em;">
        <strong>每種資源的公式 Formula for each resource:</strong><br>
        <span style="color: var(--success-color);">可用 Available</span> = 
        <span style="color: var(--info-color);">推車產量 Cart</span> + 
        <span style="color: var(--warning-color);">體力產量 Stamina</span> + 
        <span style="color: #9333ea;">秘境工具 Secret Realm Tools</span>${bondText}<br>
        <span style="color: var(--primary-color);">結果 Result</span> = 
        <span style="color: var(--success-color);">可用 Available</span> - 
        <span style="color: var(--danger-color);">需求 Required</span>
      </div>
    </div>
  `;
}

// 渲染最終對比
function renderFinalComparison(data, resources, currentSeason) {
  let cardsHtml = '';
  
  resources.forEach(resource => {
    const need = data.needed[resource.key] || 0;
    const avail = data.available[resource.key] || 0;
    
    // 解析回數字
    const needNum = typeof need === 'number' ? need : parseInt(String(need).replace(/,/g, '')) || 0;
    const availNum = typeof avail === 'number' ? avail : parseInt(String(avail).replace(/,/g, '')) || 0;
    
    const diff = availNum - needNum;
    const isSurplus = diff >= 0;
    
    // 獲取各個來源的產量
    const cartKey = 'cart' + resource.key.charAt(0).toUpperCase() + resource.key.slice(1).replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
    const cart = data[cartKey] || data['cartGold'] || 0;
    
    const staminaKey = 'stamina' + resource.key.charAt(0).toUpperCase() + resource.key.slice(1).replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
    const stamina = data[staminaKey] || (resource.key === data.staminaResourceName?.toLowerCase() ? data.staminaProduction : 0) || 0;
    
    const secretRealmValue = data.secretRealmProd[resource.key] || 0;
    
    const bondContribution = (resource.key === 'freeze_dried' && data.hasBondAdventure) ? data.bondData?.totalBondExp || 0 : 0;
    
    const staminaNote = data.staminaResourceName && resource.name_zh === data.staminaResourceName.replace(/,/g, '') 
      ? '<br><span style="font-size:0.8em; color: #f59e0b;">(⚡ 全投入 All-in)</span>' 
      : '';
    
    cardsHtml += `
      <div class="result-card">
        <div class="resource-name">${resource.icon} ${resource.name_zh}</div>
        <div class="resource-name-en">${resource.name}${staminaNote}</div>
        <div class="amounts">
          <div class="amount-row">
            <span class="amount-label">推車 Cart</span>
            <span class="amount-value" style="color: #0ea5e9;">${typeof cart === 'number' ? formatNumber(cart) : cart}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">體力 Stamina</span>
            <span class="amount-value" style="color: #f59e0b;">${typeof stamina === 'number' ? formatNumber(stamina) : stamina}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">秘境工具 Secret Realm</span>
            <span class="amount-value" style="color: #9333ea;">${formatNumber(secretRealmValue)}</span>
          </div>`;
    
    if (currentSeason?.bond_adventure_enabled) {
      cardsHtml += `
          <div class="amount-row">
            <span class="amount-label">羈絆冒險 Bond Adventure</span>
            <span class="amount-value" style="color: #f59e0b;">${typeof bondContribution === 'number' ? formatNumber(bondContribution) : bondContribution}</span>
          </div>`;
    }
    
    cardsHtml += `
          <div class="amount-row" style="border-top: 2px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
            <span class="amount-label"><strong>總可獲得 Total Available</strong></span>
            <span class="amount-value" style="color: var(--success-color);"><strong>${typeof avail === 'number' ? formatNumber(avail) : avail}</strong></span>
          </div>
          <div class="amount-row">
            <span class="amount-label"><strong>需要 Required</strong></span>
            <span class="amount-value" style="color: var(--danger-color);"><strong>${typeof need === 'number' ? formatNumber(need) : need}</strong></span>
          </div>
        </div>
        <div class="difference ${isSurplus ? 'surplus' : 'shortage'}">
          ${isSurplus ? '✅' : '❌'} ${isSurplus ? '剩餘 Surplus: +' : '不足 Shortage: '}${formatNumber(Math.abs(diff))}
        </div>
      </div>
    `;
  });
  
  return cardsHtml;
}