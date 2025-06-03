
import { db } from '@/lib/firebase/config';
import type { Order, CustomerSummary, CustomerDetails } from '@/lib/types';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
}

export async function getAllCustomerSummaries(): Promise<CustomerSummary[]> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const ordersByEmail: Record<string, Order[]> = {};

    querySnapshot.docs.forEach(docSnap => {
      const orderData = docSnap.data();
      let createdAtDate = orderData.createdAt;
      if (orderData.createdAt && typeof orderData.createdAt.seconds === 'number') {
        createdAtDate = (orderData.createdAt as Timestamp).toDate();
      }
      const order = { id: docSnap.id, ...orderData, createdAt: createdAtDate } as Order;
      
      if (!ordersByEmail[order.billingEmail]) {
        ordersByEmail[order.billingEmail] = [];
      }
      ordersByEmail[order.billingEmail].push(order);
    });

    const customerSummaries: CustomerSummary[] = [];

    for (const email in ordersByEmail) {
      const customerOrders = ordersByEmail[email].sort((a, b) => 
        (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()
      ); // Ensure sorted by most recent first

      if (customerOrders.length === 0) continue;

      const latestOrder = customerOrders[0];
      const earliestOrder = customerOrders[customerOrders.length - 1];
      
      const name = `${latestOrder.billingFirstName} ${latestOrder.billingLastName}`;
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.orderTotal, 0);

      customerSummaries.push({
        id: email,
        email: email,
        name: name,
        avatarFallback: getInitials(name),
        totalOrders: customerOrders.length,
        totalSpent: totalSpent,
        lastOrderDate: latestOrder.createdAt as Date,
        firstOrderDate: earliestOrder.createdAt as Date,
      });
    }
    
    // Sort summaries by last order date (most recent first)
    return customerSummaries.sort((a, b) => {
        if (!a.lastOrderDate && !b.lastOrderDate) return 0;
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
    });

  } catch (error) {
    console.error("Error fetching all customer summaries:", error);
    return [];
  }
}

export async function getCustomerDetailsByEmail(email: string): Promise<CustomerDetails | null> {
  try {
    const ordersCollectionRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCollectionRef, where('billingEmail', '==', email), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const customerOrders: Order[] = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtDate = data.createdAt;
      if (data.createdAt && typeof data.createdAt.seconds === 'number') {
        createdAtDate = (data.createdAt as Timestamp).toDate();
      }
      return { id: docSnap.id, ...data, createdAt: createdAtDate } as Order;
    });

    const latestOrder = customerOrders[0]; // Already sorted by desc
    const earliestOrder = customerOrders[customerOrders.length - 1];
    const name = `${latestOrder.billingFirstName} ${latestOrder.billingLastName}`;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.orderTotal, 0);

    const summary: CustomerSummary = {
      id: email,
      email: email,
      name: name,
      avatarFallback: getInitials(name),
      totalOrders: customerOrders.length,
      totalSpent: totalSpent,
      lastOrderDate: latestOrder.createdAt as Date,
      firstOrderDate: earliestOrder.createdAt as Date,
    };

    return { summary, orders: customerOrders };

  } catch (error) {
    console.error(`Error fetching customer details for email ${email}:`, error);
    return null;
  }
}
