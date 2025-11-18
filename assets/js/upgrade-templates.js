/**
 * ============================================
 * HTML 模板生成函數
 * HTML Template Generation Functions
 * ============================================
 * 此檔案負責生成所有 HTML 模板
 * This file handles all HTML template generation
 */

/**
 * 渲染體力摘要 - 不使用模板，直接生成 HTML
 * Render stamina summary - Generate HTML directly
 */
function renderStaminaSummary(stamina) {
  const collapseId = `stamina-summary-${Date.now()}`;
  
  // Calculate end date
  const startDateInput = document.getElementById(`${currentSeason}-start-date`);
  const constants = SEASON_CONSTANTS[currentSeason];
  
  let endDateDisplay = '';
  if (startDateInput && constants) {
    const startDate = new Date(`${startDateInput.value}T10:01:00`);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + constants.totalDays);
    
    // Format: YYYY-MM-DD HH:MM
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    const hours = String(endDate.getHours()).padStart(2, '0');
    const minutes = String(endDate.getMinutes()).padStart(2, '0');
    
    endDateDisplay = `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> ⏰ 步驟一：可用體力分析 Available Stamina Analysis <span style="color: var(--primary-color); font-weight: bold; margin-left: 16px;">${formatNumber(stamina.totalStamina)}⚡</span>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="production-breakdown">
          <div class="step-item">
            <span class="step-label">📅 剩餘天數 Days Remaining:</span>
            <span class="step-value">${stamina.daysRemaining} 天 days</span>
          </div>
          <div class="step-item">
            <span class="step-label">⏳ 剩餘小時 Hours Remaining:</span>
            <span class="step-value">${stamina.hoursRemaining} 小時 hours</span>
          </div>
          ${endDateDisplay ? `
          <div class="step-item">
            <span class="step-label">🏁 賽季結束時間 Season End Time:</span>
            <span class="step-value">${endDateDisplay}</span>
          </div>
          ` : ''}
          <div class="step-item">
            <span class="step-label">⚡ 加速小時 Speedup Hours:</span>
            <span class="step-value">${stamina.speedupHours} 小時 hours (${stamina.daysRemaining} × 2)</span>
          </div>
          <div class="step-item">
            <span class="step-label">🕐 總可用小時 Total Hours:</span>
            <span class="step-value">${stamina.totalHours} 小時 hours</span>
          </div>
          <div class="formula">
            <strong>📋 體力來源 Stamina Sources:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8;">
              1️⃣ 時間體力 Time-based: ${stamina.totalHours} 小時 × 5 = <strong style="color: var(--info-color);">${formatNumber(stamina.timeStamina)}</strong><br>
              2️⃣ 每日獎勵 Daily rewards: ${stamina.daysRemaining} 天 × ${stamina.totalDailyStamina} = <strong style="color: var(--success-color);">${formatNumber(stamina.dailyStamina)}</strong><br>
              <div style="border-top: 2px solid var(--border-color); margin-top: 8px; padding-top: 8px;">
                3️⃣ <strong style="font-size: 1.1em; color: var(--primary-color);">總體力 Total Stamina: ${formatNumber(stamina.totalStamina)}</strong> (可刷 ${formatNumber(stamina.totalRuns)} 次 runs)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染體力使用摘要 - 添加詳細產出資訊
 * Render stamina usage summary - Add detailed production info
 */
function renderStaminaUsageSummary(resourceKey, stamina) {
  const collapseId = `stamina-usage-${Date.now()}`;
  
  const resourceNames = {
    gold: '💰 金幣 Gold',
    iron: '🪨 鐵錠 Iron (粗煉石 Refined Stone)',
    hourglass: '⏳ 時之砂 Hourglass',
    battle_essence: '📖 歷戰精華 Battle Essence',
    freeze_dried: '🥩 凍乾 Freeze-dried'
  };

  // Add icon fallback mapping
  const resourceIcons = {
    gold: '💰',
    iron: '🪨',
    hourglass: '⏳',
    battle_essence: '📖',
    freeze_dried: '🥩'
  };

  const displayName = resourceNames[resourceKey] || resourceKey.toUpperCase();
  const displayIcon = resourceIcons[resourceKey] || '📦';

  // 獲取當前賽季數據
  const seasonData = SEASON_DATA[currentSeason];
  if (!seasonData) {
    return `
      <div class="calc-step">
        <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
          <span class="toggle-icon">▶</span> ⚡ 步驟二：體力使用優先級 Stamina Usage Priority
        </div>
        <div id="${collapseId}" style="display: none;">
          <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
            已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
          </div>
        </div>
      </div>
    `;
  }

  // 找到選中的資源數據
  const resource = seasonData.stamina_production.resources.find(r => r.key === resourceKey);
  if (!resource) {
    return `
      <div class="calc-step">
        <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
          <span class="toggle-icon">▶</span> ⚡ 步驟二：體力使用優先級 Stamina Usage Priority
        </div>
        <div id="${collapseId}" style="display: none;">
          <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
            已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
          </div>
        </div>
      </div>
    `;
  }

  // 計算產量
  const totalRuns = stamina.totalRuns;
  const staminaPerRun = stamina.staminaPerRun;
  const valuePerRun = resource.value;
  const resourceIcon = resource.icon || displayIcon; // Use fallback icon
  
  let productionHTML = '';
  let totalProduction = 0;
  let conversionNote = '';
  let unitName = '';

  if (resourceKey === 'iron') {
    // 鐵錠特殊處理：需要轉換成粗煉石
    const ironTotal = totalRuns * valuePerRun;
    const conversionRate = resource.conversion_rate || 10;
    const refinedStone = Math.floor(ironTotal / conversionRate);
    totalProduction = refinedStone;
    unitName = '粗煉石 Refined Stone';

    productionHTML = `
      <div style="padding: 16px; background: #fff7ed; border-radius: 8px; margin-top: 12px;">
        <div style="cursor: pointer; user-select: none;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <strong style="color: #f97316; font-size: 1.05em;">
            <span class="toggle-icon">▶</span> 🧮 產量計算 Production Calculation
          </strong>
        </div>
        <div style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2; color: #475569;">
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #8b5cf6;">
            1️⃣ <strong>體力刷取鐵錠 Stamina for Iron:</strong><br>
            <span style="padding-left: 20px;">總體力 Total Stamina: ${formatNumber(stamina.totalStamina)}</span><br>
            <span style="padding-left: 20px;">÷ 每次消耗 Per Run: ${staminaPerRun} 體力</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(totalRuns)} 次 runs</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #8b5cf6;">
            2️⃣ <strong>獲得鐵錠總量 Total Iron:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(totalRuns)} 次 runs × ${valuePerRun} ${resourceIcon}/次 per run</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(ironTotal)} ${resourceIcon} 鐵錠 Iron</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #8b5cf6;">
            3️⃣ <strong>轉換成粗煉石 Convert to Refined Stone:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(ironTotal)} 鐵錠 ÷ ${conversionRate} (轉換率 Conversion Rate)</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #dc2626; font-size: 1.15em;">${formatNumber(refinedStone)} 🪨 粗煉石 Refined Stone</strong></span>
          </div>
        </div>
      </div>
    `;

    conversionNote = `
      <div class="info-box" style="background: #fef3c7; margin-top: 12px;">
        <span class="info-icon">💡</span>
        <div>
          <strong>轉換說明 Conversion Note:</strong> 每 ${conversionRate} 個鐵錠可轉換成 1 個粗煉石<br>
          Every ${conversionRate} Iron converts to 1 Refined Stone
        </div>
      </div>
    `;
  } else {
    // 其他資源直接計算
    totalProduction = totalRuns * valuePerRun;
    unitName = resourceKey === 'freeze_dried' ? 'EXP' : '';

    productionHTML = `
      <div style="padding: 16px; background: #fff7ed; border-radius: 8px; margin-top: 12px;">
        <div style="cursor: pointer; user-select: none;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = this.nextElementSibling.style.display === 'none' ? '▶' : '▼';">
          <strong style="color: #f97316; font-size: 1.05em;">
            <span class="toggle-icon">▶</span> 🧮 產量計算 Production Calculation
          </strong>
        </div>
        <div style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2; color: #475569;">
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #06b6d4;">
            1️⃣ <strong>體力可刷次數 Total Runs:</strong><br>
            <span style="padding-left: 20px;">總體力 Total Stamina: ${formatNumber(stamina.totalStamina)}</span><br>
            <span style="padding-left: 20px;">÷ 每次消耗 Per Run: ${staminaPerRun} 體力</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(totalRuns)} 次 runs</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #06b6d4;">
            2️⃣ <strong>總產量計算 Total Production:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(totalRuns)} 次 runs × ${valuePerRun} ${resourceIcon}/次 per run</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #dc2626; font-size: 1.15em;">${formatNumber(totalProduction)} ${resourceIcon} ${unitName}</strong></span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> ⚡ 步驟二：體力使用優先級 Stamina Usage Priority <span style="color: var(--primary-color); font-weight: bold; margin-left: 16px;">${formatNumber(totalProduction)} ${resourceIcon}</span>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
          已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
        </div>
        
        ${productionHTML}
        ${conversionNote}
        
        <div style="margin-top: 16px; padding: 16px; background: linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%); border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <span style="font-weight: bold; color: #1e40af; font-size: 1.1em;">📊 預計總產量 Expected Total Production:</span>
            <span style="font-weight: bold; color: #7c3aed; font-size: 1.3em;">${formatNumber(totalProduction)} ${resourceIcon} ${unitName}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染推車產量摘要
 * Render cart production summary
 */
