/**
 * ============================================
 * 升級計算器主程式 Upgrade Calculator Main
 * ============================================
 * 此檔案處理所有計算邏輯
 * This file handles all calculation logic
 */

// ============================================
// 全域變數 Global Variables
// ============================================
let SEASONS = [];
let SEASON_DATA = {};
let SEASON_CONSTANTS = {};
let BOND_ADVENTURE_DATA = {};
let FREEZE_DRIED_EXP_DATA = {};
let currentSeason = 's3';
let selectedStaminaUsage = {};

// ============================================
// 初始化函數 Initialization Functions
// ============================================

/**
 * 初始化計算器
 * Initialize calculator
 */
function initializeCalculator(seasons, seasonData, seasonConstants, bondAdventureDataMap, freezeDriedExpData) {
  SEASONS = seasons;
  SEASON_DATA = seasonData;
  SEASON_CONSTANTS = seasonConstants;
  BOND_ADVENTURE_DATA = bondAdventureDataMap;
  FREEZE_DRIED_EXP_DATA = freezeDriedExpData;

  console.log('Calculator initialized with data:', {
    seasons: SEASONS.length,
    seasonData: Object.keys(SEASON_DATA),
    constants: Object.keys(SEASON_CONSTANTS),
    bondAdventure: Object.keys(BOND_ADVENTURE_DATA),
    freezeDriedExp: FREEZE_DRIED_EXP_DATA
  });

  // 設定當前時間
  setCurrentDateTime();

  // 為每個賽季初始化預設的體力使用選項
  SEASONS.forEach(season => {
    if (SEASON_DATA[season.id]) {
      selectedStaminaUsage[season.id] = null;
    }
  });
}

/**
 * 設定當前日期時間
 * Set current date time
 */
function setCurrentDateTime() {
  SEASONS.forEach(season => {
    const currentTimeInput = document.getElementById(`${season.id}-current-time`);
    if (currentTimeInput) {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);
      currentTimeInput.value = localDateTime;
    }
  });
}

// ============================================
// 賽季切換 Season Switching
// ============================================

/**
 * 切換賽季
 * Switch season
 */
function switchSeason(seasonId) {
  // 更新當前賽季
  currentSeason = seasonId;

  // 更新按鈕狀態
  document.querySelectorAll('.season-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // 更新內容顯示
  document.querySelectorAll('.season-content').forEach(content => {
    content.classList.remove('active');
  });
  const targetContent = document.getElementById(`${seasonId}-content`);
  if (targetContent) {
    targetContent.classList.add('active');
  }

  console.log(`Switched to season: ${seasonId}`);
}

// ============================================
// 體力使用選擇 Stamina Usage Selection
// ============================================

/**
 * 選擇體力使用優先級
 * Select stamina usage priority
 */
function selectStaminaUsage(seasonId, resourceKey) {
  selectedStaminaUsage[seasonId] = resourceKey;

  // 更新視覺效果
  const container = document.getElementById(`${seasonId}-stamina-options`);
  if (container) {
    const options = container.querySelectorAll('.stamina-option');
    options.forEach(option => {
      option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
  }

  console.log(`Selected stamina usage for ${seasonId}:`, resourceKey);
}

// ============================================
// 折疊/展開分類 Toggle Categories
// ============================================

/**
 * 切換分類折疊狀態
 * Toggle category collapse state
 */
function toggleCategory(categoryId) {
  const header = event.currentTarget;
  const content = document.getElementById(`${categoryId}-content`);
  const icon = header.querySelector('.collapse-icon');

  if (content && icon) {
    const isCollapsed = header.classList.contains('collapsed');
    
    if (isCollapsed) {
      header.classList.remove('collapsed');
      content.style.display = 'block';
      content.style.maxHeight = 'initial';
      icon.textContent = '▼';
    } else {
      header.classList.add('collapsed');
      content.style.display = 'none';
      content.style.maxHeight = 0;
      icon.textContent = '▶';
    }
  }
}

// ============================================
// 套用平均等級 Apply Average Levels
// ============================================

/**
 * 套用平均等級到所有項目
 * Apply average level to all items (New version)
 */
function applyAvgLevelNew(seasonId, category, itemCount) {
  const currentAvgInput = document.getElementById(`${seasonId}-${category}-current-avg`);
  const targetAvgInput = document.getElementById(`${seasonId}-${category}-target-avg`);

  if (!currentAvgInput || !targetAvgInput) {
    console.error(`Average level inputs not found for ${seasonId}-${category}`);
    return;
  }

  const currentAvg = parseInt(currentAvgInput.value);
  const targetAvg = parseInt(targetAvgInput.value);

  if (isNaN(currentAvg) || isNaN(targetAvg)) {
    alert('請輸入有效的等級數字 Please enter valid level numbers');
    return;
  }

  if (targetAvg < currentAvg) {
    alert('目標等級不能低於當前等級 Target level cannot be lower than current level');
    return;
  }

  // 套用到所有項目
  for (let i = 1; i <= itemCount; i++) {
    const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
    const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
    
    if (fromInput && toInput) {
      fromInput.value = currentAvg;
      toInput.value = targetAvg;
    }
  }

  console.log(`Applied avg levels for ${category}: ${currentAvg} → ${targetAvg}`);
}

// ============================================
// 羈絆冒險預覽 Bond Adventure Preview
// ============================================

/**
 * 更新羈絆冒險預覽
 * Update bond adventure preview
 */
function updateBondAdventurePreview(seasonId) {
  const rewardInput = document.getElementById(`${seasonId}-bond-stage-reward`);
  const previewContent = document.getElementById(`${seasonId}-bond-preview-content`);

  if (!rewardInput || !previewContent) return;

  const rewardPerRun = parseInt(rewardInput.value) || 0;

  if (rewardPerRun === 0) {
    previewContent.innerHTML = '請輸入關卡獎勵數量<br>Please enter stage reward amount';
    return;
  }

  // 計算總獎勵
  const constants = SEASON_CONSTANTS[seasonId];
  if (!constants) return;

  const daysRemaining = calculateDaysRemaining(seasonId);
  const totalRuns = daysRemaining * 4; // 每天4次
  const totalPremium = rewardPerRun * totalRuns;

  // 取得優質凍乾的經驗值
  const premiumExp = FREEZE_DRIED_EXP_DATA.types.find(t => t.type === 'premium')?.exp || 300;
  const totalExp = totalPremium * premiumExp;

  previewContent.innerHTML = `
    <strong>每次獎勵 Per Run:</strong> ${formatNumber(rewardPerRun)} 個優質凍乾 Premium<br>
    <strong>剩餘天數 Days:</strong> ${daysRemaining} 天 (${totalRuns} 次獎勵 runs)<br>
    <strong>總獎勵 Total:</strong> ${formatNumber(totalPremium)} 個優質凍乾 Premium<br>
    <strong>總經驗值 Total EXP:</strong> ${formatNumber(totalExp)} EXP
  `;
}

// ============================================
// 計算天數 Calculate Days
// ============================================

/**
 * 計算剩餘天數
 * Calculate remaining days
 */
function calculateDaysRemaining(seasonId) {
  const startDateInput = document.getElementById(`${seasonId}-start-date`);
  const currentTimeInput = document.getElementById(`${seasonId}-current-time`);

  if (!startDateInput || !currentTimeInput) return 0;

  const startDate = new Date(`${startDateInput.value}T08:00:00`);
  const currentDate = new Date(currentTimeInput.value);
  const constants = SEASON_CONSTANTS[seasonId];

  if (!constants) return 0;

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);

  const remainingMs = endDate - currentDate;
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

  return Math.min(remainingDays, constants.totalDays);
}

// ============================================
// 主計算函數 Main Calculation Function
// ============================================

/**
 * 計算資源 - 主函數
 * Calculate resources - Main function
 */
function calculateResources(seasonId) {
  console.log(`Starting calculation for ${seasonId}`);

  try {
    // 步驟 1: 計算可用體力
    const staminaResult = calculateStamina(seasonId);
    if (!staminaResult) {
      alert('體力計算失敗 Stamina calculation failed');
      return;
    }

    // 步驟 2: 檢查是否選擇體力使用優先級
    if (!selectedStaminaUsage[seasonId]) {
      alert('請先選擇體力使用優先級 Please select stamina usage priority first');
      return;
    }

    // 步驟 3: 計算推車產量
    const cartProduction = calculateCartProduction(seasonId, staminaResult.totalHours);

    // 步驟 4: 計算秘境工具產量
    const secretRealmProduction = calculateSecretRealmProduction(seasonId);

    // 步驟 4.5: 計算羈絆冒險（如果啟用）
    let bondAdventureProduction = null;
    const season = SEASONS.find(s => s.id === seasonId);
    if (season && season.bond_adventure_enabled) {
      bondAdventureProduction = calculateBondAdventureProduction(seasonId, staminaResult.daysRemaining);
    }

    // 步驟 5: 計算升級需求
    const upgradeNeeds = calculateUpgradeNeeds(seasonId);

    // 計算總生產量
    const totalProduction = calculateTotalProduction(
      staminaResult,
      cartProduction,
      secretRealmProduction,
      bondAdventureProduction,
      selectedStaminaUsage[seasonId]
    );

    // 顯示結果
    displayResults(seasonId, {
      stamina: staminaResult,
      cart: cartProduction,
      secretRealm: secretRealmProduction,
      bondAdventure: bondAdventureProduction,
      upgradeNeeds: upgradeNeeds,
      totalProduction: totalProduction,
      staminaUsage: selectedStaminaUsage[seasonId]
    });

  } catch (error) {
    console.error('Calculation error:', error);
    alert(`計算過程發生錯誤 Calculation error: ${error.message}`);
  }
}

// ============================================
// 步驟 1: 體力計算 Stamina Calculation
// ============================================

/**
 * 計算可用體力
 * Calculate available stamina
 */
function calculateStamina(seasonId) {
  const startDateInput = document.getElementById(`${seasonId}-start-date`);
  const currentTimeInput = document.getElementById(`${seasonId}-current-time`);
  const mallStaminaInput = document.getElementById(`${seasonId}-mall-stamina`);

  if (!startDateInput || !currentTimeInput || !mallStaminaInput) {
    console.error('Stamina inputs not found');
    return null;
  }

  const constants = SEASON_CONSTANTS[seasonId];
  if (!constants) {
    console.error(`Season constants not found for ${seasonId}`);
    return null;
  }

  // 解析日期
  const startDate = new Date(`${startDateInput.value}T08:00:00`);
  const currentDate = new Date(currentTimeInput.value);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);

  // 計算剩餘時間
  const remainingMs = endDate - currentDate;
  const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60));
  const remainingDays = Math.max(0, Math.ceil(remainingHours / 24));

  // 計算體力
  const speedupHours = remainingDays * 2; // 每天2小時加速
  const totalHours = Math.round(remainingHours + speedupHours);
  const timeStamina = totalHours * 5; // 每小時5體力

  const mallStamina = parseInt(mallStaminaInput.value) || 0;
  const totalDailyStamina = constants.baseDailyStamina + mallStamina;
  const dailyStamina = remainingDays * totalDailyStamina;

  const totalStamina = timeStamina + dailyStamina;
  const staminaPerRun = 5; // 每次消耗5體力
  const totalRuns = Math.floor(totalStamina / staminaPerRun);

  return {
    daysRemaining: remainingDays,
    hoursRemaining: Math.round(remainingHours),
    speedupHours: speedupHours,
    totalHours: totalHours,
    timeStamina: timeStamina,
    dailyStamina: dailyStamina,
    totalDailyStamina: totalDailyStamina,
    totalStamina: totalStamina,
    totalRuns: totalRuns,
    staminaPerRun: staminaPerRun
  };
}

