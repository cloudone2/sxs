// ========================================
// DATA FROM JEKYLL (Will be injected)
// ========================================
// SKILLS object will be defined by Jekyll in the page

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
    get wrappers() { return $$('.skill-card'); }
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
    let idx1 = SKILLS.rarityOrder.indexOf(r1);
    let idx2 = SKILLS.rarityOrder.indexOf(r2); 
    let lv1 = parseInt(l1);
    let lv2 = parseInt(l2); 

    // Adjust for 0-based indexing
    //lv1 = lv1 === 0 ? 0 : lv1 - 1;
    if( r1 !== r2 && lv2 === 0 ) {
      idx2 = SKILLS.rarityOrder.indexOf(SKILLS.rarityOrder[idx2 - 1]);
      lv2 = SKILLS.specs[SKILLS.rarityOrder[idx2]].levels.length - 1; 
    }else{
      lv2 = lv2 === 0 ? 0 : lv2 - 1;
    }

    console.log("current-level-select: " + idx1 + "|" + lv1 + ",target-level-select: " + idx2 + "|" + lv2);

    let cost = 0, upgrades = 0;
    const qualities = new Set();

    for (let i = idx1; i <= idx2; i++) {
      const r = SKILLS.rarityOrder[i];
      const spec = SKILLS.specs[r];
      const start = i === idx1 ? lv1 : 0;
      const end = i === idx2 ? lv2 : spec.levels.length - 1;

      console.log(`Calculating ${spec.name_c} from level ${start} to ${end}`);
      
      for (let j = start; j <= end; j++) {
        cost += spec.levels[j];
        upgrades++;
        qualities.add(spec.name_c);

        console.log(`  Level ${j}: +${spec.levels[j]} fragments (Total: ${cost})`);
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
    $('#total-missing').textContent = totals.net;

    const totalMissingAfterResources = updateBalance(skills, totals.net);
    $('#total-missing-after-resources').textContent = totalMissingAfterResources;
    updateSummary(skills);
  }

  function updateBalance(skills, totalNet) {
    const ownedVouchers = parseInt($('#owned-vouchers').value) || 0;
    const ownedBoxes = parseInt($('#owned-boxes').value) || 0;

    let remVouchers = ownedVouchers;
    let remBoxes = ownedBoxes;

    let totalAfterResources = 0;

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

      totalAfterResources += stillNeeded;
    });

    // Calculate voucher and box needs based on total net
    const vouchersNeeded = Math.ceil(totalNet / SKILLS.resources.voucher.value);
    const boxesNeeded = totalNet;

    $('#voucher-count').textContent = vouchersNeeded;
    $('#box-count').textContent = boxesNeeded;

    return totalAfterResources;
  }

  function updateSummary(skills) {
    const content = $('#summary-content');
    if (skills.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <p class="empty-state-text">尚未選擇任何升級</p>
          <p class="empty-state-subtext">點擊「新增技能」開始計算</p>
        </div>
      `;
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
    const wrapper = $('.skill-card', clone);
    
    wrapper.dataset.skillId = state.counter;
    wrapper.dataset.cost = wrapper.dataset.upgrades = '0';

    // Set card number
    $('.skill-card-number', wrapper).textContent = `#${state.counter}`;

    const skillSelect = $('.skill-name-select', wrapper);
    const voucherCheckbox = $('.use-voucher-checkbox', wrapper);
    const voucherInput = $('.voucher-amount-input', wrapper);
    const boxCheckbox = $('.use-box-checkbox', wrapper);
    const boxInput = $('.box-amount-input', wrapper);

    populateSkills(skillSelect);

    skillSelect.onchange = function() {
      const skill = SKILLS.list.find(s => s.id === this.value);
      if (!skill) return;
      
      const w = this.closest('.skill-card');
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
      const w = this.closest('.skill-card');
      const rarity = w.dataset.rarity;
      if (rarity) {
        updateTargetLevels(w, SKILLS.rarityOrder.indexOf(rarity));
      }
      calculate(w);
    };

    $('.target-level-select', wrapper).onchange = function() {
      calculate(this.closest('.skill-card'));
    };

    $('.owned-fragments-input', wrapper).oninput = function() {
      updateDisplay(this.closest('.skill-card'));
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
      if (confirm('確定刪除此技能?')) {
        this.closest('.skill-card').remove();
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
    this.setAttribute('aria-expanded', String(!content.classList.contains('collapsed')));
  };

  $('#toggle-summary-btn').onclick = function() {
    const content = $('#summary-content-panel');
    content.classList.toggle('collapsed');
    this.classList.toggle('collapsed');
    this.setAttribute('aria-expanded', String(!content.classList.contains('collapsed')));
  };

  $('#global-class-select').onchange = function() {
    state.classFilter = this.value;
    state.wrappers.forEach(w => populateSkills($('.skill-name-select', w)));
  };

  $('#add-skill-btn').onclick = addSkill;
  
  $('#reset-all-btn').onclick = function() {
    if (confirm('確定要重置所有資料?')) {
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

  // Add initial skill card
  addSkill();
});
