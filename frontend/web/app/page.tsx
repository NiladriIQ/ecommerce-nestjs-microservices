import { getProducts } from './lib/api';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';

export default async function HomePage() {
  let products = [];
  let error = null;

  try {
    products = await getProducts();
  } catch (err) {
    console.error(err);
    const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001';
    error = `Could not connect to the Product Service. Please ensure the backend is running at ${productServiceUrl}.`;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to our E-Shop</h1>
            <p className="text-gray-600 text-lg">Browse our latest collection of premium products.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <section>
          {products.length === 0 && !error ? (
            <div className="bg-white border-2 border-dashed border-gray-200 p-12 rounded-xl text-center">
              <span className="text-5xl mb-4 block">🏜️</span>
              <h2 className="text-2xl font-bold mb-2">No products available</h2>
              <p className="text-gray-500 mb-6">Our inventory is currently empty. Check back later or add some via the API.</p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block text-left max-w-md">
                <p className="text-xs font-mono text-blue-700">
                  # Example API call to add a product:<br/>
                  POST {process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3001'}/products<br/>
                  {'{ "name": "Classic T-Shirt", "price": 25.99, "stock": 50, "description": "High quality cotton" }'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
