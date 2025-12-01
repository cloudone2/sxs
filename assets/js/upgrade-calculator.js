// 資源升級計算器核心邏輯
class UpgradeCalculator {
    constructor() {
        this.seasons = {};
        this.upgrades = {};
        this.freezeDriedExp = {};
        this.currentSeason = null;
        this.selectedStaminaResource = null;
        this.calculationResults = null;
        
        // 常數配置
        this.constants = {
            natural_stamina_per_hour: 5,
            acceleration_hours_per_day: 2,
            daily_deal_stamina: 10,
            daily_deal_voucher: 299,
            stamina_cost_per_run: 5
        };
        
        // 資源類型映射
        this.resourceTypes = ['gold', 'refined_stone', 'hourglass', 'battle_essence', 'freeze_dried'];
        this.resourceIcons = {
            gold: '💰',
            refined_stone: '🪨',
            hourglass: '⏳',
            battle_essence: '📖',
            freeze_dried: '🥩'
        };
        
        this.resourceNames = {
            gold: '金幣',
            refined_stone: '粗煉石',
            hourglass: '時之砂',
            battle_essence: '歷戰精華',
            freeze_dried: '凍乾'
        };
        
        // 類別配置
        this.categoryConfig = {
            gear: { name: '裝備', icon: '⚔️', count: 5 },
            skill: { name: '技能', icon: '📚', count: 8 },
            relic: { name: '古遺物', icon: '✨', count: 20 },
            pet: { name: '幻獸', icon: '🐾', count: 4 }
        };
        
        this.initializeCalculator();
    }
    
    async initializeCalculator() {
        try {
            // 載入數據
            await this.loadData();
            
            // 設置事件監聽器
            this.setupEventListeners();
            
            // 初始化UI
            this.initializeUI();
            
        } catch (error) {
            console.error('初始化計算器失敗:', error);
            this.showError('載入數據失敗，請刷新頁面重試');
        }
    }
    
