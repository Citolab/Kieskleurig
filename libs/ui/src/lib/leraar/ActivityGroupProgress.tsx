import {
  Activity,
  OrderState,
  CardsStateModel,
  themes,
  sum,
  DomainType,
  flatten,
  Theme,
  getStudentCardInfo,
} from '@burgerschap/data';
import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import { Card } from '../components/Card';

interface Props {
  activity: Activity;
  studentStates: CardsStateModel[];
  onNextCard(): void;
  onGoToResults(): void;
}

export const ActivityGroupProgress = (props: Props) => {
  const isLastTheme =
    props.activity.currentThemeId === themes[themes.length - 1].id;
  const currentTheme = themes.find(
    (t) => t.id === props.activity.currentThemeId
  );

  const studentAnswerInfo = getStudentCardInfo(
    props.studentStates,
    currentTheme
  );
  return (
    <div className="w-screen h-screen">
      <div className="flex w-full">
        {themes.map((theme, i) => (
          <div
            key={theme.id}
            style={{ backgroundColor: theme.themeColor }}
            className={`flex-1 ${
              currentTheme.id === theme.id ? `h-8` : `h-4`
            } `}
          ></div>
        ))}
      </div>

      <div className="flex h-1/4 p-4">
        {!isLastTheme ? (
          <button
            className="btn-primary fixed bottom-2 right-2"
            onClick={props.onNextCard}
          >
            Volgende
          </button>
        ) : (
          <button
            className="btn-primary fixed bottom-2 right-2"
            onClick={props.onGoToResults}
          >
            Verder
          </button>
        )}
        <div className="overflow-hidden ">
          <div className="text-left   px-6 w-full flex justify-center">
            <div className="w-2/3">
              <div className="h1 font-header">{currentTheme.title}</div>
              {currentTheme.description}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-1/3 p-4">
        {currentTheme.cards.map((standpunt, i) => (
          <Card
            key={i}
            id="id"
            opposite={i % 2 === 0}
            color={currentTheme.themeColor}
            sizeInPercentage={
              studentAnswerInfo.cardPercentages.find(
                (c) => c.id === standpunt.id
              ).percentage
            }
            badge={
              <>
                <Badge
                  total={
                    studentAnswerInfo.cardDomainDistribution.find(
                      (c) => c.id === standpunt.id
                    ).distribution.ecologie
                  }
                  color={currentTheme.themeColor}
                  domain="ecologie"
                ></Badge>
                <Badge
                  total={
                    studentAnswerInfo.cardDomainDistribution.find(
                      (c) => c.id === standpunt.id
                    ).distribution.economie
                  }
                  color={currentTheme.themeColor}
                  domain="economie"
                ></Badge>
                <Badge
                  total={
                    studentAnswerInfo.cardDomainDistribution.find(
                      (c) => c.id === standpunt.id
                    ).distribution.samenleving
                  }
                  color={currentTheme.themeColor}
                  domain="samenleving"
                ></Badge>
              </>
            }
            title={standpunt.title}
          >
            {standpunt.thesis}
          </Card>
        ))}
      </div>

      {/* <div className="flex justify-around p-4 mt-5 justify-items-stretch">
        <div className="w-1/3 h-full flex">
          <div className="p-4 rotate-2 bg-white overflow-hidden shadow-md border rounded border-gray-300 text-gray-800 w-full">
            {currentTheme.cards[0].thesis}
          </div>
        </div>
        <div className="w-1/3 h-full flex flex-row-reverse">
          <div className="p-4 -rotate-2 bg-white overflow-hidden shadow-md border rounded border-gray-300 text-gray-800 w-full">
            {currentTheme.cards[1].thesis}
          </div>
        </div>
      </div> */}

      <div className="h-1/4 p-4">
        <div className="flex justify-center">
          <div className="text-base text-primary-800">
            {studentAnswerInfo.answered === 0 ? (
              <span>Er hebben nog geen leerlingen een keuze gemaakt.</span>
            ) : studentAnswerInfo.answered === props.studentStates.length ? (
              <span>Alle leerlingen hebben een keuze gemaakt.</span>
            ) : (
              <span>
                {studentAnswerInfo.unanswered} van de{' '}
                {props.studentStates.length} leerlingen moet nog een keuze
                maken.
              </span>
            )}
          </div>
          {/* {unanswered() !== 0 && !overrideShowResult ? (
              <button
                className="mt-1 bg-white hover:bg-primary-500 text-primary-500 font-semibold hover:text-white py-2 px-4 border border-primary-500 hover:border-white rounded"
                onClick={() => setOverrideShowResult(true)}
              >
                Toon nieuwe verdeling
              </button>
            ) : null} */}
        </div>

        <div className="flex m-4 justify-center">
          <p className="speech text-primary p-1 mx-4">
            {currentTheme.prompts[1]}
          </p>
          <p className="speech text-primary p-1 mx-4">
            {currentTheme.prompts[0]}
          </p>
        </div>
      </div>
    </div>
  );
};
