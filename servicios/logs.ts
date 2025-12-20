class ServicioLogs {
  private habilitado = true;

  info(mensaje: string, datos?: any) {
    if (!this.habilitado) return;
    console.log(`[INFO] ${mensaje}`, datos ? JSON.stringify(datos, null, 2) : '');
  }

  error(mensaje: string, error?: any) {
    if (!this.habilitado) return;
    console.error(`[ERROR] ${mensaje}`, error);
  }

  request(metodo: string, url: string, datos?: any) {
    if (!this.habilitado) return;
    console.log(`[REQUEST] ${metodo} ${url}`);
    if (datos) {
      console.log('[PAYLOAD]', JSON.stringify(datos, null, 2));
    }
  }

  response(url: string, estado: number, datos?: any) {
    if (!this.habilitado) return;
    console.log(`[RESPONSE] ${url} - Estado: ${estado}`);
    if (datos) {
      console.log('[DATA]', JSON.stringify(datos, null, 2));
    }
  }

  habilitar() {
    this.habilitado = true;
  }

  deshabilitar() {
    this.habilitado = false;
  }
}

export const logs = new ServicioLogs();
