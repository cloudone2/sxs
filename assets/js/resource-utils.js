/**
 * Resource Utils - Utility Functions
 * Helper functions for theme updates, formatting, and localization
 */

/**
 * Update season theme color
 */
function updateSeasonTheme(themeColor) {
  document.documentElement.style.setProperty('--theme-primary', themeColor);
  document.body.classList.add('season-theme');
  
  // Update CSS variables for gradient
  const r = parseInt(themeColor.slice(1, 3), 16);
  const g = parseInt(themeColor.slice(3, 5), 16);
  const b = parseInt(themeColor.slice(5, 7), 16);
  
  // Create a slightly different secondary color
  const r2 = Math.min(255, r + 30);
  const g2 = Math.max(0, g - 20);
  const b2 = Math.min(255, b + 30);
  
  const secondaryColor = `rgb(${r2}, ${g2}, ${b2})`;
  const gradient = `linear-gradient(135deg, ${themeColor} 0%, ${secondaryColor} 100%)`;
  
  document.documentElement.style.setProperty('--theme-gradient', gradient);
}

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format datetime for input[type="datetime-local"]
 */
function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Get item name (localized)
 */
function getItemName(category, index, lang = 'zh') {
  const itemNames = {
    gear: {
      zh: ['武器', '頭盔', '胸甲', '護腿', '靴子'],
      en: ['Weapon', 'Helmet', 'Chest', 'Legs', 'Boots']
    },
    skill: {
      zh: ['技能1', '技能2', '技能3', '技能4', '技能5', '技能6', '技能7', '技能8'],
      en: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5', 'Skill 6', 'Skill 7', 'Skill 8']
    },
    relic: {
      zh: ['古遺物'],
      en: ['Relic']
    },
    pet: {
      zh: ['幻獸1', '幻獸2', '幻獸3', '幻獸4'],
      en: ['Pet 1', 'Pet 2', 'Pet 3', 'Pet 4']
    }
  };
  
  if (itemNames[category] && itemNames[category][lang]) {
    return itemNames[category][lang][index - 1] || `${category} ${index}`;
  }
  
  return `${category} ${index}`;
}

/**
 * Parse integer safely
 */
function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse float safely
 */
function safeParseFloat(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Debounce function for input events
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show loading state
 */
function showLoading(element) {
  if (element) {
    element.classList.add('loading');
    element.disabled = true;
  }
}

/**
 * Hide loading state
 */
function hideLoading(element) {
  if (element) {
    element.classList.remove('loading');
    element.disabled = false;
  }
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('已複製到剪貼簿 / Copied to clipboard');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('已複製到剪貼簿 / Copied to clipboard');
  }
}

/**
 * Download data as JSON file
 */
function downloadJSON(data, filename = 'calculation-results.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Validate date range
 */
function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: '日期格式無效 / Invalid date format' };
  }
  
  if (end < start) {
    return { valid: false, message: '結束日期不能早於開始日期 / End date cannot be before start date' };
  }
  
  return { valid: true };
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  return lang.startsWith('zh') ? 'zh' : 'en';
}

/**
 * Toggle element visibility
 */
function toggleVisibility(element, show) {
  if (element) {
    element.style.display = show ? 'block' : 'none';
  }
}

/**
 * Format percentage
 */
function formatPercentage(value, total) {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

/**
 * Calculate percentage
 */
function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Clamp number between min and max
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate unique ID
 */
function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Log calculation for debugging
 */
function logCalculation(label, data) {
  if (window.DEBUG_MODE) {
    console.group(label);
    console.table(data);
    console.groupEnd();
  }
}

/**
 * Export utility for external use
 */
window.ResourceUtils = {
  updateSeasonTheme,
  formatNumber,
  formatDateTimeLocal,
  getItemName,
  safeParseInt,
  safeParseFloat,
  debounce,
  showLoading,
  hideLoading,
  smoothScrollTo,
  copyToClipboard,
  downloadJSON,
  validateDateRange,
  getBrowserLanguage,
  toggleVisibility,
  formatPercentage,
  calculatePercentage,
  clamp,
  generateUniqueId,
  logCalculation
};