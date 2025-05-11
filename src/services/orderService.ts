
import { db } from '@/lib/firebase/config';
import type { Order, OrderStatus } from '@/lib/types';
import { collection, getDocs, doc, updateDoc, Timestamp, orderBy, query } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      // Ensure createdAt is a Date object for consistent handling
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: createdAtDate, 
      } as Order;
    });
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, {
      orderStatus: newStatus,
    });
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw new Error('Failed to update order status.');
  }
}
