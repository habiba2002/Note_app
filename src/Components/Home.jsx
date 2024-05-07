import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';
import { useFormik } from 'formik'
import axios from 'axios';
import Note from './Note';
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const [show, setShow] = useState(false);
    const [notes, setnotes] = useState([]);
    let [loading, setLoading] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let usertoken = "3b8ny__" + localStorage.getItem("Token")
    var navigationCopy = useNavigate()
    const config = {
        headers: { token: usertoken }
    };

    let validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        content: Yup.string().required("Content is required")
    });

    let AddNoteForm = useFormik(
        {
            initialValues: {
                title: "",
                content: ""
            },
            validationSchema,
            onSubmit: AddNoteFormSubmit
        }
    )

    async function AddNoteFormSubmit(values) {
        handleClose()
        await axios.post('https://note-sigma-black.vercel.app/api/v1/notes', values, config).then((response) => {
            if (response.data.msg == "done") {
                
            }
        }).catch((error) => {
            toast.error(error.response.data.msg)
        })
        getAllNotes()
    }

    async function getAllNotes() {
        setLoading(true)
        await axios.get('https://note-sigma-black.vercel.app/api/v1/notes', config).then((response) => {
            if (response.data.msg == "done") {
                setnotes(response.data.notes)
                setLoading(false)
            }
        }).catch((error) => {
            if(error.response.data.msg){
                setnotes([])
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        getAllNotes()
    }, [])

    function logout() {
        localStorage.removeItem("Token")
        navigationCopy("/")
    }

    return <>
        
        {loading ? <div className='bg-dark position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center'>
            <i className='fa-solid fa-spinner fa-spin fa-2xl' style={{color :"white"}}></i>
        </div> : <>
            <div className='position-relative shadow-sm' style={{ backgroundColor: "rgba(0 ,0 , 0 , 0.8)" }}>
                <p className='fw-bold fa-sm text-white' style={{cursor : "pointer"}} onClick={logout}><i className='fa-solid fa-arrow-left my-3 ms-4 me-2' ></i>Logout</p>
                <div className='position-absolute d-flex justify-content-center align-items-center start-50 top-100 translate-middle rounded-circle' style={{ height: "80px", width: "80px", backgroundColor: "var(--main_color)" }}>
                    <div className='border bg-light-subtle rounded-circle d-flex justify-content-center align-items-center' style={{ height: "55px", width: "60px" }}>
                        <Button className='bg-transparent border-0 text-black' onClick={handleShow}  ><i className='fa-solid fa-plus'></i></Button>
                    </div>
                </div>
            </div>
            <div className='container p-5 '>
                <div className='row py-3 g-3 justify-content-evenly'>
                    {notes.map((element, index) => <Note note={element} getnotes={getAllNotes} key={index} />)}
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                    <form className='w-100 mx-auto rounded-2 my-4' onSubmit={AddNoteForm.handleSubmit}>
                        <p className='text-center fw-bolder fs-5 py-5'>What are you thinking about.. 🧐🧐</p>
                        <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={AddNoteForm.handleChange} onBlur={AddNoteForm.handleBlur} name='title' placeholder='Note title'></input>
                        {AddNoteForm.errors.title && AddNoteForm.touched.title ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{AddNoteForm.errors.title}</div> : ""}
                        <textarea className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={AddNoteForm.handleChange} onBlur={AddNoteForm.handleBlur} name="content" rows="6" placeholder='Note description'></textarea>
                        {AddNoteForm.errors.content && AddNoteForm.touched.content ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{AddNoteForm.errors.content}</div> : ""}
                        <Modal.Footer className='border-0'>
                            <Button className='border-1 border-dark input-txt' style={{ backgroundColor: "gray", color: "black" }} variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <button disabled={!(AddNoteForm.isValid && AddNoteForm.dirty)} variant="primary" type='submit' className='btn border-dark-subtle input-txt' onSubmit={AddNoteForm.handleSubmit} style={{ backgroundColor: "var(--main_color)", color: "black" }}>
                                Add note
                            </button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal></>

        }

    </>
}
