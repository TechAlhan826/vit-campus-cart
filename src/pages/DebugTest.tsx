import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';

// Debug page to test all functionalities
export default function DebugTest() {
  const { user, isAuthenticated, isSeller, isAdmin, loading } = useAuth();
  const [backendStatus, setBackendStatus] = useState<string>('checking...');
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setBackendStatus('✅ Backend Connected');
      setTestResults(prev => ({ ...prev, backend: res.data }));
    } catch (err: any) {
      setBackendStatus(`❌ Backend Error: ${err.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', {
        email: 'seller@test.com',
        password: 'password'
      });
      setTestResults(prev => ({ ...prev, login: res.data }));
      alert('Login response: ' + JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      alert('Login error: ' + err.message);
    }
  };

  const testProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=5');
      setTestResults(prev => ({ ...prev, products: res.data }));
      alert(`Products: ${res.data?.products?.length || res.data?.items?.length || 0} found`);
    } catch (err: any) {
      alert('Products error: ' + err.message);
    }
  };

  const testSellerProducts = async () => {
    try {
      const res = await axios.get('/api/products/seller/me');
      setTestResults(prev => ({ ...prev, sellerProducts: res.data }));
      alert(`Seller Products: ${res.data?.products?.length || res.data?.length || 0} found`);
    } catch (err: any) {
      alert('Seller Products error: ' + err.message);
    }
  };

  const testCreateProduct = async () => {
    try {
      const testProduct = {
        title: 'Test Product ' + Date.now(),
        description: 'Test product created from debug page',
        price: 99.99,
        category: 'Electronics & Gadgets',
        condition: 'new',
        images: []
      };
      const res = await axios.post('/api/products', testProduct);
      alert('Product created successfully! ID: ' + res.data?.id);
    } catch (err: any) {
      alert('Create Product error: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Debug & Test Page</h1>

      {/* Critical Issue Alert */}
      {isAuthenticated && !isSeller && user?.role === 'seller' && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">⚠️ CRITICAL: Role Mismatch Detected!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>User role is "seller" but isSeller is FALSE!</p>
            <p>This means AuthContext isSeller logic is broken.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Backend:</strong> {backendStatus}</div>
            <div><strong>Loading:</strong> {loading ? '⏳' : '✓'}</div>
            <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
            <div><strong>User:</strong> {user?.name || 'None'}</div>
            <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
            <div><strong>Role:</strong> <Badge>{user?.role || 'guest'}</Badge></div>
            <div><strong>Is Seller:</strong> {isSeller ? '✅' : '❌'} (Computed from role)</div>
            <div><strong>Is Admin:</strong> {isAdmin ? '✅' : '❌'}</div>
            <div><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Exists' : '❌ Missing'}</div>
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <strong>Full User Object:</strong>
              <pre className="text-xs mt-1">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Test API Calls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={checkBackend} className="w-full">Test /api/auth/me</Button>
            <Button onClick={testLogin} className="w-full">Test Login (seller@test.com)</Button>
            <Button onClick={testProducts} className="w-full">Test GET Products</Button>
            <Button onClick={testSellerProducts} className="w-full">Test Seller Products</Button>
            <Button onClick={testCreateProduct} className="w-full">Test Create Product</Button>
            <Button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              variant="destructive" 
              className="w-full"
            >
              Clear All & Reload
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Last Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
