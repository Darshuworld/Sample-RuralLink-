import React from 'react';
import { Booking } from '../types';
import { Clock, MapPin, Package, CheckCircle, AlertCircle, Phone, Navigation } from 'lucide-react';

interface TruckerJobCardProps {
  booking: Booking;
  onUpdateStatus: (id: string, newStatus: any) => void;
  type: 'incoming' | 'active';
}

export const TruckerJobCard: React.FC<TruckerJobCardProps> = ({ booking, onUpdateStatus, type }) => {
  const isIncoming = type === 'incoming';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 ${isIncoming ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}>
            <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    isIncoming ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                    {isIncoming ? 'New Request' : booking.status}
                </span>
                {isIncoming && (
                    <div className="flex items-center gap-1 text-xs text-red-500 font-medium mt-1">
                        <Clock size={12} /> Expires in 11h 59m
                    </div>
                )}
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500">Earnings</p>
                <p className="font-bold text-slate-900 dark:text-white">₹{booking.price.toLocaleString()}</p>
            </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
            
            {/* Customer Info */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {booking.factoryName.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{booking.factoryName}</h4>
                    <p className="text-xs text-slate-500">{booking.goodsType} • {booking.weight} Tons {booking.isFragile && '• Fragile'}</p>
                </div>
                {!isIncoming && (
                    <button className="ml-auto p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                        <Phone size={18} />
                    </button>
                )}
            </div>

            {/* Route */}
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                <div className="relative pl-4">
                    <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-400"></div>
                    <p className="text-xs text-slate-400">Pickup</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{booking.originAddress}</p>
                </div>
                <div className="relative pl-4">
                    <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                    <p className="text-xs text-slate-400">Drop</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{booking.destinationAddress}</p>
                </div>
            </div>
            
            {!isIncoming && (
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">Pickup OTP</p>
                        <p className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">{booking.otp}</p>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium flex items-center gap-1">
                        <Navigation size={14} /> Open Map
                    </button>
                </div>
            )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
            {isIncoming ? (
                <div className="flex gap-3">
                    <button onClick={() => onUpdateStatus(booking.id, 'Revoked')} className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-100">
                        Decline
                    </button>
                    <button onClick={() => onUpdateStatus(booking.id, 'Accepted')} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-md">
                        Accept Load
                    </button>
                </div>
            ) : (
                 <div className="w-full">
                    {booking.status === 'Accepted' && (
                        <button onClick={() => onUpdateStatus(booking.id, 'In-Transit')} className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2">
                             Confirm Pickup
                        </button>
                    )}
                    {booking.status === 'In-Transit' && (
                         <button onClick={() => onUpdateStatus(booking.id, 'Delivered')} className="w-full py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm flex items-center justify-center gap-2">
                             <CheckCircle size={16} /> Mark Delivered
                        </button>
                    )}
                 </div>
            )}
        </div>
    </div>
  );
};
