import React, { use } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const TodoContext = React.createContext();

function TodoProvider ({children}) {
    const {item: todos, actualizar: setTodos, loading, error} = useLocalStorage("LISTA_V2", []);
    const [valorInput, setValorInput] = React.useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [todoEditando, setTodoEditando] = React.useState(null);


    const productosCompletados = todos.filter(producto => !!producto.complete).length
    const totalProductos = todos.length

    const buscar = todos.filter((producto) => {
        return producto.text.toLowerCase().includes(valorInput.toLocaleLowerCase())
     })

    const añadirTarea = (newText) => {
        const id = nuevoId(todos)
        const nuevaLista = [... todos];
        nuevaLista.push({
            id,
            text: newText,
            complete: false,
        })
        setTodos(nuevaLista)
    }

    const completado = (id) => {
    const nuevaLista = [... todos];
    const nuevoCompletado = nuevaLista.findIndex((producto) => producto.id === id);
        nuevaLista[nuevoCompletado].complete = true;
        setTodos(nuevaLista);
    }

    const borrar = (id) => {
    const nuevaLista = todos.filter(producto => producto.id !== id);
    setTodos(nuevaLista);
    }

    const actualizarProducto = (id, newTexto) => {
         const nuevaLista = [... todos];
        const nuevoEditado = nuevaLista.findIndex((producto) => producto.id === id);
        nuevaLista[nuevoEditado].text = newTexto;
        setTodos(nuevaLista);
    }

    const actualizarOrden = (nuevaLista) => {
        setTodos(nuevaLista);
    };

    const abrirEditar = (todo) => {
        setTodoEditando(todo);
        setOpenModal(true);
    };

    return(
        <TodoContext.Provider value={{loading, error, setValorInput, buscar, borrar, completado, todos, totalProductos, productosCompletados, openModal, setOpenModal, añadirTarea, actualizarProducto, abrirEditar, todoEditando, setTodoEditando, actualizarOrden}}>
            {children}
        </TodoContext.Provider>
    )

}


function nuevoId(listTodos) {

    if(!listTodos.length) {
        return 1;
    }

    const listIdMax = listTodos.map(todo => todo.id);
    const idMax = Math.max(...listIdMax)
    return idMax + 1

}



export { TodoContext, TodoProvider}