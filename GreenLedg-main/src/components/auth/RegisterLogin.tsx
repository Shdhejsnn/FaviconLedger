import React, { useState } from 'react';
import axios from 'axios';
import { User, UserPlus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

const COMPANY_TYPES = [
  { value: '0', label: 'Agriculture' },
  { value: '1', label: 'Manufacturing' },
  { value: '2', label: 'Technology' },
  { value: '3', label: 'Energy' },
];

interface RegisterLoginProps {
  onSuccess: () => void;
}

const RegisterLogin: React.FC<RegisterLoginProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [companyType, setCompanyType] = useState('0');
  const [walletInput, setWalletInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setWallet } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        companyType: parseInt(companyType),
        fromAddress: walletInput,
      });
      
      setWallet(walletInput);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/company/${walletInput}`);
      if (!res.data.registered) {
        setError('Company not registered. Please register first.');
      } else {
        setWallet(walletInput);
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${
            activeTab === 'login'
              ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-500 dark:border-emerald-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('login')}
        >
          <User className="h-4 w-4 mr-2" />
          Login
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${
            activeTab === 'register'
              ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-500 dark:border-emerald-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('register')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin}>
          <Input
            label="Wallet Address"
            placeholder="0x..."
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            fullWidth
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-emerald-600 dark:text-emerald-500 hover:underline"
              onClick={() => setActiveTab('register')}
            >
              Register here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <Input
            label="Company Name"
            placeholder="Enter your company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          
          <Input
            label="Wallet Address"
            placeholder="0x..."
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            fullWidth
            required
          />
          
          <Select
            label="Company Type"
            options={COMPANY_TYPES}
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            fullWidth
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              className="text-emerald-600 dark:text-emerald-500 hover:underline"
              onClick={() => setActiveTab('login')}
            >
              Login here
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegisterLogin;