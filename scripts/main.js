document.addEventListener('DOMContentLoaded', () => {
    const elementsCarousel = document.querySelectorAll('.carousel');
    M.Carousel.init(elementsCarousel, {
        duration: 150
    });
});