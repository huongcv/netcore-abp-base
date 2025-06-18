// SortableSlot.tsx
import React, { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {useDndContext} from "@dnd-kit/core";
import {IGolfPlayerSlotItemProps} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/GolfPlayerSlotItem";

type SortableSlotProps = {
  id: string;
  children: ReactNode;
  className?: string;
  allowDrag?: boolean;
  data: IGolfPlayerSlotItemProps
};

export const SortableSlot: React.FC<SortableSlotProps> = ({ id, children, className, allowDrag = true, data  }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id , data: data });
  const { over } = useDndContext();
  const isOver = over?.id === id ;

  const style: React.CSSProperties = {
    // transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: allowDrag ? 'move' : 'default',
    border: isOver ? '2px dashed #00b96b' : undefined,
  };

  return (
      <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...(allowDrag ? listeners : {})}
          className={className}
      >
        {children}
      </div>
  );
};
