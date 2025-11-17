/**
 * ============================================
 * 升級計算器 JavaScript Upgrade Calculator JavaScript
 * ============================================
 * 用於 Jekyll 專案的升級計算器功能
 * For Jekyll project upgrade calculator functionality
 */

// ============================================
// 全域變數 Global Variables
// ============================================
let currentSeason = 's3';
let seasonsData = {};
let upgradeData = {};
let seasonConstants = {};
let bondAdventureData = {};
let freezeDriedExpData = {};

// ============================================
// 初始化函數 Initialization Function
// ============================================
/**
 * 初始化計算器
 * Initialize calculator
 */
function initializeCalculator(seasons, data, constants, bondData, freezeData) {
  seasonsData = seasons;
  upgradeData = data;
  seasonConstants = constants;
  bondAdventureData = bondData;
  freezeDriedExpData = freezeData;

  // 設置當前時間
  setCurrentDateTime();

  // 初始化所有賽季的預設值
  Object.keys(upgradeData).forEach(seasonId => {
    initializeSeasonDefaults(seasonId);
  });

  console.log('Calculator initialized', {
    seasons: seasonsData,
    data: upgradeData,
    constants: seasonConstants,
    bondData: bondAdventureData,
    freezeData: freezeDriedExpData
  });
}

/**
 * 初始化賽季預設值
 * Initialize season defaults
 */
function initializeSeasonDefaults(seasonId) {
  // 設置當前時間
  const currentTimeInput = document.getElementById(`${seasonId}-current-time`);
  if (currentTimeInput && !currentTimeInput.value) {
    setCurrentDateTime();
  }

  // 初始化羈絆冒險預覽
  updateBondAdventurePreview(seasonId);
}

/**
 * 設置當前日期時間
 * Set current date time
 */
function setCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
  
  // 為所有賽季設置當前時間
  Object.keys(upgradeData).forEach(seasonId => {
    const input = document.getElementById(`${seasonId}-current-time`);
    if (input) {
      input.value = datetimeLocal;
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
  currentSeason = seasonId;

  // 更新按鈕狀態
  document.querySelectorAll('.season-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // 顯示對應的內容
  document.querySelectorAll('.season-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(`${seasonId}-content`);
  if (targetContent) {
    targetContent.classList.add('active');
  }

  // 初始化該賽季的預設值
  initializeSeasonDefaults(seasonId);
}

// ============================================
// 類別折疊功能 Category Collapse
// ============================================
/**
 * 切換類別展開/折疊
 * Toggle category expand/collapse
 */
function toggleCategory(categoryId) {
  const header = event.currentTarget;
  const content = document.getElementById(`${categoryId}-content`);
  
  if (!content) return;

  header.classList.toggle('collapsed');
  content.classList.toggle('expanded');
}

// ============================================
// 平均等級應用 Apply Average Level
// ============================================
/**
 * 應用平均等級到所有項目（新版）
 * Apply average level to all items (new version)
 */
function applyAvgLevelNew(seasonId, category, itemCount) {
  const currentAvg = parseInt(document.getElementById(`${seasonId}-${category}-current-avg`).value) || 0;
  const targetAvg = parseInt(document.getElementById(`${seasonId}-${category}-target-avg`).value) || 0;

  for (let i = 1; i <= itemCount; i++) {
    const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
    const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
    
    if (fromInput) fromInput.value = currentAvg;
    if (toInput) toInput.value = targetAvg;
  }
}

// ============================================
// 體力使用選擇 Stamina Usage Selection
// ============================================
/**
 * 選擇體力使用優先級
 * Select stamina usage priority
 */
function selectStaminaUsage(seasonId, resourceKey) {
  // 移除所有選中狀態
  const options = document.querySelectorAll(`#${seasonId}-stamina-options .stamina-option`);
  options.forEach(option => option.classList.remove('selected'));
  
  // 添加選中狀態到點擊的選項
  event.currentTarget.classList.add('selected');
  
  // 儲存選擇
  const container = document.getElementById(`${seasonId}-stamina-options`);
  if (container) {
    container.dataset.selected = resourceKey;
  }
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

  const rewardAmount = parseInt(rewardInput.value) || 0;
  
  if (rewardAmount === 0) {
    previewContent.innerHTML = `
      請輸入關卡獎勵數量<br>
      Please enter stage reward amount
    `;
    return;
  }

  // 計算總天數
  const constants = seasonConstants[seasonId];
  if (!constants) return;

  const startDate = new Date(constants.releaseDate + 'T10:01:00');
  const currentDate = new Date(document.getElementById(`${seasonId}-current-time`)?.value || new Date());
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);

  const remainingTime = endDate - currentDate;
  const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  // 計算總獎勵
  const rewardsPerDay = 4;
  const totalRewards = rewardAmount * rewardsPerDay * daysRemaining;

  // 獲取優質凍乾的經驗值
  let premiumExp = 100; // 預設值
  if (freezeDriedExpData && freezeDriedExpData.types) {
    const premiumType = freezeDriedExpData.types.find(t => t.type === 'premium');
    if (premiumType) {
      premiumExp = premiumType.exp;
    }
  }

  const totalExp = totalRewards * premiumExp;

  previewContent.innerHTML = `
    <strong>選擇獎勵 Selected Reward:</strong> ${rewardAmount} 個優質凍乾 Premium freeze-dried per run<br>
    <strong>每日次數 Daily Runs:</strong> ${rewardsPerDay} 次 runs<br>
    <strong>剩餘天數 Days Remaining:</strong> ${daysRemaining} 天 days<br>
    <strong>總優質凍乾 Total Premium:</strong> ${formatNumber(totalRewards)} 個 items<br>
    <strong>總經驗值 Total EXP:</strong> ${formatNumber(totalExp)} EXP (${rewardAmount} × ${rewardsPerDay} × ${daysRemaining} × ${premiumExp})
  `;
}

// ============================================
// 資源計算主函數 Main Resource Calculation
// ============================================
/**
 * 計算資源需求
 * Calculate resource requirements
 */
function calculateResources(seasonId) {
  console.log('Starting calculation for season:', seasonId);

  try {
    // 步驟 1: 計算可用體力
    const staminaResult = calculateAvailableStamina(seasonId);
    console.log('Stamina result:', staminaResult);

    // 步驟 2: 取得選擇的體力使用資源
    const selectedResource = document.querySelector(`#${seasonId}-stamina-options .stamina-option.selected`);
    const staminaResourceKey = selectedResource 
      ? selectedResource.querySelector('.option-name-en').textContent.toLowerCase().replace(/\s+/g, '_')
      : null;

    // 步驟 3: 計算推車產量
    const cartProduction = calculateCartProduction(seasonId, staminaResult.totalHours);
    console.log('Cart production:', cartProduction);

    // 步驟 4: 計算秘境工具產量
    const secretRealmProduction = calculateSecretRealmProduction(seasonId, staminaResult.totalHours);
    console.log('Secret realm production:', secretRealmProduction);

    // 步驟 4.5: 計算羈絆冒險產量
    const bondAdventureProduction = calculateBondAdventureProduction(seasonId, staminaResult.daysRemaining);
    console.log('Bond adventure production:', bondAdventureProduction);

    // 步驟 5: 計算升級需求
    const upgradeNeeds = calculateUpgradeNeeds(seasonId);
    console.log('Upgrade needs:', upgradeNeeds);

    // 計算總產量
    const totalProduction = {
      gold: cartProduction.gold + secretRealmProduction.gold,
      refined_stone: cartProduction.refined_stone + secretRealmProduction.refined_stone,
      hourglass: cartProduction.hourglass + secretRealmProduction.hourglass,
      battle_essence: cartProduction.battle_essence + secretRealmProduction.battle_essence,
      freeze_dried: cartProduction.freeze_dried_exp + bondAdventureProduction.freeze_dried_exp
    };

    // 如果選擇了體力使用資源，加上體力產量
    if (staminaResourceKey && staminaResult.totalStamina > 0) {
      const staminaProduction = calculateStaminaProduction(seasonId, staminaResourceKey, staminaResult.totalStamina);
      console.log('Stamina production:', staminaProduction);
      
      // 合併體力產量
      Object.keys(staminaProduction).forEach(key => {
        if (totalProduction[key] !== undefined) {
          totalProduction[key] += staminaProduction[key];
        }
      });
    }

    console.log('Total production:', totalProduction);

    // 顯示結果
    displayResults(seasonId, {
      stamina: staminaResult,
      cart: cartProduction,
      secretRealm: secretRealmProduction,
      bondAdventure: bondAdventureProduction,
      upgradeNeeds: upgradeNeeds,
      totalProduction: totalProduction,
      staminaResource: staminaResourceKey
    });

  } catch (error) {
    console.error('Error in calculateResources:', error);
    alert('計算過程中發生錯誤 Error during calculation: ' + error.message);
  }
}

// ============================================
// 體力計算 Stamina Calculation
// ============================================
/**
 * 計算可用體力
 * Calculate available stamina
 */
function calculateAvailableStamina(seasonId) {
  const constants = seasonConstants[seasonId];
  if (!constants) {
    throw new Error(`Season constants not found for ${seasonId}`);
  }

  // 獲取日期
  const startDateStr = document.getElementById(`${seasonId}-start-date`)?.value || constants.releaseDate;
  const currentTimeStr = document.getElementById(`${seasonId}-current-time`)?.value;
  
  const startDate = new Date(startDateStr + 'T10:01:00');
  const currentDate = new Date(currentTimeStr);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + constants.totalDays);

  // 計算剩餘時間
  const remainingTime = endDate - currentDate;
  const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60)));
  
  // 加速小時數（每天2小時）
  const speedupHours = daysRemaining * 2;
  const totalHours = hoursRemaining + speedupHours;

  // 計算體力
  const staminaPerHour = 5;
  const timeStamina = totalHours * staminaPerHour;

  // 每日體力
  const mallStamina = parseInt(document.getElementById(`${seasonId}-mall-stamina`)?.value) || 10;
  const totalDailyStamina = constants.baseDailyStamina + mallStamina;
  const dailyStamina = daysRemaining * totalDailyStamina;

  const totalStamina = timeStamina + dailyStamina;
  const staminaCost = upgradeData[seasonId]?.stamina_production?.stamina_cost || 50;
  const totalRuns = Math.floor(totalStamina / staminaCost);

  return {
    daysRemaining,
    hoursRemaining,
    speedupHours,
    totalHours,
    timeStamina,
    dailyStamina,
    totalDailyStamina,
    totalStamina,
    totalRuns
  };
}

