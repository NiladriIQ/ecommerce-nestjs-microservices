const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001';
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL || 'http://localhost:3002';

export async function getProducts() {
  const res = await fetch(`${PRODUCT_API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: number) {
  const res = await fetch(`${PRODUCT_API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createOrder(orderData: { customerId: number; items: { productId: number; quantity: number }[] }) {
  const res = await fetch(`${PRODUCT_API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create order');
  }
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${CUSTOMER_API_URL}/customers`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function createCustomer(customerData: { name: string; email: string; address?: string }) {
  const res = await fetch(`${CUSTOMER_API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create customer');
  }
  return res.json();
}

export async function getCustomerHistory(id: number) {
  const res = await fetch(`${CUSTOMER_API_URL}/customers/${id}/history`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch customer history');
  return res.json();
}

