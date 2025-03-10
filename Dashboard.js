import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Bitocoin = () => {

    cons [price, setPrice] = useState(0);
    const [historicalData, setHistoricalData] = useState([]);

    const fetchPrice = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/price');
          setPrice(response.data.bitcoin_price);
        } catch (error) {
          console.error('Error fetching Bitcoin price:', error);
        }
      };
    
}