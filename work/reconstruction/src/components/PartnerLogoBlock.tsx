import React from 'react';

const partners = [
  'Plaid',
  'Adobe',
  'Atlassian',
  'Boeing',
  'ClickUp',
  'Coinbase',
  'Duolingo',
  'Google',
  'Gusto',
  'Microsoft',
  'Paypal',
  'SoFi',
  'Stripe',
  'Zillow'
];

function LogosRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start flex flex-row items-center gap-2000 pr-1200 flex-[1_0_auto] [--speed:40s] [@media_screen_and_(width_<=_768px)]:gap-800 [@media_screen_and_(width_<=_768px)]:pr-800 LogoBlock-module__Fd2UBW__logosRow"
    >
      {partners.map((name) => (
        <div
          key={name}
          className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col flex shrink-0 justify-center items-center h-1200"
        >
          <div
            data-brand-hover=""
            className="w-auto h-full flex items-center justify-center aspect-[220/96] [@media_screen_and_(width_>_768px)]:max-w-[130px] rounded-8 border border-dashed border-[hsl(30deg_7%_82%/100%)] bg-[hsl(33deg_47%_96%/100%)] px-300 text-color-placeholder text-[13px] font-brand font-medium select-none"
          >
            [Logo: {name}]
          </div>
        </div>
      ))}
    </div>
  );
}

export function PartnerLogoBlock() {
  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 pt-1000 items-center justify-center max-w-full">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 py-1600 relative w-full overflow-hidden text-color-placeholder mask-[linear-gradient(to_right,_transparent_0%,_transparent_max(0px,_calc((100%_-_1550px)_/_2)),_black_max(80px,_calc((100%_-_1390px)_/_2)),_black_min(calc(100%_-_80px),_calc((100%_+_1390px)_/_2)),_transparent_min(100%,_calc((100%_+_1550px)_/_2)),_transparent_100%)] before:absolute before:inset-0 before:pointer-events-none before:content-[''] before:shadow-[inset_0_0_73px_7px_#faf6f1] [@media_screen_and_(width_<=_768px)]:py-1200">
        <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex flex-row items-center w-full overflow-hidden LogoBlock-module__Fd2UBW__scrollContainer">
          <LogosRow />
          <LogosRow ariaHidden />
          <LogosRow ariaHidden />
          <LogosRow ariaHidden />
        </div>
      </div>
    </div>
  );
}