// ============================================
// 步驟 3: 推車產量計算 Cart Production
// ============================================

/**
 * 計算推車產量
 * Calculate cart production
 */
function calculateCartProduction(seasonId, totalHours) {
  const goldPerHour = parseInt(document.getElementById(`${seasonId}-cart-gold`)?.value) || 0;
  const stonePerHour = parseInt(document.getElementById(`${seasonId}-cart-stone`)?.value) || 0;
  const hourglassPerHour = parseInt(document.getElementById(`${seasonId}-cart-hourglass`)?.value) || 0;
  const essencePerHour = parseInt(document.getElementById(`${seasonId}-cart-essence`)?.value) || 0;
  const driedPerHour = parseInt(document.getElementById(`${seasonId}-cart-dried`)?.value) || 0;

  // 取得普通凍乾的經驗值
  const normalExp = FREEZE_DRIED_EXP_DATA.types.find(t => t.type === 'normal')?.exp || 150;

  const freeze_dried_count = driedPerHour * totalHours;
  const freeze_dried_exp = freeze_dried_count * normalExp;

  return {
    gold: goldPerHour * totalHours,
    refined_stone: stonePerHour * totalHours,
    hourglass: hourglassPerHour * totalHours,
    battle_essence: essencePerHour * totalHours,
    freeze_dried_count: freeze_dried_count,
    freeze_dried_exp: freeze_dried_exp,
    rates: {
      goldPerHour,
      stonePerHour,
      hourglassPerHour,
      essencePerHour,
      driedPerHour,
      normalExp
    }
  };
}

