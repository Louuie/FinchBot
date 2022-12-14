import {
  Drawer,
  IconButton,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

interface Streamer {
  name: string;
}

export const DrawerMenu: React.FC<Streamer> = ({name}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
      <Drawer
      PaperProps={{
        sx: {
          backgroundColor: '#0E0F0F'
        }
      }}
        anchor="left"
        variant="permanent"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div className=" w-60 text-center text-gray-200">
            <div className="text-2xl font-bold">{name}</div>
          <ListItemButton component="a" href={`${name}/song-requests`}>
            <ListItemText primary="Song Requests" />
          </ListItemButton>
          <ListItemButton component="a" href={`${name}/commands`}>
            <ListItemText primary="Commands" />
          </ListItemButton>
        </div>
      </Drawer>
  );
};