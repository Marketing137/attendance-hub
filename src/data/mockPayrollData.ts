import { 
  Payslip, 
  PaymentHistory, 
  SaleRecord, 
  AdvisorMetrics,
  CommissionCalculation,
  calculateNetoFromBruto,
  calculateMarginalCommission,
  calculateBonuses,
  countGatesPassed,
  COMMISSION_CONFIG
} from '@/types/payroll';
import { mockEmployees, mockContracts } from './mockData';

// Mock sales records for commercial advisors
export const mockSalesRecords: SaleRecord[] = [
  { id: 'sr1', advisorId: '1', date: '2024-12-01', courseName: 'Diplomado en Ingeniería Civil', clientName: 'Juan Pérez', amountBruto: 650, amountNeto: 550.85, marginType: 'alto_margen', paymentType: 'contado', status: 'paid' },
  { id: 'sr2', advisorId: '1', date: '2024-12-02', courseName: 'Curso de Gestión Pública', clientName: 'María López', amountBruto: 500, amountNeto: 423.73, marginType: 'estandar', paymentType: 'cuotas', totalInstallments: 3, paidInstallments: 2, status: 'paid' },
  { id: 'sr3', advisorId: '1', date: '2024-12-03', courseName: 'Especialización Minería', clientName: 'Carlos Ruiz', amountBruto: 800, amountNeto: 677.97, marginType: 'alto_margen', paymentType: 'contado', status: 'paid' },
  { id: 'sr4', advisorId: '2', date: '2024-12-01', courseName: 'Curso AutoCAD', clientName: 'Ana Torres', amountBruto: 450, amountNeto: 381.36, marginType: 'bajo_margen', paymentType: 'contado', status: 'paid' },
  { id: 'sr5', advisorId: '2', date: '2024-12-04', courseName: 'Diplomado Project Management', clientName: 'Pedro Sánchez', amountBruto: 700, amountNeto: 593.22, marginType: 'estandar', paymentType: 'contado', status: 'paid' },
];

