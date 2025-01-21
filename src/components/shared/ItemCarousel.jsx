import React, { useEffect, useRef, useState, useCallback } from 'react';

const ItemCarousel = ({ cardType: CardType, content, heading }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollAbility = useCallback(() => {
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  }, []);

  useEffect(() => {
    checkScrollAbility();
    const container = containerRef.current;
    container.addEventListener('scroll', checkScrollAbility);
    return () => container.removeEventListener('scroll', checkScrollAbility);
  }, [checkScrollAbility, content]);

  return (
    <div className="mt-2 w-full p-4">
      <div className="w-full md:w-11/12 mx-auto relative">
        {heading && <h2 className="text-2xl font-serif font-bold mx-4 px-4 py-2">{heading}</h2>}
        <div className="flex items-center p-1">
          {canScrollLeft && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full border border-2 border-teal-500"
              onClick={() =>
                containerRef.current.scrollBy({
                  left: -containerRef.current.firstChild.offsetWidth - 14,
                  behavior: 'smooth',
                })
              }
            >
              &#9664;
            </button>
          )}

          <div
            className="flex overflow-x-auto space-x-4 no-scrollbar snap-x snap-mandatory mx-8 w-full"
            ref={containerRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {content.map((item, index) => (
              <div
                className="flex-none w-1/1 xs:1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/7"
                key={index}
              >
                <CardType {...item} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          {canScrollRight && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full border border-2 border-teal-500"
              onClick={() =>
                containerRef.current.scrollBy({
                  left: containerRef.current.firstChild.offsetWidth + 14,
                  behavior: 'smooth',
                })
              }
            >
              &#9654;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCarousel;
