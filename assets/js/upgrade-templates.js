// 資源升級計算器 HTML 模板生成器
// HTML Template Renderer for Resource Upgrade Calculator

/**
 * 生成完整的計算結果HTML
 */
function generateResultsHTML(results, season, timeData) {
    if (!results || !season || !timeData) {
        return '<div class="alert alert-danger">計算數據不完整，請重新計算</div>';
    }

    return `
        <div class="results-container fade-in">
            ${renderResultsHeader(season, timeData)}
            ${renderStaminaSummary(results.stamina, timeData)}
            ${renderStaminaUsageSummary(results)}
            ${renderProductionSummary(results.production)}
            ${renderUpgradeRequirementsSummary(results.needs)}
            ${generateResourceComparison(results)}
        </div>
    `;
}

/**
 * 渲染結果標題區塊
 */
function renderResultsHeader(season, timeData) {
    return `
        <div class="card result-header-card">
            <div class="result-header">
                <h2><i class="fas fa-chart-line"></i> ${season.title} - 計算結果</h2>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 text-center">
                        <div class="result-stat">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${timeData.remainingDays}</div>
                            <div class="stat-label">剩餘天數</div>
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <div class="result-stat">
                            <div class="stat-icon">⏰</div>
                            <div class="stat-value">${timeData.remainingHours}</div>
                            <div class="stat-label">剩餘小時</div>
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <div class="result-stat">
                            <div class="stat-icon">🏁</div>
                            <div class="stat-value">${timeData.totalRemainingHours}</div>
                            <div class="stat-label">總剩餘小時</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染體力計算摘要
 */
function renderStaminaSummary(staminaData, timeData) {
    if (!staminaData) return '';

    return `
        <div class="card result-card">
            <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#staminaDetails">
                <h4><i class="fas fa-bolt"></i> 體力計算詳情 <i class="fas fa-chevron-down toggle-icon"></i></h4>
            </div>
            <div class="card-body collapse show" id="staminaDetails">
                <div class="info-block">
                    <h6><i class="fas fa-info-circle"></i> 體力來源明細</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <ul class="info-list">
                                <li><strong>自然恢復:</strong> <span class="number">${formatNumber(staminaData.natural)}</span> 
                                    <small class="text-muted">(${timeData.totalRemainingHours}小時 × 5體力/小時)</small></li>
                                <li><strong>每日任務:</strong> <span class="number">${formatNumber(Math.floor(staminaData.dailyBonus * 0.4))}</span> 
                                    <small class="text-muted">(${timeData.remainingDays}天 × 20體力/天)</small></li>
                                <li><strong>商店寶庫:</strong> <span class="number">${formatNumber(Math.floor(staminaData.dailyBonus * 0.6))}</span> 
                                    <small class="text-muted">(${timeData.remainingDays}天 × 30體力/天)</small></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="info-list">
                                <li><strong>加速體力:</strong> <span class="number">${formatNumber(staminaData.acceleration)}</span> 
                                    <small class="text-muted">(${timeData.remainingDays}天 × 2小時 × 5體力/小時)</small></li>
                                <li><strong>每日特惠:</strong> <span class="number">${formatNumber(staminaData.dailyDeal)}</span> 
                                    <small class="text-muted">${staminaData.dailyDeal > 0 ? `(${timeData.remainingDays}天 × 10體力/天)` : '(未購買)'}</small></li>
                                <li><strong class="highlight">總體力:</strong> <span class="number highlight">${formatNumber(staminaData.total)}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染體力使用摘要
 */
function renderStaminaUsageSummary(results) {
    if (!results.production.breakdown.stamina || Object.keys(results.production.breakdown.stamina).length === 0) {
        return `
            <div class="card result-card">
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> 未選擇體力優先刷取資源
                    </div>
                </div>
            </div>
        `;
    }

    const selectedResource = Object.keys(results.production.breakdown.stamina)[0];
    const production = results.production.breakdown.stamina[selectedResource];
    const totalStamina = results.stamina.total;
    const runsCount = Math.floor(totalStamina / 5);

    return `
        <div class="card result-card">
            <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#staminaUsage">
                <h4><i class="fas fa-zap"></i> 體力刷取產出 <i class="fas fa-chevron-down toggle-icon"></i></h4>
            </div>
            <div class="card-body collapse show" id="staminaUsage">
                <div class="info-block">
                    <h6><i class="fas fa-target"></i> 選定資源: ${getResourceName(selectedResource)}</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <ul class="info-list">
                                <li><strong>總體力:</strong> <span class="number">${formatNumber(totalStamina)}</span></li>
                                <li><strong>可刷次數:</strong> <span class="number">${formatNumber(runsCount)}</span> <small class="text-muted">(每次5體力)</small></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <ul class="info-list">
                                <li><strong>總產出:</strong> <span class="number highlight">${formatNumber(production)}</span></li>
                                <li><strong>剩餘體力:</strong> <span class="number">${totalStamina % 5}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染產出摘要
 */
function renderProductionSummary(productionData) {
    return `
        <div class="card result-card">
            <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#productionDetails">
                <h4><i class="fas fa-industry"></i> 資源產出明細 <i class="fas fa-chevron-down toggle-icon"></i></h4>
            </div>
            <div class="card-body collapse" id="productionDetails">
                ${renderCartProductionSummary(productionData.breakdown.cart)}
                ${renderSecretRealmSummary(productionData.breakdown.secretRealm)}
                ${renderBondAdventureSummary(productionData.breakdown.bondAdventure)}
                ${renderProductionTotals(productionData.total)}
            </div>
        </div>
    `;
}

/**
 * 渲染推車產出摘要
 */
function renderCartProductionSummary(cartData) {
    if (!cartData || Object.keys(cartData).length === 0) {
        return `
            <div class="info-block">
                <h6><i class="fas fa-cart-plus"></i> 推車掛機產出</h6>
                <p class="text-muted">未設定推車掛機產量</p>
            </div>
        `;
    }

    const resources = Object.entries(cartData).filter(([key, value]) => value > 0);

    return `
        <div class="info-block">
            <h6><i class="fas fa-cart-plus"></i> 推車掛機產出</h6>
            <div class="row">
                ${resources.map(([resourceKey, amount]) => `
                    <div class="col-md-6">
                        <div class="resource-item">
                            <span class="resource-icon">${getResourceIcon(resourceKey)}</span>
                            <span class="resource-name">${getResourceName(resourceKey)}:</span>
                            <span class="number">${formatNumber(amount)}</span>
                            ${resourceKey === 'freeze_dried' ? ' <small class="text-muted">EXP</small>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染秘境工具產出摘要
 */
function renderSecretRealmSummary(secretRealmData) {
    if (!secretRealmData || Object.keys(secretRealmData).length === 0) {
        return `
            <div class="info-block">
                <h6><i class="fas fa-tools"></i> 秘境工具產出</h6>
                <p class="text-muted">未設定秘境工具數量</p>
            </div>
        `;
    }

    const resources = Object.entries(secretRealmData).filter(([key, value]) => value > 0);

    return `
        <div class="info-block">
            <h6><i class="fas fa-tools"></i> 秘境工具產出</h6>
            <div class="row">
                ${resources.map(([resourceKey, amount]) => `
                    <div class="col-md-6">
                        <div class="resource-item">
                            <span class="resource-icon">${getResourceIcon(resourceKey)}</span>
                            <span class="resource-name">${getResourceName(resourceKey)}:</span>
                            <span class="number">${formatNumber(amount)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染羈絆冒險產出摘要
 */
function renderBondAdventureSummary(bondData) {
    if (!bondData || Object.keys(bondData).length === 0 || bondData.freeze_dried === 0) {
        return `
            <div class="info-block">
                <h6><i class="fas fa-users"></i> 羈絆冒險產出</h6>
                <p class="text-muted">此賽季無羈絆冒險或未設定獎勵</p>
            </div>
        `;
    }

    return `
        <div class="info-block">
            <h6><i class="fas fa-users"></i> 羈絆冒險產出</h6>
            <div class="resource-item">
                <span class="resource-icon">🥩</span>
                <span class="resource-name">凍乾經驗值:</span>
                <span class="number">${formatNumber(bondData.freeze_dried)}</span>
                <small class="text-muted">EXP</small>
            </div>
        </div>
    `;
}

/**
 * 渲染產出總計
 */
function renderProductionTotals(totalData) {
    const resources = Object.entries(totalData).filter(([key, value]) => value > 0);

    return `
        <div class="info-block">
            <h6><i class="fas fa-calculator"></i> 總產出匯總</h6>
            <div class="row">
                ${resources.map(([resourceKey, amount]) => `
                    <div class="col-md-6">
                        <div class="resource-item highlight">
                            <span class="resource-icon">${getResourceIcon(resourceKey)}</span>
                            <span class="resource-name">${getResourceName(resourceKey)}:</span>
                            <span class="number">${formatNumber(amount)}</span>
                            ${resourceKey === 'freeze_dried' ? ' <small class="text-muted">EXP</small>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染升級需求摘要
 */
function renderUpgradeRequirementsSummary(needs) {
    if (!needs || Object.keys(needs).length === 0) {
        return `
            <div class="card result-card">
                <div class="card-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> 未設定升級目標
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="card result-card">
            <div class="card-header collapsible" data-bs-toggle="collapse" data-bs-target="#upgradeNeeds">
                <h4><i class="fas fa-level-up-alt"></i> 升級需求明細 <i class="fas fa-chevron-down toggle-icon"></i></h4>
            </div>
            <div class="card-body collapse" id="upgradeNeeds">
                ${renderUpgradeNeedsTable(needs)}
                ${renderCategoryBreakdown()}
            </div>
        </div>
    `;
}

/**
 * 渲染升級需求表格
 */
function renderUpgradeNeedsTable(needs) {
    const resources = Object.entries(needs);

    return `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>資源類型</th>
                        <th>總需求量</th>
                        <th>格式化顯示</th>
                    </tr>
                </thead>
                <tbody>
                    ${resources.map(([resourceKey, amount]) => `
                        <tr>
                            <td>
                                <span class="resource-icon">${getResourceIcon(resourceKey)}</span>
                                ${getResourceName(resourceKey)}
                            </td>
                            <td class="number">${amount}</td>
                            <td class="number">${formatNumber(amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * 渲染類別明細分解（可選）
 */
function renderCategoryBreakdown() {
    // 這裡可以添加按類別顯示的升級需求分解
    // 需要從計算器實例中獲取更詳細的數據
    return `
        <div class="info-block">
            <h6><i class="fas fa-info-circle"></i> 升級需求說明</h6>
            <p class="text-muted">以上需求基於您設定的起始等級和目標等級計算得出。數據包含所有升級類別（裝備、技能、古遺物、幻獸）的總和。</p>
        </div>
    `;
}

/**
 * 生成資源對比卡片
 */
function generateResourceComparison(results) {
    const { production, needs, suggestions } = results;
    const allResources = new Set([
        ...Object.keys(production.total || {}),
        ...Object.keys(needs || {})
    ]);

    return `
        <div class="card result-card">
            <div class="result-header">
                <h4><i class="fas fa-balance-scale"></i> 資源對比與購買建議</h4>
            </div>
            <div class="card-body">
                <div class="resource-comparison">
                    ${Array.from(allResources).map(resourceKey => 
                        generateResourceCard(resourceKey, production.total[resourceKey] || 0, needs[resourceKey] || 0, suggestions[resourceKey])
                    ).join('')}
                </div>
                ${generatePurchaseSummary(suggestions)}
            </div>
        </div>
    `;
}

/**
 * 生成單個資源對比卡片
 */
function generateResourceCard(resourceKey, available, required, suggestion) {
    const deficit = Math.max(0, required - available);
    const surplus = Math.max(0, available - required);
    const isSufficient = available >= required;

    return `
        <div class="resource-card ${isSufficient ? 'sufficient' : 'insufficient'}">
            <div class="resource-card-icon">${getResourceIcon(resourceKey)}</div>
            <div class="resource-card-name">${getResourceName(resourceKey)}</div>
            
            <div class="resource-amounts">
                <div class="amount">
                    <span class="amount-label">可產出:</span>
                    <span class="amount-value number">${formatNumber(available)}</span>
                </div>
                <div class="amount">
                    <span class="amount-label">需求量:</span>
                    <span class="amount-value number">${formatNumber(required)}</span>
                </div>
                ${isSufficient ? `
                    <div class="amount">
                        <span class="amount-label">盈餘:</span>
                        <span class="amount-value number text-success">+${formatNumber(surplus)}</span>
                    </div>
                ` : `
                    <div class="amount">
                        <span class="amount-label">缺口:</span>
                        <span class="amount-value number text-danger">-${formatNumber(deficit)}</span>
                    </div>
                `}
            </div>
            
            <div class="status ${isSufficient ? 'sufficient' : 'insufficient'}">
                ${isSufficient ? 
                    '<i class="fas fa-check-circle"></i> 資源充足' : 
                    '<i class="fas fa-exclamation-circle"></i> 資源不足'
                }
            </div>

            ${suggestion ? generateToolSuggestion(suggestion) : ''}
        </div>
    `;
}

/**
 * 生成工具購買建議
 */
function generateToolSuggestion(suggestion) {
    return `
        <div class="purchase-suggestion">
            <h6><i class="fas fa-shopping-cart"></i> 購買建議</h6>
            <div class="tool-suggestion">
                <div><strong>推薦工具:</strong> ${suggestion.toolName}</div>
                <div><strong>總需求:</strong> ${formatNumber(suggestion.toolsNeeded)} 個</div>
                <div><strong>每日建議:</strong> ${suggestion.toolsPerDay} 個</div>
                <div><small class="text-muted">每個工具可產出 ${formatNumber(suggestion.toolValue)} 資源</small></div>
            </div>
        </div>
    `;
}

/**
 * 生成購買建議摘要
 */
function generatePurchaseSummary(suggestions) {
    if (!suggestions || Object.keys(suggestions).length === 0) {
        return `
            <div class="mt-4">
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> <strong>恭喜！</strong> 您的資源產出足以完成所有升級目標，無需額外購買工具。
                </div>
            </div>
        `;
    }

    const totalTools = Object.values(suggestions).reduce((sum, suggestion) => sum + suggestion.toolsNeeded, 0);
    const toolTypes = Object.keys(suggestions).length;

    return `
        <div class="mt-4">
            <div class="alert alert-warning">
                <h5><i class="fas fa-exclamation-triangle"></i> 購買建議摘要</h5>
                <p>根據計算結果，您需要購買以下工具來補足資源缺口：</p>
                <ul class="mb-0">
                    <li><strong>工具類型數:</strong> ${toolTypes} 種</li>
                    <li><strong>工具總數:</strong> ${formatNumber(totalTools)} 個</li>
                    <li><strong>建議策略:</strong> 優先購買產量最高或缺口最大的資源對應工具</li>
                </ul>
            </div>
            
            <div class="info-block">
                <h6><i class="fas fa-lightbulb"></i> 購買策略建議</h6>
                <ul class="info-list">
                    <li>優先購買 <strong>缺口最大</strong> 的資源對應工具</li>
                    <li>考慮工具的 <strong>性價比</strong>（產量/價格）</li>
                    <li>根據賽季剩餘天數 <strong>分散購買</strong>，避免一次性投入過大</li>
                    <li>關注遊戲內活動，可能有工具折扣或贈送</li>
                </ul>
            </div>
        </div>
    `;
}

/**
 * 獲取資源圖示
 */
function getResourceIcon(resourceKey) {
    const icons = {
        gold: '💰',
        refined_stone: '🪨',
        hourglass: '⏳',
        battle_essence: '📖',
        freeze_dried: '🥩'
    };
    return icons[resourceKey] || '❓';
}

/**
 * 獲取資源名稱
 */
function getResourceName(resourceKey) {
    const names = {
        gold: '金幣',
        refined_stone: '粗煉石',
        hourglass: '時之砂',
        battle_essence: '歷戰精華',
        freeze_dried: '凍乾'
    };
    return names[resourceKey] || resourceKey;
}

// 導出主要函數供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateResultsHTML,
        renderStaminaSummary,
        renderProductionSummary,
        generateResourceComparison
    };
}