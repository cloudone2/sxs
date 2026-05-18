/**
 * 資源升級計算器 - 工具函數
 */

/**
 * 更新賽季主題
 */
function updateSeasonTheme(seasonId) {
    // 移除所有季節主題類別
    document.body.classList.remove('season-s1', 'season-s2', 'season-s3', 'season-s4');
    
    // 添加當前季節主題
    if (seasonId) {
        document.body.classList.add(`season-${seasonId}`);
        
        // 更新 CSS 變數
        const season = window.seasonsData.seasons.find(s => s.id === seasonId);
        if (season && season.theme_color) {
            document.documentElement.style.setProperty('--season-primary', season.theme_color);
            
            // 生成漸層色彩
            const gradientColor = lightenColor(season.theme_color, 20);
            document.documentElement.style.setProperty('--season-gradient', 
                `linear-gradient(135deg, ${season.theme_color} 0%, ${gradientColor} 100%)`);
        }
    }
}

/**
 * 加亮顏色
 */
function lightenColor(color, percent) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const amount = Math.round(2.55 * percent);
    
    const newR = Math.min(255, r + amount);
    const newG = Math.min(255, g + amount);
    const newB = Math.min(255, b + amount);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * 變暗顏色
 */
function darkenColor(color, percent) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const amount = Math.round(2.55 * percent);
    
    const newR = Math.max(0, r - amount);
    const newG = Math.max(0, g - amount);
    const newB = Math.max(0, b - amount);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * 數字格式化（添加千分位分隔符）
 */
function formatNumber(num) {
    if (num === null || num === undefined || num === '') return '0';
    
    // 處理字串輸入
    if (typeof num === 'string') {
        num = parseFloat(num.replace(/,/g, ''));
    }
    
    // 處理小數
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    
    // 處理特殊情況
    if (number === 0) return '0';
    if (!isFinite(number)) return '∞';
    
    // 如果是整數，使用千分位分隔符
    if (Number.isInteger(number)) {
        return number.toLocaleString('zh-TW');
    }
    
    // 如果是小數，保留適當位數
    if (Math.abs(number) >= 1) {
        return number.toLocaleString('zh-TW', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    } else {
        // 小於 1 的數字，保留更多位數
        return number.toLocaleString('zh-TW', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4
        });
    }
}

/**
 * 格式化百分比
 */
function formatPercentage(value, total) {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
}

/**
 * 格式化時間
 */
function formatTime(hours) {
    if (hours < 24) {
        return `${Math.floor(hours)} 小時`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    
    if (remainingHours === 0) {
        return `${days} 天`;
    }
    
    return `${days} 天 ${remainingHours} 小時`;
}

/**
 * 獲取項目名稱
 */
function getItemName(categoryKey, itemIndex) {
    const itemNames = {
        gear: [
            '武器', '副武器', '頭盔', '鎧甲', '戰靴'
        ],
        skill: [
            '技能1', '技能2', '技能3', '技能4', 
            '技能5', '技能6', '技能7', '技能8'
        ],
        relic: [
            '古遺物1', '古遺物2', '古遺物3', '古遺物4', '古遺物5',
            '古遺物6', '古遺物7', '古遺物8', '古遺物9', '古遺物10',
            '古遺物11', '古遺物12', '古遺物13', '古遺物14', '古遺物15',
            '古遺物16', '古遺物17', '古遺物18', '古遺物19', '古遺物20'
        ],
        pet: [
            '幻獸1', '幻獸2', '幻獸3', '幻獸4'
        ]
    };
    
    const names = itemNames[categoryKey];
    return names && names[itemIndex] ? names[itemIndex] : `${categoryKey}${itemIndex + 1}`;
}

/**
 * 深度複製對象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * 驗證輸入資料
 */
function validateInputs() {
    const errors = [];
    
    // 檢查賽季選擇
    const seasonId = document.getElementById('seasonSelect').value;
    if (!seasonId) {
        errors.push('請選擇賽季');
    }
    
    // 檢查日期
    const releaseDate = document.getElementById('releaseDate').value;
    const currentDate = document.getElementById('currentDate').value;
    
    if (!releaseDate) {
        errors.push('請設定賽季開始日期');
    }
    
    if (!currentDate) {
        errors.push('請設定當前日期');
    }
    
    if (releaseDate && currentDate && new Date(currentDate) < new Date(releaseDate)) {
        errors.push('當前日期不能早於賽季開始日期');
    }
    
    // 檢查體力資源選擇
    if (!window.selectedStaminaResource) {
        errors.push('請選擇體力刷取的資源類型');
    }
    
    // 檢查數字輸入的合理性
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (value < 0) {
            errors.push(`${input.previousElementSibling?.textContent || '某個欄位'} 不能為負數`);
        }
        if (value > 999999999) {
            errors.push(`${input.previousElementSibling?.textContent || '某個欄位'} 數值過大`);
        }
    });
    
    return errors;
}

