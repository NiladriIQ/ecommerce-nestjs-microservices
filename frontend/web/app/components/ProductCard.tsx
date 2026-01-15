'use client';

export default function ProductCard({ product }: { product: any }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="bg-gray-100 h-48 flex items-center justify-center relative">
        <span className="text-5xl text-gray-400">📦</span>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <span className="text-blue-600 font-bold text-lg">${product.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
        <div className="text-xs text-gray-500 mb-4 flex justify-between">
          <span>ID: {product.id}</span>
          <span className={product.stock < 5 ? 'text-orange-500 font-semibold' : ''}>
            {product.stock} in stock
          </span>
        </div>
        <button 
          onClick={addToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 rounded transition-colors font-semibold ${
            product.stock > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

