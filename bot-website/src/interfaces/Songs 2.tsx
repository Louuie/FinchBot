export interface Songs {
    Artist: string, 
    Duration: number,
    Id: number,
    Title: string,
    Userid: string,
    Videoid: string,
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
  