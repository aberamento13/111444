import { useEffect, useState } from 'react';
import { X, CreditCard as Edit, Trash2, ExternalLink, MessageCircle, Send, User } from 'lucide-react';
import { supabase, Project, Comment, ProjectLink } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProjectDetailProps = {
  project: Project;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onUserClick: (username: string) => void;
};

export default function ProjectDetail({
  project,
  onClose,
  onEdit,
  onDelete,
  onUserClick,
}: ProjectDetailProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user && user.id === project.user_id;

  useEffect(() => {
    loadProjectData();
  }, [project.id]);

  const loadProjectData = async () => {
    setLoading(true);

    const [commentsRes, linksRes, tagsRes] = await Promise.all([
      supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_links')
        .select('*')
        .eq('project_id', project.id),
      supabase
        .from('project_tags')
        .select('tags(name)')
        .eq('project_id', project.id),
    ]);

    if (commentsRes.data) setComments(commentsRes.data);
    if (linksRes.data) setLinks(linksRes.data);
    if (tagsRes.data) {
      setTags(tagsRes.data.map((pt: { tags: { name: string } }) => pt.tags.name));
    }

    setLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: project.id,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select('*, profiles(username, avatar_url)')
      .single();

    if (!error && data) {
      setComments([data, ...comments]);
      setNewComment('');
    }

    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  const handleDeleteProject = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      onDelete(project.id);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Detalle del Proyecto</h2>
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {project.image_url && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <h3 className="text-3xl font-bold text-slate-900">{project.title}</h3>
            <span className={`text-sm px-3 py-1 rounded-full ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>

          {project.profiles && (
            <button
              onClick={() => onUserClick(project.profiles.username)}
              className="flex items-center gap-2 mb-6 hover:bg-slate-50 p-2 rounded-lg -ml-2 transition-colors"
            >
              {project.profiles.avatar_url ? (
                <img
                  src={project.profiles.avatar_url}
                  alt={project.profiles.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
              <span className="text-slate-700">@{project.profiles.username}</span>
            </button>
          )}

          <p className="text-slate-700 text-lg mb-6 whitespace-pre-wrap">
            {project.description}
          </p>

          {tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Links</h4>
              <div className="space-y-2">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-slate-600" />
              <h4 className="text-lg font-semibold text-slate-900">
                Comentarios ({comments.length})
              </h4>
            </div>

            {project.is_public && user && (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No hay comentarios todavía
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => comment.profiles && onUserClick(comment.profiles.username)}
                        className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded transition-colors -ml-1"
                      >
                        {comment.profiles?.avatar_url ? (
                          <img
                            src={comment.profiles.avatar_url}
                            alt={comment.profiles.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                        <span className="font-medium text-slate-900">
                          @{comment.profiles?.username}
                        </span>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        {user && user.id === comment.user_id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
