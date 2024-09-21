import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';

const drawerWidth = 240;

const archive = [
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
  {
    name: "○○さん",
    problem: "△△で困っている",
  },
];

interface Message {
  userID: number;
  personaID: number;
  comment: string;
  isUserComment: boolean;
  good: boolean;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: `-${drawerWidth}px`,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100vh',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Conversation() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      userID: 1,
      personaID: 1,
      comment:
        "こんにちは、私の名前は山田勇作です。30歳でプロのエンジニアとして働いています。平日は仕事に励み、その後の自由な時間にはプログラミングを学習することが多いのですが、最近は上達している実感がなく、そのためにモチベーションが続かないという悩みがあります。一日の終わりには疲れてすぐに寝てしまうこともしばしば。休日は家族と過ごす時間を大切にしています。新たなスキルを習得するため、プログラミング学習のモチベーションを保つ方法を見つけたいと考えています。よろしくお願いいたします。",
      isUserComment: false,
      good: true,
    },
  ]);
  const handleFavoClick = (index: number) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, good: !msg.good } : msg
    );
    setMessages(updatedMessages);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage: Message = {
        userID: 1,
        personaID: 1,
        comment: message,
        isUserComment: true,
        good: false,
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // ここでバックエンドにリクエストを送信し、AIからの返信を取得します
      // 今回はサンプルとして固定の返信を追加します
      const aiResponse: Message = {
        userID: 1,
        personaID: 1,
        comment: 'ご質問ありがとうございます。詳しくお聞かせいただけますか？',
        isUserComment: false,
        good: false,
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }
  };

  // メッセージが追加されたときにスクロール位置を一番下に移動
  React.useEffect(() => {
    const messageList = document.getElementById('messageList');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Shiftキーが押されていない場合は送信
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            ○○さん　　　　△△で困っている
          </Typography>
          <CreateIcon />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* 履歴の表示 */}
        <List>
          {archive.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemText primary={item.name} secondary={item.problem} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        {/* メッセージリスト */}
        <br/>
        <br />
        <Box
          id="messageList"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            width: '100%',
            padding: 2,
            boxSizing: 'border-box',
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.isUserComment ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: '60%',
                  bgcolor: msg.isUserComment ? 'primary.main' : 'grey.300',
                  color: msg.isUserComment ? 'primary.contrastText' : 'black',
                  p: 1,
                  borderRadius: 3,
                  wordBreak: 'break-word',
                }}
              >
                {msg.comment}
              </Box>
              {!msg.isUserComment && (
            <IconButton onClick={() => handleFavoClick(index)}>
              {msg.good ? (
                <FavoriteTwoToneIcon color="secondary" />
              ) : (
                <FavoriteBorderTwoToneIcon />
              )}
            </IconButton>
          )}
            </Box>
          ))}
        </Box>
        {/* メッセージ入力フィールドと送信ボタン */}
        <Box sx={{ width: '100%', p: 2, boxSizing: 'border-box' }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="メッセージを入力"
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                sx: {
                  borderRadius: '20px',
                },
              }}
            />
            <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
              送信
            </Button>
          </Stack>
        </Box>
      </Main>
    </Box>
  );
}