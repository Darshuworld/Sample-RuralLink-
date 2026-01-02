import React, { useState } from 'react';
import { Booking, Truck } from '../types';
import { 
    X, Phone, MessageCircle, Map as MapIcon, ShieldAlert, 
    User, Calendar, Package, Navigation, Clock, CreditCard, Box
} from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking;
  truck?: Truck;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, truck, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [chatMessage, setChatMessage] = useState('');
  
  if (!truck) return null;

  const isSOS = false; // State for SOS trigger

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors">
                <X size={20} />
            </button>

            {/* Left Column: Map & Status (Mobile: Top) */}
            <div className="w-full md:w-5/12 bg-slate-100 dark:bg-slate-800 flex flex-col relative h-[40vh] md:h-full">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover bg-center grayscale mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-xl animate-pulse">
                        <Navigation className="text-indigo-600 dark:text-indigo-400 transform rotate-45" size={32} />
                    </div>
                </div>
                
                {/* Status Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${booking.status === 'In-Transit' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                        <span className="font-bold uppercase tracking-wider text-sm">{booking.status}</span>
                    </div>
                    <h2 className="text-xl font-bold">Arriving in ~3h 15m</h2>
                    <p className="text-sm opacity-80 text-slate-200">Near Wardha Highway Checkpost</p>
                </div>
            </div>

            {/* Right Column: Details & Tabs (Mobile: Bottom) */}
            <div className="w-full md:w-7/12 flex flex-col h-[60vh] md:h-full bg-white dark:bg-slate-900">
                
                {/* Tab Header */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Shipment Details
                    </button>
                    <button 
                         onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-4 font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        <MessageCircle size={16} /> Driver Chat
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {activeTab === 'details' ? (
                        <div className="space-y-8">
                            
                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors">
                                    <ShieldAlert size={18} /> SOS / Report
                                </button>
                                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors">
                                    <Phone size={18} /> Call Driver
                                </button>
                            </div>

                            {/* Cargo & Payment Info (New Section) */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cargo & Payment</h3>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <Box size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Goods Type</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{booking.goodsType}</p>
                                                <p className="text-[10px] text-slate-500">{booking.isFragile ? 'Fragile' : 'Standard'} Handling</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Total Weight</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{booking.weight} Tons</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={16} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Price</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">₹{booking.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Driver Profile */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Driver & Vehicle</h3>
                                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                        <User size={24} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{truck.driverName}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {truck.driverDetails.age} yrs • {truck.driverDetails.sex} • {truck.driverDetails.experienceYears}y Exp
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">DL: {truck.driverDetails.licenseNumber}</p>
                                        <div className="flex gap-4 mt-2">
                                            <div className="text-xs">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">★ {truck.rating.overall}</span>
                                                <span className="text-slate-400 ml-1">Overall</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="font-bold text-green-600 dark:text-green-400">{truck.rating.safety}</span>
                                                <span className="text-slate-400 ml-1">Safety</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Pooling Info */}
                            {booking.coLoaders && booking.coLoaders.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Load Sharing Partners</h3>
                                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="text-indigo-600 dark:text-indigo-400" size={16} />
                                            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Shared Shipment</span>
                                        </div>
                                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                                            You are sharing this truck with: <span className="font-bold">{booking.coLoaders.join(", ")}</span>.
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Timeline */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Route & Timeline</h3>
                                <div className="space-y-6 pl-2 relative border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 border-4 border-white dark:border-slate-900"></div>
                                        <p className="text-xs text-slate-500">Origin</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{booking.originAddress}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(booking.bookingTime).toLocaleString()}</p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900 animate-ping opacity-75"></div>
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900"></div>
                                        <p className="text-xs text-indigo-600 font-bold">Current Status</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{booking.status}</p>
                                        <p className="text-xs text-slate-500 mt-1">Expected Delivery: Today, 06:00 PM</p>
                                    </div>
                                     <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-white dark:border-slate-900"></div>
                                        <p className="text-xs text-slate-500">Destination</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{booking.destinationAddress}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-4">
                                {booking.chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'factory' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                            msg.sender === 'factory' 
                                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                            <p className={`text-[10px] mt-1 ${msg.sender === 'factory' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                />
                                <button className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                                    <Navigation size={20} className="rotate-90" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};