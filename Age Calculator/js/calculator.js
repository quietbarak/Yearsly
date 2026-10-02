/* ============================================================
   Yearsly - calculator.js
   Handles: Age Calculator, Date Difference, Age Difference,
            Birthday Countdown, and the FAQ accordion.
   ============================================================ */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Parse a date-input value (YYYY-MM-DD) safely without timezone shift.
 * `new Date('YYYY-MM-DD')` parses as UTC midnight, which in negative-offset
 * timezones (e.g. UTC-5) becomes the previous calendar day locally.
 * We split the string and use the local Date constructor instead.
 *
 * @param  {string} str  Value from <input type="date"> (YYYY-MM-DD or '')
 * @returns {Date|null}
 */
function parseLocalDate(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1; // month is 0-indexed
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  const date = new Date(y, m, d);
  // Verify the date is valid and didn't roll over (e.g. Feb 31 -> Mar 3)
  if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) {
    return null; // impossible date like Feb 30
  }
  return date;
}

/**
 * Return today's date at local midnight (time stripped).
 * @returns {Date}
 */
function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Compute age (years, months, days) from birthDate to targetDate.
 * Both dates must be at local midnight (no time component).
 *
 * Algorithm: calendar-accurate subtraction using the same month-borrow
 * logic used by most age calculators and civil law.
 *
 * @param  {Date} birthDate
 * @param  {Date} targetDate
 * @returns {{ years: number, months: number, days: number }}
 */
function calculateAge(birthDate, targetDate) {
  let years  = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth()    - birthDate.getMonth();
  let days   = targetDate.getDate()     - birthDate.getDate();

  // Borrow days from the previous month when day difference is negative
  if (days < 0) {
    months--;
    // Get the number of days in the month BEFORE targetDate's current month
    const lastDayOfPrevMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      0        // day 0 = last day of the previous month
    ).getDate();
    days += lastDayOfPrevMonth;
  }

  // Borrow months from years when month difference is negative
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Total whole days between two dates (at local midnight).
 * @param  {Date} from
 * @param  {Date} to
 * @returns {number}
 */
function daysBetween(from, to) {
  return Math.round((to - from) / 86400000);
}

/**
 * Name of the day of the week for a given Date.
 * @param  {Date} date
 * @returns {string}
 */
