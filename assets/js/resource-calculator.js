/**
 * Resource Calculator - Core Logic
 * Handles all calculations for resource production and upgrade requirements
 */

let currentSeason = null;
let seasonData = null;
let upgradesData = null;
let calculationResults = null;

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeCalculator();
});

/**
 * Initialize the calculator
 */
function initializeCalculator() {
  // Season selection handler
  document.getElementById('season-select').addEventListener('change', function(e) {
    const seasonId = e.target.value;
    if (seasonId) {
      loadSeason(seasonId);
    } else {
      document.getElementById('calculator-interface').style.display = 'none';
    }
  });

  // Calculate button handler
  document.getElementById('calculate-btn').addEventListener('click', function() {
    performCalculation();
  });

  // Set current datetime to now
  const now = new Date();
  document.getElementById('current-datetime').value = formatDateTimeLocal(now);
}

/**
 * Load season data and setup UI
 */
function loadSeason(seasonId) {
  currentSeason = seasonId;
  
  // Find season data
  seasonData = window.SEASONS_DATA.seasons.find(s => s.id === seasonId);
  if (!seasonData) {
    alert('賽季資料未找到 / Season data not found');
    return;
  }

  // Load upgrade data
  upgradesData = window.UPGRADES_DATA[seasonId];
  if (!upgradesData) {
    alert('該賽季暫無升級資料 / No upgrade data available for this season');
    document.getElementById('calculator-interface').style.display = 'none';
    return;
  }

  // Update theme
  updateSeasonTheme(seasonData.theme_color);

  // Set season start date
  document.getElementById('season-start-date').value = formatDateTimeLocal(new Date(seasonData.release_date));

  // Setup UI components
  setupStaminaPriorityButtons();
  setupUpgradeInputs();
  setupBondAdventure();

  // Show calculator interface
  document.getElementById('calculator-interface').style.display = 'block';

  // Calculate initial time summary
  updateTimeSummary();

  // Add event listener to current datetime
  document.getElementById('current-datetime').addEventListener('change', updateTimeSummary);
}

/**
 * Setup stamina priority buttons
 */
function setupStaminaPriorityButtons() {
  const container = document.getElementById('stamina-priority-buttons');
  container.innerHTML = '';

  const resources = upgradesData.stamina_production.resources;
  resources.forEach(resource => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-primary';
    btn.dataset.resource = resource.key;
    btn.innerHTML = `${resource.icon} ${resource.name_zh} / ${resource.name}`;
    
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      container.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
    });
    
    container.appendChild(btn);
  });
}

/**
 * Setup upgrade inputs for all categories
 */
function setupUpgradeInputs() {
  // Gear (5 items)
  createUpgradeInputs('gear', 5, upgradesData.categories.gear, 'gear-upgrades');
  
  // Skills (8 items)
  createUpgradeInputs('skill', 8, upgradesData.categories.skill, 'skill-upgrades');
  
  // Relics (20 items - 5 elements × 4 each)
  createUpgradeInputs('relic', 4, upgradesData.categories.relic, 'relic-light-upgrades', 'Light');
  createUpgradeInputs('relic', 4, upgradesData.categories.relic, 'relic-dark-upgrades', 'Dark');
  createUpgradeInputs('relic', 4, upgradesData.categories.relic, 'relic-wind-upgrades', 'Wind');
  createUpgradeInputs('relic', 4, upgradesData.categories.relic, 'relic-water-upgrades', 'Water');
  createUpgradeInputs('relic', 4, upgradesData.categories.relic, 'relic-fire-upgrades', 'Fire');
  
  // Pets (4 items)
  createUpgradeInputs('pet', 4, upgradesData.categories.pet, 'pet-upgrades');
}

/**
 * Create upgrade input fields
 */
