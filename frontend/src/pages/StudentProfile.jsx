import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, GraduationCap, BookOpen, User, Calendar, Send } from 'lucide-react';
import studentService from '../services/studentService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';

const StudentProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await studentService.getStudentById(id);
        setProfile(res.data);
      } catch (err) {
        setError('Student profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return <div className="p-6"><Loading text="Loading profile…" /></div>;

  if (error) return (
    <div className="p-6 max-w-2xl">
      <Link to="/find-partners" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft size={16} /> Back</Link>
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <User size={36} className="text-gray-200 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700">{error}</h3>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
      <Link to="/find-partners" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Find Partners
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center sticky top-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {getInitials(profile?.fullName)}
            </div>
            <h2 className="font-bold text-gray-900 text-xl">{profile?.fullName}</h2>
            {profile?.email && <p className="text-gray-500 text-sm mt-1">{profile.email}</p>}
            {profile?.department && (
              <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
                <BookOpen size={14} className="text-blue-500" /> {profile.department}
              </p>
            )}
            {profile?.collegeName && (
              <p className="text-sm text-gray-500 mt-1">{profile.collegeName}</p>
            )}
            {profile?.yearOfStudy && (
              <p className="text-xs text-gray-400 mt-1">Year {profile.yearOfStudy}</p>
            )}

            <div className="flex justify-center gap-6 mt-5 pt-5 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-900">{profile?.teachingSkills?.length || 0}</div>
                <div className="text-xs text-gray-400">Teaching</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{profile?.learningSkills?.length || 0}</div>
                <div className="text-xs text-gray-400">Learning</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{profile?.connectionCount || 0}</div>
                <div className="text-xs text-gray-400">Connections</div>
              </div>
            </div>

            <Link
              to="/find-partners"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              <Send size={15} /> Send Request
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          {profile?.bio && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-500" /> Skills They Can Teach
            </h3>
            {profile?.teachingSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.teachingSkills.map((s) => (
                  <div key={s.id} className="flex flex-col items-start">
                    <SkillTag name={s.skillName} />
                    {s.proficiencyLevel && <span className="text-xs text-gray-400 mt-0.5 ml-1">{s.proficiencyLevel}</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 italic">No teaching skills listed</p>}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-500" /> Skills They Want to Learn
            </h3>
            {profile?.learningSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.learningSkills.map((s) => <SkillTag key={s.id} name={s.skillName} />)}
              </div>
            ) : <p className="text-sm text-gray-400 italic">No learning skills listed</p>}
          </div>

          {profile?.createdAt && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5 px-1">
              <Calendar size={12} /> Member since {formatDate(profile.createdAt)}
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default StudentProfile;

