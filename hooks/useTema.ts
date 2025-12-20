import { useColorScheme } from 'react-native';

const coloresClaro = {
  fondo: '#f5f5f5',
  fondoTarjeta: '#fff',
  texto: '#333',
  textoSecundario: '#666',
  textoTerciario: '#999',
  borde: '#ddd',
  inputFondo: '#f9f9f9',
  primario: '#007AFF',
  error: '#ff3b30',
  exito: '#34c759',
  sombra: '#000',
};

const coloresOscuro = {
  fondo: '#000',
  fondoTarjeta: '#1c1c1e',
  texto: '#fff',
  textoSecundario: '#aaa',
  textoTerciario: '#666',
  borde: '#38383a',
  inputFondo: '#2c2c2e',
  primario: '#0a84ff',
  error: '#ff453a',
  exito: '#32d74b',
  sombra: '#000',
};

export const useTema = () => {
  const esquemaColor = useColorScheme();
  const esOscuro = esquemaColor === 'dark';
  const colores = esOscuro ? coloresOscuro : coloresClaro;

  return { colores, esOscuro };
};
