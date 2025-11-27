/**
 * Resource Templates - HTML Rendering Functions
 * Generates HTML for various summary sections
 */

/**
 * Render stamina calculation summary with enhanced details
 */
function renderStaminaSummary(staminaData) {
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-bolt text-warning"></i>
        體力計算 / Stamina Calculation
      </h6>
      <div class="table-responsive">
        <table class="table table-sm table-hover mb-0">
          <tbody>
            <tr>
              <td class="summary-label">
                <i class="fas fa-calendar-day me-2"></i>剩餘天數 / Remaining Days
              </td>
              <td class="summary-value text-end">${formatNumber(staminaData.remainingDays)} 天</td>
            </tr>
            <tr>
              <td class="summary-label">
                <i class="fas fa-clock me-2"></i>剩餘小時 / Remaining Hours
              </td>
              <td class="summary-value text-end">${formatNumber(staminaData.remainingHours)} 小時</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="breakdown-section">
        <div class="breakdown-title">
          <i class="fas fa-list-ul me-2"></i>體力來源明細 / Stamina Breakdown
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">💤 自然恢復 (5/小時)</span>
          <span class="breakdown-value">${formatNumber(staminaData.naturalStamina)} ⚡</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">🎯 每日任務 (${staminaData.dailyMissions}/天 × ${staminaData.remainingDays}天)</span>
          <span class="breakdown-value">${formatNumber(staminaData.dailyMissions * staminaData.remainingDays)} ⚡</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">🏪 商店寶庫 (${staminaData.shopTreasury}/天 × ${staminaData.remainingDays}天)</span>
          <span class="breakdown-value">${formatNumber(staminaData.shopTreasury * staminaData.remainingDays)} ⚡</span>
        </div>
        ${staminaData.dailySpecial > 0 ? `
        <div class="breakdown-item">
          <span class="breakdown-label">💎 每日特惠 (${staminaData.dailySpecial}/天 × ${staminaData.remainingDays}天)</span>
          <span class="breakdown-value">${formatNumber(staminaData.dailySpecial * staminaData.remainingDays)} ⚡</span>
        </div>
        ` : ''}
        <div class="breakdown-item">
          <span class="breakdown-label">⚡ 加速 (2小時/天 × ${staminaData.remainingDays}天)</span>
          <span class="breakdown-value">${formatNumber(staminaData.accelerationStamina)} ⚡</span>
        </div>
      </div>
      
      <div class="alert alert-success mt-3 mb-0">
        <div class="d-flex justify-content-between align-items-center">
          <strong><i class="fas fa-sigma me-2"></i>總體力 / Total Stamina</strong>
          <span class="fs-3 fw-bold">${formatNumber(staminaData.totalStamina)} ⚡</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render stamina production breakdown with details
 */
function renderStaminaProductionSummary(staminaProduction) {
  const hasProduction = Object.values(staminaProduction).some(v => v > 0);
  if (!hasProduction) return '';
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-running text-primary"></i>
        體力刷取產出明細 / Stamina Production Breakdown
      </h6>
      <div class="alert alert-info mb-3">
        <i class="fas fa-info-circle me-2"></i>
        以下為使用全部體力刷取單一資源的產出
      </div>
      <div class="row g-2">
        ${staminaProduction.gold > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">💰 金幣 / Gold</div>
            <div class="detail-value">${formatNumber(staminaProduction.gold)}</div>
          </div>
        </div>
        ` : ''}
        ${staminaProduction.refined_stone > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🪨 粗煉石 / Refined Stone</div>
            <div class="detail-value">${formatNumber(staminaProduction.refined_stone)}</div>
          </div>
        </div>
        ` : ''}
        ${staminaProduction.hourglass > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">⏳ 時之砂 / Hourglass</div>
            <div class="detail-value">${formatNumber(staminaProduction.hourglass)}</div>
          </div>
        </div>
        ` : ''}
        ${staminaProduction.battle_essence > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">📖 歷戰精華 / Battle Essence</div>
            <div class="detail-value">${formatNumber(staminaProduction.battle_essence)}</div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render stamina usage summary
 */
function renderStaminaUsageSummary(staminaUsage) {
  const activeResource = Object.keys(staminaUsage).find(key => staminaUsage[key] > 0);
  
  if (!activeResource) {
    return '';
  }
  
  const resourceInfo = {
    gold: { icon: '💰', name: '金幣 / Gold' },
    refined_stone: { icon: '🪨', name: '粗煉石 / Refined Stone' },
    hourglass: { icon: '⏳', name: '時之砂 / Hourglass' },
    battle_essence: { icon: '📖', name: '歷戰精華 / Battle Essence' }
  };
  
  const info = resourceInfo[activeResource];
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-running text-primary"></i>
        體力刷取產出 / Stamina Farming Production
      </h6>
      <div class="alert alert-primary mb-0">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold">${info.icon} ${info.name}</span>
          <span class="fs-4 fw-bold">${formatNumber(staminaUsage[activeResource])}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render cart production summary with totals
 */
function renderCartProductionSummary(cartProduction) {
  const hasProduction = Object.values(cartProduction).some(v => v > 0);
  if (!hasProduction) return '';
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-shopping-cart text-info"></i>
        推車掛機產出 / Cart Idle Production
      </h6>
      <div class="row g-2">
        ${cartProduction.gold > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">💰 金幣 / Gold</div>
            <div class="detail-value">${formatNumber(cartProduction.gold)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.refined_stone > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🪨 粗煉石 / Refined Stone</div>
            <div class="detail-value">${formatNumber(cartProduction.refined_stone)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.hourglass > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">⏳ 時之砂 / Hourglass</div>
            <div class="detail-value">${formatNumber(cartProduction.hourglass)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.battle_essence > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">📖 歷戰精華 / Battle Essence</div>
            <div class="detail-value">${formatNumber(cartProduction.battle_essence)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.freeze_dried > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🥩 普通凍乾 / Normal Freeze-dried</div>
            <div class="detail-value">${formatNumber(cartProduction.freeze_dried)}</div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render secret realm summary with tool details
 */
function renderSecretRealmSummary(secretRealmProduction) {
  const hasProduction = Object.values(secretRealmProduction).some(v => v > 0);
  if (!hasProduction) return '';
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-dungeon text-success"></i>
        秘境工具產出 / Secret Realm Production
      </h6>
      <div class="row g-2">
        ${secretRealmProduction.gold > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">⛏️ 金礦鎬</div>
            <div class="detail-value">${formatNumber(secretRealmProduction.gold)}</div>
            <small class="text-muted">💰 金幣</small>
          </div>
        </div>
        ` : ''}
        ${secretRealmProduction.refined_stone > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🔨 鐵礦錘</div>
            <div class="detail-value">${formatNumber(secretRealmProduction.refined_stone)}</div>
            <small class="text-muted">🪨 粗煉石</small>
          </div>
        </div>
        ` : ''}
        ${secretRealmProduction.hourglass > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🏖️ 砂礦鏟</div>
            <div class="detail-value">${formatNumber(secretRealmProduction.hourglass)}</div>
            <small class="text-muted">⏳ 時之砂</small>
          </div>
        </div>
        ` : ''}
        ${secretRealmProduction.battle_essence > 0 ? `
        <div class="col-6 col-md-3">
          <div class="detail-item">
            <div class="detail-label">🥊 拳套</div>
            <div class="detail-value">${formatNumber(secretRealmProduction.battle_essence)}</div>
            <small class="text-muted">📖 歷戰精華</small>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render bond adventure summary
 */
function renderBondAdventureSummary(bondAdventureProduction) {
  if (bondAdventureProduction.freeze_dried === 0) return '';
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-heart text-danger"></i>
        羈絆冒險產出明細 / Bond Adventure Production
      </h6>
      <div class="alert alert-info mb-3">
        <i class="fas fa-info-circle me-2"></i>
        以下為羈絆冒險獎勵轉換後的凍乾經驗值
      </div>
      <div class="row g-2">
        <div class="col-12 col-md-6">
          <div class="detail-item">
            <div class="detail-label">🥩 凍乾經驗 / Freeze-dried EXP</div>
            <div class="detail-value">${formatNumber(bondAdventureProduction.freeze_dried)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render upgrade requirements summary
 */
function renderUpgradeRequirementsSummary(needs) {
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-list-check text-warning"></i>
        升級需求總計 / Total Upgrade Requirements
      </h6>
      <div class="row g-2">
        ${needs.gold > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">💰 金幣</div>
            <div class="detail-value">${formatNumber(needs.gold)}</div>
          </div>
        </div>
        ` : ''}
        ${needs.refined_stone > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">🪨 粗煉石</div>
            <div class="detail-value">${formatNumber(needs.refined_stone)}</div>
          </div>
        </div>
        ` : ''}
        ${needs.hourglass > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">⏳ 時之砂</div>
            <div class="detail-value">${formatNumber(needs.hourglass)}</div>
          </div>
        </div>
        ` : ''}
        ${needs.battle_record > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">📖 歷戰精華</div>
            <div class="detail-value">${formatNumber(needs.battle_record)}</div>
          </div>
        </div>
        ` : ''}
        ${needs.freeze_dried > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">🐾 凍乾經驗</div>
            <div class="detail-value">${formatNumber(needs.freeze_dried)}</div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate resource comparison cards
 */
function generateResourceComparison(production, needs, comparison, remainingDays) {
  const resources = [
    { key: 'gold', icon: '💰', name: '金幣', nameEn: 'Gold', needKey: 'gold' },
    { key: 'refined_stone', icon: '🪨', name: '粗煉石', nameEn: 'Refined Stone', needKey: 'refined_stone' },
    { key: 'hourglass', icon: '⏳', name: '時之砂', nameEn: 'Hourglass', needKey: 'hourglass' },
    { key: 'battle_essence', icon: '📖', name: '歷戰精華', nameEn: 'Battle Essence', needKey: 'battle_record' },
    { key: 'freeze_dried', icon: '🐾', name: '凍乾經驗', nameEn: 'Freeze-dried EXP', needKey: 'freeze_dried' }
  ];
  
  let html = '<div class="mt-4"><h5 class="mb-3"><i class="fas fa-balance-scale me-2"></i>資源對比 / Resource Comparison</h5>';
  
  resources.forEach(resource => {
    const produced = production[resource.key] || 0;
    const needed = needs[resource.needKey] || 0;
    const diff = comparison[resource.key] || 0;
    
    // Skip if no production and no need
    if (produced === 0 && needed === 0) return;
    
    const sufficient = diff >= 0;
    const statusClass = sufficient ? 'sufficient' : 'insufficient';
    const statusText = sufficient ? '✅ 充足 / Sufficient' : '❌ 不足 / Insufficient';
    
    html += `
      <div class="comparison-card ${statusClass}">
        <div class="resource-header">
          <div class="resource-title">
            ${resource.icon} ${resource.name} / ${resource.nameEn}
          </div>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        
        <div class="resource-details">
          <div class="detail-item">
            <div class="detail-label">可產出 / Production</div>
            <div class="detail-value">${formatNumber(produced)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">需求 / Required</div>
            <div class="detail-value">${formatNumber(needed)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">結餘 / Balance</div>
            <div class="detail-value ${sufficient ? 'positive' : 'negative'}">
              ${diff >= 0 ? '+' : ''}${formatNumber(diff)}
            </div>
          </div>
        </div>
        
        ${!sufficient ? generatePurchaseRecommendation(resource, Math.abs(diff), remainingDays) : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  return html;
}

/**
 * Generate purchase recommendation
 */
function generatePurchaseRecommendation(resource, shortage, remainingDays) {
  let recommendation = '';
  
  // Tool-based resources (secret realm)
  if (['gold', 'refined_stone', 'hourglass', 'battle_essence'].includes(resource.key)) {
    const toolInfo = {
      gold: { tool: '金礦鎬', toolEn: 'Gold Pickaxe', rate: upgradesData.secret_realm.resources.find(r => r.key === 'gold').value },
      refined_stone: { tool: '鐵礦錘', toolEn: 'Iron Hammer', rate: upgradesData.secret_realm.resources.find(r => r.key === 'refined_stone').value },
      hourglass: { tool: '砂礦鏟', toolEn: 'Sand Shovel', rate: upgradesData.secret_realm.resources.find(r => r.key === 'hourglass').value },
      battle_essence: { tool: '拳套', toolEn: 'Glove', rate: upgradesData.secret_realm.resources.find(r => r.key === 'battle_essence').value }
    };
    
    const info = toolInfo[resource.key];
    const totalToolsNeeded = Math.ceil(shortage / (info.rate * remainingDays));
    const dailyToolsNeeded = (totalToolsNeeded / remainingDays).toFixed(1);
    
    recommendation = `
      <div class="purchase-recommendation">
        <h6>
          <i class="fas fa-shopping-bag me-2"></i>
          購買建議 / Purchase Recommendation
        </h6>
        <div class="purchase-item">
          <span class="purchase-label">需要購買 ${info.tool} / ${info.toolEn} Needed</span>
          <span class="purchase-value">${formatNumber(totalToolsNeeded)} 個</span>
        </div>
        <div class="purchase-item">
          <span class="purchase-label">每天購買 / Daily Purchase</span>
          <span class="purchase-value">${dailyToolsNeeded} 個/天</span>
        </div>
        <small class="text-muted d-block mt-2">
          <i class="fas fa-info-circle me-1"></i>
          基於秘境工具產出速率: ${formatNumber(info.rate)}/天
        </small>
      </div>
    `;
  }
  
  // Freeze-dried (pet food)
  if (resource.key === 'freeze_dried') {
    const normalExp = window.FREEZE_DRIED_DATA.types.find(t => t.key === 'normal').exp;
    const totalNormalNeeded = Math.ceil(shortage / normalExp);
    const dailyNormalNeeded = (totalNormalNeeded / remainingDays).toFixed(1);
    
    recommendation = `
      <div class="purchase-recommendation">
        <h6>
          <i class="fas fa-shopping-bag me-2"></i>
          購買建議 / Purchase Recommendation
        </h6>
        <div class="purchase-item">
          <span class="purchase-label">需要 🥩 普通凍乾 / Normal Freeze-dried Needed</span>
          <span class="purchase-value">${formatNumber(totalNormalNeeded)} 個</span>
        </div>
        <div class="purchase-item">
          <span class="purchase-label">每天購買 / Daily Purchase</span>
          <span class="purchase-value">${dailyNormalNeeded} 個/天</span>
        </div>
        <small class="text-muted d-block mt-2">
          <i class="fas fa-info-circle me-1"></i>
          或使用更高級凍乾以減少數量需求
        </small>
      </div>
    `;
  }
  
  return recommendation;
}

/**
 * Render upgrade requirements breakdown by category
 */
function renderUpgradeBreakdown(breakdown) {
  const categories = {
    gear: { name: '裝備 / Gear', icon: '🛡️' },
    skill: { name: '技能 / Skill', icon: '📚' },
    relic: { name: '古遺物 / Relic', icon: '💎' },
    pet: { name: '幻獸 / Pet', icon: '🐾' }
  };
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-list-check text-warning"></i>
        升級需求總計明細 / Upgrade Requirements Breakdown
      </h6>
      <div class="table-responsive">
        <table class="table table-hover category-summary-table mb-0">
          <thead>
            <tr>
              <th>類別 / Category</th>
              <th class="text-center">數量</th>
              <th class="text-end">💰 金幣</th>
              <th class="text-end">🪨 粗煉石</th>
              <th class="text-end">⏳ 時之砂</th>
              <th class="text-end">📖 歷戰精華</th>
              <th class="text-end">🥩 凍乾</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(categories).map(cat => {
              const data = breakdown[cat];
              if (data.count === 0) return '';
              return `
                <tr>
                  <td><strong>${categories[cat].icon} ${categories[cat].name}</strong></td>
                  <td class="text-center"><span class="badge bg-primary">${data.count}</span></td>
                  <td class="text-end">${formatNumber(data.gold)}</td>
                  <td class="text-end">${formatNumber(data.refined_stone)}</td>
                  <td class="text-end">${formatNumber(data.hourglass)}</td>
                  <td class="text-end">${formatNumber(data.battle_essence)}</td>
                  <td class="text-end">${formatNumber(data.freeze_dried)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Render full calculation results
 */
function renderCalculationResults(results) {
  const { production, needs, breakdown, comparison } = results;
  
  return `
    ${renderStaminaSummary(production.stamina)}
    ${renderStaminaProductionSummary(production.staminaProduction)}
    ${renderCartProductionSummary(production.cartProduction)}
    ${renderSecretRealmSummary(production.secretRealmProduction)}
    ${renderBondAdventureSummary(production.bondAdventureProduction)}
    ${renderUpgradeBreakdown(breakdown)}
    ${renderComparisonSummary(production.total, needs, comparison)}
  `;
}

/**
 * Render comparison summary with purchase recommendations
 */
function renderComparisonSummary(production, needs, comparison) {
  const resources = [
    { 
      key: 'gold', 
      icon: '💰', 
      name: '金幣 / Gold',
      tool: {
        name: '金礦鎬',
        name_en: 'Gold Pickaxe',
        icon: '⛏️',
        production_per_tool: null  // Will be filled from upgradesData
      }
    },
    { 
      key: 'refined_stone', 
      icon: '🪨', 
      name: '粗煉石 / Refined Stone',
      tool: {
        name: '鐵礦錘',
        name_en: 'Iron Hammer',
        icon: '🔨',
        production_per_tool: null
      }
    },
    { 
      key: 'hourglass', 
      icon: '⏳', 
      name: '時之砂 / Hourglass',
      tool: {
        name: '砂礦鏟',
        name_en: 'Sand Shovel',
        icon: '🏖️',
        production_per_tool: null
      }
    },
    { 
      key: 'battle_essence', 
      icon: '📖', 
      name: '歷戰精華 / Battle Essence',
      tool: {
        name: '拳套',
        name_en: 'Glove',
        icon: '🥊',
        production_per_tool: null
      }
    },
    { 
      key: 'freeze_dried', 
      icon: '🥩', 
      name: '凍乾 / Freeze-dried',
      tool: null  // ← 凍乾無法購買工具
    }
  ];
  
  // Fill in production rates from upgradesData
  if (upgradesData && upgradesData.secret_realm) {
    upgradesData.secret_realm.resources.forEach(resource => {
      const resourceConfig = resources.find(r => r.key === resource.key);
      if (resourceConfig && resourceConfig.tool) {
        resourceConfig.tool.production_per_tool = resource.value;
      }
    });
  }
  
  const remainingDays = seasonData?.total_day || 99;
  
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-balance-scale text-primary"></i>
        資源對比總結 / Resource Comparison Summary
      </h6>
      <div class="row g-3">
        ${resources.map(resource => {
          const prod = production[resource.key];
          const need = needs[resource.key];
          const diff = comparison[resource.key];
          const isSurplus = diff >= 0;
          
          // Calculate purchase recommendation
          let purchaseRecommendation = '';
          
          // Only show purchase recommendation if shortage AND tool is available
          if (!isSurplus && resource.tool !== null && resource.tool.production_per_tool) {
            const shortage = Math.abs(diff);
            const toolsNeeded = Math.ceil(shortage / (resource.tool.production_per_tool));
            const dailyPurchase = Math.ceil(shortage / (resource.tool.production_per_tool * remainingDays));
            
            purchaseRecommendation = `
              <div class="alert alert-warning mb-0 mt-2">
                <div class="fw-bold mb-2">
                  <i class="fas fa-shopping-cart me-2"></i>購買建議 / Purchase Recommendation
                </div>
                <div class="small">
                  <div class="mb-1">
                    <strong>${resource.tool.icon} ${resource.tool.name} (${resource.tool.name_en}) Needed:</strong> 
                    <span class="text-danger fw-bold">${formatNumber(toolsNeeded)} 個</span>
                  </div>
                  <div class="mb-1">
                    <strong>每次購買 / Daily Purchase:</strong> 
                    <span class="text-primary fw-bold">${dailyPurchase} 個/天</span>
                  </div>
                </div>
              </div>
            `;
          } else if (!isSurplus && resource.tool === null) {
            // Show message for resources that cannot purchase tools
            purchaseRecommendation = `
              <div class="alert alert-info mb-0 mt-2">
                <small>
                  <i class="fas fa-info-circle me-2"></i>
                  凍乾無法購買秘境工具，請通過推車掛機和羈絆冒險獲得
                  <br>Freeze-dried cannot purchase tools, obtain through Cart Idle and Bond Adventure
                </small>
              </div>
            `;
          }
          
          return `
            <div class="col-12 col-md-6">
              <div class="card h-100 ${isSurplus ? 'border-success' : 'border-danger'}">
                <div class="card-body">
                  <h6 class="card-title">${resource.icon} ${resource.name}</h6>
                  <div class="mb-2">
                    <small class="text-muted">總產出 / Total Production:</small>
                    <div class="fs-5 fw-bold text-success">${formatNumber(prod)}</div>
                  </div>
                  <div class="mb-2">
                    <small class="text-muted">總需求 / Total Needs:</small>
                    <div class="fs-5 fw-bold text-primary">${formatNumber(need)}</div>
                  </div>
                  <hr>
                  <div>
                    <small class="text-muted">${isSurplus ? '盈餘 / Surplus' : '不足 / Shortage'}:</small>
                    <div class="comparison-badge ${isSurplus ? 'surplus' : 'shortage'}">
                      <i class="fas fa-${isSurplus ? 'check-circle' : 'exclamation-triangle'}"></i>
                      <span>${isSurplus ? '+' : ''}${formatNumber(diff)}</span>
                    </div>
                  </div>
                  ${purchaseRecommendation}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}