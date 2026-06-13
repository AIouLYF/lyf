/**
 * Code Lab - 代码练习交互逻辑（Pyodide 后台预加载版）
 * 页面加载时自动在后台下载 Python 运行环境
 * 用户点击"运行代码"时环境已就绪，无需等待
 */

/* ========== Pyodide 后台预加载 ========== */
var pyodideInstance = null;
var pyodideReady = false;
var pyodideFailed = false;
var pyodideLoadStarted = false;

function preloadPyodide() {
    if (pyodideLoadStarted) return;
    pyodideLoadStarted = true;

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.onload = function () {
        loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        }).then(function (pyodide) {
            pyodideInstance = pyodide;
            pyodideReady = true;
            // 预加载 pandas 和 numpy
            return pyodide.loadPackage(['pandas', 'numpy']).then(function () {
                console.log('Python 运行环境已就绪（含 pandas/numpy）');
            }).catch(function (pkgErr) {
                console.warn('pandas/numpy 加载失败:', pkgErr);
            });
        }).catch(function (err) {
            console.warn('Pyodide 加载失败，将使用模拟输出:', err);
            pyodideFailed = true;
        });
    };
    script.onerror = function () {
        console.warn('Pyodide 脚本加载失败，将使用模拟输出');
        pyodideFailed = true;
    };
    document.head.appendChild(script);
}

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

/* ========== 核心：运行代码（真实 Python 执行） ========== */
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
        outputBody.classList.remove('is-empty', 'is-success', 'is-warning');
        return;
    }

    // 按钮状态
    if (runBtn) {
        runBtn.disabled = true;
    }
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-empty', 'is-success', 'is-warning');

    if (pyodideReady && pyodideInstance) {
        // 环境已就绪，直接运行
        executePython(lab, code, outputBody, runBtn);
    } else if (pyodideFailed) {
        // 加载失败，使用模拟输出
        runBtn.disabled = false;
        runWithFallback(lab, code, outputBody);
    } else {
        // 正在加载中，等待
        outputBody.innerHTML = '<span style="color:#F9D342;">⏳ Python 环境正在后台加载，请稍候...</span>';
        waitForPyodide(function () {
            if (pyodideReady && pyodideInstance) {
                executePython(lab, code, outputBody, runBtn);
            } else {
                runBtn.disabled = false;
                runWithFallback(lab, code, outputBody);
            }
        });
    }
}

function waitForPyodide(callback) {
    var maxWait = 30000; // 最多等30秒
    var start = Date.now();
    var check = setInterval(function () {
        if (pyodideReady || pyodideFailed || (Date.now() - start) > maxWait) {
            clearInterval(check);
            callback();
        }
    }, 500);
}

/* 真实执行 Python 代码 */
function executePython(lab, code, outputBody, runBtn) {
    try {
        // 构建代码：捕获 stdout/stderr
        var wrappedCode = [
            'import sys, io',
            '_out = io.StringIO()',
            '_err = io.StringIO()',
            'sys.stdout = _out',
            'sys.stderr = _err',
            'try:',
            code.replace(/^/gm, '    '),
            'except Exception as e:',
            '    print(repr(e), file=sys.stderr)',
            'sys.stdout = sys.__stdout__',
            'sys.stderr = sys.__stderr__',
            '_result_out = _out.getvalue()',
            '_result_err = _err.getvalue()',
        ].join('\n');

        pyodideInstance.runPython(wrappedCode);

        var stdout = pyodideInstance.globals.get('_result_out') || '';
        var stderr = pyodideInstance.globals.get('_result_err') || '';

        var result = '';
        if (stdout) result += stdout;
        if (stderr) {
            if (result) result += '\n';
            result += '[错误] ' + stderr;
        }
        if (!result) result = '(代码已执行，无输出内容)';

        displayOutput(outputBody, result, true);
    } catch (err) {
        displayOutput(outputBody, '[执行错误] ' + err.message, false);
    }

    if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = '▶ 运行代码';
    }
}

/* 后备方案：模拟输出 */
function runWithFallback(lab, code, outputBody) {
    var predefinedOutput = lab.getAttribute('data-output') || '（运行环境不可用）';
    displayOutput(outputBody, predefinedOutput + '\n\n--- 提示：Python 环境加载失败，显示预期输出 ---', false);
}

/* 逐行动画显示输出 */
function displayOutput(outputBody, text, isSuccess) {
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
                outputBody.classList.add(isSuccess ? 'is-success' : 'is-warning');
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
            // 将 \n 转为真正的换行符
            answer = answer.replace(/\\n/g, '\n');
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
    // 后台预加载 Python 运行环境
    preloadPyodide();

    // 初始化所有代码练习
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

        // Tab 键支持
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

        // 按钮事件
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
