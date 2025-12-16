import { Department } from './attendance';

// Commission calculation types based on CCD 2025 plan
export const COMMISSION_CONFIG = {
  profitabilityPoint: 12367.68, // PR - Punto de rentabilidad
  activationThreshold: 2000, // Umbral mínimo de RR
  cap: 0.45, // CAP 45% del RR
  igvRate: 0.18, // IGV 18%
  maxMonthlyBonus: 1200, // Tope mensual bonos
};

export const COMMISSION_TIERS = [
  { min: 0, max: 1999.99, rate: 0 },
  { min: 2000, max: 4999.99, rate: 0.10 },
  { min: 5000, max: 7999.99, rate: 0.15 },
  { min: 8000, max: 12999.99, rate: 0.18 },
  { min: 13000, max: Infinity, rate: 0.22 },
];

export const PRODUCT_COEFFICIENTS = {
  alto_margen: { name: 'Alto Margen', coefficient: 1.10, examples: 'Propios/Asincrónicos' },
  estandar: { name: 'Estándar', coefficient: 1.00, examples: 'Portafolio medio' },
  bajo_margen: { name: 'Bajo Margen', coefficient: 0.90, examples: 'Licencias/Externos premium' },
};

export type ProductMarginType = keyof typeof PRODUCT_COEFFICIENTS;

export interface SaleRecord {
  id: string;
  advisorId: string;
  date: string;
  courseName: string;
  clientName: string;
  amountBruto: number;
  amountNeto: number; // = bruto / 1.18
  marginType: ProductMarginType;
  paymentType: 'contado' | 'cuotas';
  totalInstallments?: number;
  paidInstallments?: number;
  status: 'paid' | 'pending' | 'reversed';
}

export interface AdvisorMetrics {
  advisorId: string;
  month: string;
  totalSales: number;
  validSales: number; // Sales not reversed
  totalBruto: number;
  totalNeto: number;
  adjustedNeto: number; // After product coefficients
  rentableRevenue: number; // RR = adjustedNeto - PR
  coverageRate: number; // % leads contacted in 2h
  followUpComplete: boolean; // 3 attempts in 72h
  crmComplete: boolean;
  scriptCompliance: boolean;
  npsScore: number;
  delinquencyRate: number; // Morosidad 30d
  desertionRate: number; // Tasa de deserción
  gatesPassed: number; // 0-4 gates passed
}

export interface BonusCalculation {
  ticketSaludable: number; // S/ 100 or 200
  productividad: number; // S/ 100 or 200
  seguimientoPerfecto: number; // S/ 150
  calidadNPS: number; // S/ 150
  retencion: number; // S/ 200
  totalBonuses: number;
  adjustedBonuses: number; // After CAP
}

export interface CommissionCalculation {
  advisorId: string;
  month: string;
  metrics: AdvisorMetrics;
  
  // Calculation steps
  totalNetoCollected: number;
  profitabilityPoint: number;
  rentableRevenue: number; // RR
  
  // Commission by tiers
  tier1Commission: number; // 0-1999 (0%)
  tier2Commission: number; // 2000-4999 (10%)
  tier3Commission: number; // 5000-7999 (15%)
  tier4Commission: number; // 8000-12999 (18%)
  tier5Commission: number; // 13000+ (22%)
  baseCommission: number;
  
  // Gates penalty
  gatesPenalty: number; // 0 = 100%, 1 = 70%, 2+ = retained
  adjustedCommission: number;
  
  // Bonuses
  bonuses: BonusCalculation;
  
  // Final calculation
  totalBeforeCap: number;
  capAmount: number;
  finalPayment: number;
}

// Payslip types
export interface PayslipBonus {
  id: string;
  name: string;
  amount: number;
  isRecurring: boolean;
  description?: string;
}

export interface PayslipDeduction {
  id: string;
  name: string;
  amount: number;
  type: 'tardiness' | 'absence' | 'loan' | 'afp' | 'onp' | 'rent_5ta' | 'other';
  description?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  position: string;
  month: string; // YYYY-MM
  
  // Basic salary
  baseSalary: number;
  workDays: number;
  workedDays: number;
  
  // Earnings
  bonuses: PayslipBonus[];
  overtime: number;
  commissions?: CommissionCalculation;
  totalEarnings: number;
  
  // Deductions
  deductions: PayslipDeduction[];
  tardyDiscounts: number; // Automatic tardiness discounts
  totalDeductions: number;
  
