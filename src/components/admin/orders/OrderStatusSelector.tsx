
"use client";

import { useState } from 'react';
import type { OrderStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus as updateStatusAction } from '@/services/orderService'; // Renamed to avoid conflict

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void; // Callback to update parent state
}

const availableStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const OrderStatusSelector: React.FC<OrderStatusSelectorProps> = ({ orderId, currentStatus, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus); // Optimistically update UI
  };

  const handleSaveChanges = async () => {
    if (selectedStatus === currentStatus) {
        toast({ title: "No Changes", description: "The order status has not been changed." });
        return;
    }
    setIsUpdating(true);
    try {
      await updateStatusAction(orderId, selectedStatus);
      toast({
        title: "Status Updated",
        description: `Order ${orderId} status changed to ${selectedStatus}.`,
      });
      onStatusChange(selectedStatus); // Notify parent of successful update
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update order status. Please try again.",
        variant: "destructive",
      });
      setSelectedStatus(currentStatus); // Revert optimistic update on error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={(value) => handleStatusChange(value as OrderStatus)}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {availableStatuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStatus !== currentStatus && (
        <Button onClick={handleSaveChanges} disabled={isUpdating} size="sm">
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
      )}
    </div>
  );
};

export default OrderStatusSelector;
