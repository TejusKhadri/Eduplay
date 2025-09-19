import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PortfolioStock {
  id: string;
  user_id: string;
  stock_symbol: string;
  stock_name: string;
  shares: number;
  buy_price: number;
  current_price: number;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export function usePortfolio() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    } else {
      setPortfolio([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPortfolio = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio:', error);
      } else {
        setPortfolio(data || []);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async (symbol: string, name: string, price: number, category: string) => {
    if (!user) return false;

    try {
      const existingStock = portfolio.find(stock => stock.stock_symbol === symbol);

      if (existingStock) {
        // Update existing stock
        const { error } = await supabase
          .from('portfolios')
          .update({
            shares: existingStock.shares + 1,
            current_price: price,
          })
          .eq('id', existingStock.id);

        if (error) {
          console.error('Error updating portfolio:', error);
          return false;
        }
      } else {
        // Add new stock
        const { error } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            stock_symbol: symbol,
            stock_name: name,
            shares: 1,
            buy_price: price,
            current_price: price,
            category,
          });

        if (error) {
          console.error('Error adding to portfolio:', error);
          return false;
        }
      }

      // Record transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          stock_symbol: symbol,
          stock_name: name,
          transaction_type: 'buy',
          shares: 1,
          price,
          total_amount: price,
        });

      await fetchPortfolio();
      return true;
    } catch (error) {
      console.error('Error buying stock:', error);
      return false;
    }
  };

  const updateStockPrices = async (stocks: Array<{ symbol: string; price: number }>) => {
    if (!user || portfolio.length === 0) return;

    try {
      for (const stock of stocks) {
        const portfolioStock = portfolio.find(p => p.stock_symbol === stock.symbol);
        if (portfolioStock) {
          await supabase
            .from('portfolios')
            .update({ current_price: stock.price })
            .eq('id', portfolioStock.id);
        }
      }
      await fetchPortfolio();
    } catch (error) {
      console.error('Error updating stock prices:', error);
    }
  };

  return {
    portfolio,
    loading,
    fetchPortfolio,
    buyStock,
    updateStockPrices,
  };
}