/**
 * 顯示錯誤訊息
 */
function showErrors(errors) {
    if (errors.length === 0) return;
    
    const errorMessage = errors.join('\n');
    
    // 嘗試使用更友善的錯誤顯示方式
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: '輸入錯誤',
            text: errorMessage,
            confirmButtonText: '確定'
        });
    } else {
        alert(`請修正以下問題：\n\n${errorMessage}`);
    }
}

/**
 * 清空結果
 */
function clearResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('fade-in');
}

/**
 * 滾動到元素
 */
function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * 載入中狀態
 */
function setLoadingState(isLoading) {
    const button = document.getElementById('calculateBtn');
    
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner me-2"></span>計算中...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-calculator me-2"></i>開始計算';
        button.classList.remove('loading');
    }
}

/**
 * 本地儲存工具
 */
const LocalStorage = {
    /**
     * 儲存資料
     */
    save: function(key, data) {
        try {
            localStorage.setItem(`upgradeCalculator_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('無法儲存到本地儲存:', e);
            return false;
        }
    },
    
    /**
     * 載入資料
     */
    load: function(key) {
        try {
            const data = localStorage.getItem(`upgradeCalculator_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('無法從本地儲存載入:', e);
            return null;
        }
    },
    
    /**
     * 刪除資料
     */
    remove: function(key) {
        try {
            localStorage.removeItem(`upgradeCalculator_${key}`);
            return true;
        } catch (e) {
            console.warn('無法從本地儲存刪除:', e);
            return false;
        }
    },
    
    /**
     * 清空所有計算器相關資料
     */
    clear: function() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('upgradeCalculator_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.warn('無法清空本地儲存:', e);
            return false;
        }
    }
};

/**
 * 自動儲存設定
 */
function autoSaveSettings() {
    const settings = extractSettings();
    LocalStorage.save('autoSave', settings);
}

/**
 * 載入自動儲存的設定
 */
function loadAutoSaveSettings() {
    const settings = LocalStorage.load('autoSave');
    if (settings) {
        applySettings(settings);
    }
}

/**
 * 匯出設定為 JSON
 */
