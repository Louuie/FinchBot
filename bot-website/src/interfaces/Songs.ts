export interface Songs {
    Artist: string, 
    DurationInSeconds: number,
    Id: number,
    Title: string,
    Userid: string,
    Videoid: string,
    Position: number,
  }

  export interface SongsTable {
    Artist: string, 
    Duration: number,
    Id: string,
    Title: string,
    Userid: string,
    Videoid: string,
  }

  export interface SongEntry {
    name: string,
    artist: string, 
    position: number,
  }
  
  
 export interface SongArray {
    songs: Songs[],
  }



  