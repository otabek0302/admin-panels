import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboard_data } from "@/data/data";

interface OrderItem {
  trackingId: string;
  product: string;
  customer: string;
  date: string;
  amount: string;
  paymentMethod: string;
  status: string;
}

const DataTable = () => {
  const totalAmount = dashboard_data.reduce((sum: number, item: OrderItem) => {
    const amountValue = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(amountValue) ? 0 : amountValue);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      
      <div className="flex items-center justify-between px-2 py-4">
        <h3 className="text-2xl font-bold">Last orders</h3>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader className="px-4 h-12">
            <TableRow className="bg-muted text-muted-foreground text-base">
              <TableHead className="px-6 w-[120px]">Tracking ID</TableHead>
              <TableHead className="px-6">Product</TableHead>
              <TableHead className="px-6">Customer</TableHead>
              <TableHead className="px-6">Date</TableHead>
              <TableHead className="px-6">Payment Method</TableHead>
              <TableHead className="px-6">Status</TableHead>
              <TableHead className="px-6 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {dashboard_data.map((item) => (
              <TableRow key={item.trackingId}>
                <TableCell className="px-6 py-4 font-medium">{item.trackingId}</TableCell>
                <TableCell className="px-6 py-4">{item.product}</TableCell>
                <TableCell className="px-6 py-4">{item.customer}</TableCell>
                <TableCell className="px-6 py-4">{item.date}</TableCell>
                <TableCell className="px-6 py-4">{item.paymentMethod}</TableCell>
                <TableCell className="px-6 py-4">{item.status}</TableCell>
                <TableCell className="px-6 py-4 text-right">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="text-base h-12">
              <TableCell className="px-6" colSpan={6}>Total</TableCell>
              <TableCell className="px-6 text-right">${totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
