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
  setupToolRateDisplays();

  // Show calculator interface
  document.getElementById('calculator-interface').style.display = 'block';

  // Calculate initial time summary
  updateTimeSummary();

  // Add event listener to current datetime
  document.getElementById('current-datetime').addEventListener('change', updateTimeSummary);
  
  // Add input listeners for upgrade inputs to update resonance level display
  setupResonanceLevelListeners();
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
               data-index="${prefix ? prefix + '-' + i : i}" 
               value="${fixedLevel}" 
               min="${categoryData.levels[0].level}">
      </div>
      <div class="input-group input-group-sm">
        <span class="input-group-text">目標 / Target</span>
        <input type="number" class="form-control" 
               data-category="${category}" 
               data-type="target" 
               data-index="${prefix ? prefix + '-' + i : i}" 
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
 * Setup tool rate displays
 */
function setupToolRateDisplays() {
  if (!upgradesData.secret_realm) return;
  
  const resources = upgradesData.secret_realm.resources;
  const resourceIcons = {
    gold: '💰',
    refined_stone: '🪨',
    hourglass: '⏳',
    battle_essence: '📖'
  };
  
  resources.forEach(resource => {
    const display = document.querySelector(`.tool-rate-display[data-resource="${resource.key}"]`);
    if (display) {
      display.textContent = `${formatNumber(resource.value)} ${resourceIcons[resource.key]}/工具`;
    }
  });
}

/**
 * Setup resonance level listeners
 */
function setupResonanceLevelListeners() {
  const allInputs = document.querySelectorAll('[data-category]');
  
  allInputs.forEach(input => {
    input.addEventListener('input', debounce(function() {
      const category = this.dataset.category;
      updateResonanceLevelDisplay(category);
    }, 300));
  });
  
  // Initial display
  ['gear', 'skill', 'relic', 'pet'].forEach(category => {
    updateResonanceLevelDisplay(category);
  });
}

/**
 * Update resonance level display for a category
 */
function updateResonanceLevelDisplay(category) {
  const startInputs = document.querySelectorAll(`[data-category="${category}"][data-type="start"]`);
  const targetInputs = document.querySelectorAll(`[data-category="${category}"][data-type="target"]`);
  
  if (startInputs.length === 0 || targetInputs.length === 0) return;
  
  // Calculate average start and target levels
  let startSum = 0, startCount = 0;
  let targetSum = 0, targetCount = 0;
  
  startInputs.forEach(input => {
    const value = parseInt(input.value);
    if (!isNaN(value) && value > 0) {
      startSum += value;
      startCount++;
    }
  });
  
  targetInputs.forEach(input => {
    const value = parseInt(input.value);
    if (!isNaN(value) && value > 0) {
      targetSum += value;
      targetCount++;
    }
  });
  
  if (startCount === 0 || targetCount === 0) return;
  
  const avgStart = Math.round(startSum / startCount);
  const avgTarget = Math.round(targetSum / targetCount);
  
  // Update display
  const display = document.querySelector(`.resonance-level-display[data-category="${category}"]`);
  if (display) {
    display.innerHTML = `<i class="fas fa-chart-line me-1"></i>共鳴等級: ${avgStart} → ${avgTarget}`;
  }
}

/**
 * Update time summary
 */
function updateTimeSummary() {
  const startDate = new Date(document.getElementById('season-start-date').value);
  const currentDate = new Date(document.getElementById('current-datetime').value);
  
  if (!startDate || !currentDate || isNaN(startDate) || isNaN(currentDate)) {
    document.getElementById('time-summary').style.display = 'none';
    return;
  }
  
  const totalDays = seasonData.total_day;
  const elapsedMs = currentDate - startDate;
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const elapsedHours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  const remainingHours = elapsedHours > 0 ? (24 - elapsedHours) : 0;
  
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
 * Show resonance modal
 */
function showResonanceModal(category) {
  const categoryNames = {
    gear: { zh: '裝備', en: 'Gear' },
    skill: { zh: '技能', en: 'Skill' },
    relic: { zh: '古遺物', en: 'Relic' },
    pet: { zh: '幻獸', en: 'Pet' }
  };
  
  document.getElementById('resonance-category-name').textContent = categoryNames[category].zh;
  document.getElementById('resonance-category-name-en').textContent = categoryNames[category].en;
  
  // Store current category
  document.getElementById('apply-resonance-btn').dataset.category = category;
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('resonanceModal'));
  modal.show();
}