function createUpgradeInputs(category, count, categoryData, containerId, prefix = '') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const fixedLevel = category === 'relic' ? seasonData.fixed_relics_level : seasonData.fixed_level;
  const suggestedLevel = categoryData.suggested_level;

  for (let i = 1; i <= count; i++) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'upgrade-item';
    
    const label = prefix ? `${prefix} ${i}` : `${category.charAt(0).toUpperCase() + category.slice(1)} ${i}`;
    
    itemDiv.innerHTML = `
      <div class="upgrade-item-header">
        ${categoryData.icon} ${label}
      </div>
      <div class="input-group input-group-sm mb-2">
        <span class="input-group-text">起始 / Start</span>
        <input type="number" class="form-control" 
               data-category="${category}" 
               data-type="start" 
               data-index="${i}" 
               value="${fixedLevel}" 
               min="${categoryData.levels[0].level}">
      </div>
      <div class="input-group input-group-sm">
        <span class="input-group-text">目標 / Target</span>
        <input type="number" class="form-control" 
               data-category="${category}" 
               data-type="target" 
               data-index="${i}" 
               value="${suggestedLevel}" 
               max="${categoryData.levels[categoryData.levels.length - 1].level}">
      </div>
    `;
    
    container.appendChild(itemDiv);
  }
}

/**
 * Setup bond adventure section (S3+)
 */
function setupBondAdventure() {
  const section = document.getElementById('bond-adventure-section');
  const inputsContainer = document.getElementById('bond-adventure-inputs');
  
  if (seasonData.bond_adventure && seasonData.bond_adventure.bond_adventure_enabled) {
    section.style.display = 'block';
    inputsContainer.innerHTML = '';
    
    seasonData.bond_adventure.rewards.forEach((reward, index) => {
      const freezeDriedType = window.FREEZE_DRIED_DATA.types.find(t => t.key === reward.type);
      
      const div = document.createElement('div');
      div.className = 'col-md-6';
      div.innerHTML = `
        <label class="form-label">
          ${freezeDriedType.icon} ${freezeDriedType.name_zh} / ${freezeDriedType.name}
        </label>
        <input type="number" 
               id="bond-${reward.type}" 
               class="form-control" 
               placeholder="${reward.amount}" 
               value="${reward.amount}" 
               min="0">
        <small class="text-muted">${freezeDriedType.exp} EXP each</small>
      `;
      
      inputsContainer.appendChild(div);
    });
  } else {
    section.style.display = 'none';
  }
}

/**
 * Update time summary
 */
function updateTimeSummary() {
  const startDate = new Date(document.getElementById('season-start-date').value);
  const currentDate = new Date(document.getElementById('current-datetime').value);
  
  if (!startDate || !currentDate) return;
  
  const totalDays = seasonData.total_day;
  const elapsedMs = currentDate - startDate;
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const elapsedHours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  const remainingDays = totalDays - elapsedDays;
  const remainingHours = 24 - elapsedHours;
  
  const summaryDiv = document.getElementById('time-summary');
  summaryDiv.style.display = 'block';
  summaryDiv.innerHTML = `
    <div class="row g-3">
      <div class="col-md-4">
        <strong>賽季總天數 / Total Days:</strong><br>
        <span class="fs-5">${totalDays} 天</span>
      </div>
      <div class="col-md-4">
        <strong>已過時間 / Elapsed:</strong><br>
        <span class="fs-5">${elapsedDays} 天 ${elapsedHours} 小時</span>
      </div>
      <div class="col-md-4">
        <strong>剩餘時間 / Remaining:</strong><br>
        <span class="fs-5 text-danger">${remainingDays} 天 ${remainingHours} 小時</span>
      </div>
    </div>
  `;
}

/**
 * Calculate stamina
 */
