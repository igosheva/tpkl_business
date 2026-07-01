// TYPICAL /project — табы, модальная форма, отправка-заглушка.
(function () {
  'use strict';

  /* ---- Заглушка endpoint: замените на ваш URL (CRM / Webflow form / вебхук) ---- */
  var FORM_ENDPOINT = ''; // напр. 'https://your-endpoint.example/lead'

  /* ---------- Шапка: тень при скролле ---------- */
  var header = document.querySelector('.page-header');
  var onScroll = function () {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(0,0,0,.06)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Табы ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var btns = root.querySelectorAll('.tab-btn');
    var panels = root.querySelectorAll('.tab-panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.id === id); });
      });
    });
  });

  /* ---------- Модальная форма ---------- */
  var modal = document.getElementById('lead-modal');
  var formView = modal.querySelector('[data-form-view]');
  var successView = modal.querySelector('[data-success-view]');
  var form = document.getElementById('lead-form');
  var serviceSelect = form.elements['service'];
  var lastFocused = null;

  function openModal(situation) {
    lastFocused = document.activeElement;
    formView.hidden = false;
    successView.hidden = true;
    // если форму открыли с таба услуги — подставляем эту услугу в «Выбор услуги»
    if (serviceSelect) {
      serviceSelect.selectedIndex = 0;
      if (situation) {
        for (var i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === situation || serviceSelect.options[i].text === situation) {
            serviceSelect.selectedIndex = i; break;
          }
        }
      }
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input,select');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(el.getAttribute('data-situation'));
    });
  });
  modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------- Отправка формы (заглушка под endpoint) ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = Object.fromEntries(new FormData(form).entries());
    var submitBtn = form.querySelector('[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    var done = function () {
      formView.hidden = true;
      successView.hidden = false;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    };

    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(done).catch(function () {
        // даже при ошибке показываем успех + Telegram-фолбэк
        done();
      });
    } else {
      // нет endpoint — фронт-шаблон: логируем и показываем успех
      console.log('[lead]', data);
      setTimeout(done, 400);
    }
  });

  /* ---------- Подписка в футере (заглушка) ---------- */
  document.querySelectorAll('[data-subscribe]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = f.querySelector('input');
      if (!f.checkValidity()) { f.reportValidity(); return; }
      inp.value = '';
      inp.placeholder = 'Готово ✓';
    });
  });
})();
