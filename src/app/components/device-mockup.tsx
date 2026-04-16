import { type ReactNode } from 'react';

export const BrowserMockup = ({
  children,
  url = 'aurum.exchange',
  className = '',
  dark = true,
}: {
  children: ReactNode;
  url?: string;
  className?: string;
  dark?: boolean;
}) => (
  <div className={`rounded-xl overflow-hidden shadow-2xl ${dark ? 'shadow-black/50' : 'shadow-zinc-300/50'} ${className}`}>
    <div className={`px-4 py-2.5 flex items-center gap-3 ${dark ? 'bg-[#121318]' : 'bg-zinc-100'}`}>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFC701]/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/70" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className={`rounded-md px-4 py-1 text-[10px] flex items-center gap-1.5 max-w-xs w-full justify-center ${
          dark ? 'bg-[#080B0F] text-[#9295A6]' : 'bg-white text-zinc-400 border border-zinc-200'
        }`}>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {url}
        </div>
      </div>
      <div className="w-12" />
    </div>
    <div className={`${dark ? 'bg-[#080B0F]' : 'bg-white'} [&_img]:block`}>{children}</div>
  </div>
);

export const PhoneMockup = ({
  children,
  className = '',
  dark = true,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) => (
  <div className={`relative mx-auto ${className}`} style={{ maxWidth: 300 }}>
    <div className={`relative rounded-[36px] border-[5px] overflow-hidden shadow-2xl ${dark ? 'border-[#1a1d24] bg-[#080B0F] shadow-black/60' : 'border-zinc-300 bg-white shadow-zinc-300/60'}`}>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-xl z-10 ${dark ? 'bg-[#1a1d24]' : 'bg-zinc-300'}`} />
      <div className="relative [&_img]:block">{children}</div>
      <div className={`flex justify-center py-1.5 ${dark ? 'bg-[#080B0F]' : 'bg-white'}`}>
        <div className={`w-24 h-1 rounded-full ${dark ? 'bg-[#9295A6]/30' : 'bg-zinc-300/60'}`} />
      </div>
    </div>
  </div>
);