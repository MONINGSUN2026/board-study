// board-study UI — 공통 인터랙션 (D-09 최소 JS, D-10 직접 구현)

// ------------------------------------------------------------
// Toast (일시 알림)
// ------------------------------------------------------------
function showToast(message, type) {
  const toastType = type || 'info';

  let container = document.querySelector('[data-toast-container]');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('data-toast-container', '');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast--' + toastType;
  toast.setAttribute('role', toastType === 'error' ? 'alert' : 'status');

  const msg = document.createElement('span');
  msg.className = 'toast__message';
  msg.textContent = message;
  toast.appendChild(msg);

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ------------------------------------------------------------
// Modal 열기/닫기
// ------------------------------------------------------------
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.hidden = false;
}

function closeModal(modal) {
  if (modal) modal.hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
  // 모바일 내비게이션 토글
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // 모달 열기
  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-open')));
  });

  // 모달 닫기 (닫기/취소 버튼)
  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });

  // 모달 닫기 (오버레이 클릭)
  document.querySelectorAll('.modal__overlay').forEach((overlay) => {
    overlay.addEventListener('click', () => closeModal(overlay.closest('.modal')));
  });

  // Toast 데모 트리거 (components.html)
  document.querySelectorAll('[data-toast]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(
        btn.getAttribute('data-toast-message') || '완료되었습니다.',
        btn.getAttribute('data-toast') || 'info',
      );
    });
  });

  // 탭 전환 (data-tab / data-tab-panel)
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('[data-tab]');
    const panels = tabs.querySelectorAll('[data-tab-panel]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const target = btn.getAttribute('data-tab');
        panels.forEach((panel) => {
          panel.hidden = panel.getAttribute('data-tab-panel') !== target;
        });
      });
    });
  });
});

// Esc 키로 열린 모달 닫기
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal:not([hidden])').forEach((modal) => closeModal(modal));
  }
});