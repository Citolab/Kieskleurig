import React from 'react';
import { Activity, CardsStateModel } from '@burgerschap/data';
import { LeerlingIcon } from '../components/LeerlingIcon';

interface Props {
  activity: Activity;
  studentStates: CardsStateModel[];
  onStartGroup(): void;
}

export const TeacherStartPage = (props: Props) => {
  return (
    <>
      <h1 className="text-center text-5xl">{props.activity.code}</h1>
      <button
        className="btn-primary fixed bottom-2 right-2"
        onClick={props.onStartGroup}
      >
        Start groepsactiviteit.
      </button>
      <div className="flex flex-wrap w-96 mx-auto">
        {props.studentStates.map((student, index) => (
            <LeerlingIcon
            key={student.user?.id || index}
            widthInPercentage={12}
            color={`bg-gray-500`}
          ></LeerlingIcon>
        ))}
      </div>
    </>
  );
};
