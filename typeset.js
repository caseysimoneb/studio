// typeset.js — typographer's quotes on any page the studio makes.
// Straight ' and " in visible text become ‘ ’ “ ” (and the apostrophe ’), including text that
// scripts add later. Code, pre, inputs, text areas, editable text, scripts, and styles are left alone.
// Include it in a page with <script src=".../typeset.js"></script>, or inline its text.
(function () {
  var SKIP = /^(SCRIPT|STYLE|CODE|PRE|KBD|SAMP|TEXTAREA|INPUT|SELECT|OPTION|NOSCRIPT)$/;
  var opens = function (p) { return !p || /[\s([{<—–\-\/“‘]/.test(p); };
  function skip(node) {
    for (var n = node.parentNode; n && n.nodeType === 1; n = n.parentNode) {
      if (SKIP.test(n.nodeName) || n.isContentEditable || (n.classList && n.classList.contains('no-typeset'))) return true;
    }
    return false;
  }
  function curl(text, prev) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var c = text[i], p = i ? text[i - 1] : prev;
      if (c === "'") out += opens(p) ? '‘' : '’';
      else if (c === '"') out += opens(p) ? '“' : '”';
      else out += c;
    }
    return out;
  }
  function run(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, prev = '';
    while ((n = w.nextNode())) {
      var t = n.nodeValue;
      if (t && /['"]/.test(t) && !skip(n)) { var c = curl(t, prev); if (c !== t) n.nodeValue = c; }
      if (t) prev = t[t.length - 1];
    }
  }
  function start() {
    run(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') { if (/['"]/.test(m.target.nodeValue) && !skip(m.target)) m.target.nodeValue = curl(m.target.nodeValue, ''); }
        else m.addedNodes.forEach(function (a) { if (a.nodeType === 3) { if (!skip(a) && /['"]/.test(a.nodeValue)) a.nodeValue = curl(a.nodeValue, ''); } else run(a); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