/**
 * 計算體力產量
 * Calculate stamina production
 */
function calculateStaminaProduction(seasonId, resourceKey, totalStamina) {
  const data = upgradeData[seasonId];
  if (!data || !data.stamina_production) return {};

  const staminaCost = data.stamina_production.stamina_cost || 50;
  const totalRuns = Math.floor(totalStamina / staminaCost);

  const resource = data.stamina_production.resources.find(r => {
    const nameEn = r.name.toLowerCase().replace(/\s+/g, '_');
    return nameEn === resourceKey || r.key === resourceKey;
  });

  if (!resource) return {};

  const production = {};
  production[resource.key] = totalRuns * resource.value;

  return production;
}

// ============================================
// 推車產量計算 Cart Production Calculation
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

  // 獲取普通凍乾的經驗值
  let normalExp = 50; // 預設值
  if (freezeDriedExpData && freezeDriedExpData.types) {
    const normalType = freezeDriedExpData.types.find(t => t.type === 'normal');
    if (normalType) {
      normalExp = normalType.exp;
    }
  }

  const driedCount = totalHours * driedPerHour;
  const driedExp = driedCount * normalExp;

  return {
    gold: totalHours * goldPerHour,
    refined_stone: totalHours * stonePerHour,
    hourglass: totalHours * hourglassPerHour,
    battle_essence: totalHours * essencePerHour,
    freeze_dried_count: driedCount,
    freeze_dried_exp: driedExp,
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
// 秘境工具產量計算 Secret Realm Production
// ============================================
/**
 * 計算秘境工具產量
 * Calculate secret realm tool production
 */
function calculateSecretRealmProduction(seasonId, totalHours) {
  const data = upgradeData[seasonId];
  if (!data || !data.secret_realm) {
    return {
      gold: 0,
      refined_stone: 0,
      hourglass: 0,
      battle_essence: 0,
      tools: []
    };
  }

  const production = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    tools: []
  };

  data.secret_realm.resources.forEach(resource => {
    const toolCount = parseInt(document.getElementById(`${seasonId}-tool-${resource.key}`)?.value) || 0;
    
    if (toolCount > 0) {
      const totalProduction = resource.value * toolCount * totalHours;
      production[resource.key] += totalProduction;

      production.tools.push({
        name: resource.tool_name,
        name_zh: resource.tool_name_zh,
        icon: resource.icon,
        count: toolCount,
        valuePerTool: resource.value,
        totalProduction: totalProduction
      });
    }
  });

  return production;
}

// ============================================
// 羈絆冒險產量計算 Bond Adventure Production
// ============================================
/**
 * 計算羈絆冒險產量
 * Calculate bond adventure production
 */
