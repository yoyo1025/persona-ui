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
  LinearProgress,
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
  FavoriteTwoTone as FavoriteTwoToneIcon
} from '@mui/icons-material';
import { usePersonaContext } from './context/PersonaContext';
import ReactMarkdown from 'react-markdown';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


const drawerWidth = 240;

interface Message {
  id?: number;
  userID: number;
  personaID: number;
  comment: string;
  isUserComment: boolean;
  good: boolean;
}

interface ConversationProps {
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  mode: 'light' | 'dark';
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

export default function Conversation({ setMode, mode }: ConversationProps) {
  const { id: personaID } = useParams<{ id: string }>(); // URLからペルソナIDを取得
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { archive } = usePersonaContext();
  const [generateDocument, setGenerateDocument] = React.useState<boolean>(false);
  const [openDocumentDialog, setOpenDocumentDialog] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState('');
  const [copySuccess, setCopySuccess] = React.useState('');


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

  const handleDocumentProgress = () => {
    setGenerateDocument(true);
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
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            color="inherit"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <CreateIcon
            onClick={async () => {
              const confirmed = await dialogs.confirm('要件定義書を作成しますか?', {
                okText: 'はい',
                cancelText: 'いいえ',
              });

              if (confirmed) {
                handleDocumentProgress(); // Start progress bar

                // Prepare data for API call
                const selectedMessages = messages.filter(
                  (msg: Message) => !msg.isUserComment && msg.good
                );
                const postData = selectedMessages.map((msg) => ({
                  comment: msg.comment,
                  userID: msg.userID,
                  personaID: msg.personaID,
                }));

                try {
                  const response = await fetch(`http://localhost:30000/document`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                  });

                  // Stop progress bar after API call
                  setGenerateDocument(false);

                  if (response.ok) {
                    const data = await response.json();
                    const markdownDocument = data.document;
                    setDocumentContent(markdownDocument);
                    setOpenDocumentDialog(true);
                  } else {
                    await dialogs.alert('要件定義書の作成に失敗しました');
                  }
                } catch (error) {
                  setGenerateDocument(false);
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
            <Link
              to={`/conversation/${item.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }} // 下線を消し、色を継承
            >
              <ListItemButton sx={{ color: 'text.primary' }}> 
                <ListItemText
                  primary={item.name}
                  secondary={item.problems}
                  sx={{ color: 'inherit' }} // 継承することで、リンクと同じ色を使用
                />
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
        {/* Show progress bar when generating document */}
        {generateDocument && (
          <Box sx={{ width: '100%', marginBottom: '20px' }}>
            要件定義書作成中
            <LinearProgress />
          </Box>
        )}
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
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '60%',
                  bgcolor: msg.isUserComment
                    ? 'primary.main'
                    : theme.palette.mode === 'light'
                    ? 'grey.300'
                    : 'grey.700', // Adjusted for dark mode
                  color: msg.isUserComment ? 'primary.contrastText' : 'text.primary',
                  p: 1.8, // Increased padding
                  borderRadius: 4, // Increased border radius
                  wordBreak: 'break-word',
                  fontFamily: 'Arial, sans-serif', // Set font family
                  fontSize: '1rem', // Adjust font size if needed
                  fontWeight: 600,
                  transition: 'background-color 0.3s', // 色の変更にアニメーションを付与
                  '&:hover': {
                    bgcolor: msg.isUserComment
                      ? 'primary.dark' // ユーザーコメントのhover時の背景色
                      : theme.palette.mode === 'light'
                      ? 'grey.400' // システムコメントのhover時の背景色（ライトモード）
                      : 'grey.600', // システムコメントのhover時の背景色（ダークモード）
                  },
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
            </Button>
          </Stack>
        </Box>
      </Main>
      <Dialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        maxWidth={false}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '80%',
            maxWidth: 'none',
          },
        }}
      >
        <DialogTitle>要件定義書</DialogTitle>
        <DialogContent dividers sx={{ userSelect: 'text' }}>
          <ReactMarkdown>{documentContent}</ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(documentContent);
              setCopySuccess('コピーしました！'); // Feedback after copy
            }}
            color="secondary"
          >
            コピー
          </Button>
          {copySuccess && (
            <Typography sx={{ ml: 2, color: 'green' }}>
              {copySuccess}
            </Typography>
          )}
          <Button onClick={() => setOpenDocumentDialog(false)} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
