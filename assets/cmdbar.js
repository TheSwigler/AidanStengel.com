/* aidanstengel.com — the formula bar is a working command bar.
   Click it (or press "=" anywhere) and type a formula like =RESUME() or =HELP(). */
(function () {
  var bar = document.querySelector('.formula, .sheetbar');
  if (!bar) return;
  var expr = bar.querySelector('.expr');
  if (!expr) return;

  var CMDS = [
    { f: '=HOME()', d: 'Home page', go: '/' },
    { f: '=RESUME()', d: 'Resume and portfolio', go: '/resume/' },
    { f: '=PDF()', d: 'Download my resume as a PDF', go: '/resume.pdf' },
    { f: '=CASESTUDY("service desk")', d: 'Building an IT service desk three times', go: '/work/service-desk/' },
    { f: '=CASESTUDY("lawyer referral")', d: 'Replacing a statewide lawyer referral system', go: '/work/lawyer-referral/' },
    { f: '=GARAGE()', d: 'Corvette build log', go: '/garage/' },
    { f: '=DYNO()', d: 'The engine dyno chart', go: '/garage/corvette/#dyno' },
    { f: '=LINKEDIN()', d: 'Message me on LinkedIn', go: 'https://www.linkedin.com/in/aidan-stengel-221ab1225/', ext: true },
    { f: '=HELP()', d: 'List every formula', help: true }
  ];
  // extra spellings that also work, but aren't listed
  var ALIASES = {
    'ABOUT': '/#about-h', 'WORK': '/#work-h', 'CONTACT': '/#contact-h', 'CORVETTE': '/garage/corvette/',
    'VETTE': '/garage/corvette/', 'CV': '/resume/', 'PORTFOLIO': '/resume/'
  };

  var saved = null, input, list, msg, active = -1, items = [], open = false;
  window.__cmdBarActive = false;

  // hint on the right side of the bar
  var hint = document.createElement('span');
  hint.className = 'cmd-hint';
  hint.textContent = 'Click to type a formula';
  bar.appendChild(hint);
  bar.classList.add('cmd-ready');
  bar.removeAttribute('aria-hidden');
  bar.setAttribute('role', 'search');

  function norm(s) { return s.trim().replace(/^=/, '').replace(/\s+/g, ' ').toUpperCase(); }
  function parse(raw) {
    var s = norm(raw);
    var m = s.match(/^([A-Z.]+)\s*\((.*)\)$/) || s.match(/^([A-Z.]+)$/);
    if (!m) return null;
    return { fn: m[1], arg: (m[2] || '').replace(/^["']|["']$/g, '').trim().toLowerCase() };
  }
  function resolve(raw) {
    var s = raw.trim();
    // a little arithmetic, like a real cell
    var math = s.replace(/^=/, '');
    if (/^[\d\s.+\-*/()%]+$/.test(math) && /\d/.test(math)) {
      try { var v = Function('"use strict";return (' + math + ')')(); if (isFinite(v)) return { value: String(Math.round(v * 1e6) / 1e6) }; } catch (e) {}
      return { error: '#VALUE!' };
    }
    var p = parse(s);
    if (!p) return { error: '#NAME?' };
    if (p.fn === 'HELP') return { help: true };
    if (p.fn === 'CASESTUDY' || p.fn === 'CASE') {
      if (/desk|ticket|service/.test(p.arg)) return { go: '/work/service-desk/' };
      if (/lawyer|referral|lrs|vlrs/.test(p.arg)) return { go: '/work/lawyer-referral/' };
      return { suggest: 'CASESTUDY' };
    }
    if (p.fn === 'BUILD') {
      if (/engine|car|corvette|vette|396/.test(p.arg)) return { go: '/garage/corvette/' };
      if (/app/.test(p.arg)) return { go: '/work/service-desk/' };
      return { suggest: 'BUILD' };
    }
    for (var i = 0; i < CMDS.length; i++) {
      if (parse(CMDS[i].f).fn === p.fn && !CMDS[i].help) return CMDS[i].ext ? { ext: CMDS[i].go } : { go: CMDS[i].go };
    }
    if (ALIASES[p.fn]) return { go: ALIASES[p.fn] };
    return { error: '#NAME?' };
  }

  function render(filter) {
    var q = norm(filter || '');
    items = CMDS.filter(function (c) { return !q || norm(c.f).indexOf(q.replace(/\(.*$/, '')) === 0 || norm(c.f).indexOf(q) >= 0; });
    if (!items.length) items = CMDS;
    list.innerHTML = '';
    items.forEach(function (c, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option'); li.id = 'cmd-opt-' + i; li.style.setProperty('--i', i);
      li.innerHTML = '<code></code><span></span>';
      li.firstChild.textContent = c.f; li.lastChild.textContent = c.d;
      li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(c); });
      list.appendChild(li);
    });
    setActive(-1);
  }
  function setActive(i) {
    active = i;
    [].forEach.call(list.children, function (li, j) { li.classList.toggle('on', j === i); });
    if (i >= 0) input.setAttribute('aria-activedescendant', 'cmd-opt-' + i); else input.removeAttribute('aria-activedescendant');
  }
  function say(text, kind) { msg.textContent = text; msg.className = 'cmd-msg'; void msg.offsetWidth; msg.className = 'cmd-msg ' + (kind || ''); }
  function pick(c) { if (c.help) { input.value = '='; render(''); input.focus(); return; } input.value = c.f; run(); }
  function run() {
    var r = resolve(input.value);
    if (r.go) { say('Going…', 'ok'); location.href = r.go; return; }
    if (r.ext) { window.open(r.ext, '_blank', 'noopener'); close(); return; }
    if (r.value !== undefined) { say(r.value, 'ok'); return; }
    if (r.help) { render(''); say('Here is every formula. Pick one or keep typing.', ''); return; }
    if (r.suggest) { input.value = '=' + r.suggest + '("'; render(r.suggest); say('Try one of these.', ''); return; }
    say(r.error + '  That formula doesn’t exist here. Try =HELP()', 'err');
    render('');
  }

  function openBar() {
    if (open) return;
    open = true; window.__cmdBarActive = true;
    saved = expr.innerHTML;
    expr.innerHTML = '';
    input = document.createElement('input');
    input.className = 'cmd-input'; input.type = 'text'; input.value = '=';
    input.setAttribute('aria-label', 'Formula bar: type a command like =RESUME() or =HELP()');
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'true'); input.setAttribute('aria-controls', 'cmd-list');
    input.setAttribute('autocomplete', 'off'); input.setAttribute('spellcheck', 'false');
    expr.appendChild(input);
    list = document.createElement('ul'); list.className = 'cmd-list'; list.id = 'cmd-list'; list.setAttribute('role', 'listbox');
    msg = document.createElement('div'); msg.className = 'cmd-msg'; msg.setAttribute('role', 'status');
    var pop = document.createElement('div'); pop.className = 'cmd-pop';
    pop.appendChild(list); pop.appendChild(msg);
    bar.appendChild(pop);
    bar.classList.add('cmd-open');
    render('');
    input.focus(); input.setSelectionRange(1, 1);
    input.addEventListener('input', function () { say(''); render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(-1, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) pick(items[active]); else run(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
  }
  function close() {
    if (!open) return;
    open = false; window.__cmdBarActive = false;
    var pop = bar.querySelector('.cmd-pop');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pop) { if (reduce) pop.remove(); else { pop.classList.add('closing'); setTimeout(function () { pop.remove(); }, 140); } }
    bar.classList.remove('cmd-open');
    expr.innerHTML = saved;
  }

  bar.addEventListener('click', function (e) { if (!open && !e.target.closest('.cmd-pop')) openBar(); });
  bar.tabIndex = 0;
  bar.addEventListener('keydown', function (e) { if (!open && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openBar(); } });
  document.addEventListener('keydown', function (e) {
    if (open || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === '=') { e.preventDefault(); openBar(); }
  });
})();
