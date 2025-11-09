---
layout: default
title: 技能升級計算器
---

<section class="container py-4" id="container-skill-table">
  <div class="calculator-header mb-4">
    <h2 class="mb-3">技能升級計算器<br><span class="text-muted fs-5 fw-normal">Skill Upgrade Calculator</span></h2>
    
    <!-- MOVED INVENTORY SECTION TO TOP -->
    <div class="inventory-section mb-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="mb-0 text-secondary">📋 己有資源 / Current Inventory</h5>
      </div>
      
      <div class="alert alert-info mb-3" role="alert">
        <div class="small">
          <div class="fw-bold mb-2">💡 賽季碎片獲取(白嫖)參考：</div>
          {% for season in site.data.skills.season_fragments %}
          <div{% unless forloop.first %} class="mt-1"{% endunless %}>
            <span class="badge bg-{{ season.badge_color }} me-2">{{ season.season }}</span>
            <span>{{ season.class_level }} <strong>{{ season.total }}碎片</strong></span>
            <span class="text-muted ms-2">{{ season.breakdown }}</span>
          </div>
          {% endfor %}
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <div class="card border-warning shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">{{ site.data.skills.resources.voucher.emoji }}</div>
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">{{ site.data.skills.resources.voucher.name_c }}</div>
                <div class="text-muted small">1 券 = {{ site.data.skills.resources.voucher.value }} 碎片</div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <input type="number" id="owned-vouchers" class="form-control text-center fw-bold" style="width: 90px;" value="0" min="0">
                <span class="fw-semibold text-dark">張</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-info shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">{{ site.data.skills.resources.box.emoji }}</div>
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">{{ site.data.skills.resources.box.name_c }}</div>
                <div class="text-muted small">1 箱 = {{ site.data.skills.resources.box.value }} 碎片</div>
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

    <div class="row g-3">
      <div class="col-12 col-md-6">
        <label class="form-label fw-bold">選擇職業 / Select Class</label>
        <select id="global-class-select" class="form-select form-select-lg">
          <option value="">全部職業 / All Classes</option>
          {% assign sorted_classes = site.data.skills.class_info | sort: 'order' %}
          {% for class in sorted_classes %}
          <option value="{{ class.name }}">{{ class.emoji }} {{ class.name }} ({{ class.name_en }})</option>
          {% endfor %}
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
    <!-- Skill cards will be inserted here -->
  </div>

  <div class="summary-panel bg-light border rounded-3 p-4 shadow-sm mb-4">
    <h3 class="mb-4 text-secondary">總計概覽 / Total Summary</h3>
    
    <div class="row g-3 mb-4">
      <div class="col-4">
        <div class="card text-center h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="text-muted small mb-2">技能數量</div>
            <div class="fs-2 fw-bold text-primary" id="total-skills">0</div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="text-muted small mb-2">升級次數</div>
            <div class="fs-2 fw-bold text-primary" id="total-upgrades">0</div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center h-100 bg-warning text-white border-0 shadow-sm">
          <div class="card-body">
            <div class="small mb-2 opacity-75">總消耗碎片</div>
            <div class="fs-2 fw-bold" id="grand-total">0</div>
          </div>
        </div>
      </div>
    </div>

    <div class="conversion-section mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6 col-lg-5">
          <div class="card text-white border-0 shadow-sm" style="background: linear-gradient(135deg, {{ site.data.skills.resources.voucher.color }} 0%, #d97706 100%);">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">{{ site.data.skills.resources.voucher.emoji }}</div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-5">{{ site.data.skills.resources.voucher.name_c }}需求</div>
                <div class="small" style="opacity: 0.9;">1 券 = {{ site.data.skills.resources.voucher.value }} 碎片</div>
              </div>
              <div class="text-end">
                <div class="small" style="opacity: 0.9;">需要</div>
                <div class="display-5 fw-bold" id="voucher-count">0</div>
                <div class="small">張</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-12 col-lg-2 d-flex justify-content-center">
          <div class="or-divider">
            <span class="badge bg-secondary fs-6 px-3 py-2">或 OR</span>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-5">
          <div class="card text-white border-0 shadow-sm" style="background: linear-gradient(135deg, {{ site.data.skills.resources.box.color }} 0%, #2563eb 100%);">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="fs-1">{{ site.data.skills.resources.box.emoji }}</div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-5">{{ site.data.skills.resources.box.name_c }}需求</div>
                <div class="small" style="opacity: 0.9;">1 箱 = {{ site.data.skills.resources.box.value }} 碎片</div>
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
      
      <div class="alert alert-light border mt-3 mb-0" role="alert">
        <div class="d-flex align-items-center gap-2 justify-content-center small">
          <span class="text-muted">💡</span>
          <span>以上為總需求量，可選擇 <strong>技能券</strong> 或 <strong>碎片箱</strong> 其中一種方式兌換</span>
        </div>
      </div>
    </div>
    
    <div id="summary-content" class="bg-white rounded p-3 border">
      <p class="text-muted fst-italic text-center mb-0">尚未選擇任何升級 / No upgrades selected yet</p>
    </div>
  </div>

  <!-- Skills Fragment Cost Reference Table -->
  <div class="info-panel bg-white border rounded-3 p-4 shadow-sm">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0 text-secondary">📊 技能升級碎片消耗表 / Skill Upgrade Fragment Cost Table</h3>
      <button class="btn btn-outline-secondary btn-sm" id="toggle-info-btn">
        <span class="toggle-info-icon">▼</span> 展開/收合
      </button>
    </div>
    
    <div id="info-content">
      <div class="table-responsive">
        <table class="table table-bordered text-center skill-cost-reference-table" id="skill-cost-table">
          <thead class="table-light">
            <tr>
              <th class="align-middle" style="min-width: 100px;">
                <div class="fw-bold">品質</div>
                <div class="small text-muted">(碎片)</div>
              </th>
              {% for i in (0..9) %}
              <th class="align-middle" style="min-width: 80px;">
                <div class="small">Lv {{ i }}→{{ i | plus: 1 }}</div>
              </th>
              {% endfor %}
            </tr>
          </thead>
          <tbody>
            {% assign sorted_specs = site.data.skills.skill_spec | sort: 'order' %}
            {% for spec in sorted_specs %}
            <tr>
              <td class="text-white fw-bold align-middle" style="{% if spec.color contains 'gradient' %}background: {{ spec.color }}{% else %}background-color: {{ spec.color }}{% endif %}">
                <div class="fw-bold">{{ spec.name_c }}</div>
                <div class="small" style="opacity: 0.9;">({{ spec.fragment_cost }})</div>
              </td>
              {% for level in spec.levels %}
              <td class="align-middle fw-semibold">{{ level.cost }}</td>
              {% endfor %}
              {% assign remaining = 10 | minus: spec.levels.size %}
              {% for i in (1..remaining) %}
              <td class="align-middle text-muted bg-light">—</td>
              {% endfor %}
            </tr>
            {% endfor %}
          </tbody>
        </table>
      </div>
      
      <div class="alert alert-light border mt-3">
        <div class="row text-center">
          <div class="col-md-6 mb-2 mb-md-0">
            <strong>💡 提示:</strong> 每個品質對應不同的升級等級上限
          </div>
          <div class="col-md-6">
            <strong>🎯 碎片數:</strong> 括號中的數字為該品質單次抽取獲得的碎片數
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Template for skill card -->
<template id="skill-table-template">
  <div class="skill-table-wrapper card shadow-sm border-0">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom gap-3">
        <div class="flex-grow-1" style="min-width: 0;">
          <!-- Skill Selection -->
          <div class="row g-2 mb-3">
            <div class="col-12">
              <label class="form-label small fw-bold text-muted mb-1">選擇技能 / Select Skill</label>
              <select class="form-select fw-bold skill-name-select">
                <option value="">選擇技能 / Select Skill</option>
              </select>
            </div>
          </div>

          <!-- Level Selection Dropdowns -->
          <div class="row g-2 mb-3">
            <div class="col-12 col-md-6">
              <label class="form-label small fw-bold text-muted mb-1">當前等級 / Current Level</label>
              <select class="form-select current-level-select">
                <option value="">選擇當前等級</option>
              </select>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label small fw-bold text-muted mb-1">目標等級 / Target Level</label>
              <select class="form-select target-level-select">
                <option value="">選擇目標等級</option>
              </select>
            </div>
          </div>

          <!-- Resources Section -->
          <div class="row g-2 mb-2">
            <div class="col-12 col-md-6">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white border-0">💎 已持有碎片</span>
                <input type="number" class="form-control owned-fragments-input border-success" value="0" min="0">
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center gap-2 small">
                <div class="form-check">
                  <input class="form-check-input use-voucher-checkbox" type="checkbox">
                  <label class="form-check-label text-warning fw-bold">
                    🎫
                  </label>
                </div>
                <input type="number" class="form-control form-control-sm voucher-amount-input" value="0" min="0" max="999" style="width: 60px;" disabled>
                <span class="text-muted small">張</span>
                
                <div class="form-check ms-2">
                  <input class="form-check-input use-box-checkbox" type="checkbox">
                  <label class="form-check-label text-info fw-bold">
                    📦
                  </label>
                </div>
                <input type="number" class="form-control form-control-sm box-amount-input" value="0" min="0" max="999" style="width: 60px;" disabled>
                <span class="text-muted small">個</span>
              </div>
            </div>
          </div>

          <!-- Stats Display -->
          <div class="d-flex flex-wrap gap-3 small skill-info-display">
            <span class="text-muted">消耗: <strong class="text-success skill-cost">0</strong> 碎片</span>
            <span class="skill-net-cost-label">還需: <strong class="text-danger skill-net-cost">0</strong> 碎片</span>
            <span class="text-muted skill-after-resources-label" style="display: none;">扣除資源後: <strong class="text-primary skill-after-resources">0</strong> 碎片</span>
            <span class="text-muted">需抽取: <strong class="text-primary skill-draws">0</strong> 次</span>
            <span class="text-warning skill-vouchers-display" style="display: none;">🎫 <strong class="skill-vouchers">0</strong> 張</span>
            <span class="text-info skill-boxes-display" style="display: none;">📦 <strong class="skill-boxes">0</strong> 個</span>
          </div>
        </div>
        <div class="d-flex gap-2 flex-shrink-0">
          <button class="btn btn-danger btn-sm btn-remove" title="刪除">❌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.skill-table-wrapper {
  transition: all 0.3s ease;
}

