import {
  Drawer,
  IconButton,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

export const DrawerMenu: React.FC = () => {
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
            <div className="text-2xl font-bold">Chenzo</div>
          <ListItemButton component="a" href="/chenzo/song-request">
            <ListItemText primary="Song Requests" />
          </ListItemButton>
          <ListItemButton component="a" href="/chenzo/commands">
            <ListItemText primary="Commands" />
          </ListItemButton>
        </div>
      </Drawer>
  );
};