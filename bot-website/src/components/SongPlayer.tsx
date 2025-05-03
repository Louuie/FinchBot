import { Alert, Box, CircularProgress, Container, Typography, Link, Slider, Stack, useTheme, IconButton } from "@mui/material";
import axios from "axios";
import * as React from "react"
import { WatchLater, Person, VolumeDown, VolumeUp, FastForwardRounded, FastRewindRounded, PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import YouTube from "react-player/youtube";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { SongArray, Songs } from "../interfaces/Songs";
import '../styles/YoutubePlayer.css';
import { deleteSong, formatDuration, onSongEnd } from "../api/api";
import { Streamer } from "../interfaces/Streamer";



type Props = Songs & SongArray & Streamer;

export const SongPlayer: React.FC<Props> = (props) => {


  // Getting props
  const { Title, Artist, DurationInSeconds, Id, Userid, Videoid } = props as Songs;
  const { songs } = props as SongArray;
  const { Streamer } = props as Streamer;
  // State variable used for songs?
    const [showSpinner, setShowSpinner] = React.useState(true);
  const [showPlayer, setShowPlayer] = React.useState(true);

  // State variables for song player
  const [paused, setPaused] = React.useState(true);

  // Video Player ref
  const videoRef = React.useRef<YouTube>(null);

  // useEffect that fetches the videoID of the Song/Video in the first position.
  React.useEffect(() => {
    setShowPlayer(false); setShowSpinner(true);
    if (songs.length === 0) { setShowPlayer(false); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 850); }
    if (songs.length > 0) setTimeout(() => { setShowPlayer(true); setShowSpinner(false); }, 650);
    console.log(volume);
  }, [Title, Videoid, Artist, DurationInSeconds, Userid, Id]);

  // useEffect that sets the Spinner to stop showing/displaying after 1000ms
  React.useEffect(() => {
    setTimeout(() => setShowSpinner(false), 3000);
  }, []);


  const [volume, setVolume] = React.useState<number>(30);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };
  const theme = useTheme();
  const [position, setPosition] = React.useState(0);


  const onReady = () => {
    const internalPlayer = videoRef.current?.getInternalPlayer();
    console.log(internalPlayer);
    internalPlayer?.addEventListener('onVolumeChange', function (event: any) {
      setVolume(event.data.volume)
    }, false)

    
  }

  return (
    <Container className="bg-[#1E1E1E] mt-3 xxxl:mt-8 w-full h-[10rem] md:h-[10rem] lg:hidden xl:h-[23rem] xxl:h-[30rem] xxxl:h-[36rem] lg:mx-[2rem] xxl:mx-[2rem] xxxl:mx-[2rem] hidden xl:block xxl:block xxxl:block" maxWidth={false}>
      <Typography className="mt-4 ml-2 font-bold" variant="h4">Current Song</Typography>
      <hr className="mb-8" />
      <div>
        {showSpinner ?
          <Box className="flex flex-col justify-center items-center">
            <CircularProgress color="success" />
          </Box>
          :
          <div>
            {showPlayer ?
              <div className="lg:-mt-6 md:my-6">
                <div className="md:hidden xl:block xxl:block xxxl:block">
                  <Stack direction={'row'} spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'start',
                        mt: -1,
                      }}
                    >
                      <IconButton
                        aria-label={paused ? 'play' : 'pause'}
                        onClick={() => { setPaused(!paused); console.log(paused) }}
                      >
                        {!paused ? (
                          <PlayArrowRounded
                            sx={{ fontSize: '2.5rem' }}

                          />
                        ) : (
                          <PauseRounded sx={{ fontSize: '2.5rem' }} />
                        )}
                      </IconButton>
                      {songs.length <= 1 ? <div className="hidden"></div> :
                        <IconButton aria-label="next song" onClick={() => deleteSong(Streamer, Id,  Title)}>
                          <FastForwardRounded fontSize="large" />
                        </IconButton>
                      }
                    </Box>
                    <Typography className="xl:mt-[3.5px] xxl:mt-[2px] xxxl:mt-[2px]">{formatDuration(position)}</Typography>
                    <Slider
                      aria-label="time-indicator"
                      size="small"
                      value={position}
                      min={0}
                      step={1}
                      color="primary"
                      max={DurationInSeconds}
                      onChange={(_, value) => { setPosition(value as number); videoRef.current?.seekTo(value as number); }}
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#FF0000' : 'rgba(0,0,0,0.87)',
                        height: 4,
                        '& .MuiSlider-thumb': {
                          width: 8,
                          height: 8,
                          transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                          '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                          },
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                              ? 'rgb(255 255 255 / 16%)'
                              : 'rgb(0 0 0 / 16%)'
                              }`,
                          },
                          '&.Mui-active': {
                            width: 20,
                            height: 20,
                          },
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.28,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: -2,
                      }}
                    >
                      <Typography className="xl:mb-5 xxl:mb-5 xxxl:mb-5">-{formatDuration(DurationInSeconds - position)}</Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={2} direction="row" className="mb-2" alignItems="center">
                    <VolumeDown />
                    <Slider aria-label="Volume" defaultValue={volume} value={volume} onChange={handleChange} size="small" sx={{ color: theme.palette.mode === 'dark' ? '#FFF' : 'rgba(0,0,0,0.87)' }} />
                    <VolumeUp />
                  </Stack>
                </div>
                <div className='flex flex-1 md:my-10 px-4'>
                  <YouTube className="youtubePlayer" url={`https://www.youtube.com/watch?v=${Videoid}`} ref={videoRef} onReady={onReady} controls={true} playing={paused} volume={volume / 100} onEnded={() => { onSongEnd(Streamer, Id); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 3250) }} onProgress={(progress) => setPosition(Math.round(progress.playedSeconds))} />
                  <div className='flex flex-col lg:-my-4 xxxl:-my-6  ml-2 h-1'>
                    <Typography variant="h6" className="font-bold">{Title}</Typography>
                    <div className='flex flex-1'>
                      <WatchLater fontSize="small" className='mt-[4px] mr-1' />
                      <Typography variant="subtitle1">{formatDuration(DurationInSeconds)}</Typography>
                    </div>
                    <div className='flex flex-1 py-2'>
                      <LinkIcon fontSize="small" className='mt-[2px]' />
                      <Link className="ml-1" href={`http://youtu.be/${Videoid}`}>{`http://youtu.be/${Videoid}`}</Link>
                    </div>
                    <div className='flex'>
                      <Person fontSize="small" className='mt-[3px]' />
                      <Typography variant="subtitle1">{Userid}</Typography>
                    </div>
                    <div className="flex mr-4 py-2 hover:cursor-pointer" onClick={(() => window.open('https://youtube.com'))}>
                      <YouTubeIcon fontSize='medium' color="error" />
                      <Link color='error'>
                        <Typography className="ml-[0.5px]">Powered by YouTube</Typography>
                      </Link>
                    </div>
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