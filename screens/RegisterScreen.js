import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Keyboard, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormInput } from '../components/FormInput';
import { RegisterSchema } from '../utils/validationSchemas';

const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export default function RegisterScreen({ navigation }) {
    const [profileImage, setProfileImage] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState('');

    // Refs untuk auto-focus Level 3
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Izinkan akses galeri untuk memilih foto.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, aspect: [1, 1], quality: 0.7,
        });
        if (!result.canceled) setProfileImage(result.assets[0].uri);
    };

    const checkPasswordStrength = (pass) => {
        if (pass.length === 0) return setPasswordStrength('');
        if (pass.length < 8) return setPasswordStrength('Weak');
        if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 8) {
            return setPasswordStrength('Strong');
        }
        return setPasswordStrength('Medium');
    };

    const formik = useFormik({
        initialValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (!profileImage) {
                    Alert.alert('Error', 'Pilih foto profil terlebih dahulu!');
                    return;
                }
                // Level 3: Simpan data ke AsyncStorage
                const userData = { ...values, profileImage };
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                Alert.alert('Berhasil', 'Registrasi Sukses!', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]);
            } catch (e) {
                Alert.alert('Error', 'Gagal menyimpan data');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>

                    <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.placeholder}><Text>Pilih Foto Profil</Text></View>
                        )}
                    </TouchableOpacity>

                    <FormInput
                        label="Nama Lengkap" placeholder="Masukkan nama"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        value={formik.values.name} onChangeText={formik.handleChange('name')}
                        onBlur={formik.handleBlur('name')} error={formik.errors.name} touched={formik.touched.name}
                    />

                    <FormInput
                        ref={emailRef}
                        label="Email" placeholder="contoh@email.com" keyboardType="email-address" autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => phoneRef.current?.focus()}
                        value={formik.values.email} onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')} error={formik.errors.email} touched={formik.touched.email}
                    />

                    <FormInput
                        ref={phoneRef}
                        label="Nomor HP" placeholder="08123456789" keyboardType="phone-pad"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        value={formik.values.phone} onChangeText={formik.handleChange('phone')}
                        onBlur={formik.handleBlur('phone')} error={formik.errors.phone} touched={formik.touched.phone}
                    />

                    <FormInput
                        ref={passwordRef}
                        label="Password" placeholder="Masukkan password" secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        value={formik.values.password}
                        onChangeText={(text) => {
                            formik.handleChange('password')(text);
                            checkPasswordStrength(text);
                        }}
                        onBlur={formik.handleBlur('password')} error={formik.errors.password} touched={formik.touched.password}
                    />
                    {passwordStrength ? <Text style={styles.strength}>Strength: {passwordStrength}</Text> : null}

                    <FormInput
                        ref={confirmPasswordRef}
                        label="Konfirmasi Password" placeholder="Ulangi password" secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={formik.handleSubmit}
                        value={formik.values.confirmPassword} onChangeText={formik.handleChange('confirmPassword')}
                        onBlur={formik.handleBlur('confirmPassword')} error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword}
                    />

                    <TouchableOpacity style={styles.btn} onPress={formik.handleSubmit} disabled={formik.isSubmitting}>
                        <Text style={styles.btnText}>{formik.isSubmitting ? 'Loading...' : 'Register'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
    imageContainer: { alignSelf: 'center', marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    placeholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    btn: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    strength: { fontSize: 12, marginBottom: 10, fontWeight: 'bold', color: '#555' }
});