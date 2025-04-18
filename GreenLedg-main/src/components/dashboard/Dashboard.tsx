import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Wallet, Building, PieChart, ArrowUpRight, BarChart3, Loader, Leaf } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { CarbonPriceWidget } from './CarbonPriceWidget';

interface CompanyData {
  name: string;
  wallet: string;
  type: number;
  threshold: number;
}

const companyTypes = ["Agriculture", "Manufacturing", "Technology", "Energy"];

const Dashboard: React.FC = () => {
  const { wallet } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('');
  const [carbonCredits, setCarbonCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch company data
        const res = await axios.get(`http://localhost:5000/api/company/${wallet}`);
        setCompany(res.data);

        // Fetch ETH balance
        const web3Res = await axios.post("http://localhost:7545", {
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [wallet, "latest"],
          id: 1
        });

        const balanceInWei = parseInt(web3Res.data.result, 16);
        const balanceInEth = balanceInWei / 1e18;
        setEthBalance(balanceInEth.toFixed(4));
        
        // Mock carbon credits data
        setCarbonCredits(Math.floor(Math.random() * 100) + 10);
        
        // Mock transaction data
        setTransactions([
          {
            id: 'tx1',
            type: 'Purchase',
            amount: '5.2',
            date: '2025-04-15',
            status: 'Completed',
          },
          {
            id: 'tx2',
            type: 'Sale',
            amount: '2.0',
            date: '2025-04-10',
            status: 'Completed',
          },
          {
            id: 'tx3',
            type: 'Purchase',
            amount: '3.5',
            date: '2025-04-05',
            status: 'Completed',
          }
        ]);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) fetchData();
  }, [wallet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {company.name}
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ETH Balance */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">ETH Balance</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{ethBalance} ETH</h3>
            </div>
            <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        
        {/* Carbon Credits */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Carbon Credits</p>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{carbonCredits} credits</h3>
            </div>
            <div className="bg-emerald-200 dark:bg-emerald-800 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
        
        {/* Company Type */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm font-medium">Company Type</p>
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">{companyTypes[company.type]}</h3>
            </div>
            <div className="bg-indigo-200 dark:bg-indigo-800 p-2 rounded-lg">
              <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>
        
        {/* Carbon Threshold */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">Carbon Threshold</p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">{company.threshold} tons</h3>
            </div>
            <div className="bg-amber-200 dark:bg-amber-800 p-2 rounded-lg">
              <PieChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carbon Prices */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-Time Carbon Prices</h3>
            <a href="#" className="text-sm text-emerald-600 dark:text-emerald-500 flex items-center hover:underline">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <CarbonPriceWidget />
          </div>
        </Card>
        
        {/* Recent Transactions */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <a href="#" className="text-sm text-emerald-600 dark:text-emerald-500 flex items-center hover:underline">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          {transactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className={`p-2 rounded 
                    ${tx.type === 'Purchase' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}
                  `}>
                    {tx.type === 'Purchase' ? (
                      <BarChart3 className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.type}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.amount} credits</p>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;