// Generate more sales to simulate realistic data
const generateMoreSales = (): SaleRecord[] => {
  const sales: SaleRecord[] = [...mockSalesRecords];
  const courses = [
    'Diplomado en Ingeniería Civil',
    'Curso de Gestión Pública',
    'Especialización Minería',
    'Curso AutoCAD',
    'Diplomado Project Management',
    'BIM para Ingenieros',
    'Seguridad y Salud Ocupacional',
  ];
  const names = ['Luis García', 'Rosa Martín', 'Diego Flores', 'Carmen Vega', 'Jorge Castro'];
  
  for (let i = 0; i < 30; i++) {
    const bruto = 400 + Math.random() * 400;
    sales.push({
      id: `sr${6 + i}`,
      advisorId: Math.random() > 0.5 ? '1' : '2',
      date: `2024-12-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
      courseName: courses[Math.floor(Math.random() * courses.length)],
      clientName: names[Math.floor(Math.random() * names.length)],
      amountBruto: Math.round(bruto * 100) / 100,
      amountNeto: Math.round(calculateNetoFromBruto(bruto) * 100) / 100,
      marginType: ['alto_margen', 'estandar', 'bajo_margen'][Math.floor(Math.random() * 3)] as any,
      paymentType: Math.random() > 0.3 ? 'contado' : 'cuotas',
      totalInstallments: 3,
      paidInstallments: Math.random() > 0.5 ? 3 : 2,
      status: Math.random() > 0.1 ? 'paid' : 'reversed',
    });
  }
  return sales;
};

export const allSalesRecords = generateMoreSales();

// Mock advisor metrics
export const mockAdvisorMetrics: AdvisorMetrics[] = [
  {
    advisorId: '1',
    month: '2024-12',
    totalSales: 32,
    validSales: 30,
    totalBruto: 18500,
    totalNeto: 15677.97,
    adjustedNeto: 16461.86, // After coefficient
    rentableRevenue: 4094.18, // RR = adjustedNeto - PR
    coverageRate: 0.96,
    followUpComplete: true,
    crmComplete: true,
    scriptCompliance: true,
    npsScore: 4.5,
    delinquencyRate: 0.08,
    desertionRate: 0.03,
    gatesPassed: 4,
  },
  {
    advisorId: '2',
    month: '2024-12',
    totalSales: 25,
    validSales: 24,
    totalBruto: 14200,
    totalNeto: 12033.90,
    adjustedNeto: 12033.90,
    rentableRevenue: -333.78, // Below PR
    coverageRate: 0.92,
    followUpComplete: true,
    crmComplete: true,
    scriptCompliance: true,
    npsScore: 4.2,
    delinquencyRate: 0.15,
    desertionRate: 0.06,
    gatesPassed: 3,
  },
];

// Calculate full commission for an advisor
export function calculateFullCommission(metrics: AdvisorMetrics): CommissionCalculation {
  const tiers = calculateMarginalCommission(metrics.rentableRevenue);
  const bonuses = calculateBonuses(metrics);
  const gatesPassed = countGatesPassed(metrics);
  
  // Gates penalty
  let gatesPenalty = 1;
  if (gatesPassed < 4) {
    if (gatesPassed >= 3) {
      gatesPenalty = 0.7; // 70% commission, no bonuses
    } else {
      gatesPenalty = 0; // Retained
    }
  }
  
  const adjustedCommission = tiers.total * gatesPenalty;
  const adjustedBonuses = gatesPassed === 4 ? bonuses.adjustedBonuses : 0;
  
  const totalBeforeCap = adjustedCommission + adjustedBonuses;
  const capAmount = metrics.rentableRevenue * COMMISSION_CONFIG.cap;
  const finalPayment = Math.min(totalBeforeCap, Math.max(0, capAmount));
  
  return {
    advisorId: metrics.advisorId,
    month: metrics.month,
    metrics,
    totalNetoCollected: metrics.totalNeto,
    profitabilityPoint: COMMISSION_CONFIG.profitabilityPoint,
    rentableRevenue: metrics.rentableRevenue,
    tier1Commission: tiers.tier1,
    tier2Commission: tiers.tier2,
    tier3Commission: tiers.tier3,
    tier4Commission: tiers.tier4,
    tier5Commission: tiers.tier5,
    baseCommission: tiers.total,
    gatesPenalty,
    adjustedCommission,
    bonuses,
    totalBeforeCap,
    capAmount: Math.max(0, capAmount),
    finalPayment: Math.max(0, finalPayment),
  };
}

// Fixed bonuses for employees
export const FIXED_BONUSES = {
  movilidad: { name: 'Bono Movilidad', amount: 200, isRecurring: true },
  alimentacion: { name: 'Bono Alimentación', amount: 300, isRecurring: true },
  productividad: { name: 'Bono Productividad', amount: 150, isRecurring: false },
  aniversario: { name: 'Bono Aniversario', amount: 500, isRecurring: false },
};

// Mock payslips
export const mockPayslips: Payslip[] = mockEmployees.slice(0, 5).map((emp, idx) => {
  const contract = mockContracts.find(c => c.employeeId === emp.id);
  const baseSalary = contract?.salary || 2000;
  const isCommercial = emp.department === 'comercial';
  
  const bonuses = [
    { id: 'b1', name: 'Bono Movilidad', amount: 200, isRecurring: true },
    { id: 'b2', name: 'Bono Alimentación', amount: 300, isRecurring: true },
  ];
  
  if (idx === 0) {
    bonuses.push({ id: 'b3', name: 'Bono Productividad', amount: 150, isRecurring: false });
  }
  
  const deductions = [
    { id: 'd1', name: 'AFP', amount: baseSalary * 0.10, type: 'afp' as const },
    { id: 'd2', name: 'Renta 5ta', amount: baseSalary > 2500 ? baseSalary * 0.08 : 0, type: 'rent_5ta' as const },
  ];
  
  const tardyDiscounts = idx === 4 ? 30 : idx === 2 ? 10 : 0;
  
  const commission = isCommercial && mockAdvisorMetrics.find(m => m.advisorId === emp.id)
    ? calculateFullCommission(mockAdvisorMetrics.find(m => m.advisorId === emp.id)!)
    : undefined;
  
  const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0) + tardyDiscounts;
  const commissionAmount = commission?.finalPayment || 0;
  const totalEarnings = baseSalary + totalBonuses + commissionAmount;
  
  return {
    id: `pay-${emp.id}-2024-12`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    position: emp.position || 'Colaborador',
    month: '2024-12',
    baseSalary,
    workDays: 22,
    workedDays: 22 - (idx === 4 ? 1 : 0),
    bonuses,
    overtime: idx === 3 ? 150 : 0,
    commissions: commission,
    totalEarnings,
    deductions,
    tardyDiscounts,
    totalDeductions,
    netPay: totalEarnings - totalDeductions,
    createdAt: new Date().toISOString(),
    status: idx < 2 ? 'sent' : idx < 4 ? 'approved' : 'draft',
    sentToEmail: idx < 2 ? emp.email : undefined,
    sentAt: idx < 2 ? new Date().toISOString() : undefined,
  };
});

// Mock payment history
export const mockPaymentHistory: PaymentHistory[] = mockEmployees.slice(0, 8).flatMap(emp => {
  const history: PaymentHistory[] = [];
  const contract = mockContracts.find(c => c.employeeId === emp.id);
  const baseSalary = contract?.salary || 2000;
  
  for (let i = 0; i < 6; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i - 1);
    const monthStr = month.toISOString().slice(0, 7);
    
    history.push({
      id: `hist-${emp.id}-${monthStr}`,
      employeeId: emp.id,
      payslipId: `pay-${emp.id}-${monthStr}`,
      month: monthStr,
      netPay: baseSalary * (0.85 + Math.random() * 0.1),
      paidAt: new Date(month.setDate(5)).toISOString(),
      paymentMethod: 'transfer',
      reference: `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    });
  }
  
  return history;
});
