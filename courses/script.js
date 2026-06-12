/**
 * 广东科学技术职业学院商学院
 * Python基础课程 - 站点交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  // 模块折叠/展开
  const moduleHeaders = document.querySelectorAll('.module-header');
  moduleHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const card = this.closest('.module-card');
      card.classList.toggle('collapsed');
    });
  });

  // 答案显示/隐藏切换
  const toggleBtns = document.querySelectorAll('.btn-toggle-ans');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const box = this.parentElement.querySelector('.answer-box');
      if (!box) return;
      const isHidden = box.classList.contains('collapsed');
      if (isHidden) {
        box.classList.remove('collapsed');
        this.textContent = '隐藏答案解析';
      } else {
        box.classList.add('collapsed');
        this.textContent = '显示答案解析';
      }
    });
  });

  // 回到顶部按钮
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 锚点平滑滚动（处理固定导航遮挡问题）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // 打印友好：自动展开所有折叠区域
  window.addEventListener('beforeprint', function() {
    document.querySelectorAll('.module-card.collapsed').forEach(card => {
      card.classList.remove('collapsed');
      card.dataset.wasCollapsed = 'true';
    });
    document.querySelectorAll('.answer-box.collapsed').forEach(box => {
      box.classList.remove('collapsed');
      box.dataset.wasCollapsed = 'true';
    });
  });
  window.addEventListener('afterprint', function() {
    document.querySelectorAll('[data-was-collapsed="true"]').forEach(el => {
      el.classList.add('collapsed');
      el.removeAttribute('data-was-collapsed');
    });
  });
});
