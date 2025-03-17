import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const BitcoinTracker = () => { 
  const [price, setPrice] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [alert, setAlert] = useState('');
  const threshold = 500;

  // Fetch real-time Bitcoin price
  const fetchPrice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/price');
      const newPrice = response.data.bitcoin_price;
      if (Math.abs(newPrice - price) >= threshold) {
        setAlert(`Significant Price Change Detected: $${price} → $${newPrice}`);
      }
      setPrice(newPrice);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  // Fetch historical Bitcoin prices
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/historical');
      setHistoricalData(response.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchPrice();
    fetchHistoricalData();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.h1 className="text-3xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Bitcoin Price Tracker
      </motion.h1>
      {alert && <p className="text-red-500 font-bold">{alert}</p>}
      <Card className="mb-6 p-4 shadow-lg">
        <CardContent>
          <p className="text-xl">Current Price: <span className="font-bold">${price}</span></p>
          <Button className="mt-4" onClick={fetchPrice}>Refresh Price</Button>
        </CardContent>
      </Card>

      <Plot
        data={[
          {
            x: historicalData.map(item => new Date(item[0]).toLocaleDateString()),
            y: historicalData.map(item => item[1]),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'orange' },
          },
        ]}
        layout={{ title: 'Bitcoin Price (Last 7 Days)' }}
      />
    </div>
  );
};

export default BitcoinTracker;
