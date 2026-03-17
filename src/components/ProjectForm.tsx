import { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProjectFormProps = {
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
};

type LinkInput = {
  url: string;
  label: string;
};

export default function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image_url || null);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'idea' as const,
    is_public: project?.is_public ?? false,
  });

  const [tagsInput, setTagsInput] = useState('');
  const [links, setLinks] = useState<LinkInput[]>([]);

  useEffect(() => {
    if (project) {
      loadProjectData();
    }
  }, [project]);

  const loadProjectData = async () => {
    if (!project) return;

    const { data: projectTags } = await supabase
      .from('project_tags')
      .select('tags(name)')
      .eq('project_id', project.id);

    if (projectTags) {
      const tagNames = projectTags.map((pt: { tags: { name: string } }) => pt.tags.name);
      setTagsInput(tagNames.join(', '));
    }

    const { data: projectLinks } = await supabase
      .from('project_links')
      .select('*')
      .eq('project_id', project.id);

    if (projectLinks) {
      setLinks(projectLinks.map(l => ({ url: l.url, label: l.label })));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile || !user) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let imageUrl = project?.image_url || null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      let projectId = project?.id;

      if (project) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            is_public: formData.is_public,
            image_url: imageUrl,
          })
          .eq('id', project.id);

        if (updateError) throw updateError;
      } else {
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            is_public: formData.is_public,
            image_url: imageUrl,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      }

      if (projectId) {
        await supabase
          .from('project_tags')
          .delete()
          .eq('project_id', projectId);

        const tagNames = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

        for (const tagName of tagNames) {
          const { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .maybeSingle();

          let tagId = existingTag?.id;

          if (!tagId) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({ name: tagName })
              .select()
              .single();

            if (tagError) throw tagError;
            tagId = newTag.id;
          }

          await supabase
            .from('project_tags')
            .insert({ project_id: projectId, tag_id: tagId });
        }

        await supabase
          .from('project_links')
          .delete()
          .eq('project_id', projectId);

        const validLinks = links.filter(l => l.url.trim() && l.label.trim());
        if (validLinks.length > 0) {
          await supabase
            .from('project_links')
            .insert(
              validLinks.map(l => ({
                project_id: projectId,
                url: l.url,
                label: l.label,
              }))
            );
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { url: '', label: '' }]);
  };

  const updateLink = (index: number, field: 'url' | 'label', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[120px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="idea">Idea</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
              <option value="pausado">Pausado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="diseño, tecnología, arte"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Imagen
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Subir imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Links
              </label>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-4 h-4" />
                Agregar link
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Etiqueta"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
            />
            <label htmlFor="is_public" className="text-sm font-medium text-slate-700">
              Hacer público (visible en el mapa)
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : project ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