.skill-table-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.use-voucher-checkbox:checked {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.use-box-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.voucher-amount-input:not(:disabled),
.box-amount-input:not(:disabled) {
  border-color: #0d6efd;
  font-weight: 600;
}

.or-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.or-divider .badge {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-weight: 600;
  letter-spacing: 0.5px;
}

@media (max-width: 991.98px) {
  .or-divider {
    min-height: 40px;
    margin: 0.5rem 0;
  }
}

.summary-skill-card {
  border-left: 4px solid;
  transition: all 0.2s ease;
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

.draw-skill-item {
  border-left: 3px solid;
  padding-left: 1rem;
}

.skill-name-select option:disabled {
  color: #999;
  font-style: italic;
}

#info-content {
  max-height: 800px;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 1;
}

#info-content.collapsed {
  max-height: 0;
  opacity: 0;
}

#toggle-info-btn .toggle-info-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

#toggle-info-btn.collapsed .toggle-info-icon {
  transform: rotate(-90deg);
}

.skill-cost-reference-table {
  font-size: 0.9rem;
}

.skill-cost-reference-table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 5;
}

.skill-cost-reference-table tbody td {
  vertical-align: middle;
  padding: 0.75rem 0.5rem;
}

.current-level-select,
.target-level-select {
  font-weight: 600;
}