function renderCartProductionSummary(cart, totalHours) {
  const collapseId = `cart-summary-${Date.now()}`;
  
  // Calculate total production display value for title
  const summaryParts = [];
  if (cart.gold > 0) summaryParts.push(`💰${formatNumber(cart.gold)}`);
  if (cart.refined_stone > 0) summaryParts.push(`🪨${formatNumber(cart.refined_stone)}`);
  if (cart.hourglass > 0) summaryParts.push(`⏳${formatNumber(cart.hourglass)}`);
  if (cart.battle_essence > 0) summaryParts.push(`📖${formatNumber(cart.battle_essence)}`);
  if (cart.freeze_dried_exp > 0) summaryParts.push(`🥩${formatNumber(cart.freeze_dried_exp)}`);
  const summaryDisplay = summaryParts.join(' | ');
  
  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> 🏭 步驟三：推車產量 Cart Production <span style="color: var(--primary-color); font-weight: bold; margin-left: 16px; font-size: 0.9em;">${summaryDisplay}</span>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="production-breakdown">
          <div class="step-item">
            <span class="step-label">💰 金幣 Gold (${formatNumber(cart.rates.goldPerHour)}/hr):</span>
            <span class="step-value">${formatNumber(cart.gold)}</span>
          </div>
          <div class="step-item">
            <span class="step-label">🪨 粗煉石 Refined Stone (${formatNumber(cart.rates.stonePerHour)}/hr):</span>
            <span class="step-value">${formatNumber(cart.refined_stone)}</span>
          </div>
          <div class="step-item">
            <span class="step-label">⏳ 時之砂 Hourglass (${formatNumber(cart.rates.hourglassPerHour)}/hr):</span>
            <span class="step-value">${formatNumber(cart.hourglass)}</span>
          </div>
          <div class="step-item">
            <span class="step-label">📖 歷戰精華 Battle Essence (${formatNumber(cart.rates.essencePerHour)}/hr):</span>
            <span class="step-value">${formatNumber(cart.battle_essence)}</span>
          </div>
          <div class="step-item">
            <span class="step-label">🥩 普通凍乾 Normal Freeze-dried (${formatNumber(cart.rates.driedPerHour)}/hr):</span>
            <span class="step-value">${formatNumber(cart.freeze_dried_count)} 個 items</span>
          </div>
          <div class="formula" style="margin-top: 8px;">
            <strong>📊 凍乾經驗值 Freeze-dried EXP:</strong><br>
            ${formatNumber(cart.freeze_dried_count)} 個 items × ${cart.rates.normalExp} EXP = <strong style="color: var(--success-color);">${formatNumber(cart.freeze_dried_exp)} EXP</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染秘境工具摘要
 * Render secret realm summary
 */
function renderSecretRealmSummary(secretRealm, totalHours) {
  const collapseId = `secret-realm-${Date.now()}`;
  
  let toolItemsHtml = '';
  
  secretRealm.tools.forEach(tool => {
    // Add fallback icon
    const toolIcon = tool.icon || '🔨';
    toolItemsHtml += `
      <div class="step-item">
        <span class="step-label">${toolIcon} ${tool.name_zh} ${tool.name} (${tool.count}個 × ${tool.valuePerTool}/hr):</span>
        <span class="step-value">${formatNumber(tool.totalProduction)}</span>
      </div>
    `;
  });

  // Calculate summary
  const summaryParts = [];
  if (secretRealm.gold > 0) summaryParts.push(`💰${formatNumber(secretRealm.gold)}`);
  if (secretRealm.refined_stone > 0) summaryParts.push(`🪨${formatNumber(secretRealm.refined_stone)}`);
  if (secretRealm.hourglass > 0) summaryParts.push(`⏳${formatNumber(secretRealm.hourglass)}`);
  if (secretRealm.battle_essence > 0) summaryParts.push(`📖${formatNumber(secretRealm.battle_essence)}`);
  const summaryDisplay = summaryParts.join(' | ');

  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> 🔨 步驟四：秘境工具產量 Secret Realm Tool Production <span style="color: var(--primary-color); font-weight: bold; margin-left: 16px; font-size: 0.9em;">${summaryDisplay}</span>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="production-breakdown">
          ${toolItemsHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染羈絆冒險摘要
 * Render bond adventure summary
 */
function renderBondAdventureSummary(bondAdventure, daysRemaining) {
  const collapseId = `bond-adventure-${Date.now()}`;
  const selectedStageText = `${bondAdventure.reward_per_run} 個優質凍乾 Premium freeze-dried per run`;

  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> 🎭 步驟四點五：羈絆冒險 Bond Adventure <span style="color: var(--primary-color); font-weight: bold; margin-left: 16px;">${formatNumber(bondAdventure.freeze_dried_exp)} 🥩 EXP</span>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          關卡獎勵 Stage Reward: ${selectedStageText}
        </div>
        <div class="production-breakdown">
          <div class="step-item">
            <span class="step-label">⭐ 每次獎勵 Reward Per Run:</span>
            <span class="step-value">${bondAdventure.reward_per_run} 優質凍乾 Premium</span>
          </div>
          <div class="step-item">
            <span class="step-label">📅 剩餘天數 Days Remaining:</span>
            <span class="step-value">${daysRemaining} 天 days (${bondAdventure.total_runs} 次獎勵 runs)</span>
          </div>
          <div class="step-item">
            <span class="step-label">⭐ 總可獲得 Total Premium:</span>
            <span class="step-value">${formatNumber(bondAdventure.premium_count)} 個 items</span>
          </div>
          <div class="formula" style="margin-top: 8px;">
            <strong>📊 凍乾經驗值 Freeze-dried EXP:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 1.8; background: #f0f9ff; padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              ${formatNumber(bondAdventure.premium_count)} 個 items × ${bondAdventure.premium_exp} EXP = <strong style="color: var(--success-color); font-size: 1.2em;">${formatNumber(bondAdventure.freeze_dried_exp)} EXP</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 渲染升級需求摘要 - 簡化版本，移除總產量和總需求標題
 * Render upgrade requirements summary - Simplified version
 */
function renderUpgradeRequirementsSummary(needed, breakdown, upgradeDetails, totalProduction) {
  const collapseId = `upgrade-requirements-${Date.now()}`;
  const gearCalcId = `gear-calc-${Date.now()}`;
  const relicCalcId = `relic-calc-${Date.now()}`;
  const skillCalcId = `skill-calc-${Date.now()}`;
  const petCalcId = `pet-calc-${Date.now()}`;

  // Create summary display for title
  const summaryParts = [];
  if (needed.gold > 0) summaryParts.push(`💰${formatNumber(needed.gold)}`);
  if (needed.refined_stone > 0) summaryParts.push(`🪨${formatNumber(needed.refined_stone)}`);
  if (needed.hourglass > 0) summaryParts.push(`⏳${formatNumber(needed.hourglass)}`);
  if (needed.battle_essence > 0) summaryParts.push(`📖${formatNumber(needed.battle_essence)}`);
  if (needed.freeze_dried > 0) summaryParts.push(`🥩${formatNumber(needed.freeze_dried)}`);
  const needsSummary = summaryParts.join(' | ');

  return `
    <div class="calc-step">
      <div class="step-title" style="cursor: pointer; user-select: none;" onclick="document.getElementById('${collapseId}').style.display = document.getElementById('${collapseId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${collapseId}').style.display === 'none' ? '▶' : '▼';">
        <span class="toggle-icon">▶</span> 🎯 步驟五：升級需求資源總覽 Upgrade Requirements Resource Overview
        <div style="color: var(--primary-color); font-weight: bold; margin-top: 8px; font-size: 0.9em;">${needsSummary}</div>
      </div>
      <div id="${collapseId}" style="display: none;">
        <div class="production-breakdown">
          
          <!-- 升級需求明細 Upgrade Requirements Details -->
          <div style="margin-bottom: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #64748b;">
            <h3 style="margin: 0 0 16px 0; color: #475569; font-size: 1.2em;">📋 升級需求明細 Upgrade Requirements Details</h3>
          
            <!-- 裝備分類 Gear Category -->
            <div class="category-breakdown" style="margin-bottom: 16px;">
              <div class="category-title" style="font-size: 1.05em;">⚔️ 裝備 Gear (5件 items)</div>
              
              <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
                <div style="cursor: pointer; user-select: none;" onclick="document.getElementById('${gearCalcId}').style.display = document.getElementById('${gearCalcId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${gearCalcId}').style.display === 'none' ? '▶' : '▼';">
                  <strong style="font-size: 1.05em;">
                    <span class="toggle-icon">▶</span> 🧮 資源計算 Resource Calculation
                  </strong>
                </div>
                <div id="${gearCalcId}" style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2;">
                  ${generateGearCalculationSteps(upgradeDetails.gear, breakdown.gear)}
                </div>
              </div>
              
              <div style="margin-top: 12px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <div class="step-item">
                  <span class="step-label">💰 裝備金幣總需求 Total Gold:</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.gear.gold)}</span>
                </div>
                <div class="step-item">
                  <span class="step-label">🪨 裝備粗煉石總需求 Total Refined Stone (鐵錠 Iron):</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.gear.iron)}</span>
                </div>
              </div>
            </div>
            
            <!-- 古遺物分類 Relics Category -->
            <div class="category-breakdown" style="margin-bottom: 16px;">
              <div class="category-title" style="font-size: 1.05em;">✨ 古遺物 Relics (20個 items)</div>
              
              <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
                <div style="cursor: pointer; user-select: none;" onclick="document.getElementById('${relicCalcId}').style.display = document.getElementById('${relicCalcId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${relicCalcId}').style.display === 'none' ? '▶' : '▼';">
                  <strong style="font-size: 1.05em;">
                    <span class="toggle-icon">▶</span> 🧮 資源計算 Resource Calculation
                  </strong>
                </div>
                <div id="${relicCalcId}" style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2;">
                  ${generateRelicCalculationSteps(upgradeDetails.relic, breakdown.relic)}
                </div>
              </div>
              
              <div style="margin-top: 12px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <div class="step-item">
                  <span class="step-label">💰 古遺物金幣總需求 Total Gold:</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.relic.gold)}</span>
                </div>
                <div class="step-item">
                  <span class="step-label">⏳ 古遺物時之砂總需求 Total Hourglass:</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.relic.hourglass)}</span>
                </div>
              </div>
            </div>
            
            <!-- 技能分類 Skills Category -->
            <div class="category-breakdown" style="margin-bottom: 16px;">
              <div class="category-title" style="font-size: 1.05em;">📚 技能 Skills (8個 items)</div>
              
              <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
                <div style="cursor: pointer; user-select: none;" onclick="document.getElementById('${skillCalcId}').style.display = document.getElementById('${skillCalcId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${skillCalcId}').style.display === 'none' ? '▶' : '▼';">
                  <strong style="font-size: 1.05em;">
                    <span class="toggle-icon">▶</span> 🧮 資源計算 Resource Calculation
                  </strong>
                </div>
                <div id="${skillCalcId}" style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2;">
                  ${generateSkillCalculationSteps(upgradeDetails.skill, breakdown.skill)}
                </div>
              </div>
              
              <div style="margin-top: 12px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <div class="step-item">
                  <span class="step-label">📖 技能歷戰精華總需求 Total Battle Essence:</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.skill.battle_essence)}</span>
                </div>
              </div>
            </div>
            
            <!-- 幻獸分類 Pets Category -->
            <div class="category-breakdown">
              <div class="category-title" style="font-size: 1.05em;">🐾 幻獸 Pets (4隻 items)</div>
              
              <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
                <div style="cursor: pointer; user-select: none;" onclick="document.getElementById('${petCalcId}').style.display = document.getElementById('${petCalcId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.toggle-icon').textContent = document.getElementById('${petCalcId}').style.display === 'none' ? '▶' : '▼';">
                  <strong style="font-size: 1.05em;">
                    <span class="toggle-icon">▶</span> 🧮 資源計算 Resource Calculation
                  </strong>
                </div>
                <div id="${petCalcId}" style="display: none; padding-left: 16px; margin-top: 8px; line-height: 2;">
                  ${generatePetCalculationSteps(upgradeDetails.pet, breakdown.pet)}
                </div>
              </div>
              
              <div style="margin-top: 12px; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <div class="step-item">
                  <span class="step-label">🥩 幻獸凍乾經驗值總需求 Total Freeze-dried EXP:</span>
                  <span class="step-value" style="color: #d97706; font-weight: bold;">${formatNumber(breakdown.pet.freeze_dried)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 資源對比總結 Resource Comparison Summary -->
          <div style="margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%); border-radius: 12px; border-left: 4px solid #8b5cf6;">
            <h3 style="margin: 0 0 16px 0; color: #6b21a8; font-size: 1.3em;">📊 總需求 vs 總產量 Total Requirements vs Total Production</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
              ${generateComparisonCards(needed, totalProduction)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成對比卡片
 * Generate comparison cards
 */
function generateComparisonCards(needed, totalProduction) {
  const resources = [
    { key: 'gold', icon: '💰', name: '金幣 Gold' },
    { key: 'refined_stone', icon: '🪨', name: '粗煉石 Refined Stone' },
    { key: 'hourglass', icon: '⏳', name: '時之砂 Hourglass' },
    { key: 'battle_essence', icon: '📖', name: '歷戰精華 Battle Essence' },
    { key: 'freeze_dried', icon: '🥩', name: '凍乾經驗值 Freeze-dried EXP' }
  ];

  let html = '';
  
  resources.forEach(resource => {
    const need = needed[resource.key] || 0;
    const prod = totalProduction[resource.key] || 0;
    
    if (need === 0 && prod === 0) return;
    
    const diff = prod - need;
    const isSufficient = diff >= 0;
    const statusColor = isSufficient ? '#10b981' : '#ef4444';
    const statusIcon = isSufficient ? '✅' : '❌';
    const bgColor = isSufficient ? '#d1fae5' : '#fee2e2';
    
    html += `
      <div style="background: ${bgColor}; padding: 16px; border-radius: 8px; border-left: 4px solid ${statusColor};">
        <div style="font-size: 1.1em; font-weight: bold; color: #374151; margin-bottom: 12px;">
          ${resource.icon} ${resource.name} ${statusIcon}
        </div>
        <div style="color: #6b7280; line-height: 1.8;">
          <div>需求 Need: <strong>${formatNumber(need)}</strong></div>
          <div>產量 Production: <strong>${formatNumber(prod)}</strong></div>
          <div style="border-top: 2px solid ${statusColor}; margin-top: 8px; padding-top: 8px; color: ${statusColor}; font-weight: bold; font-size: 1.1em;">
            差額 Diff: ${diff >= 0 ? '+' : ''}${formatNumber(diff)}
          </div>
        </div>
      </div>
    `;
  });
  
  return html;
}

/**
 * 生成裝備計算步驟
 * Generate gear calculation steps
 */
function generateGearCalculationSteps(details, totals) {
  if (!details || details.length === 0) {
    return '<div style="color: #94a3b8; font-style: italic;">無升級項目 No upgrades</div>';
  }

  let goldCalc = [];
  let ironCalc = [];

  details.forEach((item, idx) => {
    const itemName = getItemName('gear', item.index);
    if (item.gold > 0) {
      goldCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.gold)}`);
    }
    if (item.iron > 0) {
      ironCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.iron)}`);
    }
  });

  let html = '';
  
  if (goldCalc.length > 0) {
    html += `<div style="margin-bottom: 12px;">`;
    html += `<strong style="color: #0ea5e9;">💰 金幣 Gold:</strong><br>`;
    goldCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #0ea5e9; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.gold)}</span>`;
    html += `</div>`;
  }

  if (ironCalc.length > 0) {
    html += `<div>`;
    html += `<strong style="color: #8b5cf6;">🪨 鐵錠 Iron (轉換成粗煉石 Convert to Refined Stone):</strong><br>`;
    ironCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #8b5cf6; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.iron)}</span>`;
    html += `</div>`;
  }

  return html;
}

