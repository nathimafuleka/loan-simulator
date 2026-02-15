import axios from 'axios';
import { EligibilityRequest, EligibilityResponse } from '../types/loan.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/loans`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const loanApi = {
  checkEligibility: async (data: EligibilityRequest): Promise<EligibilityResponse> => {
    const response = await apiClient.post<EligibilityResponse>('/eligibility', data);
    return response.data;
  },

  getProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  calculateRate: async (data: {
    loanAmount: number;
    loanTerm: number;
    creditScore?: number;
    loanType: string;
  }) => {
    const response = await apiClient.post('/calculate-rate', data);
    return response.data;
  },

  getValidationRules: async () => {
    const response = await apiClient.get('/validation-rules');
    return response.data;
  },
};
