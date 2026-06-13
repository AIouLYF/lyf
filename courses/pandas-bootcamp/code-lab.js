/**
 * Code Lab - 代码练习交互逻辑（轻量版，无需 Python 运行时）
 * 点击"运行代码"显示模拟输出，支持代码比对
 */

/* ========== 工具函数 ========== */
function getCodeLab(id) {
    return document.getElementById(id);
}

function getLabChild(lab, selector) {
    return lab.querySelector(selector);
}

/* ========== 行号同步 ========== */
function updateLineNumbers(textarea, lineNumbers) {
    if (!textarea || !lineNumbers) return;
    var lines = textarea.value.split('\n').length;
    var nums = [];
    for (var i = 1; i <= Math.max(lines, 1); i++) {
        nums.push(i);
    }
    lineNumbers.textContent = nums.join('\n');
}

function syncScroll(textarea, lineNumbers) {
    if (!lineNumbers) return;
    lineNumbers.scrollTop = textarea.scrollTop;
}

/* ========== 核心：运行代码 ========== */
function runCode(id) {
    var lab = getCodeLab(id);
    if (!lab) return;

    var textarea = getLabChild(lab, '.code-lab-textarea');
    var outputBody = getLabChild(lab, '.code-lab-output-body');
    var runBtn = getLabChild(lab, '.code-lab-btn-run');
    if (!textarea || !outputBody) return;

    var code = textarea.value.trim();
    if (!code) {
        outputBody.innerHTML = '<span style="color:#7A7A7A;font-style:italic;">请先编写代码再运行</span>';
        outputBody.classList.remove('is-empty', 'is-success');
        return;
    }

    // 显示运行中状态
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = '⏳ 运行中...';
    }
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-empty', 'is-success');

    // 模拟短暂运行延迟
    setTimeout(function () {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.textContent = '▶ 运行代码';
        }

        // 获取预定义输出
        var predefinedOutput = lab.getAttribute('data-output') || '';
        var referenceAnswer = lab.getAttribute('data-answer') || '';

        // 简单比对：去除空白后比较
        var userCodeNorm = code.replace(/\s+/g, ' ').trim().toLowerCase();
        var refCodeNorm = referenceAnswer.replace(/\s+/g, ' ').trim().toLowerCase();

        var resultText;
        var isCorrect = false;

        if (refCodeNorm && userCodeNorm === refCodeNorm) {
            // 代码完全匹配参考答案
            resultText = predefinedOutput;
            isCorrect = true;
        } else if (refCodeNorm && isSimilar(userCodeNorm, refCodeNorm)) {
            // 代码相似度较高（核心逻辑一致）
            resultText = predefinedOutput;
            isCorrect = true;
        } else {
            // 代码不匹配，仍然显示预期输出供参考
            resultText = predefinedOutput + '\n\n--- 提示：输出结果为预期结果，你的代码可能与参考答案不同，请检查逻辑或点击"参考答案"查看 ---';
        }

        // 逐行显示输出
        displayOutput(outputBody, resultText, isCorrect);
    }, 600);
}

