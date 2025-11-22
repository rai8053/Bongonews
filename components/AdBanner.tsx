import React, { useEffect } from 'react';

interface AdBannerProps {
  variant?: 'banner' | 'box';
}

const AdBanner: React.FC<AdBannerProps> = ({ variant = 'banner' }) => {
  useEffect(() => {
    // This attempts to push ads to the Google AdSense script if it exists.
    // This fails gracefully if the script isn't loaded or if using an ad blocker.
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ad blocker or script not loaded
    }
  }, []);

  if (variant === 'box') {
    return (
      <div className="w-full p-4 my-6">
        <div className="w-full min-h-[250px] bg-slate-100 dark:bg-royal-800 rounded-lg border border-dashed border-slate-300 dark:border-royal-600 flex flex-col items-center justify-center overflow-hidden relative">
           
           {/* Placeholder for Real Google Ad */}
           {/* <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-YOUR_ID_HERE"
               data-ad-slot="YOUR_SLOT_ID_HERE"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins> */}

           {/* Mock Ad for Demo */}
           <span className="text-xs uppercase tracking-widest font-bold mb-2 text-slate-400">Advertisement</span>
           <div className="text-center px-4 z-10">
             <p className="text-royal-600 dark:text-bengal-500 font-bold text-lg">আপনার ব্যবসার প্রচার এখানে করুন</p>
             <p className="text-sm mt-1 text-slate-500">Contact us to place your ad here</p>
           </div>
           <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-bengal-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2 bg-slate-50 dark:bg-royal-950/50 border-y border-slate-200 dark:border-royal-800 flex justify-center items-center my-2 overflow-hidden">
      {/* Placeholder for Real Google Ad (Banner) */}
      {/* <ins className="adsbygoogle"
           style={{ display: 'inline-block', width: '320px', height: '50px' }}
           data-ad-client="ca-pub-YOUR_ID_HERE"
           data-ad-slot="YOUR_SLOT_ID_HERE"></ins> */}
      
      <div className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-2">
        <span>Advertisement</span> • <span>Google Ads</span>
      </div>
    </div>
  );
};

export default AdBanner;