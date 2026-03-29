import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../constants/siteConfig';
import ServiceSelector from './booking/ServiceSelector';
import BookingCalendar from './booking/BookingCalendar';
import TimeSlots from './booking/TimeSlots';
import ClientForm from './booking/ClientForm';
import BookingConfirmation from './booking/BookingConfirmation';
import EmployeeSelector from './booking/EmployeeSelector';
import PaymentChoice from './booking/PaymentChoice';
import { createBooking, createGroupBooking, initiatePayment, getPaymentStatus } from '../lib/api';
import { SimpliEmployee } from '../lib/types';
import CartItemDisplay from './booking/CartItem';

type BookingMode = 'CALL' | 'ONLINE' | null;

interface CartItemState {
  serviceId: string | null;
  service: { id: string; name: string; duration: number; price: number } | null;
  employeeId: string | null;
  employee: { id: string; first_name: string; last_name: string } | null;
  date: string | null;
  time: string | null;
  activeSubStep: 'service' | 'employee' | 'date' | 'time';
}

const emptyCartItem: CartItemState = {
  serviceId: null,
  service: null,
  employeeId: null,
  employee: null,
  date: null,
  time: null,
  activeSubStep: 'service',
};

const Booking: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>(null);
  const [step, setStep] = useState(1);

  const [clientData, setClientData] = useState<{ name: string; phone: string; email?: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItemState[]>([emptyCartItem]);
  const [cartClientData, setCartClientData] = useState<{ name: string; phone: string; email?: string } | null>(null);
  const [cartStep, setCartStep] = useState<'client' | 'cart'>('client');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [pendingTotalPrice, setPendingTotalPrice] = useState<number>(0);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'failed' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');

    if (!session) return;

    window.history.replaceState({}, '', window.location.pathname);
    setIsModalOpen(true);
    setIsSubmitting(true);

    getPaymentStatus(session)
      .then(({ status }) => {
        setIsSubmitting(false);
        setPaymentStatus(status === 'paid' ? 'paid' : 'failed');
      })
      .catch(() => {
        setIsSubmitting(false);
        setPaymentStatus('failed');
      });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setBookingMode(null); // Show initial choice in modal if needed, or default
    setStep(1);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookingMode(null);
    // Reset states after animation if needed, but simple reset on open is safer
  };

  const resetFlow = () => {
    setStep(1);
    setClientData(null);
    setCartItems([emptyCartItem]);
    setCartClientData(null);
    setCartStep('client');
    setBookingMode(null);
    setSubmitSuccess(false);
    setSubmitError(null);
    setPendingBookingId(null);
    setPendingTotalPrice(0);
    setIsInitiatingPayment(false);
    setPaymentStatus(null);
  };

  const isCartItemComplete = (item: CartItemState) =>
    Boolean(item.serviceId && item.employeeId && item.date && item.time);

  const updateActiveItem = (updates: Partial<CartItemState>) =>
    setCartItems((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...updates };
      return next;
    });

  const handleRemoveCartItem = (index: number) => {
    if (index === 0) return;
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCartSubmit = async () => {
    if (!cartClientData || cartItems.some((item) => !isCartItemComplete(item))) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const normalizedPhone = cartClientData.phone.replace(/[\s-]/g, '');
      let bookingId: string;

      if (cartItems.length === 1) {
        const [firstItem] = cartItems;
        const result = await createBooking({
          name: cartClientData.name,
          phone: normalizedPhone,
          ...(cartClientData.email ? { email: cartClientData.email } : {}),
          serviceId: firstItem.serviceId!,
          employeeId: firstItem.employeeId!,
          date: firstItem.date!,
          time: firstItem.time!,
        });
        bookingId = result.booking.id;
      } else {
        const result = await createGroupBooking({
          name: cartClientData.name,
          phone: normalizedPhone,
          ...(cartClientData.email ? { email: cartClientData.email } : {}),
          items: cartItems.map((item) => ({
            serviceId: item.serviceId!,
            employeeId: item.employeeId!,
            date: item.date!,
            time: item.time!,
          })),
        });
        bookingId = result.bookings[0].id;
      }

      setIsSubmitting(false);
      setPendingBookingId(bookingId);
      setPendingTotalPrice(totalPrice);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia rezerwacji');
      setIsSubmitting(false);
    }
  };

  const handlePayNow = async () => {
    if (!pendingBookingId) return;

    try {
      setIsInitiatingPayment(true);
      const returnUrl = window.location.href;
      const { paymentUrl } = await initiatePayment(pendingBookingId, returnUrl);
      window.location.href = paymentUrl;
    } catch {
      setIsInitiatingPayment(false);
      setSubmitError('Nie udało się zainicjować płatności. Spróbuj ponownie.');
      setPendingBookingId(null);
    }
  };

  const handlePayLater = () => {
    setPendingBookingId(null);
    setSubmitSuccess(true);
  };

  let activeItemIndex = -1;
  for (let i = cartItems.length - 1; i >= 0; i -= 1) {
    if (!isCartItemComplete(cartItems[i])) {
      activeItemIndex = i;
      break;
    }
  }

  const activeItem = activeItemIndex >= 0 ? cartItems[activeItemIndex] : null;
  const canAddAnotherService = !activeItem && cartItems.length < 5;
  const isCartReadyToSubmit = cartItems.length > 0 && cartItems.every(isCartItemComplete);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.service?.price ?? 0), 0);
  const totalDuration = cartItems.reduce((sum, item) => sum + (item.service?.duration ?? 0), 0);

  return (
    <section className="py-24 bg-background-alt relative" id="booking">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Info */}
          <div className="lg:w-1/3 pt-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl lg:text-5xl mb-6 text-black font-light"
            >
              Rezerwacja
            </motion.h2>
            <div className="w-12 h-px bg-primary mb-8"></div>
            <p className="text-text-light mb-10 font-light leading-relaxed">
              Wybierz dogodny termin i usługę. Czekamy na Ciebie z filiżanką aromatycznej kawy.
            </p>
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Godziny otwarcia
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm font-light text-black border-t border-gray-200 pt-4">
                  <span>Poniedziałek - Piątek</span>
                  <span className="text-right">{siteConfig.businessHours.weekdays}</span>
                  <span>Sobota</span>
                  <span className="text-right">{siteConfig.businessHours.saturday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: CTA Button */}
          <div className="lg:w-2/3 w-full bg-white p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-2xl text-black mb-4">Umów się na wizytę</h3>
              <p className="text-text-light mb-8 font-light max-w-md mx-auto">
                Skontaktuj się z nami bezpośrednio lub zarezerwuj termin online w kilku prostych krokach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openModal}
                  className="bg-primary text-white font-medium py-4 px-12 uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg hover:shadow-xl"
                >
                  Zarezerwuj teraz
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Multi-Step Logic */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-8 md:p-12 max-w-2xl w-full relative z-10 shadow-2xl border border-gray-100 my-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Step Choice / Basic Call Modal */}
              {!bookingMode && !submitSuccess && !paymentStatus && !pendingBookingId && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">calendar_month</span>
                  </div>
                  <h3 className="font-display text-2xl text-black mb-4">Jak chcesz się umówić?</h3>
                  <p className="text-lg text-text-light font-light mb-8">
                    Wybierz najwygodniejszą dla Ciebie metodę rezerwacji.
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setBookingMode('ONLINE')}
                      className="bg-black text-white py-4 px-8 text-xs uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm text-white">bolt</span>
                      Rezerwacja Online
                    </button>
                    <button
                      onClick={() => setBookingMode('CALL')}
                      className="border border-gray-200 text-gray-600 py-4 px-8 text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">phone</span>
                      Zadzwoń do nas
                    </button>
                  </div>
                </div>
              )}

              {/* Call Mode Content */}
              {bookingMode === 'CALL' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">phone_in_talk</span>
                  </div>
                  <h3 className="font-display text-2xl text-black mb-4">Kontakt Telefoniczny</h3>
                  <p className="text-lg text-text-light font-light mb-8">
                    Zadzwoń pod numer{' '}
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                      className="font-medium text-black hover:text-primary transition-colors whitespace-nowrap"
                    >
                      {siteConfig.contact.phone}
                    </a>{' '}
                    aby ustalić termin.
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                      className="bg-black text-white py-3 px-8 text-xs uppercase tracking-widest hover:bg-primary transition-colors"
                    >
                      Zadzwoń teraz
                    </a>
                    <button
                      onClick={() => setBookingMode(null)}
                      className="border border-gray-200 text-gray-600 py-3 px-8 text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors"
                    >
                      Wróć
                    </button>
                  </div>
                </div>
              )}

              {/* Online Step Flow */}
              {bookingMode === 'ONLINE' && !submitSuccess && !isSubmitting && !submitError && !pendingBookingId && !paymentStatus && (
                <div className="relative">
                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-4 mb-8">
                    {['client', 'cart'].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-colors ${cartStep === s ? 'bg-primary' : 'bg-gray-100'}`}
                      />
                    ))}
                  </div>

                  {cartStep === 'client' && (
                    <ClientForm
                      onSubmit={(data) => {
                        setCartClientData(data);
                        setCartStep('cart');
                      }}
                    />
                  )}

                  {cartStep === 'cart' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {cartItems.map((item, i) => (
                          <CartItemDisplay
                            key={`${item.serviceId ?? 'service'}-${item.employeeId ?? 'employee'}-${item.date ?? 'date'}-${item.time ?? 'time'}-${i}`}
                            index={i}
                            service={item.service}
                            employee={item.employee}
                            date={item.date}
                            time={item.time}
                            onRemove={() => handleRemoveCartItem(i)}
                          />
                        ))}
                      </div>

                      {activeItem?.activeSubStep === 'service' && (
                        <ServiceSelector
                          onSelect={(s) => {
                            updateActiveItem({
                              serviceId: s.id,
                              service: s,
                              employeeId: null,
                              employee: null,
                              date: null,
                              time: null,
                              activeSubStep: 'employee',
                            });
                          }}
                        />
                      )}

                      {activeItem?.activeSubStep === 'employee' && (
                        <EmployeeSelector
                          onSelect={(e) => {
                            updateActiveItem({
                              employeeId: e.id,
                              employee: e,
                              date: null,
                              time: null,
                              activeSubStep: 'date',
                            });
                          }}
                        />
                      )}

                      {activeItem?.activeSubStep === 'date' && activeItem.serviceId && activeItem.employeeId && (
                        <BookingCalendar
                          serviceId={activeItem.serviceId}
                          employeeId={activeItem.employeeId}
                          onSelectDate={(d) => {
                            updateActiveItem({
                              date: d,
                              time: null,
                              activeSubStep: 'time',
                            });
                          }}
                        />
                      )}

                      {activeItem?.activeSubStep === 'time' && activeItem.date && activeItem.serviceId && activeItem.employeeId && (
                        <TimeSlots
                          date={activeItem.date}
                          serviceId={activeItem.serviceId}
                          employeeId={activeItem.employeeId}
                          serviceDuration={activeItem.service?.duration ?? 0}
                          bookedByCart={cartItems
                            .filter((item, i) => i !== activeItemIndex && isCartItemComplete(item) && item.employeeId === activeItem.employeeId && item.date === activeItem.date && item.time && item.service)
                            .map(item => ({ time: item.time!, duration: item.service!.duration }))}
                          onSelectTime={(t) => {
                            updateActiveItem({ time: t });
                          }}
                          onBack={() => updateActiveItem({ date: null, time: null, activeSubStep: 'date' })}
                        />
                      )}

                      {canAddAnotherService && (
                        <button
                          onClick={() => setCartItems((prev) => [...prev, { ...emptyCartItem }])}
                          className="w-full border border-gray-200 text-gray-600 py-4 px-8 text-xs uppercase tracking-widest hover:border-black hover:text-black transition-colors"
                        >
                          Dodaj kolejną usługę
                        </button>
                      )}

                      <div className="border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center justify-between text-sm font-light text-black">
                          <span>Łączny czas</span>
                          <span>{totalDuration} min</span>
                        </div>
                        <div className="flex items-center justify-between text-lg text-black">
                          <span className="font-light">Do zapłaty</span>
                          <span className="font-semibold">{totalPrice} zł</span>
                        </div>
                        <button
                          onClick={handleCartSubmit}
                          disabled={!isCartReadyToSubmit || !cartClientData}
                          className="w-full bg-black text-white py-4 px-8 text-xs uppercase tracking-widest hover:bg-primary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Zarezerwuj
                        </button>
                      </div>

                      <button
                        onClick={() => setCartStep('client')}
                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Poprzedni krok
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isSubmitting && (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-light">Finalizowanie rezerwacji...</p>
                </div>
              )}

              {!isSubmitting && !submitError && !submitSuccess && pendingBookingId && (
                <PaymentChoice
                  totalPrice={pendingTotalPrice}
                  onPayNow={handlePayNow}
                  onPayLater={handlePayLater}
                  isLoading={isInitiatingPayment}
                />
              )}

              {paymentStatus === 'paid' && (
                <div className="py-10 text-center">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                  </div>
                  <h3 className="font-display text-2xl text-black mb-4">Płatność potwierdzona!</h3>
                  <p className="text-text-light font-light mb-8 max-w-sm mx-auto">Rezerwacja opłacona. Do zobaczenia w salonie!</p>
                  <button onClick={() => { setPaymentStatus(null); closeModal(); resetFlow(); }} className="bg-primary text-white py-4 px-12 text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg">Zamknij</button>
                </div>
              )}
              {paymentStatus === 'failed' && (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-3xl">error</span>
                  </div>
                  <h3 className="font-display text-xl text-black mb-4">Płatność nieudana</h3>
                  <p className="text-text-light font-light mb-8">Rezerwacja istnieje, ale płatność nie została przetworzona. Możesz spróbować ponownie przy wizycie.</p>
                  <button onClick={() => { setPaymentStatus(null); closeModal(); resetFlow(); }} className="bg-black text-white py-3 px-8 text-xs uppercase tracking-widest hover:bg-primary transition-colors">Zamknij</button>
                </div>
              )}

              {/* Submit Error */}
              {submitError && (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-3xl">error</span>
                  </div>
                  <h3 className="font-display text-xl text-black mb-4">Ups! Coś poszło nie tak</h3>
                  <p className="text-red-600 mb-8 font-light">{submitError}</p>
                  <button
                    onClick={() => setSubmitError(null)}
                    className="bg-black text-white py-3 px-8 text-xs uppercase tracking-widest hover:bg-primary transition-colors"
                  >
                    {submitError?.includes('zajęty') ? 'Zmień termin' : 'Spróbuj ponownie'}
                  </button>
                </div>
              )}

              {/* Success Screen */}
              {submitSuccess && (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                  </motion.div>
                  <h3 className="font-display text-2xl text-black mb-4">Rezerwacja potwierdzona!</h3>
                  <p className="text-text-light font-light mb-8 max-w-sm mx-auto">
                    Dziękujemy za zaufanie. Potwierdzenie otrzymasz również w wiadomości SMS/E-mail. Do zobaczenia w salonie!
                  </p>
                  <button
                    onClick={() => {
                      closeModal();
                      resetFlow();
                    }}
                    className="bg-primary text-white py-4 px-12 text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                  >
                    Zamknij
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Booking;
