import { useFormik } from 'formik'
import * as Yup from 'yup';
import React, { useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';

export default function Login() {
    let navigationCopy = useNavigate()
    let [loading, setLoading] = useState(true)
    let validationSchema = Yup.object({
        email: Yup.string().email().required("E-mail is required"),
        password: Yup.string().required("Password is required").matches(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/, "Password must contains 2 uppercase letters , 2 digits , 3 lowercase letters and 1 special character ")
    });

    let LoginForm = useFormik(
        {
            initialValues: {
                email: "",
                password: ""
            },
            validationSchema,
            onSubmit: LoginFormSubmit
        }
    )

    async function LoginFormSubmit(values) {
        await axios.post('https://note-sigma-black.vercel.app/api/v1/users/signIn', values).then((response) => {
            localStorage.setItem("Token", response.data.token)
            if (response.data.msg == "done") {
                toast("🎉🎉 Welcome")
                navigationCopy("/home")

            }
        }).catch((error) => {
            toast.error(error.response.data.msg)
        })
    }

    return <>
        <Toaster />
        <div className='container d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <div className='form-container w-100 shadow-lg rounded-1'>
                <div className='row g-3'>
                    <div className='col-md-12 py-5' >
                        <form className='w-100 mx-auto rounded-2  py-5 my-4' onSubmit={LoginForm.handleSubmit}>
                            <p className='text-center fw-bolder fs-3 py-3'>Login</p>
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={LoginForm.handleChange} onBlur={LoginForm.handleBlur} name='email' placeholder='E-mail'></input>
                            {LoginForm.errors.email && LoginForm.touched.email ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{LoginForm.errors.email}</div> : ""}
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={LoginForm.handleChange} onBlur={LoginForm.handleBlur} name='password' placeholder='Password'></input>
                            {LoginForm.errors.password && LoginForm.touched.password ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{LoginForm.errors.password}</div> : ""}
                            {loading ? <button disabled={!(LoginForm.isValid && LoginForm.dirty)} onSubmit={LoginForm.handleSubmit} className='btn border-0 d-block w-50 mx-auto input-txt mt-4' style={{ backgroundColor: "#6EB1D6" }}>Submit</button> : <button className='btn border-0 d-block w-50 mx-auto input-txt mt-4' style={{ backgroundColor: "#6EB1D6" }}><i className='fa-solid fa-spinner fa-spin'></i></button>}
                            <div className='text-center py-3'><small className='input-txt'>Don't have an account ? <Link to="/signup">Sign Up</Link></small></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}
