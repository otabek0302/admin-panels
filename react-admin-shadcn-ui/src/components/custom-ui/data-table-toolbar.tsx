"use client";

import DataFilter from "./data-filter";
import DataExport from "./data-export";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTableToolbarProps } from "@/interfaces/interfaces";

const DataTableToolbar = ({ data, setFilteredData, statuses = [], priorities = [], search = [] }: DataTableToolbarProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // If search is cleared and no other filters are active, reset data
    if (value === "" && selectedStatuses.size === 0 && selectedPriorities.size === 0) {
      setFilteredData([...data]);
    } else {
      applyFilters(value, selectedStatuses, selectedPriorities);
    }
  };

  const handleStatusChange = (value: string) => {
    const newStatuses = new Set(selectedStatuses);

    if (newStatuses.has(value)) {
      newStatuses.delete(value);
    } else {
      newStatuses.add(value);
    }

    setSelectedStatuses(newStatuses);
    applyFilters(searchQuery, newStatuses, selectedPriorities);
  };

  const handlePriorityChange = (value: string) => {
    const newPriorities = new Set(selectedPriorities);
    if (newPriorities.has(value)) {
      newPriorities.delete(value);
    } else {
      newPriorities.add(value);
    }
    setSelectedPriorities(newPriorities);
    applyFilters(searchQuery, selectedStatuses, newPriorities);
  };

  const applyFilters = (query: string, status: Set<string>, priority: Set<string>) => {
    let filtered = [...data];

    // Apply search filter
    if (query && query.length > 0 && search.length > 0) {
      filtered = filtered.filter((item: object) =>
        search.some((field: string) => {
          const value = item[field as keyof typeof item];
          return value ? String(value).toLowerCase().includes(query.toLowerCase()) : false;
        })
      );
    }

    // Apply status filter
    if (status.size > 0) {
      filtered = filtered.filter((item: object) => {
        const itemStatus = (item as { status?: string }).status;
        return itemStatus ? status.has(itemStatus) : false;
      });
    }

    // Apply priority filter
    if (priority.size > 0) {
      filtered = filtered.filter((item: object) => {
        const itemPriority = (item as { priority?: string }).priority;
        return itemPriority ? priority.has(itemPriority) : false;
      });
    }

    // If no filters are active, show all data
    if (!query && status.size === 0 && priority.size === 0) {
      filtered = [...data];
    }

    setFilteredData(filtered);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {search.length > 0 && <Input placeholder="Filter..." value={searchQuery} onChange={handleFilterChange} className="h-10 w-[150px] lg:w-[250px]" />}
        {statuses.length > 0 && (
          <DataFilter 
            title="Status" 
            options={statuses.map(status => ({ value: status, label: status }))} 
            selectedValues={selectedStatuses} 
            onToggleDataOption={handleStatusChange} 
          />
        )}
        {priorities.length > 0 && (
          <DataFilter 
            title="Priority" 
            options={priorities.map(priority => ({ value: priority, label: priority }))} 
            selectedValues={selectedPriorities} 
            onToggleDataOption={handlePriorityChange} 
          />
        )}
      </div>
      <DataExport />
    </div>
  );
};

export default DataTableToolbar;
