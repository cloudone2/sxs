/**
 * 資源升級計算器 - 主要邏輯
 */

// 全域變數
let currentSeasonData = null;
let currentUpgradeData = null;
let calculationResults = null;

/**
 * 初始化計算器
 */
function initializeCalculator() {
    console.log('正在初始化資源升級計算器...');
    
    // 載入賽季選項
    loadSeasonOptions();
    
    // 設定當前時間
    setCurrentDateTime();
    
    // 綁定事件監聽器
    bindEventListeners();
    
    // 載入預設賽季（如果有）
    loadDefaultSeason();
    
    console.log('計算器初始化完成');
}

/**
 * 載入賽季選項
 */
function loadSeasonOptions() {
    const seasonSelect = document.getElementById('seasonSelect');
    const seasons = window.seasonsData?.seasons || [];
    
    seasonSelect.innerHTML = '<option value="">選擇賽季...</option>';
    
    seasons.forEach(season => {
        if (hasSeasonData(season.id)) {
            const option = document.createElement('option');
            option.value = season.id;
            option.textContent = season.title;
            seasonSelect.appendChild(option);
        }
    });
}

/**
 * 檢查是否有賽季升級資料
 */
function hasSeasonData(seasonId) {
    return window[`${seasonId}Data`] !== undefined;
}

/**
 * 設定當前日期時間
 */
function setCurrentDateTime() {
    const now = new Date();
    const currentDate = document.getElementById('currentDate');
    
    // 直接使用本地時間，適用於 datetime-local input
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const timeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    currentDate.value = timeString;
}

/**
 * 綁定事件監聽器
 */
function bindEventListeners() {
    // 賽季選擇
    document.getElementById('seasonSelect').addEventListener('change', handleSeasonChange);
    
    // 計算按鈕
    document.getElementById('calculateBtn').addEventListener('click', handleCalculate);
    
    // 共鳴等級批量設定
    document.addEventListener('click', handleResonanceApply);
    
    // 類別摺疊
    document.addEventListener('click', handleCategoryToggle);
}

/**
 * 載入預設賽季
 */
function loadDefaultSeason() {
    const currentSeason = window.seasonsData?.current_season;
    if (currentSeason) {
        document.getElementById('seasonSelect').value = currentSeason;
        handleSeasonChange();
    }
}

/**
 * 處理賽季變更
 */
function handleSeasonChange() {
    const seasonId = document.getElementById('seasonSelect').value;
    
    if (!seasonId) {
        hideAllCards();
        return;
    }
    
    // 載入賽季資料
    currentSeasonData = window.seasonsData.seasons.find(s => s.id === seasonId);
    currentUpgradeData = window[`${seasonId}Data`];
    
    if (!currentSeasonData || !currentUpgradeData) {
        console.error('找不到賽季資料:', seasonId);
        return;
    }
    
    // 更新主題
    updateSeasonTheme(seasonId);
    
    // 設定預設日期
    const releaseDate = document.getElementById('releaseDate');
    if (currentSeasonData.release_date) {
        // Create date and force it to be interpreted in UTC+8
        releaseDate.value = currentSeasonData.release_date + 'T08:00:00';
    }
    
    // 顯示並載入各區塊
    showStaminaCard();
    showProductionCard();
    showUpgradeCard();
    showCalculateButton();
}

/**
 * 隱藏所有卡片
 */
function hideAllCards() {
    document.getElementById('staminaCard').style.display = 'none';
    document.getElementById('productionCard').style.display = 'none';
    document.getElementById('upgradeCard').style.display = 'none';
    document.getElementById('calculateSection').style.display = 'none';
    document.getElementById('results').innerHTML = '';
}

/**
 * 顯示體力選擇卡片
 */
