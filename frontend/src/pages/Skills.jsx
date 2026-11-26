import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, GraduationCap, Zap } from 'lucide-react';
import skillService from '../services/skillService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const SUGGESTED_SKILLS = {
  TEACH: ['Java', 'Python', 'JavaScript', 'React', 'HTML', 'CSS', 'C++', 'C', 'SQL', 'Spring Boot', 'Node.js', 'TypeScript', 'MongoDB', 'MySQL', 'Git', 'Docker', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Figma'],
  LEARN: ['Java', 'Python', 'JavaScript', 'React', 'HTML', 'CSS', 'C++', 'C', 'SQL', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Web Development', 'Android Dev', 'Flutter', 'Kotlin', 'Swift', 'DevOps', 'Cloud Computing', 'Blockchain'],
};

const CATEGORIES = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Database', 'DevOps', 'Other'];
const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AddSkillForm = ({ type, onAdd, loading: addLoading }) => {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('');
  const [error, setError] = useState('');

  const handleSuggest = (name) => {
    setSkillName(name);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) { setError('Skill name is required'); return; }
    if (skillName.trim().length > 100) { setError('Skill name must be under 100 characters'); return; }
    await onAdd({ skillName: skillName.trim(), category: category || undefined, skillType: type, proficiencyLevel: proficiencyLevel || undefined });
    setSkillName('');
    setCategory('');
    setProficiencyLevel('');
    setError('');
  };

  const isTeach = type === 'TEACH';
  const color = isTeach ? 'emerald' : 'blue';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={skillName}
          onChange={(e) => { setSkillName(e.target.value); setError(''); }}
          placeholder={`e.g. ${isTeach ? 'Java, Python, React' : 'Machine Learning, UI/UX'}`}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 ${error ? 'border-red-300 focus:ring-red-200' : `border-gray-200 focus:ring-${color}-100 focus:border-${color}-400`}`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 text-gray-600"
        >
          <option value="">Category (optional)</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={proficiencyLevel}
          onChange={(e) => setProficiencyLevel(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 text-gray-600"
        >
          <option value="">Proficiency (optional)</option>
          {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-xs text-gray-400 mb-1.5">Quick select:</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS[type].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggest(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                skillName === s
                  ? isTeach ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={addLoading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isTeach
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-60`}
      >
        {addLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
        Add {isTeach ? 'Teaching' : 'Learning'} Skill
      </button>
    </form>
  );
};

const SkillSection = ({ title, type, skills, onAdd, onDelete, adding, icon: Icon, color }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div className={`bg-white rounded-2xl border-2 ${color === 'emerald' ? 'border-emerald-100' : 'border-blue-100'} shadow-sm`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b ${color === 'emerald' ? 'border-emerald-50 bg-emerald-50/50' : 'border-blue-50 bg-blue-50/50'} rounded-t-2xl`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
            <Icon size={18} className={color === 'emerald' ? 'text-emerald-600' : 'text-blue-600'} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{skills.length} skill{skills.length !== 1 ? 's' : ''} added</p>
          </div>
        </div>
      </div>

      {/* Add form */}
      <div className="p-6 border-b border-gray-100">
        <AddSkillForm type={type} onAdd={onAdd} loading={adding} />
      </div>

      {/* Skills list */}
      <div className="p-6">
        {skills.length === 0 ? (
          <div className="text-center py-6">
            <Zap size={28} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No skills added yet</p>
            <p className="text-xs text-gray-300 mt-1">Add your first skill above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-2 flex-wrap">
                  <SkillTag name={skill.skillName} />
                  {skill.proficiencyLevel && (
                    <span className="text-xs text-gray-400">{skill.proficiencyLevel}</span>
                  )}
                  {skill.category && (
                    <span className="text-xs text-gray-300">· {skill.category}</span>
                  )}
                </div>
                <button
                  onClick={() => setConfirmDelete(skill)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 flex-shrink-0"
                  title="Remove skill"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Remove Skill"
        message={`Remove "${confirmDelete?.skillName}" from your ${title.toLowerCase()}? This cannot be undone.`}
        confirmText="Remove"
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

const Skills = () => {
  const { toasts, removeToast, toast } = useToast();
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTeach, setAddingTeach] = useState(false);
  const [addingLearn, setAddingLearn] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const [teachRes, learnRes] = await Promise.all([
        skillService.getMyStudentSkills('TEACH'),
        skillService.getMyStudentSkills('LEARN'),
      ]);
      setTeachingSkills(teachRes.data || []);
      setLearningSkills(learnRes.data || []);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleAddTeach = async (data) => {
    setAddingTeach(true);
    try {
      const res = await skillService.addStudentSkill(data);
      setTeachingSkills((prev) => [...prev, res.data]);
      toast.success(`"${data.skillName}" added to teaching skills!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingTeach(false);
    }
  };

  const handleAddLearn = async (data) => {
    setAddingLearn(true);
    try {
      const res = await skillService.addStudentSkill(data);
      setLearningSkills((prev) => [...prev, res.data]);
      toast.success(`"${data.skillName}" added to learning skills!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingLearn(false);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await skillService.deleteStudentSkill(id);
      if (type === 'TEACH') setTeachingSkills((prev) => prev.filter((s) => s.id !== id));
      else setLearningSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success('Skill removed successfully');
    } catch {
      toast.error('Failed to remove skill');
    }
  };

  if (loading) {
    return <div className="w-full p-6"><Loading text="Loading skills…" /></div>;
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the skills you teach and want to learn</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SkillSection
          title="Skills I Can Teach"
          type="TEACH"
          skills={teachingSkills}
          onAdd={handleAddTeach}
          onDelete={(id) => handleDelete(id, 'TEACH')}
          adding={addingTeach}
          icon={BookOpen}
          color="emerald"
        />
        <SkillSection
          title="Skills I Want to Learn"
          type="LEARN"
          skills={learningSkills}
          onAdd={handleAddLearn}
          onDelete={(id) => handleDelete(id, 'LEARN')}
          adding={addingLearn}
          icon={GraduationCap}
          color="blue"
        />
      </div>
      </div>
    </div>
  );
};

export default Skills;

