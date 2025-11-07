---
layout: default
title: Skill calculator
---

<section class="container py-4" id="container-skill-table">
  <div class="calculator-header mb-4">
    <h2 class="mb-3">技能升級計算器<br><span class="text-muted fs-5 fw-normal">Skill Upgrade Calculator</span></h2>
    <div class="row g-3">
      <div class="col-6">
        <button id="add-skill-btn" class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
          <span>➕</span> 新增技能
        </button>
      </div>
      <div class="col-6">
        <button id="reset-all-btn" class="btn btn-secondary w-100">
          🔄 全部重置
        </button>
      </div>
    </div>
  </div>

  <div id="skill-tables-container" class="d-flex flex-column gap-4 mb-4">
    <!-- Skill tables will be inserted here -->
  </div>

  <div class="summary-panel bg-light border rounded-3 p-4 shadow-sm">
    <h3 class="mb-4 text-secondary">總計概覽 / Total Summary</h3>
    
    <div class="row g-3 mb-4">
      <div class="col-4">
        <div class="card text-center h-100">
          <div class="card-body">
            <div class="text-muted small mb-2">技能數量</div>
            <div class="fs-2 fw-bold text-primary" id="total-skills">0</div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center h-100">
          <div class="card-body">
            <div class="text-muted small mb-2">升級次數</div>
            <div class="fs-2 fw-bold text-primary" id="total-upgrades">0</div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center h-100 bg-warning text-white">
          <div class="card-body">
            <div class="small mb-2 opacity-75">總消耗碎片</div>
            <div class="fs-2 fw-bold" id="grand-total">0</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inventory-section mb-4">
      <h5 class="mb-3 text-secondary">📋 己有資源 / Current Inventory</h5>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-warning">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">🎫</div>
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">技能券</div>
                <div class="text-muted small">1 券 = 30 碎片</div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <input type="number" id="owned-vouchers" class="form-control text-center fw-bold" style="width: 90px;" value="0" min="0">
                <span class="fw-semibold text-dark">張</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-info">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">📦</div>
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">碎片技能箱</div>
                <div class="text-muted small">1 箱 = 1 碎片</div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <input type="number" id="owned-boxes" class="form-control text-center fw-bold" style="width: 90px;" value="0" min="0">
                <span class="fw-semibold text-dark">個</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="conversion-section mb-4">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card text-white" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">🎫</div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-5">技能券需求</div>
                <div class="small" style="opacity: 0.9;">1 券 = 30 碎片</div>
              </div>
              <div class="text-end">
                <div class="small" style="opacity: 0.9;">需要</div>
                <div class="display-5 fw-bold" id="voucher-count">0</div>
                <div class="small">張</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card text-white" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">📦</div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-5">碎片箱需求</div>
                <div class="small" style="opacity: 0.9;">1 箱 = 1 碎片</div>
              </div>
              <div class="text-end">
                <div class="small" style="opacity: 0.9;">需要</div>
                <div class="display-5 fw-bold" id="box-count">0</div>
                <div class="small">個</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="balance-section mb-4">
      <div class="card text-white shadow" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="fs-2">💰</div>
            <h5 class="mb-0 fw-bold">資源結算 / Resource Balance</h5>
          </div>
          
          <div class="rounded p-3" style="background-color: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);">
            <div class="d-flex justify-content-between align-items-center py-2">
              <span style="opacity: 0.95;">己有資源換算:</span>
              <div>
                <span class="fs-4 fw-bold mx-2" id="total-owned-fragments">0</span>
                <span class="small" style="opacity: 0.9;">碎片</span>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center py-2">
              <span style="opacity: 0.95;">需要碎片:</span>
              <div>
                <span class="fs-4 fw-bold mx-2" id="total-needed-fragments">0</span>
                <span class="small" style="opacity: 0.9;">碎片</span>
              </div>
            </div>
            
            <hr class="border-white my-3" style="opacity: 0.3;">
            
            <div class="d-flex justify-content-between align-items-center py-2" id="balance-result-row">
              <span class="fs-5 fw-bold">剩餘:</span>
              <div>
                <span class="display-6 fw-bold mx-2" id="balance-result">0</span>
                <span class="fw-semibold">碎片</span>
              </div>
            </div>
            
            <div id="draws-needed-section" class="mt-4" style="display: none;">
              <hr class="border-white mb-3" style="opacity: 0.3;">
              <div class="fw-bold mb-3" style="opacity: 0.95;">還需抽取次數:</div>
              <div class="row g-2">
                <div class="col-md-4">
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #60a5fa !important;">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <span class="fs-4">🔵</span>
                      <div class="flex-grow-1">
                        <div class="fw-bold">稀有</div>
                        <div class="small" style="opacity: 0.85;">(10碎片/次)</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-end">
                      <span class="display-6 fw-bold" id="draws-rare">0</span>
                      <span class="ms-2">次</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #c084fc !important;">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <span class="fs-4">🟣</span>
                      <div class="flex-grow-1">
                        <div class="fw-bold">史詩</div>
                        <div class="small" style="opacity: 0.85;">(30碎片/次)</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-end">
                      <span class="display-6 fw-bold" id="draws-epic">0</span>
                      <span class="ms-2">次</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #fb923c !important;">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <span class="fs-4">🟠</span>
                      <div class="flex-grow-1">
                        <div class="fw-bold">傳說</div>
                        <div class="small" style="opacity: 0.85;">(90碎片/次)</div>
                      </div>
                    </div>
                    <div class="d-flex align-items-baseline justify-content-end">
                      <span class="display-6 fw-bold" id="draws-legendary">0</span>
                      <span class="ms-2">次</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="summary-content" class="bg-white rounded p-3">
      <p class="text-muted fst-italic text-center mb-0">尚未選擇任何升級 / No upgrades selected yet</p>
    </div>
  </div>