function calculateBondAdventureProduction(seasonId, daysRemaining) {
  const rewardInput = document.getElementById(`${seasonId}-bond-stage-reward`);
  if (!rewardInput) {
    return {
      freeze_dried_exp: 0,
      premium_count: 0,
      reward_per_run: 0,
      total_runs: 0
    };
  }

  const rewardPerRun = parseInt(rewardInput.value) || 0;
  
  if (rewardPerRun === 0) {
    return {
      freeze_dried_exp: 0,
      premium_count: 0,
      reward_per_run: 0,
      total_runs: 0
    };
  }

  // 獲取優質凍乾的經驗值
  let premiumExp = 100; // 預設值
  if (freezeDriedExpData && freezeDriedExpData.types) {
    const premiumType = freezeDriedExpData.types.find(t => t.type === 'premium');
    if (premiumType) {
      premiumExp = premiumType.exp;
    }
  }

  const runsPerDay = 4;
  const totalRuns = daysRemaining * runsPerDay;
  const premiumCount = rewardPerRun * totalRuns;
  const freezeDriedExp = premiumCount * premiumExp;

  return {
    freeze_dried_exp: freezeDriedExp,
    premium_count: premiumCount,
    reward_per_run: rewardPerRun,
    total_runs: totalRuns,
    premium_exp: premiumExp
  };
}

// ============================================
// 升級需求計算 Upgrade Needs Calculation
// ============================================
/**
 * 計算升級需求
 * Calculate upgrade needs
 */
function calculateUpgradeNeeds(seasonId) {
  const data = upgradeData[seasonId];
  if (!data) {
    throw new Error(`Upgrade data not found for ${seasonId}`);
  }

  console.log('=== Starting Upgrade Needs Calculation ===');
  console.log('Season data:', data);

  const categories = ['gear', 'skill', 'relic', 'pet'];
  const itemCounts = { gear: 5, skill: 8, relic: 20, pet: 4 };

  const needs = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };

  const breakdown = {
    gear: { gold: 0, iron: 0, details: [] },
    skill: { battle_essence: 0, details: [] },
    relic: { gold: 0, hourglass: 0, details: [] },
    pet: { freeze_dried: 0, details: [] }
  };

  const upgradeDetails = {
    gear: [],
    skill: [],
    relic: [],
    pet: []
  };

  categories.forEach(category => {
    const count = itemCounts[category];
    
    console.log(`\n--- Processing category: ${category}, item count: ${count} ---`);
    
    for (let i = 1; i <= count; i++) {
      const fromInput = document.getElementById(`${seasonId}-${category}${i}-from`);
      const toInput = document.getElementById(`${seasonId}-${category}${i}-to`);
      
      if (!fromInput || !toInput) {
        console.warn(`Input not found for ${category}${i}`);
        continue;
      }

      const from = parseInt(fromInput.value) || 0;
      const to = parseInt(toInput.value) || 0;

      console.log(`${category}${i}: from ${from} to ${to}`);

      if (from >= to) {
        console.log(`Skipping ${category}${i}: from (${from}) >= to (${to})`);
        continue;
      }

      // 計算該項目的升級成本
      const categoryData = data.categories[category];
      if (!categoryData) {
        console.error(`Category data not found for: ${category}`);
        continue;
      }

      const costs = calculateCategoryCost(categoryData, from, to);
      
      console.log(`${category}${i} costs calculated:`, costs);

      // 記錄詳細資訊
      const detail = {
        index: i,
        from: from,
        to: to,
        gold: costs.gold || 0,
        iron: costs.iron || 0,
        hourglass: costs.hourglass || 0,
        battle_record: costs.battle_record || 0,
        freeze_dried: costs.freeze_dried || 0
      };
      
      upgradeDetails[category].push(detail);

      // 累加到分類統計
      if (category === 'gear') {
        breakdown.gear.gold += costs.gold || 0;
        breakdown.gear.iron += costs.iron || 0;
        needs.gold += costs.gold || 0;
        needs.refined_stone += costs.iron || 0;
      } else if (category === 'skill') {
        breakdown.skill.battle_essence += costs.battle_record || 0;
        needs.battle_essence += costs.battle_record || 0;
      } else if (category === 'relic') {
        breakdown.relic.gold += costs.gold || 0;
        breakdown.relic.hourglass += costs.hourglass || 0;
        needs.gold += costs.gold || 0;
        needs.hourglass += costs.hourglass || 0;
      } else if (category === 'pet') {
        breakdown.pet.freeze_dried += costs.freeze_dried || 0;
        needs.freeze_dried += costs.freeze_dried || 0;
      }
    }
  });

  console.log('\n=== Final Upgrade Needs ===');
  console.log('Needs:', needs);
  console.log('Breakdown:', breakdown);
  console.log('Upgrade Details:', upgradeDetails);

  return { needs, breakdown, upgradeDetails };
}

