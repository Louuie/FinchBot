import { Alert, Box, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import * as React from "react"
import { WatchLater, Link, Person } from "@mui/icons-material";
import YouTube from "react-youtube";
import { Songs } from "../interfaces/Songs";




export const SongPlayer: React.FC = () => {


  // State variable used for songs?
  const [firstSong, setFirstSong] = React.useState<Songs | null>(null);
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [showPlayer, setShowPlayer] = React.useState(true);

  // Setting the options for the YouTube Video Player.
  const youtubeOpts = {
    height: '250',
    width: '380',
    playerVars: {
      autoplay: 1,
    }
  };

  // useEffect that fetches the videoID of the Song/Video in the first position.
  React.useEffect(() => {
    const fetchSong = setInterval(() => {
      axios.get('http://localhost:3030/songs', {
        params: {
          channel: 'louiee_tv'
        }
      }).then((res) => { setFirstSong(res.data.songs[0]); console.log('data', firstSong); if (firstSong === undefined) { setShowPlayer(false); } else setShowPlayer(true); }).catch((err) => setShowPlayer(false))
    }, 3000);
    return () => clearInterval(fetchSong)

    // 
  }, [firstSong]);

  // useEffect that sets the Spinner to stop showing/displaying after 1000ms
  React.useEffect(() => {
    setTimeout(() => setShowSpinner(false), 3000);
  }, []);


  // onEnd function that deletes the song/video that was playing that has "just ended".
  const onSongEnd = (songID: number | undefined): void => {
    axios.get('http://localhost:3030/song-request-delete', {
      params: {
        channel: 'Louiee_tv',
        id: songID,
      }
    }).then((res) => (console.log(res.data))).catch((err) => console.log(err));
  }

  return (
    <Container className="bg-[#2f2e2e] mt-9 w-[100rem] h-full" maxWidth={false}>
      <div className='flex flex-1 mt-4 ml-2 font-bold text-lg'>Current Song</div>
      <hr className="mb-8" />
      <div>
        {showSpinner ? 
        <Box className="flex flex-col justify-center items-center">
          <CircularProgress/>
        </Box> 
        :
          <div>
            {showPlayer ?
              <div className='flex flex-1 mb-20 px-2'>
                <YouTube videoId={firstSong?.Videoid} opts={youtubeOpts} onEnd={() => {onSongEnd(firstSong?.Id); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 3250)}} />
                <div className='flex flex-col ml-2 h-1'>
                  <a className='font-bold text-lg'>{firstSong?.Title}</a>
                  <div className='flex flex-1'>
                    <WatchLater fontSize="small" className='mt-[1px]' />
                    <a className='px-1 text-sm'>{firstSong?.Duration}</a>
                  </div>
                  <div className='flex flex-1 py-2'>
                    <Link fontSize="small" className='mt-[2px]' />
                    <a href={`http://youtu.be/${firstSong?.Videoid}`}>{`http://youtu.be/${firstSong?.Videoid}`}</a>
                  </div>
                  <div className='flex'>
                    <Person fontSize="small" className='mt-[3px]' />
                    <a>{firstSong?.Userid}</a>
                  </div>
                </div>
              </div>
              :
              <div className="flex flex-col mb-[24rem]">
                <Alert severity="error">Song Queue is Empty</Alert>
              </div>
            }
          </div>
        }
        </div>
    </Container>
  )
}