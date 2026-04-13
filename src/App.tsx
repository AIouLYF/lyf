import React from 'react';
import CourseCard from './components/CourseCard';

const App: React.FC = () => {
  // 课程数据
  const courses = [
    {
      id: 1,
      title: 'Python基础',
      description: 'Python编程语言的基础概念、语法和应用',
      icon: '📱'
    },
    {
      id: 2,
      title: '数据分析技术',
      description: '使用Python进行数据清洗、分析和可视化',
      icon: '📊'
    },
    {
      id: 3,
      title: '数据采集与处理',
      description: '网络数据采集技术和数据预处理方法',
      icon: '🔍'
    },
    {
      id: 4,
      title: '供应链数据分析',
      description: '供应链管理中的数据分析方法和应用',
      icon: '📦'
    },
    {
      id: 5,
      title: '数据库原理与应用',
      description: '数据库设计、SQL语言和数据库管理系统',
      icon: '💾'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* 个人信息部分 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">👨‍🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">李优发</h1>
          <p className="text-xl text-gray-600 mb-4">广东科学技术职业学院</p>
          <p className="text-lg text-gray-500">商学院 · 商务数据分析与应用专业</p>
        </div>
      </section>

      {/* 课程列表部分 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">我的课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2026 李优发的个人课程页面</p>
        </div>
      </footer>
    </div>
  );
};

export default App;