/**
 * Code Lab - 代码练习交互逻辑（集成 Pyodide 真实运行 Python）
 */

/* ========== Pyodide 加载 ========== */
var pyodideInstance = null;
var pyodideLoading = false;
var pyodideReady = false;

function loadPyodide(callback) {
    if (pyodideReady && pyodideInstance) {
        callback(pyodideInstance);
        return;
    }
    if (pyodideLoading) {
        var checkInterval = setInterval(function () {
            if (pyodideReady && pyodideInstance) {
                clearInterval(checkInterval);
                callback(pyodideInstance);
            }
        }, 200);
        return;
    }
    pyodideLoading = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.onload = function () {
        loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        }).then(function (pyodide) {
            pyodideInstance = pyodide;
            pyodideReady = true;
            pyodideLoading = false;
            // 预加载 pandas 和 numpy
            pyodide.loadPackage(['pandas', 'numpy', 'matplotlib']).then(function () {
                callback(pyodide);
            }).catch(function () {
                // 如果包加载失败，仍然可以使用纯 Python
                pyodideReady = true;
                callback(pyodide);
            });
        }).catch(function (err) {
            console.error('Pyodide 加载失败:', err);
            pyodideLoading = false;
            callback(null);
        });
    };
    script.onerror = function () {
        console.error('Pyodide JS 加载失败');
        pyodideLoading = false;
        callback(null);
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

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ========== 行号同步 ========== */
function updateLineNumbers(textarea, lineNumbers) {
    if (!textarea || !lineNumbers) return;
    var lines = textarea.value.split('\n').length;
    var html = '';
    for (var i = 1; i <= lines; i++) {
        html += i + '\n';
    }
    lineNumbers.textContent = html;
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
        outputBody.classList.remove('is-empty', 'is-success');
        return;
    }

    // 显示加载状态
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = '⏳ 加载中...';
    }
    outputBody.innerHTML = '<span style="color:#F9D342;">正在加载 Python 运行环境（首次加载较慢，请耐心等待）...</span>';
    outputBody.classList.remove('is-empty', 'is-success');

    loadPyodide(function (pyodide) {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.textContent = '▶ 运行代码';
        }

        if (!pyodide) {
            // Pyodide 加载失败，使用 data-output 作为后备
            var fallbackOutput = lab.getAttribute('data-output') || '（Python 环境加载失败，显示预定义输出）\n' + (lab.getAttribute('data-output') || '');
            displayOutput(outputBody, fallbackOutput);
            return;
        }

        // 构建执行代码：捕获 stdout
        var wrappedCode = [
            'import sys',
            'import io',
            '_stdout_capture = io.StringIO()',
            '_stderr_capture = io.StringIO()',
            'sys.stdout = _stdout_capture',
            'sys.stderr = _stderr_capture',
            '',
            'try:',
            code.replace(/^/gm, '    '),
            '    pass',
            'except Exception as e:',
            '    print(str(e), file=sys.stderr)',
            '',
            'sys.stdout = sys.__stdout__',
            'sys.stderr = sys.__stderr__',
            '_captured_output = _stdout_capture.getvalue()',
            '_captured_error = _stderr_capture.getvalue()',
        ].join('\n');

        try {
            pyodide.runPython(wrappedCode);
            var stdout = pyodide.globals.get('_captured_output');
            var stderr = pyodide.globals.get('_captured_error');

            var result = '';
            if (stdout) result += stdout;
            if (stderr) {
                if (result) result += '\n';
                result += '[错误] ' + stderr;
            }
            if (!result) result = '(代码已执行，无输出内容)';

            displayOutput(outputBody, result);
        } catch (err) {
            displayOutput(outputBody, '[执行错误] ' + err.message);
        }
    });
}

function displayOutput(outputBody, text) {
    outputBody.innerHTML = '';
    outputBody.classList.remove('is-empty');

    var lines = text.split('\n');
    var delay = 0;

    lines.forEach(function (line, index) {
        setTimeout(function () {
            var span = document.createElement('span');
            span.className = 'code-lab-output-line';
            span.textContent = line;
            outputBody.appendChild(span);

            if (index === lines.length - 1) {
                outputBody.classList.add('is-success');
            }

            // 自动滚动到底部
            outputBody.scrollTop = outputBody.scrollHeight;
        }, delay);
        delay += 20;
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
        outputBody.classList.remove('is-success');
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
            refBtn.innerHTML = '◉ 参考答案';
            refBtn.classList.remove('is-active');
        }
    } else {
        if (refBody && !refBody.textContent.trim()) {
            var answer = lab.getAttribute('data-answer') || '';
            refBody.textContent = answer;
        }
        refPanel.classList.add('is-visible');
        if (refBtn) {
            refBtn.innerHTML = '◉ 隐藏答案';
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
