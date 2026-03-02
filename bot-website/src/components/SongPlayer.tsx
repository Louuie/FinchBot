import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
  Link,
  Slider,
  Stack,
  useTheme,
  IconButton
} from "@mui/material";
import axios from "axios";
import * as React from "react"
import {
  WatchLater,
  Person,
  VolumeDown,
  VolumeUp,
  FastForwardRounded,
  PauseRounded,
  PlayArrowRounded
} from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import YouTube from "react-player/youtube";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { SongArray, Songs } from "../interfaces/Songs";
import '../styles/YoutubePlayer.css';
import { deleteSong, formatDuration, onSongEnd } from "../api/api";
import { Streamer } from "../interfaces/Streamer";

type Props = Songs & SongArray & Streamer;

export const SongPlayer: React.FC<Props> = (props) => {
  const { Title, Artist, DurationInSeconds, Id, Userid, Videoid } = props as Songs;
  const { songs } = props as SongArray;
  const { Streamer } = props as Streamer;

  const [showSpinner, setShowSpinner] = React.useState(true);
  const [showPlayer, setShowPlayer] = React.useState(true);
  const [paused, setPaused] = React.useState(true);
  const videoRef = React.useRef<YouTube>(null);
  const [volume, setVolume] = React.useState<number>(30);
  const [position, setPosition] = React.useState(0);
  const theme = useTheme();

  React.useEffect(() => {
    setShowPlayer(false);
    setShowSpinner(true);
    if (songs.length === 0) {
      setTimeout(() => setShowSpinner(false), 850);
    } else {
      setTimeout(() => {
        setShowPlayer(true);
        setShowSpinner(false);
      }, 650);
    }
  }, [Title, Videoid, Artist, DurationInSeconds, Userid, Id]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const onReady = () => {
    const internalPlayer = videoRef.current?.getInternalPlayer();
    internalPlayer?.addEventListener('onVolumeChange', function (event: any) {
      setVolume(event.data.volume)
    }, false);
  }

  return (
    <Container maxWidth={false} sx={{ mt: 3, backgroundColor: '#1e1e1e', borderRadius: 2, py: 2 }}>
      <Typography variant="h5" fontWeight={600} color="#fff" ml={2} mb={2}>Current Song</Typography>
      <Box px={2}>
        {showSpinner ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="success" />
          </Box>
        ) : showPlayer && Videoid ? (
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <IconButton onClick={() => setPaused(!paused)}>
                {paused ? <PlayArrowRounded fontSize="large" /> : <PauseRounded fontSize="large" />}
              </IconButton>
              {songs.length > 1 && (
                <IconButton onClick={() => deleteSong(Streamer, Id, Title)}>
                  <FastForwardRounded fontSize="large" />
                </IconButton>
              )}
              <Typography color="#ccc">{formatDuration(position)}</Typography>
              <Slider
                min={0}
                max={DurationInSeconds}
                value={position}
                onChange={(_, value) => {
                  setPosition(value as number);
                  videoRef.current?.seekTo(value as number);
                }}
                sx={{ flex: 1, mx: 2 }}
              />
              <Typography color="#ccc">-{formatDuration(DurationInSeconds - position)}</Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <VolumeDown htmlColor="#ccc" />
              <Slider
                value={volume}
                onChange={handleChange}
                size="small"
                sx={{ maxWidth: 200 }}
              />
              <VolumeUp htmlColor="#ccc" />
            </Stack>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start">
              <YouTube
                className="youtubePlayer"
                url={`https://www.youtube.com/watch?v=${Videoid}`}
                ref={videoRef}
                onReady={onReady}
                controls
                playing={!paused}
                volume={volume / 100}
                onEnded={() => { onSongEnd(Streamer, Id); setShowSpinner(true); setTimeout(() => setShowSpinner(false), 3250); }}
                onProgress={({ playedSeconds }) => setPosition(Math.round(playedSeconds))}
              />

              <Box ml={3} mt={1} color="#ccc">
                <Typography variant="h6" fontWeight={600}>{Title}</Typography>
                <Typography variant="body2"><WatchLater fontSize="small" sx={{ mr: 1 }} />{formatDuration(DurationInSeconds)}</Typography>
                <Typography variant="body2"><LinkIcon fontSize="small" sx={{ mr: 1 }} /><Link href={`http://youtu.be/${Videoid}`} target="_blank" rel="noopener" color="inherit">{`http://youtu.be/${Videoid}`}</Link></Typography>
                <Typography variant="body2"><Person fontSize="small" sx={{ mr: 1 }} />{Userid}</Typography>
                <Box display="flex" alignItems="center" mt={1} sx={{ cursor: 'pointer' }} onClick={() => window.open('https://youtube.com') }>
                  <YouTubeIcon fontSize="medium" color="error" />
                  <Typography variant="body2" ml={0.5} color="error.main">Powered by YouTube</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Alert severity="error">Song Queue is Empty</Alert>
        )}
      </Box>
    </Container>
  )
}
