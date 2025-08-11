import { useState, useCallback } from 'react'

export function useSelection<T extends string | number>() {
  const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = useCallback((allIds: T[]) => {
    if (selectAll) {
      setSelectedItems(new Set())
      setSelectAll(false)
    } else {
      setSelectedItems(new Set(allIds))
      setSelectAll(true)
    }
  }, [selectAll])

  const handleSelectItem = useCallback((itemId: T, allIds: T[]) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)

    // Atualiza selectAll baseado na seleção atual
    setSelectAll(newSelected.size === allIds.length && allIds.length > 0)
  }, [selectedItems])

  const isItemSelected = useCallback((itemId: T) => {
    return selectedItems.has(itemId)
  }, [selectedItems])

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
    setSelectAll(false)
  }, [])

  return {
    selectedItems,
    selectAll,
    handleSelectAll,
    handleSelectItem,
    isItemSelected,
    clearSelection,
  }
}