function calculateStamina() {
  const startDate = new Date(document.getElementById('season-start-date').value);
  const currentDate = new Date(document.getElementById('current-datetime').value);
  const buyDailySpecial = document.getElementById('buy-daily-special').checked;
  
  const totalDays = seasonData.total_day;
  const elapsedMs = currentDate - startDate;
  const remainingMs = (totalDays * 24 * 60 * 60 * 1000) - elapsedMs;
  const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
  const remainingDays = Math.max(0, Math.floor(remainingHours / 24));
  
  // Natural recovery: 5 stamina per hour
  const naturalStamina = remainingHours * 5;
  
  // Daily bonus: missions + shop + special
  const dailyMissions = upgradesData.daily_stamina.sources.find(s => s.key === 'daily_missions').amount;
  const shopTreasury = upgradesData.daily_stamina.sources.find(s => s.key === 'shop_treasury').amount;
  const dailySpecial = buyDailySpecial ? 10 : 0;
  const dailyBonusPerDay = dailyMissions + shopTreasury + dailySpecial;
  const totalDailyBonus = remainingDays * dailyBonusPerDay;
  
  // Acceleration: 2 hours per day (fixed)
  const accelerationHours = remainingDays * 2;
  const accelerationStamina = accelerationHours * 5;
  
  const totalStamina = naturalStamina + totalDailyBonus + accelerationStamina;
  
  return {
    remainingDays,
    remainingHours,
    naturalStamina,
    dailyMissions,
    shopTreasury,
    dailySpecial,
    dailyBonusPerDay,
    totalDailyBonus,
    accelerationHours,
    accelerationStamina,
    totalStamina
  };
}

/**
 * Calculate cart production
 */
function calculateCartProduction(remainingHours) {
  const gold = parseFloat(document.getElementById('cart-gold').value) || 0;
  const refinedStone = parseFloat(document.getElementById('cart-refined-stone').value) || 0;
  const hourglass = parseFloat(document.getElementById('cart-hourglass').value) || 0;
  const battleEssence = parseFloat(document.getElementById('cart-battle-essence').value) || 0;
  const freezeDried = parseFloat(document.getElementById('cart-freeze-dried').value) || 0;
  
  return {
    gold: Math.floor(gold * remainingHours),
    refined_stone: Math.floor(refinedStone * remainingHours),
    hourglass: Math.floor(hourglass * remainingHours),
    battle_essence: Math.floor(battleEssence * remainingHours),
    freeze_dried: Math.floor(freezeDried * remainingHours)
  };
}

/**
 * Calculate secret realm production
 */
function calculateSecretRealmProduction(remainingDays) {
  const goldPickaxe = parseFloat(document.getElementById('tool-gold-pickaxe').value) || 0;
  const ironHammer = parseFloat(document.getElementById('tool-iron-hammer').value) || 0;
  const sandShovel = parseFloat(document.getElementById('tool-sand-shovel').value) || 0;
  const glove = parseFloat(document.getElementById('tool-glove').value) || 0;
  
  const resources = upgradesData.secret_realm.resources;
  const goldRate = resources.find(r => r.key === 'gold').value;
  const refinedStoneRate = resources.find(r => r.key === 'refined_stone').value;
  const hourglassRate = resources.find(r => r.key === 'hourglass').value;
  const battleEssenceRate = resources.find(r => r.key === 'battle_essence').value;
  
  return {
    gold: Math.floor(goldPickaxe * goldRate * remainingDays),
    refined_stone: Math.floor(ironHammer * refinedStoneRate * remainingDays),
    hourglass: Math.floor(sandShovel * hourglassRate * remainingDays),
    battle_essence: Math.floor(glove * battleEssenceRate * remainingDays)
  };
}

/**
 * Calculate bond adventure production (S3+)
 */
function calculateBondAdventureProduction(remainingDays) {
  if (!seasonData.bond_adventure || !seasonData.bond_adventure.bond_adventure_enabled) {
    return { freeze_dried: 0 };
  }
  
  let totalExp = 0;
  
  seasonData.bond_adventure.rewards.forEach(reward => {
    const input = document.getElementById(`bond-${reward.type}`);
    if (input) {
      const amount = parseFloat(input.value) || 0;
      const freezeDriedType = window.FREEZE_DRIED_DATA.types.find(t => t.key === reward.type);
      totalExp += amount * freezeDriedType.exp * remainingDays;
    }
  });
  
  return { freeze_dried: Math.floor(totalExp) };
}

/**
 * Calculate stamina production based on priority
 */
