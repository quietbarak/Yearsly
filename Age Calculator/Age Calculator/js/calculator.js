/* Age Calculator - Vanilla JavaScript */

function calculateAge(birthDate, targetDate) {
  const years = targetDate.getFullYear() - birthDate.getFullYear();
  const months = targetDate.getMonth() - birthDate.getMonth();
  const days = targetDate.getDate() - birthDate.getDate();

  let ageYears = years;
  let ageMonths = months;
  let ageDays = days;

  if (days < 0) {
    ageMonths--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    ageDays += prevMonth.getDate();
  }

  if (months < 0) {
    ageYears--;
    ageMonths += 12;
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return { years: ageYears, months: ageMonths, days: ageDays };
}

function totalDays(birthDate, targetDate) {
  const diffTime = targetDate - birthDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function nextBirthday(birthDate) {
  const today = new Date();
  const next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }
  const diffTime = next - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function dayOfWeekName(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function showFunFact(birthDate) {
  const factBox = document.getElementById('fun-fact');
  if (!birthDate) {
    factBox.innerHTML = '<p>Enter your date of birth to see your birth day details.</p>';
    return;
  }

  const dow = dayOfWeekName(birthDate);
  const today = new Date();
  const totalDaysVal = totalDays(birthDate, today);
  const totalWeeks = Math.floor(totalDaysVal / 7);

  factBox.innerHTML = `
    <p>You were born on a <strong>${dow}</strong>.</p>
    <p>You have lived approximately <strong>${totalWeeks.toLocaleString()}</strong> weeks.</p>
  `;
}

function calculateAndDisplay() {
  const dobStr = document.getElementById('dob').value;
  if (!dobStr) {
    alert('Please enter your date of birth.');
    return;
  }

  const birthDate = new Date(dobStr);
  const today = new Date();
  const age = calculateAge(birthDate, today);
  const tDays = totalDays(birthDate, today);
  const nbd = nextBirthday(birthDate);

  const resultBox = document.getElementById('result');
  resultBox.innerHTML = `
    <div class="result-age">${age.years} Years, ${age.months} Months, ${age.days} Days</div>
    <div class="result-details">
      <p>Total Days Lived: ${tDays.toLocaleString()}</p>
      <p>Next Birthday in: ${nbd} days</p>
    </div>
  `;
  resultBox.classList.add('active');
  showFunFact(birthDate);
}

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('calc-btn');
  if (btn) btn.addEventListener('click', calculateAndDisplay);

  const dob = document.getElementById('dob');
  if (dob) {
    dob.addEventListener('change', function() {
      if (this.value) calculateAndDisplay();
    });
    dob.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') calculateAndDisplay();
    });
  }

  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      answer.classList.toggle('open');
    });
  });
});