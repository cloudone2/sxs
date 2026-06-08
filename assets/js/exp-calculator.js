(() => {
    const state = {
        seasons: [],
        expTables: {},
        currentSeasonId: null,
        currentResult: null,
        countdownTimer: null
    };

    const elements = {
        seasonSelect: null,
        currentLevel: null,
        currentExp: null,
        currentExpUnit: null,
        targetLevel: null,
        expPerHour: null,
        expPerHourUnit: null,
        dailyAccel: null,
        stoneAccel: null,
        btnExample: null,
        btnClear: null,
        error: null,
        remainingExp: null,
        currentTime: null,
        finishTime: null,
        acceleratedFinishTime: null,
        countdown: null,
        acceleratedCountdown: null,
        seasonTableBody: null
    };

    function initialize() {
        if (!window.expCalculatorData) {
            return;
        }

        cacheElements();
        state.seasons = window.expCalculatorData.seasonsData?.seasons || [];
        state.expTables = window.expCalculatorData.expTables || {};
        state.currentSeasonId = window.expCalculatorData.seasonsData?.current_season || state.seasons[0]?.id || 's1';

        bindEvents();
        initializeSeasonSelect();
        applySeasonById(state.currentSeasonId);
        calculateAndRender();
        startCountdownTicker();
    }

    function cacheElements() {
        elements.seasonSelect = document.getElementById('season-select');
        elements.currentLevel = document.getElementById('current-level');
        elements.currentExp = document.getElementById('current-exp');
        elements.currentExpUnit = document.getElementById('current-exp-unit');
        elements.targetLevel = document.getElementById('target-level');
        elements.expPerHour = document.getElementById('exp-per-hour');
        elements.expPerHourUnit = document.getElementById('exp-per-hour-unit');
        elements.dailyAccel = document.getElementById('daily-accel');
        elements.stoneAccel = document.getElementById('stone-accel');
        elements.btnExample = document.getElementById('btn-example');
        elements.btnClear = document.getElementById('btn-clear');
        elements.error = document.getElementById('calc-error');
        elements.remainingExp = document.getElementById('remaining-exp');
        elements.currentTime = document.getElementById('current-time');
        elements.finishTime = document.getElementById('finish-time');
        elements.acceleratedFinishTime = document.getElementById('accelerated-finish-time');
        elements.countdown = document.getElementById('countdown');
        elements.acceleratedCountdown = document.getElementById('accelerated-countdown');
        elements.seasonTableBody = document.querySelector('#season-exp-table tbody');
    }

    function bindEvents() {
        elements.seasonSelect?.addEventListener('change', (event) => {
            applySeasonById(event.target.value);
            calculateAndRender();
        });

        [
            elements.currentLevel,
            elements.currentExp,
            elements.currentExpUnit,
            elements.targetLevel,
            elements.expPerHour,
            elements.expPerHourUnit,
            elements.dailyAccel,
            elements.stoneAccel
        ].forEach((element) => {
            element?.addEventListener('input', calculateAndRender);
            element?.addEventListener('change', calculateAndRender);
        });

        elements.btnExample?.addEventListener('click', applyExample);
        elements.btnClear?.addEventListener('click', clearInputs);
    }

    function initializeSeasonSelect() {
        const sortedSeasons = [...state.seasons].sort((a, b) => (b.season_number || 0) - (a.season_number || 0));

        if (!elements.seasonSelect) {
            return;
        }

        elements.seasonSelect.innerHTML = '';
        sortedSeasons.forEach((season) => {
            const option = document.createElement('option');
            option.value = season.id;
            option.textContent = season.title;
            if (season.id === state.currentSeasonId) {
                option.selected = true;
            }
            elements.seasonSelect.appendChild(option);
        });
    }

    function applySeasonById(seasonId) {
        if (!seasonId) {
            return;
        }

        state.currentSeasonId = seasonId;

        if (elements.seasonSelect) {
            elements.seasonSelect.value = seasonId;
        }

        applyTheme(seasonId);
        syncLevelBounds();
        renderSeasonExpTable();
    }

    function applyTheme(seasonId) {
        const season = state.seasons.find((item) => item.id === seasonId);
        if (!season) {
            return;
        }

        const primary = season.theme_color || '#667eea';
        const light = lightenColor(primary, 20);

        document.documentElement.style.setProperty('--season-color', primary);
        document.documentElement.style.setProperty('--season-color-light', light);

        if (season.theme_gradient) {
            document.documentElement.style.setProperty('--season-gradient', season.theme_gradient);
        } else {
            document.documentElement.style.setProperty('--season-gradient', `linear-gradient(135deg, ${primary} 0%, ${light} 100%)`);
        }
    }

    function getSeasonLevels() {
        const seasonData = state.expTables[state.currentSeasonId];
        return seasonData?.levels || [];
    }

    function syncLevelBounds() {
        const levels = getSeasonLevels();
        const maxLevel = levels.length ? Math.max(...levels.map((item) => item.level || 0)) : 1;

        elements.currentLevel?.setAttribute('max', String(maxLevel));
        elements.targetLevel?.setAttribute('max', String(maxLevel));

        if (elements.currentLevel && (!elements.currentLevel.value || Number(elements.currentLevel.value) < 1)) {
            elements.currentLevel.value = '1';
        }

        if (elements.targetLevel) {
            const currentLevel = parseInteger(elements.currentLevel?.value, 1);
            const defaultTarget = Math.min(maxLevel, Math.max(currentLevel, currentLevel + 1));
            if (!elements.targetLevel.value || Number(elements.targetLevel.value) < 1) {
                elements.targetLevel.value = String(defaultTarget);
            }
        }
    }

    function renderSeasonExpTable() {
        if (!elements.seasonTableBody) {
            return;
        }

        const levels = getSeasonLevels();
        elements.seasonTableBody.innerHTML = '';

        levels.forEach((entry) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class="px-3">${entry.level}</td><td class="px-3">${formatNumber(entry.exp)}</td>`;
            elements.seasonTableBody.appendChild(row);
        });
    }

    function calculateAndRender() {
        const input = parseInputValues();
        if (!input.ok) {
            showError(input.message);
            renderEmptyResult();
            state.currentResult = null;
            return;
        }

        const calculation = calculateResult(input.values);
        if (!calculation.ok) {
            showError(calculation.message);
            renderEmptyResult();
            state.currentResult = null;
            return;
        }

        hideError();
        state.currentResult = calculation.values;
        renderResult(calculation.values);
    }

    function parseInputValues() {
        const levels = getSeasonLevels();
        if (!levels.length) {
            return { ok: false, message: '目前賽季找不到經驗表資料。' };
        }

        const maxLevel = Math.max(...levels.map((item) => item.level || 0));
        const currentLevel = parseInteger(elements.currentLevel?.value, NaN);
        const targetLevel = parseInteger(elements.targetLevel?.value, NaN);
        const currentExp = parseNonNegativeNumber(elements.currentExp?.value) * parseMultiplier(elements.currentExpUnit?.value);
        const expPerHour = parseNonNegativeNumber(elements.expPerHour?.value) * parseMultiplier(elements.expPerHourUnit?.value);
        const dailyAccel = parseInteger(elements.dailyAccel?.value, 0);
        const stoneAccel = parseInteger(elements.stoneAccel?.value, 0);

        if (!Number.isInteger(currentLevel) || currentLevel < 1 || currentLevel > maxLevel) {
            return { ok: false, message: `現Lv 需介於 1 ~ ${maxLevel}。` };
        }

        if (!Number.isInteger(targetLevel) || targetLevel < currentLevel || targetLevel > maxLevel) {
            return { ok: false, message: `目標Lv 需介於 現Lv ~ ${maxLevel}。` };
        }

        if (!Number.isFinite(currentExp) || currentExp < 0) {
            return { ok: false, message: '現Exp 需為 0 以上的數值。' };
        }

        if (!Number.isFinite(expPerHour) || expPerHour <= 0) {
            return { ok: false, message: 'EXP/h 需大於 0。' };
        }

        if (!Number.isInteger(dailyAccel) || dailyAccel < 0 || !Number.isInteger(stoneAccel) || stoneAccel < 0) {
            return { ok: false, message: '加速次數需為 0 以上整數。' };
        }

        return {
            ok: true,
            values: {
                currentLevel,
                targetLevel,
                currentExp,
                expPerHour,
                dailyAccel,
                stoneAccel
            }
        };
    }

    function calculateResult(input) {
        const levels = getSeasonLevels();
        const expByLevel = new Map(levels.map((item) => [item.level, Number(item.exp || 0)]));

        let totalExp = 0;
        for (let level = input.currentLevel; level < input.targetLevel; level += 1) {
            const requirement = expByLevel.get(level);
            if (!Number.isFinite(requirement)) {
                return { ok: false, message: `缺少 Lv${level} 的經驗資料。` };
            }
            totalExp += requirement;
        }

        const currentLevelRequirement = expByLevel.get(input.currentLevel) || 0;
        const currentProgress = Math.min(input.currentExp, currentLevelRequirement);
        const remainingExp = Math.max(0, totalExp - currentProgress);

        const now = new Date();
        const baseHours = remainingExp / input.expPerHour;
        const bonusHours = (input.dailyAccel + input.stoneAccel) * 2;
        const acceleratedHours = Math.max(0, baseHours - bonusHours);

        const finishTime = new Date(now.getTime() + baseHours * 60 * 60 * 1000);
        const acceleratedFinishTime = new Date(now.getTime() + acceleratedHours * 60 * 60 * 1000);

        return {
            ok: true,
            values: {
                remainingExp,
                now,
                finishTime,
                acceleratedFinishTime,
                finishAt: finishTime.getTime(),
                acceleratedFinishAt: acceleratedFinishTime.getTime()
            }
        };
    }

    function renderResult(result) {
        elements.remainingExp.textContent = formatNumber(Math.ceil(result.remainingExp));
        elements.currentTime.textContent = formatDate(result.now);
        elements.finishTime.textContent = formatDate(result.finishTime);
        elements.acceleratedFinishTime.textContent = formatDate(result.acceleratedFinishTime);
        elements.countdown.textContent = formatDuration(result.finishAt - Date.now());
        elements.acceleratedCountdown.textContent = formatDuration(result.acceleratedFinishAt - Date.now());
    }

    function renderEmptyResult() {
        elements.remainingExp.textContent = '--';
        elements.currentTime.textContent = '--';
        elements.finishTime.textContent = '--';
        elements.acceleratedFinishTime.textContent = '--';
        elements.countdown.textContent = '--';
        elements.acceleratedCountdown.textContent = '--';
    }

    function startCountdownTicker() {
        if (state.countdownTimer) {
            clearInterval(state.countdownTimer);
        }

        state.countdownTimer = setInterval(() => {
            if (!state.currentResult) {
                return;
            }

            const now = new Date();
            elements.currentTime.textContent = formatDate(now);
            elements.countdown.textContent = formatDuration(state.currentResult.finishAt - now.getTime());
            elements.acceleratedCountdown.textContent = formatDuration(state.currentResult.acceleratedFinishAt - now.getTime());
        }, 1000);
    }

    function applyExample() {
        const levels = getSeasonLevels();
        const maxLevel = levels.length ? Math.max(...levels.map((item) => item.level || 0)) : 100;

        elements.currentLevel.value = '1';
        elements.currentExp.value = '0';
        elements.currentExpUnit.value = '1';
        elements.targetLevel.value = String(Math.min(maxLevel, 10));
        elements.expPerHour.value = '5';
        elements.expPerHourUnit.value = '10000';
        elements.dailyAccel.value = '3';
        elements.stoneAccel.value = '0';

        calculateAndRender();
    }

    function clearInputs() {
        elements.currentLevel.value = '1';
        elements.currentExp.value = '0';
        elements.currentExpUnit.value = '1';
        elements.targetLevel.value = '2';
        elements.expPerHour.value = '0';
        elements.expPerHourUnit.value = '1';
        elements.dailyAccel.value = '0';
        elements.stoneAccel.value = '0';
        calculateAndRender();
    }

    function showError(message) {
        if (!elements.error) {
            return;
        }

        elements.error.classList.remove('d-none');
        elements.error.textContent = message;
    }

    function hideError() {
        if (!elements.error) {
            return;
        }

        elements.error.classList.add('d-none');
        elements.error.textContent = '';
    }

    function parseInteger(value, fallback) {
        const parsed = Number.parseInt(value, 10);
        return Number.isInteger(parsed) ? parsed : fallback;
    }

    function parseNonNegativeNumber(value) {
        const parsed = Number.parseFloat(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
            return 0;
        }
        return parsed;
    }

    function parseMultiplier(value) {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString();
    }

    function formatDate(date) {
        return new Date(date).toLocaleString();
    }

    function formatDuration(milliseconds) {
        if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
            return '0秒';
        }

        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days}天 ${hours}時 ${minutes}分 ${seconds}秒`;
    }

    function lightenColor(color, percent) {
        const hex = color.replace('#', '');
        const r = Number.parseInt(hex.substring(0, 2), 16);
        const g = Number.parseInt(hex.substring(2, 4), 16);
        const b = Number.parseInt(hex.substring(4, 6), 16);

        const amount = Math.round(2.55 * percent);
        const nextR = Math.min(255, r + amount);
        const nextG = Math.min(255, g + amount);
        const nextB = Math.min(255, b + amount);

        return `#${nextR.toString(16).padStart(2, '0')}${nextG.toString(16).padStart(2, '0')}${nextB.toString(16).padStart(2, '0')}`;
    }

    document.addEventListener('DOMContentLoaded', initialize);
})();
