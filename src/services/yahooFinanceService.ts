// Yahoo Finance API service for real stock data
export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  shortName: string;
  displayName: string;
  marketState: string;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  description: string;
  category: string;
}

class YahooFinanceService {
  private readonly baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
  private readonly corsProxy = 'https://cors-anywhere.herokuapp.com/';
  
  // Kid-friendly stock descriptions
  private readonly stockDescriptions: Record<string, { description: string; category: string }> = {
    'AAPL': { description: 'Makes iPhones, iPads, and Mac computers that kids love!', category: 'Technology' },
    'GOOGL': { description: 'The company behind Google search and YouTube!', category: 'Technology' },
    'MSFT': { description: 'Creates Xbox games and Windows computers!', category: 'Technology' },
    'TSLA': { description: 'Makes cool electric cars and rockets!', category: 'Technology' },
    'DIS': { description: 'Home of Mickey Mouse, Marvel heroes, and Disney movies!', category: 'Entertainment' },
    'MCD': { description: 'The famous golden arches restaurant everyone knows!', category: 'Food' },
    'NKE': { description: 'Makes the coolest sneakers and sports gear!', category: 'Sports' },
    'NFLX': { description: 'Your favorite streaming service for movies and shows!', category: 'Entertainment' },
  };

  private async fetchWithFallback(symbol: string): Promise<any> {
    const urls = [
      `/api/yahoo/v8/finance/chart/${symbol}`, // Use Vite proxy in development
      `${this.corsProxy}${this.baseUrl}/${symbol}`, // Fallback with CORS proxy
      `${this.baseUrl}/${symbol}`, // Direct call (might fail due to CORS)
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${url}:`, error);
      }
    }
    
    throw new Error(`Failed to fetch data for ${symbol}`);
  }

  async getStockQuote(symbol: string): Promise<Stock | null> {
    try {
      const data = await this.fetchWithFallback(symbol);
      const result = data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];
      
      if (!meta || !quote) return null;

      const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      // Convert price to kid-friendly coins (1 dollar = 1 coin, rounded)
      const coinPrice = Math.round(currentPrice);
      
      const stockInfo = this.stockDescriptions[symbol] || {
        description: 'A great company to learn about investing!',
        category: 'Business'
      };

      return {
        id: symbol.toLowerCase(),
        name: meta.shortName || symbol,
        symbol: symbol,
        price: coinPrice,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        description: stockInfo.description,
        category: stockInfo.category,
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<Stock[]> {
    const promises = symbols.map(symbol => this.getStockQuote(symbol));
    const results = await Promise.all(promises);
    return results.filter((stock): stock is Stock => stock !== null);
  }

  // Get popular kid-friendly stocks
  getPopularStocks(): string[] {
    return ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'DIS', 'MCD', 'NKE', 'NFLX'];
  }
}

export const yahooFinanceService = new YahooFinanceService();