// ============================================
// 步驟 4: 秘境工具產量 Secret Realm Production
// ============================================

/**
 * 計算秘境工具產量
 * Calculate secret realm production
 */
function calculateSecretRealmProduction(seasonId) {
  const seasonData = SEASON_DATA[seasonId];
  if (!seasonData || !seasonData.secret_realm) {
    return { tools: [] };
  }

  const tools = [];
  let totalGold = 0;
  let totalRefinedStone = 0;
  let totalHourglass = 0;
  let totalBattleEssence = 0;

  seasonData.secret_realm.resources.forEach(resource => {
    const toolInput = document.getElementById(`${seasonId}-tool-${resource.key}`);
    const toolCount = parseInt(toolInput?.value) || 0;

    if (toolCount > 0) {
      const totalProduction = resource.value * toolCount;

      tools.push({
        key: resource.key,
        name_zh: resource.tool_name_zh,
        name: resource.tool_name,
        icon: resource.icon,
        count: toolCount,
        valuePerTool: resource.value,
        totalProduction: totalProduction
      });

      // 累加到對應資源
      switch (resource.key) {
        case 'gold':
          totalGold += totalProduction;
          break;
        case 'refined_stone':
          totalRefinedStone += totalProduction;
          break;
        case 'hourglass':
          totalHourglass += totalProduction;
          break;
        case 'battle_essence':
          totalBattleEssence += totalProduction;
          break;
      }
    }
  });

  return {
    tools,
    gold: totalGold,
    refined_stone: totalRefinedStone,
    hourglass: totalHourglass,
    battle_essence: totalBattleEssence
  };
}

// ============================================
// 步驟 4.5: 羈絆冒險計算 Bond Adventure
// ============================================

/**
 * 計算羈絆冒險產量
 * Calculate bond adventure production
 */
function calculateBondAdventureProduction(seasonId, daysRemaining) {
  const rewardInput = document.getElementById(`${seasonId}-bond-stage-reward`);
  if (!rewardInput) return null;

  const rewardPerRun = parseInt(rewardInput.value) || 0;
  if (rewardPerRun === 0) return null;

  const runsPerDay = 4; // 每天4次獎勵
  const totalRuns = daysRemaining * runsPerDay;
  const premiumCount = rewardPerRun * totalRuns;

  // 取得優質凍乾的經驗值
  const premiumExp = FREEZE_DRIED_EXP_DATA.types.find(t => t.type === 'premium')?.exp || 300;
  const freeze_dried_exp = premiumCount * premiumExp;

  return {
    reward_per_run: rewardPerRun,
    runs_per_day: runsPerDay,
    total_runs: totalRuns,
    premium_count: premiumCount,
    premium_exp: premiumExp,
    freeze_dried_exp: freeze_dried_exp
  };
}

