---
layout: default
title: 原初之星
---

<link rel="stylesheet" href="{{ '/assets/css/star-calculator.css' | relative_url }}">

{% assign ui = site.data['star-calculator_ui_text'] %}
{% assign help = site.data['star-calculator_help_content'] %}

<section class="container py-4" id="container-home">
  <!-- Page Header -->
  <div class="text-center mb-5">
    <h1 class="display-4 fw-bold mb-3">
      <span class="gradient-text">⭐ {{ ui.page_title }}</span>
    </h1>
    <p class="lead text-muted mb-0">{{ ui.page_subtitle }}</p>
    <p class="text-muted small">{{ ui.page_description }}</p>
  </div>

  <!-- Main Calculator Card -->
  <div class="card calculator-card shadow-lg border-0 mb-4">
    <div class="card-header gradient-header text-white py-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">
          <i class="fas fa-calculator me-2"></i>{{ ui.calculator.title }}
        </h5>
        <div class="header-actions">
          <button class="btn btn-light btn-sm" id="btn-help" type="button"
                  data-bs-toggle="modal" data-bs-target="#helpModal">
            <i class="fas fa-question-circle me-1"></i>{{ ui.calculator.buttons.help }}
          </button>
          <button class="btn btn-light btn-sm" id="btn-example" type="button">
            <i class="fas fa-magic me-1"></i>{{ ui.calculator.buttons.example }}
          </button>
          <button class="btn btn-outline-light btn-sm" id="btn-clear" type="button">
            <i class="fas fa-redo me-1"></i>{{ ui.calculator.buttons.clear }}
          </button>
        </div>
      </div>
    </div>

    <div class="card-body p-4">
      <div class="row g-4">
        <!-- Left Column - Inputs -->
        <div class="col-lg-6">
          <div class="input-section">
            <h6 class="section-title mb-3">
              <i class="fas fa-sliders-h me-2 text-primary"></i>基礎數值
            </h6>

            <!-- Season Select -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.season.icon }} me-2"></i>{{ ui.inputs.season.label }}
              </label>
              <select class="form-select form-control-custom" id="target-season">
                {% assign sorted_seasons = site.data.seasons.seasons | sort: "season_number" | reverse %}
                {% for item in sorted_seasons %}
                <option value="{{ item.season_number }}" 
                        data-color="{{ item.theme_color }}"
                        {% if item.season_number == site.data.seasons.current_season %}selected{% endif %}>
                  {{ item.title }}
                </option>
                {% endfor %}
              </select>
            </div>

            <!-- Level Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.level.icon }} me-2"></i>{{ ui.inputs.level.label }}
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-level" placeholder="{{ ui.inputs.level.placeholder }}" 
                     min="0" max="500" step="1" inputmode="numeric">
              <div class="input-feedback" id="text-score-level"></div>
            </div>

            <!-- Gear Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.gear.icon }} me-2"></i>{{ ui.inputs.gear.label }}
                <span class="text-muted small">({{ ui.inputs.gear.multiplier }})</span>
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-gear" placeholder="{{ ui.inputs.gear.placeholder }}" 
                     min="0" max="500" step="1" inputmode="numeric">
              <div class="input-feedback" id="text-score-gear"></div>
            </div>

            <!-- Skill Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.skill.icon }} me-2"></i>{{ ui.inputs.skill.label }}
                <span class="text-muted small">({{ ui.inputs.skill.multiplier }})</span>
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-skill" placeholder="{{ ui.inputs.skill.placeholder }}" 
                     min="0" max="500" step="1" inputmode="numeric">
              <div class="input-feedback" id="text-score-skill"></div>
            </div>

            <!-- Relics Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.relics.icon }} me-2"></i>{{ ui.inputs.relics.label }}
                <span class="text-muted small">({{ ui.inputs.relics.multiplier }})</span>
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-relics" placeholder="{{ ui.inputs.relics.placeholder }}" 
                     min="0" max="50" step="1" inputmode="numeric">
              <div class="input-feedback" id="text-score-relics"></div>
            </div>

            <!-- Pet Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.pet.icon }} me-2"></i>{{ ui.inputs.pet.label }}
                <span class="text-muted small">({{ ui.inputs.pet.multiplier }})</span>
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-pet" placeholder="{{ ui.inputs.pet.placeholder }}" 
                     min="0" max="500" step="1" inputmode="numeric">
              <div class="input-feedback" id="text-score-pet"></div>
            </div>

            <!-- Current Stars Input -->
            <div class="input-group-custom mb-3">
              <label class="input-label">
                <i class="{{ ui.inputs.current_stars.icon }} me-2"></i>{{ ui.inputs.current_stars.label }}
              </label>
              <input type="number" class="form-control form-control-custom" 
                     id="i-current-star" placeholder="{{ ui.inputs.current_stars.placeholder }}" 
                     value="0" min="0" max="10000" step="1" inputmode="numeric">
            </div>

            <!-- Calculation Summary (Mobile Only) -->
            <div class="calculation-summary mt-3 d-md-none">
              <div class="summary-header">
                <i class="fas fa-calculator me-2"></i>{{ ui.mobile_summary.title }}
              </div>
              <div class="summary-content" id="mobile-calc-summary">
                <div class="summary-item">
                  <span class="summary-label">{{ ui.mobile_summary.level }}</span>
                  <span class="summary-value" id="mobile-level-calc">-</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">{{ ui.mobile_summary.gear }}</span>
                  <span class="summary-value" id="mobile-gear-calc">-</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">{{ ui.mobile_summary.skill }}</span>
                  <span class="summary-value" id="mobile-skill-calc">-</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">{{ ui.mobile_summary.relics }}</span>
                  <span class="summary-value" id="mobile-relics-calc">-</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">{{ ui.mobile_summary.pet }}</span>
                  <span class="summary-value" id="mobile-pet-calc">-</span>
                </div>
                <div class="summary-total">
                  <span class="summary-label">{{ ui.mobile_summary.total }}</span>
                  <span class="summary-value text-primary" id="mobile-total-calc">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Results -->
        <div class="col-lg-6">
          <div class="results-section">
            <h6 class="section-title mb-3">
              <i class="fas fa-chart-line me-2 text-success"></i>{{ ui.results.title }}
            </h6>

            <!-- Total Stars Display -->
            <div class="result-card total-stars-card mb-4">
              <div class="result-label">{{ ui.results.total_stars }}</div>
              <div class="result-value" id="display-total-stars">0</div>
              <div class="result-detail" id="display-stars-breakdown">
                {{ ui.results.waiting }}
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats mb-4">
              <div class="stat-item">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                  <div class="stat-label">{{ ui.results.base_stars }}</div>
                  <div class="stat-value" id="stat-base-stars">0</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">➕</div>
                <div class="stat-content">
                  <div class="stat-label">{{ ui.results.added_stars }}</div>
                  <div class="stat-value text-success" id="stat-added-stars">+0</div>
                </div>
              </div>
            </div>

            <!-- Progress to Next Milestone -->
            <div class="milestone-card mb-4" id="milestone-display" style="visibility: hidden; display: none;">
              <div class="milestone-header mb-2">
                <span class="milestone-title">
                  <i class="fas fa-bullseye me-2"></i>{{ ui.results.next_milestone }}
                </span>
              </div>
              <div class="progress progress-custom mb-2">
                <div class="progress-bar" role="progressbar" 
                     style="width: 0%" id="progress-bar"></div>
              </div>
              <div class="milestone-info" id="milestone-info">
                {{ ui.results.calculating }}
              </div>
            </div>

            <!-- Desktop Calculation Preview -->
            <div class="calculation-preview d-none d-lg-block">
              <div class="preview-header">
                <i class="fas fa-calculator me-2"></i>計算明細
              </div>
              <div class="preview-content" id="desktop-calc-preview">
                <div class="preview-item">
                  <span class="preview-label">角色等級</span>
                  <span class="preview-value" id="desktop-level-calc">-</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">裝備等級</span>
                  <span class="preview-value" id="desktop-gear-calc">-</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">技能等級</span>
                  <span class="preview-value" id="desktop-skill-calc">-</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">古遺物等級</span>
                  <span class="preview-value" id="desktop-relics-calc">-</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">幻獸等級</span>
                  <span class="preview-value" id="desktop-pet-calc">-</span>
                </div>
                <div class="preview-total">
                  <span class="preview-label">總分數</span>
                  <span class="preview-value text-primary" id="desktop-total-calc">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Rewards Table -->
  <div class="card calculator-card shadow-lg border-0 mb-4">
    <div class="card-header gradient-header-secondary text-white py-3">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-gift me-2"></i>{{ ui.rewards.title }}
        </h5>
        <button class="btn btn-outline-light btn-sm d-md-none" type="button" 
                data-bs-toggle="collapse" data-bs-target="#rewards-content"
                aria-expanded="false" aria-controls="rewards-content">
          <i class="fas fa-chevron-down toggle-icon"></i>
        </button>
      </div>
    </div>
    <div class="collapse d-md-block" id="rewards-content">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover rewards-table mb-0">
            <thead>
              <tr>
                <th width="25%">{{ ui.rewards.type }}</th>
                <th width="25%">{{ ui.rewards.value }}</th>
                <th width="25%">{{ ui.rewards.type }}</th>
                <th width="25%">{{ ui.rewards.value }}</th>
              </tr>
            </thead>
            <tbody id="table-stars-body">
              <tr>
                <td colspan="4" class="text-center text-muted py-4">
                  <i class="fas fa-calculator fa-2x mb-2 d-block opacity-25"></i>
                  {{ ui.rewards.waiting }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="card calculator-card shadow-lg border-0 mb-4">
    <div class="card-header gradient-header-tertiary text-white py-3">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-road me-2"></i>{{ ui.timeline.title }}
        </h5>
        <button class="btn btn-outline-light btn-sm d-md-none" type="button" 
                data-bs-toggle="collapse" data-bs-target="#timeline-content"
                aria-expanded="false" aria-controls="timeline-content">
          <i class="fas fa-chevron-down toggle-icon"></i>
        </button>
      </div>
    </div>
    <div class="collapse d-md-block" id="timeline-content">
      <div class="card-body timeline-wrapper">
        <ul class="timeline" id="star-timeline">
          <li class="timeline-placeholder">
            <i class="fas fa-hourglass-start fa-2x mb-2 d-block"></i>
            <p>{{ ui.timeline.waiting }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Help Modal -->
<div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header gradient-header text-white">
        <h5 class="modal-title" id="helpModalLabel">
          <i class="fas fa-lightbulb me-2"></i>{{ ui.calculator.buttons.help }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="help-content">
          {% for section in help.sections %}
          <div class="help-section">
            <h6 class="help-section-title">
              <i class="{{ section.icon }} me-2"></i>{{ section.title }}
            </h6>
            
            {% if section.type == "list" %}
              <ul class="help-list">
                {% for item in section.items %}
                  <li>{{ item.text | default: item }}</li>
                {% endfor %}
              </ul>
            
            {% elsif section.type == "formula" %}
              <div class="formula-box">
                <p class="formula-main">{{ section.main_formula }}</p>
                <hr class="my-3">
                <p class="formula-subtitle">{{ section.subtitle }}</p>
                <ul class="formula-list">
                  {% for formula in section.formulas %}
                  <li>
                    <strong>{{ formula.label }}</strong> = {{ formula.formula }} 
                    <span class="text-primary">{{ formula.multiplier }}</span>
                  </li>
                  {% endfor %}
                </ul>
              </div>
            {% endif %}
          </div>
          {% endfor %}
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times me-1"></i>關閉
        </button>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/star-calculator.js' | relative_url }}"></script>
<script>
// Initialize calculator with data
document.addEventListener('DOMContentLoaded', function() {
    if (window.StarCalculator) {
        window.StarCalculator.init({
            seasonData: {{ site.data.seasons.seasons | jsonify }},
            starRewardsData: {{ site.data.star_rewards | jsonify }},
            uiText: {{ site.data['star-calculator_ui_text'] | jsonify }}
        });
    } else {
        console.error('StarCalculator not loaded!');
    }
});
</script>