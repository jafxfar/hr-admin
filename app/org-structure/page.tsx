'use client'

import { useEffect, useState } from 'react'
import { HRLayout } from '@/components/hr-layout'
import { OrgFlowInner } from '@/components/org-structure'
import { useDepartmentsTree } from '@/hooks/use-departments'
import { flattenTree, findBranchInTree } from '@/lib/org-structure-utils'
import { ReactFlowProvider } from 'reactflow'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useBranchesList, useBranchesTree } from '@/hooks/use-branches'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { HeaderFilterSelect } from '@/components/hr-header-controls'

export default function OrgStructurePage() {
  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { data: branchesData } = useBranchesList('', 1, 100, false, branchesEnabled)
  const branches = branchesData?.items ?? []

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  useEffect(() => {
    if (!branchesEnabled || branches.length === 0) return
    if (selectedBranchId != null && branches.some((b) => b.id === selectedBranchId)) return
    setSelectedBranchId(branches[0].id)
  }, [branchesEnabled, branches, selectedBranchId])

  const treeEnabled = !branchesEnabled || selectedBranchId != null
  const { data: departmentsTreeData, isLoading: isDepartmentsTreeLoading } = useDepartmentsTree(
    undefined,
    treeEnabled && !branchesEnabled,
  )
  const { data: branchesTreeData, isLoading: isBranchesTreeLoading } = useBranchesTree(
    treeEnabled && branchesEnabled,
  )

  const departments = branchesEnabled
    ? flattenTree(
        findBranchInTree(branchesTreeData ?? [], selectedBranchId ?? -1)?.departments ?? [],
      )
    : departmentsTreeData
      ? flattenTree(departmentsTreeData)
      : []

  const isLoading = branchesEnabled ? isBranchesTreeLoading : isDepartmentsTreeLoading

  return (
    <HRLayout
      title="Орг. структура"
      topActions={
        branchesEnabled ? (
          <Select
            value={selectedBranchId != null ? String(selectedBranchId) : undefined}
            onValueChange={(value) => setSelectedBranchId(Number(value))}
          >
            <HeaderFilterSelect active className="w-52">
              <SelectValue placeholder="Филиал" />
            </HeaderFilterSelect>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : undefined
      }
    >
      <div
        className="mt-2 w-full overflow-hidden rounded-3xl bg-app-surface-0"
        style={{ height: 'calc(100vh - 120px)' }}
        data-marketing="org"
      >
        {isLoading || (branchesEnabled && selectedBranchId == null) ? (
          <div className="flex h-full items-center justify-center text-sm text-app-text-muted">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
              <span>Загрузка структуры...</span>
            </div>
          </div>
        ) : departments.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-app-text-muted">
            Нет отделов
          </div>
        ) : (
          <ReactFlowProvider>
            <OrgFlowInner
              treeData={departments}
              defaultBranchId={branchesEnabled ? selectedBranchId ?? undefined : undefined}
            />
          </ReactFlowProvider>
        )}
      </div>
    </HRLayout>
  )
}
