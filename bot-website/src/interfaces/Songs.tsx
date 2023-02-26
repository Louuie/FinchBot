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
  
  
 export interface SongArray {
    songs: Songs[],
  }
  