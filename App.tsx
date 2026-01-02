import React, { useState, useEffect } from 'react';
import { initialTrucks, initialLoadRequests, initialBookings } from './constants';
import { Truck, LoadRequest, Persona, Theme, Booking } from './types';
import { TruckCard } from './components/TruckCard';
import { PostTripForm } from './components/PostTripForm';
import { BookingDetailModal } from './components/BookingDetailModal';
import { TruckerJobCard } from './components/TruckerJobCard';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './contexts/LanguageContext';
import { 
    LayoutDashboard, 
    Search, 
    PlusCircle, 
    User, 
    Moon, 
    Sun, 
    Briefcase, 
    Truck as TruckIcon,
    Menu,
    X,
    Filter,
    CheckCircle,
    Package,
    IndianRupee,
    BarChart3,
    History,
    Clock,
    Settings,
    LogOut,
    Languages,
    HelpCircle,
    Bell
} from 'lucide-react';

const App: React.FC = () => {
  // --- Hooks ---
  const { t, language } = useLanguage();

  // --- Global State ---
  const [theme, setTheme] = useState<Theme>('light');
  const [persona, setPersona] = useState<Persona>('factory');
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'post' | 'profile' | 'bookings' | 'earnings' | 'history'>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // --- Data State ---
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  
  // Separate Incoming Requests for Trucker
  const [truckerRequests, setTruckerRequests] = useState<Booking[]>([
      {
        id: "BK-NEW-01",
        truckId: "TRK-001", // Assuming current user is TRK-001
        factoryName: "Orange City Logistics",
        goodsType: "Electronics",
        isFragile: true,
        weight: 1.5,
        originAddress: "Nagpur Airport Cargo",
        destinationAddress: "Pune IT Park",
        price: 6500,
        status: "Pending",
        otp: "1234",
        bookingTime: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 43200000).toISOString(),
        chatHistory: []
      }
  ]);

  // --- Factory Specific State ---
  const [factorySearchTerm, setFactorySearchTerm] = useState('');
  const [selectedLoadWeight, setSelectedLoadWeight] = useState<number>(2.0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // For Modal

  // --- Effects ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (persona === 'trucker') setCurrentView('home'); 
    if (persona === 'factory') setCurrentView('search'); 
  }, [persona]);

  // --- Handlers ---
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBookTruck = (truckId: string) => {
    const truck = trucks.find(t => t.id === truckId);
    if (!truck) return;

    // Create a new booking
    const newBooking: Booking = {
        id: `BK-${Date.now()}`,
        truckId: truck.id,
        factoryName: "My Factory (You)",
        goodsType: "General Goods",
        isFragile: false,
        weight: selectedLoadWeight,
        originAddress: "Butibori MIDC, Nagpur",
        destinationAddress: "Chakan, Pune",
        price: truck.pricePerTon * selectedLoadWeight,
        status: "Accepted", // Auto-accept for demo
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        bookingTime: new Date().toISOString(),
        expiryTime: "",
        chatHistory: [{ sender: 'system', text: 'Booking request sent', timestamp: new Date().toISOString() }]
    };

    setBookings([newBooking, ...bookings]);
    
    // Update Truck Capacity
    const updatedTrucks = trucks.map(t => {
        if (t.id === truckId) {
            return {
                ...t,
                capacityFilled: t.capacityFilled + selectedLoadWeight,
                status: (t.capacityFilled + selectedLoadWeight) >= t.capacityTotal ? 'Full' : 'Partial'
            } as Truck;
        }
        return t;
    });
    setTrucks(updatedTrucks);

    showToast("Booking Successful! Track in 'My Shipments'");
  };

  const handlePostTrip = (tripData: Partial<Truck>) => {
    const newTruck: Truck = {
        id: `TRK-${Date.now()}`,
        driverName: "You (Current User)",
        driverDetails: { age: 30, sex: 'Male', licenseNumber: 'MH-31-0000', experienceYears: 5 },
        vehicleModel: "Tata Ace Gold",
        vehicleRegNo: "MH-31-NEW",
        origin: "Nagpur",
        destination: "Pune",
        departureDate: new Date().toISOString(),
        capacityTotal: 5,
        capacityFilled: 0,
        pricePerTon: 3000,
        isGroupShippingAllowed: true,
        status: "Active",
        rating: { overall: 5.0, punctuality: 5, behavior: 5, safety: 5 },
        dieselPrice: 94,
        mileage: 12,
        tollEstimate: 500,
        ...tripData
    } as Truck;

    setTrucks([newTruck, ...trucks]);
    setCurrentView('home');
    showToast("Trip Posted Successfully!");
  };

  const handleTruckerStatusUpdate = (bookingId: string, newStatus: any) => {
      // If it's in requests
      const reqIndex = truckerRequests.findIndex(b => b.id === bookingId);
      if (reqIndex !== -1) {
          if (newStatus === 'Accepted') {
              const movedBooking = { ...truckerRequests[reqIndex], status: 'Accepted' as const };
              setBookings([movedBooking, ...bookings]); // Move to active bookings
              setTruckerRequests(truckerRequests.filter(b => b.id !== bookingId));
              showToast("Job Accepted! View in Active Jobs.");
          } else {
              setTruckerRequests(truckerRequests.filter(b => b.id !== bookingId));
              showToast("Request Declined.");
          }
          return;
      }

      // If it's in active bookings
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      showToast(`Status updated to ${newStatus}`);
  };

  // --- Views ---

  const renderProfile = () => (
    <div className="space-y-6 pb-20 relative z-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('my_profile')}</h1>
        
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
            <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
                <User size={40} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {persona === 'factory' ? 'Rajesh Kumar' : 'Suresh Driver'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {persona === 'factory' ? `Factory Owner • Vidarbha Textiles` : `Truck Driver • Tata 407`}
                </p>
                <div className="flex gap-2 mt-2">
                     <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                        {persona === 'factory' ? 'Nagpur, MH' : 'MH-31-CB-1234'}
                     </span>
                     <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium border border-emerald-100 dark:border-emerald-900/30">{t('verified')}</span>
                </div>
            </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
            <div 
                className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => setShowLanguageSelector(true)}
            >
                <div className="flex items-center gap-3">
                    <Languages size={20} className="text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{t('language')}</span>
                </div>
                <span className="text-indigo-600 font-medium text-sm">
                    {language === 'en' ? 'English' : 
                     language === 'hi' ? 'हिंदी' : 
                     language === 'mr' ? 'मराठी' : 'ગુજરાતી'}
                </span>
            </div>
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                    <Bell size={20} className="text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{t('notifications')}</span>
                </div>
                <span className="text-indigo-600 text-sm font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">On</span>
            </div>
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{t('help_support')}</span>
                </div>
            </div>
             <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors text-red-600">
                <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span className="font-medium">{t('logout')}</span>
                </div>
            </div>
        </div>
        
        <div className="text-center text-xs text-slate-400 pt-4">
            Version 1.0.2 • RuralLink Logistics
        </div>
    </div>
  );

  const renderFactoryActiveShipments = () => {
      // Filter logic
      const activeStatus = ['Pending', 'Accepted', 'Pickup', 'In-Transit'];
      const activeBookings = bookings.filter(b => activeStatus.includes(b.status));

      return (
          <div className="space-y-6 pb-20 relative z-10">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('active_shipments')}</h1>
              
              <div className="grid gap-4">
                  {activeBookings.length === 0 ? (
                      <div className="text-center py-20 text-slate-500 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                          <Package className="mx-auto h-12 w-12 mb-4 opacity-20" />
                          <p>No active shipments.</p>
                          <button onClick={() => setCurrentView('search')} className="mt-4 text-indigo-600 font-bold">{t('book_truck')}</button>
                      </div>
                  ) : (
                      activeBookings.map(booking => {
                          const truck = trucks.find(t => t.id === booking.truckId) || initialTrucks[0];
                          return (
                              <div key={booking.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]" onClick={() => setSelectedBooking(booking)}>
                                  <div className="flex justify-between items-start mb-3">
                                      <div>
                                          <p className="font-bold text-lg text-slate-900 dark:text-white">{truck.destination}</p>
                                          <p className="text-xs text-slate-500">from {truck.origin}</p>
                                      </div>
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                          booking.status === 'In-Transit' ? 'bg-indigo-100 text-indigo-700' : 
                                          'bg-slate-100 text-slate-600'
                                      }`}>
                                          {booking.status}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                       <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                           <User className="h-full w-full p-1 text-slate-500" />
                                       </div>
                                       <div className="flex-1">
                                           <p className="text-sm font-medium text-slate-900 dark:text-white">{truck.driverName}</p>
                                           <p className="text-xs text-slate-500">{truck.vehicleModel}</p>
                                       </div>
                                       <div className="text-right">
                                           {booking.status === 'In-Transit' && (
                                              <p className="text-xs text-slate-500">ETA: <span className="font-bold text-indigo-600 dark:text-indigo-400">3h 20m</span></p>
                                           )}
                                           <p className="text-xs text-slate-500">{new Date(booking.bookingTime).toLocaleDateString()}</p>
                                       </div>
                                  </div>
                              </div>
                          );
                      })
                  )}
              </div>
          </div>
      );
  };

  const renderHistoryView = () => {
    const historyStatus = ['Delivered', 'Cancelled', 'Revoked', 'Completed'];
    const historyBookings = bookings.filter(b => historyStatus.includes(b.status));

    return (
        <div className="space-y-6 pb-20 relative z-10">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {persona === 'factory' ? t('booking_history') : t('ride_history')}
            </h1>
            
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
              {historyBookings.length > 0 ? (
                  historyBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${booking.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {booking.status === 'Delivered' ? <CheckCircle size={20} /> : <X size={20} />}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900 dark:text-white">{booking.destinationAddress}</p>
                                  <p className="text-xs text-slate-500">{new Date(booking.bookingTime).toLocaleDateString()} • {persona === 'factory' ? booking.goodsType : booking.factoryName}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="block font-bold text-slate-900 dark:text-white">₹{booking.price.toLocaleString()}</span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${booking.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{booking.status}</span>
                          </div>
                      </div>
                  ))
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                    <History size={48} className="mb-4 opacity-20" />
                    <p>{t('no_history')}</p>
                </div>
              )}
          </div>
        </div>
    );
  };

  const renderFactoryFeed = () => {
    const filteredTrucks = trucks.filter(t => 
        (t.destination.toLowerCase().includes(factorySearchTerm.toLowerCase()) || 
         t.origin.toLowerCase().includes(factorySearchTerm.toLowerCase())) &&
        t.status !== 'Full'
    );

    return (
        <div className="space-y-6 pb-20 relative z-10">
            {/* Search Header */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-4 -mx-4 md:-mx-8 px-4 md:px-8 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 px-1">{t('find_transport')}</h1>
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder={t('where_to')} 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none shadow-sm dark:text-white transition-all"
                            value={factorySearchTerm}
                            onChange={(e) => setFactorySearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
                
                {/* Weight Context */}
                <div className="flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <span className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">{t('my_load_weight')}:</span>
                    <input 
                        type="number" 
                        min="0.1" max="10" step="0.1"
                        value={selectedLoadWeight}
                        onChange={(e) => setSelectedLoadWeight(parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 rounded text-right font-bold bg-white dark:bg-slate-800 dark:text-white border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Grid Layout for Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {filteredTrucks.length > 0 ? (
                    filteredTrucks.map(truck => (
                        <TruckCard 
                            key={truck.id} 
                            truck={truck} 
                            userLoadWeight={selectedLoadWeight}
                            onBook={handleBookTruck}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-500 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl">
                        <p>{t('no_trucks')}</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderTruckerDashboard = () => (
    <div className="space-y-8 pb-20 relative z-10">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('job_board')}</h1>
            <button 
                onClick={() => setCurrentView('post')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
            >
                <PlusCircle size={18} /> {t('post_trip')}
            </button>
        </div>

        {/* Incoming Section */}
        {truckerRequests.length > 0 && (
            <section>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    {t('incoming_requests')} ({truckerRequests.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {truckerRequests.map(req => (
                        <TruckerJobCard 
                            key={req.id} 
                            booking={req} 
                            type="incoming"
                            onUpdateStatus={handleTruckerStatusUpdate} 
                        />
                    ))}
                </div>
            </section>
        )}

        {/* Active Jobs Section */}
        <section>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('active_jobs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Filter bookings related to this trucker (using demo data logic) */}
                 {bookings.filter(b => b.status !== 'Delivered').map(job => (
                      <TruckerJobCard 
                        key={job.id} 
                        booking={job} 
                        type="active"
                        onUpdateStatus={handleTruckerStatusUpdate} 
                    />
                 ))}
                 {bookings.filter(b => b.status !== 'Delivered').length === 0 && (
                     <div className="col-span-full p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-slate-400 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
                         No active jobs currently.
                     </div>
                 )}
            </div>
        </section>
    </div>
  );

  const renderTruckerEarnings = () => {
    // Filter for delivered/completed trips. In a real app, verify truck ownership.
    const completedTrips = bookings.filter(b => b.status === 'Delivered' || b.status === 'Completed');
    const totalEarnings = completedTrips.reduce((acc, curr) => acc + curr.price, 0);

    return (
      <div className="space-y-6 pb-20 relative z-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('earnings')}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-xl shadow-xl shadow-indigo-500/20 border border-indigo-500/50">
                  <p className="text-indigo-100 text-sm font-medium">{t('total_earnings')}</p>
                  <p className="text-3xl font-bold mt-2">₹{totalEarnings.toLocaleString()}</p>
                  <div className="mt-4 h-1 w-full bg-indigo-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-200/50 w-[70%]"></div>
                  </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium">{t('completed_trips')}</p>
                  <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{completedTrips.length}</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium">{t('pending_payout')}</p>
                  <p className="text-3xl font-bold mt-2 text-amber-500">₹0</p>
              </div>
          </div>
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 backdrop-blur-sm p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mt-4 flex items-center justify-between">
              <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-200">{t('view_history')}</h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">Check details of all past completed trips.</p>
              </div>
              <button onClick={() => setCurrentView('history')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                  {t('history')}
              </button>
          </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative selection:bg-indigo-100 selection:text-indigo-700">
        
        {/* --- BACKGROUND LAYERS --- */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {/* Base Background Color */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"></div>

            {/* MAP PATTERN LAYER */}
            {/* A stylized road/route pattern using SVG background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%2364748b' stroke-width='1' stroke-dasharray='4 4'/%3E%3Cpath d='M30 30h40v40h-40z' fill='none' stroke='%2364748b' stroke-width='1' stroke-dasharray='2 2'/%3E%3Ccircle cx='50' cy='50' r='10' fill='none' stroke='%2364748b' stroke-width='1'/%3E%3Cpath d='M0 0l100 100M100 0L0 100' stroke='%2364748b' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            ></div>
            
            {/* LITTLE TRUCKS LAYER */}
            {/* Scattered watermarks of trucks */}
            <div className="absolute top-[10%] left-[5%] text-slate-400/10 dark:text-slate-500/10 rotate-12 transform hover:scale-110 transition-transform duration-1000">
                <TruckIcon size={120} strokeWidth={1.5} />
            </div>
            <div className="absolute top-[40%] right-[10%] text-slate-400/10 dark:text-slate-500/10 -rotate-12">
                <TruckIcon size={180} strokeWidth={1} />
            </div>
            <div className="absolute bottom-[15%] left-[20%] text-slate-400/10 dark:text-slate-500/10 rotate-6">
                <TruckIcon size={140} strokeWidth={1.5} />
            </div>
            <div className="absolute top-[20%] right-[30%] text-slate-400/5 dark:text-slate-500/5 -rotate-45">
                <TruckIcon size={80} strokeWidth={2} />
            </div>
            <div className="absolute bottom-[30%] right-[5%] text-slate-400/5 dark:text-slate-500/5 rotate-90">
                <TruckIcon size={100} strokeWidth={1} />
            </div>

            {/* AMBIENT GLOWS (Kept for elevation) */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        </div>

        {/* Language Modal */}
        <LanguageSelector isOpen={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />

        {/* --- Top Navigation --- */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 px-4 md:px-8 py-3 transition-all">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left Side: Logo & Persona */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/30">
                            <TruckIcon className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                            {t('app_name')}
                        </span>
                    </div>

                    {/* Desktop Persona Switcher */}
                    <div className="hidden md:flex bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg backdrop-blur-sm">
                        {(['factory', 'trucker'] as Persona[]).map(p => (
                                <button 
                                key={p}
                                onClick={() => setPersona(p)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${
                                    persona === p
                                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {p === 'factory' ? t('factory_owner') : t('truck_driver')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center/Right: Navigation Links (Desktop Only) */}
                <div className="hidden md:flex items-center gap-8">
                     {persona === 'factory' ? (
                        <>
                            <button onClick={() => setCurrentView('search')} className={`text-sm font-medium transition-colors ${currentView === 'search' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('find_transport')}
                            </button>
                            <button onClick={() => setCurrentView('bookings')} className={`text-sm font-medium transition-colors ${currentView === 'bookings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('active_shipments')}
                            </button>
                                <button onClick={() => setCurrentView('history')} className={`text-sm font-medium transition-colors ${currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('history')}
                            </button>
                        </>
                    ) : (
                        <>
                                <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('job_board')}
                            </button>
                                <button onClick={() => setCurrentView('post')} className={`text-sm font-medium transition-colors ${currentView === 'post' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('post_trip')}
                            </button>
                                <button onClick={() => setCurrentView('earnings')} className={`text-sm font-medium transition-colors ${currentView === 'earnings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('earnings')}
                            </button>
                                <button onClick={() => setCurrentView('history')} className={`text-sm font-medium transition-colors ${currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}>
                                {t('history')}
                            </button>
                        </>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-full transition-colors">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    
                    <button 
                        onClick={() => setCurrentView('profile')} 
                        className={`hidden md:flex p-2 rounded-full transition-colors ${currentView === 'profile' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-700/50'}`}
                        title={t('my_profile')}
                    >
                        <User size={20} />
                    </button>

                    <button 
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            
            {showMobileMenu && (
                <div className="md:hidden mt-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-b-xl shadow-lg absolute left-0 right-0 px-4">
                     <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{t('switch_persona')}</p>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => { setPersona('factory'); setShowMobileMenu(false); }}
                            className={`p-3 rounded-lg flex items-center gap-3 ${persona === 'factory' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            <Briefcase size={18} /> {t('factory_owner')}
                        </button>
                        <button 
                            onClick={() => { setPersona('trucker'); setShowMobileMenu(false); }}
                            className={`p-3 rounded-lg flex items-center gap-3 ${persona === 'trucker' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            <TruckIcon size={18} /> {t('truck_driver')}
                        </button>
                    </div>
                </div>
            )}
        </nav>

        {/* --- Main Content --- */}
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 relative z-10">
            {notification && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce w-full max-w-sm px-4">
                    <div className="bg-emerald-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-center gap-2 border border-emerald-500/50">
                        <CheckCircle size={20} />
                        <span className="font-medium text-sm">{notification}</span>
                    </div>
                </div>
            )}

            {currentView === 'post' && (
                <PostTripForm 
                    onPost={handlePostTrip} 
                    onCancel={() => setCurrentView('home')} 
                />
            )}

            {currentView !== 'post' && (
                <>
                    {currentView === 'profile' ? renderProfile() : (
                         currentView === 'history' ? renderHistoryView() : (
                             persona === 'trucker' ? (
                                currentView === 'earnings' ? renderTruckerEarnings() : renderTruckerDashboard()
                            ) : (
                                currentView === 'bookings' ? renderFactoryActiveShipments() : renderFactoryFeed()
                            )
                        )
                    )}
                </>
            )}
        </main>

        {/* --- Booking Detail Modal (Factory Only) --- */}
        {selectedBooking && (
            <BookingDetailModal 
                booking={selectedBooking}
                truck={trucks.find(t => t.id === selectedBooking.truckId)}
                onClose={() => setSelectedBooking(null)}
            />
        )}

        {/* --- Mobile Bottom Navigation --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-700/60 px-2 py-2 flex justify-around items-center z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {persona === 'factory' ? (
                <>
                    <button onClick={() => setCurrentView('search')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'search' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <Search size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('search')}</span>
                    </button>
                     <button onClick={() => setCurrentView('bookings')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'bookings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <Package size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('shipments')}</span>
                    </button>
                    <button onClick={() => setCurrentView('history')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <Clock size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('history')}</span>
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <LayoutDashboard size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('jobs')}</span>
                    </button>
                     <button onClick={() => setCurrentView('post')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'post' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <PlusCircle size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('post')}</span>
                    </button>
                     <button onClick={() => setCurrentView('earnings')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'earnings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <BarChart3 size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('earnings')}</span>
                    </button>
                     <button onClick={() => setCurrentView('history')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <Clock size={22} />
                        <span className="text-[10px] font-medium mt-1">{t('history')}</span>
                    </button>
                </>
            )}
             <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${currentView === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                <User size={22} />
                <span className="text-[10px] font-medium mt-1">{t('profile')}</span>
            </button>
        </div>
    </div>
  );
};

export default App;