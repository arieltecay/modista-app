import { apiClient } from './config/apiClient';
import { CarouselSlide } from './types/carousel';

export const carouselService = {
  async getActiveSlides(): Promise<CarouselSlide[]> {
    return apiClient.get('/carousel/active');
  }
};
