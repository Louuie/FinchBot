import { Alert, Box, CircularProgress, Container, Typography, Link } from "@mui/material";
import axios from "axios";
import * as React from "react"
import { WatchLater, Person } from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import YouTube from "react-youtube";
import { SongArray, Songs } from "../interfaces/Songs";




export const SongPlayer: React.FC<Songs> = ({Id, Videoid, Title, Artist, Duration, Userid}) => {


  // State variable used for songs?
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
    setShowPlayer(false); setShowSpinner(true);
    console.log(Title);
    if (Title === '' || Title === undefined) { setShowPlayer(false); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 550); } else setShowPlayer(true);
    if (Title !== undefined) setTimeout(() =>  { setShowPlayer(true); setShowSpinner(false); }, 250);
  }, [Title, Videoid, Artist, Duration, Userid, Id]);

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
    <Container className="bg-[#1E1E1E] mt-9 w-full h-[10rem] md:h-[30rem] md:mx-[2rem] hidden md:block" maxWidth={false}>
      <Typography className="mt-4 ml-2 font-bold" variant="h6">Current Song</Typography>
      <hr className="mb-8" />
      <div>
        {showSpinner ? 
        <Box className="flex flex-col justify-center items-center">
          <CircularProgress color="success"/>
        </Box> 
        :
          <div>
            {showPlayer ?
              <div className='flex flex-1 mb-20 px-2'>
                <YouTube videoId={Videoid} opts={youtubeOpts} onEnd={() => {onSongEnd(Id); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 3250)}} />
                <div className='flex flex-col ml-2 h-1'>
                  <Typography variant="h6" className="font-bold">{Title}</Typography>
                  <div className='flex flex-1'>
                    <WatchLater fontSize="small" className='mt-[4px] mr-1' />
                    <Typography variant="subtitle1">{Duration}</Typography>
                  </div>
                  <div className='flex flex-1 py-2'>
                    <LinkIcon fontSize="small" className='mt-[2px]' />
                    <Link className="ml-1" href={`http://youtu.be/${Videoid}`}>{`http://youtu.be/${Videoid}`}</Link>
                  </div>
                  <div className='flex'>
                    <Person fontSize="small" className='mt-[3px]' />
                    <Typography variant="subtitle1">{Userid}</Typography>
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