/**
 * 計算類別升級成本
 * Calculate category upgrade cost
 */
function calculateCategoryCost(category, fromLevel, toLevel) {
  const costs = {
    gold: 0,
    iron: 0,
    hourglass: 0,
    battle_record: 0,
    freeze_dried: 0
  };

  if (!category || !category.levels) {
    console.warn('Category or levels not found:', category);
    return costs;
  }

  console.log(`  Calculating costs from level ${fromLevel} to ${toLevel}`);
  console.log(`  Available levels:`, category.levels.map(l => l.level));

  // 累加從 fromLevel 到 toLevel 之間的所有等級成本
  for (let level = fromLevel; level < toLevel; level++) {
    const levelData = category.levels.find(l => l.level === level);
    
    if (levelData) {
      console.log(`  Level ${level} data:`, levelData);
      
      // 直接從 levelData 讀取成本（因為 YAML 結構中成本在頂層）
      if (levelData.gold !== undefined) {
        costs.gold += levelData.gold;
        console.log(`    Added gold: ${levelData.gold}, total: ${costs.gold}`);
      }
      if (levelData.iron !== undefined) {
        costs.iron += levelData.iron;
        console.log(`    Added iron: ${levelData.iron}, total: ${costs.iron}`);
      }
      if (levelData.hourglass !== undefined) {
        costs.hourglass += levelData.hourglass;
        console.log(`    Added hourglass: ${levelData.hourglass}, total: ${costs.hourglass}`);
      }
      if (levelData.battle_record !== undefined) {
        costs.battle_record += levelData.battle_record;
        console.log(`    Added battle_record: ${levelData.battle_record}, total: ${costs.battle_record}`);
      }
      if (levelData.freeze_dried !== undefined) {
        costs.freeze_dried += levelData.freeze_dried;
        console.log(`    Added freeze_dried: ${levelData.freeze_dried}, total: ${costs.freeze_dried}`);
      }
    } else {
      console.warn(`  Level ${level} data not found in category`);
    }
  }

  console.log(`  Total costs from ${fromLevel} to ${toLevel}:`, costs);
  return costs;
}

// ============================================
// 結果顯示 Display Results
// ============================================
/**
 * 顯示計算結果
 * Display calculation results
 */
