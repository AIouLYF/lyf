import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  content?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
  detailedContent?: string;
  progress: number;
  lessons: Lesson[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  useEffect(() => {
    // 模拟课程数据
    const courses: Course[] = [
      {
        id: 1,
        title: 'Python基础',
        description: 'Python编程语言的基础概念、语法和应用',
        icon: '📱',
        progress: 75,
        detailedContent: '本课程系统学习Python编程语言，从基础语法到实际应用。',
        lessons: [
          {
            id: 1,
            title: 'Python环境搭建',
            description: '安装Python和开发环境配置',
            completed: true,
            content: '学习如何下载、安装Python，并配置开发环境。包括不同操作系统的安装方法，以及常用开发工具的介绍。'
          },
          {
            id: 2,
            title: '基本数据类型和变量',
            description: '学习Python的基本数据类型和变量使用',
            completed: true,
            content: '了解Python的基本数据类型，包括整数、浮点数、字符串、布尔值等，以及如何定义和使用变量。'
          },
          {
            id: 3,
            title: '控制语句',
            description: '学习if、for、while等控制语句',
            completed: true,
            content: '掌握Python的控制语句，包括条件语句（if-elif-else）和循环语句（for、while），以及循环控制语句（break、continue）。'
          },
          {
            id: 4,
            title: '函数定义和使用',
            description: '学习如何定义和使用函数',
            completed: true,
            content: '学习如何定义函数、传递参数、返回值，以及函数的各种参数类型，如位置参数、关键字参数、默认参数和可变参数。'
          },
          {
            id: 5,
            title: '数据结构',
            description: '学习列表、元组、字典等数据结构',
            completed: false,
            content: '了解Python的常用数据结构，包括列表、元组、字典和集合，以及它们的基本操作和使用场景。'
          },
          {
            id: 6,
            title: '面向对象编程',
            description: '学习Python的面向对象编程基础',
            completed: false,
            content: '掌握Python的面向对象编程概念，包括类的定义、对象的创建、继承、封装和多态等。'
          }
        ]
      },
      {
        id: 2,
        title: '数据分析技术',
        description: '使用Python进行数据清洗、分析和可视化',
        icon: '📊',
        progress: 50,
        detailedContent: '掌握数据分析的核心流程和工具，使用Python进行专业数据分析。',
        lessons: [
          {
            id: 1,
            title: 'NumPy库基础',
            description: '学习NumPy库的基本使用',
            completed: true,
            content: '学习NumPy库的基本概念和使用方法，包括数组的创建、操作和数学运算。'
          },
          {
            id: 2,
            title: 'Pandas数据处理',
            description: '学习使用Pandas进行数据处理',
            completed: true,
            content: '掌握Pandas库的使用，包括Series和DataFrame的创建、操作和数据处理。'
          },
          {
            id: 3,
            title: '数据清洗与预处理',
            description: '学习数据清洗和预处理技术',
            completed: true,
            content: '学习数据清洗的各种技巧，包括处理缺失值、重复值、异常值，以及数据标准化和规范化。'
          },
          {
            id: 4,
            title: '数据可视化',
            description: '学习使用Matplotlib和Seaborn进行数据可视化',
            completed: false,
            content: '掌握使用Matplotlib和Seaborn库创建各种类型的图表，包括折线图、散点图、柱状图、直方图等。'
          },
          {
            id: 5,
            title: '统计分析方法',
            description: '学习基本的统计分析方法',
            completed: false,
            content: '了解基本的统计分析方法，包括描述性统计、假设检验、相关分析和回归分析。'
          },
          {
            id: 6,
            title: '实战项目案例',
            description: '完成一个完整的数据分析项目',
            completed: false,
            content: '通过实际项目案例，综合运用所学的数据分析技术，完成从数据获取到结果呈现的完整流程。'
          }
        ]
      },
      {
        id: 3,
        title: '数据采集与处理',
        description: '网络数据采集技术和数据预处理方法',
        icon: '🔍',
        progress: 40,
        detailedContent: '学习网络数据采集技术，掌握数据清洗和预处理方法。',
        lessons: [
          {
            id: 1,
            title: 'HTTP协议基础',
            description: '学习HTTP协议的基本原理',
            completed: true,
            content: '了解HTTP协议的基本原理，包括请求方法、状态码、头信息等。'
          },
          {
            id: 2,
            title: 'Requests库使用',
            description: '学习使用Requests库发送HTTP请求',
            completed: true,
            content: '掌握使用Requests库发送HTTP请求，包括GET、POST等方法，以及处理响应。'
          },
          {
            id: 3,
            title: 'BeautifulSoup网页解析',
            description: '学习使用BeautifulSoup解析网页',
            completed: false,
            content: '学习使用BeautifulSoup库解析HTML和XML文档，提取网页中的数据。'
          },
          {
            id: 4,
            title: '正则表达式',
            description: '学习正则表达式的使用',
            completed: false,
            content: '掌握正则表达式的基本语法和使用方法，用于文本匹配和提取。'
          },
          {
            id: 5,
            title: '数据清洗技巧',
            description: '学习数据清洗的各种技巧',
            completed: false,
            content: '学习数据清洗的各种技巧，包括文本清洗、数值清洗和时间数据处理。'
          },
          {
            id: 6,
            title: '数据标准化',
            description: '学习数据标准化方法',
            completed: false,
            content: '了解数据标准化的各种方法，包括Min-Max标准化、Z-score标准化等。'
          }
        ]
      },
      {
        id: 4,
        title: '供应链数据分析',
        description: '供应链管理中的数据分析方法和应用',
        icon: '📦',
        progress: 25,
        detailedContent: '将数据分析技术应用于供应链管理，优化供应链流程。',
        lessons: [
          {
            id: 1,
            title: '供应链管理基础',
            description: '学习供应链管理的基本概念',
            completed: true,
            content: '了解供应链管理的基本概念、目标和组成部分。'
          },
          {
            id: 2,
            title: '需求预测方法',
            description: '学习需求预测的各种方法',
            completed: false,
            content: '掌握需求预测的各种方法，包括定性预测和定量预测。'
          },
          {
            id: 3,
            title: '库存优化分析',
            description: '学习库存优化的分析方法',
            completed: false,
            content: '学习库存优化的分析方法，包括经济订购批量模型、安全库存计算等。'
          },
          {
            id: 4,
            title: '供应商绩效评估',
            description: '学习供应商绩效评估的方法',
            completed: false,
            content: '掌握供应商绩效评估的方法和指标体系。'
          },
          {
            id: 5,
            title: '物流路径优化',
            description: '学习物流路径优化的方法',
            completed: false,
            content: '了解物流路径优化的方法，包括旅行商问题和车辆路径问题。'
          },
          {
            id: 6,
            title: '供应链风险分析',
            description: '学习供应链风险分析的方法',
            completed: false,
            content: '学习供应链风险分析的方法和风险缓解策略。'
          }
        ]
      },
      {
        id: 5,
        title: '数据库原理与应用',
        description: '数据库设计、SQL语言和数据库管理系统',
        icon: '💾',
        progress: 60,
        detailedContent: '系统学习数据库原理，掌握SQL语言和数据库应用开发。',
        lessons: [
          {
            id: 1,
            title: '数据库系统概述',
            description: '学习数据库系统的基本概念',
            completed: true,
            content: '了解数据库系统的基本概念、发展历程和特点。'
          },
          {
            id: 2,
            title: '关系数据库理论',
            description: '学习关系数据库的基本理论',
            completed: true,
            content: '掌握关系数据库的基本理论，包括关系模型、关系代数、函数依赖和范式。'
          },
          {
            id: 3,
            title: 'SQL语言基础',
            description: '学习SQL语言的基本语法',
            completed: true,
            content: '掌握SQL语言的基本语法，包括数据定义、数据操纵和数据查询。'
          },
          {
            id: 4,
            title: '数据库设计',
            description: '学习数据库设计的方法',
            completed: false,
            content: '学习数据库设计的方法和步骤，包括需求分析、概念设计、逻辑设计和物理设计。'
          },
          {
            id: 5,
            title: '索引优化',
            description: '学习数据库索引优化的方法',
            completed: false,
            content: '了解数据库索引的原理和优化方法，提高查询性能。'
          },
          {
            id: 6,
            title: '事务处理',
            description: '学习数据库事务处理的方法',
            completed: false,
            content: '掌握数据库事务的概念、特性和处理方法。'
          }
        ]
      }
    ];

    const foundCourse = courses.find(c => c.id === parseInt(id || '0'));
    setCurrentCourse(foundCourse || null);
  }, [id]);

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">课程未找到</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const toggleLessonCompletion = (lessonId: number) => {
    setCurrentCourse(prevCourse => {
      if (!prevCourse) return null;
      
      const updatedLessons = prevCourse.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
      );
      
      const completedCount = updatedLessons.filter(lesson => lesson.completed).length;
      const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
      
      return {
        ...prevCourse,
        lessons: updatedLessons,
        progress: newProgress
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
            <div className="text-6xl mb-4">{currentCourse.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{currentCourse.title}</h1>
            <p className="text-blue-100">{currentCourse.description}</p>
          </div>

          <div className="p-8">
            {/* 学习进度 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">学习进度</h3>
                <span className="text-blue-600 font-medium">{currentCourse.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${currentCourse.progress}%` }}
                ></div>
              </div>
            </div>

            {/* 课程内容 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">课程内容</h3>
              <div className="space-y-3">
                {currentCourse.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    onClick={() => toggleLessonCompletion(lesson.id)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          lesson.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {lesson.completed ? (
                            <span className="text-sm">✓</span>
                          ) : (
                            <span className="text-sm">{lesson.id}</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                      </div>
                      <span className={`text-sm font-medium ${
                        lesson.completed 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                      }`}>
                        {lesson.completed ? '已完成' : '未完成'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-9 mb-3">{lesson.description}</p>
                    
                    {/* 章节详细内容 */}
                    {lesson.content && (
                      <div className="ml-9 mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">{lesson.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 课程详细介绍 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">课程介绍</h3>
              <p className="text-gray-600">{currentCourse.detailedContent}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                返回课程列表
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;