.current-level-select {
  border-color: #ffc107;
}

.target-level-select {
  border-color: #0d6efd;
}

@media (max-width: 767.98px) {
  .display-5 {
    font-size: 2rem !important;
  }
  
  .display-6 {
    font-size: 1.5rem !important;
  }
  
  .alert-info {
    font-size: 0.85rem;
  }

  .skill-cost-reference-table {
    font-size: 0.75rem;
  }

  .skill-cost-reference-table tbody td {
    padding: 0.5rem 0.25rem;
  }
}
</style>

<script>
// ========================================
// DATA FROM JEKYLL
// ========================================
const SKILLS = {
  specs: {
    {% for spec in site.data.skills.skill_spec %}
    "{{ spec.name }}": {
      name_c: "{{ spec.name_c }}",
      color: "{{ spec.color }}",
      fragmentCost: {{ spec.fragment_cost }},
      order: {{ spec.order }},
      levels: [{% for level in spec.levels %}{{ level.cost }}{% unless forloop.last %},{% endunless %}{% endfor %}]
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  },
  rarityOrder: [{% assign sorted = site.data.skills.skill_spec | sort: 'order' %}{% for spec in sorted %}"{{ spec.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
  classes: {
    {% for class in site.data.skills.class_info %}
    "{{ class.name }}": { emoji: "{{ class.emoji }}", compatible: [{% for c in class.compatible %}"{{ c }}"{% unless forloop.last %},{% endunless %}{% endfor %}] }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  },
  classOrder: [{% assign sorted = site.data.skills.class_info | sort: 'order' %}{% for c in sorted %}"{{ c.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
  levelOrder: [{% assign sorted = site.data.skills.class_levels | sort: 'order' %}{% for l in sorted %}"{{ l.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
  types: {
    {% for type in site.data.skills.skill_types %}
    "{{ type.name }}": { emoji: "{{ type.emoji }}", order: {{ type.order }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  },
  typeOrder: [{% assign sorted = site.data.skills.skill_types | sort: 'order' %}{% for t in sorted %}"{{ t.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}],
  resources: {
    voucher: { emoji: "🎫", value: {{ site.data.skills.resources.voucher.value }} },
    box: { emoji: "📦", value: {{ site.data.skills.resources.box.value }} }
  },
  list: [
    {% for skill in site.data.skills.skill_list %}
    { id: "{{ skill.name }}", name: "{{ skill.name_c }}", class: "{{ skill.class }}", level: "{{ skill.class_level }}", rarity: "{{ skill.rarity }}", type: "{{ skill.type }}" }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
};

// ========================================
// HELPERS
// ========================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => el.querySelectorAll(s);

const get = {
  rarity: (key) => SKILLS.specs[key] || {},
  classEmoji: (name) => SKILLS.classes[name]?.emoji || '⚔️',
  compatible: (name) => SKILLS.classes[name]?.compatible || [name],
  typeEmoji: (name) => SKILLS.types[name]?.emoji || '⚔️'
};

// ========================================
// MAIN APP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    counter: 0,
    classFilter: '',
    get wrappers() { return $$('.skill-table-wrapper'); }
  };

  // ========================================
  // POPULATE SELECTS
  // ========================================
  function populateSkills(select) {
    const currentValue = select.value;
    const selected = new Set([...$$('.skill-name-select')].filter(s => s !== select).map(s => s.value));
    const compatible = state.classFilter ? get.compatible(state.classFilter) : null;
    const filtered = compatible ? SKILLS.list.filter(s => compatible.includes(s.class)) : SKILLS.list;

    const grouped = filtered.reduce((acc, skill) => {
      const key = `${skill.class}|${skill.level}`;
      if (!acc[key]) acc[key] = { class: skill.class, level: skill.level, skills: {} };
      if (!acc[key].skills[skill.type]) acc[key].skills[skill.type] = [];
      acc[key].skills[skill.type].push(skill);
      return acc;
    }, {});

    const sorted = Object.keys(grouped).sort((a, b) => {
      const [c1, l1] = a.split('|'), [c2, l2] = b.split('|');
      return (SKILLS.classOrder.indexOf(c1) - SKILLS.classOrder.indexOf(c2)) || 
             (SKILLS.levelOrder.indexOf(l1) - SKILLS.levelOrder.indexOf(l2));
    });

    let html = '<option value="">選擇技能</option>';
    sorted.forEach(key => {
      const g = grouped[key];
      html += `<optgroup label="${get.classEmoji(g.class)} ${g.class} - ${g.level}">`;
      SKILLS.typeOrder.forEach(type => {
        (g.skills[type] || []).forEach(s => {
          const isSelected = currentValue === s.id;
          const disabled = selected.has(s.id) ? 'disabled' : '';
          const label = selected.has(s.id) ? ' ✓已選擇' : '';
          const selectedAttr = isSelected ? 'selected' : '';
          html += `<option value="${s.id}" ${disabled} ${selectedAttr}>${get.typeEmoji(type)} ${s.name} (${get.rarity(s.rarity).name_c})${label}</option>`;
        });
      });
      html += '</optgroup>';
    });
    select.innerHTML = html;
  }

  function populateLevels(wrapper, rarity) {
    const curr = $('.current-level-select', wrapper);
    const targ = $('.target-level-select', wrapper);
    
    if (!rarity) {
      curr.innerHTML = targ.innerHTML = '<option value="">選擇等級</option>';
      return;
    }

    const baseIdx = SKILLS.rarityOrder.indexOf(rarity);
    let currHtml = '<option value="">選擇當前等級</option>';
    
    for (let i = baseIdx; i < SKILLS.rarityOrder.length; i++) {
      const r = SKILLS.rarityOrder[i];
      const spec = SKILLS.specs[r];
      for (let j = 0; j < spec.levels.length; j++) {
        currHtml += `<option value="${r}|${j}">${spec.name_c} ${j}星</option>`;
      }
    }
    curr.innerHTML = currHtml;
    updateTargetLevels(wrapper, baseIdx);
  }

  function updateTargetLevels(wrapper, baseIdx) {
    const curr = $('.current-level-select', wrapper);
    const targ = $('.target-level-select', wrapper);
    const [curRarity, curLevel] = (curr.value || '|').split('|');
    const curIdx = SKILLS.rarityOrder.indexOf(curRarity);
    const curLvl = parseInt(curLevel) || -1;

    let html = '<option value="">選擇目標等級</option>';
    
    for (let i = Math.max(baseIdx, curIdx); i < SKILLS.rarityOrder.length; i++) {
      const r = SKILLS.rarityOrder[i];
      const spec = SKILLS.specs[r];
      for (let j = 0; j < spec.levels.length; j++) {
        if (i === curIdx && j <= curLvl) continue;
        html += `<option value="${r}|${j}">${spec.name_c} ${j}星</option>`;
      }
    }
    targ.innerHTML = html;
  }

  // ========================================
  // CALCULATIONS
  // ========================================
  function calculate(wrapper) {
    const curr = $('.current-level-select', wrapper).value;
    const targ = $('.target-level-select', wrapper).value;
    
    if (!curr || !targ) {
      wrapper.dataset.cost = wrapper.dataset.upgrades = '0';
      updateDisplay(wrapper);
      updateTotals();
      return;
    }

    const [r1, l1] = curr.split('|');
    const [r2, l2] = targ.split('|');
    const idx1 = SKILLS.rarityOrder.indexOf(r1);
    const idx2 = SKILLS.rarityOrder.indexOf(r2);
    const lv1 = parseInt(l1);
    const lv2 = parseInt(l2);

    let cost = 0, upgrades = 0;
    const qualities = new Set();

    for (let i = idx1; i <= idx2; i++) {
      const r = SKILLS.rarityOrder[i];
      const spec = SKILLS.specs[r];
      const start = i === idx1 ? lv1 + 1 : 0;
      const end = i === idx2 ? lv2 : spec.levels.length - 1;
      
      for (let j = start; j <= end; j++) {
        cost += spec.levels[j];
        upgrades++;
        qualities.add(spec.name_c);
      }
    }

    wrapper.dataset.cost = cost;
    wrapper.dataset.upgrades = upgrades;
    wrapper.dataset.qualities = Array.from(qualities).join(',');
    
    updateDisplay(wrapper);
    updateTotals();
  }

  function updateDisplay(wrapper) {
    const cost = parseInt(wrapper.dataset.cost) || 0;
    const owned = parseInt($('.owned-fragments-input', wrapper)?.value) || 0;
    const net = Math.max(0, cost - owned);

    $('.skill-cost', wrapper).textContent = cost;
    const netEl = $('.skill-net-cost', wrapper);
    netEl.textContent = net;
    netEl.className = net === 0 && cost > 0 ? 'text-success skill-net-cost' : 'text-danger skill-net-cost';
  }

  function updateTotals() {
    const skills = [...state.wrappers].map(w => ({
      cost: parseInt(w.dataset.cost) || 0,
      upgrades: parseInt(w.dataset.upgrades) || 0,
      owned: parseInt($('.owned-fragments-input', w)?.value) || 0,
      useVoucher: $('.use-voucher-checkbox', w)?.checked,
      useBox: $('.use-box-checkbox', w)?.checked,
      voucherAmount: parseInt($('.voucher-amount-input', w)?.value) || 0,
      boxAmount: parseInt($('.box-amount-input', w)?.value) || 0,
      rarity: w.dataset.rarity || 'rare',
      name: w.dataset.name || '未命名',
      className: w.dataset.class || '',
      qualities: w.dataset.qualities ? w.dataset.qualities.split(',') : [],
      wrapper: w,
      get net() { return Math.max(0, this.cost - this.owned); }
    })).filter(s => s.cost > 0);

    const totals = skills.reduce((acc, s) => {
      acc.cost += s.cost;
      acc.net += s.net;
      acc.upgrades += s.upgrades;
      return acc;
    }, { cost: 0, net: 0, upgrades: 0 });

    $('#total-skills').textContent = state.wrappers.length;
    $('#total-upgrades').textContent = totals.upgrades;
    $('#grand-total').textContent = totals.cost;

    updateBalance(skills, totals.net);
    updateSummary(skills);
  }

  function updateBalance(skills, totalNet) {
    const ownedVouchers = parseInt($('#owned-vouchers').value) || 0;
    const ownedBoxes = parseInt($('#owned-boxes').value) || 0;

    let remVouchers = ownedVouchers;
    let remBoxes = ownedBoxes;

    skills.forEach(s => {
      let stillNeeded = s.net;
      let vUsed = 0, bUsed = 0;

      // Use specified amount of vouchers if checked
      if (s.useVoucher && stillNeeded > 0 && s.voucherAmount > 0) {
        vUsed = Math.min(s.voucherAmount, remVouchers, Math.ceil(stillNeeded / SKILLS.resources.voucher.value));
        stillNeeded = Math.max(0, stillNeeded - (vUsed * SKILLS.resources.voucher.value));
        remVouchers -= vUsed;
      }

      // Use specified amount of boxes if checked
      if (s.useBox && stillNeeded > 0 && s.boxAmount > 0) {
        bUsed = Math.min(s.boxAmount, remBoxes, stillNeeded);
        stillNeeded = Math.max(0, stillNeeded - bUsed);
        remBoxes -= bUsed;
      }

      $('.skill-vouchers', s.wrapper).textContent = vUsed;
      $('.skill-boxes', s.wrapper).textContent = bUsed;
      $('.skill-vouchers-display', s.wrapper).style.display = s.useVoucher && vUsed > 0 ? 'inline' : 'none';
      $('.skill-boxes-display', s.wrapper).style.display = s.useBox && bUsed > 0 ? 'inline' : 'none';
      
      const afterLabel = $('.skill-after-resources-label', s.wrapper);
      if ((s.useVoucher || s.useBox) && s.net > 0) {
        afterLabel.style.display = 'inline';
        $('.skill-after-resources', s.wrapper).textContent = stillNeeded;
      } else {
        afterLabel.style.display = 'none';
      }

      const fragPerDraw = get.rarity(s.rarity).fragmentCost || 10;
      const drawsNeeded = stillNeeded > 0 ? Math.ceil(stillNeeded / fragPerDraw) : 0;
      $('.skill-draws', s.wrapper).textContent = drawsNeeded;
    });

    // Calculate voucher and box needs based on total net
    const vouchersNeeded = Math.ceil(totalNet / SKILLS.resources.voucher.value);
    const boxesNeeded = totalNet;

    $('#voucher-count').textContent = vouchersNeeded;
    $('#box-count').textContent = boxesNeeded;
  }

  function updateSummary(skills) {
    const content = $('#summary-content');
    if (skills.length === 0) {
      content.innerHTML = '<p class="text-muted fst-italic text-center mb-0">尚未選擇任何升級</p>';
      return;
    }

    content.innerHTML = '<div class="d-flex flex-column gap-3">' + skills.map(s => {
      const draws = parseInt($('.skill-draws', s.wrapper)?.textContent) || 0;
      const vUsed = parseInt($('.skill-vouchers', s.wrapper)?.textContent) || 0;
      const bUsed = parseInt($('.skill-boxes', s.wrapper)?.textContent) || 0;
      const after = parseInt($('.skill-after-resources', s.wrapper)?.textContent) || s.net;

      return `
        <div class="summary-skill-card card ${s.rarity} p-3 border-0 shadow-sm">
          <div class="fw-bold mb-2">${get.classEmoji(s.className)} ${s.name} (${get.rarity(s.rarity).name_c})</div>
          <div class="d-flex flex-wrap gap-3 small text-muted">
            <span>${s.upgrades}次升級</span>
            <span class="text-success fw-bold">${s.cost}碎片</span>
            ${s.owned > 0 ? `<span class="text-info fw-bold">💎${s.owned}</span>` : ''}
            ${s.net > 0 ? `<span class="text-danger fw-bold">還需${s.net}</span>` : '<span class="text-success fw-bold">✓足夠</span>'}
            ${(s.useVoucher || s.useBox) ? `<span class="text-primary fw-bold">扣除後${after}</span>` : ''}
            <span class="text-primary fw-bold">抽${draws}次</span>
            ${vUsed > 0 ? `<span class="text-warning fw-bold">🎫${vUsed}</span>` : ''}
            ${bUsed > 0 ? `<span class="text-info fw-bold">📦${bUsed}</span>` : ''}
          </div>
          ${s.qualities.length > 0 ? '<div class="d-flex flex-wrap gap-2 mt-2">' + s.qualities.map(q => 
            `<span class="badge text-white" style="background: ${SKILLS.specs[SKILLS.rarityOrder.find(r => SKILLS.specs[r].name_c === q)]?.color}">${q}</span>`
          ).join('') + '</div>' : ''}
        </div>
      `;
    }).join('') + '</div>';
  }

  // ========================================
  // ADD SKILL
  // ========================================
  function addSkill() {
    state.counter++;
    const template = $('#skill-table-template');
    const clone = template.content.cloneNode(true);
    const wrapper = $('.skill-table-wrapper', clone);
    
    wrapper.dataset.skillId = state.counter;
    wrapper.dataset.cost = wrapper.dataset.upgrades = '0';

    const skillSelect = $('.skill-name-select', wrapper);
    const voucherCheckbox = $('.use-voucher-checkbox', wrapper);
    const voucherInput = $('.voucher-amount-input', wrapper);
    const boxCheckbox = $('.use-box-checkbox', wrapper);
    const boxInput = $('.box-amount-input', wrapper);

    populateSkills(skillSelect);

    skillSelect.onchange = function() {
      const skill = SKILLS.list.find(s => s.id === this.value);
      if (!skill) return;
      
      const w = this.closest('.skill-table-wrapper');
      w.dataset.name = skill.name;
      w.dataset.rarity = skill.rarity;
      w.dataset.class = skill.class;
      
      populateLevels(w, skill.rarity);
      $('.current-level-select', w).value = '';
      $('.target-level-select', w).value = '';
      w.dataset.cost = w.dataset.upgrades = '0';
      
      updateDisplay(w);
      updateTotals();
      state.wrappers.forEach(wr => populateSkills($('.skill-name-select', wr)));
    };

    $('.current-level-select', wrapper).onchange = function() {
      const w = this.closest('.skill-table-wrapper');
      const rarity = w.dataset.rarity;
      if (rarity) {
        updateTargetLevels(w, SKILLS.rarityOrder.indexOf(rarity));
      }
      calculate(w);
    };

    $('.target-level-select', wrapper).onchange = function() {
      calculate(this.closest('.skill-table-wrapper'));
    };

    $('.owned-fragments-input', wrapper).oninput = function() {
      updateDisplay(this.closest('.skill-table-wrapper'));
      updateTotals();
    };

    // Voucher checkbox toggle
    voucherCheckbox.onchange = function() {
      voucherInput.disabled = !this.checked;
      if (!this.checked) voucherInput.value = 0;
      updateTotals();
    };

    // Box checkbox toggle
    boxCheckbox.onchange = function() {
      boxInput.disabled = !this.checked;
      if (!this.checked) boxInput.value = 0;
      updateTotals();
    };

    // Amount inputs
    voucherInput.oninput = updateTotals;
    boxInput.oninput = updateTotals;

    $('.btn-remove', wrapper).onclick = function() {
      if (confirm('確定刪除?')) {
        this.closest('.skill-table-wrapper').remove();
        updateTotals();
        state.wrappers.forEach(w => populateSkills($('.skill-name-select', w)));
      }
    };

    $('#skill-tables-container').appendChild(clone);
    updateTotals();
  }

  // ========================================
  // INIT
  // ========================================
  $('#toggle-info-btn').onclick = function() {
    const content = $('#info-content');
    content.classList.toggle('collapsed');
    this.classList.toggle('collapsed');
  };

  $('#global-class-select').onchange = function() {
    state.classFilter = this.value;
    state.wrappers.forEach(w => populateSkills($('.skill-name-select', w)));
  };

  $('#add-skill-btn').onclick = addSkill;
  
  $('#reset-all-btn').onclick = function() {
    if (confirm('確定重置?')) {
      $('#skill-tables-container').innerHTML = '';
      $('#owned-vouchers').value = 0;
      $('#owned-boxes').value = 0;
      $('#global-class-select').value = '';
      state.counter = 0;
      state.classFilter = '';
      updateTotals();
    }
  };

  $('#owned-vouchers').oninput = updateTotals;
  $('#owned-boxes').oninput = updateTotals;

  addSkill();
});
</script>