/**
 * 生成古遺物計算步驟
 * Generate relic calculation steps
 */
function generateRelicCalculationSteps(details, totals) {
  if (!details || details.length === 0) {
    return '<div style="color: #94a3b8; font-style: italic;">無升級項目 No upgrades</div>';
  }

  let goldCalc = [];
  let hourglassCalc = [];

  details.forEach((item, idx) => {
    const itemName = getItemName('relic', item.index);
    if (item.gold > 0) {
      goldCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.gold)}`);
    }
    if (item.hourglass > 0) {
      hourglassCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.hourglass)}`);
    }
  });

  let html = '';
  
  if (goldCalc.length > 0) {
    html += `<div style="margin-bottom: 12px;">`;
    html += `<strong style="color: #0ea5e9;">💰 金幣 Gold:</strong><br>`;
    goldCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #0ea5e9; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.gold)}</span>`;
    html += `</div>`;
  }

  if (hourglassCalc.length > 0) {
    html += `<div>`;
    html += `<strong style="color: #06b6d4;">⏳ 時之砂 Hourglass:</strong><br>`;
    hourglassCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #06b6d4; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.hourglass)}</span>`;
    html += `</div>`;
  }

  return html;
}

/**
 * 生成技能計算步驟
 * Generate skill calculation steps
 */
