const allPlayersUrl = 'https://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2010-22';

const headers =
{
  'Postman-Token': '3b6b2aea-3cdc-476c-97fc-5b38aba78ff7',
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
  fromYear: number;
  toYear: number;

  constructor(playerInfo: any) {
    this.id = playerInfo[0];
    const commaSeparatedName = playerInfo[1];
    [this.lastName, this.firstName] = commaSeparatedName.split(',');
    this.fromYear = playerInfo[4];
    this.toYear = playerInfo[5];
  }
}

interface PlayerInfoResponse {
  resultSets: Array<{
    name: string,
    headers: Array<any>,
    rowSet: Array<any>
  }>
}

async function fetchPlayers(): Promise<Array<PlayerInfo>> {
  return await fetch(allPlayersUrl, { headers: headers })
    .then(response => response.json())
    .then(json => (<PlayerInfoResponse>json).resultSets[0].rowSet)
    .then(allPlayersJson => allPlayersJson.map(player => new PlayerInfo(player)))
}


export const getPlayersSince96 = async () => {
  const players = await fetchPlayers();
  console.log(players);

  return players.filter(p => p.fromYear >= 1996);
}


//getPlayersSince96().then(console.log)
