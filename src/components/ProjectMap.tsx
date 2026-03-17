import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase, Project } from '../lib/supabase';
import ProjectNode from './ProjectNode';

const nodeTypes = {
  projectNode: ProjectNode,
};

type ProjectMapProps = {
  onProjectClick: (project: Project) => void;
};

export default function ProjectMap({ onProjectClick }: ProjectMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles(username, avatar_url)
      `)
      .eq('is_public', true);

    if (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
      return;
    }

    if (!projects || projects.length === 0) {
      setLoading(false);
      return;
    }

    const { data: projectTags } = await supabase
      .from('project_tags')
      .select('project_id, tag_id, tags(name)')
      .in('project_id', projects.map(p => p.id));

    const projectTagsMap = new Map<string, string[]>();
    projectTags?.forEach((pt: { project_id: string; tags: { name: string } }) => {
      if (!projectTagsMap.has(pt.project_id)) {
        projectTagsMap.set(pt.project_id, []);
      }
      projectTagsMap.get(pt.project_id)?.push(pt.tags.name);
    });

    const tagToProjects = new Map<string, string[]>();
    projectTagsMap.forEach((tags, projectId) => {
      tags.forEach(tag => {
        if (!tagToProjects.has(tag)) {
          tagToProjects.set(tag, []);
        }
        tagToProjects.get(tag)?.push(projectId);
      });
    });

    const angleStep = (2 * Math.PI) / projects.length;
    const radius = Math.max(300, projects.length * 40);

    const newNodes: Node[] = projects.map((project, index) => {
      const angle = index * angleStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        id: project.id,
        type: 'projectNode',
        position: { x, y },
        data: {
          project: {
            ...project,
            tags: projectTagsMap.get(project.id) || [],
          },
          onClick: () => onProjectClick(project),
        },
      };
    });

    const newEdges: Edge[] = [];
    const addedEdges = new Set<string>();

    tagToProjects.forEach((projectIds) => {
      if (projectIds.length > 1) {
        for (let i = 0; i < projectIds.length; i++) {
          for (let j = i + 1; j < projectIds.length; j++) {
            const edgeId1 = `${projectIds[i]}-${projectIds[j]}`;
            const edgeId2 = `${projectIds[j]}-${projectIds[i]}`;

            if (!addedEdges.has(edgeId1) && !addedEdges.has(edgeId2)) {
              newEdges.push({
                id: edgeId1,
                source: projectIds[i],
                target: projectIds[j],
                type: 'straight',
                style: { stroke: '#64748b', strokeWidth: 1, opacity: 0.3 },
                markerEnd: {
                  type: MarkerType.Arrow,
                  width: 15,
                  height: 15,
                  color: '#64748b',
                },
              });
              addedEdges.add(edgeId1);
            }
          }
        }
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setLoading(false);
  }, [onProjectClick]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando proyectos...</p>
          </div>
        </div>
      ) : nodes.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-xl text-slate-600 mb-2">No hay proyectos públicos todavía</p>
            <p className="text-slate-500">Crea tu primer proyecto y hazlo público</p>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
}