// ============================================
// 步驟 5: 升級需求計算 Upgrade Needs
// ============================================

/**
 * 計算升級需求
 * Calculate upgrade needs
 */
function calculateUpgradeNeeds(seasonId) {
  const seasonData = SEASON_DATA[seasonId];
  if (!seasonData) {
    console.error(`Season data not found for ${seasonId}`);
    return null;
  }

  const categories = ['gear', 'skill', 'relic', 'pet'];
  const itemCounts = {
    gear: 5,
    skill: 8,
    relic: 20,
    pet: 4
  };

  let totalGold = 0;
  let totalRefinedStone = 0;
  let totalHourglass = 0;
  let totalBattleEssence = 0;
  let totalFreezeDried = 0;

  const breakdown = {
    gear: { gold: 0, iron: 0, details: [] },
    skill: { battle_essence: 0, details: [] },
    relic: { gold: 0, hourglass: 0, details: [] },
    pet: { freeze_dried: 0, details: [] }
  };

  categories.forEach(category => {
    const count = itemCounts[category];
    const categoryData = seasonData.categories[category];

    if (!categoryData) {
      console.warn(`Category data not found for ${category}`);
      return;
    }

    for (let i = 1; i <= count; i++) {
      const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
      const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);

      if (!fromInput || !toInput) continue;

      const fromLevel = parseInt(fromInput.value);
      const toLevel = parseInt(toInput.value);

      if (isNaN(fromLevel) || isNaN(toLevel) || toLevel <= fromLevel) continue;

      // 計算該項目的升級成本
      const cost = calculateUpgradeCost(categoryData, fromLevel, toLevel);

      if (cost) {
        // 累加到總需求
        switch (category) {
          case 'gear':
            totalGold += cost.gold || 0;
            totalRefinedStone += cost.iron || 0;
            breakdown.gear.gold += cost.gold || 0;
            breakdown.gear.iron += cost.iron || 0;
            breakdown.gear.details.push({
              index: i,
              from: fromLevel,
              to: toLevel,
              gold: cost.gold || 0,
              iron: cost.iron || 0
            });
            break;

          case 'skill':
            totalBattleEssence += cost.battle_record || 0;
            breakdown.skill.battle_essence += cost.battle_record || 0;
            breakdown.skill.details.push({
              index: i,
              from: fromLevel,
              to: toLevel,
              battle_record: cost.battle_record || 0
            });
            break;

          case 'relic':
            totalGold += cost.gold || 0;
            totalHourglass += cost.hourglass || 0;
            breakdown.relic.gold += cost.gold || 0;
            breakdown.relic.hourglass += cost.hourglass || 0;
            breakdown.relic.details.push({
              index: i,
              from: fromLevel,
              to: toLevel,
              gold: cost.gold || 0,
              hourglass: cost.hourglass || 0
            });
            break;

          case 'pet':
            totalFreezeDried += cost.freeze_dried || 0;
            breakdown.pet.freeze_dried += cost.freeze_dried || 0;
            breakdown.pet.details.push({
              index: i,
              from: fromLevel,
              to: toLevel,
              freeze_dried: cost.freeze_dried || 0
            });
            break;
        }
      }
    }
  });

  return {
    needs: {
      gold: totalGold,
      refined_stone: totalRefinedStone,
      hourglass: totalHourglass,
      battle_essence: totalBattleEssence,
      freeze_dried: totalFreezeDried
    },
    breakdown: breakdown
  };
}

/**
 * 計算單一升級成本
 * Calculate single upgrade cost
 */
function calculateUpgradeCost(categoryData, fromLevel, toLevel) {
  if (!categoryData.levels) return null;

  const cost = {
    gold: 0,
    iron: 0,
    hourglass: 0,
    battle_record: 0,
    freeze_dried: 0
  };

  for (let level = fromLevel; level < toLevel; level++) {
    const levelData = categoryData.levels.find(l => l.level === level);
    if (levelData) {
      cost.gold += levelData.gold || 0;
      cost.iron += levelData.iron || 0;
      cost.hourglass += levelData.hourglass || 0;
      cost.battle_record += levelData.battle_record || 0;
      cost.freeze_dried += levelData.freeze_dried || 0;
    }
  }

  return cost;
}

