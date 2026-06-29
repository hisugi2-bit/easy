document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Sidebar Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileSidebar) {
    menuToggle.addEventListener('click', () => {
      mobileSidebar.classList.toggle('open');
      menuToggle.classList.toggle('active');
      
      // If sidebar is open, change hamburger spans to match dark background
      const spans = menuToggle.querySelectorAll('span');
      if (mobileSidebar.classList.contains('open')) {
        spans.forEach(span => span.style.backgroundColor = '#ffffff');
      } else {
        // revert to default behavior depending on header class
        spans.forEach(span => {
          span.style.backgroundColor = '';
        });
      }
    });

    // Close mobile menu when a nav link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileSidebar.classList.remove('open');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.backgroundColor = '');
      });
    });
  }

  // 3. Scroll Reveal Animation & Stats Counter
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const statsSection = document.querySelector('.why-us-stats');
  let statsAnimated = false;

  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.innerText = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = target;
        }
      };
      
      if (target > 0) {
        updateCount();
      } else {
        stat.innerText = '0';
      }
    });
  };

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger stats animation when they enter the viewport
        if (entry.target === statsSection && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 4. Portfolio Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all filter buttons, add to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all') {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          if (item.classList.contains(filterValue)) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.classList.add('hidden');
            }, 300);
          }
        }
      });
    });
  });

  // 5. Quote Generator and SMS Template Builder
  const btnGenerateSms = document.getElementById('btn-generate-sms');
  const smsModal = document.getElementById('sms-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCopySms = document.getElementById('btn-copy-sms');
  const btnSendSms = document.getElementById('btn-send-sms');
  const smsTextContent = document.getElementById('sms-text-content');

  if (btnGenerateSms && smsModal) {
    btnGenerateSms.addEventListener('click', () => {
      // Form fields
      const clientName = document.getElementById('client_name').value.trim();
      const location = document.getElementById('location').value.trim();
      const memo = document.getElementById('memo').value.trim();
      
      // Building Type (Radio)
      const buildingTypeEl = document.querySelector('input[name="building_type"]:checked');
      const buildingType = buildingTypeEl ? buildingTypeEl.value : '';

      // Services (Checkbox)
      const selectedServiceEls = document.querySelectorAll('input[name="services"]:checked');
      const services = Array.from(selectedServiceEls).map(el => el.value);

      // Simple Validation
      if (!clientName) {
        alert('성함 및 연락처를 입력해 주세요.');
        document.getElementById('client_name').focus();
        return;
      }
      if (!location) {
        alert('현장 주소를 입력해 주세요.');
        document.getElementById('location').focus();
        return;
      }
      if (services.length === 0) {
        alert('필요한 서비스를 최소 1개 이상 선택해 주세요.');
        return;
      }

      // Build SMS Template
      let smsText = `[이지종합보수 견적문의]\n`;
      smsText += `■ 고객성함: ${clientName}\n`;
      smsText += `■ 건물유형: ${buildingType}\n`;
      smsText += `■ 요청서비스: ${services.join(', ')}\n`;
      smsText += `■ 현장주소: ${location}\n`;
      if (memo) {
        smsText += `■ 설명/기타: ${memo}\n`;
      }
      smsText += `\n※ 문자로 현장 사진을 함께 보내주시면 더 신속한 견적이 가능합니다.`;

      // Fill text area
      smsTextContent.textContent = smsText;

      // Setup Native SMS action
      // For cross-platform compatibility:
      // iOS: sms:010-4687-0482;&body=text
      // Android/Default: sms:010-4687-0482;?body=text
      const recipient = '010-4687-0482';
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const separator = isIOS ? '&' : '?';
      btnSendSms.href = `sms:${recipient}${separator}body=${encodeURIComponent(smsText)}`;

      // Show Modal
      smsModal.classList.add('open');
    });

    // Close Modal
    btnCloseModal.addEventListener('click', () => {
      smsModal.classList.remove('open');
    });

    // Close Modal when clicking outside the content
    window.addEventListener('click', (e) => {
      if (e.target === smsModal) {
        smsModal.classList.remove('open');
      }
    });

    // Copy to Clipboard
    btnCopySms.addEventListener('click', () => {
      const text = smsTextContent.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btnCopySms.innerText = '복사 완료!';
        btnCopySms.style.backgroundColor = '#10B981'; // Green
        btnCopySms.style.color = '#ffffff';
        
        setTimeout(() => {
          btnCopySms.innerText = '메시지 복사하기';
          btnCopySms.style.backgroundColor = '';
          btnCopySms.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('클립보드 복사 실패:', err);
        alert('복사에 실패했습니다. 텍스트 영역을 길게 눌러 직접 복사해 주세요.');
      });
    });
  }
});
