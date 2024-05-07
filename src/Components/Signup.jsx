import { useFormik } from 'formik'
import * as Yup from 'yup';
import React, { useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';

export default function Signup() {
    let navigationCopy = useNavigate()
    let [loading, setLoading] = useState(true)
    let validationSchema = Yup.object({
        name: Yup.string().min(3, "Name must consists of at least 3 characters").required("Name is required"),
        email: Yup.string().email().required("E-mail is required"),
        phone: Yup.string().required("Phone is required").matches(/^01[0125][0-9]{8}$/),
        age: Yup.string().required("Age is required").matches(/^[1-9][0-9]$|^100$/, "Age must be number from 10 - 100"),
        password: Yup.string().required("Password is required").matches(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/, "Password must contains 2 uppercase letters , 2 digits , 3 lowercase letters and 1 special character ")
    });

    let RegisterationForm = useFormik(
        {
            initialValues: {
                name: "",
                email: "",
                phone: "",
                age: "",
                password: ""
            },
            validationSchema,
            onSubmit: registerForm
        }
    )

    async function registerForm(values) {
        await axios.post('https://note-sigma-black.vercel.app/api/v1/users/signUp', values).then((response) => {
            if (response.data.msg == "done") {
                toast("🎉🎉 Account created successfully")
                navigationCopy("/")
            }
        }).catch((error) => {
            toast.error(error.response.data.msg)
        })
    }

    return <>
        <Toaster />
        <div className='container d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <div className='w-100 shadow-lg rounded-1'>
                <div className='row g-3'>
                    <div className='col-md-12 py-5' onSubmit={RegisterationForm.handleSubmit}>
                        <form className='w-100 mx-auto rounded-2  py-3 my-4'>
                            <p className='text-center fw-bolder fs-3 py-3 '>Sign Up</p>
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={RegisterationForm.handleChange} onBlur={RegisterationForm.handleBlur} name='name' placeholder='Name'></input>
                            {RegisterationForm.errors.name && RegisterationForm.touched.name ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{RegisterationForm.errors.name}</div> : ""}
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={RegisterationForm.handleChange} onBlur={RegisterationForm.handleBlur} name='email' placeholder='E-mail'></input>
                            {RegisterationForm.errors.email && RegisterationForm.touched.email ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{RegisterationForm.errors.email}</div> : ""}
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={RegisterationForm.handleChange} onBlur={RegisterationForm.handleBlur} name='age' placeholder='Age'></input>
                            {RegisterationForm.errors.age && RegisterationForm.touched.age ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{RegisterationForm.errors.age}</div> : ""}
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={RegisterationForm.handleChange} onBlur={RegisterationForm.handleBlur} name='phone' placeholder='Phone'></input>
                            {RegisterationForm.errors.phone && RegisterationForm.touched.phone ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{RegisterationForm.errors.phone}</div> : ""}
                            <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={RegisterationForm.handleChange} onBlur={RegisterationForm.handleBlur} name='password' placeholder='Password'></input>
                            {RegisterationForm.errors.password && RegisterationForm.touched.password ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{RegisterationForm.errors.password}</div> : ""}
                            {loading ? <button disabled={!(RegisterationForm.isValid && RegisterationForm.dirty)} onSubmit={RegisterationForm.handleSubmit} className='btn border-0 d-block w-25 mx-auto input-txt my-4' style={{ backgroundColor: "#6EB1D6" }}>Submit</button> : <button className='btn border-0 d-block w-25 mx-auto input-txt my-4' style={{ backgroundColor: "#6EB1D6" }}><i className='fa-solid fa-spinner fa-spin'></i></button>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}