/* 简单相似度判断：检查核心pandas函数是否一致 */
function isSimilar(userCode, refCode) {
    // 提取关键函数调用
    var patterns = [
        /pd\.read_\w+/g,
        /df\.\w+/g,
        /print\s*\(/g,
        /\.head\s*\(/g,
        /\.info\s*\(/g,
        /\.describe\s*\(/g,
        /\.groupby\s*\(/g,
        /\.merge\s*\(/g,
        /\.concat\s*\(/g,
        /\.pivot_table\s*\(/g,
        /\.crosstab\s*\(/g,
        /\.drop_duplicates\s*\(/g,
        /\.fillna\s*\(/g,
        /\.astype\s*\(/g,
        /\.rename\s*\(/g,
        /\.sort_values\s*\(/g,
        /\.value_counts\s*\(/g,
        /\.apply\s*\(/g,
        /\.agg\s*\(/g,
        /\.resample\s*\(/g,
        /\.rolling\s*\(/g,
        /\.plot\s*\./g,
        /import\s+\w+/g,
        /from\s+\w+\s+import/g
    ];

    var userFuncs = [];
    var refFuncs = [];
    patterns.forEach(function (p) {
        var u = userCode.match(p) || [];
        var r = refCode.match(p) || [];
        userFuncs = userFuncs.concat(u);
        refFuncs = refFuncs.concat(r);
    });

    // 去重排序后比较
    userFuncs = Array.from(new Set(userFuncs)).sort().join(',');
    refFuncs = Array.from(new Set(refFuncs)).sort().join(',');

    if (!refFuncs) return false;
    // 如果用户代码包含了参考答案中大部分关键函数
    var refArr = refFuncs.split(',');
    var matchCount = 0;
    refArr.forEach(function (f) {
        if (userFuncs.indexOf(f) !== -1) matchCount++;
    });
    return matchCount >= refArr.length * 0.6;
}

/* 逐行动画显示输出 */
function displayOutput(outputBody, text, isCorrect) {
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-empty');

    var lines = text.split('\n');
    var delay = 0;

    lines.forEach(function (line, index) {
        setTimeout(function () {
            var span = document.createElement('span');
            span.className = 'code-lab-output-line';
            span.textContent = line || ' ';
            outputBody.appendChild(span);

            if (index === lines.length - 1) {
                outputBody.classList.add(isCorrect ? 'is-success' : 'is-warning');
            }

            outputBody.scrollTop = outputBody.scrollHeight;
        }, delay);
        delay += 15;
    });
}

/* ========== 核心：清除代码 ========== */
function clearCode(id) {
    var lab = getCodeLab(id);
    if (!lab) return;

    var textarea = getLabChild(lab, '.code-lab-textarea');
    var outputBody = getLabChild(lab, '.code-lab-output-body');
    var lineNumbers = getLabChild(lab, '.code-lab-line-numbers');

    if (textarea) textarea.value = '';
    if (outputBody) {
        outputBody.innerHTML = '';
        outputBody.classList.remove('is-success', 'is-warning');
        outputBody.classList.add('is-empty');
    }
    if (lineNumbers) updateLineNumbers(textarea, lineNumbers);
}

/* ========== 核心：切换参考答案 ========== */
function toggleReference(id) {
    var lab = getCodeLab(id);
    if (!lab) return;

    var refPanel = getLabChild(lab, '.code-lab-reference');
    var refBtn = getLabChild(lab, '.code-lab-btn-ref');
    var refBody = getLabChild(lab, '.code-lab-reference-body');

    if (!refPanel) return;

    var isVisible = refPanel.classList.contains('is-visible');

    if (isVisible) {
        refPanel.classList.remove('is-visible');
        if (refBtn) {
            refBtn.textContent = '◉ 参考答案';
            refBtn.classList.remove('is-active');
        }
    } else {
        if (refBody && !refBody.textContent.trim()) {
            var answer = lab.getAttribute('data-answer') || '暂无参考答案';
            refBody.textContent = answer;
        }
        refPanel.classList.add('is-visible');
        if (refBtn) {
            refBtn.textContent = '◉ 隐藏答案';
            refBtn.classList.add('is-active');
        }
    }
}

/* ========== 初始化 ========== */
function initCodeLabs() {
    var labs = document.querySelectorAll('.code-lab');

    labs.forEach(function (lab) {
        var textarea = getLabChild(lab, '.code-lab-textarea');
        var lineNumbers = getLabChild(lab, '.code-lab-line-numbers');
        var runBtn = getLabChild(lab, '.code-lab-btn-run');
        var clearBtn = getLabChild(lab, '.code-lab-btn-clear');
        var refBtn = getLabChild(lab, '.code-lab-btn-ref');

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

        // Tab 键支持（插入4空格）
        if (textarea) {
            textarea.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                    updateLineNumbers(this, lineNumbers);
                }
            });
        }

        // 按钮事件绑定
        var labId = lab.id;
        if (runBtn) runBtn.addEventListener('click', function () { runCode(labId); });
        if (clearBtn) clearBtn.addEventListener('click', function () { clearCode(labId); });
        if (refBtn) refBtn.addEventListener('click', function () { toggleReference(labId); });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeLabs);
} else {
    initCodeLabs();
}
