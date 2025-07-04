import { OrderStatus } from '@prisma/client';

import { Order } from '@/interfaces/order';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStatusColor } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/constants';
import { useOrdersStore } from '@/stores/orders.store';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const SelectOrdersStatus = ({ order }: { order: Order }) => {
  const { t } = useTranslation();

  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const success = await updateOrderStatus(id, status);
    if (success) {
      toast.success(t('components.admin-ui.orders.messages.update-order-status-success'));
      fetchOrders();
    } else {
      toast.error(t('components.admin-ui.orders.messages.update-order-status-error'));
    }
  };

  return (
    <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}>
      <SelectTrigger className={`w-[140px] cursor-pointer border-none outline-none transition-colors ${getStatusColor(order.status as OrderStatus)}`}>
        <SelectValue className="flex h-full w-full items-center justify-center border-none outline-none">
          <span>{order.status}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background">
        {ORDER_STATUS.map((status) => (
          <SelectItem key={status} value={status} className={`mt-1 w-[140px] cursor-pointer border-none outline-none transition-colors ${getStatusColor(status as OrderStatus)}`}>
            <span>{status}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectOrdersStatus;
