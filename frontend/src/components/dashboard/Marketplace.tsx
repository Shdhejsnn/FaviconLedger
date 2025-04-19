import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { ArrowUpDown, TrendingUp, ExternalLink, Loader, BarChart4 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

const REGIONS = [
  { name: "European Union", base: 66.85 },
  { name: "UK", base: 47.39 },
  { name: "Australia (AUD)", base: 34.05 },
  { name: "New Zealand (NZD)", base: 52.0 },
  { name: "South Korea", base: 6.17 },
  { name: "China", base: 83.5 },
];

interface PriceData {
  name: string;
  price: string;
  ethPerCredit: string;
  change: string;
}

interface LedgerEntry {
  type: string;
  txHash: string;
  region: string;
  amount: string;
  ethAmount: string;
  party: string;
}

const Marketplace: React.FC = () => {
  const { wallet } = useAuth();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [region, setRegion] = useState(REGIONS[0].name);
  const [sellRegion, setSellRegion] = useState(REGIONS[0].name);
  const [ethAmount, setEthAmount] = useState('');
  const [address, setAddress] = useState(wallet || '');
  const [privateKey, setPrivateKey] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [estimatedCredits, setEstimatedCredits] = useState('0');
  const [creditsToSell, setCreditsToSell] = useState('');
  const [calculatedEthForSale, setCalculatedEthForSale] = useState('');
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    if (wallet) setAddress(wallet);
  }, [wallet]);

  useEffect(() => {
    const updatePrices = () => {
      setLoadingPrices(true);
      const updated = REGIONS.map((r) => {
        const change = (Math.random() * 2 - 1).toFixed(2);
        const newPrice = (r.base * (1 + parseFloat(change) / 100)).toFixed(2);
        return {
          name: r.name,
          price: newPrice,
          ethPerCredit: (parseFloat(newPrice) / 10).toFixed(4),
          change,
        };
      });
      setPrices(updated);
      setLoadingPrices(false);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const selected = prices.find((p) => p.name === region);
    if (selected && ethAmount && mode === 'buy') {
      const credits = (parseFloat(ethAmount) / parseFloat(selected.ethPerCredit)).toFixed(2);
      setEstimatedCredits(credits);
    }
  }, [region, ethAmount, prices, mode]);

  useEffect(() => {
    if (mode === 'sell' && creditsToSell && sellRegion && prices.length > 0) {
      const regionData = prices.find(p => p.name === sellRegion);
      if (regionData) {
        const eth = (parseFloat(creditsToSell) * parseFloat(regionData.ethPerCredit)).toFixed(4);
        setCalculatedEthForSale(eth);
      }
    }
  }, [creditsToSell, sellRegion, prices, mode]);

  const handleBuy = async () => {
    if (!ethAmount || !address || !privateKey) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const amount = parseFloat(estimatedCredits);

    try {
      const res = await axios.post("http://localhost:5000/api/buy", {
        from: address,
        privateKey,
        region,
        ethAmount,
        amount,
      });

      alert(`✅ Transaction successful! TX: ${res.data.txHash}`);
      setLedger((prev) => [
        {
          type: "BUY",
          txHash: res.data.txHash,
          region: res.data.ledger?.region || "N/A",
          amount: `${res.data.ledger?.credits} (Token #${res.data.ledger?.tokenId || "?"})`,
          ethAmount: res.data.ledger?.ethSpent || ethAmount,
          party: res.data.ledger?.buyer || address,
        },
        ...prev,
      ]);
      setCreditBalance((prev) => prev + amount);
      setEthAmount('');
    } catch (err: any) {
      console.error(err);
      alert("❌ Purchase failed: " + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!tokenId || !creditsToSell || !sellRegion || !address || !privateKey) {
      alert('Please fill in all fields');
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:5000/api/sell", {
        from: address,
        privateKey,
        tokenId,
        region: sellRegion,
        credits: parseFloat(creditsToSell),
        expectedEth: calculatedEthForSale,
      });
  
      alert(`✅ Sale successful! TX: ${res.data.ledger.txHash}`);
      
      setLedger((prev) => [
        {
          type: "SELL",
          txHash: res.data.ledger.txHash,
          region: res.data.ledger.region,
          amount: `${res.data.ledger.credits} (Token #${res.data.ledger.tokenId})`,
          ethAmount: res.data.ledger.ethAmount,
          party: res.data.ledger.seller,
        },
        ...prev,
      ]);
  
      // ⬇️ Subtract sold credits from current credit balance
      setCreditBalance((prev) => prev - parseFloat(res.data.ledger.credits));
  
      // Reset form
      setTokenId('');
      setCreditsToSell('');
      setCalculatedEthForSale('');
    } catch (err: any) {
      console.error(err);
      alert("❌ Sale failed: " + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌿 GreenLedger Marketplace</h1>

      {/* 🪙 Credit Balance */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">🪙 Your Credit Balance</h3>
          <p className="text-2xl font-bold text-emerald-600">{creditBalance} credits</p>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Prices */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Live Carbon Credit Prices</h3>
            <span className="text-xs text-gray-500">Auto-updating</span>
          </div>
          {loadingPrices ? (
            <div className="h-64 flex items-center justify-center">
              <Loader className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-2 py-2">Region</th>
                  <th className="text-right px-2 py-2">Price (USD)</th>
                  <th className="text-right px-2 py-2">ETH/Credit</th>
                  <th className="text-right px-2 py-2">24h</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-2">{p.name}</td>
                    <td className="px-2 py-2 text-right">${p.price}</td>
                    <td className="px-2 py-2 text-right">{p.ethPerCredit}</td>
                    <td className={`px-2 py-2 text-right ${parseFloat(p.change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {p.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Buy/Sell Form */}
        <Card>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">{mode === 'buy' ? "Buy Credits" : "Sell Credits"}</h3>
          </div>

          <div className="flex space-x-2 mb-4">
            <Button onClick={() => setMode('buy')} variant={mode === 'buy' ? 'primary' : 'outline'} fullWidth>Buy</Button>
            <Button onClick={() => setMode('sell')} variant={mode === 'sell' ? 'primary' : 'outline'} fullWidth>Sell</Button>
          </div>

          <div className="space-y-4">
            {mode === 'buy' && (
              <Select label="Region" options={REGIONS.map(r => ({ label: r.name, value: r.name }))} value={region} onChange={(e) => setRegion(e.target.value)} fullWidth />
            )}

            {mode === 'sell' && (
              <>
                <Input label="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} fullWidth />
                <Input label="Credits to Sell" value={creditsToSell} onChange={(e) => setCreditsToSell(e.target.value)} fullWidth />
                <Select label="Region" options={REGIONS.map(r => ({ label: r.name, value: r.name }))} value={sellRegion} onChange={(e) => setSellRegion(e.target.value)} fullWidth />
                <Input label="Calculated ETH" value={calculatedEthForSale} disabled fullWidth />
              </>
            )}

            {mode === 'buy' && (
              <Input label="ETH to Spend" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} fullWidth />
            )}

            <Input label="Wallet Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
            <Input label="Private Key" type="password" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} fullWidth />

            {mode === 'buy' && ethAmount && (
              <div className="text-sm text-emerald-700">Estimated Credits: <strong>{estimatedCredits}</strong></div>
            )}

            <Button fullWidth onClick={mode === 'buy' ? handleBuy : handleSell} disabled={loading}>
              {loading ? (mode === 'buy' ? 'Buying...' : 'Selling...') : (mode === 'buy' ? 'Buy Now' : 'Sell Now')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Ledger */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">📜 Transaction Ledger</h3>
        {ledger.length === 0 ? (
          <div className="text-gray-500">No transactions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left px-2 py-2">TX</th>
                <th>Type</th>
                <th>Region</th>
                <th>Credits</th>
                <th>ETH</th>
                <th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-2">
                    <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                      {tx.txHash.slice(0, 10)}...
                    </a>
                  </td>
                  <td>{tx.type}</td>
                  <td>{tx.region}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.ethAmount}</td>
                  <td>{tx.party.slice(0, 8)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Marketplace;
