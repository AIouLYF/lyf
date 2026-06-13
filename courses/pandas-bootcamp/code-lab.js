/**
 * Code Lab - 代码练习交互逻辑
 *
 * 功能：
 *   runCode(id)       - 运行代码，显示预定义输出
 *   clearCode(id)     - 清空代码与输出
 *   toggleReference(id) - 切换参考答案显示/隐藏
 *
 * HTML 约定：
 *   每个 .code-lab 元素需设置唯一 id（如 lab-1, lab-2 ...）
 *   预定义输出 → data-output 属性（存储在 .code-lab 上）
 *   参考答案   → data-answer 属性（存储在 .code-lab 上）
 *
 * 内部结构约定：
 *   .code-lab-textarea        → textarea
 *   .code-lab-output-body     → 输出容器
 *   .code-lab-reference       → 参考答案容器
 *   .code-lab-btn--run        → 运行按钮
 *   .code-lab-btn--clear      → 清除按钮
 *   .code-lab-btn--ref        → 参考答案按钮
 *   .code-lab-line-numbers    → 行号容器
 */

/* ========== 工具函数 ========== */

/**
 * 根据练习 ID 获取根容器
 * @param {string} id - 练习 ID（如 'lab-1'）
 * @returns {HTMLElement|null}
 */
function getCodeLab(id) {
  return document.getElementById(id);
}

/**
 * 获取根容器下的子元素
 * @param {HTMLElement} lab
 * @param {string} selector
 * @returns {HTMLElement|null}
 */
function getLabChild(lab, selector) {
  return lab.querySelector(selector);
}

/**
 * 对输出文本进行简单的 HTML 转义
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

/* ========== 行号同步 ========== */

/**
 * 更新行号显示
 * @param {HTMLElement} textarea
 * @param {HTMLElement} lineNumbers
 */
function updateLineNumbers(textarea, lineNumbers) {
  if (!textarea || !lineNumbers) return;

  var lines = textarea.value.split('\n').length;
  var html = '';
  for (var i = 1; i <= lines; i++) {
    html += i + '\n';
  }
  lineNumbers.textContent = html;
}

/**
 * 同步 textarea 与行号的滚动位置
 * @param {HTMLElement} textarea
 * @param {HTMLElement} lineNumbers
 */
function syncScroll(textarea, lineNumbers) {
  if (!lineNumbers) return;
  lineNumbers.scrollTop = textarea.scrollTop;
}

/* ========== 核心：运行代码 ========== */

/**
 * 运行代码 - 显示预定义的输出结果
 * @param {string} id - 练习 ID
 */
function runCode(id) {
  var lab = getCodeLab(id);
  if (!lab) return;

  var textarea = getLabChild(lab, '.code-lab-textarea');
  var outputBody = getLabChild(lab, '.code-lab-output-body');
  if (!textarea || !outputBody) return;

  // 检查代码是否为空
  var code = textarea.value.trim();
  if (!code) {
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-empty', 'is-success');
    outputBody.classList.add('is-empty');
    outputBody.textContent = '';
    // 重新触发 ::before 伪元素
    void outputBody.offsetWidth;
    return;
  }

  // 获取预定义输出
  var outputText = lab.getAttribute('data-output') || '';

  // 清空之前的内容
  outputBody.innerHTML = '';
  outputBody.classList.remove('is-empty');

  // 逐行显示输出（带动画）
  var lines = outputText.split('\n');
  var delay = 0;

  lines.forEach(function (line, index) {
    setTimeout(function () {
      var span = document.createElement('span');
      span.className = 'code-lab-output-line';
      span.textContent = line;
      // 每行错开动画延迟
      span.style.animationDelay = '0s';
      outputBody.appendChild(span);

      // 最后一行显示完毕后标记成功
      if (index === lines.length - 1) {
        outputBody.classList.add('is-success');
      }
    }, delay);
    delay += 40; // 每行间隔 40ms
  });

  // 如果没有预定义输出，显示提示
  if (lines.length === 1 && lines[0] === '') {
    setTimeout(function () {
      outputBody.classList.add('is-success');
      var span = document.createElement('span');
      span.className = 'code-lab-output-line';
      span.textContent = '(代码已执行，无输出内容)';
      span.style.color = '#7A7A7A';
      outputBody.appendChild(span);
    }, delay);
  }
}

