'use client'

import type { RefObject, ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { DepartmentSelect } from '@/components/ui/department-select'
import { SectionHeader } from '@/components/custom-ui'
import { useDepartmentEmployeesAdmin } from '@/hooks/use-employees'
import { CreateDepartmentModal } from '@/components/departments/create-department-modal'
import { BranchCreateModal } from '@/components/branches/BranchModals'
import { RoleDialog } from '@/components/roles'
import { InlineSelect } from '../inline-select'
import { labelStyle, sectionCardStyle } from '../styles'
import { PositionChangePanel } from './position-change-panel'
import { usePositionSectionCreate } from '../use-position-section-create'

const fieldPlaceholderStyle = {
    height: 48,
    borderRadius: 24,
    background: 'var(--app-surface-1)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: 13,
} as const

const FieldPlaceholder = ({ children, muted }: { children: ReactNode; muted?: boolean }) => (
    <div style={{ ...fieldPlaceholderStyle, color: muted ? 'var(--app-text-muted)' : 'var(--app-border-accent)' }}>
        {children}
    </div>
)

export function PositionSection({
    hasPositionOrDepartmentChange,
    positionChangeBasisInputRef,
    positionChangeFileError,
    onBasisFile,
}: {
    hasPositionOrDepartmentChange: boolean
    positionChangeBasisInputRef: RefObject<HTMLInputElement | null>
    positionChangeFileError: string | null
    onBasisFile: (file: File) => void
}) {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()
    const departmentId = formData.department_id ?? null
    const positionId = formData.position_id ?? null
    const managerId = formData.manager_id ?? null

    const create = usePositionSectionCreate({
        departmentId,
        updateFormData,
    })

    const { data: deptEmployees, isFetching: managersFetching } = useDepartmentEmployeesAdmin(departmentId)

    const managerOptions = (deptEmployees?.items ?? []).map((emp) => ({
        value: String(emp.id),
        label:
            [emp.properties?.last_name, emp.properties?.first_name, emp.properties?.middle_name]
                .filter(Boolean)
                .join(' ') || `#${emp.id}`,
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
            <SectionHeader title="Позиция" description="Отдел, должность и непосредственный начальник сотрудника." />
            <div className="lg:col-span-2" style={{ ...sectionCardStyle, overflow: 'visible' }}>
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 128,
                            height: 128,
                            background: 'rgb(var(--theme-primary-rgb) / 0.04)',
                            filter: 'blur(40px)',
                            borderRadius: '50%',
                            marginTop: -32,
                            marginRight: -32,
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="md:col-span-2">
                        <label style={labelStyle}>
                            Отдел <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <DepartmentSelect
                            value={departmentId}
                            initialLabel={formData.department_name}
                            hasError={hasFieldError('department_id')}
                            onChange={(id, name) => {
                                clearFieldErrorFor('department_id')
                                updateFormData({
                                    department_id: id,
                                    department_name: name,
                                    position_id: undefined,
                                    branch_id: undefined,
                                    manager_id: undefined,
                                })
                            }}
                            onCreate={create.openCreateDepartment}
                            createLabel="Создать отдел"
                        />
                    </div>

                    {create.branchesEnabled ? (
                        <div className="md:col-span-2">
                            <label style={labelStyle}>
                                Филиал <span style={{ color: 'var(--brand-accent)' }}>*</span>
                            </label>
                            {!departmentId ? (
                                <FieldPlaceholder>Сначала выберите отдел</FieldPlaceholder>
                            ) : (
                                <InlineSelect
                                    value={formData.branch_id ? String(formData.branch_id) : ''}
                                    hasError={hasFieldError('branch_id')}
                                    onChange={(val) => {
                                        clearFieldErrorFor('branch_id')
                                        updateFormData({ branch_id: val ? Number(val) : undefined })
                                    }}
                                    placeholder="Выберите филиал"
                                    options={create.branchOptions}
                                    onCreate={create.openCreateBranch}
                                    createLabel="Создать филиал"
                                />
                            )}
                        </div>
                    ) : null}

                    <div>
                        <label style={labelStyle}>
                            Должность <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        {!departmentId ? (
                            <FieldPlaceholder>Сначала выберите отдел</FieldPlaceholder>
                        ) : create.positionsFetching ? (
                            <FieldPlaceholder muted>Загрузка...</FieldPlaceholder>
                        ) : create.allowedPositions.length === 0 ? (
                            <button
                                type="button"
                                onClick={create.openCreatePosition}
                                aria-label="Создать должность"
                                className="w-full h-12 rounded-full px-4 bg-app-surface-0 text-brand-accent font-bold text-sm flex items-center justify-center gap-2 hover:bg-app-surface-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Создать должность
                            </button>
                        ) : (
                            <InlineSelect
                                value={positionId ? String(positionId) : ''}
                                hasError={hasFieldError('position_id')}
                                onChange={(val) => {
                                    clearFieldErrorFor('position_id')
                                    updateFormData({ position_id: val ? Number(val) : undefined })
                                }}
                                placeholder="Выберите должность"
                                options={create.allowedPositions.map((p) => ({
                                    value: String(p.id),
                                    label: p.title,
                                }))}
                                onCreate={create.openCreatePosition}
                                createLabel="Создать должность"
                            />
                        )}
                    </div>

                    <div>
                        <label style={labelStyle}>Непосредственный начальник</label>
                        {!departmentId ? (
                            <FieldPlaceholder>Сначала выберите отдел</FieldPlaceholder>
                        ) : managersFetching ? (
                            <FieldPlaceholder muted>Загрузка...</FieldPlaceholder>
                        ) : (
                            <InlineSelect
                                value={managerId ? String(managerId) : ''}
                                onChange={(val) =>
                                    updateFormData({ manager_id: val ? Number(val) : undefined })
                                }
                                placeholder="Без начальника"
                                options={managerOptions}
                            />
                        )}
                    </div>

                    {hasPositionOrDepartmentChange ? (
                        <PositionChangePanel
                            positionChangeBasisInputRef={positionChangeBasisInputRef}
                            positionChangeFileError={positionChangeFileError}
                            onBasisFile={onBasisFile}
                        />
                    ) : null}
                </div>
            </div>

            <CreateDepartmentModal
                open={create.createTarget === 'department'}
                onClose={create.closeCreate}
                name={create.deptName}
                onNameChange={create.setDeptName}
                description={create.deptDescription}
                onDescriptionChange={create.setDeptDescription}
                parentId={create.deptParentId}
                onParentIdChange={create.setDeptParentId}
                allowedPositionIds={create.deptAllowedPositionIds}
                onAllowedPositionIdsChange={create.setDeptAllowedPositionIds}
                branchId={create.deptBranchId}
                onBranchIdChange={create.setDeptBranchId}
                icon={create.deptIcon}
                onIconChange={create.setDeptIcon}
                branchesEnabled={create.branchesEnabled}
                allDepartments={create.allDepartments}
                branchSelectOptions={create.branchSelectOptions}
                onConfirm={create.handleCreateDepartment}
                isCreating={create.isCreatingDepartment}
            />

            <RoleDialog
                open={create.createTarget === 'position'}
                onOpenChange={(open) => {
                    if (!open) create.closeCreate()
                }}
                onSave={(data) => {
                    void create.handleCreatePosition(data)
                }}
                mode="create"
            />

            {create.branchesEnabled ? (
                <BranchCreateModal
                    open={create.createTarget === 'branch'}
                    name={create.branchName}
                    description={create.branchDescription}
                    code={create.branchCode}
                    mutation={{ isPending: create.isCreatingBranch }}
                    onClose={create.closeCreate}
                    onNameChange={create.setBranchName}
                    onDescriptionChange={create.setBranchDescription}
                    onCodeChange={create.setBranchCode}
                    onSave={create.handleCreateBranch}
                />
            ) : null}
        </div>
    )
}
