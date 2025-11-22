import React from 'react';
import { CheckCircle, Crown, Zap, Shield } from 'lucide-react';

const Premium: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-royal-900 flex items-center justify-center p-4 pb-24">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        <div>
          <span className="inline-block p-3 rounded-2xl bg-bengal-500/10 text-bengal-600 dark:text-bengal-500 mb-6">
            <Crown className="w-8 h-8" />
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-royal-900 dark:text-white mb-6 leading-tight">
            খবরের অভিজ্ঞতায় আসুক <span className="text-royal-600 dark:text-bengal-500">নতুন মাত্রা</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            বঙ্গ নিউজ প্রিমিয়ামের সাথে পান বিজ্ঞাপন মুক্ত, দ্রুত এবং এক্সক্লুসিভ খবরের অভিজ্ঞতা। আজই সাবস্ক্রাইব করুন।
          </p>
          
          <div className="space-y-4 mb-8">
            {[
              'সম্পূর্ণ বিজ্ঞাপন মুক্ত অভিজ্ঞতা',
              'সবার আগে ব্রেকিং নিউজ নোটিফিকেশন',
              'ডার্ক মোড এবং রিডিং মোড',
              'প্রিমিয়াম আর্টিকেলে আনলিমিটেড অ্যাক্সেস'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium dark:text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-royal-600 to-purple-600 rounded-2xl blur opacity-25"></div>
           <div className="relative bg-white dark:bg-royal-800 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-royal-700">
              <div className="text-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-royal-600 dark:text-bengal-500 mb-2">Best Value</h3>
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  ₹৩৯৯<span className="text-lg font-normal text-slate-400">/বছর</span>
                </div>
                <p className="text-slate-400 text-sm">অথবা মাত্র ₹৪৯/মাস</p>
              </div>

              <button className="w-full py-4 bg-royal-600 hover:bg-royal-700 text-white font-bold rounded-xl shadow-lg shadow-royal-600/30 transition-transform transform hover:scale-105 mb-4">
                এখনই সাবস্ক্রাইব করুন
              </button>
              <p className="text-center text-xs text-slate-400">
                যেকোনো সময় বাতিল করা যাবে। শর্তাবলী প্রযোজ্য।
              </p>

              <div className="mt-8 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 dark:bg-royal-900 rounded-lg">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-bengal-500" />
                  <span className="text-[10px] font-bold uppercase dark:text-slate-300">Fast</span>
                </div>
                 <div className="p-2 bg-slate-50 dark:bg-royal-900 rounded-lg">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-green-500" />
                  <span className="text-[10px] font-bold uppercase dark:text-slate-300">Secure</span>
                </div>
                 <div className="p-2 bg-slate-50 dark:bg-royal-900 rounded-lg">
                  <Crown className="w-5 h-5 mx-auto mb-1 text-royal-500" />
                  <span className="text-[10px] font-bold uppercase dark:text-slate-300">VIP</span>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Premium;