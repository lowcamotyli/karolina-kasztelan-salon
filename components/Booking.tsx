import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../constants/siteConfig';
import ServiceSelector from './booking/ServiceSelector';
import BookingCalendar from './booking/BookingCalendar';
import TimeSlots from './booking/TimeSlots';
import ClientForm from './booking/ClientForm';
import BookingConfirmation from './booking/BookingConfirmation';
import EmployeeSelector from './booking/EmployeeSelector';
import { createBooking } from '../lib/api';
import { SimpliEmployee } from '../lib/types';

type BookingMode = 'CALL' | 'ONLINE' | null;

const Booking: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>(null);
  const [step, setStep] = useState(1);

  // Data State
  const [selectedService, setSelectedService] = useState<{ id: string; name: string; duration: number; price: number } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<SimpliEmployee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientData, setClientData] = useState<{ name: string; phone: string; email?: string } | null>(null);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setSelectedService(null);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientData(null);
    setBookingMode(null);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const resetFromEmployee = () => {
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientData(null);
    setSubmitError(null);
  };

  const resetFromDate = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setClientData(null);
    setSubmitError(null);
  };

  const resetFromTime = () => {
    setSelectedTime(null);
    setClientData(null);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedEmployee || !selectedDate || !selectedTime || !clientData) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const normalizedPhone = clientData.phone.replace(/[\s-]/g, '');

      await createBooking({
        name: clientData.name,
        phone: normalizedPhone,
        ...(clientData.email ? { email: clientData.email } : {}),
        serviceId: selectedService.id,
        employeeId: selectedEmployee.id,
        date: selectedDate,
        time: selectedTime,
      });

      setSubmitSuccess(true);

      // Auto close/reset after 3 seconds
      setTimeout(() => {
        closeModal();
        resetFlow();
      }, 3000);

    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia rezerwacji');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {!bookingMode && !submitSuccess && (
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
              {bookingMode === 'ONLINE' && !submitSuccess && !isSubmitting && !submitError && (
                <div className="relative">
                  {/* Progress Indicator */}
                  <div className="flex justify-between mb-8 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-colors ${step >= s ? 'bg-primary' : 'bg-gray-100'
                          }`}
                      />
                    ))}
                  </div>

                  {step === 1 && (
                    <ServiceSelector
                      onSelect={(s) => {
                        setSelectedService(s);
                        resetFromEmployee();
                        setStep(2);
                      }}
                    />
                  )}
                  {step === 2 && (
                    <EmployeeSelector
                      onSelect={(e) => {
                        resetFromDate();
                        setSelectedEmployee(e);
                        setStep(3);
                      }}
                    />
                  )}
                  {step === 3 && selectedService && selectedEmployee && (
                    <BookingCalendar
                      serviceId={selectedService.id}
                      employeeId={selectedEmployee.id}
                      onSelectDate={(d) => {
                        resetFromTime();
                        setSelectedDate(d);
                        setStep(4);
                      }}
                    />
                  )}
                  {step === 4 && selectedDate && selectedService && selectedEmployee && (
                    <TimeSlots
                      date={selectedDate}
                      serviceId={selectedService.id}
                      employeeId={selectedEmployee.id}
                      onSelectTime={(t) => {
                        setSelectedTime(t);
                        setStep(5);
                      }}
                    />
                  )}
                  {step === 5 && (
                    <ClientForm
                      onSubmit={(data) => {
                        setClientData(data);
                        setStep(6);
                      }}
                    />
                  )}
                  {step === 6 && selectedService && selectedEmployee && selectedDate && selectedTime && clientData && (
                    <BookingConfirmation
                      service={selectedService}
                      employee={selectedEmployee}
                      date={selectedDate}
                      time={selectedTime}
                      client={clientData}
                      onConfirm={handleSubmit}
                      onBack={() => setStep(5)}
                    />
                  )}

                  {step > 1 && step <= 6 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="mt-8 text-xs uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Poprzedni krok
                    </button>
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
                    Spróbuj ponownie
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
