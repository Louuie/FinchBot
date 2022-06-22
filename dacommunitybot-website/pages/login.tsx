import { NextPage } from "next";
import { Button } from '@mui/material';

const Login: NextPage = () => {
    const onLogin = async () => {
        const authUri = `https://id.twitch.tv/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=wtaln1ogegdpmq0cw7x1mxw1nmwpsx` +
        `&redirect_uri=http://localhost:3000/auth/callback` +
        `&scope=openid user_read&`
        const code = await getCode(authUri);
        console.log(code);
    }

    const getCode = (uri : string) => {
        return new Promise((resolve, reject) => {
            const authWindow = window.open(
                uri,
                "_blank_",
                "toolbar=yes,scrollbar=yes,resizable=yes,width=800,height=700"
            );
            let url : string | null;
            setInterval(async () => {
                try {
                  url = authWindow && authWindow.location && authWindow.location.search;
                } catch (e) {}  
                if (url) {
                  const url = authWindow?.location.search.substring(6);
                  const formattedCode = url?.slice(0, 30);
                  authWindow!.close();
                  resolve(formattedCode);
                }
              }, 500);
        })
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="mb-20">
                <div className='text-center font-bold text-3xl'>DaCommunityBot</div>
                <div className="mt-4 w-80 h-40 rounded-md bg-gray-900 text-center">
                    <div className="flex">
                        <div className="mt-4 text-md">Welcome to the DaCommunityBot! Please Login to get Started!</div>
                    </div>
                    <Button variant="contained" className="mt-4 bg-[#772CE8] hover:bg-[#620be4]" onClick={onLogin}>Log in with Twitch</Button>
                </div>
            </div>
        </div>
    )
}

export default Login