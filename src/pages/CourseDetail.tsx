import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
  detailedContent?: string;
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
      `
    },
    {
      id: 2,
      title: '数据分析技术',
      description: '使用Python进行数据清洗、分析和可视化',
      icon: '📊',
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
      `
    },
    {
      id: 3,
      title: '数据采集与处理',
      description: '网络数据采集技术和数据预处理方法',
      icon: '🔍',
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
      `
    },
    {
      id: 4,
      title: '供应链数据分析',
      description: '供应链管理中的数据分析方法和应用',
      icon: '📦',
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
      `
    },
    {
      id: 5,
      title: '数据库原理与应用',
      description: '数据库设计、SQL语言和数据库管理系统',
      icon: '💾',
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
      `
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
            <div className="prose prose-blue max-w-none">
              {course.detailedContent?.split('\n').map((line, index) => {
                if (line.trim().startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                      {line.trim().replace('## ', '')}
                    </h2>
                  );
                } else if (line.trim().startsWith('- ')) {
                  return (
                    <li key={index} className="text-gray-600 mb-2">
                      {line.trim().replace('- ', '')}
                    </li>
                  );
                } else if (line.trim()) {
                  return (
                    <p key={index} className="text-gray-600 mb-4">
                      {line.trim()}
                    </p>
                  );
                }
                return null;
              })}
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
