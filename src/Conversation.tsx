import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Divider,
  IconButton,
  Typography,
  TextField,
  Stack,
  Button,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useDialogs } from '@toolpad/core/useDialogs';
import {
  Menu as MenuIcon,
  Create as CreateIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Send as SendIcon,
  FavoriteBorderTwoTone as FavoriteBorderTwoToneIcon,
  FavoriteTwoTone as FavoriteTwoToneIcon,
} from '@mui/icons-material';
import { usePersonaContext } from './context/PersonaContext';
import { common } from '@mui/material/colors';

const drawerWidth = 240;

interface Message {
  id?: number;
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
  const { id: personaID } = useParams<{ id: string }>(); // URLからペルソナIDを取得
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { archive } = usePersonaContext();
  console.log(personaID);
  
  console.log(archive);
  
  const dialogs = useDialogs();

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

  // 初回レンダリング時に会話履歴を取得
  React.useEffect(() => {
    const fetchMessages = async () => {
      const initialMessages = await getMessages();
      setMessages(initialMessages);
    };

    fetchMessages();
  }, [personaID]);

  const getMessages = async (): Promise<Message[]> => {
    try {
      const response = await fetch(`http://localhost:30000/conversation/${personaID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('成功：', data);

        // プロパティ名を変換
        const transformedData = data.map((msg: any) => ({
          id: msg.id,
          userID: msg.user_id,
          personaID: msg.persona_id,
          comment: msg.comment,
          isUserComment: msg.is_user_comment,
          good: msg.good,
        }));

        return transformedData;
      } else {
        console.error('エラー：データの取得に失敗しました');
        return [];
      }
    } catch (error) {
      console.error('通信エラー:', error);
      return [];
    }
  };

  const postMessage = async (messageContent: string): Promise<Message | null> => {
    try {
      const response = await fetch(`http://localhost:30000/conversation/${personaID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: messageContent }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('成功：', data);

        // プロパティ名を変換
        const transformedMessage: Message = {
          id: data.id,
          userID: data.user_id,
          personaID: data.persona_id,
          comment: data.comment,
          isUserComment: data.is_user_comment,
          good: data.good,
        };

        return transformedMessage; // サーバーからのAIの返信を返す
      } else {
        console.error('エラー：データの取得に失敗しました');
        return null;
      }
    } catch (error) {
      console.error('通信エラー:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      const newMessage: Message = {
        userID: 1,
        personaID: Number(personaID),
        comment: message,
        isUserComment: true,
        good: false,
      };

      // ユーザーのメッセージを表示
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      // サーバーにメッセージを送信し、AIからの返信を取得
      const aiResponse = await postMessage(message);

      // AIからのメッセージを表示
      if (aiResponse) {
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        window.location.reload();
      }
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
            {personaID !== undefined && parseInt(personaID) < archive.length + 1 && (
              <>
                {archive[parseInt(personaID)-1].name}さん　　{archive[parseInt(personaID)-1].problems}
              </>
            )}
          </Typography>

          <CreateIcon
          onClick={async () => {
            // ダイアログを表示し、ユーザーに「要件定義書を作成しますか？」と質問
            const confirmed = await dialogs.confirm('要件定義書を作成しますか?', {
              okText: 'はい',
              cancelText: 'いいえ',
            });
            
            if (confirmed) {
              // messagesからisUserCommentがfalseでgoodがtrueのメッセージをフィルタリング
              const selectedMessages = messages.filter((msg: Message) => !msg.isUserComment && msg.good);
              
              // フィルタされたメッセージをPOSTデータとして構成
              const postData = selectedMessages.map((msg) => ({
                comment: msg.comment,
                userID: msg.userID,
                personaID: msg.personaID,
              }));
              
              console.log(postData);
              
              // データをPOSTする処理
              try {
                const response = await fetch(`http://localhost:30000/document`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(postData),
                });
                
                if (response.ok) {
                  await dialogs.alert('要件定義書の作成に成功しました！');
                  console.log(response);
                } else {
                  await dialogs.alert('要件定義書の作成に失敗しました');
                }
              } catch (error) {
                await dialogs.alert('通信エラーが発生しました');
              }
            } else {
              await dialogs.alert('要件定義書の作成をキャンセルしました');
            }
            }}
            />

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
            <ListItem key={item.id} disablePadding>
              <Link to={`/conversation/${item.id}`}>
                <ListItemButton>
                  <ListItemText color='black' primary={item.name} secondary={item.problems} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        {/* メッセージリスト */}
        <br/>
        <br/>
        <br/>
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
