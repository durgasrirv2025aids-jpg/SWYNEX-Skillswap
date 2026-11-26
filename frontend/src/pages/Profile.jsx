import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, BookOpen, Edit3, Save, X, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import skillService from '../services/skillService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toasts, removeToast, toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, teachRes, learnRes] = await Promise.all([
        studentService.getMyProfile(),
        skillService.getMyStudentSkills('TEACH'),
        skillService.getMyStudentSkills('LEARN'),
      ]);
      setProfile(profileRes.data);
      setTeachingSkills(teachRes.data || []);
      setLearningSkills(learnRes.data || []);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const startEdit = () => {
    setForm({
      fullName: profile?.fullName || '',
      collegeName: profile?.collegeName || '',
      department: profile?.department || '',
      yearOfStudy: profile?.yearOfStudy || '',
      bio: profile?.bio || '',
    });
    setErrors({});
    setEditing(true);
  };

  const validate = () => {
    const e = {};
    if (!form.fullName?.trim() || form.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters';
    if (form.yearOfStudy && (Number(form.yearOfStudy) < 1 || Number(form.yearOfStudy) > 10)) e.yearOfStudy = 'Year must be 1–10';
    if (form.bio && form.bio.length > 1000) e.bio = 'Bio must be under 1000 characters';
    return e;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        collegeName: form.collegeName.trim() || undefined,
        department: form.department.trim() || undefined,
        yearOfStudy: form.yearOfStudy ? Number(form.yearOfStudy) : undefined,
        bio: form.bio.trim() || undefined,
      };
      const res = await studentService.updateMyProfile(payload);
      setProfile(res.data);
      setUser((prev) => ({ ...prev, fullName: res.data.fullName }));
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, fullName: res.data.fullName }));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl">
        <Loading text="Loading profile…" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">View and update your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {getInitials(profile?.fullName)}
            </div>
            <h2 className="font-bold text-gray-900 text-xl">{profile?.fullName}</h2>
            <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
            {profile?.department && (
              <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
                <BookOpen size={14} className="text-blue-500" /> {profile.department}
              </p>
            )}
            {profile?.collegeName && (
              <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                <GraduationCap size={14} /> {profile.collegeName}
              </p>
            )}
            {profile?.yearOfStudy && (
              <p className="text-xs text-gray-400 mt-1">Year {profile.yearOfStudy}</p>
            )}
            <div className="flex justify-center gap-6 mt-5 pt-5 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-900">{teachingSkills.length}</div>
                <div className="text-xs text-gray-400">Teaching</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">{learningSkills.length}</div>
                <div className="text-xs text-gray-400">Learning</div>
              </div>
            </div>
            {!editing && (
              <button
                onClick={startEdit}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                <Edit3 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile details / edit form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
              {editing && (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setErrors({}); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60">
                    {saving ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    Save
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                {[
                  { name: 'fullName', label: 'Full Name', placeholder: 'Your full name' },
                  { name: 'collegeName', label: 'College Name', placeholder: 'Your college' },
                  { name: 'department', label: 'Department', placeholder: 'e.g. Computer Science' },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={form[name]}
                      onChange={(e) => { setForm({ ...form, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: '' }); }}
                      placeholder={placeholder}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 ${errors[name] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'}`}
                    />
                    {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year of Study</label>
                  <select
                    value={form.yearOfStudy}
                    onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  >
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                  {errors.yearOfStudy && <p className="text-xs text-red-500 mt-1">{errors.yearOfStudy}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => { setForm({ ...form, bio: e.target.value }); if (errors.bio) setErrors({ ...errors, bio: '' }); }}
                    placeholder="Tell other students about yourself…"
                    rows={4}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 resize-none ${errors.bio ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'}`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio ? <p className="text-xs text-red-500">{errors.bio}</p> : <span />}
                    <span className="text-xs text-gray-400">{form.bio?.length || 0}/1000</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Full Name', value: profile?.fullName, icon: User },
                  { label: 'Email', value: profile?.email, icon: Mail },
                  { label: 'College', value: profile?.collegeName, icon: GraduationCap },
                  { label: 'Department', value: profile?.department, icon: BookOpen },
                  { label: 'Year of Study', value: profile?.yearOfStudy ? `Year ${profile.yearOfStudy}` : null, icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  value ? (
                    <div key={label} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={15} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-sm text-gray-900 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ) : null
                ))}
                {profile?.bio && (
                  <div className="py-3">
                    <p className="text-xs text-gray-400 font-medium mb-2">Bio</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Skills</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <BookOpen size={12} className="text-emerald-500" /> Can Teach ({teachingSkills.length})
                </p>
                {teachingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {teachingSkills.map((s) => <SkillTag key={s.id} name={s.skillName} />)}
                  </div>
                ) : <p className="text-sm text-gray-400 italic">No teaching skills yet</p>}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <GraduationCap size={12} className="text-blue-500" /> Want to Learn ({learningSkills.length})
                </p>
                {learningSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {learningSkills.map((s) => <SkillTag key={s.id} name={s.skillName} />)}
                  </div>
                ) : <p className="text-sm text-gray-400 italic">No learning skills yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