// Apply resonance button handler
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('apply-resonance-btn').addEventListener('click', function() {
    const category = this.dataset.category;
    applyResonanceLevel(category);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('resonanceModal'));
    modal.hide();
  });
});

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
  const allInputs = document.querySelectorAll(`[data-category="${category}"]`);
  
  // Apply to all start and target inputs
  allInputs.forEach(input => {
    const type = input.dataset.type;
    if (type === 'start') {
      input.value = startLevel;
    } else if (type === 'target') {
      input.value = targetLevel;
    }
  });
  
  // Update resonance level display
  updateResonanceLevelDisplay(category);
  
  // Show success message
  const categoryNames = {
    gear: '裝備 / Gear',
    skill: '技能 / Skill',
    relic: '古遺物 / Relic',
    pet: '幻獸 / Pet'
  };
  
  const categoryName = categoryNames[category] || category;
  showToast(`✅ 已套用共鳴等級到所有${categoryName}<br>起始: ${startLevel} → 目標: ${targetLevel}`, 'success');
}

/**
 * Calculate total production from all sources
 */
function calculateTotalProduction() {
  const startDate = new Date(document.getElementById('season-start-date').value);
  const currentDate = new Date(document.getElementById('current-datetime').value);
  
  const totalDays = seasonData.total_day;
  const elapsedMs = currentDate - startDate;
  const remainingMs = (totalDays * 24 * 60 * 60 * 1000) - elapsedMs;
  const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
  const remainingDays = Math.max(0, Math.floor(remainingHours / 24));
  
  // Stamina calculation with fallback to default values
  const buyDailySpecial = document.getElementById('buy-daily-special').checked;
  
  // Use default values if stamina_source doesn't exist
  const defaultStaminaSource = {
    daily_mission: 50,
    shop_treasury: 50,
    daily_special: 10
  };
  
  const staminaSource = seasonData.stamina_source || defaultStaminaSource;
  
  const dailyMissions = staminaSource.daily_mission;
  const shopTreasury = staminaSource.shop_treasury;
  const dailySpecial = buyDailySpecial ? staminaSource.daily_special : 0;
  
  const naturalStamina = remainingHours * 5;
  const accelerationStamina = remainingDays * 2 * 5;
  const totalStamina = naturalStamina + 
                       (dailyMissions * remainingDays) + 
                       (shopTreasury * remainingDays) + 
                       (dailySpecial * remainingDays) + 
                       accelerationStamina;
  
    // Get stamina priority resource
    const activeBtn = document.querySelector('#stamina-priority-buttons .btn.active');
    const staminaResource = activeBtn ? activeBtn.dataset.resource : null;

    console.log('Selected stamina resource:', staminaResource); // Debug log

    // Calculate stamina production
    const staminaProduction = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0
    };

    if (staminaResource && upgradesData && upgradesData.stamina_production) {
    console.log('Stamina production data:', upgradesData.stamina_production); // Debug log
    
    const resourceData = upgradesData.stamina_production.resources.find(r => r.key === staminaResource);
    
    console.log('Found resource data:', resourceData); // Debug log
    
    if (resourceData && resourceData.value) {
        const staminaCost = upgradesData.stamina_production.stamina_per_run || 20;
        const totalRuns = Math.floor(totalStamina / staminaCost);
        const production = totalRuns * resourceData.value;
        
        console.log(`Stamina calculation: ${totalStamina} stamina / ${staminaCost} per run = ${totalRuns} runs × ${resourceData.value} = ${production}`); // Debug log
        
        staminaProduction[staminaResource] = production;
    } else {
        console.error('Resource data not found or invalid for:', staminaResource);
    }
    } else {
    console.error('Missing data:', {
        staminaResource,
        hasUpgradesData: !!upgradesData,
        hasStaminaProduction: !!(upgradesData && upgradesData.stamina_production)
    });
    }
  
    // Cart production
    const cartProduction = {
    gold: Math.floor((parseFloat(document.getElementById('cart-gold').value) || 0) * remainingHours),
    refined_stone: Math.floor((parseFloat(document.getElementById('cart-refined-stone').value) || 0) * remainingHours),
    hourglass: Math.floor((parseFloat(document.getElementById('cart-hourglass').value) || 0) * remainingHours),
    battle_essence: Math.floor((parseFloat(document.getElementById('cart-battle-essence').value) || 0) * remainingHours),
    freeze_dried: Math.floor((parseFloat(document.getElementById('cart-freeze-dried').value) || 0) * remainingHours)
    };
  
  // Secret realm tools production
  const secretRealmProduction = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0
  };
  
  if (upgradesData.secret_realm) {
    const resources = upgradesData.secret_realm.resources;
    
    const goldPickaxe = parseFloat(document.getElementById('tool-gold-pickaxe').value) || 0;
    const ironHammer = parseFloat(document.getElementById('tool-iron-hammer').value) || 0;
    const sandShovel = parseFloat(document.getElementById('tool-sand-shovel').value) || 0;
    const glove = parseFloat(document.getElementById('tool-glove').value) || 0;
    
    const goldRate = resources.find(r => r.key === 'gold')?.value || 0;
    const refinedStoneRate = resources.find(r => r.key === 'refined_stone')?.value || 0;
    const hourglassRate = resources.find(r => r.key === 'hourglass')?.value || 0;
    const battleEssenceRate = resources.find(r => r.key === 'battle_essence')?.value || 0;
    
    secretRealmProduction.gold = Math.floor(goldPickaxe * goldRate * remainingDays);
    secretRealmProduction.refined_stone = Math.floor(ironHammer * refinedStoneRate * remainingDays);
    secretRealmProduction.hourglass = Math.floor(sandShovel * hourglassRate * remainingDays);
    secretRealmProduction.battle_essence = Math.floor(glove * battleEssenceRate * remainingDays);
  }
  
    // Bond adventure production
    const bondAdventureProduction = {
    freeze_dried: 0
    };

    if (seasonData.bond_adventure && seasonData.bond_adventure.bond_adventure_enabled) {
    seasonData.bond_adventure.rewards.forEach(reward => {
        const inputElement = document.getElementById(`bond-${reward.type}`);
        if (inputElement) {
        const amount = parseFloat(inputElement.value) || 0;
        const freezeDriedType = window.FREEZE_DRIED_DATA.types.find(t => t.key === reward.type);
        if (freezeDriedType) {
            // 正確公式: 數量 × EXP × 剩餘天數
            bondAdventureProduction.freeze_dried += amount * freezeDriedType.exp * remainingDays;
        }
        }
    });
    }
  
  // Total production
  const totalProduction = {
    gold: staminaProduction.gold + cartProduction.gold + secretRealmProduction.gold,
    refined_stone: staminaProduction.refined_stone + cartProduction.refined_stone + secretRealmProduction.refined_stone,
    hourglass: staminaProduction.hourglass + cartProduction.hourglass + secretRealmProduction.hourglass,
    battle_essence: staminaProduction.battle_essence + cartProduction.battle_essence + secretRealmProduction.battle_essence,
    freeze_dried: cartProduction.freeze_dried + bondAdventureProduction.freeze_dried
  };
  
  return {
    stamina: {
      totalStamina,
      naturalStamina,
      dailyMissions,
      shopTreasury,
      dailySpecial,
      accelerationStamina,
      remainingDays,
      remainingHours
    },
    staminaProduction,
    cartProduction,
    secretRealmProduction,
    bondAdventureProduction,
    total: totalProduction
  };
}

