/**
 * 更新主題顏色
 * Update theme color based on season
 */
function updateSeasonTheme(seasonId) {
  const seasons = window.SEASONS || [];
  const season = seasons.find(s => s.id === seasonId);
  
  if (season && season.theme_color) {
    const color = season.theme_color;
    const root = document.documentElement;
    
    // Convert hex to RGB
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    
    // Calculate lighter and darker shades
    const lighten = (val) => Math.min(255, val + 40);
    const darken = (val) => Math.max(0, val - 40);
    
    const lightR = lighten(r);
    const lightG = lighten(g);
    const lightB = lighten(b);
    
    const darkR = darken(r);
    const darkG = darken(g);
    const darkB = darken(b);
    
    // Update CSS variables
    root.style.setProperty('--season-color', color);
    root.style.setProperty('--season-color-light', `rgb(${lightR}, ${lightG}, ${lightB})`);
    root.style.setProperty('--season-color-dark', `rgb(${darkR}, ${darkG}, ${darkB})`);
    root.style.setProperty('--season-color-rgb', `${r}, ${g}, ${b}`);
    
    console.log(`Theme updated for ${seasonId}: ${color}`);
  }
}

/**
 * 工具函數 Utility Functions
 */

/**
 * 格式化數字（千分位）
 * Format number with thousands separator
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 四捨五入到指定小數位
 * Round to specified decimal places
 */
function roundTo(num, decimals = 0) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * 獲取項目名稱
 * Get item name
 */
function getItemName(type, index) {
  const names = {
    gear: [
      '🪖 頭盔 Helmet',
      '👕 鎧甲 Armor',
      '👢 戰靴 Boots',
      '⚔️ 武器 Weapon',
      '🛡️ 副武器 Off-hand/Shield'
    ],
    skill: [
      '📘 技能1 Skill 1',
      '📘 技能2 Skill 2',
      '📘 技能3 Skill 3',
      '📘 技能4 Skill 4',
      '📘 技能5 Skill 5',
      '📘 技能6 Skill 6',
      '📘 技能7 Skill 7',
      '📘 技能8 Skill 8'
    ],
    relic: Array.from({ length: 20 }, (_, i) => `✨ 古遺物${i + 1} Relic ${i + 1}`),
    pet: [
      '🐾 幻獸1 Pet 1',
      '🐾 幻獸2 Pet 2',
      '🐾 幻獸3 Pet 3',
      '🐾 幻獸4 Pet 4'
    ]
  };

  if (names[type] && names[type][index - 1]) {
    return names[type][index - 1];
  }

  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`;
}

/**
 * 獲取資源列表
 * Get resources for type
 */
function getResourcesForType(type, item) {
  const resources = [];

  switch (type) {
    case 'gear':
      if (item.gold && item.gold > 0) {
        resources.push(`💰${formatNumber(item.gold)}`);
      }
      if (item.refined_stone && item.refined_stone > 0) {
        resources.push(`🪨${formatNumber(item.refined_stone)}`);
      }
      break;
    case 'skill':
      if (item.battle_record && item.battle_record > 0) {
        resources.push(`📖${formatNumber(item.battle_record)}`);
      }
      break;
    case 'relic':
      if (item.gold && item.gold > 0) {
        resources.push(`💰${formatNumber(item.gold)}`);
      }
      if (item.hourglass && item.hourglass > 0) {
        resources.push(`⏳${formatNumber(item.hourglass)}`);
      }
      break;
    case 'pet':
      if (item.freeze_dried && item.freeze_dried > 0) {
        resources.push(`🥩${formatNumber(item.freeze_dried)} EXP`);
      }
      break;
  }

  return resources;
}