function showStaminaCard() {
    const staminaCard = document.getElementById('staminaCard');
    const buttonsContainer = document.getElementById('staminaResourceButtons');
    
    // 清空現有按鈕
    buttonsContainer.innerHTML = '';
    
    // 生成資源按鈕
    const resources = currentUpgradeData.stamina_production.resources;
    resources.forEach(resource => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6';
        
        const button = document.createElement('div');
        button.className = 'resource-btn';
        button.dataset.resource = resource.key;
        
        button.innerHTML = `
            <div class="icon">${resource.icon}</div>
            <div class="name">${resource.name_zh}</div>
            <div class="value">${formatNumber(resource.value)}</div>
        `;
        
        button.addEventListener('click', () => selectStaminaResource(resource.key));
        
        col.appendChild(button);
        buttonsContainer.appendChild(col);
    });
    
    staminaCard.style.display = 'block';
    staminaCard.classList.add('fade-in');
}

/**
 * 選擇體力刷取資源
 */
function selectStaminaResource(resourceKey) {
    // 移除其他按鈕的 active 狀態
    document.querySelectorAll('.resource-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 添加當前按鈕的 active 狀態
    document.querySelector(`[data-resource="${resourceKey}"]`).classList.add('active');
    
    // 儲存選擇
    window.selectedStaminaResource = resourceKey;
}

/**
 * 顯示產出設定卡片
 */
function showProductionCard() {
    const productionCard = document.getElementById('productionCard');
    
    // 載入秘境工具
    loadSecretRealmTools();
    
    // 載入羈絆冒險（如果啟用）
    if (currentSeasonData.bond_adventure?.bond_adventure_enabled) {
        loadBondAdventureSection();
    }
    
    productionCard.style.display = 'block';
    productionCard.classList.add('fade-in');
}

/**
 * 載入秘境工具輸入
 */
function loadSecretRealmTools() {
    const container = document.getElementById('secretRealmTools');
    container.innerHTML = '';
    
    const resources = currentUpgradeData.secret_realm.resources;
    
    resources.forEach(resource => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6 mb-2';
        
        col.innerHTML = `
            <label class="form-label">
                ${resource.icon} ${resource.tool_name_zh}
                <small class="text-muted d-block">${formatNumber(resource.value)} / 次</small>
            </label>
            <input type="number" class="form-control" id="tool${resource.key}" value="0" min="0">
        `;
        
        container.appendChild(col);
    });
}

/**
 * 載入羈絆冒險區塊
 */
function loadBondAdventureSection() {
    const section = document.getElementById('bondAdventureSection');
    const container = document.getElementById('bondAdventureInputs');
    
    container.innerHTML = '';
    
    const rewards = currentSeasonData.bond_adventure.rewards;
    
    rewards.forEach(reward => {
        const freezeDriedType = window.freezeDriedData.types.find(t => t.key === reward.type);
        
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        
        col.innerHTML = `
            <label class="form-label">
                ${freezeDriedType.icon} ${freezeDriedType.name_zh}
                <small class="text-muted d-block">${formatNumber(freezeDriedType.exp)} EXP/個</small>
            </label>
            <input type="number" class="form-control" id="bond${reward.type}" value="${reward.amount}" min="0">
        `;
        
        container.appendChild(col);
    });
    
    section.style.display = 'block';
}

/**
 * 顯示升級目標卡片
 */
function showUpgradeCard() {
    const upgradeCard = document.getElementById('upgradeCard');
    const container = document.getElementById('upgradeCategories');
    
    container.innerHTML = '';
    
    const categories = currentUpgradeData.categories;
    
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        const categoryDiv = createUpgradeCategorySection(categoryKey, category);
        container.appendChild(categoryDiv);
    });
    
    upgradeCard.style.display = 'block';
    upgradeCard.classList.add('fade-in');
}

/**
 * 創建升級類別區塊
 */