/* ========== 核心：清除代码 ========== */

/**
 * 清空代码与输出
 * @param {string} id - 练习 ID
 */
function clearCode(id) {
  var lab = getCodeLab(id);
  if (!lab) return;

  var textarea = getLabChild(lab, '.code-lab-textarea');
  var outputBody = getLabChild(lab, '.code-lab-output-body');
  var lineNumbers = getLabChild(lab, '.code-lab-line-numbers');

  if (textarea) {
    textarea.value = '';
  }

  if (outputBody) {
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-success');
    outputBody.classList.add('is-empty');
  }

  if (lineNumbers) {
    updateLineNumbers(textarea, lineNumbers);
  }
}

/* ========== 核心：切换参考答案 ========== */

/**
 * 切换参考答案的显示/隐藏
 * @param {string} id - 练习 ID
 */
function toggleReference(id) {
  var lab = getCodeLab(id);
  if (!lab) return;

  var refPanel = getLabChild(lab, '.code-lab-reference');
  var refBtn = getLabChild(lab, '.code-lab-btn--ref');
  var refBody = getLabChild(lab, '.code-lab-reference-body');

  if (!refPanel) return;

  var isVisible = refPanel.classList.contains('is-visible');

  if (isVisible) {
    // 隐藏
    refPanel.classList.remove('is-visible');
    if (refBtn) {
      refBtn.textContent = '参考答案';
      refBtn.classList.remove('is-active');
    }
  } else {
    // 显示
    // 填充参考答案内容
    if (refBody && !refBody.textContent.trim()) {
      var answer = lab.getAttribute('data-answer') || '';
      refBody.textContent = answer;
    }
    refPanel.classList.add('is-visible');
    if (refBtn) {
      refBtn.textContent = '隐藏答案';
      refBtn.classList.add('is-active');
    }
  }
}

/* ========== 初始化 ========== */

/**
 * 页面加载后自动初始化所有 code-lab 实例
 * - 绑定行号同步
 * - 绑定 Tab 键缩进
 * - 绑定按钮事件
 */
function initCodeLabs() {
  var labs = document.querySelectorAll('.code-lab');

  labs.forEach(function (lab) {
    var textarea = getLabChild(lab, '.code-lab-textarea');
    var lineNumbers = getLabChild(lab, '.code-lab-line-numbers');
    var runBtn = getLabChild(lab, '.code-lab-btn--run');
    var clearBtn = getLabChild(lab, '.code-lab-btn--clear');
    var refBtn = getLabChild(lab, '.code-lab-btn--ref');

    // 行号初始化与同步
    if (textarea && lineNumbers) {
      updateLineNumbers(textarea, lineNumbers);

      textarea.addEventListener('input', function () {
        updateLineNumbers(textarea, lineNumbers);
      });

      textarea.addEventListener('scroll', function () {
        syncScroll(textarea, lineNumbers);
      });
    }

    // Tab 键支持（插入 4 个空格而非跳转焦点）
    if (textarea) {
      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
          var value = this.value;

          this.value = value.substring(0, start) + '    ' + value.substring(end);
          this.selectionStart = this.selectionEnd = start + 4;

          updateLineNumbers(this, lineNumbers);
        }
      });
    }

    // 绑定按钮事件
    var labId = lab.id;

    if (runBtn) {
      runBtn.addEventListener('click', function () {
        runCode(labId);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearCode(labId);
      });
    }

    if (refBtn) {
      refBtn.addEventListener('click', function () {
        toggleReference(labId);
      });
    }
  });
}

// DOM 就绪后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCodeLabs);
} else {
  initCodeLabs();
}
