---
layout: default
title: 技能升級計算器
---

<section class="container py-4" id="container-skill-table">
  <div class="calculator-header mb-4">
    <h2 class="mb-3">技能升級計算器<br><span class="text-muted fs-5 fw-normal">Skill Upgrade Calculator</span></h2>
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <label class="form-label fw-bold">選擇職業 / Select Class</label>
        <select id="global-class-select" class="form-select form-select-lg">
          <option value="">全部職業 / All Classes</option>
          <option value="鬥士">🗡️ 鬥士 (Fighter)</option>
          <option value="騎士">🛡️ 騎士 (Knight)</option>
          <option value="術士">🔮 術士 (Mage)</option>
          <option value="賢者">📜 賢者 (Sage)</option>
        </select>
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label fw-bold opacity-0 d-none d-md-block">.</label>
        <button id="add-skill-btn" class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
          <span>➕</span> 新增技能
        </button>
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label fw-bold opacity-0 d-none d-md-block">.</label>
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
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="mb-0 text-secondary">📋 己有資源 / Current Inventory</h5>
      </div>
      
      <div class="alert alert-info mb-3" role="alert">
        <div class="small">
          <div class="fw-bold mb-2">💡 賽季碎片獲取(白嫖)參考：</div>
          <div class="mb-1">
            <span class="badge bg-primary me-2">S3</span>
            <span>五轉 <strong>810碎片</strong></span>
            <span class="text-muted ms-2">(秘寶180×3 + 賽季任務90×3)</span>
          </div>
          <div>
            <span class="badge bg-secondary me-2">S2</span>
            <span>四轉 <strong>720碎片</strong></span>
            <span class="text-muted ms-2">(秘寶180×3 + 賽季任務90×2)</span>
          </div>
        </div>
      </div>

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
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #4A90E2 !important;">
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
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #9B59B6 !important;">
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
                  <div class="rounded p-3 border-start border-4" style="background-color: rgba(255, 255, 255, 0.2); border-color: #E67E22 !important;">
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
            <div class="col-12">
              <select class="form-select fw-bold skill-name-select">
                <option value="">選擇技能 / Select Skill</option>
              </select>
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white">💎 已持有碎片</span>
                <input type="number" class="form-control owned-fragments-input" value="0" min="0">
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center gap-2 small text-muted">
                <span class="skill-net-cost-label">還需: <strong class="text-danger skill-net-cost">0</strong> 碎片</span>
              </div>
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
                <th class="text-center align-middle" style="min-width: 80px;">
                  <div>品質</div>
                  <div class="small opacity-75">(碎片)</div>
                </th>
                {% for i in (0..9) %}
                  <th class="text-center small" style="min-width: 70px;">Lv {{ i }}→{{ i | plus: 1 }}</th>
                {% endfor %}
                <th class="text-center fw-bold" style="min-width: 90px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">總計</th>
              </tr>
            </thead>
            <tbody>
              {% for spec in site.data.skills.skill_spec %}
              <tr data-skill="{{ spec.name }}" data-skill-c="{{ spec.name_c }}" data-skill-color="{{ spec.color }}">
                <td class="text-center fw-bold text-white" style="{% if spec.color contains 'gradient' %}background: {{ spec.color }}{% else %}background-color: {{ spec.color }}{% endif %}">
                  <div>{{ spec.name_c }}</div>
                  {% if site.data.skills.fragment_costs[spec.name] %}
                  <div class="small opacity-90">({{ site.data.skills.fragment_costs[spec.name] }})</div>
                  {% endif %}
                </td>
                {% assign total = 0 %}
                {% for level in spec.levels %}
                  <td class="text-center cost-cell" data-cost="{{ level.cost }}" data-level="{{ forloop.index0 }}">
                    <div class="d-flex flex-column align-items-center gap-1 cell-content">
                      <input type="checkbox" class="form-check-input level-checkbox m-0">
                      <small class="cost-value">{{ level.cost }}</small>
                    </div>
                  </td>
                  {% assign total = total | plus: level.cost %}
                {% endfor %}
                {% assign remaining = 10 | minus: spec.levels.size %}
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
  transition: all 0.2s;
}

