(function () {
    'use strict';

    /* --- Theme Toggle --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const moonPath = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
    const sunPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";

    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        if (themeIcon) {
            themeIcon.innerHTML = isDark
                ? '<path d="' + sunPath + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
                : '<path d="' + moonPath + '"/>';
        }
    }

    // Apply saved theme
    applyTheme(localStorage.getItem('theme') === 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            var isDark = document.body.classList.contains('dark-mode');
            applyTheme(!isDark);
            localStorage.setItem('theme', !isDark ? 'dark' : 'light');
        });
    }

    /* --- Sidebar Toggle --- */
    var sidebar = document.getElementById('sidebar');
    var hamburger = document.getElementById('hamburger');
    var overlay = document.getElementById('sidebar-overlay');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function () {
            if (isMobile()) {
                sidebar.classList.toggle('open-mobile');
                if (overlay) overlay.classList.toggle('visible');
            } else {
                sidebar.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-collapsed');
                // Re-trigger adjustScale if it exists
                if (typeof window.adjustScale === 'function') {
                    setTimeout(window.adjustScale, 400);
                }
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function () {
            if (sidebar) sidebar.classList.remove('open-mobile');
            overlay.classList.remove('visible');
        });
    }

    // Handle resize
    window.addEventListener('resize', function () {
        if (!isMobile() && sidebar) {
            sidebar.classList.remove('open-mobile');
            if (overlay) overlay.classList.remove('visible');
        }
    });

    /* --- Active Nav Highlighting --- */
    var navLinks = document.querySelectorAll('.sidebar-nav a');
    var currentPath = window.location.pathname;

    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;

        // Resolve relative href to absolute for comparison
        var a = document.createElement('a');
        a.href = href;
        var linkPath = a.pathname;

        // Normalize paths
        var normCurrent = currentPath.replace(/\\/g, '/').toLowerCase();
        var normLink = linkPath.replace(/\\/g, '/').toLowerCase();

        if (normCurrent === normLink || normCurrent.endsWith(normLink)) {
            link.classList.add('active');
        }
    });

    /* --- Tab Switching --- */
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tabId = this.getAttribute('data-tab');

            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabContents.forEach(function (c) { c.classList.remove('active'); });

            this.classList.add('active');
            var target = document.getElementById('tab-' + tabId);
            if (target) target.classList.add('active');

            // Re-trigger adjustScale when switching to simulation tab
            if (tabId === 'simulation' && typeof window.adjustScale === 'function') {
                setTimeout(window.adjustScale, 50);
            }
        });
    });

    /* --- Pretest Answer Toggles --- */
    document.querySelectorAll('.answer-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var reveal = this.nextElementSibling;
            if (reveal && reveal.classList.contains('answer-reveal')) {
                reveal.classList.toggle('visible');
                this.classList.toggle('open');
            }
        });
    });

})();