function generateSkillCalculationSteps(details, totals) {
  if (!details || details.length === 0) {
    return '<div style="color: #94a3b8; font-style: italic;">無升級項目 No upgrades</div>';
  }

  let essenceCalc = [];

  details.forEach((item, idx) => {
    const itemName = getItemName('skill', item.index);
    if (item.battle_record > 0) {
      essenceCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.battle_record)}`);
    }
  });

  let html = '';
  
  if (essenceCalc.length > 0) {
    html += `<div>`;
    html += `<strong style="color: #f97316;">📖 歷戰精華 Battle Essence:</strong><br>`;
    essenceCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #f97316; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.battle_essence)}</span>`;
    html += `</div>`;
  }

  return html;
}

/**
 * 生成幻獸計算步驟
 * Generate pet calculation steps
 */
function generatePetCalculationSteps(details, totals) {
  if (!details || details.length === 0) {
    return '<div style="color: #94a3b8; font-style: italic;">無升級項目 No upgrades</div>';
  }

  let expCalc = [];

  details.forEach((item, idx) => {
    const itemName = getItemName('pet', item.index);
    if (item.freeze_dried > 0) {
      expCalc.push(`${itemName} (Lv.${item.from}→${item.to}): ${formatNumber(item.freeze_dried)} EXP`);
    }
  });

  let html = '';
  
  if (expCalc.length > 0) {
    html += `<div>`;
    html += `<strong style="color: #ec4899;">🥩 凍乾經驗值 Freeze-dried EXP:</strong><br>`;
    expCalc.forEach((calc, idx) => {
      html += `<span style="color: #64748b; padding-left: 20px;">${idx > 0 ? '+ ' : ''}${calc}</span><br>`;
    });
    html += `<span style="color: #ec4899; font-weight: bold; padding-left: 20px; border-top: 2px solid #cbd5e1; display: inline-block; margin-top: 4px; padding-top: 4px;">= ${formatNumber(totals.freeze_dried)} EXP</span>`;
    html += `</div>`;
  }

  return html;
}

