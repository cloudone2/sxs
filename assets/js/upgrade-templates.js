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
  return `
    <div class="calc-step">
      <div class="step-title">⏰ 步驟一：可用體力分析 Available Stamina Analysis</div>
      <div class="production-breakdown">
        <div class="step-item">
          <span class="step-label">📅 剩餘天數 Days Remaining:</span>
          <span class="step-value">${stamina.daysRemaining} 天 days</span>
        </div>
        <div class="step-item">
          <span class="step-label">⏳ 剩餘小時 Hours Remaining:</span>
          <span class="step-value">${stamina.hoursRemaining} 小時 hours</span>
        </div>
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
  `;
}

/**
 * 渲染體力使用摘要 - 添加詳細產出資訊
 * Render stamina usage summary - Add detailed production info
 */
function renderStaminaUsageSummary(resourceKey, stamina) {
  const resourceNames = {
    gold: '💰 金幣 Gold',
    iron: '🪨 鐵錠 Iron (粗煉石 Refined Stone)',
    hourglass: '⏳ 時之砂 Hourglass',
    battle_essence: '📖 歷戰精華 Battle Essence',
    freeze_dried: '🥩 凍乾 Freeze-dried'
  };

  const displayName = resourceNames[resourceKey] || resourceKey.toUpperCase();

  // 獲取當前賽季數據
  const seasonData = SEASON_DATA[currentSeason];
  if (!seasonData) {
    return `
      <div class="calc-step">
        <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
        <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
          已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
        </div>
      </div>
    `;
  }

  // 找到選中的資源數據
  const resource = seasonData.stamina_production.resources.find(r => r.key === resourceKey);
  if (!resource) {
    return `
      <div class="calc-step">
        <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
        <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
          已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
        </div>
      </div>
    `;
  }

  // 計算產量
  const totalRuns = stamina.totalRuns;
  const staminaPerRun = stamina.staminaPerRun;
  const valuePerRun = resource.value;
  
  let productionHTML = '';
  let totalProduction = 0;
  let conversionNote = '';

  if (resourceKey === 'iron') {
    // 鐵錠特殊處理：需要轉換成粗煉石
    const ironTotal = totalRuns * valuePerRun;
    const conversionRate = resource.conversion_rate || 10;
    const refinedStone = Math.floor(ironTotal / conversionRate);
    totalProduction = refinedStone;

    productionHTML = `
      <div style="padding: 16px; background: #fff7ed; border-radius: 8px; margin-top: 12px;">
        <strong style="color: #f97316; font-size: 1.05em;">🧮 產量計算 Production Calculation:</strong><br>
        <div style="padding-left: 16px; margin-top: 8px; line-height: 2; color: #475569;">
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #8b5cf6;">
            1️⃣ <strong>體力刷取鐵錠 Stamina for Iron:</strong><br>
            <span style="padding-left: 20px;">總體力 Total Stamina: ${formatNumber(stamina.totalStamina)}</span><br>
            <span style="padding-left: 20px;">÷ 每次消耗 Per Run: ${staminaPerRun} 體力</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(totalRuns)} 次 runs</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #8b5cf6;">
            2️⃣ <strong>獲得鐵錠總量 Total Iron:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(totalRuns)} 次 runs × ${valuePerRun} 鐵錠/次 per run</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(ironTotal)} 鐵錠 Iron</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #8b5cf6;">
            3️⃣ <strong>轉換成粗煉石 Convert to Refined Stone:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(ironTotal)} 鐵錠 ÷ ${conversionRate} (轉換率 Conversion Rate)</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #dc2626; font-size: 1.15em;">${formatNumber(refinedStone)} 粗煉石 Refined Stone</strong></span>
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
    const unitName = resourceKey === 'freeze_dried' ? 'EXP' : '';

    productionHTML = `
      <div style="padding: 16px; background: #fff7ed; border-radius: 8px; margin-top: 12px;">
        <strong style="color: #f97316; font-size: 1.05em;">🧮 產量計算 Production Calculation:</strong><br>
        <div style="padding-left: 16px; margin-top: 8px; line-height: 2; color: #475569;">
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #06b6d4;">
            1️⃣ <strong>體力可刷次數 Total Runs:</strong><br>
            <span style="padding-left: 20px;">總體力 Total Stamina: ${formatNumber(stamina.totalStamina)}</span><br>
            <span style="padding-left: 20px;">÷ 每次消耗 Per Run: ${staminaPerRun} 體力</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #0ea5e9;">${formatNumber(totalRuns)} 次 runs</strong></span>
          </div>
          
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #06b6d4;">
            2️⃣ <strong>總產量計算 Total Production:</strong><br>
            <span style="padding-left: 20px;">${formatNumber(totalRuns)} 次 runs × ${valuePerRun} ${resource.icon}/次 per run</span><br>
            <span style="padding-left: 20px;">= <strong style="color: #dc2626; font-size: 1.15em;">${formatNumber(totalProduction)} ${resource.icon} ${unitName}</strong></span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="calc-step">
      <div class="step-title">⚡ 步驟二：體力使用優先級 Stamina Usage Priority</div>
      <div class="step-highlight" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; font-size: 1.1em;">
        已選擇資源 Selected Resource: <strong style="font-size: 1.2em;">${displayName}</strong>
      </div>
      
      ${productionHTML}
      ${conversionNote}
      
      <div style="margin-top: 16px; padding: 16px; background: linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%); border-radius: 8px; border-left: 4px solid #667eea;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <span style="font-weight: bold; color: #1e40af; font-size: 1.1em;">📊 預計總產量 Expected Total Production:</span>
          <span style="font-weight: bold; color: #7c3aed; font-size: 1.3em;">${formatNumber(totalProduction)} ${resource.icon}</span>
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
  return `
    <div class="calc-step">
      <div class="step-title">🏭 步驟三：推車產量 Cart Production</div>
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
  `;
}

/**
 * 渲染秘境工具摘要
 * Render secret realm summary
 */
function renderSecretRealmSummary(secretRealm, totalHours) {
  let toolItemsHtml = '';
  
  secretRealm.tools.forEach(tool => {
    toolItemsHtml += `
      <div class="step-item">
        <span class="step-label">${tool.icon} ${tool.name_zh} ${tool.name} (${tool.count}個 × ${tool.valuePerTool}/hr):</span>
        <span class="step-value">${formatNumber(tool.totalProduction)}</span>
      </div>
    `;
  });

  return `
    <div class="calc-step">
      <div class="step-title">🔨 步驟四：秘境工具產量 Secret Realm Tool Production</div>
      <div class="production-breakdown">
        ${toolItemsHtml}
      </div>
    </div>
  `;
}

/**
 * 渲染羈絆冒險摘要
 * Render bond adventure summary
 */
function renderBondAdventureSummary(bondAdventure, daysRemaining) {
  const selectedStageText = `${bondAdventure.reward_per_run} 個優質凍乾 Premium freeze-dried per run`;

  return `
    <div class="calc-step">
      <div class="step-title">🎭 步驟四點五：羈絆冒險 Bond Adventure</div>
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
  `;
}

/**
 * 渲染升級需求摘要 - 移除升級明細，只保留資源計算
 * Render upgrade requirements summary - Remove upgrade details, keep only resource calculation
 */
function renderUpgradeRequirementsSummary(needed, breakdown, upgradeDetails) {
  return `
    <div class="calc-step">
      <div class="step-title">🎯 步驟五：升級需求匯總 Upgrade Requirements Summary</div>
      <div class="production-breakdown">
        
        <!-- 裝備分類 Gear Category -->
        <div class="category-breakdown">
          <div class="category-title">⚔️ 裝備 Gear (5件 items)</div>
          
          <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
            <strong>🧮 資源計算 Resource Calculation:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 2;">
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
        <div class="category-breakdown">
          <div class="category-title">✨ 古遺物 Relics (20個 items)</div>
          
          <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
            <strong>🧮 資源計算 Resource Calculation:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 2;">
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
        <div class="category-breakdown">
          <div class="category-title">📚 技能 Skills (8個 items)</div>
          
          <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
            <strong>🧮 資源計算 Resource Calculation:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 2;">
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
          <div class="category-title">🐾 幻獸 Pets (4隻 items)</div>
          
          <div class="formula" style="background: #fff7ed; padding: 12px; border-radius: 8px;">
            <strong>🧮 資源計算 Resource Calculation:</strong><br>
            <div style="padding-left: 16px; margin-top: 8px; line-height: 2;">
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
        
        <!-- 總需求 Total Requirements -->
        <div style="margin-top: 24px; padding: 20px; border-top: 3px solid var(--primary-color); background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px;">
          <div class="category-title" style="font-size: 1.3em; color: var(--primary-color); margin-bottom: 16px;">
            📊 總需求 Total Requirements
          </div>
          
          <div class="formula" style="background: #fff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <strong style="font-size: 1.1em;">🧮 總資源計算 Total Resource Calculation:</strong><br>
            <div style="padding-left: 16px; margin-top: 12px; line-height: 2.2;">
              <div style="color: #475569;">
                💰 <strong>總金幣 Total Gold:</strong><br>
                <span style="padding-left: 32px;">= 裝備金幣 Gear Gold + 古遺物金幣 Relic Gold</span><br>
                <span style="padding-left: 32px;">= ${formatNumber(breakdown.gear.gold)} + ${formatNumber(breakdown.relic.gold)}</span><br>
                <span style="padding-left: 32px; color: #dc2626; font-weight: bold; font-size: 1.1em;">= ${formatNumber(needed.gold)}</span>
              </div>
              <div style="color: #475569; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                🪨 <strong>總粗煉石 Total Refined Stone:</strong><br>
                <span style="padding-left: 32px;">= 裝備鐵錠 Gear Iron (converted)</span><br>
                <span style="padding-left: 32px; color: #dc2626; font-weight: bold; font-size: 1.1em;">= ${formatNumber(needed.refined_stone)}</span>
              </div>
              <div style="color: #475569; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                ⏳ <strong>總時之砂 Total Hourglass:</strong><br>
                <span style="padding-left: 32px;">= 古遺物時之砂 Relic Hourglass</span><br>
                <span style="padding-left: 32px; color: #dc2626; font-weight: bold; font-size: 1.1em;">= ${formatNumber(needed.hourglass)}</span>
              </div>
              <div style="color: #475569; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                📖 <strong>總歷戰精華 Total Battle Essence:</strong><br>
                <span style="padding-left: 32px;">= 技能歷戰精華 Skill Battle Essence</span><br>
                <span style="padding-left: 32px; color: #dc2626; font-weight: bold; font-size: 1.1em;">= ${formatNumber(needed.battle_essence)}</span>
              </div>
              <div style="color: #475569; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
                🥩 <strong>總凍乾經驗值 Total Freeze-dried EXP:</strong><br>
                <span style="padding-left: 32px;">= 幻獸凍乾經驗值 Pet Freeze-dried EXP</span><br>
                <span style="padding-left: 32px; color: #dc2626; font-weight: bold; font-size: 1.1em;">= ${formatNumber(needed.freeze_dried)}</span>
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
            <div class="step-item" style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #fbbf24;">
              <span class="step-label">💰 金幣 Gold:</span>
              <span class="step-value" style="font-weight: bold; color: var(--danger-color); font-size: 1.2em;">${formatNumber(needed.gold)}</span>
            </div>
            <div class="step-item" style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
              <span class="step-label">🪨 粗煉石 Refined Stone:</span>
              <span class="step-value" style="font-weight: bold; color: var(--danger-color); font-size: 1.2em;">${formatNumber(needed.refined_stone)}</span>
            </div>
            <div class="step-item" style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #06b6d4;">
              <span class="step-label">⏳ 時之砂 Hourglass:</span>
              <span class="step-value" style="font-weight: bold; color: var(--danger-color); font-size: 1.2em;">${formatNumber(needed.hourglass)}</span>
            </div>
            <div class="step-item" style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #f97316;">
              <span class="step-label">📖 歷戰精華 Battle Essence:</span>
              <span class="step-value" style="font-weight: bold; color: var(--danger-color); font-size: 1.2em;">${formatNumber(needed.battle_essence)}</span>
            </div>
            <div class="step-item" style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #ec4899;">
              <span class="step-label">🥩 凍乾經驗值 Freeze-dried EXP:</span>
              <span class="step-value" style="font-weight: bold; color: var(--danger-color); font-size: 1.2em;">${formatNumber(needed.freeze_dried)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
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
 * 生成資源對比 HTML
 * Generate resource comparison HTML
 */
function generateResourceComparison(results) {
  const resources = [
    {
      key: 'gold',
      icon: '💰',
      name: '金幣',
      nameEn: 'Gold',
      needed: results.upgradeNeeds.needs.gold,
      produced: results.totalProduction.gold
    },
    {
      key: 'refined_stone',
      icon: '🪨',
      name: '粗煉石',
      nameEn: 'Refined Stone',
      needed: results.upgradeNeeds.needs.refined_stone,
      produced: results.totalProduction.refined_stone
    },
    {
      key: 'hourglass',
      icon: '⏳',
      name: '時之砂',
      nameEn: 'Hourglass',
      needed: results.upgradeNeeds.needs.hourglass,
      produced: results.totalProduction.hourglass
    },
    {
      key: 'battle_essence',
      icon: '📖',
      name: '歷戰精華',
      nameEn: 'Battle Essence',
      needed: results.upgradeNeeds.needs.battle_essence,
      produced: results.totalProduction.battle_essence
    },
    {
      key: 'freeze_dried',
      icon: '🥩',
      name: '凍乾經驗值',
      nameEn: 'Freeze-dried EXP',
      needed: results.upgradeNeeds.needs.freeze_dried,
      produced: results.totalProduction.freeze_dried
    }
  ];

  let html = '';

  resources.forEach(resource => {
    if (resource.needed === 0 && resource.produced === 0) return;

    const difference = resource.produced - resource.needed;
    const isSufficient = difference >= 0;
    const statusClass = isSufficient ? 'sufficient' : 'insufficient';
    const statusIcon = isSufficient ? '✅' : '❌';
    const statusText = isSufficient ? '充足 Sufficient' : '不足 Insufficient';

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
      </div>
    `;
  });

  return html;
}

console.log('Upgrade Templates JS loaded successfully');