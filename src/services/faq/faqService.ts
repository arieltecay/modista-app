import { apiClient } from '../config/apiClient';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  iconName: string;
  category: 'general' | 'purchase-process' | 'courses';
  order: number;
}

export const faqService = {
  async getActiveFAQs(): Promise<FAQ[]> {
    try {
      return await apiClient.get('/faq/active');
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }
};
