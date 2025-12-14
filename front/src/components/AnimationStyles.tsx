export const AnimationStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes pulse-soft {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    .animate-slide-up {
      opacity: 0;
      animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slide-in-right {
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
    
    /* Hide scrollbar for cleaner look */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);
