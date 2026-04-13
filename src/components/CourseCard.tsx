import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="text-4xl mb-4">{course.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600">{course.description}</p>
      </div>
      <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
        <button 
          onClick={handleViewDetail}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
        >
          查看详情 →
        </button>
      </div>
    </div>
  );
};

export default CourseCard;