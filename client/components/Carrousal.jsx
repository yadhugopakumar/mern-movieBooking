import React, { useEffect, useState } from "react";

const slides = [
    { title: "Inception", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070" },
    { title: "Interstellar", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072" },
    { title: "Oppenheimer", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2037" },
    { title: "Dune", img: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2034" },
];

export const Carrousal = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-end px-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Latest Movies</h2>
                <span className="text-sm font-medium text-gray-500">{current + 1} / {slides.length}</span>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-200">
                <div
                    className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{
                        width: `${slides.length * 100}%`,
                        transform: `translateX(-${current * (100 / slides.length)}%)`,
                    }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="relative w-full h-[400px] md:h-[500px] flex-shrink-0" style={{ width: `${100 / slides.length}%` }}>
                            <img src={slide.img} alt={slide.title} className="w-full h-full object-center object-cover
" />

                            {/* Cinematic Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-12">
                            <div className="max-w-xl space-y-5">
  <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm">
    Featured
  </p>

  <h2 className="text-white text-5xl md:text-7xl font-black uppercase leading-none">
    {slide.title}
  </h2>

 
  <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
    Book Ticket
  </button>
</div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Minimal Progress Line */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                    <div
                        className="h-full bg-yellow-400 transition-all duration-1000 ease-out"
                        style={{ width: `${((current + 1) / slides.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};