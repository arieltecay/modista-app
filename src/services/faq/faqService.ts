import { publicClient } from '../config/publicClient';

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
      return await publicClient.get('/faq/active');
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }
};
