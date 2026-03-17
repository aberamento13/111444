import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Project } from '../lib/supabase';

type ProjectNodeData = {
  project: Project & { tags?: string[] };
  onClick: () => void;
};

function ProjectNode({ data }: { data: ProjectNodeData }) {
  const { project, onClick } = data;

  const statusColors = {
    idea: 'bg-blue-100 text-blue-800 border-blue-300',
    en_progreso: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    completado: 'bg-green-100 text-green-800 border-green-300',
    pausado: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const statusLabels = {
    idea: 'Idea',
    en_progreso: 'En Progreso',
    completado: 'Completado',
    pausado: 'Pausado',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg border-2 border-slate-200 hover:border-slate-400 transition-all cursor-pointer w-64 overflow-hidden"
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

      {project.image_url && (
        <div className="h-32 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-900 text-sm leading-tight flex-1">
            {project.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[project.status]} ml-2 whitespace-nowrap`}>
            {statusLabels[project.status]}
          </span>
        </div>

        <p className="text-slate-600 text-xs mb-3 line-clamp-2">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-slate-500">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {project.profiles && (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            {project.profiles.avatar_url && (
              <img
                src={project.profiles.avatar_url}
                alt={project.profiles.username}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span>@{project.profiles.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectNode);
