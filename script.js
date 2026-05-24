/* ============================
   SCROLL REVEAL
   ============================ */
(function () {
    var els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    function check() {
        var wh = window.innerHeight;
        els.forEach(function (el) {
            var top = el.getBoundingClientRect().top;
            if (top < wh - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check(); // initial pass on load
})();

/* ============================
   NAVBAR SCROLL STATE
   ============================ */
(function () {
    var nav = document.getElementById('navbar');
    function onScroll() {
        if (window.pageYOffset > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ============================
   BURGER / MOBILE MENU
   ============================ */
(function () {
    var burger = document.getElementById('burger');
    var links  = document.getElementById('navLinks');
    if (!burger || !links) return;

    burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    links.querySelectorAll('.nav-link').forEach(function (a) {
        a.addEventListener('click', function () {
            links.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();

/* ============================
   IMAGE MODAL
   ============================ */
(function () {
    var modal      = document.getElementById('imageModal');
    var expandedImg = document.getElementById('expandedImg');
    var closeBtn   = document.getElementById('modalClose');
    var galleryImgs = document.querySelectorAll('.gallery-img');

    if (!modal) return;

    function openModal(src, alt) {
        expandedImg.src = src;
        expandedImg.alt = alt || '';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modal.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    galleryImgs.forEach(function (img) {
        img.addEventListener('click', function () {
            openModal(this.src, this.alt);
        });
        // Keyboard accessibility
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(this.src, this.alt);
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
})();

/* ============================
   ACTIVE NAV LINK (SCROLLSPY)
   ============================ */
(function () {
    var sections = document.querySelectorAll('section[id], header[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        var scrollY = window.pageYOffset + 100;
        var current = '';
        sections.forEach(function (sec) {
            if (sec.offsetTop <= scrollY) {
                current = sec.id;
            }
        });
        navLinks.forEach(function (a) {
            a.classList.remove('active-link');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================
   EMAILJS CONTACT FORM
   ============================
   KURULUM:
   1. https://www.emailjs.com adresine git, ücretsiz hesap oluştur
   2. "Email Services" → "Add New Service" → Gmail'i seç ve bağla
   3. "Email Templates" → "Create New Template" oluştur:
      - To Email: alplersurmeneli@gmail.com
      - Subject: {{subject}}
      - Body:
          Gönderen: {{from_name}} ({{reply_to}})
          Mesaj:
          {{message}}
   4. "Account" → "API Keys" bölümünden PUBLIC KEY'i kopyala
   5. Aşağıdaki 3 değeri kendi bilgilerinle güncelle:
*/

var EMAILJS_PUBLIC_KEY  = 'L6tfi0HY7T-hONsN_';
var EMAILJS_SERVICE_ID  = 'service_rvsra1v';
var EMAILJS_TEMPLATE_ID = 'template_1n1wvr2';

(function () {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS yüklenemedi.');
        return;
    }

    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    var form      = document.getElementById('contactForm');
    var btn       = document.getElementById('formSubmitBtn');
    var btnText   = btn.querySelector('.btn-text');
    var successEl = document.getElementById('formSuccess');
    var errorEl   = document.getElementById('formError');

    function setStatus(state) {
        successEl.hidden = true;
        errorEl.hidden   = true;
        btn.disabled     = false;
        btn.classList.remove('sending');
        btnText.textContent = 'Mesaj Gönder';

        if (state === 'sending') {
            btn.disabled = true;
            btn.classList.add('sending');
            btnText.textContent = 'Gönderiliyor';
        } else if (state === 'success') {
            successEl.hidden = false;
            form.reset();
        } else if (state === 'error') {
            errorEl.hidden = false;
        }
    }

    function validate() {
        var valid = true;
        form.querySelectorAll('[required]').forEach(function (el) {
            el.classList.remove('invalid');
            var val = el.value.trim();
            if (!val) { el.classList.add('invalid'); valid = false; }
            if (el.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                el.classList.add('invalid'); valid = false;
            }
        });
        return valid;
    }

    form.querySelectorAll('[required]').forEach(function (el) {
        el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;

        setStatus('sending');

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
            .then(function () {
                setStatus('success');
            })
            .catch(function (err) {
                console.error('EmailJS hatası:', err);
                setStatus('error');
            });
    });
})();