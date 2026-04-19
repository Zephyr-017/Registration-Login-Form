import React, { useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormInput } from '../components/FormInput';
import { LoginSchema } from '../utils/validationSchemas';

const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export default function LoginScreen({ navigation }) {
    const passwordRef = useRef(null);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;

                // Simulasi pemeriksaan kredensial dari AsyncStorage
                if (userData && values.email === userData.email && values.password === userData.password) {
                    Alert.alert('Berhasil', 'Login sukses!');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                } else {
                    setFieldError('email', 'Email atau password salah');
                }
            } catch (e) {
                Alert.alert('Error', 'Gagal membaca data');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Selamat Datang</Text>

                    <FormInput
                        label="Email" placeholder="contoh@email.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        value={formik.values.email} onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')} error={formik.errors.email} touched={formik.touched.email}
                    />

                    <FormInput
                        ref={passwordRef}
                        label="Password" placeholder="Masukkan password" secureTextEntry returnKeyType="done"
                        onSubmitEditing={formik.handleSubmit}
                        value={formik.values.password} onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')} error={formik.errors.password} touched={formik.touched.password}
                    />

                    <TouchableOpacity style={[styles.btn, formik.isSubmitting && { opacity: 0.7 }]} onPress={formik.handleSubmit} disabled={formik.isSubmitting}>
                        <Text style={styles.btnText}>{formik.isSubmitting ? 'Loading...' : 'Login'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 15, alignItems: 'center' }}>
                        <Text style={{ color: '#007BFF' }}>Belum punya akun? Register</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    btn: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});