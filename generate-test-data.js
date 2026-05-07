// Chrome 개발자도구(F12) → Console에서 붙여넣기

// 분류 데이터
const incomeCategories = ['급여', '용돈', '사업수입', '환급', '기타수입', '포인트수익', '이자수익', '보너스'];
const expenseCategories = ['식비', '교통비', '통신비', '의료비', '교육비', '여가비', '쇼핑', '주거비', '보험료', '경조사비'];

// 100건 입금 생성
for (let i = 0; i < 100; i++) {
  transactions.unshift({
    id: Date.now() + i,
    type: 'income',
    amount: Math.floor(Math.random() * 500000) + 10000,
    date: `2026-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    category1: incomeCategories[Math.floor(Math.random() * incomeCategories.length)],
    category2: '',
    category3: '',
    note: `입금${i + 1}`
  });
}

// 100건 출금 생성
for (let i = 0; i < 100; i++) {
  transactions.unshift({
    id: Date.now() + 100 + i,
    type: 'expense',
    amount: Math.floor(Math.random() * 100000) + 5000,
    date: `2026-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    category1: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
    category2: ['아침', '점심', '저녁', '카페', '편의점'][Math.floor(Math.random() * 5)],
    category3: '',
    note: `출금${i + 1}`
  });
}

saveData();
location.reload();
console.log('✅ 200건 생성 완료! (입금100 + 출금100)');
console.log('입금 분류:', incomeCategories.join(', '));
console.log('출금 분류:', expenseCategories.join(', '));