function calculateStaminaProduction(totalStamina) {
  const activeBtn = document.querySelector('#stamina-priority-buttons .btn.active');
  if (!activeBtn) {
    return { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0 };
  }
  
  const priorityResource = activeBtn.dataset.resource;
  const staminaCost = upgradesData.stamina_production.stamina_cost;
  const runs = Math.floor(totalStamina / staminaCost);
  
  const resources = upgradesData.stamina_production.resources;
  const result = { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0 };
  
  resources.forEach(resource => {
    if (resource.key === priorityResource) {
      result[resource.key] = Math.floor(runs * resource.value);
    }
  });
  
  return result;
}

/**
 * Calculate upgrade needs
 */
function calculateUpgradeNeeds() {
  const needs = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_record: 0,
    freeze_dried: 0
  };
  
  // Get all upgrade inputs
  const allInputs = document.querySelectorAll('[data-category]');
  const upgrades = {};
  
  allInputs.forEach(input => {
    const category = input.dataset.category;
    const type = input.dataset.type;
    const index = input.dataset.index;
    
    if (!upgrades[category]) upgrades[category] = {};
    if (!upgrades[category][index]) upgrades[category][index] = {};
    
    upgrades[category][index][type] = parseInt(input.value) || 0;
  });
  
  // Calculate costs for each category
  Object.keys(upgrades).forEach(category => {
    const categoryData = upgradesData.categories[category];
    
    Object.values(upgrades[category]).forEach(item => {
      const startLevel = item.start;
      const targetLevel = item.target;
      
      if (targetLevel > startLevel) {
        for (let level = startLevel + 1; level <= targetLevel; level++) {
          const levelData = categoryData.levels.find(l => l.level === level);
          if (levelData) {
            Object.keys(levelData).forEach(key => {
              if (key !== 'level' && needs.hasOwnProperty(key)) {
                needs[key] += levelData[key];
              }
            });
          }
        }
      }
    });
  });
  
  return needs;
}

/**
 * Calculate total production
 */
function calculateTotalProduction() {
  const staminaResult = calculateStamina();
  const cartProduction = calculateCartProduction(staminaResult.remainingHours);
  const secretRealmProduction = calculateSecretRealmProduction(staminaResult.remainingDays);
  const bondAdventureProduction = calculateBondAdventureProduction(staminaResult.remainingDays);
  const staminaProduction = calculateStaminaProduction(staminaResult.totalStamina);
  
  return {
    stamina: staminaResult,
    cart: cartProduction,
    secretRealm: secretRealmProduction,
    bondAdventure: bondAdventureProduction,
    staminaUsage: staminaProduction,
    total: {
      gold: cartProduction.gold + secretRealmProduction.gold + staminaProduction.gold,
      refined_stone: cartProduction.refined_stone + secretRealmProduction.refined_stone + staminaProduction.refined_stone,
      hourglass: cartProduction.hourglass + secretRealmProduction.hourglass + staminaProduction.hourglass,
      battle_essence: cartProduction.battle_essence + secretRealmProduction.battle_essence + staminaProduction.battle_essence,
      freeze_dried: cartProduction.freeze_dried + bondAdventureProduction.freeze_dried
    }
  };
}

/**
 * Perform full calculation
 */
function performCalculation() {
  // Validate inputs
  const activeStaminaBtn = document.querySelector('#stamina-priority-buttons .btn.active');
  if (!activeStaminaBtn) {
    alert('請選擇體力優先刷取資源 / Please select stamina priority resource');
    return;
  }
  
  // Calculate
  const production = calculateTotalProduction();
  const needs = calculateUpgradeNeeds();
  
  calculationResults = {
    production,
    needs,
    comparison: {
      gold: production.total.gold - needs.gold,
      refined_stone: production.total.refined_stone - needs.refined_stone,
      hourglass: production.total.hourglass - needs.hourglass,
      battle_essence: production.total.battle_essence - needs.battle_record,
      freeze_dried: production.total.freeze_dried - needs.freeze_dried
    }
  };
  
  // Display results
  displayResults();
}

