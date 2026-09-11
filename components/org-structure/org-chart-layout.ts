import dagre from 'dagre'
import type { Edge, Node } from 'reactflow'
import type { Department } from '@/types/departments'
import type { DepartmentNodeData } from './department-node'

export function buildGraph(
  departments: Department[],
  selectedId: number | null,
  onSelect: (dept: Department) => void,
  onAddChild: (id: string) => void,
): { nodes: Node[]; edges: Edge[] } {
  if (departments.length === 0) return { nodes: [], edges: [] }

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 120, ranker: 'tight-tree' })

  const nodeWidth = 220
  const nodeHeight = 140

  departments.forEach((dept) => {
    dagreGraph.setNode(String(dept.id), { width: nodeWidth, height: nodeHeight })
  })

  const edges: Edge[] = departments
    .filter((dept) => dept.parent_id !== 0 && dept.parent_id != null)
    .map((dept) => {
      dagreGraph.setEdge(String(dept.parent_id), String(dept.id))
      const isActive = dept.id === selectedId || dept.parent_id === selectedId
      return {
        id: `e${dept.parent_id}-${dept.id}`,
        source: String(dept.parent_id),
        target: String(dept.id),
        type: 'smoothstep',
        animated: isActive,
        style: {
          stroke: isActive ? 'var(--brand-accent)' : 'var(--app-surface-3)',
          strokeWidth: isActive ? 2 : 1.5,
          strokeDasharray: isActive ? '4 3' : undefined,
        },
      }
    })

  dagre.layout(dagreGraph)

  const nodes: Node[] = departments.map((dept) => {
    const pos = dagreGraph.node(String(dept.id))
    const childCount = departments.filter((d) => d.parent_id === dept.id).length
    return {
      id: String(dept.id),
      type: 'department',
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
      data: {
        dept,
        isSelected: dept.id === selectedId,
        childCount,
        onSelect,
        onAddChild: () => onAddChild(String(dept.id)),
      } satisfies DepartmentNodeData,
    }
  })

  return { nodes, edges }
}
