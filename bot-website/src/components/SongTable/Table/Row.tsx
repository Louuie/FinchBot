import { Songs } from "../../../interfaces/SongInterface";

export function Row ({Artist, Duration, Id, Title, Userid, Videoid}: Songs) {
    return (
      <tr>
        <td>{Id}</td>
        <td>{Title}</td>
        <td>{Artist}</td>
        <td>{Userid}</td>
        <td>{Duration}</td>
        <td>{Videoid}</td>
      </tr>
    )
  }