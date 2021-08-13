import {
  Activity,
  CardsStateModel,
  flatten,
  getCardDistribution,
} from '@burgerschap/data';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import BadgeCircle from '../components/BadgeCircle';

interface Props {
  activity: Activity;
  studentStates: CardsStateModel[];
}
export const GroupResult = (props: Props) => {
  if (props.studentStates.length === 0) {
    return <div></div>;
  }
  const allSelectedCards = flatten(props.studentStates.map((s) => s.cards));
  const cardDistribution = getCardDistribution(props.studentStates);
  return (
    <div className="w-full p-3">
      <h1 className="font-header flex-1">Hoe verschillen jullie meningen?</h1>
      <div className="w-full flex flex-col">
        <h3 className="font-header flex-1 mt-8 -mb-8">
          Hoe vaak hebben jullie de domeinen gekozen?
        </h3>
        <div className="flex flex-1 justify-center items-center">
          <BadgeCircle
            totalAll={
              allSelectedCards.filter((c) => c.domain === 'ecologie').length /
              allSelectedCards.length
            }
            domain="ecologie"
          ></BadgeCircle>
          <BadgeCircle
            totalAll={
              allSelectedCards.filter((c) => c.domain === 'economie').length /
              allSelectedCards.length
            }
            domain="economie"
          ></BadgeCircle>
          <BadgeCircle
            totalAll={
              allSelectedCards.filter((c) => c.domain === 'samenleving')
                .length / allSelectedCards.length
            }
            domain="samenleving"
          ></BadgeCircle>
        </div>
        <div className="flex-1"></div>
      </div>
      <h3 className="font-header flex-1 mb-2">
        Welke stellingen vonden jullie het belangrijkste?
      </h3>
      {cardDistribution
        .filter((cardInfo) => cardInfo.count !== 0)
        .map((cardInfo, i) => {
          return (
            <div className="w-fulls">
              <Card
                id="id"
                key={i}
                title={cardInfo.card.title}
                color={cardInfo.card.themeColor}
                opposite={cardInfo.opposite}
                sizeInPercentage={cardInfo.percentage}
                sizeToShow={cardInfo.percentage}
                badge={
                  <>
                    {cardInfo.ecologie > 0 && (
                      <Badge
                        total={cardInfo.ecologie}
                        color={cardInfo.card.themeColor}
                        domain="ecologie"
                      ></Badge>
                    )}
                    {cardInfo.economie > 0 && (
                      <Badge
                        total={cardInfo.economie}
                        color={cardInfo.card.themeColor}
                        domain="economie"
                      ></Badge>
                    )}
                    {cardInfo.samenleving > 0 && (
                      <Badge
                        total={cardInfo.samenleving}
                        color={cardInfo.card.themeColor}
                        domain="samenleving"
                      ></Badge>
                    )}
                  </>
                }
              >
                {cardInfo.percentage > 10 ? cardInfo.card.thesisShort : ''}
              </Card>
            </div>
          );
        })}
      <div className="w-full flex flex-wrap">
        {cardDistribution
          .filter((cardInfo) => cardInfo.count === 0)
          .map((cardInfo, i) => {
            return (
              // <div className="w-fulls">
              <Card
                id="id"
                key={i}
                title={cardInfo.card.title}
                color={cardInfo.card.themeColor}
                opposite={cardInfo.opposite}
                sizeInPercentage={cardInfo.percentage}
                sizeToShow={cardInfo.percentage}
                badge={
                  <>
                    {cardInfo.ecologie > 0 && (
                      <Badge
                        total={cardInfo.ecologie}
                        color={cardInfo.card.themeColor}
                        domain="ecologie"
                      ></Badge>
                    )}
                    {cardInfo.economie > 0 && (
                      <Badge
                        total={cardInfo.economie}
                        color={cardInfo.card.themeColor}
                        domain="economie"
                      ></Badge>
                    )}
                    {cardInfo.samenleving > 0 && (
                      <Badge
                        total={cardInfo.samenleving}
                        color={cardInfo.card.themeColor}
                        domain="samenleving"
                      ></Badge>
                    )}
                  </>
                }
              >
                {cardInfo.percentage > 10 ? cardInfo.card.thesisShort : ''}
              </Card>
              // </div>
            );
          })}
      </div>
    </div>
  );
};

// className="absolutel" style={{ width: cardInfo.percentage + `%` }}
