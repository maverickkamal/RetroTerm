(function() {
  checkRetroEnabled('github', ['shared/retro-base.css', 'content/github/github.css'], function() {
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
      el.style.opacity = '0.4';
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

    function ensureCSSLinks() {
      var needed = ['shared/retro-base.css', 'content/github/github.css'];
      for (var i = 0; i < needed.length; i++) {
        var url = chrome.runtime.getURL(needed[i]);
        if (!document.querySelector('link[href="' + url + '"]')) {
          injectCSS(needed[i]);
        }
      }
    }

    function patchImages() {
      var imgs = document.querySelectorAll('img:not([data-rt-filtered]), video:not([data-rt-filtered])');
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.setProperty('filter', 'sepia(1) hue-rotate(5deg) saturate(3) brightness(0.7)', 'important');
        imgs[i].setAttribute('data-rt-filtered', '1');
      }
    }

    function patchPage() {
      injectScanlines();
      injectTitleCursor();
      ensureCSSLinks();
      patchImages();
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
    document.addEventListener('turbo:before-render', function(e) {
      if (e.detail && e.detail.newBody) {
        var el = document.createElement('div');
        el.className = 'rt-scanlines';
        e.detail.newBody.appendChild(el);
      }
    });

    window.addEventListener('popstate', function() {
      setTimeout(patchPage, 100);
    });

    var observer = new MutationObserver(function(mutations) {
      var needsPatch = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          needsPatch = true;
          break;
        }
      }
      if (needsPatch) {
        injectScanlines();
        injectTitleCursor();
        patchImages();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
      observer.disconnect();
    }, 30000);
  });
})();
