import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { db } from './Firebase';
import { endAt, get, onValue, orderByChild, push, query, ref, remove, set, startAt, update, } from 'firebase/database';
import noData from './image/undraw_Empty_re_opql.png';
import 'firebase/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

const User = () => {
    const [input, setInput] = useState({});
    const [originalUser, setOriginalUser] = useState([]);
    const [user, setUser] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [gender, setGender] = useState('');
    const [noRecord, setNoRecord] = useState(false);
    const [find, setFind] = useState('')


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (user.length === 0) {
            setNoRecord(true);
        } else {
            setNoRecord(false);
        }
    }, [user]);

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'students'))

        var list = []
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            var data = doc.data()
            list.push({ id: doc.id, ...data, })
        });
        setUser(list);
        console.log(list)
    };


    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
        console.log(id)
        await deleteDoc(doc(db, `students/${id}`));
        fetchData()
    };

    const handleEdit = async (id) => {
        const studentRef = doc(db, `students/${id}`);
        const docSnap = await getDoc(studentRef)
        if (docSnap.exists()) {
            var data = docSnap.data()
            setInput({ ...input, ...data })
            setIsEdit(true)
            setEditId(id)
        } else {
            alert("Document does not exist!")
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit && editId) {
            const studentRef = doc(db, `students/${editId}`)
            await updateDoc(studentRef, input)
            setIsEdit(false)
            swal("Success!", "You clicked the button!", "success");
        } else {
            try {
                const studentRef = await addDoc(collection(db, "students"), input);
                swal("Success!", "You clicked the button!", "success");
            } catch (e) {
                swal("Error!", "You clicked the button!", "error");
            }
        }
        fetchData()
        setInput({ name: '', email: '', gender: '' });
    };


    return (
        <div className="container">
            <div className="form mt-5">
                <div className="d-flex align-items-center justify-content-between ">
                    <h3 className="m-0">User List</h3>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-4">
                    <form className="form d-flex flex-column justify-content-center align-items-start " onSubmit={handleSubmit}>
                        <div className="title">
                            Welcome,<span className="d-block">sign up to continue</span>
                        </div>
                        <input type="name" placeholder="Name" name="name" className="input w-100 " onChange={handleChange} value={input ? input.name : ''} required />
                        <input type="email" placeholder="Email" name="email" className="input w-100 " onChange={handleChange} value={input ? input.email : ''} required />
                        <select className="w-100 input" name="gender" onChange={handleChange} value={input ? input.gender : ''} required>
                            <option value="">--Gender--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <button className="button-confirm mt-3 mx-auto ">{isEdit ? 'Update User →' : 'Add User →'}</button>
                    </form>
                </div>
                <div className="col-8">
                    <table className="table form ">
                        <thead className="thead-bg-dark ">
                            <tr>
                                <th scope="col">Sr No.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noRecord ? (
                                <>
                                    <tr>
                                        <td className="text-center fw-bold pe-0 py-3 fs-3 text-danger" colSpan={6}>
                                            <img src={noData} alt="" className="d-block m-auto" width="150px" />
                                            No Record Found
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                user.map((item, id) => {
                                    return (
                                        <tr key={item.key}>
                                            <td>{id + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.gender}</td>
                                            <td>
                                                <button className="btn btn-danger " onClick={() => handleDelete(item.id)}>
                                                    Delete
                                                </button>
                                                <button className="btn btn-success ms-2" onClick={() => handleEdit(item.id)}>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default User;
