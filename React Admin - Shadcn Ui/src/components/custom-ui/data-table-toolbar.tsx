"use client";

import DataFilter from "./data-filter";
import DataExport from "./data-export";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { priorities, statuses } from "@/data/data";
import { User } from "@/interfaces/interfaces";


interface DataTableToolbarProps {
  data: User[];
  setFilteredData: (data: User[]) => void;
}

const DataTableToolbar = ({ data, setFilteredData }: DataTableToolbarProps) => {
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    applyFilters(value, selectedStatuses, selectedPriorities);
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

  const applyFilters = (search: string, statuses: Set<string>, priorities: Set<string>) => {
    let filtered = [...data];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((item) => 
        item.firstName.toLowerCase().includes(search.toLowerCase()) ||
        item.lastName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statuses.size > 0) {
      filtered = filtered.filter((item) => statuses.has(item.status));
    }

    // Apply priority filter (if needed)
    if (priorities.size > 0) {
      // filtered = filtered.filter((item) => priorities.has(item.priority));
    }

    setFilteredData(filtered);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input 
          placeholder="Filter users..." 
          value={searchQuery}
          onChange={handleFilterChange} 
          className="h-10 w-[150px] lg:w-[250px]" 
        />
        <DataFilter 
          title="Status"
          options={statuses} 
          selectedValues={new Set(selectedStatuses)}
          onToggleDataOption={handleStatusChange} 
        />
        <DataFilter 
          title="Priority"
          options={priorities} 
          selectedValues={new Set(selectedPriorities)}
          onToggleDataOption={handlePriorityChange} 
        />
      </div>
      <DataExport />
    </div>
  );
};

export default DataTableToolbar;
