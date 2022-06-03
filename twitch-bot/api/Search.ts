import axios from "axios";

export const SearchForSong = async (song: string) => {
    try {
        const { data } = await axios.get('http://localhost:4040/youtube', {params: {
            q: song
        }})
        return data;
    } catch(err) { console.log(err); }
};