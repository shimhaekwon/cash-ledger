// ====== 현금 출납부 앱 ======

const STORAGE_KEY = 'cash-ledger-data';
const CATEGORIES_KEY = 'cash-ledger-categories';

// ====== 기본 분류 ======
const DEFAULT_CATEGORIES = {
  category1: ['급여', '용돈', '사업수입', '환급', '기타수입'],
  category2: ['식비', '교통비', '통신비', '의료비', '교육비', '여가비', '쇼핑', '주거비', '기타'],
  category3: []
};

// ====== 상태 ======
let currentType = 'income';
let transactions = [];
let categories = { ...DEFAULT_CATEGORIES };

// ====== 초기화 ======
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initUI();
  renderTransactions();
  updateBalance();
  updateStats();
});

// ====== 데이터 저장/로드 ======
function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  const savedCategories = localStorage.getItem(CATEGORIES_KEY);

  if (savedData) {
    transactions = JSON.parse(savedData);
  }

  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// ====== UI 초기화 ======
function initUI() {
  // 날짜 기본값
  const today = new Date();
  document.getElementById('date').value = today.toISOString().split('T')[0];
  document.getElementById('time').value = today.toTimeString().slice(0, 5);

  // 분류 드롭다운 채우기
  populateCategorySelects();

  // 분류 드롭다운 채우기
  populateCategorySelects();

  // 탭 전환
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // 구분 전환
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
    });
  });

  // 새 분류 추가
  document.getElementById('category1-new').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewCategory(1);
  });
  document.getElementById('category2-new').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewCategory(2);
  });
  document.getElementById('category3-new').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewCategory(3);
  });

  // 폼 제출
  document.getElementById('transaction-form').addEventListener('submit', handleSubmit);

  // 엑셀 내보내기
  document.getElementById('export-excel').addEventListener('click', exportToExcel);

  // 분류 관리
  document.getElementById('manage-categories').addEventListener('click', openCategoryModal);
  document.getElementById('close-modal').addEventListener('click', closeCategoryModal);

  // 데이터 삭제
  document.getElementById('clear-data').addEventListener('click', clearAllData);

  // 백업
  document.getElementById('backup-data').addEventListener('click', backupData);

  // 복원
  document.getElementById('restore-data').addEventListener('click', () => {
    document.getElementById('restore-file').click();
  });
  document.getElementById('restore-file').addEventListener('change', restoreData);

  // 필터
  populateMonthFilter();
  ['filter-type', 'filter-year', 'filter-month', 'filter-cat1', 'filter-cat2', 'filter-keyword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderTransactions);
    if (el) el.addEventListener('input', renderTransactions);
  });
}

// ====== 분류 드롭다운 ======
function populateCategorySelects() {
  ['category1', 'category2', 'category3'].forEach(cat => {
    const select = document.getElementById(cat);
    const currentValue = select.value;

    select.innerHTML = `<option value="">${cat === 'category1' ? '선택하세요' : '선택하세요 (선택사항)'}</option>`;

    categories[cat].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });

    if (categories[cat].includes(currentValue)) {
      select.value = currentValue;
    }
  });
}

function addNewCategory(level) {
  const input = document.getElementById(`category${level}-new`);
  const select = document.getElementById(`category${level}`);
  const value = input.value.trim();

  if (!value) return;

  if (!categories[`category${level}`].includes(value)) {
    categories[`category${level}`].push(value);
    saveData();
  }

  // 드롭다운 다시 채우기
  select.innerHTML = `<option value="">${level === 1 ? '선택하세요' : '선택하세요 (선택사항)'}</option>`;
  categories[`category${level}`].forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    if (c === value) opt.selected = true;
    select.appendChild(opt);
  });

  input.value = '';
  showToast(`'${value}' 추가됨`);
}

// ====== 탭 전환 ======
function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('active', tab.id === `tab-${tabName}`);
  });

  if (tabName === 'list') {
    renderTransactions();
  } else if (tabName === 'stats') {
    updateStats();
  }
}

