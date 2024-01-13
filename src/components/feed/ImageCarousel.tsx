import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react";
import { RxDotFilled } from "react-icons/rx";

import Image from "next/image";

type PropType = {
  imageNames: string[];
  options?: EmblaOptionsType;
};

export const EmblaImageCarousel: React.FC<PropType> = (props) => {
  const { imageNames, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {imageNames?.map((name, index) => (
              <Image
                key={index}
                src={name}
                width={500}
                height={500}
                alt="Image is missing, please refresh..."
                className="embla__slide border-2"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="top-4 flex justify-center py-2">
        {scrollSnaps.map((_, index) => (
          <div
            key={index}
            onClick={() => scrollTo(index)}
            className="cursor-pointer text-xl"
          >
            <RxDotFilled className="text-blue-500" />
          </div>
        ))}
      </div>
    </>
  );
};
