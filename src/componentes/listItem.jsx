import "../estilos/listItem.css";
import { MdCheckCircle } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { TodoContext } from "../context/context";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ListItem(props) {

    const {openModal, setOpenModal} = React.useContext(TodoContext);

    const AbrilModal = () => {
        setOpenModal(!openModal)
    }

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging
        ? "none"
        : "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging
        ? "0 10px 25px rgba(0,0,0,0.15)"
        : undefined,
    };

    return ( 
        <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={`lista ${props.complete ? "lista-check" : ""}`}  >
            <div className="accionCheck"><span className={`check ${props.complete ? "check-active" : ""}`} onClick={props.onComplete}><MdCheckCircle /></span></div>
            
            <p className={`parrafo ${props.complete ? "parrafo-check" : ""}`}>{props.text}</p>
            <div className="accionEdit"><span className="edit" onClick={props.onEdit}><MdModeEdit /></span></div>
            <div className="accionDelete"><span className="remove" onClick={props.onDelete}><TiDelete /></span></div>
        </li>
    )
}

export { ListItem };
