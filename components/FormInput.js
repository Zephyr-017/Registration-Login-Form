import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Menggunakan forwardRef untuk fitur auto-focus Level 3
export const FormInput = forwardRef(({ label, error, touched, style, secureTextEntry, isPassword, ...rest }, ref) => {
    const isPasswordField = secureTextEntry || isPassword;
    const [isObscured, setIsObscured] = useState(isPasswordField);
    
    const hasError = touched && error;

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputContainer}>
                <TextInput
                    ref={ref}
                    style={[styles.input, hasError && styles.inputError, style, isPasswordField && { paddingRight: 45 }]}
                    placeholderTextColor="#999"
                    secureTextEntry={isObscured}
                    {...rest}
                />
                {isPasswordField && (
                    <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setIsObscured(!isObscured)}
                    >
                        <Ionicons 
                            name={isObscured ? "eye-off" : "eye"} 
                            size={20} 
                            color="#888" 
                        />
                    </TouchableOpacity>
                )}
            </View>
            {hasError && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
    inputContainer: { position: 'relative', justifyContent: 'center' },
    input: {
        borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 15, backgroundColor: '#fafafa', color: '#222'
    },
    inputError: { borderColor: '#E53E3E', backgroundColor: '#FFF5F5' },
    errorText: { fontSize: 12, color: '#E53E3E', marginTop: 5 },
    eyeIcon: { position: 'absolute', right: 12, padding: 4 },
});