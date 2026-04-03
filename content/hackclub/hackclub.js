(function() {
  checkRetroEnabled('hackclub', ['shared/retro-base.css', 'content/hackclub/hackclub.css'], function() {
    var hackclubLines = [
      'RETRO TERMINAL OS v2.6 [AMBER BUILD]',
      'INITIALIZING HACK CLUB MAINFRAME...',
      'LOADING COMMUNITY PROTOCOLS...',
      'AUTHENTICATING HACKER CREDENTIALS...',
      'CLUB NETWORK ONLINE.',
      'WELCOME TO THE TERMINAL.'
    ];

    runBootScreen('hackclub', hackclubLines);

    function injectScanlines() {
      if (document.querySelector('.rt-scanlines')) return;
      var el = document.createElement('div');
      el.className = 'rt-scanlines';
      el.style.opacity = String(window.__rtScanline || 0.3);
      document.body.appendChild(el);

      if (!document.querySelector('.rt-vignette')) {
        var vig = document.createElement('div');
        vig.className = 'rt-vignette';
        vig.style.opacity = String(window.__rtVignette !== undefined ? window.__rtVignette : 0.7);
        document.body.appendChild(vig);
      }

      if (window.__rtFlicker !== false) {
        document.body.classList.add('rt-flicker');
      } else {
        document.body.classList.remove('rt-flicker');
      }
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

    injectScanlines();
  });
})();
