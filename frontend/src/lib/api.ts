const URL_BASE_API = 'http://127.0.0.1:8000/api';

export async function peticionApi<T>(endpoint: string, opciones: RequestInit = {}): Promise<T> {
  const url = `${URL_BASE_API}${endpoint}`;
  
  const cabeceras = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  };

  const respuesta = await fetch(url, {
    ...opciones,
    headers: cabeceras,
  });

  if (!respuesta.ok) {
    let mensajeError = `Error en API ${respuesta.status}`;
    try {
      const datosError = await respuesta.json();
      mensajeError = datosError.error || datosError.message || mensajeError;
    } catch {
      mensajeError = await respuesta.text();
    }
    throw new Error(mensajeError);
  }

  if (respuesta.status === 204) {
    return {} as T;
  }

  return respuesta.json();
}