/**
 * 生成資源對比 HTML - WITH PURCHASE RECOMMENDATIONS
 * Generate resource comparison HTML - WITH PURCHASE RECOMMENDATIONS
 */
function generateResourceComparison(results) {
  const resources = [
    {
      key: 'gold',
      icon: '💰',
      name: '金幣',
      nameEn: 'Gold',
      toolName: '金礦鎬',
      toolNameEn: 'Gold Pickaxe',
      needed: results.upgradeNeeds.needs.gold,
      produced: results.totalProduction.gold
    },
    {
      key: 'refined_stone',
      icon: '🪨',
      name: '粗煉石',
      nameEn: 'Refined Stone',
      toolName: '鐵礦錘',
      toolNameEn: 'Iron Hammer',
      needed: results.upgradeNeeds.needs.refined_stone,
      produced: results.totalProduction.refined_stone
    },
    {
      key: 'hourglass',
      icon: '⏳',
      name: '時之砂',
      nameEn: 'Hourglass',
      toolName: '砂礦鏟',
      toolNameEn: 'Sand Shovel',
      needed: results.upgradeNeeds.needs.hourglass,
      produced: results.totalProduction.hourglass
    },
    {
      key: 'battle_essence',
      icon: '📖',
      name: '歷戰精華',
      nameEn: 'Battle Essence',
      toolName: '拳套',
      toolNameEn: 'Glove',
      needed: results.upgradeNeeds.needs.battle_essence,
      produced: results.totalProduction.battle_essence
    },
    {
      key: 'freeze_dried',
      icon: '🥩',
      name: '凍乾經驗值',
      nameEn: 'Freeze-dried EXP',
      toolName: '凍乾',
      toolNameEn: 'Freeze-dried',
      needed: results.upgradeNeeds.needs.freeze_dried,
      produced: results.totalProduction.freeze_dried
    }
  ];

  const daysRemaining = results.stamina.daysRemaining;
  let html = '';

  resources.forEach(resource => {
    if (resource.needed === 0 && resource.produced === 0) return;

    const difference = resource.produced - resource.needed;
    const isSufficient = difference >= 0;
    const statusClass = isSufficient ? 'sufficient' : 'insufficient';
    const statusIcon = isSufficient ? '✅' : '❌';
    const statusText = isSufficient ? '充足 Sufficient' : '不足 Insufficient';

    // Calculate purchase recommendations
    let purchaseHTML = '';
    if (!isSufficient && daysRemaining > 0) {
      const deficit = Math.abs(difference);
      const perDay = Math.ceil(deficit / daysRemaining);
      const total = deficit;
      
      // Get tool production value from secret realm data
      const seasonData = SEASON_DATA[currentSeason];
      let toolProductionValue = 0;
      if (seasonData && seasonData.secret_realm) {
        const tool = seasonData.secret_realm.resources.find(r => r.key === resource.key);
        if (tool) {
          toolProductionValue = tool.value;
        }
      }
      
      let toolsNeeded = 0;
      let toolsPerDay = 0;
      if (toolProductionValue > 0) {
        toolsNeeded = Math.ceil(total / toolProductionValue);
        toolsPerDay = Math.ceil(perDay / toolProductionValue);
      }

      purchaseHTML = `
        <div style="margin-top: 16px; padding: 16px; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f97316;">
          <div style="font-weight: bold; color: #c2410c; margin-bottom: 12px; font-size: 1.1em;">
            🛒 購買建議 Purchase Recommendation
          </div>
          <div style="line-height: 2; color: #7c2d12;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #fed7aa;">
              <span>📅 剩餘天數 Days Remaining:</span>
              <strong style="color: #ea580c;">${daysRemaining} 天 days</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #fed7aa;">
              <span>📉 總缺口 Total Deficit:</span>
              <strong style="color: #dc2626;">${formatNumber(deficit)} ${resource.icon}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #fed7aa;">
              <span>📊 每天需要 Per Day:</span>
              <strong style="color: #ea580c;">${formatNumber(perDay)} ${resource.icon}/天 day</strong>
            </div>
            ${toolProductionValue > 0 ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #fdba74;">
              <div style="font-weight: bold; color: #9a3412; margin-bottom: 8px;">
                🔨 ${resource.toolName} ${resource.toolNameEn} (${formatNumber(toolProductionValue)}${resource.icon}/個)
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                <span>需購買總數 Total Tools Needed:</span>
                <strong style="color: #dc2626; font-size: 1.15em;">${formatNumber(toolsNeeded)} 個 items</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                <span>每天需購買 Tools Per Day:</span>
                <strong style="color: #ea580c; font-size: 1.15em;">${formatNumber(toolsPerDay)} 個/天 items/day</strong>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    html += `
      <div class="result-card ${statusClass}">
        <div class="result-header">
          ${resource.icon} ${resource.name} ${resource.nameEn}
        </div>
        <div class="result-value">
          ${statusIcon} ${statusText}
        </div>
        <div class="result-detail">
          <strong>需求 Needed:</strong> ${formatNumber(resource.needed)}<br>
          <strong>產出 Produced:</strong> ${formatNumber(resource.produced)}<br>
          <strong>差額 Difference:</strong> 
          <span style="color: ${isSufficient ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 700;">
            ${difference >= 0 ? '+' : ''}${formatNumber(difference)}
          </span>
        </div>
        ${purchaseHTML}
      </div>
    `;
  });

  return html;
}

console.log('Upgrade Templates JS loaded successfully');