/**
 * Calculate upgrade needs with detailed breakdown
 */
function calculateUpgradeNeeds() {
  const needs = {
    gold: 0,
    refined_stone: 0,
    hourglass: 0,
    battle_essence: 0,
    freeze_dried: 0
  };
  
  const breakdown = {
    gear: { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0, freeze_dried: 0, count: 0 },
    skill: { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0, freeze_dried: 0, count: 0 },
    relic: { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0, freeze_dried: 0, count: 0 },
    pet: { gold: 0, refined_stone: 0, hourglass: 0, battle_essence: 0, freeze_dried: 0, count: 0 }
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
        breakdown[category].count++;
        
        for (let level = startLevel + 1; level <= targetLevel; level++) {
          const levelData = categoryData.levels.find(l => l.level === level);
          if (levelData) {
            // Gold
            if (levelData.gold) {
              needs.gold += levelData.gold;
              breakdown[category].gold += levelData.gold;
            }
            // Refined Stone
            if (levelData.refined_stone) {
              needs.refined_stone += levelData.refined_stone;
              breakdown[category].refined_stone += levelData.refined_stone;
            }
            // Hourglass
            if (levelData.hourglass) {
              needs.hourglass += levelData.hourglass;
              breakdown[category].hourglass += levelData.hourglass;
            }
            // Battle Essence (battle_record in data)
            if (levelData.battle_record) {
              needs.battle_essence += levelData.battle_record;
              breakdown[category].battle_essence += levelData.battle_record;
            }
            // Freeze Dried
            if (levelData.freeze_dried) {
              needs.freeze_dried += levelData.freeze_dried;
              breakdown[category].freeze_dried += levelData.freeze_dried;
            }
          }
        }
      }
    });
  });
  
  return { needs, breakdown };
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
  const { needs, breakdown } = calculateUpgradeNeeds();
  
  calculationResults = {
    production,
    needs,
    breakdown,
    comparison: {
      gold: production.total.gold - needs.gold,
      refined_stone: production.total.refined_stone - needs.refined_stone,
      hourglass: production.total.hourglass - needs.hourglass,
      battle_essence: production.total.battle_essence - needs.battle_essence,
      freeze_dried: production.total.freeze_dried - needs.freeze_dried
    }
  };
  
  // Display results
  displayResults();
}

/**
 * Display calculation results
 */
function displayResults() {
  const resultsContainer = document.getElementById('calculation-results');
  const resultsSection = document.getElementById('results-section');
  
  if (!calculationResults) {
    resultsSection.style.display = 'none';
    return;
  }
  
  const html = renderCalculationResults(calculationResults);
  resultsContainer.innerHTML = html;
  resultsSection.style.display = 'block';
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} alert-dismissible fade show`;
  toast.style.cssText = 'min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 150);
  }, 3000);
}