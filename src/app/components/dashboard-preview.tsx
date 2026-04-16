import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const cryptoData = [
  { symbol: 'BTC', name: 'Bitcoin', price: '43,267.89', change: '+2.34', up: true, volume: '28.4B', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: '2,648.12', change: '+1.87', up: true, volume: '14.2B', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', price: '98.45', change: '-0.92', up: false, volume: '3.1B', icon: '◎' },
  { symbol: 'ADA', name: 'Cardano', price: '0.628', change: '+3.14', up: true, volume: '1.8B', icon: '₳' },
  { symbol: 'USDT', name: 'Tether', price: '1.00', change: '+0.01', up: true, volume: '45.2B', icon: '₮' },
];

const MiniChart = ({ up }: { up: boolean }) => {
  const points = up
    ? 'M0,20 L8,18 L16,15 L24,16 L32,12 L40,8 L48,10 L56,5 L64,3'
    : 'M0,5 L8,8 L16,6 L24,10 L32,14 L40,12 L48,16 L56,18 L64,20';
  return (
    <svg width="64" height="24" viewBox="0 0 64 24" className="inline-block">
      <path d={points} fill="none" stroke={up ? '#10B981' : '#F87171'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export function DashboardPreview({ isDark = true }: { isDark?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`rounded-2xl overflow-hidden backdrop-blur-xl border ${isDark ? 'bg-[#121318] border-white/[0.06]' : 'bg-white/90 border-zinc-200'}`}>
      {/* Top Bar */}
      <div className={`px-6 py-4 border-b ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFC701] to-[#D59A04] flex items-center justify-center text-black text-[10px]">AU</div>
          <span className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: '"BPG LE Studio 02 Caps", "Space Grotesk", sans-serif' }}>AURUM</span>
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded-md ${isDark ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-green-50 text-green-600'}`}>
          ● Live
        </div>
      </div>

      {/* Balance */}
      <div className="px-6 py-5 flex flex-wrap gap-8">
        <div>
          <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>Total Balance</div>
          <div className={`text-2xl ${isDark ? 'text-white' : 'text-zinc-900'}`}>$128,459.<span className={isDark ? 'text-[#9295A6]' : 'text-zinc-400'}>32</span></div>
        </div>
        <div>
          <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>24h Change</div>
          <div className="text-2xl text-[#10B981] flex items-center gap-1">+2.47% <TrendingUp size={14} /></div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>
              <th className="text-left py-2 pr-4">Asset</th>
              <th className="text-right py-2 px-2 hidden sm:table-cell">Price</th>
              <th className="text-right py-2 px-2">24h</th>
              <th className="text-right py-2 px-2 hidden md:table-cell">Volume</th>
              <th className="text-right py-2 pl-2 hidden sm:table-cell">Chart</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((coin, i) => (
              <motion.tr
                key={coin.symbol}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-zinc-100'} ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50'} transition-colors`}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${isDark ? 'bg-[#080B0F]' : 'bg-zinc-100'}`}>{coin.icon}</div>
                    <div>
                      <div className={isDark ? 'text-white' : 'text-zinc-900'}>{coin.symbol}</div>
                      <div className={`text-[10px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{coin.name}</div>
                    </div>
                  </div>
                </td>
                <td className={`text-right py-3 px-2 hidden sm:table-cell ${isDark ? 'text-white' : 'text-zinc-900'}`}>${coin.price}</td>
                <td className="text-right py-3 px-2">
                  <span className={`inline-flex items-center gap-0.5 ${coin.up ? 'text-[#10B981]' : 'text-[#F87171]'}`}>
                    {coin.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{coin.change}%
                  </span>
                </td>
                <td className={`text-right py-3 px-2 hidden md:table-cell ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>${coin.volume}</td>
                <td className="text-right py-3 pl-2 hidden sm:table-cell"><MiniChart up={coin.up} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExchangeWidget({ isDark = true }: { isDark?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border backdrop-blur-xl ${isDark ? 'bg-[#121318] border-white/[0.06]' : 'bg-white/90 border-zinc-200'}`}>
      <div className={`text-sm mb-5 ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>Quick Exchange</div>

      <div className={`rounded-xl p-4 mb-2 ${isDark ? 'bg-[#080B0F]' : 'bg-zinc-50'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>From</span>
          <span className={`text-[10px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>Balance: 2.4589 BTC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xl ${isDark ? 'text-white' : 'text-zinc-900'}`}>1.0000</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isDark ? 'bg-[#121318]' : 'bg-zinc-200'}`}>
            <span className="text-xs">₿</span>
            <span className={`text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>BTC</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-1 relative z-10">
        <div className="w-7 h-7 rounded-full bg-[#D59A04] flex items-center justify-center text-black text-xs">↕</div>
      </div>

      <div className={`rounded-xl p-4 mt-2 ${isDark ? 'bg-[#080B0F]' : 'bg-zinc-50'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>To</span>
          <span className={`text-[10px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>Balance: 42.18 ETH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xl ${isDark ? 'text-white' : 'text-zinc-900'}`}>16.3241</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isDark ? 'bg-[#121318]' : 'bg-zinc-200'}`}>
            <span className="text-xs">Ξ</span>
            <span className={`text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>ETH</span>
          </div>
        </div>
      </div>

      <div className={`flex justify-between text-[10px] mt-4 px-1 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>
        <span>Rate</span><span>1 BTC = 16.3241 ETH</span>
      </div>
      <div className={`flex justify-between text-[10px] mt-1 px-1 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>
        <span>Fee</span><span>0.1%</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-[#D59A04] to-[#FFC701] text-black text-sm"
      >
        Exchange Now
      </motion.button>
    </div>
  );
}
