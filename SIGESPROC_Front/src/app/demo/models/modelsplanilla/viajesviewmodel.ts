
export interface ViajeEncabezado {
    sucu_id: number; 
    user_user_id: number; 
    viaj_fecha: string; 
    trans_id: number; 
  }
  

  export interface ViajeDetalle {
    viaj_id: number; 
    cola_id: number; 
    distancia_km: number; 
    total_a_pagar: number; 
    cosu_id: number;
  }
  