    async loadData() {
        try {
            // 從嵌入的 script 標籤載入數據
            const seasonsElement = document.getElementById('seasonsData');
            const upgradesElement = document.getElementById('upgradesData');
            const freezeDriedElement = document.getElementById('freezeDriedData');
            
            if (!seasonsElement || !upgradesElement || !freezeDriedElement) {
                throw new Error('找不到數據元素');
            }
            
            this.seasons = JSON.parse(seasonsElement.textContent);
            this.upgrades = JSON.parse(upgradesElement.textContent);
            this.freezeDriedExp = JSON.parse(freezeDriedElement.textContent);
            
            // 更新常數配置
            if (this.seasons.constants) {
                this.constants = { ...this.constants, ...this.seasons.constants };
            }
            
            console.log('數據載入完成:', {
                seasons: Object.keys(this.seasons.seasons || {}),
                upgrades: Object.keys(this.upgrades),
                freezeDriedExp: this.freezeDriedExp.types?.length || 0
            });
            
        } catch (error) {
            console.error('載入數據失敗:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // 賽季選擇器
        const seasonSelect = document.getElementById('seasonSelect');
        if (seasonSelect) {
            seasonSelect.addEventListener('change', this.onSeasonChange.bind(this));
        }
        
        // 時間輸入
        const currentDateTime = document.getElementById('currentDateTime');
        const startDateTime = document.getElementById('startDateTime');
        
        if (currentDateTime) {
            currentDateTime.addEventListener('change', this.updateTimeCalculations.bind(this));
            // 設置當前時間
            const now = new Date();
            currentDateTime.value = this.formatDateTimeLocal(now);
        }
        
        if (startDateTime) {
            startDateTime.addEventListener('change', this.updateTimeCalculations.bind(this));
        }
        
        // 購買每日特惠
        const buyDailyDeal = document.getElementById('buyDailyDeal');
        if (buyDailyDeal) {
            buyDailyDeal.addEventListener('change', this.updateTimeCalculations.bind(this));
        }
        
        // 可折疊區塊
        this.setupCollapsibleSections();
    }
    
    setupCollapsibleSections() {
        // 為可折疊標題添加事件監聽器
        document.querySelectorAll('.collapsible').forEach(element => {
            element.addEventListener('click', function() {
                const target = this.getAttribute('data-bs-target');
                if (target) {
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        const isExpanded = targetElement.classList.contains('show');
                        this.setAttribute('aria-expanded', !isExpanded);
                    }
                }
            });
        });
    }
    
    initializeUI() {
        this.populateSeasonSelector();
        this.setupDefaultSeason();
    }
    
    populateSeasonSelector() {
        const seasonSelect = document.getElementById('seasonSelect');
        if (!seasonSelect || !this.seasons.seasons) return;
        
        // 清空選項
        seasonSelect.innerHTML = '<option value="">請選擇賽季</option>';
        
        // 添加賽季選項
        this.seasons.seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.id;
            option.textContent = season.title;
            seasonSelect.appendChild(option);
        });
    }
    
    setupDefaultSeason() {
        const seasonSelect = document.getElementById('seasonSelect');
        if (!seasonSelect || !this.seasons.current_season) return;
        
        // 設置預設賽季
        seasonSelect.value = this.seasons.current_season;
        this.onSeasonChange();
    }
    
    onSeasonChange() {
        const seasonSelect = document.getElementById('seasonSelect');
        const seasonId = seasonSelect.value;
        
        if (!seasonId) {
            this.hidePage();
            return;
        }
        
        // 找到選中的賽季
        const season = this.seasons.seasons.find(s => s.id === seasonId);
        if (!season) {
            console.error('找不到賽季:', seasonId);
            return;
        }
        
        this.currentSeason = season;
        
        // 更新主題
        updateSeasonTheme(seasonId, season.theme_color);
        
        // 顯示賽季信息
        this.displaySeasonInfo(season);
        
        // 設置預設時間
        this.setupDefaultTimes(season);
        
        // 設置體力資源選項
        this.setupStaminaResources(seasonId);
        
        // 設置產出輸入
        this.setupProductionInputs(seasonId);
        
        // 設置升級目標
        this.setupUpgradeGoals(seasonId);
        
        // 顯示主要界面
        this.showPage();
    }
    
    hidePage() {
        const calculatorInterface = document.getElementById('calculatorInterface');
        if (calculatorInterface) {
            calculatorInterface.style.display = 'none';
        }
        
        const seasonInfo = document.getElementById('seasonInfo');
        if (seasonInfo) {
            seasonInfo.style.display = 'none';
        }
    }
    
    showPage() {
        const calculatorInterface = document.getElementById('calculatorInterface');
        if (calculatorInterface) {
            calculatorInterface.style.display = 'block';
            calculatorInterface.classList.add('fade-in');
        }
    }
    
    displaySeasonInfo(season) {
        const seasonInfo = document.getElementById('seasonInfo');
        const seasonTitle = document.getElementById('seasonTitle');
        const themePreview = document.getElementById('themePreview');
        
        if (seasonInfo && seasonTitle && themePreview) {
            seasonTitle.textContent = season.title;
            themePreview.style.background = `linear-gradient(135deg, ${season.theme_color} 0%, ${this.darkenColor(season.theme_color, 20)} 100%)`;
            seasonInfo.style.display = 'block';
        }
    }
    
    setupDefaultTimes(season) {
        const startDateTime = document.getElementById('startDateTime');
        if (startDateTime && season.release_date) {
            const releaseDate = new Date(season.release_date);
            startDateTime.value = this.formatDateTimeLocal(releaseDate);
        }
        
        // 觸發時間計算更新
        this.updateTimeCalculations();
    }
    
    setupStaminaResources(seasonId) {
        const container = document.getElementById('staminaResourceOptions');
        if (!container) return;
        
        const upgradeData = this.upgrades[seasonId];
        if (!upgradeData || !upgradeData.stamina_production) return;
        
        container.innerHTML = '';
        
        upgradeData.stamina_production.resources.forEach(resource => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'col-md-6 col-lg-3 mb-3';
            
            resourceDiv.innerHTML = `
                <div class="resource-option" data-resource="${resource.key}" onclick="selectStaminaResource('${resource.key}')">
                    <div class="resource-icon">${resource.icon}</div>
                    <div class="resource-name">${resource.name_zh}</div>
                    <div class="resource-rate">${formatNumber(resource.value)}/5⚡</div>
                </div>
            `;
            
            container.appendChild(resourceDiv);
        });
    }
    
    setupProductionInputs(seasonId) {
        this.setupCartProductionInputs();
        this.setupSecretRealmInputs(seasonId);
        this.setupBondAdventureInputs(seasonId);
    }
    
    setupCartProductionInputs() {
        const container = document.getElementById('cartProductionInputs');
        if (!container) return;
        
        container.innerHTML = '';
        
        const resources = [
            { key: 'gold', name: '金幣', icon: '💰' },
            { key: 'refined_stone', name: '粗煉石', icon: '🪨' },
            { key: 'hourglass', name: '時之砂', icon: '⏳' },
            { key: 'battle_essence', name: '歷戰精華', icon: '📖' },
            { key: 'freeze_dried', name: '普通凍乾', icon: '🥩' }
        ];
        
        resources.forEach(resource => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'col-md-6 col-lg-4 mb-3';
            
            inputDiv.innerHTML = `
                <label for="cart_${resource.key}" class="form-label">
                    ${resource.icon} ${resource.name}
                </label>
                <input type="number" 
                       class="form-control" 
                       id="cart_${resource.key}" 
                       placeholder="0" 
                       min="0" 
                       step="1">
            `;
            
            container.appendChild(inputDiv);
        });
    }
    
    setupSecretRealmInputs(seasonId) {
        const container = document.getElementById('secretRealmToolInputs');
        if (!container) return;
        
        const upgradeData = this.upgrades[seasonId];
        if (!upgradeData || !upgradeData.secret_realm) return;
        
        container.innerHTML = '';
        
        upgradeData.secret_realm.resources.forEach(resource => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'col-md-6 col-lg-3 mb-3';
            
            inputDiv.innerHTML = `
                <label for="tool_${resource.key}" class="form-label">
                    ${resource.icon} ${resource.tool_name_zh}
                </label>
                <input type="number" 
                       class="form-control" 
                       id="tool_${resource.key}" 
                       placeholder="0" 
                       min="0" 
                       step="1">
                <small class="form-text text-muted">${formatNumber(resource.value)}/工具</small>
            `;
            
            container.appendChild(inputDiv);
        });
    }
    
    setupBondAdventureInputs(seasonId) {
        const section = document.getElementById('bondAdventureSection');
        const container = document.getElementById('bondAdventureInputs');
        
        if (!section || !container) return;
        
        const season = this.seasons.seasons.find(s => s.id === seasonId);
        
        if (!season || !season.bond_adventure?.bond_adventure_enabled) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        container.innerHTML = '';
        
        if (season.bond_adventure.rewards) {
            season.bond_adventure.rewards.forEach((reward, index) => {
                const freezeDriedType = this.freezeDriedExp.types.find(type => type.key === reward.type);
                if (!freezeDriedType) return;
                
                const inputDiv = document.createElement('div');
                inputDiv.className = 'col-md-6 mb-3';
                
                inputDiv.innerHTML = `
                    <label for="bond_${reward.type}" class="form-label">
                        ${freezeDriedType.icon} ${freezeDriedType.name_zh}
                    </label>
                    <input type="number" 
                           class="form-control" 
                           id="bond_${reward.type}" 
                           value="${reward.amount}" 
                           min="0" 
                           step="1">
                    <small class="form-text text-muted">每日獎勵數量</small>
                `;
                
                container.appendChild(inputDiv);
            });
        }
    }
    
    setupUpgradeGoals(seasonId) {
        const upgradeData = this.upgrades[seasonId];
        const season = this.seasons.seasons.find(s => s.id === seasonId);
        if (!upgradeData || !season) return;
        
        Object.keys(this.categoryConfig).forEach(categoryKey => {
            this.setupCategoryUpgradeGoals(categoryKey, upgradeData, season);
        });
    }
    
    setupCategoryUpgradeGoals(categoryKey, upgradeData, season) {
        const container = document.getElementById(`${categoryKey}Items`);
        if (!container) return;
        
        const categoryData = upgradeData.categories[categoryKey];
        const categoryConfig = this.categoryConfig[categoryKey];
        if (!categoryData || !categoryConfig) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= categoryConfig.count; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'upgrade-item';
            
            const startLevel = this.getFixedLevel(season, categoryKey);
            const targetLevel = categoryData.suggested_level || startLevel;
            
            itemDiv.innerHTML = `
                <div class="upgrade-item-header">
                    ${categoryConfig.icon} ${categoryConfig.name} ${i}
                </div>
                <div class="level-inputs">
                    <div class="level-input">
                        <label class="form-label">起始等級</label>
                        <input type="number" 
                               class="form-control start-level" 
                               value="${startLevel}" 
                               min="1" 
                               data-category="${categoryKey}" 
                               data-item="${i}">
                    </div>
                    <div class="level-arrow">→</div>
                    <div class="level-input">
                        <label class="form-label">目標等級</label>
                        <input type="number" 
                               class="form-control target-level" 
                               value="${targetLevel}" 
                               min="1" 
                               data-category="${categoryKey}" 
                               data-item="${i}">
                    </div>
                </div>
            `;
            
            container.appendChild(itemDiv);
        }
        
        // 為輸入框添加事件監聽器
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateAverageLevel(categoryKey);
            });
        });
        
        // 更新平均等級顯示
        this.updateAverageLevel(categoryKey);
    }
    
    getFixedLevel(season, categoryKey) {
        if (categoryKey === 'relic') {
            return season.fixed_relics_level || season.fixed_level || 1;
        }
        return season.fixed_level || 1;
    }
    
    updateAverageLevel(categoryKey) {
        const container = document.getElementById(`${categoryKey}Items`);
        const avgElement = document.querySelector(`[data-category="${categoryKey}"] .avg-level`);
        
        if (!container || !avgElement) return;
        
        const startInputs = container.querySelectorAll('.start-level');
        const targetInputs = container.querySelectorAll('.target-level');
        
        let totalStart = 0, totalTarget = 0, count = 0;
        
        startInputs.forEach((input, index) => {
            const startValue = parseInt(input.value) || 0;
            const targetValue = parseInt(targetInputs[index]?.value) || 0;
            
            if (startValue > 0 && targetValue > 0) {
                totalStart += startValue;
                totalTarget += targetValue;
                count++;
            }
        });
        
        if (count > 0) {
            const avgStart = Math.round(totalStart / count);
            const avgTarget = Math.round(totalTarget / count);
            avgElement.textContent = `${avgStart} → ${avgTarget}`;
        } else {
            avgElement.textContent = '-- → --';
        }
    }
    
    updateTimeCalculations() {
        if (!this.currentSeason) return;
        
        const startDateTime = document.getElementById('startDateTime');
        const currentDateTime = document.getElementById('currentDateTime');
        
        if (!startDateTime || !currentDateTime) return;
        
        const startTime = new Date(startDateTime.value);
        const currentTime = new Date(currentDateTime.value);
        
        if (isNaN(startTime.getTime()) || isNaN(currentTime.getTime())) return;
        
        // 計算剩餘時間
        const totalSeasonMs = this.currentSeason.total_day * 24 * 60 * 60 * 1000;
        const seasonEndTime = new Date(startTime.getTime() + totalSeasonMs);
        const remainingMs = seasonEndTime.getTime() - currentTime.getTime();
        
        if (remainingMs <= 0) {
            console.warn('賽季已結束');
            return;
        }
        
        const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
        const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        // 儲存計算結果供其他方法使用
        this.timeData = {
            remainingDays,
            remainingHours,
            totalRemainingHours: remainingDays * 24 + remainingHours
        };
    }
    
    // 體力計算方法
    calculateStamina() {
        if (!this.timeData) {
            this.updateTimeCalculations();
        }
        
        if (!this.timeData) return null;
        
        const { remainingDays, remainingHours } = this.timeData;
        const buyDailyDeal = document.getElementById('buyDailyDeal')?.checked || false;
        
        // 自然恢復體力
        const naturalStamina = (remainingDays * 24 + remainingHours) * this.constants.natural_stamina_per_hour;
        
        // 每日獎勵體力 (任務20 + 商店30)
        const dailyBonusStamina = remainingDays * 50;
        
        // 加速體力 (每天2小時)
        const accelerationStamina = remainingDays * this.constants.acceleration_hours_per_day * this.constants.natural_stamina_per_hour;
        
        // 特惠體力
        const dealStamina = buyDailyDeal ? (remainingDays * this.constants.daily_deal_stamina) : 0;
        
        const totalStamina = naturalStamina + dailyBonusStamina + accelerationStamina + dealStamina;
        
        return {
            natural: naturalStamina,
            dailyBonus: dailyBonusStamina,
            acceleration: accelerationStamina,
            dailyDeal: dealStamina,
            total: totalStamina,
            remainingDays,
            remainingHours
        };
    }
    
    // 推車產出計算
    calculateCartProduction() {
        if (!this.timeData) return {};
        
        const production = {};
        const totalHours = this.timeData.totalRemainingHours;
        
        ['gold', 'refined_stone', 'hourglass', 'battle_essence', 'freeze_dried'].forEach(resourceKey => {
            const input = document.getElementById(`cart_${resourceKey}`);
            const hourlyRate = parseInt(input?.value) || 0;
            
            if (resourceKey === 'freeze_dried') {
                // 凍乾需要轉換為經驗值
                const normalExp = this.freezeDriedExp.types.find(type => type.key === 'normal')?.exp || 50;
                production[resourceKey] = hourlyRate * totalHours * normalExp;
            } else {
                production[resourceKey] = hourlyRate * totalHours;
            }
        });
        
        return production;
    }
    
    // 秘境工具產出計算
    calculateSecretRealmProduction() {
        const seasonId = this.currentSeason?.id;
        if (!seasonId) return {};
        
        const upgradeData = this.upgrades[seasonId];
        if (!upgradeData || !upgradeData.secret_realm) return {};
        
        const production = {};
        
        upgradeData.secret_realm.resources.forEach(resource => {
            const input = document.getElementById(`tool_${resource.key}`);
            const toolCount = parseInt(input?.value) || 0;
            production[resource.key] = toolCount * resource.value;
        });
        
        return production;
    }
    
    // 羈絆冒險產出計算
    calculateBondAdventureProduction() {
        const season = this.currentSeason;
        if (!season || !season.bond_adventure?.bond_adventure_enabled) return {};
        
        if (!this.timeData) return {};
        
        const production = { freeze_dried: 0 };
        const remainingDays = this.timeData.remainingDays;
        
        if (season.bond_adventure.rewards) {
            season.bond_adventure.rewards.forEach(reward => {
                const input = document.getElementById(`bond_${reward.type}`);
                const dailyAmount = parseInt(input?.value) || 0;
                
                const freezeDriedType = this.freezeDriedExp.types.find(type => type.key === reward.type);
                if (freezeDriedType) {
                    production.freeze_dried += dailyAmount * remainingDays * freezeDriedType.exp;
                }
            });
        }
        
        return production;
    }
    
    // 體力刷取產出計算
    calculateStaminaProduction() {
        if (!this.selectedStaminaResource) return {};
        
        const staminaData = this.calculateStamina();
        if (!staminaData) return {};
        
        const seasonId = this.currentSeason?.id;
        if (!seasonId) return {};
        
        const upgradeData = this.upgrades[seasonId];
        if (!upgradeData || !upgradeData.stamina_production) return {};
        
        const resourceData = upgradeData.stamina_production.resources.find(
            r => r.key === this.selectedStaminaResource
        );
        
        if (!resourceData) return {};
        
        const totalRuns = Math.floor(staminaData.total / this.constants.stamina_cost_per_run);
        const production = {};
        production[this.selectedStaminaResource] = totalRuns * resourceData.value;
        
        return production;
    }
    
    // 計算升級需求
    calculateUpgradeNeeds() {
        const seasonId = this.currentSeason?.id;
        if (!seasonId) return {};
        
        const upgradeData = this.upgrades[seasonId];
        if (!upgradeData) return {};
        
        const needs = {};
        
        Object.keys(this.categoryConfig).forEach(categoryKey => {
            const categoryData = upgradeData.categories[categoryKey];
            if (!categoryData) return;
            
            const container = document.getElementById(`${categoryKey}Items`);
            if (!container) return;
            
            const startInputs = container.querySelectorAll('.start-level');
            const targetInputs = container.querySelectorAll('.target-level');
            
            startInputs.forEach((startInput, index) => {
                const startLevel = parseInt(startInput.value) || 0;
                const targetLevel = parseInt(targetInputs[index]?.value) || 0;
                
                if (startLevel >= targetLevel || startLevel < 1) return;
                
                // 計算此項目需求
                const itemNeeds = this.calculateSingleItemNeeds(
                    categoryData, startLevel, targetLevel
                );
                
                // 累加到總需求
                Object.keys(itemNeeds).forEach(resourceKey => {
                    needs[resourceKey] = (needs[resourceKey] || 0) + itemNeeds[resourceKey];
                });
            });
        });
        
        return needs;
    }
    
    calculateSingleItemNeeds(categoryData, startLevel, targetLevel) {
        const needs = {};
        
        for (let level = startLevel + 1; level <= targetLevel; level++) {
            const levelData = categoryData.levels.find(l => l.level === level);
            if (levelData) {
                Object.keys(levelData).forEach(resourceKey => {
                    if (resourceKey !== 'level') {
                        needs[resourceKey] = (needs[resourceKey] || 0) + levelData[resourceKey];
                    }
                });
            }
        }
        
        return needs;
    }
    
    // 計算總產出
    calculateTotalProduction() {
        const cartProduction = this.calculateCartProduction();
        const secretRealmProduction = this.calculateSecretRealmProduction();
        const bondAdventureProduction = this.calculateBondAdventureProduction();
        const staminaProduction = this.calculateStaminaProduction();
        
        const totalProduction = {};
        
        // 合併所有產出
        [cartProduction, secretRealmProduction, bondAdventureProduction, staminaProduction].forEach(production => {
            Object.keys(production).forEach(resourceKey => {
                totalProduction[resourceKey] = (totalProduction[resourceKey] || 0) + production[resourceKey];
            });
        });
        
        return {
            total: totalProduction,
            breakdown: {
                cart: cartProduction,
                secretRealm: secretRealmProduction,
                bondAdventure: bondAdventureProduction,
                stamina: staminaProduction
            }
        };
    }
    
    // 生成購買建議
    generatePurchaseSuggestions(needs, production) {
        if (!this.timeData) return {};
        
        const suggestions = {};
        const seasonId = this.currentSeason?.id;
        const upgradeData = this.upgrades[seasonId];
        
        if (!upgradeData || !upgradeData.secret_realm) return suggestions;
        
        Object.keys(needs).forEach(resourceKey => {
            const required = needs[resourceKey] || 0;
            const available = production.total[resourceKey] || 0;
            const deficit = required - available;
            
            if (deficit > 0 && resourceKey !== 'freeze_dried') {
                // 找到對應的秘境工具
                const toolData = upgradeData.secret_realm.resources.find(r => r.key === resourceKey);
                if (toolData) {
                    const toolsNeeded = Math.ceil(deficit / toolData.value);
                    const toolsPerDay = Math.ceil(toolsNeeded / this.timeData.remainingDays);
                    
                    suggestions[resourceKey] = {
                        deficit: deficit,
                        toolName: toolData.tool_name_zh,
                        toolsNeeded: toolsNeeded,
                        toolsPerDay: Math.max(1, toolsPerDay),
                        toolValue: toolData.value
                    };
                }
            }
        });
        
        return suggestions;
    }
    
    // 主計算方法
    calculateAll() {
        try {
            if (!this.currentSeason) {
                this.showError('請選擇賽季');
                return;
            }
            
            // 更新時間計算
            this.updateTimeCalculations();
            
            if (!this.timeData) {
                this.showError('請設置正確的時間');
                return;
            }
            
            // 執行所有計算
            const staminaData = this.calculateStamina();
            const productionData = this.calculateTotalProduction();
            const upgradeNeeds = this.calculateUpgradeNeeds();
            const purchaseSuggestions = this.generatePurchaseSuggestions(upgradeNeeds, productionData);
            
            // 儲存計算結果
            this.calculationResults = {
                stamina: staminaData,
                production: productionData,
                needs: upgradeNeeds,
                suggestions: purchaseSuggestions
            };
            
            // 顯示結果
            this.displayResults();
            
        } catch (error) {
            console.error('計算失敗:', error);
            this.showError('計算過程中發生錯誤，請檢查輸入數據');
        }
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('calculationResults');
        if (!resultsContainer || !this.calculationResults) return;
        
        resultsContainer.innerHTML = generateResultsHTML(this.calculationResults, this.currentSeason, this.timeData);
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('fade-in');
        
        // 滾動到結果區域
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showError(message) {
        // 可以用更好的UI組件替換
        alert(message);
    }
    
    // 輔助方法
    formatDateTimeLocal(date) {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

// 全局函數
function selectStaminaResource(resourceKey) {
    // 移除之前的選中狀態
    document.querySelectorAll('.resource-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 添加選中狀態
    const selectedOption = document.querySelector(`[data-resource="${resourceKey}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // 更新選中的資源
    if (window.calculator) {
        window.calculator.selectedStaminaResource = resourceKey;
    }
}

function applyResonanceLevel(categoryKey, levelType) {
    const level = prompt(`請輸入${levelType === 'start' ? '起始' : '目標'}共鳴等級:`);
    const levelNum = parseInt(level);
    
    if (isNaN(levelNum) || levelNum < 1) {
        alert('請輸入有效的等級數字');
        return;
    }
    
    const container = document.getElementById(`${categoryKey}Items`);
    if (!container) return;
    
    const inputs = container.querySelectorAll(levelType === 'start' ? '.start-level' : '.target-level');
    inputs.forEach(input => {
        input.value = levelNum;
    });
    
    // 更新平均等級
    if (window.calculator) {
        window.calculator.updateAverageLevel(categoryKey);
    }
}

function calculateAll() {
    if (window.calculator) {
        window.calculator.calculateAll();
    }
}

// 初始化計算器
document.addEventListener('DOMContentLoaded', function() {
    window.calculator = new UpgradeCalculator();
});