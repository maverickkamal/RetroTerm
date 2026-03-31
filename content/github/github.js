(function() {
  var githubLines = [
    'RETRO TERMINAL OS v2.6 [AMBER BUILD]',
    'INITIALIZING GITHUB INTERFACE...',
    'LOADING REPOSITORY INDEX...',
    'MOUNTING CODE FILESYSTEM...',
    'ESTABLISHING SSH TUNNEL...',
    'ALL SYSTEMS NOMINAL. WELCOME, OPERATOR.'
  ];

  runBootScreen('github', githubLines);

  function injectScanlines() {
    if (document.querySelector('.rt-scanlines')) return;
    var el = document.createElement('div');
    el.className = 'rt-scanlines';
    document.body.appendChild(el);
  }

  function injectTitleCursor() {
    var h1 = document.querySelector('h1');
    if (!h1) return;
    if (h1.querySelector('.rt-title-cursor')) return;
    var span = document.createElement('span');
    span.className = 'rt-cursor rt-title-cursor';
    span.textContent = '\u25AE ';
    h1.insertBefore(span, h1.firstChild);
  }

  function patchPage() {
    injectScanlines();
    injectTitleCursor();
  }

  document.addEventListener('focusin', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.classList.add('rt-cursor');
    }
  });

  document.addEventListener('focusout', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.classList.remove('rt-cursor');
    }
  });

  patchPage();

  document.addEventListener('turbo:load', patchPage);
  document.addEventListener('turbo:render', patchPage);
})();
