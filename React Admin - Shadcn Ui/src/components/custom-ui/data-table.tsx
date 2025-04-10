import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label, User } from "@/interfaces/interfaces";
import { Eye } from "lucide-react";

interface DataTableProps {
  labels: Label[];
  data: User[];
}

const DataTable = ({ labels, data }: DataTableProps) => {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="px-4 h-12">
            <TableRow className="bg-muted text-muted-foreground text-base">
              {labels.map((label, index) => (
                <TableHead className="px-6" key={index}>
                  {label.label}
                </TableHead>
              ))}
              <TableHead className="px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/50 cursor-pointer">
                {labels.map((label, colIndex) => (
                  <TableCell className="px-6 py-2 font-medium" key={colIndex}>
                    {row[label.value as keyof User]}
                  </TableCell>
                ))}
                <TableCell className="px-6 py-2 font-medium">
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={labels.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
