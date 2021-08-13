import { Theme } from "./interfaces";

const excelThemes =
[
  {
      "Thema": "Kleding",
      "Uitleg thema": "Veel mensen kopen regelmatig nieuwe kleding. De Fast Fashion industrie produceert grote hoeveelheden kleding om deze goedkoop te verkopen. Er wordt ook steeds meer duurzame kleding gemaakt, dit is vaak duurder. Wat kies jij?",
      "Standpunt 1": "Ik koop dure kleding die op een duurzame manier geproduceerd wordt.",
      "Standpunt 2": "Ik koop goedkope kleding ook al wordt die op een niet duurzame manier geproduceerd.",
      "Standpunt kort 1": "Duurzame kleding",
      "Standpunt kort 2": "Goedkope kleding",
      "Prompt 1": "Wat is de werkelijke prijs van goedkope kleding en wie betaalt die?",
      "Prompt 2": "Welke keuze zou je maken als je een kledingproducent was?",
      "ThemeColor": "#FB5E2E"
  },
  {
      "Thema": "Watertekort",
      "Uitleg thema": "In de zomer dreigt er in Nederland steeds vaker een watertekort. Soms wordt daardoor de waterdruk verlaagd en geldt er een sproeiverbod. Er zijn ook andere manieren om het waterverbruik te verminderen. Wat kies jij?",
      "Standpunt 1": "Bij dreigend watertekort moeten burgers meer betalen als ze meer verbruiken dan een vastgestelde hoeveelheid per persoon",
      "Standpunt 2": "Bij dreigend watertekort is het de verantwoordelijkheid van de burgers zelf om het waterverbruik te verminderen",
      "Standpunt kort 1": "Meer betalen",
      "Standpunt kort 2": "Eigen verantwoordelijkheid",
      "Prompt 1": "Wat voor gevolgen zou dit hebben voor jou?",
      "Prompt 2": "Wat zou dit voor waterbedrijven betekenen?",
      "ThemeColor": "#FFB740"

  },
  {
      "Thema": "Landgebruik",
      "Uitleg thema": "Nederland heeft een groot tekort aan woningen. Tegelijkertijd is het belangrijk voor het klimaat om natuurgebieden te behouden en uit te breiden. Je gemeente heeft een stuk land en twijfelt wat ze ermee moet doen. Wat zou jij doen?",
      "Standpunt 1": "Het land gebruiken om bossen en parken aan te leggen om klimaatverandering tegen te gaan.",
      "Standpunt 2": "Het land gebruiken om een nieuwe woonwijk te bouwen om het woningtekort tegen te gaan.",
      "Standpunt kort 1": "Groen aanleggen",
      "Standpunt kort 2": "Huizen bouwen",
      "Prompt 1": "Wat zou dit voor de inwoners betekenen?",
      "Prompt 2": "Wat voor gevolgen zou dit hebben voor de gemeente?",
      "ThemeColor": "#1AADA4"

  },
  {
      "Thema": "Schaduwonderwijs",
      "Uitleg thema": "Steeds meer leerlingen krijgen schaduwonderwijs. Ze volgen na schooltijd (duur) betaalde bijlessen en huiswerkbegeleiding. Schaduwonderwijs zorgt voor veel werkgelegenheid, maar vergroot ook verschillen tussen leerlingen. Wat vind jij?",
      "Standpunt 1": "Door schaduwonderwijs ontstaat veel werkgelegenheid. Daarom moet de overheid dit niet reguleren.",
      "Standpunt 2": "Schaduwonderwijs zorgt voor grote verschillen tussen leerlingen. Daarom moet de overheid dit wel reguleren.",
      "Standpunt kort 1": "Niet reguleren",
      "Standpunt kort 2": "Wel reguleren",
      "Prompt 1": "Wat betekent dit voor kansengelijkheid?",
      "Prompt 2": "Wat voor gevolgen zou dit hebben voor scholen?",
      "ThemeColor": "#333988"
  }
];

export const themes: Theme[] = excelThemes.map((theme, i) => {
  return {
    id: `Theme_${i}`,
    title: theme.Thema,
    themeColor: theme.ThemeColor,
    description: theme["Uitleg thema"],
    prompts: [
      theme["Prompt 1"], theme["Prompt 2"]
    ],
    cards: [{
      title: theme.Thema,
      themeColor: theme.ThemeColor,
      themeId: `Theme_${i}`,
      id: `Theme_${i}_Card_1`,
      thesis: theme["Standpunt 1"],
      thesisShort: theme["Standpunt kort 1"],
      order: null
    },
    {
      title: theme.Thema,
      themeColor: theme.ThemeColor,
      id: `Theme_${i}_Card_2`,
      themeId: `Theme_${i}`,
      thesis: theme["Standpunt 2"],
      thesisShort: theme["Standpunt kort 2"],
      order: null
    }]
  }
});
export default themes;