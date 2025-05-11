
import { db } from '@/lib/firebase/config';
import type { Order, OrderStatus } from '@/lib/types';
import { collection, getDocs, doc, updateDoc, Timestamp, orderBy, query, limit, where,getCountFromServer } from 'firebase/firestore';

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

export async function getTotalRevenue(): Promise<number> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    // Summing up 'orderTotal' for orders that are 'delivered'
    const q = query(ordersCollectionRef, where('orderStatus', '==', 'delivered'));
    const querySnapshot = await getDocs(q);
    let totalRevenue = 0;
    querySnapshot.forEach(docSnap => {
      totalRevenue += docSnap.data().orderTotal || 0;
    });
    return totalRevenue;
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return 0;
  }
}

export async function getTotalOrdersCount(): Promise<number> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getCountFromServer(ordersCollectionRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching total orders count:", error);
    return 0;
  }
}

export async function getActiveCustomersCount(): Promise<number> {
  // This is a placeholder. True active customer logic might involve
  // looking at recent orders or distinct customer IDs from orders.
  // For simplicity, we'll count distinct billing emails from all orders.
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const querySnapshot = await getDocs(ordersCollectionRef);
    const customerEmails = new Set<string>();
    querySnapshot.forEach(docSnap => {
      customerEmails.add(docSnap.data().billingEmail);
    });
    return customerEmails.size;
  } catch (error) {
    console.error("Error fetching active customers count:", error);
    return 0;
  }
}


export async function getRecentOrders(count: number = 5): Promise<Order[]> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
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
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

```