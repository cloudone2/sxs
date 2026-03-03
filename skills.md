---
layout: default
title: 技能升級計算器
---

<link rel="stylesheet" href="{{ '/assets/css/skills-calculator.css' | relative_url }}">

<section class="container py-4" id="container-skill-table">
  <div class="calculator-header mb-4">
    <!-- Page Title -->
    <div class="text-center mb-4">
      <h1 class="display-5 fw-bold text-primary mb-2">🎯 技能升級計算器</h1>
      <p class="text-muted mb-0">Skill Upgrade Calculator</p>
    </div>
    
    <!-- Inventory Section -->
    <div class="inventory-section mb-4">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-gradient text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <span>📋</span>
            <span>己有資源 / Current Inventory</span>
          </h5>
        </div>
        <div class="card-body">
          <!-- Resource Inputs -->
          <div class="row g-3">
            <div class="col-md-6">
              <div class="resource-card voucher-card">
                <div class="resource-icon">{{ site.data.skills.resources.voucher.emoji }}</div>
                <div class="resource-info">
                  <div class="resource-name">{{ site.data.skills.resources.voucher.name_c }}</div>
                  <div class="resource-desc">1 券 = {{ site.data.skills.resources.voucher.value }} 碎片</div>
                </div>
                <div class="resource-input-group">
                  <input type="number" id="owned-vouchers" class="form-control" value="0" min="0" aria-label="技能券數量">
                  <span class="input-suffix">張</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="resource-card box-card">
                <div class="resource-icon">{{ site.data.skills.resources.box.emoji }}</div>
                <div class="resource-info">
                  <div class="resource-name">{{ site.data.skills.resources.box.name_c }}</div>
                  <div class="resource-desc">1 箱 = {{ site.data.skills.resources.box.value }} 碎片</div>
                </div>
                <div class="resource-input-group">
                  <input type="number" id="owned-boxes" class="form-control" value="0" min="0" aria-label="碎片箱數量">
                  <span class="input-suffix">個</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Controls -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-lg-6">
            <label class="form-label fw-bold mb-2">
              <span class="text-primary">🎮</span> 選擇職業 / Select Class
            </label>
            <select id="global-class-select" class="form-select form-select-lg shadow-sm">
              <option value="">全部職業 / All Classes</option>
              {% assign sorted_classes = site.data.skills.class_info | sort: 'order' %}
              {% for class in sorted_classes %}
              <option value="{{ class.name }}">{{ class.emoji }} {{ class.name }} ({{ class.name_en }})</option>
              {% endfor %}
            </select>
          </div>
          <div class="col-sm-6 col-lg-3">
            <button id="add-skill-btn" class="btn btn-primary btn-lg w-100 shadow-sm">
              <span class="me-2">➕</span> 新增技能
            </button>
          </div>
          <div class="col-sm-6 col-lg-3">
            <button id="reset-all-btn" class="btn btn-outline-secondary btn-lg w-100">
              <span class="me-2">🔄</span> 全部重置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Skills Container -->
  <div id="skill-tables-container" class="skills-grid mb-4">
    <!-- Skill cards will be inserted here -->
  </div>

  <!-- Summary Panel -->
  <div class="summary-panel mb-4">
    <div class="card border-0 shadow">
      <div class="card-header bg-light border-bottom">
        <h3 class="mb-0 d-flex align-items-center gap-2">
          <span>📊</span>
          <span>總計概覽 / Total Summary</span>
        </h3>
      </div>
      <div class="card-body">
        <!-- Stats Cards -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="stat-card stat-card-primary">
              <div class="stat-label">技能數量</div>
              <div class="stat-value" id="total-skills">0</div>
              <div class="stat-icon">🎯</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card stat-card-info">
              <div class="stat-label">升級次數</div>
              <div class="stat-value" id="total-upgrades">0</div>
              <div class="stat-icon">⚡</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card stat-card-warning">
              <div class="stat-label">總消耗碎片</div>
              <div class="stat-value" id="grand-total">0</div>
              <div class="stat-icon">💎</div>
            </div>
          </div>
        </div>

        <!-- Conversion Cards -->
        <div class="conversion-section mb-4">
          <div class="row g-3 align-items-center">
            <div class="col-lg-5">
              <div class="conversion-card voucher-conversion">
                <div class="conversion-header">
                  <span class="conversion-emoji">{{ site.data.skills.resources.voucher.emoji }}</span>
                  <div class="conversion-title">
                    <div class="conversion-name">{{ site.data.skills.resources.voucher.name_c }}需求</div>
                    <div class="conversion-rate">1 券 = {{ site.data.skills.resources.voucher.value }} 碎片</div>
                  </div>
                </div>
                <div class="conversion-result">
                  <div class="conversion-label">需要</div>
                  <div class="conversion-value" id="voucher-count">0</div>
                  <div class="conversion-unit">張</div>
                </div>
              </div>
            </div>
            
            <div class="col-lg-2 d-flex justify-content-center">
              <div class="or-badge">
                <span class="badge bg-secondary shadow">或 / OR</span>
              </div>
            </div>
            
            <div class="col-lg-5">
              <div class="conversion-card box-conversion">
                <div class="conversion-header">
                  <span class="conversion-emoji">{{ site.data.skills.resources.box.emoji }}</span>
                  <div class="conversion-title">
                    <div class="conversion-name">{{ site.data.skills.resources.box.name_c }}需求</div>
                    <div class="conversion-rate">1 箱 = {{ site.data.skills.resources.box.value }} 碎片</div>
                  </div>
                </div>
                <div class="conversion-result">
                  <div class="conversion-label">需要</div>
                  <div class="conversion-value" id="box-count">0</div>
                  <div class="conversion-unit">個</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="alert alert-light border mt-3 mb-0 text-center">
            <small class="text-muted">
              <span class="me-2">💡</span>
              以上為總需求量，可選擇 <strong class="text-warning">技能券</strong> 或 <strong class="text-info">碎片箱</strong> 其中一種方式兌換
            </small>
          </div>
        </div>
        
        <!-- Summary Content -->
        <div id="summary-content" class="summary-content">
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p class="empty-state-text">尚未選擇任何升級</p>
            <p class="empty-state-subtext">點擊「新增技能」開始計算</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Season Reference -->
  <div class="alert alert-info border-0 mb-3" role="alert">
    <div class="d-flex align-items-start gap-2 mb-2">
      <span class="fs-5">💡</span>
      <div class="flex-grow-1">
        <div class="fw-bold mb-2">賽季碎片獲取(白嫖)參考：</div>
        <div class="season-info-grid">
          {% for season in site.data.skills.season_fragments %}
          <div class="season-item">
            <span class="badge bg-{{ season.badge_color }} me-2">{{ season.season }}</span>
            <span class="fw-semibold">{{ season.class_level }}</span>
            <span class="text-primary fw-bold">{{ season.total }}碎片</span>
            <span class="text-muted small d-block d-md-inline ms-0 ms-md-2">{{ season.breakdown }}</span>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>

  <!-- Reference Table -->
  <div class="reference-panel">
    <div class="card border-0 shadow">
      <div class="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h3 class="mb-0 d-flex align-items-center gap-2">
          <span>📊</span>
          <span>技能升級碎片消耗表</span>
        </h3>
        <button class="btn btn-sm btn-outline-secondary" id="toggle-info-btn">
          <span class="toggle-icon">▼</span>
          <span class="ms-1">展開/收合</span>
        </button>
      </div>
      
      <div id="info-content" class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered text-center reference-table">
            <thead>
              <tr>
                <th class="align-middle" style="min-width: 120px;">
                  <div class="fw-bold">品質</div>
                  <div class="small text-muted">(單抽碎片)</div>
                </th>
                {% for i in (0..9) %}
                <th class="align-middle level-header">
                  <div class="level-badge">Lv {{ i }}→{{ i | plus: 1 }}</div>
                </th>
                {% endfor %}
              </tr>
            </thead>
            <tbody>
              {% assign sorted_specs = site.data.skills.skill_spec | sort: 'order' %}
              {% for spec in sorted_specs %}
              <tr>
                <td class="rarity-cell" style="{% if spec.color contains 'gradient' %}background: {{ spec.color }}{% else %}background-color: {{ spec.color }}{% endif %}">
                  <div class="rarity-name">{{ spec.name_c }}</div>
                  <div class="rarity-fragments">({{ spec.fragment_cost }})</div>
                </td>
                {% for level in spec.levels %}
                <td class="cost-cell">{{ level.cost }}</td>
                {% endfor %}
                {% assign remaining = 10 | minus: spec.levels.size %}
                {% for i in (1..remaining) %}
                <td class="empty-cell">—</td>
                {% endfor %}
              </tr>
              {% endfor %}
            </tbody>
          </table>
        </div>
        
        <div class="alert alert-info border-0 mb-0">
          <div class="row text-center g-3">
            <div class="col-md-6">
              <strong>💡 提示:</strong> 每個品質對應不同的升級等級上限
            </div>
            <div class="col-md-6">
              <strong>🎯 碎片數:</strong> 括號中的數字為該品質單次抽取獲得的碎片數
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Skill Card Template -->
<template id="skill-table-template">
  <div class="skill-card">
    <div class="skill-card-header">
      <div class="skill-card-number"></div>
      <button class="btn-remove" title="刪除此技能">
        <span>×</span>
      </button>
    </div>
    
    <div class="skill-card-body">
      <!-- Skill Selection -->
      <div class="form-group mb-3">
        <label class="form-label">
          <span class="label-icon">🎯</span>
          <span class="label-text">選擇技能</span>
        </label>
        <select class="form-select skill-name-select">
          <option value="">選擇技能 / Select Skill</option>
        </select>
      </div>

      <!-- Level Selection -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">
            <span class="label-icon">📍</span>
            <span class="label-text">當前等級</span>
          </label>
          <select class="form-select current-level-select">
            <option value="">選擇當前等級</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">
            <span class="label-icon">🎯</span>
            <span class="label-text">目標等級</span>
          </label>
          <select class="form-select target-level-select">
            <option value="">選擇目標等級</option>
          </select>
        </div>
      </div>

      <!-- Resources -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">
            <span class="label-icon">💎</span>
            <span class="label-text">已持有碎片</span>
          </label>
          <input type="number" class="form-control owned-fragments-input" value="0" min="0">
        </div>
        <div class="col-md-6">
          <label class="form-label">
            <span class="label-icon">📦</span>
            <span class="label-text">使用資源</span>
          </label>
          <div class="resource-toggles">
            <div class="resource-toggle">
              <input type="checkbox" class="form-check-input use-voucher-checkbox">
              <label class="form-check-label">🎫</label>
              <input type="number" class="form-control form-control-sm voucher-amount-input" value="0" min="0" disabled>
            </div>
            <div class="resource-toggle">
              <input type="checkbox" class="form-check-input use-box-checkbox">
              <label class="form-check-label">📦</label>
              <input type="number" class="form-control form-control-sm box-amount-input" value="0" min="0" disabled>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Display -->
      <div class="skill-stats">
        <div class="skill-stat">
          <span class="stat-label">消耗:</span>
          <span class="stat-value text-success skill-cost">0</span>
          <span class="stat-unit">碎片</span>
        </div>
        <div class="skill-stat skill-net-cost-label">
          <span class="stat-label">還需:</span>
          <span class="stat-value text-danger skill-net-cost">0</span>
          <span class="stat-unit">碎片</span>
        </div>
        <div class="skill-stat skill-after-resources-label" style="display: none;">
          <span class="stat-label">扣除後:</span>
          <span class="stat-value text-primary skill-after-resources">0</span>
          <span class="stat-unit">碎片</span>
        </div>
        <div class="skill-stat">
          <span class="stat-label">需抽:</span>
          <span class="stat-value text-info skill-draws">0</span>
          <span class="stat-unit">次</span>
        </div>
        <div class="skill-stat skill-vouchers-display" style="display: none;">
          <span class="text-warning">🎫 <strong class="skill-vouchers">0</strong> 張</span>
        </div>
        <div class="skill-stat skill-boxes-display" style="display: none;">
          <span class="text-info">📦 <strong class="skill-boxes">0</strong> 個</span>
        </div>
      </div>
    </div>
  </div>
</template>

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
</script>
<script src="{{ '/assets/js/skills-calculator.js' | relative_url }}"></script>