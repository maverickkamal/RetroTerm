(function() {
  checkRetroEnabled('carnival', ['shared/retro-base.css', 'content/carnival/carnival.css'], function() {
    var carnivalLines = [
      'RETRO TERMINAL OS v2.6 [AMBER BUILD]',
      'INITIALIZING CARNIVAL BOUNTY SYSTEM...',
      'LOADING ACTIVE MISSIONS...',
      'SCANNING PRIZE REGISTRY...',
      'BOUNTY BOARD ONLINE.',
      'CLAIM YOUR TARGET.'
    ];

    runBootScreen('carnival', carnivalLines);

    function injectScanlines() {
      if (document.querySelector('.rt-scanlines')) return;
      var el = document.createElement('div');
      el.className = 'rt-scanlines';
      el.style.opacity = String(window.__rtScanline || 0.1);
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

    function markCompleted() {
      var badges = document.querySelectorAll('[class*="completed"], [class*="Completed"], [class*="closed"], [class*="Closed"], [class*="claimed"], [class*="Claimed"]');
      for (var i = 0; i < badges.length; i++) {
        if (!badges[i].classList.contains('rt-closed')) {
          badges[i].classList.add('rt-closed');
          badges[i].textContent = '[CLOSED]';
        }
      }
    }

    function relabelSlots() {
      var all = document.querySelectorAll('span, p, div');
      for (var i = 0; i < all.length; i++) {
        var text = all[i].textContent;
        if (/Claims:\s*\d+\/\d+/.test(text) && !all[i].dataset.rtPatched) {
          all[i].textContent = text.replace(/Claims:\s*/, 'SLOTS: ');
          all[i].dataset.rtPatched = '1';
        }
      }
    }

    function glowHeroText() {
      var headings = document.querySelectorAll('h1, h2, h3, p, span');
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].textContent.indexOf('Make projects') !== -1 && !headings[i].classList.contains('rt-hero-glow')) {
          headings[i].classList.add('rt-hero-glow');
        }
        if (headings[i].textContent.indexOf('earn rewards') !== -1 && !headings[i].classList.contains('rt-hero-glow')) {
          headings[i].classList.add('rt-hero-glow');
        }
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
    markCompleted();
    relabelSlots();
    glowHeroText();

    setTimeout(function() {
      markCompleted();
      relabelSlots();
      glowHeroText();
    }, 1500);

    var observer = new MutationObserver(function() {
      markCompleted();
      relabelSlots();
      glowHeroText();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
      observer.disconnect();
    }, 15000);
  });
})();
