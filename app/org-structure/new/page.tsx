'use client'

import React, { useState } from 'react'
import { HRLayout } from '@/components/hr-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDepartmentsTree, useCreateDepartmentMutation } from '@/hooks/use-departments'
import type { Department } from '@/types/departments'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { PositionsMultiSelect } from '@/components/ui/positions-multi-select'
import { CitySelect } from '@/components/employee-form/profile-form/city-select'
import { TAJIKISTAN_CITY_OPTIONS } from '@/lib/tajikistan-cities'

// Сортируем по level чтобы в списке сначала шли корневые отделы
function sortByLevel(departments: Department[]) {
  return [...departments].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
}

const NewDepartmentPage = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [parentDepartment, setParentDepartment] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [allowedPositionIds, setAllowedPositionIds] = useState<number[]>([])

    const { data: treeData } = useDepartmentsTree()
    const departments = treeData ? sortByLevel(treeData) : []

    const createMutation = useCreateDepartmentMutation()
    const { toast } = useToast()

    const handleCancel = () => {
        router.back()
    }

    const handleSave = () => {
        if (!name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Заполните обязательные поля',
                description: 'Укажите название подразделения',
            })
            return
        }

        createMutation.mutate(
            {
                name,
                parent_id: parentDepartment ? Number(parentDepartment) : 0,
                description: '',
                head_user_id: 0,
                allowed_position_ids: allowedPositionIds.length > 0 ? allowedPositionIds : undefined,
            },
            {
                onSuccess: () => {
                    router.back()
                },
            }
        )
    }

    return (
        <HRLayout title="Новое подразделение">
            <div className="p-6">
                <div className="max-w-2xl space-y-6">
                    {/* Название */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[13px] text-app-text font-medium">
                            Название
                        </Label>
                        <Input
                            id="name"
                            placeholder="Введите название"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-10 bg-white border border-app-border text-[13px]"
                        />
                    </div>

                    {/* Вышестоящее подразделение */}
                    <div className="space-y-2">
                        <Label htmlFor="parent-department" className="text-[13px] text-app-text font-medium">
                            Вышестоящее подразделение
                        </Label>
                        <Select value={parentDepartment} onValueChange={setParentDepartment}>
                            <SelectTrigger className="h-10 bg-white border border-app-border text-[13px]">
                                <SelectValue placeholder="Нет вышестоящих подразделений" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Нет вышестоящих подразделений</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        <span style={{ paddingLeft: `${(dept.level ?? 0) * 12}px` }} className="flex flex-col">
                                            <span>{dept.department_name}</span>
                                            {(dept.level ?? 0) > 0 && (
                                                <span className="text-xs font-medium text-[#9CA3AF]">{dept.path}</span>
                                            )}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Город */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-[13px] text-app-text font-medium">
                            Город
                        </Label>
                        <CitySelect
                            value={city}
                            onChange={setCity}
                            placeholder="Душанбе"
                            options={TAJIKISTAN_CITY_OPTIONS}
                        />
                    </div>

                    {/* Доступные должности */}
                    <div className="space-y-2">
                        <Label className="text-[13px] text-app-text font-medium">
                            Доступные должности
                        </Label>
                        <PositionsMultiSelect
                            value={allowedPositionIds}
                            onChange={setAllowedPositionIds}
                            placeholder="Выберите должности для отдела"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 mt-12 border-t border-[#E5E5E7]">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="h-10 px-6 text-[13px] border-[#E5E5E7]"
                    >
                        Отменить
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!name || createMutation.isPending}
                        className="h-10 px-6 text-[13px] bg-[#007AFF] hover:bg-[#0051D5]"
                    >
                        {createMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </div>
            </div>
        </HRLayout>
    )
}

export default NewDepartmentPage