/**
 * Display results
 */
function displayResults() {
  const resultsSection = document.getElementById('results-section');
  const resultsContainer = document.getElementById('calculation-results');
  
  let html = '';
  
  // Stamina summary
  html += renderStaminaSummary(calculationResults.production.stamina);
  
  // Stamina usage summary
  html += renderStaminaUsageSummary(calculationResults.production.staminaUsage);
  
  // Cart production summary
  html += renderCartProductionSummary(calculationResults.production.cart);
  
  // Secret realm summary
  html += renderSecretRealmSummary(calculationResults.production.secretRealm);
  
  // Bond adventure summary (if applicable)
  if (seasonData.bond_adventure && seasonData.bond_adventure.bond_adventure_enabled) {
    html += renderBondAdventureSummary(calculationResults.production.bondAdventure);
  }
  
  // Upgrade requirements summary
  html += renderUpgradeRequirementsSummary(calculationResults.needs);
  
  // Resource comparison
  html += generateResourceComparison(
    calculationResults.production.total,
    calculationResults.needs,
    calculationResults.comparison,
    calculationResults.production.stamina.remainingDays
  );
  
  resultsContainer.innerHTML = html;
  resultsSection.style.display = 'block';
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show resonance level modal
 */
function showResonanceModal(category) {
  const modal = new bootstrap.Modal(document.getElementById('resonanceModal'));
  
  // Update category name
  const categoryNames = {
    gear: '裝備 / Gear',
    skill: '技能 / Skill',
    relic: '古遺物 / Relic',
    pet: '幻獸 / Pet'
  };
  
  document.getElementById('resonance-category-name').textContent = categoryNames[category] || category;
  
  // Get default values from season data
  const categoryData = upgradesData.categories[category];
  const fixedLevel = category === 'relic' ? seasonData.fixed_relics_level : seasonData.fixed_level;
  const suggestedLevel = categoryData.suggested_level;
  
  // Set default values
  document.getElementById('resonance-start').value = fixedLevel;
  document.getElementById('resonance-target').value = suggestedLevel;
  
  // Remove old event listener and add new one
  const applyBtn = document.getElementById('apply-resonance-btn');
  const newApplyBtn = applyBtn.cloneNode(true);
  applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
  
  newApplyBtn.addEventListener('click', function() {
    applyResonanceLevel(category);
    modal.hide();
  });
  
  modal.show();
}

/**
 * Apply resonance level to all items in a category
 */
function applyResonanceLevel(category) {
  const startLevel = parseInt(document.getElementById('resonance-start').value);
  const targetLevel = parseInt(document.getElementById('resonance-target').value);
  
  if (isNaN(startLevel) || isNaN(targetLevel)) {
    alert('請輸入有效的等級 / Please enter valid levels');
    return;
  }
  
  if (targetLevel <= startLevel) {
    alert('目標等級必須大於起始等級 / Target level must be greater than start level');
    return;
  }
  
  // Get all inputs for this category
  let selector = `[data-category="${category}"]`;
  const allInputs = document.querySelectorAll(selector);
  
  // Apply to all start and target inputs
  allInputs.forEach(input => {
    const type = input.dataset.type;
    if (type === 'start') {
      input.value = startLevel;
    } else if (type === 'target') {
      input.value = targetLevel;
    }
  });
  
  // Show success message
  const categoryNames = {
    gear: '裝備 / Gear',
    skill: '技能 / Skill',
    relic: '古遺物 / Relic',
    pet: '幻獸 / Pet'
  };
  
  const categoryName = categoryNames[category] || category;
  
  // Create toast notification (if Bootstrap toast is available)
  showToast(`✅ 已套用共鳴等級到所有${categoryName}<br>起始: ${startLevel} → 目標: ${targetLevel}`, 'success');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  // Create toast container if not exists
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toastId = 'toast-' + Date.now();
  const bgColor = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-info';
  
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
  
  // Remove toast after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    toastElement.remove();
  });
}