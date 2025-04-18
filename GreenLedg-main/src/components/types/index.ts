export interface User {
  id: string;
  name: string;
  email: string;
  sustainabilityScore: number;
  walletBalance: number;
  carbonCredits: number;
}

export interface CarbonCredit {
  id: string;
  type: 'ERC20' | 'ERC721';
  projectType: 'reforestation' | 'renewable' | 'carbon_capture';
  amount: number;
  price: number;
  verified: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  creditsIssued: number;
  status: 'active' | 'completed' | 'pending';
}