</section>

<!-- Template for skill table -->
<template id="skill-table-template">
  <div class="skill-table-wrapper card shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom gap-3 flex-wrap flex-md-nowrap">
        <div class="flex-grow-1" style="min-width: 0;">
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <input type="text" class="form-control fw-bold skill-name-input" placeholder="技能名稱">
            </div>
            <div class="col-12 col-md-6">
              <select class="form-select fw-semibold skill-rarity-select">
                <option value="rare">稀有 (10碎片)</option>
                <option value="epic">史詩 (30碎片)</option>
                <option value="legendary">傳說 (90碎片)</option>
              </select>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-3 small skill-info-display">
            <span class="text-muted">消耗: <strong class="text-success skill-cost">0</strong> 碎片</span>
            <span class="text-muted">需抽取: <strong class="text-primary skill-draws">0</strong> 次</span>
            <span class="text-warning">🎫 <strong class="skill-vouchers">0</strong> 張</span>
            <span class="text-info">📦 <strong class="skill-boxes">0</strong> 個</span>
          </div>
        </div>
        <div class="d-flex gap-2 flex-shrink-0">
          <button class="btn btn-outline-primary btn-sm btn-collapse" type="button" title="收合/展開">
            <span class="collapse-icon">▼</span>
          </button>
          <button class="btn btn-danger btn-sm btn-remove" title="刪除">❌</button>
        </div>
      </div>
      
      <div class="table-collapse-wrapper">
        <div class="table-responsive">
          <table class="table table-bordered table-hover skill-table mb-0">
            <thead style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);" class="text-white">
              <tr>
                <th class="text-center align-middle" style="min-width: 60px;">品質</th>
                {% for i in (0..9) %}
                  <th class="text-center small" style="min-width: 70px;">Lv {{ i }}→{{ i | plus: 1 }}</th>
                {% endfor %}
                <th class="text-center fw-bold" style="min-width: 90px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">總計</th>
              </tr>
            </thead>
            <tbody>
              {% for skill in site.data.skills.skills %}
              <tr data-skill="{{ skill.name }}" data-skill-c="{{ skill.name_c }}">
                <td class="text-center fw-bold text-white" style="{% if skill.color contains 'gradient' %}background: {{ skill.color }}{% else %}background-color: {{ skill.color }}{% endif %}">
                  <small>{{ skill.name_c }}</small>
                </td>
                {% assign total = 0 %}
                {% for level in skill.levels %}
                  <td class="text-center cost-cell" data-cost="{{ level.cost }}" data-level="{{ forloop.index0 }}">
                    <div class="d-flex flex-column align-items-center gap-1 cell-content">
                      <input type="checkbox" class="form-check-input level-checkbox m-0">
                      <small class="cost-value">{{ level.cost }}</small>
                    </div>
                  </td>
                  {% assign total = total | plus: level.cost %}
                {% endfor %}
                {% assign remaining = 10 | minus: skill.levels.size %}
                {% for i in (1..remaining) %}
                  <td class="text-center text-muted bg-light">—</td>
                {% endfor %}
                <td class="text-center fw-bold" style="background-color: #fef3c7;">
                  <span class="skill-row-total text-success">0</span><span class="text-muted small">/</span><span class="skill-row-max text-muted small">{{ total }}</span>
                </td>
              </tr>
              {% endfor %}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.skill-table-wrapper {
  transition: all 0.3s;
}

