'use client'

import { Crosshair, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { Department } from '@/types/departments'
import { nodeTypes } from './department-node'
import { buildGraph } from './org-chart-layout'
import { DepartmentDetailPanel } from './department-detail-panel'
import { CreateDepartmentModal } from './create-department-modal'

export function OrgFlowInner({
  treeData,
  defaultBranchId,
}: {
  treeData: Department[]
  defaultBranchId?: number
}) {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)
  const [modalParentId, setModalParentId] = useState<number | null>(null)

  const handleSelect = useCallback((dept: Department) => {
    setSelectedDept((prev) => (prev?.id === dept.id ? null : dept))
  }, [])

  const handleAddChild = useCallback((id: string) => {
    setModalParentId(Number(id))
  }, [])

  useEffect(() => {
    setSelectedDept(null)
  }, [treeData])

  useEffect(() => {
    if (!treeData || treeData.length === 0) {
      setNodes([])
      setEdges([])
      return
    }
    const { nodes: n, edges: e } = buildGraph(treeData, selectedDept?.id ?? null, handleSelect, handleAddChild)
    setNodes(n)
    setEdges(e)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, selectedDept?.id])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="relative w-full h-full bg-app-surface-0 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--app-text)" gap={24} size={1} style={{ opacity: 0.25 }} />
      </ReactFlow>

      {/* Custom zoom controls */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-30">
        <div className="flex flex-col bg-[#1e1e1e] rounded-full p-1 shadow-2xl border border-app-surface-3">
          <button
            onClick={() => zoomIn()}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-app-surface-3 text-brand-accent transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px w-6 mx-auto bg-app-surface-3" />
          <button
            onClick={() => zoomOut()}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-app-surface-3 text-app-text-muted transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => fitView({ padding: 0.4, duration: 500 })}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1e1e1e] hover:bg-app-surface-3 text-app-text-muted transition-all shadow-2xl border border-app-surface-3"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Department detail panel */}
      {selectedDept && (
        <DepartmentDetailPanel
          dept={selectedDept}
          allDepts={treeData}
          onClose={() => setSelectedDept(null)}
        />
      )}

      {/* Create modal */}
      {modalParentId !== null && (
        <CreateDepartmentModal
          parentId={modalParentId}
          defaultBranchId={defaultBranchId}
          onClose={() => setModalParentId(null)}
        />
      )}
    </div>
  )
}
