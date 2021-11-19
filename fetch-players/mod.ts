// headers needed for the nba api, per the python library on github
const headers =
{
  'cache-control': 'no-cache',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Referer: 'https://stats.nba.com/',
  Connection: 'keep-alive',
  'x-nba-stats-token': 'true',
  'x-nba-stats-origin': 'stats',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-Us, en;q=0.5',
  Accept: 'application/json, text/plain, */*',
  Host: 'stats.nba.com'
};

class PlayerInfo {
  id: number;
  firstName: string;
  lastName: string;
  fromYear: Date;
  toYear: Date;

  birthdate: Date;
  country: string;
  school: string;
  height: string;
  weight: number;
  seasonsPlayed: number;
  jerseyNumber: number;
  position: string;
  teamName: string;
  teamId: number;
  draftYear: Date;
  draftRound: number;
  draftNumber: number;
  greatest75: boolean;

  constructor(playerInfo: any) {
    this.id = playerInfo[0];
    this.firstName = playerInfo[1];
    this.lastName = playerInfo[2];

    this.birthdate = new Date(playerInfo[7]);
    this.school = playerInfo[8];
    this.country = playerInfo[9];
    this.height = playerInfo[11];
    this.weight = parseInt(playerInfo[12]);
    this.seasonsPlayed = playerInfo[13];
    this.jerseyNumber = parseInt(playerInfo[14]);
    this.position = playerInfo[15];

    this.teamId = playerInfo[18];
    this.teamName = playerInfo[19];

    this.fromYear = playerInfo[24];
    this.toYear = playerInfo[25];
    this.draftYear = new Date(playerInfo[29]);
    this.draftRound = parseInt(playerInfo[30]);
    this.draftNumber = parseInt(playerInfo[31]);
    this.greatest75 = playerInfo[32] == 'Y';
  }
}

// The basic play info that is returned from the all players
// endpoint. Just use this to filter our player set and then get the full
// player info
class BasicPlayerInfo {
  id: number;
  fromYear: number;
  toYear: number;

  constructor(playerInfo: any) {
    this.id = playerInfo[0];
    this.fromYear = playerInfo[4];
    this.toYear = playerInfo[5];
  }
}

// The shape of the response from the nba stats api
interface ApiResponse {
  resource: string,
  parameters: object,
  resultSets: Array<{
    name: string,
    headers: Array<any>,
    rowSet: Array<any>
  }>
}

const allPlayersUrl = 'https://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2010-22';

async function fetchPlayers(): Promise<Array<PlayerInfo>> {
  return await fetch(allPlayersUrl, { headers: headers })
    .then(response => response.json())
    .then(json => (<ApiResponse>json).resultSets[0].rowSet)
    .then(allPlayersJson => allPlayersJson.map(player => new BasicPlayerInfo(player)).filter(p => p.fromYear >= 1996))
    .then(players => Promise.all(players.map(p => fetchPlayerInfo(p.id))));
}

async function fetchPlayerInfo(id: number): Promise<PlayerInfo> {
  const playerInfoUrl = `https://stats.nba.com/stats/commonplayerinfo?PlayerID=${id}`;
  // const resp = await fetch(playerInfoUrl, { headers: headers });
  // console.log(resp.json());
  return await fetch(playerInfoUrl, { headers: headers })
    .then(response => response.json(), console.log)
    .then(json => (<ApiResponse>json).resultSets[0].rowSet)
    .then(playerInfoJson => new PlayerInfo(playerInfoJson));
}

// fetchPlayers().then(p => console.log(p));