function displayResults(seasonId, results) {
  const resultsSection = document.getElementById(`${seasonId}-results`);
  const calcSummary = document.getElementById(`${seasonId}-calc-summary`);
  const resultsGrid = document.getElementById(`${seasonId}-results-grid`);

  if (!resultsSection || !calcSummary || !resultsGrid) return;

  // 顯示結果區塊
  resultsSection.style.display = 'block';

  // 生成計算摘要
  calcSummary.innerHTML = generateCalculationSummary(results);

  // 生成資源對比
  resultsGrid.innerHTML = generateResourceComparison(results);

  // 滾動到結果區域
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 生成計算摘要 HTML
 * Generate calculation summary HTML
 */
function generateCalculationSummary(results) {
  let html = '';

  // 步驟一：體力摘要
  html += renderStaminaSummary(results.stamina);

  // 步驟二：體力使用（如果有選擇）
  if (results.staminaResource) {
    html += renderStaminaUsageSummary(results.staminaResource, results.stamina);
  }

  // 步驟三：推車產量
  html += renderCartProductionSummary(results.cart, results.stamina.totalHours);

  // 步驟四：秘境工具
  if (results.secretRealm.tools.length > 0) {
    html += renderSecretRealmSummary(results.secretRealm, results.stamina.totalHours);
  }

  // 步驟四點五：羈絆冒險
  if (results.bondAdventure.premium_count > 0) {
    html += renderBondAdventureSummary(results.bondAdventure, results.stamina.daysRemaining);
  }

  // 步驟五：升級需求匯總
  html += renderUpgradeRequirementsSummary(results.upgradeNeeds.needs, results.upgradeNeeds.breakdown, results.upgradeNeeds.upgradeDetails);

  return html;
}

/**
 * 渲染體力摘要
 * Render stamina summary
 */
function renderStaminaSummary(stamina) {
  const template = document.getElementById('stamina-summary-template');
  if (!template) return '';

  let html = template.innerHTML;
  
  html = html.replace(/{{daysRemaining}}/g, stamina.daysRemaining);
  html = html.replace(/{{hoursRemaining}}/g, stamina.hoursRemaining);
  html = html.replace(/{{speedupHours}}/g, stamina.speedupHours);
  html = html.replace(/{{totalHours}}/g, stamina.totalHours);
  html = html.replace(/{{timeStamina}}/g, formatNumber(stamina.timeStamina));
  html = html.replace(/{{totalDailyStamina}}/g, stamina.totalDailyStamina);
  html = html.replace(/{{dailyStamina}}/g, formatNumber(stamina.dailyStamina));
  html = html.replace(/{{totalStamina}}/g, formatNumber(stamina.totalStamina));
  html = html.replace(/{{totalRuns}}/g, formatNumber(stamina.totalRuns));

  return html;
}

/**
 * 渲染體力使用摘要
 * Render stamina usage summary
 */
function renderStaminaUsageSummary(resourceKey, stamina) {
  // 這裡可以添加體力使用的詳細摘要
  return `
    <div class="calc-step">
      <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
      <div class="step-highlight">
        已選擇資源 Selected Resource: <strong>${resourceKey.replace(/_/g, ' ').toUpperCase()}</strong>
      </div>
    </div>
  `;
}

/**
 * 渲染推車產量摘要
 * Render cart production summary
 */
function renderCartProductionSummary(cart, totalHours) {
  const template = document.getElementById('cart-production-summary-template');
  if (!template) return '';

  let html = template.innerHTML;
  
  html = html.replace(/{{goldPerHour}}/g, formatNumber(cart.rates.goldPerHour));
  html = html.replace(/{{stonePerHour}}/g, formatNumber(cart.rates.stonePerHour));
  html = html.replace(/{{hourglassPerHour}}/g, formatNumber(cart.rates.hourglassPerHour));
  html = html.replace(/{{essencePerHour}}/g, formatNumber(cart.rates.essencePerHour));
  html = html.replace(/{{driedPerHour}}/g, formatNumber(cart.rates.driedPerHour));
  html = html.replace(/{{normalExp}}/g, cart.rates.normalExp);
  
  html = html.replace(/{{cartGold}}/g, formatNumber(cart.gold));
  html = html.replace(/{{cartStone}}/g, formatNumber(cart.refined_stone));
  html = html.replace(/{{cartHourglass}}/g, formatNumber(cart.hourglass));
  html = html.replace(/{{cartEssence}}/g, formatNumber(cart.battle_essence));
  html = html.replace(/{{cartDriedCount}}/g, formatNumber(cart.freeze_dried_count));
  html = html.replace(/{{cartDriedExp}}/g, formatNumber(cart.freeze_dried_exp));

  return html;
}

/**
 * 渲染秘境工具摘要
 * Render secret realm summary
 */
function renderSecretRealmSummary(secretRealm, totalHours) {
  const template = document.getElementById('secret-realm-summary-template');
  if (!template) return '';

  let toolItemsHtml = '';
  
  secretRealm.tools.forEach(tool => {
    toolItemsHtml += `
      <div class="step-item">
        <span class="step-label">${tool.icon} ${tool.name_zh} ${tool.name} (${tool.count}個 × ${tool.valuePerTool}/hr):</span>
        <span class="step-value">${formatNumber(tool.totalProduction)}</span>
      </div>
    `;
  });

  let html = template.innerHTML;
  html = html.replace(/{{toolItemsHtml}}/g, toolItemsHtml);

  return html;
}

/**
 * 渲染羈絆冒險摘要
 * Render bond adventure summary
 */
function renderBondAdventureSummary(bondAdventure, daysRemaining) {
  const template = document.getElementById('bond-adventure-summary-template');
  if (!template) return '';

  const selectedStageText = `${bondAdventure.reward_per_run} 個優質凍乾 Premium freeze-dried per run`;

  let html = template.innerHTML;
  
  html = html.replace(/{{selectedStageText}}/g, selectedStageText);
  html = html.replace(/{{premiumPerRun}}/g, bondAdventure.reward_per_run);
  html = html.replace(/{{daysRemaining}}/g, daysRemaining);
  html = html.replace(/{{totalRuns}}/g, bondAdventure.total_runs);
  html = html.replace(/{{premiumTotal}}/g, formatNumber(bondAdventure.premium_count));
  html = html.replace(/{{premiumExp}}/g, bondAdventure.premium_exp);
  html = html.replace(/{{totalBondExp}}/g, formatNumber(bondAdventure.freeze_dried_exp));

  return html;
}

/**
 * 渲染升級需求摘要
 * Render upgrade requirements summary
 */
function renderUpgradeRequirementsSummary(needed, breakdown, upgradeDetails) {
  const template = document.getElementById('upgrade-requirements-summary-template');
  if (!template) return '';

  let html = template.innerHTML;

  // 替換總需求
  html = html.replace(/{{neededGold}}/g, formatNumber(needed.gold));
  html = html.replace(/{{neededRefinedStone}}/g, formatNumber(needed.refined_stone));
  html = html.replace(/{{neededHourglass}}/g, formatNumber(needed.hourglass));
  html = html.replace(/{{neededBattleEssence}}/g, formatNumber(needed.battle_essence));
  html = html.replace(/{{neededFreezeDried}}/g, formatNumber(needed.freeze_dried));

  // 替換分類需求
  html = html.replace(/{{breakdownGearGold}}/g, formatNumber(breakdown.gear.gold));
  html = html.replace(/{{breakdownGearIron}}/g, formatNumber(breakdown.gear.iron));
  html = html.replace(/{{breakdownRelicGold}}/g, formatNumber(breakdown.relic.gold));
  html = html.replace(/{{breakdownRelicHourglass}}/g, formatNumber(breakdown.relic.hourglass));
  html = html.replace(/{{breakdownSkillEssence}}/g, formatNumber(breakdown.skill.battle_essence));
  html = html.replace(/{{breakdownPetFreezeDried}}/g, formatNumber(breakdown.pet.freeze_dried));

  // 生成詳細升級列表
  html = html.replace(/{{gearUpgradeDetails}}/g, generateUpgradeDetailsHTML(upgradeDetails.gear, 'gear'));
  html = html.replace(/{{relicUpgradeDetails}}/g, generateUpgradeDetailsHTML(upgradeDetails.relic, 'relic'));
  html = html.replace(/{{skillUpgradeDetails}}/g, generateUpgradeDetailsHTML(upgradeDetails.skill, 'skill'));
  html = html.replace(/{{petUpgradeDetails}}/g, generateUpgradeDetailsHTML(upgradeDetails.pet, 'pet'));

  return html;
}

/**
 * 生成升級詳細 HTML
 * Generate upgrade details HTML
 */
function generateUpgradeDetailsHTML(details, type) {
  if (!details || details.length === 0) {
    return '<div style="color: #94a3b8; font-style: italic; text-align: center; padding: 12px;">無升級項目 No upgrades</div>';
  }

  console.log(`Generating upgrade details HTML for ${type}:`, details);

  let html = '';

  details.forEach((item, idx) => {
    const itemName = getItemName(type, item.index);
    const borderStyle = idx > 0 ? 'border-top: 1px dashed #cbd5e1; padding-top: 8px; margin-top: 8px;' : '';

    html += `<div style="${borderStyle} display: flex; justify-content: space-between; align-items: center; padding: 8px 0; flex-wrap: wrap; gap: 8px;">`;
    html += `<span style="color: #475569; font-weight: 600; flex: 1; min-width: 150px;">${itemName}</span>`;
    html += `<span style="color: #0ea5e9; font-weight: 500; margin: 0 8px; white-space: nowrap;">Lv.${item.from} → ${item.to}</span>`;

    // 根據類型顯示不同資源
    const resources = getResourcesForType(type, item);
    if (resources.length > 0) {
      html += `<span style="color: #10b981; font-weight: 600; white-space: nowrap;">${resources.join(' ')}</span>`;
    } else {
      html += `<span style="color: #94a3b8; font-style: italic;">無成本數據 No cost data</span>`;
    }

    html += '</div>';
  });

  console.log(`Generated HTML for ${type}:`, html);

  return html;
}

/**
 * 獲取資源列表
 * Get resources for type
 */
function getResourcesForType(type, item) {
  const resources = [];

  console.log(`Getting resources for ${type}:`, item);

  switch (type) {
    case 'gear':
      if (item.gold && item.gold > 0) {
        resources.push(`💰${formatNumber(item.gold)}`);
      }
      if (item.iron && item.iron > 0) {
        resources.push(`🪨${formatNumber(item.iron)}`);
      }
      break;
    case 'skill':
      if (item.battle_record && item.battle_record > 0) {
        resources.push(`📖${formatNumber(item.battle_record)}`);
      }
      break;
    case 'relic':
      if (item.gold && item.gold > 0) {
        resources.push(`💰${formatNumber(item.gold)}`);
      }
      if (item.hourglass && item.hourglass > 0) {
        resources.push(`⏳${formatNumber(item.hourglass)}`);
      }
      break;
    case 'pet':
      if (item.freeze_dried && item.freeze_dried > 0) {
        resources.push(`🥩${formatNumber(item.freeze_dried)} EXP`);
      }
      break;
  }

  console.log(`Resources for ${type}:`, resources);

  return resources;
}

/**
 * 獲取項目名稱
 * Get item name
 */
function getItemName(type, index) {
  const names = {
    gear: [
      '🪖 頭盔 Helmet',
      '👕 衣服 Armor',
      '🔗 腰帶 Belt',
      '⚔️ 武器 Weapon',
      '💍 飾品 Accessory'
    ],
    skill: [
      '📘 技能1 Skill 1',
      '📘 技能2 Skill 2',
      '📘 技能3 Skill 3',
      '📘 技能4 Skill 4',
      '📘 技能5 Skill 5',
      '📘 技能6 Skill 6',
      '📘 技能7 Skill 7',
      '📘 技能8 Skill 8'
    ],
    relic: Array.from({ length: 20 }, (_, i) => `✨ 古遺物${i + 1} Relic ${i + 1}`),
    pet: [
      '🐾 幻獸1 Pet 1',
      '🐾 幻獸2 Pet 2',
      '🐾 幻獸3 Pet 3',
      '🐾 幻獸4 Pet 4'
    ]
  };

  if (names[type] && names[type][index - 1]) {
    return names[type][index - 1];
  }

  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`;
}

/**
 * 生成資源對比 HTML
 * Generate resource comparison HTML
 */
function generateResourceComparison(results) {
  const resources = [
    {
      key: 'gold',
      icon: '💰',
      name: '金幣',
      nameEn: 'Gold',
      needed: results.upgradeNeeds.needs.gold,
      produced: results.totalProduction.gold
    },
    {
      key: 'refined_stone',
      icon: '🪨',
      name: '粗煉石',
      nameEn: 'Refined Stone',
      needed: results.upgradeNeeds.needs.refined_stone,
      produced: results.totalProduction.refined_stone
    },
    {
      key: 'hourglass',
      icon: '⏳',
      name: '時之砂',
      nameEn: 'Hourglass',
      needed: results.upgradeNeeds.needs.hourglass,
      produced: results.totalProduction.hourglass
    },
    {
      key: 'battle_essence',
      icon: '📖',
      name: '歷戰精華',
      nameEn: 'Battle Essence',
      needed: results.upgradeNeeds.needs.battle_essence,
      produced: results.totalProduction.battle_essence
    },
    {
      key: 'freeze_dried',
      icon: '🥩',
      name: '凍乾經驗值',
      nameEn: 'Freeze-dried EXP',
      needed: results.upgradeNeeds.needs.freeze_dried,
      produced: results.totalProduction.freeze_dried
    }
  ];

  let html = '';

  resources.forEach(resource => {
    if (resource.needed === 0 && resource.produced === 0) return;

    const difference = resource.produced - resource.needed;
    const isSufficient = difference >= 0;
    const statusClass = isSufficient ? 'sufficient' : 'insufficient';
    const statusIcon = isSufficient ? '✅' : '❌';
    const statusText = isSufficient ? '充足 Sufficient' : '不足 Insufficient';

    html += `
      <div class="result-card ${statusClass}">
        <div class="result-header">
          ${resource.icon} ${resource.name} ${resource.nameEn}
        </div>
        <div class="result-value">
          ${statusIcon} ${statusText}
        </div>
        <div class="result-detail">
          <strong>需求 Needed:</strong> ${formatNumber(resource.needed)}<br>
          <strong>產出 Produced:</strong> ${formatNumber(resource.produced)}<br>
          <strong>差額 Difference:</strong> 
          <span style="color: ${isSufficient ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 700;">
            ${difference >= 0 ? '+' : ''}${formatNumber(difference)}
          </span>
        </div>
      </div>
    `;
  });

  return html;
}

// ============================================
// 工具函數 Utility Functions
// ============================================
/**
 * 格式化數字（千分位）
 * Format number with thousands separator
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 四捨五入到指定小數位
 * Round to specified decimal places
 */
function roundTo(num, decimals = 0) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================
// 頁面載入完成後執行 Execute after page load
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, calculator ready');

  // 設置初始時間
  setCurrentDateTime();

  // 添加輸入框變更監聽
  document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
    input.addEventListener('change', function () {
      const seasonId = this.id.split('-')[0];
      updateBondAdventurePreview(seasonId);
    });
  });
});

// ============================================
// 結束 End of JavaScript
// ============================================