.summary-skill-card:hover {
  transform: translateX(5px);
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

.summary-skill-card.miracle {
  border-left-color: #F1C40F;
  background: linear-gradient(90deg, rgba(241, 196, 15, 0.1) 0%, #f8f9fa 20%);
}

.summary-skill-card.myth {
  border-left-color: #E74C3C;
  background: linear-gradient(90deg, rgba(231, 76, 60, 0.1) 0%, #f8f9fa 20%);
}

.summary-skill-card.immortal {
  border-left-color: #ee5a6f;
  background: linear-gradient(90deg, rgba(238, 90, 111, 0.1) 0%, #f8f9fa 20%);
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

.owned-fragments-input {
  font-weight: bold;
}

.skill-net-cost-label {
  white-space: nowrap;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

.alert-info .badge {
  font-size: 0.75rem;
  padding: 0.25em 0.5em;
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
  
  .alert-info {
    font-size: 0.85rem;
  }
}
</style>

<script>
// Inject skills data from Jekyll into JavaScript
const SKILL_SPEC_DATA = {
  {% for spec in site.data.skills.skill_spec %}
  "{{ spec.name }}": {
    name: "{{ spec.name }}",
    name_c: "{{ spec.name_c }}",
    color: "{{ spec.color }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

const FRAGMENTS_PER_DRAW = {
  rare: 10,
  epic: 30,
  legendary: 90
};

const QUALITY_COLORS = {
  {% for spec in site.data.skills.skill_spec %}
  "{{ spec.name_c }}": "{{ spec.color }}"{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

// Store all skills data
const ALL_SKILLS = [
  {% for skill in site.data.skills.skill_list %}
  {
    name: "{{ skill.name }}",
    name_c: "{{ skill.name_c }}",
    class: "{{ skill.class }}",
    class_level: "{{ skill.class_level }}",
    rarity: "{{ skill.rarity }}",
    type: "{{ skill.type }}",
    fragment_cost: {{ site.data.skills.fragment_costs[skill.rarity] | default: 0 }},
    rarity_name: "{{ site.data.skills.skill_spec | where: 'name', skill.rarity | map: 'name_c' | first }}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('skill-tables-container');
  const template = document.getElementById('skill-table-template');
  const addBtn = document.getElementById('add-skill-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');
  const ownedVouchersInput = document.getElementById('owned-vouchers');
  const ownedBoxesInput = document.getElementById('owned-boxes');
  const globalClassSelect = document.getElementById('global-class-select');
  
  let skillCounter = 0;
  let currentClassFilter = '';

  const VOUCHER_VALUE = 30;
  const BOX_VALUE = 1;
  
  // Handle global class filter change
  globalClassSelect.addEventListener('change', function() {
    currentClassFilter = this.value;
    // Update all existing skill selects
    document.querySelectorAll('.skill-name-select').forEach(select => {
      populateSkillSelect(select, currentClassFilter);
    });
  });
  
  function populateSkillSelect(selectElement, classFilter = '') {
    const currentValue = selectElement.value;
    
    // Filter skills by class
    const filteredSkills = classFilter 
      ? ALL_SKILLS.filter(skill => skill.class === classFilter)
      : ALL_SKILLS;
    
    // Group by class
    const groupedByClass = {};
    filteredSkills.forEach(skill => {
      if (!groupedByClass[skill.class]) {
        groupedByClass[skill.class] = [];
      }
      groupedByClass[skill.class].push(skill);
    });
    
    // Build options HTML
    let html = '<option value="">選擇技能 / Select Skill</option>';
    
    Object.keys(groupedByClass).sort().forEach(className => {
      html += `<optgroup label="${className}">`;
      groupedByClass[className].forEach(skill => {
        const selected = currentValue === skill.name ? 'selected' : '';
        html += `
          <option value="${skill.name}" ${selected}
                  data-name="${skill.name}"
                  data-name-c="${skill.name_c}"
                  data-class="${skill.class}"
                  data-class-level="${skill.class_level}"
                  data-rarity="${skill.rarity}"
                  data-rarity-name="${skill.rarity_name}"
                  data-type="${skill.type}"
                  data-fragment-cost="${skill.fragment_cost}">
            ${skill.class}(${skill.class_level})${skill.type} - ${skill.name_c}(${skill.rarity_name})
          </option>
        `;
      });
      html += '</optgroup>';
    });
    
    selectElement.innerHTML = html;
  }
  
  function addSkillTable() {
    skillCounter++;
    const clone = template.content.cloneNode(true);
    const wrapper = clone.querySelector('.skill-table-wrapper');
    wrapper.dataset.skillId = skillCounter;
    
    const skillSelect = clone.querySelector('.skill-name-select');
    const ownedFragmentsInput = clone.querySelector('.owned-fragments-input');
    
    // Populate with current filter
    populateSkillSelect(skillSelect, currentClassFilter);
    
    // Add change event to skill selector
    skillSelect.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption.value) {
        const skillData = ALL_SKILLS.find(s => s.name === selectedOption.value);
        if (!skillData) return;
        
        const wrapper = this.closest('.skill-table-wrapper');
        
        // Store skill info in wrapper
        wrapper.dataset.selectedSkillName = skillData.name_c;
        wrapper.dataset.selectedRarity = skillData.rarity;
        wrapper.dataset.selectedRarityName = skillData.rarity_name;
        wrapper.dataset.selectedClass = skillData.class;
        
        updateTableCalculations(wrapper);
        updateGrandTotal();
      }
    });
    
    // Add input event to owned fragments
    ownedFragmentsInput.addEventListener('input', function() {
      const wrapper = this.closest('.skill-table-wrapper');
      updateTableCalculations(wrapper);
      updateGrandTotal();
    });
    
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
    
    clone.querySelector('.btn-remove').addEventListener('click', function() {
      if (confirm('確定要刪除此技能嗎？')) {
        const currentWrapper = this.closest('.skill-table-wrapper');
        currentWrapper.remove();
        updateGrandTotal();
      }
    });
    
    container.appendChild(clone);
    
    // Now add collapse event listener to the actual DOM element
    const actualWrapper = container.querySelector(`[data-skill-id="${skillCounter}"]`);
    
    actualWrapper.querySelector('.btn-collapse').addEventListener('click', function() {
      const collapseWrapper = actualWrapper.querySelector('.table-collapse-wrapper');
      const isCollapsed = collapseWrapper.classList.contains('collapsed');
      
      if (isCollapsed) {
        collapseWrapper.classList.remove('collapsed');
        this.classList.remove('collapsed');
      } else {
        collapseWrapper.classList.add('collapsed');
        this.classList.add('collapsed');
      }
    });
    
    updateGrandTotal();
    
    setTimeout(() => {
      actualWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  function updateTableCalculations(wrapper) {
    if (!wrapper) return { total: 0, netCost: 0, rarity: 'rare', drawsNeeded: 0, vouchersNeeded: 0, boxesNeeded: 0, qualitiesUsed: [], skillName: '', className: '', ownedFragments: 0 };
    
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
    
    // Get owned fragments
    const ownedFragmentsInput = wrapper.querySelector('.owned-fragments-input');
    const ownedFragments = parseInt(ownedFragmentsInput?.value) || 0;
    
    // Calculate net cost (what's still needed)
    const netCost = Math.max(0, total - ownedFragments);
    
    const costElement = wrapper.querySelector('.skill-cost');
    if (costElement) costElement.textContent = total;
    
    const netCostElement = wrapper.querySelector('.skill-net-cost');
    if (netCostElement) {
      netCostElement.textContent = netCost;
      if (netCost === 0 && total > 0) {
        netCostElement.classList.remove('text-danger');
        netCostElement.classList.add('text-success');
      } else {
        netCostElement.classList.remove('text-success');
        netCostElement.classList.add('text-danger');
      }
    }
    
    const rarity = wrapper.dataset.selectedRarity || 'rare';
    const skillName = wrapper.dataset.selectedSkillName || '未選擇技能';
    const className = wrapper.dataset.selectedClass || '';
    const fragmentsPerDraw = FRAGMENTS_PER_DRAW[rarity] || 10;
    const drawsNeeded = netCost > 0 ? Math.ceil(netCost / fragmentsPerDraw) : 0;
    
    const drawsElement = wrapper.querySelector('.skill-draws');
    if (drawsElement) drawsElement.textContent = drawsNeeded;

    const vouchersNeeded = netCost > 0 ? Math.ceil(netCost / VOUCHER_VALUE) : 0;
    const vouchersElement = wrapper.querySelector('.skill-vouchers');
    if (vouchersElement) vouchersElement.textContent = vouchersNeeded;

    const boxesNeeded = netCost;
    const boxesElement = wrapper.querySelector('.skill-boxes');
    if (boxesElement) boxesElement.textContent = boxesNeeded;
    
    return { total, netCost, rarity, drawsNeeded, vouchersNeeded, boxesNeeded, qualitiesUsed: Array.from(qualitiesUsed), skillName, className, ownedFragments };
  }
  
  function updateGrandTotal() {
    let grandTotal = 0;
    let grandNetTotal = 0;
    let totalUpgrades = 0;
    let totalVouchers = 0;
    let totalBoxes = 0;
    const skillBreakdown = [];
    
    document.querySelectorAll('.skill-table-wrapper').forEach(wrapper => {
      const { total, netCost, rarity, drawsNeeded, vouchersNeeded, boxesNeeded, qualitiesUsed, skillName, className, ownedFragments } = updateTableCalculations(wrapper);
      const upgrades = wrapper.querySelectorAll('.level-checkbox:checked').length;
      
      if (total > 0) {
        skillBreakdown.push({
          name: skillName,
          class: className,
          cost: total,
          netCost: netCost,
          ownedFragments: ownedFragments,
          upgrades: upgrades,
          rarity: rarity,
          drawsNeeded: drawsNeeded,
          vouchersNeeded: vouchersNeeded,
          boxesNeeded: boxesNeeded,
          qualities: qualitiesUsed
        });
      }
      
      grandTotal += total;
      grandNetTotal += netCost;
      totalUpgrades += upgrades;
      totalVouchers += vouchersNeeded;
      totalBoxes += boxesNeeded;
    });
    
    document.getElementById('total-skills').textContent = document.querySelectorAll('.skill-table-wrapper').length;
    document.getElementById('total-upgrades').textContent = totalUpgrades;
    document.getElementById('grand-total').textContent = grandTotal;
    document.getElementById('voucher-count').textContent = totalVouchers;
    document.getElementById('box-count').textContent = totalBoxes;
    
    updateBalanceCalculations(grandNetTotal);
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
      
      // Update draws for rare, epic, legendary
      document.getElementById('draws-rare').textContent = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.rare);
      document.getElementById('draws-epic').textContent = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.epic);
      document.getElementById('draws-legendary').textContent = Math.ceil(fragmentsNeeded / FRAGMENTS_PER_DRAW.legendary);
      
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
      const rarityData = SKILL_SPEC_DATA[skill.rarity];
      const rarityText = rarityData ? rarityData.name_c : skill.rarity;
      
      // Add class emoji
      let classEmoji = '⚔️';
      if (skill.class === '騎士') classEmoji = '🛡️';
      else if (skill.class === '術士') classEmoji = '🔮';
      else if (skill.class === '賢者') classEmoji = '📜';
      else if (skill.class === '鬥士') classEmoji = '🗡️';
      
      html += `
        <div class="summary-skill-card card ${skill.rarity} p-3">
          <div class="fw-bold mb-2 text-dark">${classEmoji} ${skill.name} (${rarityText})</div>
          <div class="d-flex flex-wrap gap-3 small text-muted">
            <span>${skill.upgrades} 次升級</span>
            <span class="text-success fw-bold">${skill.cost} 碎片</span>
            ${skill.ownedFragments > 0 ? `<span class="text-info fw-bold">💎 已有 ${skill.ownedFragments}</span>` : ''}
            ${skill.netCost > 0 ? `<span class="text-danger fw-bold">還需 ${skill.netCost}</span>` : '<span class="text-success fw-bold">✓ 足夠</span>'}
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
      globalClassSelect.value = '';
      currentClassFilter = '';
      updateGrandTotal();
    }
  });
  
  ownedVouchersInput.addEventListener('input', function() {
    const neededFragments = parseInt(document.getElementById('total-needed-fragments').textContent) || 0;
    updateBalanceCalculations(neededFragments);
  });
  
  ownedBoxesInput.addEventListener('input', function() {
    const neededFragments = parseInt(document.getElementById('total-needed-fragments').textContent) || 0;
    updateBalanceCalculations(neededFragments);
  });
  
  addSkillTable();
});
</script>