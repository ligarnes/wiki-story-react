import {atom, selector} from "recoil";
import {emptyWikiInfo, Player, WikiInfo} from "../model/v2/Wiki";
import {serviceLocatorAtom} from "./ServiceLocatorAtom";
import {GM_GROUP, PLAYERS_GROUP} from "../model/v2/Permission";

export const wikiNeedRefreshAtom = atom<boolean>({
  key: 'wikiNeedRefresh',
  default: true,
});

export const wikiIdAtom = atom<string>({
  key: 'wikiIdAtom',
  default: "",
});

export const wikiAtom = atom<WikiInfo>({
  key: 'wikiAtom',
  default: emptyWikiInfo(),
});

export interface Group {
  name: string,
  members: Player[],
  invitationLink?: string,
  validUntil?: string
}

export const currentPlayerSelector = selector<Player>({
    key: 'currentPlayerSelector',
    get: ({get}) => {
      const wiki = get(wikiAtom);
      const serviceLocator = get(serviceLocatorAtom);
      if (serviceLocator) {
        const userId = serviceLocator.loginService.getUserId();

        let player = wiki.players.find(player => player.userId === userId);
        if (!player) {
          player = {name: "unknown", group: "none", userId: "userId"}
        }

        return player;
      }
      return {name: "unknown", group: "none", userId: "userId"};
    },
  }
);

export const groupsSelector = selector<Group[]>({
    key: 'groupsSelector',
    get: ({get}) => {
      const wiki = get(wikiAtom);

      const groups = [{name: GM_GROUP, members: []}, {name: PLAYERS_GROUP, members: []}] as Group[];

      wiki.players.forEach(player => {
        let currentGroup = groups.find(grp => grp.name === player.group);
        if (!currentGroup) {
          currentGroup = {name: player.group, members: []}
          groups.push(currentGroup);
        }
        currentGroup.members.push(player);
      });

      wiki.invitationLinks.forEach(invitation => {
        const group = groups.find(grp => grp.name === invitation.group);
        if (group) {
          group.invitationLink = invitation.key;
          group.validUntil = invitation.validUntil;
        }
      })

      return groups;
    },
  }
);