function exportSettings() {
    const settings = extractSettings();
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `upgrade_settings_${settings.seasonId || 'unknown'}_${timestamp}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 清理 URL
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/**
 * 匯入設定
 */
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                // 驗證設定檔格式
                if (!validateSettingsFormat(settings)) {
                    throw new Error('設定檔格式不正確');
                }
                
                applySettings(settings);
                
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: '匯入成功',
                        text: '設定已成功匯入並套用',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    alert('設定匯入成功！');
                }
            } catch (error) {
                console.error('匯入設定失敗:', error);
                
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: '匯入失敗',
                        text: '設定檔案格式錯誤或已損壞',
                        confirmButtonText: '確定'
                    });
                } else {
                    alert('設定檔案格式錯誤！');
                }
            }
        };
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

/**
 * 驗證設定檔格式
 */
function validateSettingsFormat(settings) {
    if (!settings || typeof settings !== 'object') return false;
    
    const requiredFields = ['seasonId', 'releaseDate', 'currentDate'];
    return requiredFields.every(field => settings.hasOwnProperty(field));
}

/**
 * 提取當前設定
 */
function extractSettings() {
    const settings = {
        seasonId: document.getElementById('seasonSelect')?.value || '',
        releaseDate: document.getElementById('releaseDate')?.value || '',
        currentDate: document.getElementById('currentDate')?.value || '',
        buyDailyDeal: document.getElementById('buyDailyDeal')?.checked || false,
        selectedStaminaResource: window.selectedStaminaResource || null,
        cartProduction: extractCartProduction(),
        secretRealmTools: extractSecretRealmTools(),
        bondAdventure: extractBondAdventure(),
        currentResources: extractCurrentResources(),
        upgradeGoals: extractUpgradeGoals(),
        timestamp: new Date().toISOString()
    };
    
    return settings;
}

/**
 * 提取現有資源設定
 */
function extractCurrentResources() {
    return {
        gold: document.getElementById('currentGold')?.value || '0',
        refinedStone: document.getElementById('currentRefinedStone')?.value || '0',
        hourglass: document.getElementById('currentHourglass')?.value || '0',
        hourglassRare: document.getElementById('currentHourglassRare')?.value || '0',
        hourglassEpic: document.getElementById('currentHourglassEpic')?.value || '0',
        battleEssence: document.getElementById('currentBattleEssence')?.value || '0',
        freezeDriedNormal: document.getElementById('currentFreezeDriedNormal')?.value || '0',
        freezeDriedPremium: document.getElementById('currentFreezeDriedPremium')?.value || '0',
        freezeDriedDeluxe: document.getElementById('currentFreezeDriedDeluxe')?.value || '0'
    };
}

/**
 * 提取推車產出設定
 */
function extractCartProduction() {
    return {
        gold: document.getElementById('cartGold')?.value || '0',
        refinedStone: document.getElementById('cartRefinedStone')?.value || '0',
        hourglass: document.getElementById('cartHourglass')?.value || '0',
        battleEssence: document.getElementById('cartBattleEssence')?.value || '0',
        freezeDried: document.getElementById('cartFreezeDried')?.value || '0'
    };
}

/**
 * 提取秘境工具設定
 */
function extractSecretRealmTools() {
    const tools = {};
    
    if (currentUpgradeData && currentUpgradeData.secret_realm) {
        currentUpgradeData.secret_realm.resources.forEach(resource => {
            const element = document.getElementById(`tool${resource.key}`);
            if (element) {
                tools[resource.key] = element.value || '0';
            }
        });
    }
    
    return tools;
}

/**
 * 提取羈絆冒險設定
 */
function extractBondAdventure() {
    const bondData = {};
    
    if (currentSeasonData && currentSeasonData.bond_adventure?.bond_adventure_enabled) {
        currentSeasonData.bond_adventure.rewards.forEach(reward => {
            const element = document.getElementById(`bond${reward.type}`);
            if (element) {
                bondData[reward.type] = element.value || '0';
            }
        });
    }
    
    return bondData;
}

/**
 * 提取升級目標
 */
function extractUpgradeGoals() {
    const goals = {};
    
    if (!currentUpgradeData) return goals;
    
    Object.keys(currentUpgradeData.categories).forEach(categoryKey => {
        const itemCount = getItemCount(categoryKey);
        goals[categoryKey] = [];
        
        for (let i = 0; i < itemCount; i++) {
            const startElement = document.getElementById(`${categoryKey}Item${i}Start`);
            const endElement = document.getElementById(`${categoryKey}Item${i}End`);
            
            if (startElement && endElement) {
                goals[categoryKey].push({
                    start: parseInt(startElement.value) || 1,
                    end: parseInt(endElement.value) || 1
                });
            }
        }
    });
    
    return goals;
}

/**
 * 套用設定
 */
function applySettings(settings) {
    // 套用基本設定
    if (settings.seasonId) {
        const seasonSelect = document.getElementById('seasonSelect');
        if (seasonSelect) {
            seasonSelect.value = settings.seasonId;
            handleSeasonChange();
        }
    }
    
    if (settings.releaseDate) {
        const releaseDateInput = document.getElementById('releaseDate');
        if (releaseDateInput) {
            releaseDateInput.value = settings.releaseDate;
        }
    }
    
    if (settings.currentDate) {
        const currentDateInput = document.getElementById('currentDate');
        if (currentDateInput) {
            currentDateInput.value = settings.currentDate;
        }
    }
    
    if (settings.buyDailyDeal !== undefined) {
        const buyDailyDealInput = document.getElementById('buyDailyDeal');
        if (buyDailyDealInput) {
            buyDailyDealInput.checked = settings.buyDailyDeal;
        }
    }
    
    // 等待 DOM 更新後套用其他設定
    setTimeout(() => {
        applyAdvancedSettings(settings);
    }, 500);
}

/**
 * 套用進階設定
 */
function applyAdvancedSettings(settings) {
    // 套用體力資源選擇
    if (settings.selectedStaminaResource) {
        selectStaminaResource(settings.selectedStaminaResource);
    }
    
    // 套用推車產出設定
    if (settings.cartProduction) {
        applyCartProductionSettings(settings.cartProduction);
    }
    
    // 套用秘境工具設定
    if (settings.secretRealmTools) {
        applySecretRealmToolsSettings(settings.secretRealmTools);
    }
    
    // 套用羈絆冒險設定
    if (settings.bondAdventure) {
        applyBondAdventureSettings(settings.bondAdventure);
    }
    
    // 套用現有資源設定
    if (settings.currentResources) {
        applyCurrentResourcesSettings(settings.currentResources);
    }

    // 套用升級目標
    if (settings.upgradeGoals) {
        applyUpgradeGoals(settings.upgradeGoals);
    }
}

/**
 * 套用現有資源設定
 */
function applyCurrentResourcesSettings(currentResources) {
    const mapping = {
        gold: 'currentGold',
        refinedStone: 'currentRefinedStone',
        hourglass: 'currentHourglass',
        hourglassRare: 'currentHourglassRare',
        hourglassEpic: 'currentHourglassEpic',
        battleEssence: 'currentBattleEssence',
        freezeDriedNormal: 'currentFreezeDriedNormal',
        freezeDriedPremium: 'currentFreezeDriedPremium',
        freezeDriedDeluxe: 'currentFreezeDriedDeluxe'
    };

    Object.keys(mapping).forEach(key => {
        const element = document.getElementById(mapping[key]);
        if (element && currentResources[key] !== undefined) {
            element.value = currentResources[key];
        }
    });
}

/**
 * 套用推車產出設定
 */
function applyCartProductionSettings(cartProduction) {
    const mapping = {
        gold: 'cartGold',
        refinedStone: 'cartRefinedStone',
        hourglass: 'cartHourglass',
        battleEssence: 'cartBattleEssence',
        freezeDried: 'cartFreezeDried'
    };
    
    Object.keys(mapping).forEach(key => {
        const element = document.getElementById(mapping[key]);
        if (element && cartProduction[key] !== undefined) {
            element.value = cartProduction[key];
        }
    });
}

/**
 * 套用秘境工具設定
 */
function applySecretRealmToolsSettings(tools) {
    Object.keys(tools).forEach(resourceKey => {
        const element = document.getElementById(`tool${resourceKey}`);
        if (element) {
            element.value = tools[resourceKey];
        }
    });
}

/**
 * 套用羈絆冒險設定
 */
function applyBondAdventureSettings(bondData) {
    Object.keys(bondData).forEach(type => {
        const element = document.getElementById(`bond${type}`);
        if (element) {
            element.value = bondData[type];
        }
    });
}

/**
 * 套用升級目標
 */
function applyUpgradeGoals(goals) {
    Object.keys(goals).forEach(categoryKey => {
        const categoryGoals = goals[categoryKey];
        
        categoryGoals.forEach((goal, index) => {
            const startElement = document.getElementById(`${categoryKey}Item${index}Start`);
            const endElement = document.getElementById(`${categoryKey}Item${index}End`);
            
            if (startElement && endElement) {
                startElement.value = goal.start;
                endElement.value = goal.end;
            }
        });
        
        // 更新平均等級顯示
        updateCategoryAverage(categoryKey);
    });
}

/**
 * 檢查瀏覽器相容性
 */
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof(Storage) !== 'undefined',
        fetch: typeof(fetch) !== 'undefined',
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        arrow_functions: (() => true)(),
        template_literals: `test` === 'test'
    };
    
    const unsupported = Object.keys(features).filter(feature => !features[feature]);
    
    if (unsupported.length > 0) {
        console.warn('瀏覽器不支援以下功能:', unsupported);
        
        // 如果是關鍵功能，顯示警告
        if (!features.localStorage) {
            console.warn('瀏覽器不支援本地儲存，設定將無法儲存');
        }
    }
    
    return unsupported.length === 0;
}

/**
 * 節流函數
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * 防抖函數
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * 安全的 JSON 解析
 */
function safeJsonParse(str, defaultValue = null) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.warn('JSON 解析失敗:', e);
        return defaultValue;
    }
}

/**
 * 生成唯一 ID
 */
function generateUniqueId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 檢查是否為行動裝置
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 複製文字到剪貼簿
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 備用方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('複製到剪貼簿失敗:', error);
        return false;
    }
}

/**
 * 顯示通知訊息
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 自動移除
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

/**
 * 格式化日期
 */
function formatDate(date) {
    if (!date || !(date instanceof Date)) return '-';
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}/${month}/${day} (${weekday})`;
}

