
import OrderTrackingClient from '@/components/order-tracking/OrderTrackingClient';

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
      <OrderTrackingClient />
    </div>
  );
}