// ============================================
// 計算總生產量 Calculate Total Production
// ============================================

/**
 * 計算總生產量
 * Calculate total production
 */
function calculateTotalProduction(stamina, cart, secretRealm, bondAdventure, staminaUsageKey) {
  const seasonData = SEASON_DATA[currentSeason];
  if (!seasonData) return null;

  // 基礎生產（推車 + 秘境）
  let totalGold = (cart.gold || 0) + (secretRealm.gold || 0);
  let totalRefinedStone = (cart.refined_stone || 0) + (secretRealm.refined_stone || 0);
  let totalHourglass = (cart.hourglass || 0) + (secretRealm.hourglass || 0);
  let totalBattleEssence = (cart.battle_essence || 0) + (secretRealm.battle_essence || 0);
  let totalFreezeDried = (cart.freeze_dried_exp || 0);

  // 添加羈絆冒險產量（如果有）
  if (bondAdventure) {
    totalFreezeDried += bondAdventure.freeze_dried_exp || 0;
  }

  // 計算體力刷取的資源
  const staminaProduction = calculateStaminaProduction(stamina, staminaUsageKey);
  if (staminaProduction) {
    totalGold += staminaProduction.gold || 0;
    totalRefinedStone += staminaProduction.refined_stone || 0;
    totalHourglass += staminaProduction.hourglass || 0;
    totalBattleEssence += staminaProduction.battle_essence || 0;
    totalFreezeDried += staminaProduction.freeze_dried || 0;
  }

  return {
    gold: totalGold,
    refined_stone: totalRefinedStone,
    hourglass: totalHourglass,
    battle_essence: totalBattleEssence,
    freeze_dried: totalFreezeDried,
    stamina: staminaProduction,
    cart: {
      gold: cart.gold || 0,
      refined_stone: cart.refined_stone || 0,
      hourglass: cart.hourglass || 0,
      battle_essence: cart.battle_essence || 0,
      freeze_dried: cart.freeze_dried_exp || 0
    },
    secretRealm: {
      gold: secretRealm.gold || 0,
      refined_stone: secretRealm.refined_stone || 0,
      hourglass: secretRealm.hourglass || 0,
      battle_essence: secretRealm.battle_essence || 0
    },
    bondAdventure: bondAdventure ? {
      freeze_dried: bondAdventure.freeze_dried_exp || 0
    } : null
  };
}

/**
 * 計算體力刷取的資源
 * Calculate stamina production
 */
function calculateStaminaProduction(stamina, resourceKey) {
  const seasonData = SEASON_DATA[currentSeason];
  if (!seasonData || !resourceKey) return null;

  const resource = seasonData.stamina_production.resources.find(r => r.key === resourceKey);
  if (!resource) return null;

  const totalRuns = stamina.totalRuns;
  const production = {
    resource_key: resourceKey,
    runs: totalRuns,
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };

  // 根據資源類型計算產量
  switch (resourceKey) {
    case 'gold':
      production.gold = totalRuns * resource.value;
      break;
    case 'iron':
      // 鐵錠需要轉換成粗煉石
      const ironTotal = totalRuns * resource.value;
      const conversionRate = resource.conversion_rate || 10;
      production.refined_stone = Math.floor(ironTotal / conversionRate);
      break;
    case 'hourglass':
      production.hourglass = totalRuns * resource.value;
      break;
    case 'battle_essence':
      production.battle_essence = totalRuns * resource.value;
      break;
    case 'freeze_dried':
      production.freeze_dried = totalRuns * resource.value;
      break;
  }

  return production;
}

// ============================================
// 顯示結果 Display Results
// ============================================

/**
 * 顯示計算結果
 * Display calculation results
 */