function dayOfWeekName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Days until the next birthday (from today's perspective).
 * Returns 0 if the birthday is today; returns days to next year if
 * this year's birthday has already passed.
 *
 * @param  {Date} birthDate  parsed birth date
 * @param  {Date} [ref]      reference date (defaults to today())
 * @returns {number}
 */
function daysUntilNextBirthday(birthDate, ref) {
  ref = ref || today();
  const bm = birthDate.getMonth();
  const bd = birthDate.getDate();

  let next = new Date(ref.getFullYear(), bm, bd);

  // If this year's birthday has already passed, use next year
  if (next < ref) {
    next = new Date(ref.getFullYear() + 1, bm, bd);
  }
  // Handle Feb 29 birthday in a non-leap target year
  // (new Date(year, 1, 29) auto-rolls to Mar 1 in non-leap years)
  if (bm === 1 && bd === 29 && next.getMonth() !== 1) {
    // Fall back to Feb 28 of that year
    next = new Date(next.getFullYear(), 1, 28);
  }

  return daysBetween(ref, next);
}

/**
 * Check whether two dates share the same month and day.
 * @param  {Date} a
 * @param  {Date} b
 * @returns {boolean}
 */
function isSameMonthDay(a, b) {
  return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ============================================================
   UI HELPERS
   ============================================================ */

/**
 * Show an inline validation error on a form field.
 * @param {HTMLInputElement} input
 * @param {string}           message
 */
function showFieldError(input, message) {
  input.classList.add('is-error');
  let errEl = input.nextElementSibling;
  if (!errEl || !errEl.classList.contains('field-error')) {
    errEl = document.createElement('p');
    errEl.className = 'field-error';
    input.after(errEl);
  }
  errEl.textContent = message;
  errEl.classList.add('visible');
}

/**
 * Clear validation error on a form field.
 * @param {HTMLInputElement} input
 */
function clearFieldError(input) {
  input.classList.remove('is-error');
  const errEl = input.nextElementSibling;
  if (errEl && errEl.classList.contains('field-error')) {
    errEl.classList.remove('visible');
  }
}

/**
 * Show the result box with animated reveal.
 * @param {HTMLElement} resultBox
 * @param {string}      html
 */
function showResult(resultBox, html) {
  resultBox.innerHTML = html;
  resultBox.classList.add('active');
}

/**
 * Hide the result box.
 * @param {HTMLElement} resultBox
 */
function hideResult(resultBox) {
  resultBox.classList.remove('active');
}

/* ============================================================
   TOOL 1: Age Calculator  (index.html and age-calculator.html)
   Elements: #dob, optional #calc-date, #calc-btn, #result, #fun-fact
   ============================================================ */
function initAgeCalculator() {
  const dobInput    = document.getElementById('dob');
  const calcDateInput = document.getElementById('calc-date');
  const btn         = document.getElementById('calc-btn');
  const resultBox   = document.getElementById('result');
  const funFact     = document.getElementById('fun-fact');

  if (!dobInput || !btn || !resultBox) return; // not on this page

  // Don't activate on the birthday-countdown page (shares same IDs)
  const card = dobInput.closest('.calculator-card');
  if (card && card.dataset.tool === 'birthday-countdown') return;

  // Set the DOB max to today and min to 1900 to fix browser UI bugs
  const todayStr = today().toISOString().split('T')[0];
  dobInput.max = todayStr;
  dobInput.min = '1900-01-01';

  // If the "calculate on date" input exists, default it to today
  if (calcDateInput) {
    if (!calcDateInput.value || calcDateInput.value < todayStr) {
      calcDateInput.value = todayStr;
    }
    // Its max is unbounded (future dates are valid for this field)
  }

  function run() {
    clearFieldError(dobInput);

    const dobStr = dobInput.value;
    if (!dobStr) {
      showFieldError(dobInput, 'Please enter your date of birth.');
      hideResult(resultBox);
      return;
    }

    const birthDate = parseLocalDate(dobStr);
    if (!birthDate) {
      showFieldError(dobInput, 'That date is not valid. Please try again.');
      hideResult(resultBox);
      return;
    }

    // Determine reference date (custom "calculate on" date or today)
    let refDate = today();
    if (calcDateInput && calcDateInput.value) {
      const parsed = parseLocalDate(calcDateInput.value);
      if (parsed) refDate = parsed;
    }

    // Future birth date validation
    if (birthDate > refDate) {
      showFieldError(dobInput, 'Date of birth cannot be in the future.');
      hideResult(resultBox);
      return;
    }

    const age    = calculateAge(birthDate, refDate);
    const tDays  = daysBetween(birthDate, refDate);
    const tWeeks = Math.floor(tDays / 7);
    const nbd    = daysUntilNextBirthday(birthDate, refDate);
    const isToday = isSameMonthDay(birthDate, refDate);

    const bdayLabel  = nbd === 0 ? 'Today! 🎉' : nbd === 1 ? 'Tomorrow' : `${nbd.toLocaleString()} days`;
    const nextBdYear = refDate.getFullYear() + (isSameMonthDay(birthDate, refDate) ? 0 : (new Date(refDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()) < refDate ? 1 : 0));

    let html = '';

    if (isToday) {
      html += `<div class="birthday-today">🎂 Happy Birthday! Today is your special day!</div>`;
    }

    html += `
      <div class="result-age">
        ${age.years} Year${age.years !== 1 ? 's' : ''}, ${age.months} Month${age.months !== 1 ? 's' : ''}, ${age.days} Day${age.days !== 1 ? 's' : ''}
      </div>
      <div class="result-details">
        <p><span>Total days lived</span><span class="result-val">${tDays.toLocaleString()}</span></p>
        <p><span>Total weeks lived</span><span class="result-val">${tWeeks.toLocaleString()}</span></p>
        <p><span>Total months lived</span><span class="result-val">${(age.years * 12 + age.months).toLocaleString()}</span></p>
        <p><span>Next birthday</span><span class="result-val">${bdayLabel}</span></p>
      </div>
    `;

    showResult(resultBox, html);

    // Fun fact panel
    if (funFact) {
      const dow = dayOfWeekName(birthDate);
      funFact.innerHTML = `
        <p>You were born on a <strong>${dow}</strong>.</p>
        <p>You have lived approximately <strong>${tWeeks.toLocaleString()}</strong> weeks.</p>
        <p>You have been alive for <strong>${tDays.toLocaleString()}</strong> days in total.</p>
      `;
    }
  }

  btn.addEventListener('click', run);
  dobInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  if (calcDateInput) {
    calcDateInput.addEventListener('keydown', function (e) { if (e.key === 'Enter' && dobInput.value) run(); });
  }
}

/* ============================================================
   TOOL 2: Date Difference Calculator  (date-difference.html)
   Elements: #date1, #date2, #calc-btn, #result
   ============================================================ */
function initDateDifference() {
  const date1Input = document.getElementById('date1');
  const date2Input = document.getElementById('date2');
  const btn        = document.getElementById('calc-btn');
  const resultBox  = document.getElementById('result');

  if (!date1Input || !date2Input || !btn || !resultBox) return;

  // Default date2 to today
  date2Input.value = today().toISOString().split('T')[0];

  function run() {
    clearFieldError(date1Input);
    clearFieldError(date2Input);

    const d1Str = date1Input.value;
    const d2Str = date2Input.value;

    if (!d1Str) { showFieldError(date1Input, 'Please enter the first date.'); return; }
    if (!d2Str) { showFieldError(date2Input, 'Please enter the second date.'); return; }

    const d1 = parseLocalDate(d1Str);
    const d2 = parseLocalDate(d2Str);

    if (!d1) { showFieldError(date1Input, 'That date is not valid.'); return; }
    if (!d2) { showFieldError(date2Input, 'That date is not valid.'); return; }

    // Always compute from earlier to later
    const from  = d1 <= d2 ? d1 : d2;
    const to    = d1 <= d2 ? d2 : d1;
    const label = d1 <= d2 ? 'First date → Second date' : 'Second date → First date';

    const totalDaysVal  = daysBetween(from, to);
    const totalWeeks    = Math.floor(totalDaysVal / 7);
    const remainDays    = totalDaysVal % 7;
    const age           = calculateAge(from, to);

    if (totalDaysVal === 0) {
      showResult(resultBox, `
        <div class="result-age">The two dates are the same</div>
        <div class="result-details">
          <p><span>Difference</span><span class="result-val">0 days</span></p>
        </div>
      `);
      return;
    }

    showResult(resultBox, `
      <div class="result-age">${totalDaysVal.toLocaleString()} Day${totalDaysVal !== 1 ? 's' : ''}</div>
      <div class="result-details">
        <p><span>In years, months, days</span><span class="result-val">${age.years}y ${age.months}m ${age.days}d</span></p>
        <p><span>Total weeks + days</span><span class="result-val">${totalWeeks.toLocaleString()} weeks, ${remainDays} day${remainDays !== 1 ? 's' : ''}</span></p>
        <p><span>Direction</span><span class="result-val">${label}</span></p>
      </div>
    `);
  }

  btn.addEventListener('click', run);
  date1Input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  date2Input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
}

/* ============================================================
   TOOL 3: Age Difference Calculator  (age-difference.html)
   Elements: #dob1, #dob2, #calc-btn, #result
   ============================================================ */
function initAgeDifference() {
  const dob1Input = document.getElementById('dob1');
  const dob2Input = document.getElementById('dob2');
  const btn       = document.getElementById('calc-btn');
  const resultBox = document.getElementById('result');

  if (!dob1Input || !dob2Input || !btn || !resultBox) return;

  const todayStr = today().toISOString().split('T')[0];
  dob1Input.max = todayStr;
  dob1Input.min = '1900-01-01';
  dob2Input.max = todayStr;
  dob2Input.min = '1900-01-01';

  function run() {
    clearFieldError(dob1Input);
    clearFieldError(dob2Input);

    const d1Str = dob1Input.value;
    const d2Str = dob2Input.value;

    if (!d1Str) { showFieldError(dob1Input, 'Please enter the first date of birth.'); return; }
    if (!d2Str) { showFieldError(dob2Input, 'Please enter the second date of birth.'); return; }

    const dob1 = parseLocalDate(d1Str);
    const dob2 = parseLocalDate(d2Str);
    const ref  = today();

    if (!dob1) { showFieldError(dob1Input, 'That date is not valid.'); return; }
    if (!dob2) { showFieldError(dob2Input, 'That date is not valid.'); return; }
    if (dob1 > ref) { showFieldError(dob1Input, 'Date of birth cannot be in the future.'); return; }
    if (dob2 > ref) { showFieldError(dob2Input, 'Date of birth cannot be in the future.'); return; }

    const age1 = calculateAge(dob1, ref);
    const age2 = calculateAge(dob2, ref);

    // Difference: always older minus younger
    const older  = dob1 <= dob2 ? dob1 : dob2;
    const younger = dob1 <= dob2 ? dob2 : dob1;
    const olderLabel   = dob1 <= dob2 ? 'Person 1' : 'Person 2';
    const youngerLabel = dob1 <= dob2 ? 'Person 2' : 'Person 1';

    const diff     = calculateAge(older, younger); // age of younger relative to older's DOB baseline
    const diffDays = daysBetween(older, younger);

    showResult(resultBox, `
      <div class="result-age">Age gap: ${diff.years} Year${diff.years !== 1 ? 's' : ''}, ${diff.months} Month${diff.months !== 1 ? 's' : ''}, ${diff.days} Day${diff.days !== 1 ? 's' : ''}</div>
      <div class="result-details">
        <p><span>Person 1 age</span><span class="result-val">${age1.years}y ${age1.months}m ${age1.days}d</span></p>
        <p><span>Person 2 age</span><span class="result-val">${age2.years}y ${age2.months}m ${age2.days}d</span></p>
        <p><span>Older person</span><span class="result-val">${olderLabel}</span></p>
        <p><span>Difference in days</span><span class="result-val">${diffDays.toLocaleString()}</span></p>
      </div>
    `);
  }

  btn.addEventListener('click', run);
  dob1Input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  dob2Input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
}

/* ============================================================
   TOOL 4: Birthday Countdown  (birthday-countdown.html)
   Elements: #dob, #calc-btn, #result
   ============================================================ */
function initBirthdayCountdown() {
  const dobInput  = document.getElementById('dob');
  const btn       = document.getElementById('calc-btn');
  const resultBox = document.getElementById('result');

  if (!dobInput || !btn || !resultBox) return; // not on this page
  // Only activate on the birthday-countdown page (identified by data-tool attribute)
  const card = dobInput.closest('.calculator-card');
  if (!card || card.dataset.tool !== 'birthday-countdown') return;

  const todayStr = today().toISOString().split('T')[0];
  dobInput.max = todayStr;
  dobInput.min = '1900-01-01';

  function run() {
    clearFieldError(dobInput);
    const dobStr = dobInput.value;
    if (!dobStr) { showFieldError(dobInput, 'Please enter your date of birth.'); return; }

    const birthDate = parseLocalDate(dobStr);
    if (!birthDate) { showFieldError(dobInput, 'That date is not valid.'); return; }

    const ref = today();
    if (birthDate > ref) { showFieldError(dobInput, 'Date of birth cannot be in the future.'); return; }

    const nbd = daysUntilNextBirthday(birthDate, ref);
    const isToday = nbd === 0;

    // Next birthday calendar date
    let nextBdDate = new Date(ref.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBdDate < ref) nextBdDate = new Date(ref.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());

    const nextBdStr = nextBdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const nextAge   = nextBdDate.getFullYear() - birthDate.getFullYear();
    const dow       = dayOfWeekName(nextBdDate);

    let html = '';
    if (isToday) {
      html = `
        <div class="birthday-today">🎂 Your birthday is TODAY! Happy Birthday!</div>
        <div class="result-age">0 days to go!</div>
        <div class="result-details">
          <p><span>Your birthday</span><span class="result-val">${nextBdStr}</span></p>
          <p><span>Turning</span><span class="result-val">${nextAge} years old</span></p>
          <p><span>Day of week</span><span class="result-val">${dow}</span></p>
        </div>
      `;
    } else {
      html = `
        <div class="result-age">${nbd.toLocaleString()} Day${nbd !== 1 ? 's' : ''} until your Birthday!</div>
        <div class="result-details">
          <p><span>Next birthday</span><span class="result-val">${nextBdStr}</span></p>
          <p><span>Day of week</span><span class="result-val">${dow}</span></p>
          <p><span>Turning</span><span class="result-val">${nextAge} years old</span></p>
        </div>
      `;
    }

    showResult(resultBox, html);
  }

  btn.addEventListener('click', run);
  dobInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      if (!answer) return;

      const isOpen = answer.classList.contains('open');

      // Close all open answers first (accordion behavior)
      document.querySelectorAll('.faq-answer.open').forEach(function (openAnswer) {
        openAnswer.classList.remove('open');
        if (openAnswer.previousElementSibling) {
          openAnswer.previousElementSibling.classList.remove('open');
        }
      });

      // Toggle the clicked one
      if (!isOpen) {
        answer.classList.add('open');
        this.classList.add('open');
      }
    });
  });
}

/* ============================================================
   BOOTSTRAP — Run all relevant initializers on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Each init function checks whether its required DOM elements exist
  // before binding, so all four can safely run on every page.
  initAgeCalculator();
  initDateDifference();
  initAgeDifference();
  initBirthdayCountdown();
  initFAQ();
});

// Scroll reveal observer
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Header scroll shadow
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
});