.skill-table-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
}

.skill-table {
  font-size: 0.875rem;
}

.skill-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.cost-cell {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
  cursor: pointer;
  user-select: none;
}

.cost-cell:hover {
  background-color: #e9ecef;
}

.cost-cell.selected {
  background-color: #d4edda !important;
  font-weight: bold;
}

.cost-cell .cell-content {
  pointer-events: none;
}

.level-checkbox {
  width: 18px;
  height: 18px;
  pointer-events: none;
}

#balance-result-row.positive #balance-result {
  color: #10b981 !important;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
}

#balance-result-row.negative #balance-result {
  color: #ef4444 !important;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
}

.summary-skill-card {
  border-left: 4px solid;
}

.summary-skill-card.rare {
  border-left-color: #4A90E2;
  background: linear-gradient(90deg, rgba(74, 144, 226, 0.1) 0%, #f8f9fa 20%);
}

.summary-skill-card.epic {
  border-left-color: #9B59B6;
  background: linear-gradient(90deg, rgba(155, 89, 182, 0.1) 0%, #f8f9fa 20%);
}

.summary-skill-card.legendary {
  border-left-color: #E67E22;
  background: linear-gradient(90deg, rgba(230, 126, 34, 0.1) 0%, #f8f9fa 20%);
}

.table-collapse-wrapper {
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 1;
}

.table-collapse-wrapper.collapsed {
  max-height: 0;
  opacity: 0;
}

.btn-collapse {
  transition: transform 0.3s ease;
}

.btn-collapse .collapse-icon {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.9rem;
}

.btn-collapse.collapsed .collapse-icon {
  transform: rotate(-90deg);
}

@media (max-width: 767.98px) {
  .skill-table {
    font-size: 0.75rem;
  }
  
  .level-checkbox {
    width: 16px;
    height: 16px;
  }
  
  .cost-value {
    font-size: 0.7rem;
  }
  
  .display-5 {
    font-size: 2rem !important;
  }
  
  .display-6 {
    font-size: 1.5rem !important;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('skill-tables-container');
  const template = document.getElementById('skill-table-template');
  const addBtn = document.getElementById('add-skill-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');
  const ownedVouchersInput = document.getElementById('owned-vouchers');
  const ownedBoxesInput = document.getElementById('owned-boxes');
  
  let skillCounter = 0;
  
  const FRAGMENTS_PER_DRAW = {
    rare: 10,
    epic: 30,
    legendary: 90
  };

  const VOUCHER_VALUE = 30;
  const BOX_VALUE = 1;
  
  const QUALITY_COLORS = {
    '稀有': '#4A90E2',
    '史詩': '#9B59B6',
    '傳說': '#E67E22',
    '奇蹟': '#F1C40F',
    '神話': '#E74C3C',
    '不朽': 'linear-gradient(90deg, #ee5a6f 0%, #f29263 100%)'
  };
  
  function addSkillTable() {
    skillCounter++;
    const clone = template.content.cloneNode(true);
    const wrapper = clone.querySelector('.skill-table-wrapper');
    wrapper.dataset.skillId = skillCounter;
    
    const nameInput = clone.querySelector('.skill-name-input');
    nameInput.placeholder = `技能 #${skillCounter}`;
    nameInput.value = `技能 #${skillCounter}`;
    
    // Add click event to entire cell
    const costCells = clone.querySelectorAll('.cost-cell');
    costCells.forEach(cell => {
      cell.addEventListener('click', function(e) {
        const checkbox = this.querySelector('.level-checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          
          if (checkbox.checked) {
            this.classList.add('selected');
          } else {
            this.classList.remove('selected');
          }
          
          const currentWrapper = this.closest('.skill-table-wrapper');
          updateTableCalculations(currentWrapper);
          updateGrandTotal();
        }
      });
    });
    
    clone.querySelector('.skill-rarity-select').addEventListener('change', function() {
      const currentWrapper = this.closest('.skill-table-wrapper');
      updateTableCalculations(currentWrapper);
      updateGrandTotal();
    });
    
    clone.querySelector('.btn-collapse').addEventListener('click', function() {
      const currentWrapper = this.closest('.skill-table-wrapper');
      const collapseWrapper = currentWrapper.querySelector('.table-collapse-wrapper');
      const isCollapsed = collapseWrapper.classList.contains('collapsed');
      
      if (isCollapsed) {
        collapseWrapper.classList.remove('collapsed');
        this.classList.remove('collapsed');
      } else {
        collapseWrapper.classList.add('collapsed');
        this.classList.add('collapsed');
      }
    });
    
    clone.querySelector('.btn-remove').addEventListener('click', function() {
      if (confirm('確定要刪除此技能嗎？')) {
        const currentWrapper = this.closest('.skill-table-wrapper');
        currentWrapper.remove();
        updateGrandTotal();
      }
    });
    
    nameInput.addEventListener('input', updateGrandTotal);
    
    container.appendChild(clone);
    updateGrandTotal();
    
    setTimeout(() => {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  function updateTableCalculations(wrapper) {
    if (!wrapper) return { total: 0, rarity: 'rare', drawsNeeded: 0, vouchersNeeded: 0, boxesNeeded: 0, qualitiesUsed: [] };
    
    let total = 0;
    const qualitiesUsed = new Set();
    
    wrapper.querySelectorAll('tbody tr').forEach(row => {
      let skillTotal = 0;
      
      row.querySelectorAll('.level-checkbox:checked').forEach(checkbox => {
        const cell = checkbox.closest('.cost-cell');
        const cost = parseInt(cell.dataset.cost) || 0;
        skillTotal += cost;
        
        const qualityName = row.dataset.skillC;
        if (qualityName) {
          qualitiesUsed.add(qualityName);
        }
      });
      
      const rowTotalElement = row.querySelector('.skill-row-total');
      if (rowTotalElement) {
        rowTotalElement.textContent = skillTotal;
      }
      total += skillTotal;
    });
    
    const costElement = wrapper.querySelector('.skill-cost');
    if (costElement) costElement.textContent = total;
    
    const raritySelect = wrapper.querySelector('.skill-rarity-select');
    const rarity = raritySelect ? raritySelect.value : 'rare';
    const fragmentsPerDraw = FRAGMENTS_PER_DRAW[rarity];
    const drawsNeeded = total > 0 ? Math.ceil(total / fragmentsPerDraw) : 0;
    
    const drawsElement = wrapper.querySelector('.skill-draws');
    if (drawsElement) drawsElement.textContent = drawsNeeded;

    const vouchersNeeded = total > 0 ? Math.ceil(total / VOUCHER_VALUE) : 0;
    const vouchersElement = wrapper.querySelector('.skill-vouchers');
    if (vouchersElement) vouchersElement.textContent = vouchersNeeded;

    const boxesNeeded = total;
    const boxesElement = wrapper.querySelector('.skill-boxes');
    if (boxesElement) boxesElement.textContent = boxesNeeded;
    
    return { total, rarity, drawsNeeded, vouchersNeeded, boxesNeeded, qualitiesUsed: Array.from(qualitiesUsed) };
  }
  
  function updateGrandTotal() {
    let grandTotal = 0;
    let totalUpgrades = 0;
    let totalVouchers = 0;
    let totalBoxes = 0;
    const skillBreakdown = [];
    
    document.querySelectorAll('.skill-table-wrapper').forEach(wrapper => {
      const { total, rarity, drawsNeeded, vouchersNeeded, boxesNeeded, qualitiesUsed } = updateTableCalculations(wrapper);
      const nameInput = wrapper.querySelector('.skill-name-input');
      const skillName = nameInput ? nameInput.value || 'Unnamed Skill' : 'Unnamed Skill';
      const upgrades = wrapper.querySelectorAll('.level-checkbox:checked').length;
      
      if (total > 0) {
        skillBreakdown.push({
          name: skillName,
          cost: total,
          upgrades: upgrades,
          rarity: rarity,
          drawsNeeded: drawsNeeded,
          vouchersNeeded: vouchersNeeded,
          boxesNeeded: boxesNeeded,
          qualities: qualitiesUsed
        });
      }
      
      grandTotal += total;
      totalUpgrades += upgrades;
      totalVouchers += vouchersNeeded;
      totalBoxes += boxesNeeded;
    });
    
    document.getElementById('total-skills').textContent = document.querySelectorAll('.skill-table-wrapper').length;
    document.getElementById('total-upgrades').textContent = totalUpgrades;
    document.getElementById('grand-total').textContent = grandTotal;
    document.getElementById('voucher-count').textContent = totalVouchers;
    document.getElementById('box-count').textContent = totalBoxes;
    
    updateBalanceCalculations(grandTotal);
    updateSummary(skillBreakdown, grandTotal);
  }
  
  function updateBalanceCalculations(neededFragments) {
    const ownedVouchers = parseInt(ownedVouchersInput.value) || 0;
    const ownedBoxes = parseInt(ownedBoxesInput.value) || 0;
    
    const voucherFragments = ownedVouchers * VOUCHER_VALUE;
    const boxFragments = ownedBoxes * BOX_VALUE;
    const totalOwnedFragments = voucherFragments + boxFragments;
    
    const balance = totalOwnedFragments - neededFragments;
    
    document.getElementById('total-owned-fragments').textContent = totalOwnedFragments;
    document.getElementById('total-needed-fragments').textContent = neededFragments;
    document.getElementById('balance-result').textContent = balance;
    
    const resultRow = document.getElementById('balance-result-row');
    resultRow.classList.remove('positive', 'negative');
    if (balance > 0) {
      resultRow.classList.add('positive');
    } else if (balance < 0) {
      resultRow.classList.add('negative');
    }
    
    const drawsSection = document.getElementById('draws-needed-section');
    if (balance < 0) {
      const fragmentsNeeded = Math.abs(balance);
      
      const drawsRare = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.rare);
      const drawsEpic = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.epic);
      const drawsLegendary = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.legendary);
      
      document.getElementById('draws-rare').textContent = drawsRare;
      document.getElementById('draws-epic').textContent = drawsEpic;
      document.getElementById('draws-legendary').textContent = drawsLegendary;
      
      drawsSection.style.display = 'block';
    } else {
      drawsSection.style.display = 'none';
    }
  }
  
  function updateSummary(breakdown, total) {
    const summaryContent = document.getElementById('summary-content');
    
    if (breakdown.length === 0) {
      summaryContent.innerHTML = '<p class="text-muted fst-italic text-center mb-0">尚未選擇任何升級 / No upgrades selected yet</p>';
      return;
    }
    
    let html = '<div class="d-flex flex-column gap-3">';
    breakdown.forEach(skill => {
      const rarityText = {
        rare: '稀有',
        epic: '史詩',
        legendary: '傳說'
      }[skill.rarity];
      
      html += `
        <div class="summary-skill-card card ${skill.rarity} p-3">
          <div class="fw-bold mb-2 text-dark">${skill.name} (${rarityText})</div>
          <div class="d-flex flex-wrap gap-3 small text-muted">
            <span>${skill.upgrades} 次升級</span>
            <span class="text-success fw-bold">${skill.cost} 碎片</span>
            <span class="text-primary fw-bold">抽 ${skill.drawsNeeded} 次</span>
            <span class="text-warning fw-bold">🎫 ${skill.vouchersNeeded}</span>
            <span class="text-info fw-bold">📦 ${skill.boxesNeeded}</span>
          </div>
      `;
      
      if (skill.qualities && skill.qualities.length > 0) {
        html += '<div class="d-flex flex-wrap gap-2 mt-2">';
        skill.qualities.forEach(quality => {
          const bgColor = QUALITY_COLORS[quality];
          const style = bgColor && bgColor.includes('gradient') 
            ? `style="background: ${bgColor};"` 
            : `style="background-color: ${bgColor};"`;
          html += `<span class="badge text-white" ${style}>${quality}</span>`;
        });
        html += '</div>';
      }
      
      html += '</div>';
    });
    html += '</div>';
    
    summaryContent.innerHTML = html;
  }
  
  addBtn.addEventListener('click', addSkillTable);
  
  resetAllBtn.addEventListener('click', function() {
    if (confirm('確定要重置所有技能嗎？')) {
      container.innerHTML = '';
      skillCounter = 0;
      ownedVouchersInput.value = 0;
      ownedBoxesInput.value = 0;
      updateGrandTotal();
    }
  });
  
  ownedVouchersInput.addEventListener('input', function() {
    const neededFragments = parseInt(document.getElementById('grand-total').textContent) || 0;
    updateBalanceCalculations(neededFragments);
  });
  
  ownedBoxesInput.addEventListener('input', function() {
    const neededFragments = parseInt(document.getElementById('grand-total').textContent) || 0;
    updateBalanceCalculations(neededFragments);
  });
  
  addSkillTable();
});
</script>