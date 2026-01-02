import React, { useState } from 'react';
import { Truck } from '../types';
import { MapPin, Truck as TruckIcon, Calendar, Weight, IndianRupee, Gauge } from 'lucide-react';

interface PostTripFormProps {
  onPost: (trip: Partial<Truck>) => void;
  onCancel: () => void;
}

export const PostTripForm: React.FC<PostTripFormProps> = ({ onPost, onCancel }) => {
  const [formData, setFormData] = useState({
    origin: 'Nagpur',
    destination: '',
    departureDate: '',
    capacityTotal: 5,
    isGroupShippingAllowed: true,
    pricePerTon: 3000,
    dieselPrice: 94,
    mileage: 12,
    tollEstimate: 500
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPost({
        ...formData,
        capacityFilled: 0,
        status: 'Active',
        rating: { overall: 5.0, punctuality: 5, behavior: 5, safety: 5 },
        vehicleModel: "Tata Ace Gold (My Truck)",
        vehicleRegNo: "MH-31-NEW-01",
        driverDetails: {
            age: 35,
            sex: 'Male',
            experienceYears: 10,
            licenseNumber: "MH-31-DL-NEW"
        }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto border border-slate-100 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
             <TruckIcon className="text-indigo-600 dark:text-indigo-400" /> 
        </div>
        Post Return Trip
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Route Section */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Route Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. Pune"
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    />
                  </div>
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="date" 
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Capacity (Tons)</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      step="0.5"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.capacityTotal}
                      onChange={(e) => setFormData({...formData, capacityTotal: Number(e.target.value)})}
                    />
                  </div>
                </div>
            </div>
        </div>

        {/* Economics Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Economics & Pricing</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price Per Ton (₹)</label>
                     <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                        type="number" 
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.pricePerTon}
                        onChange={(e) => setFormData({...formData, pricePerTon: Number(e.target.value)})}
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Mileage (km/l)</label>
                    <input 
                       type="number"
                       className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                       value={formData.mileage}
                       onChange={(e) => setFormData({...formData, mileage: Number(e.target.value)})}
                    />
                 </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Est. Tolls (₹)</label>
                    <input 
                       type="number"
                       className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                       value={formData.tollEstimate}
                       onChange={(e) => setFormData({...formData, tollEstimate: Number(e.target.value)})}
                    />
                 </div>
             </div>
        </div>

        <div className="pt-2">
            <label className="flex items-center gap-3 p-4 border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                <input 
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                    checked={formData.isGroupShippingAllowed}
                    onChange={(e) => setFormData({...formData, isGroupShippingAllowed: e.target.checked})}
                />
                <div>
                    <span className="block font-medium text-slate-900 dark:text-slate-100">Allow Group Shipping (Pooling)</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Maximize earnings by filling empty space with multiple small loads.</span>
                </div>
            </label>
        </div>

        <div className="flex gap-4 pt-4">
            <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2"
            >
                Post Trip
            </button>
        </div>
      </form>
    </div>
  );
};