  // Net pay
  netPay: number;
  
  // Metadata
  createdAt: string;
  sentToEmail?: string;
  sentAt?: string;
  status: 'draft' | 'approved' | 'sent';
}

export interface PaymentHistory {
  id: string;
  employeeId: string;
  payslipId: string;
  month: string;
  netPay: number;
  paidAt: string;
  paymentMethod: 'transfer' | 'cash' | 'check';
  reference?: string;
}

// Helper functions
export function calculateNetoFromBruto(bruto: number): number {
  return bruto / (1 + COMMISSION_CONFIG.igvRate);
}

export function calculateMarginalCommission(rentableRevenue: number): {
  tier1: number;
  tier2: number;
  tier3: number;
  tier4: number;
  tier5: number;
  total: number;
} {
  let remaining = rentableRevenue;
  const tiers = { tier1: 0, tier2: 0, tier3: 0, tier4: 0, tier5: 0, total: 0 };
  
  // Tier 1: 0-1999 (0%)
  const tier1Amount = Math.min(remaining, 1999.99);
  tiers.tier1 = 0; // No commission
  remaining = Math.max(0, remaining - 1999.99);
  
  // Tier 2: 2000-4999 (10%)
  if (remaining > 0) {
    const tier2Amount = Math.min(remaining, 3000);
    tiers.tier2 = tier2Amount * 0.10;
    remaining = Math.max(0, remaining - 3000);
  }
  
  // Tier 3: 5000-7999 (15%)
  if (remaining > 0) {
    const tier3Amount = Math.min(remaining, 3000);
    tiers.tier3 = tier3Amount * 0.15;
    remaining = Math.max(0, remaining - 3000);
  }
  
  // Tier 4: 8000-12999 (18%)
  if (remaining > 0) {
    const tier4Amount = Math.min(remaining, 5000);
    tiers.tier4 = tier4Amount * 0.18;
    remaining = Math.max(0, remaining - 5000);
  }
  
  // Tier 5: 13000+ (22%)
  if (remaining > 0) {
    tiers.tier5 = remaining * 0.22;
  }
  
  tiers.total = tiers.tier1 + tiers.tier2 + tiers.tier3 + tiers.tier4 + tiers.tier5;
  return tiers;
}

export function calculateBonuses(metrics: AdvisorMetrics): BonusCalculation {
  const bonuses: BonusCalculation = {
    ticketSaludable: 0,
    productividad: 0,
    seguimientoPerfecto: 0,
    calidadNPS: 0,
    retencion: 0,
    totalBonuses: 0,
    adjustedBonuses: 0,
  };
  
  // Ticket saludable (BRUTO > 600 = S/200, > 500 = S/100)
  const avgTicketBruto = metrics.totalBruto / metrics.validSales;
  if (avgTicketBruto > 600) {
    bonuses.ticketSaludable = 200;
  } else if (avgTicketBruto > 500) {
    bonuses.ticketSaludable = 100;
  }
  
  // Productividad (>=45 ventas = S/200, >=30 = S/100)
  if (metrics.delinquencyRate <= 0.12) {
    if (metrics.validSales >= 45) {
      bonuses.productividad = 200;
    } else if (metrics.validSales >= 30) {
      bonuses.productividad = 100;
    }
  }
  
  // Seguimiento perfecto
  if (metrics.coverageRate >= 0.95 && metrics.crmComplete) {
    bonuses.seguimientoPerfecto = 150;
  }
  
  // Calidad NPS
  if (metrics.npsScore >= 4.4) {
    bonuses.calidadNPS = 150;
  }
  
  // Retención
  if (metrics.desertionRate < 0.05) {
    bonuses.retencion = 200;
  }
  
  bonuses.totalBonuses = 
    bonuses.ticketSaludable + 
    bonuses.productividad + 
    bonuses.seguimientoPerfecto + 
    bonuses.calidadNPS + 
    bonuses.retencion;
  
  // Cap at S/ 1,200
  bonuses.adjustedBonuses = Math.min(bonuses.totalBonuses, COMMISSION_CONFIG.maxMonthlyBonus);
  
  return bonuses;
}

export function countGatesPassed(metrics: AdvisorMetrics): number {
  let gates = 0;
  if (metrics.coverageRate >= 0.95) gates++;
  if (metrics.followUpComplete) gates++;
  if (metrics.crmComplete) gates++;
  if (metrics.scriptCompliance) gates++;
  return gates;
}
