import { useEffect, useState } from 'react';
import { X, CreditCard as Edit, Briefcase } from 'lucide-react';
import { supabase, Profile, Project } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type UserProfileProps = {
  username: string;
  onClose: () => void;
  onProjectClick: (project: Project) => void;
};

export default function UserProfile({ username, onClose, onProjectClick }: UserProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    bio: '',
  });

  const isOwnProfile = user && profile && user.id === profile.id;

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (profileError || !profileData) {
      console.error('Error loading profile:', profileError);
      setLoading(false);
      return;
    }

    setProfile(profileData);
    setEditData({
      full_name: profileData.full_name || '',
      bio: profileData.bio || '',
    });

    const query = supabase
      .from('projects')
      .select('*')
      .eq('user_id', profileData.id);

    if (!isOwnProfile) {
      query.eq('is_public', true);
    }

    const { data: projectsData } = await query;

    if (projectsData) {
      setProjects(projectsData);
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editData.full_name,
        bio: editData.bio,
      })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, ...editData });
      setEditMode(false);
    }
  };

  const statusColors = {
    idea: 'bg-blue-100 text-blue-800',
    en_progreso: 'bg-yellow-100 text-yellow-800',
    completado: 'bg-green-100 text-green-800',
    pausado: 'bg-slate-100 text-slate-800',
  };

  const statusLabels = {
    idea: 'Idea',
    en_progreso: 'En Progreso',
    completado: 'Completado',
    pausado: 'Pausado',
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-slate-900">Perfil no encontrado</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-600">
              {profile.username[0].toUpperCase()}
            </div>

            <div className="flex-1">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={editData.full_name}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Biografía
                    </label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {profile.full_name || profile.username}
                    </h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 mb-2">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-slate-700 mt-4">{profile.bio}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <h4 className="text-lg font-semibold text-slate-900">
                Proyectos ({projects.length})
              </h4>
            </div>

            {projects.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No hay proyectos {isOwnProfile ? '' : 'públicos'} todavía
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onProjectClick(project)}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {project.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-slate-900">{project.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                      {!project.is_public && isOwnProfile && (
                        <div className="mt-2">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            Privado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
