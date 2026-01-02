import React from 'react';
import { Truck } from '../types';
import { Truck as TruckIcon, MapPin, Calendar, Star, Weight, Info, ShieldCheck } from 'lucide-react';

interface TruckCardProps {
  truck: Truck;
  userLoadWeight?: number;
  onBook?: (truckId: string) => void;
}

export const TruckCard: React.FC<TruckCardProps> = ({ truck, userLoadWeight = 0, onBook }) => {
  const remainingCapacity = truck.capacityTotal - truck.capacityFilled;
  const fillPercentage = (truck.capacityFilled / truck.capacityTotal) * 100;
  
  const canBook = userLoadWeight > 0 && remainingCapacity >= userLoadWeight;
  const isGroupShipping = truck.isGroupShippingAllowed;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full">
      
      {/* Header / Badge */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
         {isGroupShipping && (
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
              Pooling
            </span>
         )}
         <span className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold shadow-sm border border-slate-100 dark:border-slate-600">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {truck.rating.overall}
         </span>
      </div>

      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <TruckIcon className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{truck.vehicleModel}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{truck.driverName} • {truck.driverDetails.experienceYears}y Exp</p>
                <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{truck.vehicleRegNo}</span>
                    {truck.rating.safety > 4.5 && (
                        <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck size={10} /> Safe Driver
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Route Info */}
        <div className="mt-5 relative pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-4">
            <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">From</p>
                <p className="font-medium text-slate-900 dark:text-white text-sm">{truck.origin}</p>
            </div>
            <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800"></div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">To</p>
                <p className="font-medium text-slate-900 dark:text-white text-sm">{truck.destination}</p>
            </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Load Capacity</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {remainingCapacity}T Free
                </span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-slate-400 dark:bg-slate-500 absolute left-0 top-0"
                    style={{ width: `${fillPercentage}%` }}
                ></div>
                {canBook && (
                   <div 
                      className="h-full bg-emerald-500 absolute top-0 opacity-80 animate-pulse"
                      style={{ 
                          left: `${fillPercentage}%`,
                          width: `${((userLoadWeight) / truck.capacityTotal) * 100}%` 
                      }}
                   ></div>
                )}
            </div>
        </div>

        {/* Savings Badge */}
        {canBook && isGroupShipping && (
            <div className="mt-3">
                <p className="text-[11px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 border border-emerald-100 dark:border-emerald-900/30">
                    <Info size={12} />
                    <span>Group Shipping: Save ~40%</span>
                </p>
            </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Price</p>
            <p className="font-bold text-lg text-slate-900 dark:text-white">
                ₹{userLoadWeight > 0 ? (truck.pricePerTon * userLoadWeight).toLocaleString() : truck.pricePerTon.toLocaleString() + '/t'}
            </p>
        </div>

        {onBook && (
            <button 
                onClick={() => onBook(truck.id)}
                disabled={!canBook}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all transform active:scale-95 ${
                    canBook 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
            >
                {canBook ? 'Book Now' : 'Full'}
            </button>
        )}
      </div>
    </div>
  );
};
