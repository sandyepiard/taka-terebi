import mathService from "../../../../shared/math/services/math/math.service.js";
import digimonFandomDetailsHandlerService from "../../page-handlers/digimon-fandom-details-handler/digimon-fandom-details-handler.service.js";
import digimonFandomLevelHandlerService from "../../page-handlers/digimon-fandom-level-handler/digimon-fandom-level-handler.service.js";
import {
  BaseDigimon,
  Digimon,
  DigimonDetails,
} from "../../types/digimon-fandom.types";

class DigivolutionSimulator {
  //Un digimon (de type "Digimon") contient, en plus de ses infos détaillés, tout son arbres personnellement de digivolution.
  //Attention, cette arbre n'est pas défini totalement au tout début. Il se met à jour petit à petit à chaque digivolution.
  async getNewDigimon(): Promise<Digimon | undefined> {
    const newFreshLevelBaseDigimon = await this.getRandomBaseDigimonByLevel(
      "Fresh_level"
    );

    const digimonDetails =
      await digimonFandomDetailsHandlerService.getDigimonDetails(
        newFreshLevelBaseDigimon.name
      );
    if (!digimonDetails) {
      return;
    }

    const digimon: Digimon = {
      currForm: digimonDetails,
      digivolutions: [digimonDetails],
    };

    return digimon;
  }

  private async getRandomBaseDigimonByLevel(
    level: string
  ): Promise<BaseDigimon> {
    const digimonsOfLevel =
      await digimonFandomLevelHandlerService.getBaseDigimonsByLevel(level);

    const min = 0;
    const max = digimonsOfLevel.length - 1;

    const randomBaseDigimonIndex = mathService.getRandomIntInclusive(min, max);
    const randomBaseDigimon = digimonsOfLevel[randomBaseDigimonIndex];

    return randomBaseDigimon;
  }

  /**
   * Digivolve le digimon à la prochaine évolution.
   * Si le digimon n'a pas encore enregistré sa prochaine forme,
   * on sélectionne une digivolution parmi les formes disponible dans "nextForm".
   * Sinon, il prend la digivolution à l'index suivant sa forme actuel dans "digivolution".
   * @param digimon
   * @returns
   */
  async setDigimonToNextDigivolution(digimon: Digimon): Promise<void> {
    const { currForm, digivolutions } = digimon;

    const indexOfCurrForm = digivolutions.findIndex(
      (digivolution) => digivolution.name === currForm.name
    );
    const nextForm: DigimonDetails | undefined =
      digivolutions[indexOfCurrForm + 1];

    if (nextForm) {
      digimon.currForm = nextForm;
      return;
    }

    const { nextForms } = currForm;
    const nextFormsLength = nextForms.length;

    const hasNoNextForms = nextFormsLength === 0;
    if (hasNoNextForms) {
      return;
    }

    const indexOfNewNextFormName = mathService.getRandomIntInclusive(
      0,
      nextFormsLength - 1
    );
    const newNextFormName = nextForms[indexOfNewNextFormName];

    const newNextForm =
      await digimonFandomDetailsHandlerService.getDigimonDetails(
        newNextFormName
      );
    if (!newNextForm) {
      return;
    }

    digimon.currForm = newNextForm;
    digimon.digivolutions.push(newNextForm);
  }
}
export default new DigivolutionSimulator();
