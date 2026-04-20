import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
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

  const courses: Course[] = [
    {
      id: 1,
      title: 'Python基础',
      description: 'Python编程语言的基础概念、语法和应用',
      icon: '📱',
      progress: 75,
      detailedContent: `
## 课程介绍
本课程系统学习Python编程语言，从基础语法到实际应用。

## 主要内容
- Python环境搭建
- 基本数据类型和变量
- 控制语句（if、for、while）
- 函数定义和使用
- 列表、元组、字典等数据结构
- 面向对象编程基础

## 学习目标
掌握Python语言的核心概念，能够使用Python解决简单问题。
      `,
      lessons: [
        {
          id: 1,
          title: 'Python环境搭建',
          description: '安装Python和开发环境配置',
          completed: true
        },
        {
          id: 2,
          title: '基本数据类型和变量',
          description: '学习Python的基本数据类型和变量使用',
          completed: true
        },
        {
          id: 3,
          title: '控制语句',
          description: '学习if、for、while等控制语句',
          completed: true
        },
        {
          id: 4,
          title: '函数定义和使用',
          description: '学习如何定义和使用函数',
          completed: true
        },
        {
          id: 5,
          title: '数据结构',
          description: '学习列表、元组、字典等数据结构',
          completed: false
        },
        {
          id: 6,
          title: '面向对象编程',
          description: '学习Python的面向对象编程基础',
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: '数据分析技术',
      description: '使用Python进行数据清洗、分析和可视化',
      icon: '📊',
      progress: 50,
      detailedContent: `
## 课程介绍
掌握数据分析的核心流程和工具，使用Python进行专业数据分析。

## 主要内容
- NumPy库基础
- Pandas数据处理
- 数据清洗与预处理
- 数据可视化（Matplotlib、Seaborn）
- 统计分析方法
- 实战项目案例

## 学习目标
能够独立完成数据分析项目，从数据获取到结果呈现。
      `,
      lessons: [
        {
          id: 1,
          title: 'NumPy库基础',
          description: '学习NumPy库的基本使用',
          completed: true
        },
        {
          id: 2,
          title: 'Pandas数据处理',
          description: '学习使用Pandas进行数据处理',
          completed: true
        },
        {
          id: 3,
          title: '数据清洗与预处理',
          description: '学习数据清洗和预处理技术',
          completed: true
        },
        {
          id: 4,
          title: '数据可视化',
          description: '学习使用Matplotlib和Seaborn进行数据可视化',
          completed: false
        },
        {
          id: 5,
          title: '统计分析方法',
          description: '学习基本的统计分析方法',
          completed: false
        },
        {
          id: 6,
          title: '实战项目案例',
          description: '完成一个完整的数据分析项目',
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: '数据采集与处理',
      description: '网络数据采集技术和数据预处理方法',
      icon: '🔍',
      progress: 40,
      detailedContent: `
## 课程介绍
学习网络数据采集技术，掌握数据清洗和预处理方法。

## 主要内容
- HTTP协议基础
- Requests库使用
- BeautifulSoup网页解析
- 正则表达式
- 数据清洗技巧
- 缺失值处理
- 数据标准化

## 学习目标
能够从各种数据源采集数据，并进行有效的预处理。
      `,
      lessons: [
        {
          id: 1,
          title: 'HTTP协议基础',
          description: '学习HTTP协议的基本原理',
          completed: true
        },
        {
          id: 2,
          title: 'Requests库使用',
          description: '学习使用Requests库发送HTTP请求',
          completed: true
        },
        {
          id: 3,
          title: 'BeautifulSoup网页解析',
          description: '学习使用BeautifulSoup解析网页',
          completed: false
        },
        {
          id: 4,
          title: '正则表达式',
          description: '学习正则表达式的使用',
          completed: false
        },
        {
          id: 5,
          title: '数据清洗技巧',
          description: '学习数据清洗的各种技巧',
          completed: false
        },
        {
          id: 6,
          title: '数据标准化',
          description: '学习数据标准化方法',
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: '供应链数据分析',
      description: '供应链管理中的数据分析方法和应用',
      icon: '📦',
      progress: 25,
      detailedContent: `
## 课程介绍
将数据分析技术应用于供应链管理，优化供应链流程。

## 主要内容
- 供应链管理基础
- 需求预测方法
- 库存优化分析
- 供应商绩效评估
- 物流路径优化
- 供应链风险分析

## 学习目标
能够运用数据分析方法解决供应链实际问题。
      `,
      lessons: [
        {
          id: 1,
          title: '供应链管理基础',
          description: '学习供应链管理的基本概念',
          completed: true
        },
        {
          id: 2,
          title: '需求预测方法',
          description: '学习需求预测的各种方法',
          completed: false
        },
        {
          id: 3,
          title: '库存优化分析',
          description: '学习库存优化的分析方法',
          completed: false
        },
        {
          id: 4,
          title: '供应商绩效评估',
          description: '学习供应商绩效评估的方法',
          completed: false
        },
        {
          id: 5,
          title: '物流路径优化',
          description: '学习物流路径优化的方法',
          completed: false
        },
        {
          id: 6,
          title: '供应链风险分析',
          description: '学习供应链风险分析的方法',
          completed: false
        }
      ]
    },
    {
      id: 5,
      title: '数据库原理与应用',
      description: '数据库设计、SQL语言和数据库管理系统',
      icon: '💾',
      progress: 60,
      detailedContent: `
## 课程介绍
系统学习数据库原理，掌握SQL语言和数据库应用开发。

## 主要内容
- 数据库系统概述
- 关系数据库理论
- SQL语言（DDL、DML、DQL）
- 数据库设计
- 索引优化
- 事务处理

## 学习目标
掌握数据库设计方法，能够熟练使用SQL进行数据操作。
      `,
      lessons: [
        {
          id: 1,
          title: '数据库系统概述',
          description: '学习数据库系统的基本概念',
          completed: true
        },
        {
          id: 2,
          title: '关系数据库理论',
          description: '学习关系数据库的基本理论',
          completed: true
        },
        {
          id: 3,
          title: 'SQL语言基础',
          description: '学习SQL语言的基本语法',
          completed: true
        },
        {
          id: 4,
          title: '数据库设计',
          description: '学习数据库设计的方法',
          completed: false
        },
        {
          id: 5,
          title: '索引优化',
          description: '学习数据库索引优化的方法',
          completed: false
        },
        {
          id: 6,
          title: '事务处理',
          description: '学习数据库事务处理的方法',
          completed: false
        }
      ]
    }
  ];

  const course = courses.find(c => c.id === parseInt(id || '0'));

  if (!course) {
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
            <div className="text-6xl mb-4">{course.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-100">{course.description}</p>
          </div>

          <div className="p-8">
            {/* 学习进度 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">学习进度</h3>
                <span className="text-blue-600 font-medium">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            {/* 课程内容 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">课程内容</h3>
              <div className="space-y-3">
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      {lesson.completed ? (
                        <span className="text-green-500 text-sm">✓</span>
                      ) : (
                        <span className="text-gray-400 text-sm">{lesson.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <span className="text-green-500 text-sm font-medium">已完成</span>
                      ) : (
                        <span className="text-gray-400 text-sm">未完成</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 课程详细介绍 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">课程介绍</h3>
              <div className="prose prose-blue max-w-none">
                {course.detailedContent?.split('\n').map((line, index) => {
                  if (line.trim().startsWith('## ')) {
                    return (
                      <h4 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
                        {line.trim().replace('## ', '')}
                      </h4>
                    );
                  } else if (line.trim().startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-600 mb-2">
                        {line.trim().replace('- ', '')}
                      </li>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={index} className="text-gray-600 mb-3">
                        {line.trim()}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
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
