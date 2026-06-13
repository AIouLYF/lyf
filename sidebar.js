/**
 * 全局左侧导航栏 + 交互式练习系统
 */

// ===== 侧边栏逻辑 =====
function initSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('show');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // 可展开菜单
    document.querySelectorAll('.sidebar-expandable > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('open');
        });
    });

    // 修正侧边栏链接路径
    fixSidebarLinks();

    // 高亮当前页面
    highlightCurrentNav();

    // SPA式导航：点击链接时不刷新整个页面
    enableSmoothNavigation();
}

// SPA式导航：fetch加载页面内容，不刷新侧边栏
function enableSmoothNavigation() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    sidebar.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;

        link.addEventListener('click', function (e) {
            e.preventDefault();

            // 在移动端自动关闭侧边栏
            const sidebarEl = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebarEl) sidebarEl.classList.remove('open');
            if (overlay) overlay.classList.remove('show');

            // 显示加载状态
            const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'page-loading';
            loadingOverlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(18,18,18,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;';
            loadingOverlay.innerHTML = '<div style="color:#F9D342;font-size:14px;letter-spacing:0.1em;">页面加载中...</div>';
            document.body.appendChild(loadingOverlay);

            // fetch加载目标页面
            fetch(href)
                .then(function (response) {
                    if (!response.ok) throw new Error('页面不存在');
                    return response.text();
                })
                .then(function (html) {
                    // 解析HTML，提取主要内容区域
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // 更新页面标题
                    document.title = doc.title;

                    // 替换body内容（保留sidebar）
                    const newBody = doc.body;
                    // 找到主内容区域（排除sidebar）
                    const oldSidebar = document.querySelector('.sidebar');
                    const newSidebar = newBody.querySelector('.sidebar');

                    // 移除旧sidebar
                    if (oldSidebar) oldSidebar.remove();
                    if (newSidebar) newSidebar.remove();

                    // 替换body内容
                    document.body.innerHTML = newBody.innerHTML;

                    // 重新插入sidebar
                    if (oldSidebar) {
                        document.body.prepend(oldSidebar);
                    }

                    // 更新URL（不刷新）
                    history.pushState({}, '', href);

                    // 重新初始化sidebar
                    if (typeof initSidebar === 'function') initSidebar();

                    // 重新初始化code-lab（如果有的话）
                    if (typeof initCodeLabs === 'function') initCodeLabs();

                    // 滚动到顶部
                    window.scrollTo(0, 0);

                    // 移除加载状态
                    const loading = document.getElementById('page-loading');
                    if (loading) loading.remove();
                })
                .catch(function (err) {
                    // 加载失败，回退到普通跳转
                    console.warn('SPA导航失败，回退到普通跳转:', err);
                    const loading = document.getElementById('page-loading');
                    if (loading) loading.remove();
                    window.location.href = href;
                });
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', function () {
        window.location.reload();
    });
}

// 根据当前页面深度修正侧边栏中的链接路径
function fixSidebarLinks() {
    const path = window.location.pathname;
    // 判断当前页面是否在 courses/ 子目录中
    const inCourses = path.includes('/courses/');
    // 计算需要回退几层：courses/python/ch1.html -> 需要回退到根目录
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    sidebar.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;

        if (inCourses) {
            // 当前在 courses 子目录，sidebar.html 在根目录
            // sidebar.html 中的链接格式为 courses/python/ch1.html
            // 从 courses/python/ch1.html 访问需要 ../../courses/python/ch1.html
            // 但更简单：sidebar.html 中的链接是相对于根目录的 courses/xxx
            // 从 courses/python/ 需要 ../xxx (回到 courses/ 再进入)
            // courses/python/ch1.html -> ../python/ch2.html (同课程)
            // courses/python/ch1.html -> ../data-analysis/ch1.html (其他课程)
            // courses/python/ch1.html -> ../../index.html (首页)
            if (href.startsWith('courses/')) {
                // courses/python/ch1.html -> ../python/ch1.html
                link.setAttribute('href', '../' + href.substring('courses/'.length));
            } else if (href === 'index.html' || href === '../index.html') {
                // 首页链接
                link.setAttribute('href', '../../index.html');
            }
        }
        // 如果在根目录(index.html)，sidebar.html中的 courses/xxx 路径直接可用
    });
}