function displayResults(seasonId, results) {
  const summaryDiv = document.getElementById(`${seasonId}-calc-summary`);
  const resultsGrid = document.getElementById(`${seasonId}-results-grid`);
  const resultsSection = document.getElementById(`${seasonId}-results`);

  if (!summaryDiv || !resultsGrid || !resultsSection) {
    console.error('Results display elements not found');
    return;
  }

  // 生成摘要 HTML
  let summaryHTML = '';

  // 步驟 1: 體力分析
  summaryHTML += renderStaminaSummary(results.stamina);

  // 步驟 2: 體力使用優先級
  summaryHTML += renderStaminaUsageSummary(results.staminaUsage, results.stamina);

  // 步驟 3: 推車產量
  summaryHTML += renderCartProductionSummary(results.cart, results.stamina.totalHours);

  // 步驟 4: 秘境工具產量
  if (results.secretRealm && results.secretRealm.tools.length > 0) {
    summaryHTML += renderSecretRealmSummary(results.secretRealm, results.stamina.totalHours);
  }

  // 步驟 4.5: 羈絆冒險產量（如果有）
  if (results.bondAdventure) {
    summaryHTML += renderBondAdventureSummary(results.bondAdventure, results.stamina.daysRemaining);
  }

  // 步驟 5: 升級需求 (NOW WITH totalProduction parameter)
  summaryHTML += renderUpgradeRequirementsSummary(
    results.upgradeNeeds.needs,
    results.upgradeNeeds.breakdown,
    {
      gear: results.upgradeNeeds.breakdown.gear.details,
      skill: results.upgradeNeeds.breakdown.skill.details,
      relic: results.upgradeNeeds.breakdown.relic.details,
      pet: results.upgradeNeeds.breakdown.pet.details
    },
    results.totalProduction  // ← ADDED THIS PARAMETER
  );

  summaryDiv.innerHTML = summaryHTML;

  // 生成資源對比 HTML
  resultsGrid.innerHTML = generateResourceComparison(results);

  // 顯示結果區塊
  resultsSection.style.display = 'block';

  // 滾動到結果區
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  console.log('Results displayed successfully');
}

// ============================================
// 輔助函數 Helper Functions
// ============================================

/**
 * 驗證輸入
 * Validate inputs
 */
function validateInputs(seasonId) {
  // 檢查體力使用選擇
  if (!selectedStaminaUsage[seasonId]) {
    return {
      valid: false,
      message: '請先選擇體力使用優先級 Please select stamina usage priority'
    };
  }

  // 可以添加更多驗證邏輯...

  return { valid: true };
}

/**
 * 重置計算器
 * Reset calculator
 */
function resetCalculator(seasonId) {
  // 重置所有輸入
  document.querySelectorAll(`#${seasonId}-content input[type="number"]`).forEach(input => {
    if (input.id.includes('-from')) {
      const categoryMatch = input.id.match(/-(\w+)\d+-from/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        const seasonData = SEASON_DATA[seasonId];
        if (seasonData && seasonData.categories[category]) {
          input.value = seasonData.categories[category].levels[0].level;
        }
      }
    } else if (input.id.includes('-to')) {
      const categoryMatch = input.id.match(/-(\w+)\d+-to/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        const seasonData = SEASON_DATA[seasonId];
        if (seasonData && seasonData.categories[category]) {
          const levels = seasonData.categories[category].levels;
          input.value = levels[levels.length - 1].level;
        }
      }
    } else if (input.id.includes('-cart-') || input.id.includes('-tool-')) {
      input.value = '0';
    }
  });

  // 重置體力使用選擇
  selectedStaminaUsage[seasonId] = null;
  document.querySelectorAll(`#${seasonId}-stamina-options .stamina-option`).forEach(opt => {
    opt.classList.remove('selected');
  });

  // 隱藏結果
  const resultsSection = document.getElementById(`${seasonId}-results`);
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }

  console.log(`Calculator reset for ${seasonId}`);
}

// ============================================
// 頁面載入完成時執行
// Execute when page loads
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('Upgrade calculator script loaded');
  
  // 設定當前時間
  setCurrentDateTime();
  
  // 每分鐘更新一次時間
  setInterval(setCurrentDateTime, 60000);
});

console.log('Upgrade Calculator JS loaded successfully');