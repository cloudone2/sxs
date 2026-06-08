---
layout: default
title: 經驗時間計算器
---

{% capture seasons_data %}
{{ site.data.seasons | jsonify }}
{% endcapture %}

{% capture s1_exp_data %}
{{ site.data._exps.s1 | jsonify }}
{% endcapture %}

{% capture s2_exp_data %}
{{ site.data._exps.s2 | jsonify }}
{% endcapture %}

{% capture s3_exp_data %}
{{ site.data._exps.s3 | jsonify }}
{% endcapture %}

{% capture s4_exp_data %}
{{ site.data._exps.s4 | jsonify }}
{% endcapture %}

{% capture s5_exp_data %}
{{ site.data._exps.s5 | jsonify }}
{% endcapture %}

<link rel="stylesheet" href="{{ '/assets/css/exp-calculator.css' | relative_url }}">

<section class="container py-4" id="container-exp">
  <div class="text-center mb-5">
    <h1 class="display-5 fw-bold mb-3">
      <span class="gradient-text"><i class="fas fa-hourglass-half me-2"></i>經驗時間計算器</span>
    </h1>
    <p class="lead text-muted mb-0">輸入目前進度與每小時 EXP，快速估算達成目標等級的時間</p>
  </div>

  <div class="card calculator-card shadow-lg border-0 mb-4">
    <div class="card-header gradient-header text-white py-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0">
          <i class="fas fa-calculator me-2"></i>經驗進度計算
        </h5>
        <div class="header-actions">
          <button class="btn btn-light btn-sm" id="btn-example" type="button">
            <i class="fas fa-magic me-1"></i>範例
          </button>
          <button class="btn btn-outline-light btn-sm" id="btn-clear" type="button">
            <i class="fas fa-redo me-1"></i>清空
          </button>
        </div>
      </div>
    </div>

    <div class="card-body p-4">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="input-section">
            <h6 class="section-title mb-3">
              <i class="fas fa-sliders-h me-2"></i>輸入設定
            </h6>

            <div class="input-group-custom mb-3">
              <label class="input-label" for="season-select">
                <span><i class="fas fa-calendar-alt me-2"></i>賽季</span>
              </label>
              <select class="form-select form-control-custom" id="season-select">
                {% assign sorted_seasons = site.data.seasons.seasons | sort: "season_number" | reverse %}
                {% for item in sorted_seasons %}
                <option value="{{ item.id }}" {% if item.id == site.data.seasons.current_season %}selected{% endif %}>
                  {{ item.title }}
                </option>
                {% endfor %}
              </select>
            </div>

            <div class="input-group-custom mb-3">
              <label class="input-label" for="current-level">
                <span><i class="fas fa-layer-group me-2"></i>現在等級（現Lv）</span>
              </label>
              <input type="number" class="form-control form-control-custom" id="current-level" min="1" step="1" inputmode="numeric" value="1">
            </div>

            <div class="input-group-custom mb-3">
              <label class="input-label" for="current-exp">
                <span><i class="fas fa-flask me-2"></i>現有經驗（現Exp）</span>
              </label>
              <div class="input-group">
                <input type="number" class="form-control form-control-custom" id="current-exp" min="0" step="any" inputmode="decimal" value="0">
                <select class="form-select form-control-custom unit-select" id="current-exp-unit">
                  <option value="1"></option>
                  <option value="1000">千</option>
                  <option value="10000">萬</option>
                  <option value="100000000">億</option>
                </select>
              </div>
            </div>

            <div class="input-group-custom mb-3">
              <label class="input-label" for="target-level">
                <span><i class="fas fa-bullseye me-2"></i>目標等級（目標Lv）</span>
              </label>
              <input type="number" class="form-control form-control-custom" id="target-level" min="1" step="1" inputmode="numeric" value="2">
            </div>

            <div class="input-group-custom mb-3">
              <label class="input-label" for="exp-per-hour">
                <span><i class="fas fa-tachometer-alt me-2"></i>每小時經驗（EXP/h）</span>
              </label>
              <div class="input-group">
                <input type="number" class="form-control form-control-custom" id="exp-per-hour" min="0" step="any" inputmode="decimal" value="0">
                <select class="form-select form-control-custom unit-select" id="exp-per-hour-unit">
                  <option value="1"></option>
                  <option value="1000">千</option>
                  <option value="10000">萬</option>
                  <option value="100000000">億</option>
                </select>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-sm-6">
                <div class="input-group-custom mb-0">
                  <label class="input-label" for="daily-accel">
                    <span><i class="fas fa-bolt me-2"></i>日常加速次數</span>
                  </label>
                  <input type="number" class="form-control form-control-custom" id="daily-accel" min="0" step="1" inputmode="numeric" value="0">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="input-group-custom mb-0">
                  <label class="input-label" for="stone-accel">
                    <span><i class="fas fa-gem me-2"></i>加速石頭次數</span>
                  </label>
                  <input type="number" class="form-control form-control-custom" id="stone-accel" min="0" step="1" inputmode="numeric" value="0">
                </div>
              </div>
            </div>

            <div class="alert alert-info mt-3 mb-0 py-2">
              <i class="fas fa-circle-info me-1"></i>加速石 = +2 hours exp
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="results-section">
            <h6 class="section-title mb-3">
              <i class="fas fa-chart-line me-2"></i>計算結果
            </h6>

            <div id="calc-error" class="alert alert-danger d-none" role="alert"></div>

            <div class="result-grid">
              <div class="result-item">
                <span class="result-label">剩餘經驗值</span>
                <span class="result-value" id="remaining-exp">--</span>
              </div>
              <div class="result-item">
                <span class="result-label">現在時間</span>
                <span class="result-value" id="current-time">--</span>
              </div>
              <div class="result-item">
                <span class="result-label">完成時間</span>
                <span class="result-value" id="finish-time">--</span>
              </div>
              <div class="result-item">
                <span class="result-label">加速完成</span>
                <span class="result-value" id="accelerated-finish-time">--</span>
              </div>
              <div class="result-item">
                <span class="result-label">倒數</span>
                <span class="result-value" id="countdown">--</span>
              </div>
              <div class="result-item">
                <span class="result-label">加速倒數</span>
                <span class="result-value" id="accelerated-countdown">--</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card calculator-card shadow-sm border-0">
    <div class="card-header gradient-header text-white py-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="mb-0"><i class="fas fa-table me-2"></i>賽季等級經驗表</h5>
        <button class="btn btn-outline-light btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#season-exp-collapse" aria-expanded="false" aria-controls="season-exp-collapse">
          <i class="fas fa-chevron-down toggle-icon"></i>
        </button>
      </div>
    </div>

    <div class="collapse" id="season-exp-collapse">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0" id="season-exp-table">
            <thead>
              <tr>
                <th scope="col" class="px-3">等級</th>
                <th scope="col" class="px-3">經驗</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  window.expCalculatorData = {
    seasonsData: {{ seasons_data }},
    expTables: {
      s1: {{ s1_exp_data }},
      s2: {{ s2_exp_data }},
      s3: {{ s3_exp_data }},
      s4: {{ s4_exp_data }},
      s5: {{ s5_exp_data }}
    }
  };
</script>
<script src="{{ '/assets/js/exp-calculator.js' | relative_url }}"></script>
