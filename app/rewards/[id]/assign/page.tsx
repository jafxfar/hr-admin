'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { HRLayout } from '@/components/hr-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, UserCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRewards, useAssignewardMutation } from '@/hooks/use-rewards'
import { useEmployees } from '@/hooks/use-employees'
import type { Employee } from '@/types/employees'
import { getImageUrl } from '@/lib/utils'

export default function AssignRewardPage() {
    const params = useParams()
    const router = useRouter()
    const rewardId = Number(params.id)

    const [search, setSearch] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const { data: rewardsData } = useRewards()
    const reward = rewardsData?.items?.find((r) => r.id === rewardId) ?? null

    const { data: employeesData, isLoading: employeesLoading } = useEmployees()
    const employees = employeesData?.items ?? []
    const assignMutation = useAssignewardMutation()

    const normalizeLower = (input: unknown): string => (typeof input === 'string' ? input.toLowerCase() : '')
    const searchLower = normalizeLower(search)

    const filtered = employees.filter((emp) => {
        const fullName = [
            emp.properties?.last_name,
            emp.properties?.first_name,
            emp.properties?.middle_name,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        const emailLower = normalizeLower(emp.email)
        return fullName.includes(searchLower) || emailLower.includes(searchLower)
    })

    const handleAssign = () => {
        if (!selectedEmployee) return
        assignMutation.mutate(
            { reward_id: rewardId, user_ids: [selectedEmployee.id] },
            {
                onSuccess: () => {
                    router.push('/rewards')
                },
            }
        )
    }

    const getFullName = (emp: Employee) => {
        const parts = [emp.properties?.last_name, emp.properties?.first_name, emp.properties?.middle_name].filter(Boolean)
        return parts.length > 0 ? parts.join(' ') : typeof emp.email === 'string' ? emp.email : ''
    }

    const getInitials = (emp: Employee) => {
        const last = emp.properties?.last_name?.[0] ?? ''
        const first = emp.properties?.first_name?.[0] ?? ''
        const initials = (last + first).toUpperCase()
        if (initials) return initials
        const email = typeof emp.email === 'string' ? emp.email : ''
        return email[0] ? email[0].toUpperCase() : ''
    }

    return (
        <HRLayout title="Назначить награду">
            <div className="p-6 max-w-2xl">
                {/* Reward Info */}
                {reward && (
                    <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl mb-6">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shrink-0 overflow-hidden">
                            {getImageUrl(reward.image_url) ? (
                                <img src={getImageUrl(reward.image_url)!} alt={reward.title} className="w-full h-full object-cover" />
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-app-text">{reward.title}</p>
                            {reward.description && (
                                <p className="text-[13px] text-[#86868B] mt-0.5">{reward.description}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Employee Select */}
                <div className="space-y-3">
                    <Label className="text-[13px] text-app-text font-medium">
                        Выберите сотрудника
                    </Label>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                        <Input
                            placeholder="Поиск по имени или email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-white border border-app-border text-[13px]"
                        />
                    </div>

                    {/* Employee List */}
                    <div className="border border-[#E5E5E7] rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                        {employeesLoading ? (
                            <div className="p-6 text-center text-[13px] text-[#86868B]">Загрузка...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-6 text-center text-[13px] text-[#86868B]">Сотрудники не найдены</div>
                        ) : (
                            filtered.map((emp) => {
                                const isSelected = selectedEmployee?.id === emp.id
                                return (
                                    <button
                                        key={emp.id}
                                        type="button"
                                        onClick={() => setSelectedEmployee(emp)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-[#E5E5E7] last:border-b-0 text-left transition-colors ${isSelected
                                            ? 'bg-blue-50'
                                            : 'hover:bg-[#FAFAFA]'
                                            }`}
                                    >
                                        <Avatar className="w-9 h-9 shrink-0">
                                            <AvatarFallback className="text-[12px] font-medium bg-app-surface-1 text-app-text">
                                                {getInitials(emp)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-app-text truncate">
                                                {getFullName(emp)}
                                            </p>
                                            <p className="text-[12px] text-[#86868B] truncate">{emp.email}</p>
                                        </div>
                                        {isSelected && (
                                            <UserCheck className="w-4 h-4 text-[#007AFF] shrink-0" />
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Selected Preview */}
                {selectedEmployee && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="text-xs font-medium bg-[#007AFF] text-white">
                                {getInitials(selectedEmployee)}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-[13px] text-app-text font-medium flex-1">
                            {getFullName(selectedEmployee)}
                        </p>
                        <button
                            onClick={() => setSelectedEmployee(null)}
                            className="text-[12px] text-[#86868B] hover:text-red-500 transition-colors"
                        >
                            Убрать
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-[#E5E5E7]">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="h-10 px-6 text-[13px] border-[#E5E5E7]"
                    >
                        Отменить
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedEmployee || assignMutation.isPending}
                        className="h-10 px-6 text-[13px] bg-[#007AFF] hover:bg-[#0051D5]"
                    >
                        {assignMutation.isPending ? 'Назначение...' : 'Назначить'}
                    </Button>
                </div>
            </div>
        </HRLayout>
    )
}