function createUpgradeCategorySection(categoryKey, category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'upgrade-category';
    categoryDiv.dataset.category = categoryKey;
    
    // 計算項目數量
    const itemCount = getItemCount(categoryKey);
    const fixedLevel = getFixedLevel(categoryKey);
    
    categoryDiv.innerHTML = `
        <div class="category-header" data-bs-toggle="collapse" data-bs-target="#${categoryKey}Content">
            <h6>
                <span>
                    <i class="${category.icon} me-2"></i>
                    ${category.name} (${itemCount}項)
                    <small class="text-muted">平均等級: <span id="${categoryKey}AvgLevel">--</span></small>
                </span>
                <i class="fas fa-chevron-down"></i>
            </h6>
        </div>
        <div class="collapse" id="${categoryKey}Content">
            <div class="category-content">
                ${createResonanceControls(categoryKey, category, fixedLevel)}
                ${createItemInputs(categoryKey, category, itemCount, fixedLevel)}
            </div>
        </div>
    `;
    
    return categoryDiv;
}

/**
 * 創建共鳴等級控制
 */
function createResonanceControls(categoryKey, category, fixedLevel) {
    return `
        <div class="resonance-controls">
            <h6 class="mb-3">
                <i class="fas fa-magic me-2"></i>
                批量設定共鳴等級
            </h6>
            <div class="row">
                <div class="col-md-4 mb-2">
                    <label class="form-label">起始等級</label>
                    <input type="number" class="form-control" id="${categoryKey}StartResonance" value="${fixedLevel}" min="1">
                </div>
                <div class="col-md-4 mb-2">
                    <label class="form-label">目標等級</label>
                    <input type="number" class="form-control" id="${categoryKey}EndResonance" value="${category.suggested_level}" min="1">
                </div>
                <div class="col-md-4 mb-2">
                    <button class="btn btn-outline-primary mt-4" onclick="applyResonance('${categoryKey}')">
                        <i class="fas fa-magic me-2"></i>
                        套用共鳴
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 創建項目輸入
 */
function createItemInputs(categoryKey, category, itemCount, fixedLevel) {
    let html = '<div class="row">';
    
    for (let i = 0; i < itemCount; i++) {
        html += `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="item-input-group">
                    <h6 class="mb-2">
                        <i class="${category.icon} me-2"></i>
                        ${getItemName(categoryKey, i)}
                    </h6>
                    <div class="row">
                        <div class="col-6">
                            <label class="form-label">起始</label>
                            <input type="number" class="form-control item-start-level" 
                                   id="${categoryKey}Item${i}Start" 
                                   value="${fixedLevel}" 
                                   min="1"
                                   onchange="updateCategoryAverage('${categoryKey}')">
                        </div>
                        <div class="col-6">
                            <label class="form-label">目標</label>
                            <input type="number" class="form-control item-end-level" 
                                   id="${categoryKey}Item${i}End" 
                                   value="${category.suggested_level}" 
                                   min="1"
                                   onchange="updateCategoryAverage('${categoryKey}')">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * 獲取項目數量
 */
function getItemCount(categoryKey) {
    switch (categoryKey) {
        case 'gear':
            return 5;
        case 'skill':
            return 8;
        case 'relic':
            return 20;
        case 'pet':
            return 4;
        default:
            return 1;
    }
}

/**
 * 獲取固定等級
 */
function getFixedLevel(categoryKey) {
    if (categoryKey === 'relic') {
        return currentSeasonData.fixed_relics_level || 1;
    }
    return currentSeasonData.fixed_level || 1;
}

/**
 * 顯示計算按鈕
 */
function showCalculateButton() {
    const calculateSection = document.getElementById('calculateSection');
    calculateSection.style.display = 'block';
    calculateSection.classList.add('fade-in');
}

/**
 * 處理共鳴等級套用
 */
function handleResonanceApply(event) {
    if (event.target.closest('button') && event.target.closest('button').textContent.includes('套用共鳴')) {
        const categoryKey = event.target.closest('button').onclick.toString().match(/'(\w+)'/)[1];
        applyResonance(categoryKey);
    }
}

/**
 * 套用共鳴等級
 */
function applyResonance(categoryKey) {
    const startLevel = parseInt(document.getElementById(`${categoryKey}StartResonance`).value) || 1;
    const endLevel = parseInt(document.getElementById(`${categoryKey}EndResonance`).value) || 1;
    
    const itemCount = getItemCount(categoryKey);
    
    for (let i = 0; i < itemCount; i++) {
        document.getElementById(`${categoryKey}Item${i}Start`).value = startLevel;
        document.getElementById(`${categoryKey}Item${i}End`).value = endLevel;
    }
    
    updateCategoryAverage(categoryKey);
}

/**
 * 更新類別平均等級
 */
function updateCategoryAverage(categoryKey) {
    const itemCount = getItemCount(categoryKey);
    let totalStartLevel = 0;
    let totalEndLevel = 0;
    
    for (let i = 0; i < itemCount; i++) {
        const startLevel = parseInt(document.getElementById(`${categoryKey}Item${i}Start`).value) || 0;
        const endLevel = parseInt(document.getElementById(`${categoryKey}Item${i}End`).value) || 0;
        totalStartLevel += startLevel;
        totalEndLevel += endLevel;
    }
    
    const avgStart = Math.round(totalStartLevel / itemCount);
    const avgEnd = Math.round(totalEndLevel / itemCount);
    
    document.getElementById(`${categoryKey}AvgLevel`).textContent = `${avgStart} → ${avgEnd}`;
}

/**
 * 處理類別摺疊
 */
function handleCategoryToggle(event) {
    if (event.target.closest('.category-header')) {
        const header = event.target.closest('.category-header');
        const chevron = header.querySelector('.fa-chevron-down, .fa-chevron-up');
        
        if (chevron) {
            if (chevron.classList.contains('fa-chevron-down')) {
                chevron.classList.remove('fa-chevron-down');
                chevron.classList.add('fa-chevron-up');
            } else {
                chevron.classList.remove('fa-chevron-up');
                chevron.classList.add('fa-chevron-down');
            }
        }
    }
}

/**
 * 處理計算
 */
function handleCalculate() {
    const button = document.getElementById('calculateBtn');
    const originalText = button.innerHTML;
    
    // 顯示載入狀態
    button.innerHTML = '<span class="loading-spinner me-2"></span>計算中...';
    button.disabled = true;
    
    try {
        // 執行計算
        calculationResults = performCalculations();
        
        // 顯示結果
        displayResults();
        
        // 滾動到結果區域
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
    } catch (error) {
        console.error('計算過程中發生錯誤:', error);
        alert('計算過程中發生錯誤，請檢查輸入資料');
    } finally {
        // 恢復按鈕狀態
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * 執行所有計算
 */
function performCalculations() {
    const results = {
        stamina: calculateStamina(),
        production: calculateProduction(),
        upgradeNeeds: calculateUpgradeNeeds(),
        comparison: null
    };
    
    // 計算資源對比
    results.comparison = calculateResourceComparison(results.production, results.upgradeNeeds);
    
    return results;
}

/**
 * 計算體力
 */
function calculateStamina() {
    const releaseDate = new Date(document.getElementById('releaseDate').value);
    const currentDate = new Date(document.getElementById('currentDate').value);
    const buyDailyDeal = document.getElementById('buyDailyDeal').checked;
    
    // 計算剩餘時間
    const timeDiff = currentDate - releaseDate;
    const totalDays = currentSeasonData.total_day;
    const elapsedDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const remainingHours = Math.max(0, 24 - (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // 計算各項體力
    const naturalStamina = remainingDays * 24 * 5 + Math.floor(remainingHours * 5);
    const dailyStamina = currentUpgradeData.daily_stamina.total * remainingDays;
    const accelerationStamina = remainingDays * 2 * 5; // 每天2小時加速
    const dealStamina = buyDailyDeal ? 10 * remainingDays : 0;
    
    return {
        remainingDays,
        remainingHours: Math.floor(remainingHours),
        naturalStamina,
        dailyStamina,
        accelerationStamina,
        dealStamina,
        totalStamina: naturalStamina + dailyStamina + accelerationStamina + dealStamina
    };
}

/**
 * 計算產出
 */
function calculateProduction() {
    const staminaResult = calculationResults?.stamina || calculateStamina();
    
    return {
        cart: calculateCartProduction(),
        secretRealm: calculateSecretRealmProduction(),
        bondAdventure: calculateBondAdventureProduction(),
        staminaUsage: calculateStaminaUsageProduction(staminaResult)
    };
}

/**
 * 計算推車產出
 */
function calculateCartProduction() {
    const totalHours = calculationResults?.stamina?.remainingDays * 24 + 
                      calculationResults?.stamina?.remainingHours || 0;
    
    return {
        gold: (parseInt(document.getElementById('cartGold').value) || 0) * totalHours,
        refined_stone: (parseInt(document.getElementById('cartRefinedStone').value) || 0) * totalHours,
        hourglass: (parseInt(document.getElementById('cartHourglass').value) || 0) * totalHours,
        battle_essence: (parseInt(document.getElementById('cartBattleEssence').value) || 0) * totalHours,
        freeze_dried: (parseInt(document.getElementById('cartFreezeDried').value) || 0) * totalHours * 50 // 普通凍乾50 EXP
    };
}

/**
 * 計算秘境工具產出
 */
function calculateSecretRealmProduction() {
    const production = {
        gold: 0,
        refined_stone: 0,
        hourglass: 0,
        battle_essence: 0
    };
    
    currentUpgradeData.secret_realm.resources.forEach(resource => {
        const toolCount = parseInt(document.getElementById(`tool${resource.key}`).value) || 0;
        production[resource.key] = toolCount * resource.value;
    });
    
    return production;
}

/**
 * 計算羈絆冒險產出
 */
function calculateBondAdventureProduction() {
    const production = { freeze_dried: 0 };
    
    if (!currentSeasonData.bond_adventure?.bond_adventure_enabled) {
        return production;
    }
    
    const remainingDays = calculationResults?.stamina?.remainingDays || 0;
    const numberOfRewardTimes = 4;  //每日獎勵次數
    
    currentSeasonData.bond_adventure.rewards.forEach(reward => {
        const amount = parseInt(document.getElementById(`bond${reward.type}`).value) || 0;
        const freezeDriedType = window.freezeDriedData.types.find(t => t.key === reward.type);
        
        production.freeze_dried += amount * freezeDriedType.exp * remainingDays * numberOfRewardTimes;
    });
    
    return production;
}

/**
 * 計算體力使用產出
 */
function calculateStaminaUsageProduction(staminaResult) {
    const selectedResource = window.selectedStaminaResource;
    const production = {
        gold: 0,
        refined_stone: 0,
        hourglass: 0,
        battle_essence: 0,
        selectedResource
    };
    
    if (!selectedResource) {
        return production;
    }
    
    const resource = currentUpgradeData.stamina_production.resources.find(r => r.key === selectedResource);
    const totalRuns = Math.floor(staminaResult.totalStamina / 5);
    
    production[selectedResource] = totalRuns * resource.value;
    
    return production;
}

/**
 * 計算升級需求
 */
function calculateUpgradeNeeds() {
    const needs = {
        gold: 0,
        refined_stone: 0,
        hourglass: 0,
        battle_essence: 0,
        freeze_dried: 0,
        details: {}
    };
    
    const categories = currentUpgradeData.categories;
    
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        const itemCount = getItemCount(categoryKey);
        const categoryNeeds = calculateCategoryNeeds(categoryKey, category, itemCount);
        
        needs.details[categoryKey] = categoryNeeds;
        
        // 累加總需求
        Object.keys(categoryNeeds.total).forEach(resource => {
            needs[resource] += categoryNeeds.total[resource];
        });
    });
    
    return needs;
}

/**
 * 計算類別需求
 */
function calculateCategoryNeeds(categoryKey, category, itemCount) {
    const needs = {
        items: [],
        total: {
            gold: 0,
            refined_stone: 0,
            hourglass: 0,
            battle_essence: 0,
            freeze_dried: 0
        }
    };
    
    for (let i = 0; i < itemCount; i++) {
        const startLevel = parseInt(document.getElementById(`${categoryKey}Item${i}Start`).value) || 1;
        const endLevel = parseInt(document.getElementById(`${categoryKey}Item${i}End`).value) || 1;
        
        const itemNeeds = calculateItemNeeds(category, startLevel, endLevel);
        
        needs.items.push({
            name: getItemName(categoryKey, i),
            startLevel,
            endLevel,
            needs: itemNeeds
        });
        
        // 累加到類別總計
        Object.keys(itemNeeds).forEach(resource => {
            needs.total[resource] += itemNeeds[resource];
        });
    }
    
    return needs;
}

/**
 * 計算單項升級需求
 */
function calculateItemNeeds(category, startLevel, endLevel) {
    const needs = {
        gold: 0,
        refined_stone: 0,
        hourglass: 0,
        battle_essence: 0,
        freeze_dried: 0
    };
    
    for (let level = startLevel; level < endLevel; level++) {
        const levelData = category.levels.find(l => l.level === level + 1);
        
        if (levelData) {
            Object.keys(levelData).forEach(resource => {
                if (resource !== 'level' && needs.hasOwnProperty(resource)) {
                    needs[resource] += levelData[resource];
                }
            });
        }
    }
    
    return needs;
}

/**
 * 計算資源對比
 */
function calculateResourceComparison(production, needs) {
    const totalProduction = {
        gold: (production.cart.gold || 0) + (production.secretRealm.gold || 0) + (production.staminaUsage.gold || 0),
        refined_stone: (production.cart.refined_stone || 0) + (production.secretRealm.refined_stone || 0) + (production.staminaUsage.refined_stone || 0),
        hourglass: (production.cart.hourglass || 0) + (production.secretRealm.hourglass || 0) + (production.staminaUsage.hourglass || 0),
        battle_essence: (production.cart.battle_essence || 0) + (production.secretRealm.battle_essence || 0) + (production.staminaUsage.battle_essence || 0),
        freeze_dried: (production.cart.freeze_dried || 0) + (production.bondAdventure.freeze_dried || 0)
    };
    
    const comparison = {};
    
    Object.keys(needs).forEach(resource => {
        if (resource === 'details') return;
        
        const produced = totalProduction[resource] || 0;
        const needed = needs[resource] || 0;
        const balance = produced - needed;
        
        comparison[resource] = {
            produced,
            needed,
            balance,
            sufficient: balance >= 0
        };
    });
    
    return comparison;
}

/**
 * 顯示計算結果
 */
function displayResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    // 體力摘要
    resultsContainer.appendChild(renderStaminaSummary(calculationResults.stamina));
    
    // 體力使用摘要
    resultsContainer.appendChild(renderStaminaUsageSummary(calculationResults.production.staminaUsage));
    
    // 產出摘要
    resultsContainer.appendChild(renderProductionSummary(calculationResults.production));
    
    // 升級需求摘要
    resultsContainer.appendChild(renderUpgradeRequirementsSummary(calculationResults.upgradeNeeds));
    
    // 資源對比與建議
    resultsContainer.appendChild(renderResourceComparison(calculationResults.comparison));
    
    // 添加動畫效果
    resultsContainer.classList.add('fade-in');
}

// 全域函數，供 HTML 中的 onclick 調用
window.applyResonance = applyResonance;
window.updateCategoryAverage = updateCategoryAverage;