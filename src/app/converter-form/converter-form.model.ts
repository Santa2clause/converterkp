
export interface Option {
    value: string;
    label: string;
  }
  
  export interface ExtendedOption extends Option {
    factor?: number;
    offset?: number;
  }
  