import { Titulo } from '../componentes/title.jsx';
import { Buscador } from '../componentes/search.jsx';
import { Lista } from '../componentes/list.jsx';
import { ListItem } from '../componentes/listItem.jsx';
import { Boton } from  '../componentes/boton.jsx';
import { Loading } from  '../componentes/loading.jsx';
import { Error } from  '../componentes/error.jsx';
import { Vacio } from  '../componentes/vacio.jsx';
import { Mensaje } from '../componentes/mensaje.jsx';
import { TodoContext} from './context.jsx';
import { ModalAñadir } from '../componentes/modal-añadir.jsx';
import { Form } from '../componentes/form.jsx';
import { Edit  } from "../componentes/edit.jsx"
import React from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

function AppUi () {

  const {
    loading,
    error,
    buscar,
    completado,
    borrar,
    todos,
    openModal,
    abrirEditar,
    todoEditando,
    actualizarOrden
  } = React.useContext(TodoContext);

  // 🔑 CLAVE: Usar PointerSensor con activationConstraint
  // Esto requiere que muevas el ratón 8px antes de activar el drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere mover 8px para activar drag
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // 🔹 indices en la lista FILTRADA
    const oldIndex = buscar.findIndex(item => item.id === active.id);
    const newIndex = buscar.findIndex(item => item.id === over.id);

    const nuevaBuscar = arrayMove(buscar, oldIndex, newIndex);

    // 🔥 reconstruir TODOS correctamente
    const nuevaLista = [...todos];

    const indicesVisibles = todos
      .map((item, index) =>
        buscar.some(b => b.id === item.id) ? index : null
      )
      .filter(index => index !== null);

    indicesVisibles.forEach((pos, i) => {
      nuevaLista[pos] = nuevaBuscar[i];
    });

    actualizarOrden(nuevaLista);
  };

  return (
    <>
      <Titulo/>
      <Buscador/>

      {todos.length > 0 && <Mensaje/>}

      {todos.length > 0 && todos.every(p => p.complete) && (
        <p style={{ textAlign: 'center', color: 'rgb(10, 166, 239)' }}>
          ¡Completaste todas tus tareas!
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={buscar.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Lista>

            {loading && <Loading/>}
            {error && <Error/>}
            {!loading && buscar.length === 0 && <Vacio/>}

            {buscar.map(producto => (
              <ListItem
                key={producto.id}
                id={producto.id}
                text={producto.text}
                complete={producto.complete}
                onComplete={() => completado(producto.id)}
                onDelete={() => borrar(producto.id)}
                onEdit={() => abrirEditar(producto)}
              />
            ))}

          </Lista>
        </SortableContext>
      </DndContext>

      <Boton/>

      {openModal && (
        <ModalAñadir>
          {todoEditando ? <Edit/> : <Form/>}
        </ModalAñadir>
      )}
    </>
  );
}


export {AppUi};
