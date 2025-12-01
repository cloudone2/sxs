// 資源升級計算器輔助函數庫
// Utility Functions for Resource Upgrade Calculator

/**
 * 數字格式化函數 - 添加千分位分隔符
 * @param {number} num - 要格式化的數字
 * @param {number} decimals - 小數位數，默認為0
 * @returns {string} 格式化後的數字字符串
 */
function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    
    // 處理大數字的簡化顯示
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 100000) {
        return (num / 1000).toFixed(0) + 'K';
    } else if (num >= 10000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    // 標準千分位格式化
    return num.toLocaleString('zh-TW', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 更新賽季主題顏色
 * @param {string} seasonId - 賽季ID (s1, s2, s3, s4...)
 * @param {string} themeColor - 主題色彩值 (#hexcode)
 */
function updateSeasonTheme(seasonId, themeColor) {
    // 移除舊的主題類別
    document.body.classList.remove('theme-s1', 'theme-s2', 'theme-s3', 'theme-s4');
    
    // 添加新的主題類別
    document.body.classList.add(`theme-${seasonId}`);
    
    // 動態設置CSS自定義屬性
    const root = document.documentElement;
    if (themeColor) {
        const secondaryColor = darkenColor(themeColor, 15);
        root.style.setProperty('--primary-color', themeColor);
        root.style.setProperty('--secondary-color', secondaryColor);
    }
    
    // 添加主題切換動畫
    document.body.style.transition = 'all 0.3s ease-in-out';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

/**
 * 顏色加深函數
 * @param {string} color - 十六進制顏色值 (#hexcode)
 * @param {number} percent - 加深百分比 (0-100)
 * @returns {string} 加深後的顏色值
 */
function darkenColor(color, percent) {
    // 移除 # 符號
    const hex = color.replace('#', '');
    
    // 轉換為RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 計算加深後的值
    const factor = (100 - percent) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    // 轉換回十六進制
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * 顏色變亮函數
 * @param {string} color - 十六進制顏色值 (#hexcode)
 * @param {number} percent - 變亮百分比 (0-100)
 * @returns {string} 變亮後的顏色值
 */
function lightenColor(color, percent) {
    const hex = color.replace('#', '');
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = percent / 100;
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    
    const toHex = (c) => {
        const hex = Math.min(255, c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * 獲取本地化的物品名稱
 * @param {string} category - 類別 (gear, skill, relic, pet)
 * @param {number} index - 物品索引
 * @param {string} lang - 語言 (zh, en)
 * @returns {string} 本地化名稱
 */
function getItemName(category, index, lang = 'zh') {
    const itemNames = {
        zh: {
            gear: [
                '武器', '頭盔', '胸甲', '護腿', '靴子'
            ],
            skill: [
                '基礎攻擊', '防禦技能', '治療術', '強化技能',
                '特殊攻擊', '輔助技能', '終極技能', '被動技能'
            ],
            relic: [
                '攻擊古遺物1', '攻擊古遺物2', '攻擊古遺物3', '攻擊古遺物4', '攻擊古遺物5',
                '防禦古遺物1', '防禦古遺物2', '防禦古遺物3', '防禦古遺物4', '防禦古遺物5',
                '輔助古遺物1', '輔助古遺物2', '輔助古遺物3', '輔助古遺物4', '輔助古遺物5',
                '特殊古遺物1', '特殊古遺物2', '特殊古遺物3', '特殊古遺物4', '特殊古遺物5'
            ],
            pet: [
                '火屬性幻獸', '水屬性幻獸', '風屬性幻獸', '土屬性幻獸'
            ]
        },
        en: {
            gear: [
                'Weapon', 'Helmet', 'Chest Armor', 'Leg Guard', 'Boots'
            ],
            skill: [
                'Basic Attack', 'Defense Skill', 'Healing', 'Enhancement',
                'Special Attack', 'Support Skill', 'Ultimate Skill', 'Passive Skill'
            ],
            relic: [
                'Attack Relic 1', 'Attack Relic 2', 'Attack Relic 3', 'Attack Relic 4', 'Attack Relic 5',
                'Defense Relic 1', 'Defense Relic 2', 'Defense Relic 3', 'Defense Relic 4', 'Defense Relic 5',
                'Support Relic 1', 'Support Relic 2', 'Support Relic 3', 'Support Relic 4', 'Support Relic 5',
                'Special Relic 1', 'Special Relic 2', 'Special Relic 3', 'Special Relic 4', 'Special Relic 5'
            ],
            pet: [
                'Fire Pet', 'Water Pet', 'Wind Pet', 'Earth Pet'
            ]
        }
    };
    
    const categoryNames = itemNames[lang] && itemNames[lang][category];
    if (categoryNames && categoryNames[index - 1]) {
        return categoryNames[index - 1];
    }
    
    // 回退到默認命名
    const categoryLabels = {
        zh: { gear: '裝備', skill: '技能', relic: '古遺物', pet: '幻獸' },
        en: { gear: 'Gear', skill: 'Skill', relic: 'Relic', pet: 'Pet' }
    };
    
    const categoryLabel = categoryLabels[lang] && categoryLabels[lang][category] || category;
    return `${categoryLabel} ${index}`;
}

/**
 * 時間格式化函數
 * @param {Date|string} date - 日期對象或字符串
 * @param {string} format - 格式 (datetime, date, time)
 * @returns {string} 格式化後的時間字符串
 */
function formatDateTime(date, format = 'datetime') {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const options = {
        datetime: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        date: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    };
    
    return dateObj.toLocaleDateString('zh-TW', options[format]);
}

/**
 * 時間差計算函數
 * @param {Date|string} startDate - 開始時間
 * @param {Date|string} endDate - 結束時間
 * @returns {object} 時間差對象 {days, hours, minutes, totalHours, totalMinutes}
 */
function calculateTimeDifference(startDate, endDate) {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
    }
    
    const diffMs = end.getTime() - start.getTime();
    
    if (diffMs < 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            totalHours: 0,
            totalMinutes: 0,
            isNegative: true
        };
    }
    
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return {
        days,
        hours,
        minutes,
        totalHours: Math.floor(diffMs / (60 * 60 * 1000)),
        totalMinutes: Math.floor(diffMs / (60 * 1000)),
        isNegative: false
    };
}

/**
 * 深度克隆對象
 * @param {any} obj - 要克隆的對象
 * @returns {any} 克隆後的對象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
}

/**
 * 本地存儲管理
 */
const LocalStorage = {
    /**
     * 設置本地存儲項目
     * @param {string} key - 鍵名
     * @param {any} value - 值
     */
    set(key, value) {
        try {
            const data = {
                value: value,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(`upgrade-calc-${key}`, JSON.stringify(data));
        } catch (error) {
            console.warn('無法設置本地存儲:', error);
        }
    },
    
    /**
     * 獲取本地存儲項目
     * @param {string} key - 鍵名
     * @param {any} defaultValue - 默認值
     * @returns {any} 存儲的值或默認值
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`upgrade-calc-${key}`);
            if (!item) return defaultValue;
            
            const data = JSON.parse(item);
            return data.value;
        } catch (error) {
            console.warn('無法讀取本地存儲:', error);
            return defaultValue;
        }
    },
    
    /**
     * 移除本地存儲項目
     * @param {string} key - 鍵名
     */
    remove(key) {
        try {
            localStorage.removeItem(`upgrade-calc-${key}`);
        } catch (error) {
            console.warn('無法移除本地存儲:', error);
        }
    },
    
    /**
     * 清除所有計算器相關的本地存儲
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('upgrade-calc-')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('無法清除本地存儲:', error);
        }
    }
};

/**
 * 數據驗證函數
 */
const Validator = {
    /**
     * 驗證是否為正整數
     * @param {any} value - 要驗證的值
     * @returns {boolean} 驗證結果
     */
    isPositiveInteger(value) {
        return Number.isInteger(value) && value > 0;
    },
    
    /**
     * 驗證是否為非負整數
     * @param {any} value - 要驗證的值
     * @returns {boolean} 驗證結果
     */
    isNonNegativeInteger(value) {
        return Number.isInteger(value) && value >= 0;
    },
    
    /**
     * 驗證等級範圍
     * @param {number} level - 等級值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {boolean} 驗證結果
     */
    isValidLevel(level, min = 1, max = 999) {
        return this.isPositiveInteger(level) && level >= min && level <= max;
    },
    
    /**
     * 驗證日期
     * @param {any} date - 日期值
     * @returns {boolean} 驗證結果
     */
    isValidDate(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return !isNaN(dateObj.getTime());
    }
};

/**
 * 動畫和UI效果函數
 */
const UIEffects = {
    /**
     * 滾動到指定元素
     * @param {string|Element} element - 元素選擇器或DOM元素
     * @param {object} options - 滾動選項
     */
    scrollTo(element, options = {}) {
        const targetElement = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options
            });
        }
    },
    
    /**
     * 添加閃爍效果
     * @param {string|Element} element - 元素選擇器或DOM元素
     * @param {string} className - CSS類名
     * @param {number} duration - 持續時間（毫秒）
     */
    flash(element, className = 'flash', duration = 1000) {
        const targetElement = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (targetElement) {
            targetElement.classList.add(className);
            setTimeout(() => {
                targetElement.classList.remove(className);
            }, duration);
        }
    },
    
    /**
     * 顯示載入動畫
     * @param {string|Element} element - 目標元素
     * @param {boolean} show - 是否顯示
     */
    showLoading(element, show = true) {
        const targetElement = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;
            
        if (targetElement) {
            if (show) {
                targetElement.classList.add('loading');
            } else {
                targetElement.classList.remove('loading');
            }
        }
    }
};

/**
 * 錯誤處理和日誌記錄
 */
const Logger = {
    /**
     * 記錄訊息
     * @param {string} message - 訊息內容
     * @param {string} level - 日誌等級 (info, warn, error)
     * @param {any} data - 額外數據
     */
    log(message, level = 'info', data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };
        
        // 輸出到控制台
        switch (level) {
            case 'warn':
                console.warn(`[${timestamp}] ${message}`, data);
                break;
            case 'error':
                console.error(`[${timestamp}] ${message}`, data);
                break;
            default:
                console.log(`[${timestamp}] ${message}`, data);
        }
        
        // 可以擴展為發送到服務器或本地存儲
    },
    
    /**
     * 記錄錯誤
     * @param {Error|string} error - 錯誤對象或訊息
     * @param {any} context - 上下文信息
     */
    error(error, context = null) {
        const message = error instanceof Error ? error.message : error;
        const data = {
            error: error instanceof Error ? error.stack : error,
            context
        };
        this.log(message, 'error', data);
    }
};

/**
 * 數據導出/導入功能
 */
const DataManager = {
    /**
     * 導出當前設定為JSON
     * @returns {string} JSON字符串
     */
    exportSettings() {
        try {
            const settings = {
                season: document.getElementById('seasonSelect')?.value,
                startTime: document.getElementById('startDateTime')?.value,
                currentTime: document.getElementById('currentDateTime')?.value,
                buyDailyDeal: document.getElementById('buyDailyDeal')?.checked,
                cartProduction: this.getCartSettings(),
                toolCounts: this.getToolSettings(),
                upgradeGoals: this.getUpgradeSettings(),
                exportTime: new Date().toISOString()
            };
            
            return JSON.stringify(settings, null, 2);
        } catch (error) {
            Logger.error('導出設定失敗', error);
            return null;
        }
    },
    
    /**
     * 從JSON導入設定
     * @param {string} jsonString - JSON字符串
     * @returns {boolean} 是否成功
     */
    importSettings(jsonString) {
        try {
            const settings = JSON.parse(jsonString);
            
            // 設置基本選項
            if (settings.season) {
                const seasonSelect = document.getElementById('seasonSelect');
                if (seasonSelect) seasonSelect.value = settings.season;
            }
            
            if (settings.startTime) {
                const startDateTime = document.getElementById('startDateTime');
                if (startDateTime) startDateTime.value = settings.startTime;
            }
            
            if (settings.currentTime) {
                const currentDateTime = document.getElementById('currentDateTime');
                if (currentDateTime) currentDateTime.value = settings.currentTime;
            }
            
            if (typeof settings.buyDailyDeal === 'boolean') {
                const buyDailyDeal = document.getElementById('buyDailyDeal');
                if (buyDailyDeal) buyDailyDeal.checked = settings.buyDailyDeal;
            }
            
            // 設置推車產量
            if (settings.cartProduction) {
                this.setCartSettings(settings.cartProduction);
            }
            
            // 設置工具數量
            if (settings.toolCounts) {
                this.setToolSettings(settings.toolCounts);
            }
            
            // 設置升級目標
            if (settings.upgradeGoals) {
                this.setUpgradeSettings(settings.upgradeGoals);
            }
            
            return true;
        } catch (error) {
            Logger.error('導入設定失敗', error);
            return false;
        }
    },
    
    /**
     * 獲取推車設定
     */
    getCartSettings() {
        const settings = {};
        ['gold', 'refined_stone', 'hourglass', 'battle_essence', 'freeze_dried'].forEach(resource => {
            const input = document.getElementById(`cart_${resource}`);
            if (input) settings[resource] = parseInt(input.value) || 0;
        });
        return settings;
    },
    
    /**
     * 設置推車設定
     */
    setCartSettings(settings) {
        Object.keys(settings).forEach(resource => {
            const input = document.getElementById(`cart_${resource}`);
            if (input) input.value = settings[resource] || 0;
        });
    },
    
    /**
     * 獲取工具設定
     */
    getToolSettings() {
        const settings = {};
        ['gold', 'refined_stone', 'hourglass', 'battle_essence'].forEach(resource => {
            const input = document.getElementById(`tool_${resource}`);
            if (input) settings[resource] = parseInt(input.value) || 0;
        });
        return settings;
    },
    
    /**
     * 設置工具設定
     */
    setToolSettings(settings) {
        Object.keys(settings).forEach(resource => {
            const input = document.getElementById(`tool_${resource}`);
            if (input) input.value = settings[resource] || 0;
        });
    },
    
    /**
     * 獲取升級設定
     */
    getUpgradeSettings() {
        const settings = {};
        ['gear', 'skill', 'relic', 'pet'].forEach(category => {
            const container = document.getElementById(`${category}Items`);
            if (container) {
                settings[category] = [];
                const startInputs = container.querySelectorAll('.start-level');
                const targetInputs = container.querySelectorAll('.target-level');
                
                startInputs.forEach((startInput, index) => {
                    const targetInput = targetInputs[index];
                    settings[category].push({
                        start: parseInt(startInput.value) || 0,
                        target: parseInt(targetInput?.value) || 0
                    });
                });
            }
        });
        return settings;
    },
    
    /**
     * 設置升級設定
     */
    setUpgradeSettings(settings) {
        Object.keys(settings).forEach(category => {
            const container = document.getElementById(`${category}Items`);
            if (container && settings[category]) {
                const startInputs = container.querySelectorAll('.start-level');
                const targetInputs = container.querySelectorAll('.target-level');
                
                settings[category].forEach((item, index) => {
                    if (startInputs[index]) startInputs[index].value = item.start || 0;
                    if (targetInputs[index]) targetInputs[index].value = item.target || 0;
                });
            }
        });
    }
};

/**
 * 瀏覽器兼容性檢查
 */
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        jsonSupport: typeof JSON !== 'undefined',
        dateSupport: !isNaN(new Date().getTime()),
        es6Support: typeof Symbol !== 'undefined'
    };
    
    const missingFeatures = Object.keys(features).filter(key => !features[key]);
    
    if (missingFeatures.length > 0) {
        console.warn('瀏覽器可能不支援以下功能:', missingFeatures);
        return false;
    }
    
    return true;
}

/**
 * 初始化輔助函數
 */
function initializeUtils() {
    // 檢查瀏覽器兼容性
    if (!checkBrowserCompatibility()) {
        console.warn('瀏覽器兼容性檢查失敗，部分功能可能無法正常運作');
    }
    
    // 添加全局錯誤處理
    window.addEventListener('error', function(e) {
        Logger.error('全局錯誤', {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno
        });
    });
    
    // 添加未處理的Promise錯誤處理
    window.addEventListener('unhandledrejection', function(e) {
        Logger.error('未處理的Promise錯誤', e.reason);
    });
}

// 自動初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeUtils);
}

// 導出函數供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        updateSeasonTheme,
        darkenColor,
        lightenColor,
        getItemName,
        formatDateTime,
        calculateTimeDifference,
        deepClone,
        LocalStorage,
        Validator,
        UIEffects,
        Logger,
        DataManager
    };
}