/**
 * 格式化日期時間
 */
function formatDateTime(date) {
    if (!date || !(date instanceof Date)) return '-';
    
    const dateStr = formatDate(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${dateStr} ${hours}:${minutes}`;
}

/**
 * 初始化時檢查相容性
 */
document.addEventListener('DOMContentLoaded', function() {
    checkBrowserCompatibility();
    
    // 載入自動儲存的設定
    if (LocalStorage.load('enableAutoSave') !== false) {
        loadAutoSaveSettings();
    }
    
    // 綁定自動儲存事件（節流）
    const autoSaveThrottled = throttle(autoSaveSettings, 5000);
    
    document.addEventListener('input', autoSaveThrottled);
    document.addEventListener('change', autoSaveThrottled);
});

/**
 * 處理全域錯誤
 */
window.addEventListener('error', function(event) {
    console.error('全域錯誤:', event.error);
    
    // 在開發環境顯示詳細錯誤
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        showNotification(`發生錯誤: ${event.error.message}`, 'danger', 5000);
    }
});

/**
 * 處理未捕獲的 Promise 拒絕
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('未處理的 Promise 拒絕:', event.reason);
    
    // 防止錯誤傳播
    event.preventDefault();
});

/**
 * 頁面可見性變化處理
 */
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // 頁面重新可見時，可以檢查是否需要更新時間等
        const currentDateInput = document.getElementById('currentDate');
        if (currentDateInput && !currentDateInput.value) {
            setCurrentDateTime();
        }
    }
});

/**
 * 鍵盤快捷鍵處理
 */
document.addEventListener('keydown', function(event) {
    // Ctrl+S 或 Cmd+S 匯出設定
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        exportSettings();
    }
    
    // Ctrl+O 或 Cmd+O 匯入設定
    if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
        event.preventDefault();
        importSettings();
    }
    
    // Enter 鍵觸發計算（如果焦點在計算器範圍內）
    if (event.key === 'Enter' && event.target.closest('.upgrade-calculator')) {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn && !calculateBtn.disabled) {
            calculateBtn.click();
        }
    }
});

// 為全域使用導出一些工具函數
window.UpgradeUtils = {
    formatNumber,
    formatPercentage,
    formatTime,
    showNotification,
    copyToClipboard,
    exportSettings,
    importSettings,
    LocalStorage
};