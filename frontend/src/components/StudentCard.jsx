import React from 'react';
import { User, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import SkillTag from './SkillTag';
import { Link } from 'react-router-dom';

const StudentCard = ({ student, onSendRequest, requestStatus, showMatchBadge = false, action }) => {
  const teachingSkills = student.skillsYouTeachTheyLearn || student.teachingSkills || [];
  const learningSkills = student.skillsTheyTeachYouLearn || student.learningSkills || [];

  const getInitials = (name) =>
    (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ];
  const colorIndex = (student.studentId || student.id || 0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const statusBadge = {
    PENDING: { label: 'Request Sent', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    ACCEPTED: { label: 'Connected', cls: 'bg-green-100 text-green-700 border-green-200' },
    REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200' },
    CANCELLED: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {getInitials(student.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{student.fullName}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                {student.department && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <GraduationCap size={11} /> {student.department}
                  </span>
                )}
                {student.collegeName && (
                  <span className="text-xs text-gray-500 truncate max-w-[140px]">{student.collegeName}</span>
                )}
                {student.yearOfStudy && (
                  <span className="text-xs text-gray-400">Year {student.yearOfStudy}</span>
                )}
              </div>
            </div>
            {showMatchBadge && student.mutualMatch && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                ✦ Match
              </span>
            )}
          </div>

          {student.bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{student.bio}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 space-y-2">
        {teachingSkills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <BookOpen size={11} className="text-emerald-500" /> Can Teach
            </p>
            <div className="flex flex-wrap gap-1.5">
              {teachingSkills.slice(0, 4).map((s, i) => (
                <SkillTag key={i} name={typeof s === 'string' ? s : s.skillName} size="xs" />
              ))}
              {teachingSkills.length > 4 && (
                <span className="text-xs text-gray-400">+{teachingSkills.length - 4}</span>
              )}
            </div>
          </div>
        )}
        {learningSkills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <User size={11} className="text-blue-500" /> Wants to Learn
            </p>
            <div className="flex flex-wrap gap-1.5">
              {learningSkills.slice(0, 4).map((s, i) => (
                <SkillTag key={i} name={typeof s === 'string' ? s : s.skillName} size="xs" />
              ))}
              {learningSkills.length > 4 && (
                <span className="text-xs text-gray-400">+{learningSkills.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <Link
          to={`/students/${student.studentId || student.id}`}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
        >
          View Profile <ArrowRight size={12} />
        </Link>

        {requestStatus === 'PENDING' || requestStatus === 'ACCEPTED' ? (
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadge[requestStatus]?.cls || ''}`}>
            {statusBadge[requestStatus]?.label || requestStatus}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            {requestStatus && (
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadge[requestStatus]?.cls || ''}`}>
                {statusBadge[requestStatus]?.label || requestStatus}
              </span>
            )}
            {onSendRequest ? (
              <button
                onClick={() => onSendRequest(student)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Send Request
              </button>
            ) : action}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCard;

