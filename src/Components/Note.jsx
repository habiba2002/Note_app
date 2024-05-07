import axios from 'axios'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';
import { useFormik } from 'formik'


export default function Note({ note, getnotes }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let getAllNotes = getnotes
    let usertoken = "3b8ny__" + localStorage.getItem("Token")
    const config = {
        headers: { token: usertoken }
    };



    let validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        content: Yup.string().required("Content is required")
    });

    let UpdateNoteForm = useFormik(
        {
            initialValues: {
                title: "",
                content: ""
            },
            validationSchema,
            onSubmit: updateNoteFormSubmit
        }
    )

    async function updateNoteFormSubmit(values) {
        handleClose()
        await axios.put(`https://note-sigma-black.vercel.app/api/v1/notes/${note._id}`, values, config).then((response) => {
            console.log(response)
            if (response.data.msg == "done") {
                getAllNotes()

            }
        }).catch((error) => {
            console.log(error)
        })
    }

    async function deleteNote(id) {
        await axios.delete(`https://note-sigma-black.vercel.app/api/v1/notes/${id}`, config).then((response) => {
            if (response.data.msg == "done") {
                getAllNotes()
            }
        }).catch((error) => {
            toast.error(error.response.data.msg)
        })
    }

    return <>
        <div className='col-lg-3 mx-1 p-5 shadow-lg rounded-start-1 position-relative rounded-end-5 rounded-bottom-1 overflow-hidden' key={note._id}>
            <div className='bg-white position-absolute top-0 end-0 ' style={{ width: "30px", height: "30px" }}></div>
            <div className='py-2 text-capitalize text-center fw-bold fs-5 bg-light-subtle my-1' style={{overflowWrap : "break-word"}}>
                {note.title}
            </div>
            <div className='py-2 text-capitalize text-center input-txt text-muted bg-light-subtle' style={{overflowWrap : "break-word"}}>
                <p className='justifty-txt p-3 text-wrap'>{note.content}</p>
            </div>
            <div className='position-absolute end-0 d-flex bottom-0 m-2' >
                <div className='mx-1'>
                    <Button onClick={handleShow} className='p-0 m-0 bg-transparent border-0' ><i className='fa-solid fa-edit fa-sm' style={{ height: "20px", width: "20px", color: "green" }}></i></Button>
                </div>
                <div className='mx-1'>
                    <button className='p-0 m-0 bg-transparent border-0' onClick={() => { deleteNote(note._id) }}><i className='fa-solid fa-trash fa-sm' style={{ height: "20px", width: "20px", color: "brown" }}></i></button>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
                <form className='w-100 mx-auto rounded-2 my-4' onSubmit={UpdateNoteForm.handleSubmit}>
                    <p className='text-center fw-bolder fs-5 py-5'>update your note.. 🤓🤓</p>
                    <input className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={UpdateNoteForm.handleChange} onBlur={UpdateNoteForm.handleBlur} defaultValue={note.title} name='title' placeholder='Note title'></input>
                    {UpdateNoteForm.errors.title && UpdateNoteForm.touched.title ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{UpdateNoteForm.errors.title}</div> : ""}
                    <textarea className='form-control input-txt w-75 mx-auto mb-2 bg-transparent shadow-sm' onChange={UpdateNoteForm.handleChange} onBlur={UpdateNoteForm.handleBlur} name="content" rows="6" defaultValue={note.content} placeholder='Note description'></textarea>
                    {UpdateNoteForm.errors.content && UpdateNoteForm.touched.content ? <div className='alert alert-danger w-75 mx-auto input-txt py-2'>{UpdateNoteForm.errors.content}</div> : ""}
                    <Modal.Footer className='border-0'>
                        <Button className='border-1 border-dark input-txt' style={{ backgroundColor: "gray", color: "black" }} variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <button disabled={!(UpdateNoteForm.isValid && UpdateNoteForm.dirty)} variant="primary" type='submit' onClick={updateNoteFormSubmit} className='btn border-dark-subtle input-txt' onSubmit={UpdateNoteForm.handleSubmit} style={{ backgroundColor: "var(--main_color)", color: "black" }}>
                            Update note
                        </button>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    </>
}
