import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticacion } from '@/contextos/AutenticacionContext';
import { useTema } from '@/hooks/useTema';

export default function LoginScreen() {
  const router = useRouter();
  const { colores } = useTema();
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const { iniciarSesion, cargando, error } = useAutenticacion();

  const manejarLogin = async () => {
    if (!email || !contraseña) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const resultado = await iniciarSesion(email, contraseña);
    if (!resultado && error) {
      Alert.alert('Error', error);
    }
  };

  const estilos = crearEstilos(colores);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.contenedor}
    >
      <View style={estilos.formulario}>
        <Text style={estilos.titulo}>Iniciar Sesión</Text>
        
        <TextInput
          style={estilos.input}
          placeholder="Correo electrónico"
          placeholderTextColor={colores.textoSecundario}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!cargando}
        />

        <TextInput
          style={estilos.input}
          placeholder="Contraseña"
          placeholderTextColor={colores.textoSecundario}
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
          editable={!cargando}
        />

        <TouchableOpacity
          style={[estilos.boton, cargando && estilos.botonDeshabilitado]}
          onPress={manejarLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.textoBoton}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => router.push('/registro')}
          disabled={cargando}
        >
          <Text style={estilos.textoBotonSecundario}>
            ¿No tienes una cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const crearEstilos = (colores: any) => StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    justifyContent: 'center',
    padding: 20,
  },
  formulario: {
    backgroundColor: colores.fondoTarjeta,
    padding: 24,
    borderRadius: 12,
    shadowColor: colores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: colores.texto,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: colores.inputFondo,
    color: colores.texto,
  },
  boton: {
    backgroundColor: colores.primario,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonSecundario: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: colores.primario,
    fontSize: 14,
  },
});
