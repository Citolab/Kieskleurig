import { Card } from '@burgerschap/data';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Badge from '../components/Badge';
import { Card as ThesisCard } from '../components/Card';

interface Props {
  cards: Card[];
  onCardChange(newState: Card[]);
}
export const SortCards = (props: Props) => {
  const cards = props.cards;
  // do explicit null check instead of ! because !0 = true while order 0 is a valid value
  // [ arrayWithUnorderded cards, arrayWithCardsWhichHaveAnOrder]
  const orderedCards = [
    cards.filter((c) => c.order === null),
    cards.filter((c) => c.order !== null),
  ];

  const cardsToSort = []; // The array where we put one statement in

  orderedCards[0].length > 0 && cardsToSort.push(orderedCards[0][0]);

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return; // dropped outside the list
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(
        orderedCards[sInd],
        source.index,
        destination.index
      );
      const newState = [...orderedCards];
      newState[sInd] = items as Card[];
      props.onCardChange([
        ...newState[0],
        ...newState[1].map((c, order) => ({ ...c, order })),
      ]);
    } else {
      const result = move(
        orderedCards[sInd],
        orderedCards[dInd],
        source,
        destination
      );
      const newState = [...orderedCards];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      props.onCardChange([
        ...newState[0],
        ...newState[1].map((c, order) => ({ ...c, order })),
      ]);

      if (orderedCards[0].length > 0) {
        cardsToSort.push({ ...orderedCards[0][0] });
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable key={1} droppableId={`${1}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              w-full h-auto pt-3
              ${orderedCards[1].length < cards.length ? 'pb-48' : 'pb-16'}
              ${snapshot.isDraggingOver ? `bg-gray-200` : `bg-white`}
              `}
          >
            {/* {orderedCards[1].length === 0 && ( */}
              {/* <div className="text-center mt-8 text-gray-400">
                Zet de stellingen op volgorde, door de stelling naar boven te slepen.
                Zodat de stelling die je het belangrijkste vindt bovenaan staat en de minst belangrijke
                onderaan.
              </div> */}
            {/* )} */}

            {orderedCards[1].map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    id={item.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ThesisCard
                      id="id"
                      color={item.themeColor}
                      title={item.title}
                      badge={<Badge color={item.themeColor} domain={item.domain}></Badge>}
                      className={`${snapshot.isDragging ? `shadow-lg` : `shadow`}
                      
                      
                    `}
                      // style={provided.draggableProps.style}
                    >
                      {item.thesis}
                    </ThesisCard>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
            {orderedCards[1].length < 2 && (
              <div className="text-center mt-8 text-gray-400">
Zet de stellingen op volgorde. Houd je vinger even op de stelling en sleep deze naar boven. Zet dan de stellingen één voor één op volgorde: de stelling die je het belangrijkste vindt bovenaan en de minst belangrijke onderaan.
              </div>
            )}
          </div>
        )}
      </Droppable>

      {orderedCards[1].length < cards.length && (
        <Droppable key={0} droppableId={`${0}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={`
              w-full absolute bottom-0 left-0 right-0 pt-3
              ${snapshot.isDraggingOver ? `bg-gray-200` : `bg-transparent`}`}
              {...provided.droppableProps}
            >
              {cardsToSort.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ThesisCard
                        id="id"
                        color={item.themeColor}
                        title={item.title}
                        badge={
                          <Badge color={item.themeColor} domain={item.domain}></Badge>
                        }
                        className={`${
                          snapshot.isDragging ? `shadow-lg` : `shadow-md`
                        }`}
                        // style={provided.draggableProps.style}
                      >
                        {item.thesis}
                      </ThesisCard>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
