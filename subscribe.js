// subscribe.js — a way onto Caseysimone's Substack from every studio page. Chosen 2026-11-06 from
// studies/2026-11-06-visitors/round-3: card 2, just the button.
// It adds a green Subscribe at the end of the header (after Co-Design Lab; on phones the plain
// "Substack" link steps aside to make room), and a green "Subscribe on Substack" button in the
// bottom-right corner that a visitor can close with ×. Closing is remembered on their own device
// (localStorage); nothing else is stored, and nothing from Substack loads here: both open her
// Substack's subscribe page in a new tab.
(function () {
  var SUB = 'https://www.caseysimone.com/subscribe?utm_source=studio';
  var KEY = 'studio-subscribe-closed';
  var GREEN = '#AFF26A', ON_GREEN = '#363737';
  var SANS = '-apple-system,"Segoe UI",Helvetica,Arial,sans-serif';

  function closed() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var css = document.createElement('style');
  css.textContent = [
    '.ss-btn{display:inline-block;background:' + GREEN + ';color:' + ON_GREEN + '!important;font:600 13px/1 ' + SANS + ';padding:7px 12px;border-radius:8px;text-decoration:none!important;border:0;cursor:pointer}',
    '.ss-btn:hover{background:#a2f053}',
    // The header button sets its word in the header's own face, size and line height, so it sits exactly
    // where About · Substack · Co-Design Lab sit; the green padding is cancelled by equal negative margins,
    // so it spreads evenly above and below and moves nothing. (Round 1 used the system font here, and its
    // different proportions put the word 3 px off in Chrome on a Mac.)
    '.ss-nav{font:inherit;font-weight:600;line-height:inherit;padding:6px 11px;margin:-6px 0 -6px 14px;vertical-align:baseline}',
    'header nav.elsewhere .ss-nav{margin-left:0}',
    '.sitebar .ss-nav{padding:3px 8px;margin-top:-3px;margin-bottom:-3px}',
    '.ss-pill{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:2px;background:' + GREEN + ';border-radius:999px;box-shadow:0 4px 18px rgba(0,0,0,.16);padding:4px;opacity:0;transform:translateY(12px);transition:opacity .4s,transform .4s}',
    '.ss-pill.on{opacity:1;transform:none}',
    '.ss-pill .ss-btn{padding:9px 6px 9px 14px;font-size:14px;background:none}',
    '.ss-x{background:none;border:0;color:' + ON_GREEN + ';font-size:18px;line-height:1;cursor:pointer;padding:4px 10px 4px 4px}',
    '@media (max-width:600px){.ss-pill{right:12px;bottom:12px}.ss-nav{padding:5px 8px;margin-top:-5px;margin-bottom:-5px}.sitebar .ss-nav{padding:3px 7px;margin:-3px 0 -3px 10px}.ss-narrow{display:none!important}.sitebar nav{white-space:nowrap;flex:none}.sitebar .crumbs{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto}}'
  ].join('\n');
  document.head.appendChild(css);

  function link(a) { a.href = SUB; a.target = '_blank'; a.rel = 'noopener'; return a; }

  function start() {
    // The header: studio pages use <header><nav class="elsewhere">; the field guide its .sitebar nav.
    var nav = document.querySelector('header nav, .sitebar nav');
    if (nav && !nav.querySelector('.ss-nav')) {
      var b = link(document.createElement('a'));
      b.className = 'ss-btn ss-nav'; b.textContent = 'Subscribe';
      nav.appendChild(b);
      [].forEach.call(nav.querySelectorAll('a'), function (a) { if (/^\s*Substack\s*$/.test(a.textContent)) a.classList.add('ss-narrow'); });
    }
    if (closed()) return;
    var c = document.createElement('aside');
    c.className = 'ss-pill';
    c.setAttribute('aria-label', 'Subscribe on Substack');
    c.innerHTML = '<a class="ss-btn">Subscribe on Substack</a><button class="ss-x" aria-label="Close">×</button>';
    link(c.querySelector('a'));
    c.querySelector('.ss-x').addEventListener('click', function () { remember(); c.classList.remove('on'); setTimeout(function () { c.remove(); }, 400); });
    document.body.appendChild(c);
    setTimeout(function () { c.classList.add('on'); }, 4000);
    // The field guide's first-visit walkthrough sits at the bottom too: step aside while it's open.
    setInterval(function () {
      var t = document.querySelector('.tour-card');
      c.style.visibility = t && t.getClientRects().length ? 'hidden' : '';
    }, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
