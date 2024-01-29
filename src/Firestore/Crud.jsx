import React, { useEffect, useState } from 'react'
import { db } from './Firebase'
import { get, onValue, push, ref, remove, set, update } from 'firebase/database';

const Crud = () => {
    const [user, setUser] = useState([])
    const [input, setInput] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState('');

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        const dbRef = ref(db, 'users');

        onValue(dbRef, (snapshot) => {
            var list = []
            snapshot.forEach((childSnapshot) => {
                const key = childSnapshot.key;
                const data = childSnapshot.val();
                list.push({ key, ...data })
            });
            setUser(list)
        });
    }

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEdit && editId) {
            const userRef = ref(db, `users/${editId}`)
            update(userRef, input).then(() => {
                // setIsEdit(false);
                setEditId('');
            });;
        } else {
            const dbRef = ref(db, 'users')
            const newRef = push(dbRef)
            set(newRef, input).then(() => {
                setInput({ name: '', email: '' });
            });
        }
        setEditId(false)
    }

    const handleDelete = (id) => {
        const dbRef = ref(db, `users/${id}`)
        remove(dbRef).then(() => {
            console.log('success..')
        })
    }

    const handleEdit = (id) => {
        const dbRef = ref(db, `users/${id}`)
        get(dbRef).then((item) => {
            var data = item.val()
            setInput({ ...input, ...data })
            setIsEdit(true);
            setEditId(id);
        })
        console.log(isEdit)
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" onChange={handleChange} name='name' value={input ? input.name : ""} />
                <input type="text" onChange={handleChange} name='email' value={input ? input.email : ""} />
                <h1>Products</h1>
                <button>{isEdit ? 'Update' : 'Add'}</button>
                <table className='table-dark'>
                    <thead>
                        <tr>
                            <th>userName</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                        {
                            user.map((item, id) => {
                                return (
                                    <tr key={item.key}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td><button onClick={() => handleDelete(item.key)}>🗑️</button><button onClick={() => handleEdit(item.key)}>📝</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </form>
        </>

    )
}

export default Crud
