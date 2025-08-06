import React, { useState, useEffect } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {

	const [task, setTask] = useState("")
	const [todos, setTodos] = useState([])
	useEffect(() => {
		obtenerTareas()
	}, [])

	const createUser = () => {
		fetch('https://playground.4geeks.com/todo/users/Juan', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log(resp.ok)
				console.log(resp.status)
				return resp.json()
			})
			.then(data => {
				console.log(data)

			})
			.catch(error => {
				console.log(error)
			})
	}

	const obtenerTareas = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/users/Juan')
			console.log(response)
			if(response.status == 404){
				createUser()
				return
			}
			const data = await response.json()
			console.log(data.todos)
			setTodos(data.todos)
		} catch (error) {
			console.log(error)
		}
	}

	const handleClick = () => {
		if (!task.trim()) return;
		//console.log("New task", task)
		//setTodos([...todos, task])
		const newTask = {
			"label": task,
			"is_done": false
		}
		fetch('https://playground.4geeks.com/todo/todos/Juan', {
			method: "POST",
			body: JSON.stringify(newTask),
			headers: {
				"Content-Type": "application/json"
			}

		})
			.then(resp => {
				console.log(resp.ok)
				console.log(resp.status)
				if (!resp.ok) {
					throw new Error("Error creando tarea")
				}
				return resp.json()
			})
			.then(data => {
				//console.log(data)
				setTodos((prev) => [...prev, data])
				setTask("")
			})
			.catch(error => {
				console.log(error)

			})

	}

	const handleChange = (event) => {
		setTask(event.target.value)
		//console.log(event.target.value)
	}

	const deleteTodo = async (id) => {
		console.log(id)
		
		const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
		})
			console.log(response)
			if(response.status == 204){
				obtenerTareas()
			}
	}


	return (
		<div className=" text-center">
			<h1>ToDos</h1>
			<div className="container">
				<div className="d-flex gap-2">
					<input className="form-control" type="text" value={task} onChange={handleChange} />
					<button className="btn btn-primary" onClick={handleClick}>Agregar tarea</button>
				</div>

				<h5 className="mt-2"> {task}</h5>

				<ul className="list-group">
					{todos.map((todo) => {
						return (
							<li key={todo.id} className={`list-group-item d-flex justify-content-between align-items-center ${todo.id % 2 === 0 ? "bg-light" : ""}`}>
								{todo.label} <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>X</button>
							</li>
						)
					})}
				</ul>
			</div>

		</div>
	);
};

export default Home;