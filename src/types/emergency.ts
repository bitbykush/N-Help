export type EmergencyMode = 'NORMAL' | 'BLACKOUT' | 'DEMO';

export type ConnectivityStatus = 'ONLINE' | 'INTERNET_DOWN' | 'MESH_MODE';

export interface MedicalTriageProtocol {
  priority: 'TRAUMA_FIRST' | 'CONTAMINATION_TRIAGE' | 'GENERAL_FIRST_AID';
  title: string;
  goldenRule: string;
  steps: string[];
  contraindications: string[];
  prohibitedActions: string[];
}

export interface PotassiumIodideGuidance {
  mechanism: string;
  strictlyProtects: string[];
  providesZeroProtectionAgainst: string[];
  severeRisks: {
    condition: string;
    risk: string;
  }[];
  bannedSubstitutes: {
    name: string;
    danger: string;
  }[];
}

export interface WaterSafetyProtocol {
  boilingMythDebunk: {
    statement: string;
    reality: string;
    vaporHazard: string;
  };
  tiers: {
    tier: number;
    title: string;
    sources: string[];
    isSafe: boolean;
    guideline: string;
  }[];
  filtrationAdvice: string;
}

export interface FoodSafetyProtocol {
  cannedGoodsProcedure: string[];
  freshProduceDirectives: string[];
  dairyWarningIodine131: string;
  cookingLimitation: string;
}
