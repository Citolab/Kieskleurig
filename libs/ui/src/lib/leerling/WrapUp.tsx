import { Card as CardType, sort, StudentReport } from '@burgerschap/data';
import { motion } from 'framer-motion';
import React from 'react';
import Badge from '../components/Badge';
import { Card } from '../components/Card';

interface Props {
  cards: CardType[];
  report: StudentReport;
}
export const WrapUp = (props: Props) => {
  const matchingImportantElement =
    props.report.matchingMostImportant === 0 ? (
      <div className="mt-2">
        <div>
          <span className="text-xl font-header">Geen één leerling</span>
        </div>
        <div className="ml-7">
          vond deze stelling met dezelfde overweging ook het belangrijkste.
        </div>
      </div>
    ) : props.report.matchingMostImportant === 1 ? (
      <div className="mt-2">
        <div>
          <span className="text-xl font-header">1 leerling</span>
        </div>
        <div className="ml-7">
          vond deze stelling met dezelfde overweging ook het belangrijkste.
        </div>
      </div>
    ) : (
      <div className="mt-2">
        <div>
          <span className="text-xl font-header">
            {props.report.matchingMostImportant} leerlingen
          </span>
        </div>
        <div className="ml-7">
          vonden deze stelling met dezelfde overweging ook het belangrijkste.
        </div>
      </div>
    );
  const matchingElement =
    props.report.matching === 0 ? (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">Geen één leerling</span>
        </div>
        <div className="ml-7">
          heeft precies dezelfde 4 stellingen en overwegingen gekozen.
        </div>
      </div>
    ) : props.report.matching === 1 ? (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">1 leerling</span>
        </div>
        <div className="ml-7">
          heeft precies dezelfde 4 stellingen en overwegingen gekozen.
        </div>
      </div>
    ) : (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">
            {props.report.matching} leerlingen
          </span>
        </div>
        <div className="ml-8">
          hebben precies dezelfde 4 stellingen en overwegingen gekozen.
        </div>
      </div>
    );

  const notmatchingElement =
    props.report.notMatching === 0 ? (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">Geen één leerling</span>
        </div>
        <div className="ml-7">heeft 4 andere stellingen gekozen.</div>
      </div>
    ) : props.report.notMatching === 1 ? (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">1 leerling</span>
        </div>
        <div className="ml-7">heeft 4 andere stellingen gekozen.</div>
      </div>
    ) : (
      <div className="mt-8">
        <div>
          <span className="text-xl font-header">
            {props.report.notMatching} leerlingen
          </span>
        </div>
        <div className="ml-8">hebben 4 andere stellingen gekozen.</div>
      </div>
    );
  const domainCounts = props.report.domainCounts;
  const groupDomains = ['samenleving', 'ecologie', 'economie'].map(
    (domain) => ({
      name: domain,
      count: domainCounts[domain] || 0,
    })
  );

  const studentDomains = ['samenleving', 'ecologie', 'economie'].map(
    (domain) => ({
      name: domain,
      count: props.cards.filter((c) => c.domain === domain).length,
    })
  );

  const mostChosenGroupDomain = sort(groupDomains, (d) => d.count, true)[0];
  const mostChosenStudentDomain = sort(studentDomains, (d) => d.count, true)[0];

  const mostImportantCard = sort(props.cards, (card) => card.order, true)[0];

  return (
    <div className="h-screen w-screen flex flex-col p-4">
      <h1 className="font-header">Jouw uitslag</h1>
      <h2 className="text-xl font-header mt-8">Jouw belangrijkste stelling</h2>
      <div>
        <Card
          id="id"
          color={mostImportantCard.themeColor}
          title={mostImportantCard.title}
          badge={
            mostImportantCard.domain && (
              <Badge
                color={mostImportantCard.themeColor}
                domain={mostImportantCard.domain}
              ></Badge>
            )
          }
          className="shadow"
        >
          {mostImportantCard.thesis}
        </Card>
      </div>

      {matchingImportantElement}
      {matchingElement}
      {notmatchingElement}
      <div className="w-full">
        <div className="mt-8">
          <span className="text-xl font-header">Meest gekozen domein</span>
        </div>
        <div className="ml-7">jij: {mostChosenStudentDomain.name}</div>
        <div className="ml-7">jouw klas: {mostChosenGroupDomain.name}</div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};
