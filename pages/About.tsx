import React from 'react';
import { Megaphone, Heart, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-24">
      <h1 className="text-3xl font-bold font-serif mb-6 dark:text-white">আমাদের সম্পর্কে</h1>
      
      <div className="bg-white dark:bg-royal-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-royal-700 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
        <p>
          <span className="font-bold text-royal-600 dark:text-bengal-500">বঙ্গ নিউজ</span> হলো আপনার এলাকার সবচেয়ে বিশ্বস্ত ডিজিটাল সংবাদ মাধ্যম। আমরা নিউ টাউন, সল্টলেক এবং রাজারহাট এলাকার স্থানীয় খবরের উপর বিশেষ গুরুত্ব দিয়ে থাকি।
        </p>
        <p>
          আমাদের লক্ষ্য হলো প্রযুক্তির ব্যবহারের মাধ্যমে সঠিক এবং নিরপেক্ষ খবর আপনাদের কাছে দ্রুত পৌঁছে দেওয়া।
        </p>
        
        <hr className="border-slate-200 dark:border-royal-700 my-6" />
        
        {/* Monetization / Advertise Section */}
        <div className="bg-royal-50 dark:bg-royal-900/50 p-6 rounded-xl border border-royal-100 dark:border-royal-700">
          <h3 className="flex items-center gap-2 font-bold text-xl text-royal-700 dark:text-bengal-500 mb-4">
            <Megaphone className="w-5 h-5" />
            বিজ্ঞাপন দিন (Advertise with Us)
          </h3>
          <p className="mb-4 text-sm">
            আপনি কি আপনার ব্যবসার প্রচার করতে চান? বঙ্গ নিউজের হাজার হাজার পাঠকের কাছে আপনার পণ্য বা পরিষেবা পৌঁছে দিন।
          </p>
          <ul className="list-disc list-inside text-sm space-y-2 mb-6 text-slate-700 dark:text-slate-400">
             <li>ব্যানার বিজ্ঞাপন (Banner Ads)</li>
             <li>স্পনসরড আর্টিকেল (Sponsored Articles)</li>
             <li>সোশ্যাল মিডিয়া প্রচার</li>
          </ul>
          <a href="mailto:ads@bongonews.local" className="inline-flex items-center gap-2 px-4 py-2 bg-royal-600 text-white rounded-lg font-bold text-sm hover:bg-royal-700 transition">
             <Mail className="w-4 h-4" /> যোগাযোগ করুন
          </a>
        </div>

        <hr className="border-slate-200 dark:border-royal-700" />

        {/* Support Section */}
        <div>
           <h3 className="flex items-center gap-2 font-bold text-lg dark:text-white mb-2">
            <Heart className="w-5 h-5 text-red-500" /> সাপোর্ট করুন
           </h3>
           <p className="text-sm">স্বাধীন সাংবাদিকতা বাঁচিয়ে রাখতে আমাদের পাশে থাকুন।</p>
           {/* In a real app, add UPI QR Code here */}
        </div>

        <div className="pt-4">
          <p className="font-bold text-sm">Contact:</p>
          <p className="text-sm">Email: contact@bongonews.local</p>
          <p className="text-sm">Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default About;