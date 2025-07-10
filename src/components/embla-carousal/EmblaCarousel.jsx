
"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const TWEEN_FACTOR_BASE = 0.2;

const EmblaCarousel = (props) => {
  const { products, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__parallax__layer");
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `translateX(${translate}%)`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax);
  }, [emblaApi, tweenParallax]);

  function truncateTextByLetters(text, charLimit) {
    if (text.length <= charLimit) return text;
    return text.slice(0, charLimit) + "...";
  }

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {products.map((product, index) => (
            <div className="embla__slide" key={product.id + index}>
              <div className="embla__parallax">
                <div className="embla__parallax__layer relative flex min-h-[550px]">
                  {/* Background image with blur and overlay */}
                  <img
                    className="embla__slide__img embla__parallax__img blur-md absolute inset-0 w-full h-full object-cover"
                    src={product.images[0]}
                    alt={product.name}
                  />
                  <div className="absolute -inset-6 bg-black/60 dark:bg-black/70"></div>

                  {/* Content container */}
                  <div className="relative z-10 container mx-auto flex items-center lg:px-32 px-10">
                    {/* Left side - Product details */}
                    <div className="flex-1 text-white max-w-2xl">
                      <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
                        {product.category}
                      </span>

                      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
                        Discover
                        <span className="block">
                          {product.name}
                        </span>
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                        {truncateTextByLetters(product.description, 70)} Check
                        out our latest arrival! ✨
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold">
                          Rs. {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg line-through opacity-70">
                            Rs. {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Link href={`/products/${product.id}`}>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-primary to-accent text-foreground dark:text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>

                    {/* Right side - Product image */}
                    <div className="hidden lg:block flex-1">
                      <div className="relative">
                        <img
                          className="h-[400px] w-full rounded-2xl object-cover ml-auto transform -rotate-6 hover:rotate-0 transition-transform duration-300"
                          src={product.images[0]}
                          alt={product.name}
                        />
                        <div className="absolute  -z-10 inset-0 bg-white/20 rounded-xl transform rotate-6 translate-y-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