function highlightCurrentNav() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    document.querySelectorAll('.sidebar a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript')) return;
        const linkFile = href.split('/').pop();
        if (filename && linkFile === filename && filename !== 'index.html') {
            link.classList.add('active');
            // 展开父级菜单
            const parentExpandable = link.closest('.sidebar-expandable');
            if (parentExpandable) parentExpandable.classList.add('open');
            // 展开祖父级菜单
            const grandParent = parentExpandable?.closest('.sidebar-submenu')?.closest('.sidebar-expandable');
            if (grandParent) grandParent.classList.add('open');
        }
        // 首页高亮
        if (filename === '' || filename === 'index.html') {
            if (href.endsWith('index.html') && !href.includes('courses')) {
                link.classList.add('active');
            }
        }
    });
}

// ===== 交互式练习系统 =====

// 选择题
function selectOption(questionId, optionIndex) {
    const question = document.getElementById(questionId);
    if (!question || question.classList.contains('submitted')) return;

    question.querySelectorAll('.question-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    const options = question.querySelectorAll('.question-option');
    if (options[optionIndex]) {
        options[optionIndex].classList.add('selected');
    }
}

// 判断题
function selectTF(questionId, value) {
    const question = document.getElementById(questionId);
    if (!question || question.classList.contains('submitted')) return;

    question.querySelectorAll('.tf-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    const selected = question.querySelector(`.tf-option[data-value="${value}"]`);
    if (selected) selected.classList.add('selected');
}

// 提交单题答案
function submitQuestion(questionId, correctAnswer, explanation) {
    const question = document.getElementById(questionId);
    if (!question || question.classList.contains('submitted')) return;

    question.classList.add('submitted');

    const type = question.dataset.type;
    let userAnswer = null;
    let isCorrect = false;

    if (type === 'choice') {
        const selected = question.querySelector('.question-option.selected');
        if (selected) {
            userAnswer = selected.dataset.index;
            isCorrect = (parseInt(userAnswer) === correctAnswer);
            question.querySelectorAll('.question-option').forEach(opt => {
                opt.classList.add('disabled');
                if (parseInt(opt.dataset.index) === correctAnswer) {
                    opt.classList.add('correct-answer');
                }
                if (opt.classList.contains('selected') && !isCorrect) {
                    opt.classList.add('wrong-answer');
                }
            });
        }
    } else if (type === 'tf') {
        const selected = question.querySelector('.tf-option.selected');
        if (selected) {
            userAnswer = selected.dataset.value;
            isCorrect = (userAnswer === String(correctAnswer));
            question.querySelectorAll('.tf-option').forEach(opt => {
                opt.classList.add('disabled');
                if (opt.dataset.value === String(correctAnswer)) {
                    opt.classList.add('correct-answer');
                }
                if (opt.classList.contains('selected') && !isCorrect) {
                    opt.classList.add('wrong-answer');
                }
            });
        }
    } else if (type === 'fill') {
        const input = question.querySelector('.fill-input');
        if (input) {
            userAnswer = input.value.trim();
            isCorrect = (userAnswer.toLowerCase() === String(correctAnswer).toLowerCase());
            input.disabled = true;
            input.classList.add(isCorrect ? 'correct' : 'wrong');
        }
    }

    if (userAnswer === null || userAnswer === '') {
        question.classList.remove('submitted');
        alert('请先选择或填写答案再提交！');
        return;
    }

    const explanationEl = question.querySelector('.answer-explanation');
    if (explanationEl && explanation) {
        explanationEl.classList.add('show');
    }

    if (isCorrect) {
        question.classList.add('correct');
    } else {
        question.classList.add('wrong');
    }

    updateQuizProgress(question.closest('.quiz-container'));
}

// 提交整个练习
function submitQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;

    const questions = quiz.querySelectorAll('.quiz-question');
    let total = questions.length;
    let answered = 0;
    let correct = 0;

    questions.forEach(q => {
        if (q.classList.contains('submitted')) {
            answered++;
            if (q.classList.contains('correct')) correct++;
        }
    });

    if (answered < total) {
        alert(`还有 ${total - answered} 题未完成，请全部作答后再提交！`);
        return;
    }

    const scoreEl = quiz.querySelector('.quiz-score');
    if (scoreEl) {
        const percentage = Math.round((correct / total) * 100);
        scoreEl.querySelector('.quiz-score-number').textContent = `${correct}/${total}`;
        const labelEl = scoreEl.querySelector('.quiz-score-label');
        if (percentage >= 60) {
            labelEl.innerHTML = `<span class="quiz-score-pass">得分率 ${percentage}%，及格！</span>`;
        } else {
            labelEl.innerHTML = `<span class="quiz-score-fail">得分率 ${percentage}%，未及格，请复习后重试</span>`;
        }
        scoreEl.classList.add('show');
    }

    quiz.querySelectorAll('.quiz-submit-btn').forEach(btn => {
        btn.disabled = true;
    });
}

// 更新进度条
function updateQuizProgress(quizContainer) {
    if (!quizContainer) return;
    const questions = quizContainer.querySelectorAll('.quiz-question');
    const total = questions.length;
    const answered = quizContainer.querySelectorAll('.quiz-question.submitted').length;
    const pct = Math.round((answered / total) * 100);

    const fill = quizContainer.querySelector('.quiz-progress-fill');
    const text = quizContainer.querySelector('.quiz-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${answered}/${total}`;
}

// 提交实操题（代码类）
function submitCodeQuestion(questionId, referenceAnswer, explanation) {
    const question = document.getElementById(questionId);
    if (!question || question.classList.contains('submitted')) return;

    const textarea = question.querySelector('.code-editor-area');
    if (!textarea || textarea.value.trim() === '') {
        alert('请先编写代码再提交！');
        return;
    }

    question.classList.add('submitted');
    textarea.disabled = true;

    const explanationEl = question.querySelector('.answer-explanation');
    if (explanationEl) {
        const refCodeEl = explanationEl.querySelector('.reference-code');
        if (refCodeEl) refCodeEl.textContent = referenceAnswer;
        explanationEl.classList.add('show');
    }

    question.classList.add('answered');
    updateQuizProgress(question.closest('.quiz-container'));
}

// 提交试卷
function submitExam(examId) {
    const exam = document.getElementById(examId);
    if (!exam) return;

    const questions = exam.querySelectorAll('.quiz-question');
    let total = questions.length;
    let answered = 0;
    let correct = 0;
    let totalScore = 0;
    let earnedScore = 0;

    questions.forEach(q => {
        const score = parseInt(q.dataset.score || '0');
        totalScore += score;
        if (q.classList.contains('submitted')) {
            answered++;
            if (q.classList.contains('correct')) {
                correct++;
                earnedScore += score;
            }
        }
    });

    if (answered < total) {
        alert(`还有 ${total - answered} 题未完成，请全部作答后再提交！`);
        return;
    }

    const scoreEl = exam.querySelector('.quiz-score');
    if (scoreEl) {
        const pct = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
        scoreEl.querySelector('.quiz-score-number').textContent = `${earnedScore}/${totalScore}`;
        const labelEl = scoreEl.querySelector('.quiz-score-label');
        if (pct >= 60) {
            labelEl.innerHTML = `<span class="quiz-score-pass">得分率 ${pct}%，及格！</span>`;
        } else {
            labelEl.innerHTML = `<span class="quiz-score-fail">得分率 ${pct}%，未及格，请复习后重试</span>`;
        }
        scoreEl.classList.add('show');
    }

    exam.querySelectorAll('.quiz-submit-btn').forEach(btn => btn.disabled = true);
}

// 重置练习
function resetQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;

    quiz.querySelectorAll('.quiz-question').forEach(q => {
        q.classList.remove('submitted', 'correct', 'wrong', 'answered');
        q.querySelectorAll('.question-option').forEach(opt => {
            opt.classList.remove('selected', 'disabled', 'correct-answer', 'wrong-answer');
        });
        q.querySelectorAll('.tf-option').forEach(opt => {
            opt.classList.remove('selected', 'disabled', 'correct-answer', 'wrong-answer');
        });
        const input = q.querySelector('.fill-input');
        if (input) { input.disabled = false; input.value = ''; input.classList.remove('correct', 'wrong'); }
        const textarea = q.querySelector('.code-editor-area');
        if (textarea) { textarea.disabled = false; }
        const exp = q.querySelector('.answer-explanation');
        if (exp) exp.classList.remove('show');
    });

    const scoreEl = quiz.querySelector('.quiz-score');
    if (scoreEl) scoreEl.classList.remove('show');

    quiz.querySelectorAll('.quiz-submit-btn').forEach(btn => btn.disabled = false);
    updateQuizProgress(quiz);
}

// 初始化
document.addEventListener('DOMContentLoaded', initSidebar);