// ====== 거래 추가 ======
function handleSubmit(e) {
  e.preventDefault();

  const amount = parseInt(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const category1 = document.getElementById('category1').value;
  const category2 = document.getElementById('category2').value;
  const category3 = document.getElementById('category3').value;
  const note = document.getElementById('note').value;

  if (!amount || !date || !category1) {
    showToast('금액, 날짜, 분류1은 필수입니다');
    return;
  }

  const transaction = {
    id: Date.now(),
    type: currentType,
    amount,
    date,
    time,
    category1,
    category2,
    category3,
    note
  };

  transactions.unshift(transaction);
  saveData();

  // 폼 리셋
  document.getElementById('amount').value = '';
  document.getElementById('note').value = '';
  document.getElementById('category1').value = '';
  document.getElementById('category2').value = '';
  document.getElementById('category3').value = '';

  const today = new Date();
  document.getElementById('date').value = today.toISOString().split('T')[0];
  document.getElementById('time').value = today.toTimeString().slice(0, 5);

  updateBalance();
  populateMonthFilter();
  showToast(currentType === 'income' ? '💰 입금 기록됨' : '💸 출금 기록됨');
}

// ====== 거래 목록 (스프레드 시트 스타일) ======
function renderTransactions() {
  const container = document.getElementById('transaction-list');

  const filterType = document.getElementById('filter-type')?.value || '';
  const filterYear = document.getElementById('filter-year')?.value || '';
  const filterMonth = document.getElementById('filter-month')?.value || '';
  const filterCat1 = document.getElementById('filter-cat1')?.value || '';
  const filterCat2 = document.getElementById('filter-cat2')?.value || '';
  const filterKeyword = document.getElementById('filter-keyword')?.value?.toLowerCase() || '';

  let filtered = transactions.filter(t => {
    if (filterType && t.type !== filterType) return false;
    if (filterYear && !t.date.startsWith(filterYear)) return false;
    if (filterMonth && !t.date.startsWith(filterMonth)) return false;
    if (filterCat1 && t.category1 !== filterCat1) return false;
    if (filterCat2 && t.category2 !== filterCat2) return false;
    if (filterKeyword && !t.note?.toLowerCase().includes(filterKeyword)) return false;
    return true;
  });

  const countEl = document.getElementById('result-count');
  if (countEl) countEl.textContent = `${filtered.length}건`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span>📝</span>
        <p>거래 내역이 없습니다</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="sheet-table">
      <div class="sheet-header">
        <span class="col-date">날짜</span>
        <span class="col-type">구분</span>
        <span class="col-amount">금액</span>
        <span class="col-cat1">분류1</span>
        <span class="col-cat2">분류2</span>
        <span class="col-memo">메모</span>
        <span class="col-action">작업</span>
      </div>
      ${filtered.map(t => `
        <div class="sheet-row ${t.type}">
          <span class="col-date">${t.date.slice(5)} ${t.time || ''}</span>
          <span class="col-type ${t.type}">${t.type === 'income' ? '입금' : '출금'}</span>
          <span class="col-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}</span>
          <span class="col-cat1">${t.category1}</span>
          <span class="col-cat2">${t.category2 || '-'}</span>
          <span class="col-memo">${t.note || '-'}</span>
          <span class="col-action">
            <button class="btn-icon" onclick="editTransaction(${t.id})" title="수정">✏️</button>
            <button class="btn-icon delete" onclick="deleteTransaction(${t.id})" title="삭제">🗑️</button>
          </span>
        </div>
      `).join('')}
    </div>
  `;
}

// ====== 거래 삭제 ======
function deleteTransaction(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderTransactions();
  updateBalance();
  showToast('삭제됨');
}

// ====== 거래 수정 ======
function editTransaction(id) {
  const t = transactions.find(tr => tr.id === id);
  if (!t) return;

  const form = document.getElementById('edit-form');
  form.innerHTML = `
    <input type="hidden" id="edit-id" value="${t.id}">
    <div class="form-group">
      <label>구분</label>
      <select id="edit-type" class="form-control">
        <option value="income" ${t.type === 'income' ? 'selected' : ''}>입금</option>
        <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>출금</option>
      </select>
    </div>
    <div class="form-group">
      <label>금액</label>
      <input type="number" id="edit-amount" value="${t.amount}" class="form-control">
    </div>
    <div class="form-group">
      <label>날짜</label>
      <input type="date" id="edit-date" value="${t.date}" class="form-control">
    </div>
    <div class="form-group">
      <label>분류1</label>
      <select id="edit-category1" class="form-control">
        ${categories.category1.map(c => `<option value="${c}" ${t.category1 === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>분류2</label>
      <select id="edit-category2" class="form-control">
        <option value="">선택안함</option>
        ${categories.category2.map(c => `<option value="${c}" ${t.category2 === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>분류3</label>
      <input type="text" id="edit-category3" value="${t.category3 || ''}" class="form-control" placeholder="직접입력">
    </div>
    <div class="form-group">
      <label>메모</label>
      <textarea id="edit-note" class="form-control" rows="2">${t.note || ''}</textarea>
    </div>
    <button type="button" class="btn-primary" onclick="saveEdit()">💾 저장</button>
  `;

  document.getElementById('edit-modal').classList.add('active');
}

function saveEdit() {
  const id = parseInt(document.getElementById('edit-id').value);
  const idx = transactions.findIndex(t => t.id === id);

  if (idx === -1) return;

  transactions[idx] = {
    ...transactions[idx],
    type: document.getElementById('edit-type').value,
    amount: parseInt(document.getElementById('edit-amount').value),
    date: document.getElementById('edit-date').value,
    category1: document.getElementById('edit-category1').value,
    category2: document.getElementById('edit-category2').value,
    category3: document.getElementById('edit-category3').value,
    note: document.getElementById('edit-note').value
  };

  saveData();
  document.getElementById('edit-modal').classList.remove('active');
  renderTransactions();
  updateBalance();
  showToast('수정됨');
}

document.getElementById('close-edit-modal').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.remove('active');
});

// ====== 잔액 업데이트 ======
function updateBalance() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const balanceEl = document.getElementById('balance');
  balanceEl.textContent = `₩${balance.toLocaleString()}`;
  balanceEl.style.color = balance >= 0 ? 'var(--income)' : 'var(--expense)';
}

// ====== 통계 ======
function updateStats() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById('total-income').textContent = `₩${income.toLocaleString()}`;
  document.getElementById('total-expense').textContent = `₩${expense.toLocaleString()}`;

  // 분류별 통계
  const catStats = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catStats[t.category1] = (catStats[t.category1] || 0) + t.amount;
  });

  const container = document.getElementById('category-stats');
  const sorted = Object.entries(catStats).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="empty-state">지출 내역이 없습니다</p>';
    return;
  }

  const maxAmount = sorted[0][1];
  container.innerHTML = `
    <h3>📊 지출 분류별</h3>
    ${sorted.map(([cat, amount]) => `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>${cat}</span>
          <span>₩${amount.toLocaleString()}</span>
        </div>
        <div style="background: var(--border); height: 8px; border-radius: 4px;">
          <div style="background: var(--expense); height: 100%; width: ${(amount / maxAmount * 100)}%; border-radius: 4px;"></div>
        </div>
      </div>
    `).join('')}
  `;
}

// ====== 월 필터 ======
function populateMonthFilter() {
  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
  const years = [...new Set(transactions.map(t => t.date.slice(0, 4)))].sort().reverse();
  const cat1Options = [...new Set(transactions.map(t => t.category1))].sort();
  const cat2Options = [...new Set(transactions.filter(t => t.category2).map(t => t.category2))].sort();

  const filterMonth = document.getElementById('filter-month');
  const filterYear = document.getElementById('filter-year');
  const filterCat1 = document.getElementById('filter-cat1');
  const filterCat2 = document.getElementById('filter-cat2');

  if (filterMonth) {
    filterMonth.innerHTML = '<option value="">전체 월</option>' +
      months.map(m => `<option value="${m}">${m}</option>`).join('');
  }
  if (filterYear) {
    filterYear.innerHTML = '<option value="">전체 연도</option>' +
      years.map(y => `<option value="${y}">${y}년</option>`).join('');
  }
  if (filterCat1) {
    filterCat1.innerHTML = '<option value="">전체 분류1</option>' +
      cat1Options.map(c => `<option value="${c}">${c}</option>`).join('');
  }
  if (filterCat2) {
    filterCat2.innerHTML = '<option value="">전체 분류2</option>' +
      cat2Options.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

// ====== 분류 관리 ======
function openCategoryModal() {
  const container = document.getElementById('category-list');

  container.innerHTML = ['category1', 'category2', 'category3'].map(level => {
    const cats = categories[level] || [];
    return `
    <h4 style="margin: 16px 0 8px;">분류${level.replace('category', '')}</h4>
    ${cats.length > 0 ? cats.map(c => `
      <div class="category-item">
        <span>${c}</span>
        <button onclick="deleteCategory('${level}', '${c}')">×</button>
      </div>
    `).join('') : '<span style="color:#666;">없음</span>'}
  `}).join('');

  document.getElementById('category-modal').classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('category-modal').classList.remove('active');
}

function deleteCategory(level, name) {
  if (!confirm(`'${name}'을(를) 삭제하시겠습니까?`)) return;

  categories[`category${level}`] = categories[`category${level}`].filter(c => c !== name);
  saveData();
  populateCategorySelects();
  openCategoryModal();
  showToast('삭제됨');
}

// ====== 엑셀 내보내기 ======
function exportToExcel() {
  if (transactions.length === 0) {
    showToast('내보낼 데이터가 없습니다');
    return;
  }

  // CSV 생성
  const headers = ['날짜', '시간', '구분', '금액', '분류1', '분류2', '분류3', '메모'];
  const rows = transactions.map(t => [
    t.date,
    t.time || '',
    t.type === 'income' ? '입금' : '출금',
    t.amount,
    t.category1,
    t.category2 || '',
    t.category3 || '',
    t.note || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `현금출납부_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();

  URL.revokeObjectURL(url);
  showToast('📥 엑셀(CSV) 다운로드 완료');
}

// ====== 전체 삭제 ======
function clearAllData() {
  if (!confirm('모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!')) return;
  if (!confirm('정말로 모든 거래 내역과 분류가 삭제됩니다!')) return;

  transactions = [];
  categories = { ...DEFAULT_CATEGORIES };
  saveData();
  renderTransactions();
  updateBalance();
  updateStats();
  populateCategorySelects();
  showToast('모든 데이터 삭제됨');
}

// ====== 유틸 ======
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ====== 백업/복원 ======
function backupData() {
  const backup = {
    version: 1,
    timestamp: new Date().toISOString(),
    transactions: transactions,
    categories: categories
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `현금출납부_백업_${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);
  showToast('💾 백업 파일 다운로드 완료!');
}

function restoreData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const backup = JSON.parse(event.target.result);

      if (!backup.transactions || !backup.categories) {
        showToast('❌ 올바른 백업 파일이 아닙니다');
        return;
      }

      if (!confirm(`정말 복원하시겠습니까?\n\n현재 데이터:\n- 거래: ${transactions.length}건\n- 백업: ${backup.transactions.length}건\n\n경고: 현재 데이터는 덮어씌워집니다!`)) {
        return;
      }

      transactions = backup.transactions;
      categories = backup.categories;
      saveData();

      populateCategorySelects();
      renderTransactions();
      updateBalance();
      updateStats();
      populateMonthFilter();

      showToast(`✅ ${backup.transactions.length}건 복원 완료!`);
    } catch (err) {
      showToast('❌ 파일 읽기 실패');
      console.error(err);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}