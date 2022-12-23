import { SongArray, Songs } from "../interfaces/SongInterface"



export const SongTable: React.FC<SongArray> = ({data}) => {
    return (
        <div>{data.map((song: Songs) => <div>{song.Title}</div>)}</div>
    )
}