import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './components/Auth';
import ProjectMap from './components/ProjectMap';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';
import UserProfile from './components/UserProfile';
import { Project } from './lib/supabase';
import { Plus, LogOut, User, LayoutGrid } from 'lucide-react';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, profile, signOut } = useAuth();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
    setShowProjectDetail(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (!error) {
      setShowProjectDetail(false);
      setSelectedProject(null);
    }
  };

  const handleUserClick = (username: string) => {
    setSelectedUsername(username);
    setShowUserProfile(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleFormClose = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">NEMAPA</h1>
              <span className="text-slate-500 text-sm">Red social de proyectos creativos</span>
            </div>
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Ingresar / Registrarse
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ProjectMap onProjectClick={handleProjectClick} />
        </main>
        {showAuth && <Auth />}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">NEMAPA</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Proyecto
            </button>

            <button
              onClick={() => {
                setSelectedUsername(profile?.username || null);
                setShowUserProfile(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              title="Mi Perfil"
            >
              <User className="w-5 h-5" />
              {profile?.username}
            </button>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ProjectMap onProjectClick={handleProjectClick} />
      </main>

      {showProjectForm && (
        <ProjectForm
          project={editingProject || undefined}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showProjectDetail && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setShowProjectDetail(false)}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onUserClick={handleUserClick}
        />
      )}

      {showUserProfile && selectedUsername && (
        <UserProfile
          username={selectedUsername}
          onClose={() => setShowUserProfile(false)}
          onProjectClick={handleProjectClick}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
