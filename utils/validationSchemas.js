import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
    password: Yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'),
});

export const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Nama minimal 3 karakter').required('Nama lengkap wajib diisi'),
    email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
    phone: Yup.string().matches(/^(\+62|08)[0-9]{8,11}$/, 'Contoh: 08123456789').required('Nomor HP wajib diisi'),
    password: Yup.string()
        .min(8, 'Password minimal 8 karakter')
        .matches(/[A-Z]/, 'Harus mengandung huruf kapital')
        .matches(/[0-9]/, 'Harus mengandung angka')
        .required('Password wajib diisi'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password tidak cocok')
        .required('Konfirmasi password wajib diisi'),
});