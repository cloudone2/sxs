/**
 * 資源升級計算器 - HTML 模板渲染
 */

/**
 * 渲染體力計算摘要
 */
function renderStaminaSummary(staminaData) {
    const releaseDate = new Date(document.getElementById('releaseDate').value);
    const endDateValue = document.getElementById('endDate').value;
    const endDate = endDateValue
        ? new Date(endDateValue)
        : new Date(releaseDate.getTime() + (currentSeasonData.total_day * 24 * 60 * 60 * 1000));
    const actualTotalDays = Math.round((endDate - releaseDate) / (24 * 60 * 60 * 1000));
    
    const card = document.createElement('div');
    card.className = 'card result-card info mb-4';
    
    card.innerHTML = `
        <div class="card-header">
            <h5 class="mb-0">
                <i class="fas fa-bolt me-2"></i>
                體力計算摘要
            </h5>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="fas fa-calendar-alt me-2"></i>時間資訊</h6>
                    <ul class="list-unstyled">
                        <li><strong>賽季開始:</strong> ${formatDate(releaseDate)}</li>
                        <li><strong>賽季結束:</strong> ${formatDate(endDate)}</li>
                        <li><strong>總賽季天數:</strong> ${actualTotalDays} 天 <small class="text-muted">(預計 ${currentSeasonData.total_day} 天)</small></li>
                        <li class="mt-2 pt-2 border-top">
                            <strong>剩餘天數:</strong> <span class="text-primary">${staminaData.remainingDays} 天</span>
                        </li>
                        <li><strong>剩餘小時:</strong> <span class="text-primary">${staminaData.remainingHours} 小時</span></li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6><i class="fas fa-tachometer-alt me-2"></i>體力來源</h6>
                    <ul class="list-unstyled">
                        <li><strong>自然恢復:</strong> <span class="number">${formatNumber(staminaData.naturalStamina)}</span></li>
                        <li><strong>每日獎勵:</strong> <span class="number">${formatNumber(staminaData.dailyStamina)}</span></li>
                        <li><strong>加速恢復:</strong> <span class="number">${formatNumber(staminaData.accelerationStamina)}</span></li>
                        ${staminaData.dealStamina > 0 ? `<li><strong>每日特惠:</strong> <span class="number">${formatNumber(staminaData.dealStamina)}</span></li>` : ''}
                        <li class="border-top pt-2 mt-2"><strong>總體力:</strong> <span class="number text-primary">${formatNumber(staminaData.totalStamina)}</span></li>
                    </ul>
                </div>
            </div>
            
            <!-- 進度條顯示賽季進度 -->
            <div class="mt-3">
                <div class="d-flex justify-content-between small mb-1">
                    <span>賽季進度</span>
                    <span>${formatPercentage(actualTotalDays - staminaData.remainingDays, actualTotalDays)}</span>
                </div>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                        role="progressbar"
                        style="width: ${((actualTotalDays - staminaData.remainingDays) / actualTotalDays * 100)}%"
                        aria-valuenow="${((actualTotalDays - staminaData.remainingDays) / actualTotalDays * 100)}"
                        aria-valuemin="0" 
                        aria-valuemax="100">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 渲染體力使用摘要
 */
function renderStaminaUsageSummary(staminaUsageData) {
    if (!staminaUsageData.selectedResource) {
        return document.createElement('div'); // 空元素
    }
    
    const resource = currentUpgradeData.stamina_production.resources.find(r => r.key === staminaUsageData.selectedResource);
    const totalRuns = Math.floor(calculationResults.stamina.totalStamina / 5);
    
    const card = document.createElement('div');
    card.className = 'card result-card info mb-4';
    
    card.innerHTML = `
        <div class="card-header">
            <h5 class="mb-0">
                <i class="fas fa-zap me-2"></i>
                體力刷取產出
            </h5>
        </div>
        <div class="card-body">
            <div class="alert alert-info">
                <h6><span class="me-1">${resource.icon}</span>選擇資源: ${resource.name_zh}</h6>
                <p class="mb-2">每 5 體力可獲得: <strong class="number">${formatNumber(resource.value)}</strong></p>
                <p class="mb-0">總共可刷取: <strong class="number">${totalRuns}</strong> 次</p>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="text-center p-3 bg-primary bg-opacity-10 rounded">
                        <div class="display-6"><span class="me-1">${resource.icon}</span></div>
                        <h5 class="mt-2">${resource.name_zh}</h5>
                        <h4 class="text-primary number">${formatNumber(staminaUsageData[staminaUsageData.selectedResource])}</h4>
                    </div>
                </div>
                <div class="col-md-6 d-flex align-items-center">
                    <div>
                        <h6>計算公式:</h6>
                        <p class="mb-1">總體力 ÷ 5 × 單次產量</p>
                        <p class="mb-1">${formatNumber(calculationResults.stamina.totalStamina)} ÷ 5 × ${formatNumber(resource.value)}</p>
                        <p class="mb-0">= <strong class="number">${formatNumber(staminaUsageData[staminaUsageData.selectedResource])}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 渲染產出摘要
 */
function renderProductionSummary(productionData) {
    const card = document.createElement('div');
    card.className = 'card result-card info mb-4';
    
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
                <i class="fas fa-industry me-2"></i>
                總產出摘要
            </h5>
            <button class="btn btn-outline-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#productionDetails">
                詳細資訊 <i class="fas fa-chevron-down"></i>
            </button>
        </div>
        <div class="card-body">
            ${renderTotalProductionTable(productionData)}
            <div class="collapse mt-3" id="productionDetails">
                ${renderCartProductionSummary(productionData.cart)}
                ${renderSecretRealmSummary(productionData.secretRealm)}
                ${renderBondAdventureSummary(productionData.bondAdventure)}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 渲染總產出表格
 */
function renderTotalProductionTable(productionData) {
    const resources = [
        { key: 'gold', name: '金幣', icon: '💰' },
        { key: 'refined_stone', name: '粗煉石', icon: '🪨' },
        { key: 'hourglass', name: '時之砂', icon: '⏳' },
        { key: 'battle_essence', name: '歷戰精華', icon: '📖' },
        { key: 'freeze_dried', name: '凍乾 EXP', icon: '🥩' }
    ];
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>資源</th>
                        <th class="text-center">推車掛機</th>
                        <th class="text-center">秘境工具</th>
                        <th class="text-center">體力刷取</th>
                        <th class="text-center">羈絆冒險</th>
                        <th class="text-center">總產出</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    resources.forEach(resource => {
        const cart = productionData.cart[resource.key] || 0;
        const secretRealm = productionData.secretRealm[resource.key] || 0;
        const stamina = productionData.staminaUsage[resource.key] || 0;
        const bond = resource.key === 'freeze_dried' ? (productionData.bondAdventure[resource.key] || 0) : 0;
        const total = cart + secretRealm + stamina + bond;
        
        tableHTML += `
            <tr>
                <td><span class="me-1">${resource.icon}</span>${resource.name}</td>
                <td class="text-center number">${formatNumber(cart)}</td>
                <td class="text-center number">${formatNumber(secretRealm)}</td>
                <td class="text-center number">${formatNumber(stamina)}</td>
                <td class="text-center number">${formatNumber(bond)}</td>
                <td class="text-center number"><strong>${formatNumber(total)}</strong></td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    return tableHTML;
}

/**
 * 渲染推車產出摘要
 */
function renderCartProductionSummary(cartData) {
    const totalHours = calculationResults.stamina.remainingDays * 24 + calculationResults.stamina.remainingHours;
    
    return `
        <div class="mt-3">
            <h6><i class="fas fa-shopping-cart me-2"></i>推車掛機產出 (${totalHours} 小時)</h6>
            <div class="row">
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li>💰 金幣: <span class="number">${formatNumber(cartData.gold)}</span></li>
                        <li>🪨 粗煉石: <span class="number">${formatNumber(cartData.refined_stone)}</span></li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li>⏳ 時之砂: <span class="number">${formatNumber(cartData.hourglass)}</span></li>
                        <li>📖 歷戰精華: <span class="number">${formatNumber(cartData.battle_essence)}</span></li>
                        <li>🥩 凍乾 EXP: <span class="number">${formatNumber(cartData.freeze_dried)}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染秘境工具摘要
 */
function renderSecretRealmSummary(secretRealmData) {
    const tools = currentUpgradeData.secret_realm.resources;
    
    return `
        <div class="mt-3">
            <h6><i class="fas fa-hammer me-2"></i>秘境工具產出</h6>
            <div class="row">
                ${tools.map(tool => {
                    const count = parseInt(document.getElementById(`tool${tool.key}`).value) || 0;
                    const production = secretRealmData[tool.key] || 0;
                    return `
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between">
                                <span>${tool.icon} ${tool.tool_name_zh} (${count})</span>
                                <span class="number">${formatNumber(production)}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * 渲染羈絆冒險摘要
 */
function renderBondAdventureSummary(bondData) {
    if (!currentSeasonData.bond_adventure?.bond_adventure_enabled) {
        return '';
    }
    
    const remainingDays = calculationResults.stamina.remainingDays;
    
    return `
        <div class="mt-3">
            <h6><i class="fas fa-heart me-2"></i>羈絆冒險產出 (${remainingDays} 天)</h6>
            <div class="alert alert-success">
                🥩 凍乾 EXP: <span class="number">${formatNumber(bondData.freeze_dried)}</span>
            </div>
        </div>
    `;
}

/**
 * 渲染升級需求摘要
 */
function renderUpgradeRequirementsSummary(upgradeNeeds) {
    const card = document.createElement('div');
    card.className = 'card result-card warning mb-4';
    
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
                <i class="fas fa-level-up-alt me-2"></i>
                升級需求摘要
            </h5>
            <button class="btn btn-outline-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#upgradeDetails">
                詳細資訊 <i class="fas fa-chevron-down"></i>
            </button>
        </div>
        <div class="card-body">
            ${renderUpgradeNeedsTable(upgradeNeeds)}
            <div class="collapse mt-3" id="upgradeDetails">
                ${renderUpgradeDetails(upgradeNeeds)}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 渲染升級需求表格
 */
function renderUpgradeNeedsTable(upgradeNeeds) {
    const resources = [
        { key: 'gold', name: '金幣', icon: '💰' },
        { key: 'refined_stone', name: '粗煉石', icon: '🪨' },
        { key: 'hourglass', name: '時之砂', icon: '⏳' },
        { key: 'battle_essence', name: '歷戰精華', icon: '📖' },
        { key: 'freeze_dried', name: '凍乾 EXP', icon: '🥩' }
    ];
    
    let html = '<div class="row">';
    
    resources.forEach(resource => {
        const amount = upgradeNeeds[resource.key] || 0;
        if (amount > 0) {
            html += `
                <div class="col-md-4 col-sm-6 mb-3">
                    <div class="text-center p-3 bg-warning bg-opacity-10 rounded">
                        <div class="display-6">${resource.icon}</div>
                        <h6 class="mt-2">${resource.name}</h6>
                        <h5 class="text-warning number">${formatNumber(amount)}</h5>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * 渲染升級詳細資訊
 */
function renderUpgradeDetails(upgradeNeeds) {
    const categories = currentUpgradeData.categories;
    let html = '';
    
    Object.keys(upgradeNeeds.details).forEach(categoryKey => {
        const category = categories[categoryKey];
        const categoryNeeds = upgradeNeeds.details[categoryKey];
        
        html += `
            <div class="mb-4">
                <h6><span class="me-1">${category.icon}</span>${category.name}</h6>
                ${renderCategoryUpgradeTable(categoryNeeds)}
            </div>
        `;
    });
    
    return html;
}

/**
 * 渲染類別升級表格
 */
function renderCategoryUpgradeTable(categoryNeeds) {
    // 獲取需要顯示的資源類型
    const resourceTypes = new Set();
    categoryNeeds.items.forEach(item => {
        Object.keys(item.needs).forEach(resource => {
            if (item.needs[resource] > 0) {
                resourceTypes.add(resource);
            }
        });
    });
    
    const resourceList = Array.from(resourceTypes);
    
    let html = `
        <div class="table-responsive">
            <table class="table table-sm table-hover">
                <thead class="table-light">
                    <tr>
                        <th>項目</th>
                        <th class="text-center">等級變化</th>
    `;
    
    // 動態添加資源列標題
    resourceList.forEach(resource => {
        const resourceInfo = getResourceInfo(resource);
        html += `<th class="text-end">${resourceInfo.icon} ${resourceInfo.name}</th>`;
    });
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    // 添加項目行
    let hasUpgradeItems = false;
    categoryNeeds.items.forEach(item => {
        if (item.startLevel !== item.endLevel) {
            hasUpgradeItems = true;
            html += `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td class="text-center">
                        <span class="badge bg-info">Lv${item.startLevel} → ${item.endLevel}</span>
                    </td>
            `;
            
            resourceList.forEach(resource => {
                const amount = item.needs[resource] || 0;
                html += `<td class="text-end number">${formatNumber(amount)}</td>`;
            });
            
            html += '</tr>';
        }
    });
    
    // 如果沒有升級項目，顯示提示
    if (!hasUpgradeItems) {
        html += `
            <tr>
                <td colspan="${2 + resourceList.length}" class="text-center text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    此類別暫無升級需求
                </td>
            </tr>
        `;
    } else {
        // 添加總計行
        html += `
            <tr class="table-warning">
                <td><strong>總計</strong></td>
                <td class="text-center">
                    <i class="fas fa-calculator"></i>
                </td>
        `;
        
        resourceList.forEach(resource => {
            const total = categoryNeeds.total[resource] || 0;
            html += `<td class="text-end number"><strong>${formatNumber(total)}</strong></td>`;
        });
        
        html += '</tr>';
    }
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

/**
 * 渲染資源對比
 */
function renderResourceComparison(comparison) {
    const card = document.createElement('div');
    card.className = 'card result-card mb-4';
    
    // 判斷整體狀態
    const allSufficient = Object.values(comparison).every(res => res.sufficient);
    card.classList.add(allSufficient ? 'success' : 'danger');
    
    card.innerHTML = `
        <div class="card-header">
            <h5 class="mb-0">
                <i class="fas fa-balance-scale me-2"></i>
                資源對比與購買建議
                ${allSufficient ? 
                    '<span class="badge bg-success ms-2">✅ 資源充足</span>' : 
                    '<span class="badge bg-danger ms-2">❌ 資源不足</span>'
                }
            </h5>
        </div>
        <div class="card-body">
            ${renderComparisonTable(comparison)}
            ${renderPurchaseRecommendations(comparison)}
        </div>
    `;
    
    return card;
}

/**
 * 渲染對比表格
 */
function renderComparisonTable(comparison) {
    // 只顯示有需求的資源
    const activeResources = Object.keys(comparison).filter(resource => 
        comparison[resource].needed > 0 || comparison[resource].produced > 0
    );
    
    if (activeResources.length === 0) {
        return `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                未設定任何升級目標，無法進行資源對比。
            </div>
        `;
    }
    
    let html = `
        <div class="table-responsive mb-4">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>資源</th>
                        <th class="text-end">現有資源</th>
                        <th class="text-end">未來產出</th>
                        <th class="text-end">升級需求</th>
                        <th class="text-end">差額</th>
                        <th class="text-center">狀態</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    activeResources.forEach(resource => {
        const comp = comparison[resource];
        const resourceInfo = getResourceInfo(resource);
        const balanceClass = comp.sufficient ? 'text-success' : 'text-danger';
        const statusBadge = comp.sufficient ? 
            '<span class="badge bg-success">✅ 充足</span>' : 
            '<span class="badge bg-danger">❌ 不足</span>';
        
        html += `
            <tr>
                <td>
                    <span class="me-1">${resourceInfo.icon}</span>
                    <strong>${resourceInfo.name}</strong>
                </td>
                <td class="text-end number">${formatNumber(comp.currentStock || 0)}</td>
                <td class="text-end number">${formatNumber(comp.produced)}</td>
                <td class="text-end number">${formatNumber(comp.needed)}</td>
                <td class="text-end number ${balanceClass}">
                    <strong>${comp.balance >= 0 ? '+' : ''}${formatNumber(comp.balance)}</strong>
                </td>
                <td class="text-center">${statusBadge}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

/**
 * 渲染購買建議
 */
function renderPurchaseRecommendations(comparison) {
    const insufficientResources = Object.keys(comparison).filter(resource => !comparison[resource].sufficient);
    
    if (insufficientResources.length === 0) {
        return `
            <div class="alert alert-success">
                <h6><i class="fas fa-check-circle me-2"></i>恭喜！</h6>
                <p class="mb-0">您的資源產出完全滿足升級需求，無需額外購買任何道具。</p>
            </div>
        `;
    }
    
    let html = `
        <div class="alert alert-warning">
            <h6><i class="fas fa-shopping-cart me-2"></i>購買建議</h6>
            <p class="mb-3">以下資源不足，建議購買對應的秘境工具：</p>
            <div class="row">
    `;
    
    const remainingDays = calculationResults.stamina.remainingDays;
    
    insufficientResources.forEach(resource => {
        if (resource === 'freeze_dried') {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card border-warning">
                        <div class="card-body p-3">
                            <h6 class="card-title mb-2">
                                <span class="me-1">🥩</span>凍乾 EXP
                            </h6>
                            <p class="text-danger mb-2">
                                <strong>不足: ${formatNumber(Math.abs(comparison[resource].balance))}</strong>
                            </p>
                            <p class="small text-muted mb-0">
                                <i class="fas fa-info-circle me-1"></i>
                                凍乾無法通過工具購買<br>
                                建議調整羈絆冒險獲取量或降低升級目標
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const shortage = Math.abs(comparison[resource].balance);
            const tool = getToolForResource(resource);
            const toolsNeeded = Math.ceil(shortage / tool.value);
            const toolsPerDay = remainingDays > 0 ? Math.ceil(toolsNeeded / remainingDays) : toolsNeeded;
            
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card border-warning">
                        <div class="card-body p-3">
                            <h6 class="card-title mb-2">
                                <span class="me-1">${tool.icon}</span>${tool.name}
                            </h6>
                            <p class="text-danger mb-2">
                                <strong>不足: ${formatNumber(shortage)}</strong>
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="small text-muted">建議購買:</span>
                                <span class="badge bg-warning text-dark fs-6">
                                    ${toolsNeeded} 個工具
                                </span>
                            </div>
                            ${remainingDays > 0 ? `
                                <div class="d-flex justify-content-between align-items-center mt-1">
                                    <span class="small text-muted">每天購買:</span>
                                    <span class="badge bg-info text-dark">
                                        ${toolsPerDay} 個
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/**
 * 渲染進度條（可選功能）
 */
function renderProgressBar(current, total, label = '') {
    const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
    const colorClass = percentage >= 100 ? 'bg-success' : percentage >= 80 ? 'bg-warning' : 'bg-danger';
    
    return `
        <div class="mb-2">
            ${label ? `<div class="d-flex justify-content-between small mb-1">
                <span>${label}</span>
                <span>${formatNumber(current)} / ${formatNumber(total)}</span>
            </div>` : ''}
            <div class="progress" style="height: 8px;">
                <div class="progress-bar ${colorClass}" 
                     role="progressbar" 
                     style="width: ${percentage}%"
                     aria-valuenow="${percentage}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染統計卡片
 */
function renderStatCard(icon, title, value, subtitle = '', colorClass = 'primary') {
    return `
        <div class="col-md-3 mb-3">
            <div class="card border-${colorClass}">
                <div class="card-body text-center p-3">
                    <div class="display-6 text-${colorClass} mb-2">
                        <i class="${icon}"></i>
                    </div>
                    <h6 class="card-title mb-1">${title}</h6>
                    <h4 class="number text-${colorClass} mb-1">${formatNumber(value)}</h4>
                    ${subtitle ? `<small class="text-muted">${subtitle}</small>` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染摺疊區塊
 */
function renderCollapsibleSection(id, title, content, isExpanded = false) {
    return `
        <div class="card mb-3">
            <div class="card-header">
                <h6 class="mb-0">
                    <button class="btn btn-link text-decoration-none p-0 w-100 text-start" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${id}" 
                            aria-expanded="${isExpanded}">
                        <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'} me-2"></i>
                        ${title}
                    </button>
                </h6>
            </div>
            <div class="collapse ${isExpanded ? 'show' : ''}" id="${id}">
                <div class="card-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

/**
 * 獲取資源資訊
 */
function getResourceInfo(resourceKey) {
    const resourceMap = {
        gold: { name: '金幣', icon: '💰' },
        refined_stone: { name: '粗煉石', icon: '🪨' },
        hourglass: { name: '時之砂', icon: '⏳' },
        battle_essence: { name: '歷戰精華', icon: '📖' },
        freeze_dried: { name: '凍乾 EXP', icon: '🥩' }
    };
    
    return resourceMap[resourceKey] || { name: resourceKey, icon: '❓' };
}

/**
 * 獲取資源對應的工具
 */
function getToolForResource(resourceKey) {
    const tool = currentUpgradeData.secret_realm.resources.find(r => r.key === resourceKey);
    
    return {
        name: tool?.tool_name_zh || '未知工具',
        icon: tool?.icon || '🔧',
        value: tool?.value || 1
    };
}

/**
 * 渲染空狀態
 */
function renderEmptyState(message, icon = 'fas fa-info-circle') {
    return `
        <div class="text-center py-5">
            <div class="display-1 text-muted mb-3">
                <i class="${icon}"></i>
            </div>
            <h5 class="text-muted">${message}</h5>
        </div>
    `;
}

/**
 * 渲染載入狀態
 */
function renderLoadingState(message = '載入中...') {
    return `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h6 class="text-muted">${message}</h6>
        </div>
    `;
}

/**
 * 渲染工具提示
 */
function renderTooltip(content, placement = 'top') {
    return `
        <span class="d-inline-block" 
              data-bs-toggle="tooltip" 
              data-bs-placement="${placement}" 
              title="${content}">
            <i class="fas fa-question-circle tooltip-icon"></i>
        </span>
    `;
}

/**
 * 初始化工具提示
 */
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * 渲染錯誤狀態
 */
function renderErrorState(error, title = '發生錯誤') {
    return `
        <div class="alert alert-danger">
            <h6 class="alert-heading">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${title}
            </h6>
            <p class="mb-0">${error}</p>
        </div>
    `;
}

/**
 * 渲染成功狀態
 */
function renderSuccessState(message, title = '成功') {
    return `
        <div class="alert alert-success">
            <h6 class="alert-heading">
                <i class="fas fa-check-circle me-2"></i>
                ${title}
            </h6>
            <p class="mb-0">${message}</p>
        </div>
    `;
}

/**
 * 渲染警告狀態
 */
function renderWarningState(message, title = '注意') {
    return `
        <div class="alert alert-warning">
            <h6 class="alert-heading">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${title}
            </h6>
            <p class="mb-0">${message}</p>
        </div>
    `;
}