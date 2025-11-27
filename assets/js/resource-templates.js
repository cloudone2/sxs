/**
 * Resource Templates - HTML Rendering Functions
 * Generates HTML for various summary sections
 */

/**
 * Render stamina calculation summary
 */
function renderStaminaSummary(staminaData) {
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-bolt text-warning"></i>
        體力計算 / Stamina Calculation
      </h6>
      <div class="table-responsive">
        <table class="table table-sm">
          <tbody>
            <tr>
              <td class="summary-label">剩餘天數 / Remaining Days</td>
              <td class="summary-value text-end">${formatNumber(staminaData.remainingDays)} 天</td>
            </tr>
            <tr>
              <td class="summary-label">剩餘小時 / Remaining Hours</td>
              <td class="summary-value text-end">${formatNumber(staminaData.remainingHours)} 小時</td>
            </tr>
            <tr>
              <td class="summary-label">自然恢復 (5/小時) / Natural Recovery</td>
              <td class="summary-value text-end">${formatNumber(staminaData.naturalStamina)} ⚡</td>
            </tr>
            <tr>
              <td class="summary-label">每日任務 / Daily Missions</td>
              <td class="summary-value text-end">${formatNumber(staminaData.dailyMissions)} × ${staminaData.remainingDays} = ${formatNumber(staminaData.dailyMissions * staminaData.remainingDays)} ⚡</td>
            </tr>
            <tr>
              <td class="summary-label">商店寶庫 / Shop Treasury</td>
              <td class="summary-value text-end">${formatNumber(staminaData.shopTreasury)} × ${staminaData.remainingDays} = ${formatNumber(staminaData.shopTreasury * staminaData.remainingDays)} ⚡</td>
            </tr>
            ${staminaData.dailySpecial > 0 ? `
            <tr>
              <td class="summary-label">每日特惠 / Daily Special</td>
              <td class="summary-value text-end">${formatNumber(staminaData.dailySpecial)} × ${staminaData.remainingDays} = ${formatNumber(staminaData.dailySpecial * staminaData.remainingDays)} ⚡</td>
            </tr>
            ` : ''}
            <tr>
              <td class="summary-label">加速 (2小時/天) / Acceleration</td>
              <td class="summary-value text-end">${formatNumber(staminaData.accelerationHours)} 小時 = ${formatNumber(staminaData.accelerationStamina)} ⚡</td>
            </tr>
            <tr class="table-primary fw-bold">
              <td class="summary-label">總體力 / Total Stamina</td>
              <td class="summary-value text-end">${formatNumber(staminaData.totalStamina)} ⚡</td>
            </tr>
          </tbody>
        </table>
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
 * Render cart production summary
 */
function renderCartProductionSummary(cartProduction) {
  return `
    <div class="summary-card">
      <h6>
        <i class="fas fa-shopping-cart text-info"></i>
        推車掛機產出 / Cart Idle Production
      </h6>
      <div class="row g-2">
        ${cartProduction.gold > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">💰 金幣</div>
            <div class="detail-value">${formatNumber(cartProduction.gold)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.refined_stone > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">🪨 粗煉石</div>
            <div class="detail-value">${formatNumber(cartProduction.refined_stone)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.hourglass > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">⏳ 時之砂</div>
            <div class="detail-value">${formatNumber(cartProduction.hourglass)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.battle_essence > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">📖 歷戰精華</div>
            <div class="detail-value">${formatNumber(cartProduction.battle_essence)}</div>
          </div>
        </div>
        ` : ''}
        ${cartProduction.freeze_dried > 0 ? `
        <div class="col-6 col-md-4">
          <div class="detail-item">
            <div class="detail-label">🥩 普通凍乾</div>
            <div class="detail-value">${formatNumber(cartProduction.freeze_dried)}</div>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render secret realm summary
 */
function renderSecretRealmSummary(secretRealmProduction) {
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
        羈絆冒險產出 / Bond Adventure Production
      </h6>
      <div class="alert alert-success mb-0">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold">🐾 凍乾經驗值 / Freeze-dried EXP</span>
          <span class="fs-4 fw-bold">${formatNumber(bondAdventureProduction.freeze_dried)}</span>
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