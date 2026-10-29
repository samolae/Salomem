import type { ReactNode } from 'react';
import { BakedShell } from './shell';
import { MoreCases } from './case-studies';

/*
 * The product cases (AURUM, Schenker, Unispace) keep their own art
 * direction, but sit in the same site frame as every other case: the site
 * nav on top, "More case studies" and the footer at the end, one exit.
 * Their old in-page bar (Back to Portfolio) is hidden.
 */
export function ProductCase({ current, children }: { current: string; children: ReactNode }) {
  return (
    <BakedShell>
      <style>{`.product-case nav[aria-label="Case study"],.product-case [aria-label="Back to top"]{display:none!important}`}</style>
      <div className="product-case">{children}</div>
      <div className="bg-white pb-6"><MoreCases current={current} /></div>
    </BakedShell>
  );
}
